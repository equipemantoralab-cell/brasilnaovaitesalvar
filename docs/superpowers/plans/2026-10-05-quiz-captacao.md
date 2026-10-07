# Quiz de Captacao de Leads — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/quiz` lead-capture quiz with 8 questions, scoring, profile calculation, and Google Sheets logging to the existing Next.js landing page without touching any existing routes.

**Architecture:** A client-side state machine (`app/quiz/page.tsx`) drives four screens (intro → questions → lead capture → result). Shared Google Sheets auth is extracted to `lib/googleSheets.ts` and reused by both `app/api/leads/route.ts` (refactored, no behavior change) and the new `app/api/quiz-leads/route.ts`. All quiz content lives in `lib/quizData.ts`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, googleapis@144, React `useState`.

**Spec:** `SPEC_CLAUDE_QUIZ.md` and `QUIZ_COPY.md` (read both; the spec references the copy for exact question text and profile bodies).

## Global Constraints

- Do NOT modify `app/page.tsx`, `app/captura/`, `app/obrigado/`, `components/` (except as a pure import refactor in `app/api/leads/route.ts`).
- Colors: use only `bg-ink`, `text-lime`, `bg-lime`, `text-forest`, `bg-forest`, `bg-paper`, `bg-cream`, `text-cream`, `text-paper`, `border-cream/10`, `shadow-lime`, `shadow-card` — no new palette.
- Fonts: `font-display` (Barlow Condensed) for headlines/CTAs, `font-sans` (Manrope) for body.
- Button pattern (primary): `min-h-14 rounded-xl bg-lime px-6 py-4 font-display text-xl font-black uppercase tracking-wide text-ink shadow-lime transition duration-300 hover:-translate-y-1 hover:bg-sun`.
- Input pattern: `min-h-12 w-full rounded-xl border border-ink/15 bg-cream/50 px-4 py-3 text-base text-ink transition placeholder:text-ink/35 hover:border-emerald/50 focus:border-emerald focus:bg-paper focus:outline-none focus:ring-4 focus:ring-emerald/10`.
- Every visual hotspot for the next design pass must carry `// TODO: design` comment and a `data-*` attribute.
- Validation gate: `npm run build` (no test framework exists).
- Commit message: `feat: quiz de captacao de leads`.

## Review Focus

1. **Score boundary at exactly 7 (all `d` answers):** `getProfile(7)` must return Perfil 1, not fall through to the fallback.
2. **Q1 segmentation text stored but not scored:** score must remain 0 after answering Q1; `respostaSegmentacao` in the API payload must be the option text, not a point value.
3. **Double-click / double-answer on a question:** clicking two options quickly must only register the first answer and advance once.
4. **API failure non-blocking:** if `POST /api/quiz-leads` returns a non-2xx or throws, the quiz must still advance to the result screen.
5. **Missing Google Sheets env vars:** `appendToSheet` must log a warning and return without throwing when any of the three env vars are absent, so neither `/api/leads` nor `/api/quiz-leads` blocks the user.

---

## Task 1: Extract `lib/googleSheets.ts` + refactor `app/api/leads/route.ts`

**Files:**
- Create: `lib/googleSheets.ts`
- Modify: `app/api/leads/route.ts`

**Interfaces:**
- Consumes: `googleapis` (already in `package.json`), env vars `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`.
- Produces: `appendToSheet(range: string, values: (string | number)[][]): Promise<void>` — exported from `lib/googleSheets.ts`; used by Task 3 and the refactored `leads` route.

- [ ] **Step 1: Write `lib/googleSheets.ts`**

```typescript
// lib/googleSheets.ts
import { google } from 'googleapis';

/**
 * Appends rows to a Google Sheet range.
 * Logs a warning and returns (without throwing) when env vars are missing.
 * Throws on API errors — callers must wrap in try/catch.
 */
export async function appendToSheet(
  range: string,
  values: (string | number)[][]
): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
    console.warn('[googleSheets] env vars not configured — skipping sheet write');
    return;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values },
  });
}
```

- [ ] **Step 2: Refactor `app/api/leads/route.ts` to use `appendToSheet`**

Replace the entire file (behavior must remain identical — same validation, same non-blocking pattern, same `Sheet1!A:D` range):

```typescript
// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';

function validateWhatsApp(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11;
}

export async function POST(req: NextRequest) {
  let body: { nome?: string; email?: string; whatsapp?: string };
  try {
    body = (await req.json()) as { nome?: string; email?: string; whatsapp?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { nome, email, whatsapp } = body;

  if (!nome?.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
  }
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
  }
  if (!whatsapp || !validateWhatsApp(whatsapp)) {
    return NextResponse.json({ error: 'WhatsApp inválido' }, { status: 400 });
  }

  try {
    await appendToSheet('Sheet1!A:D', [
      [new Date().toISOString(), nome.trim(), email.trim(), whatsapp.trim()],
    ]);
  } catch (err) {
    console.error('[leads] Google Sheets write failed:', err);
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd C:\Users\gisal\projetos\obrasil-nao-vai-te-salvar && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: exits 0. If it fails, fix before continuing.

- [ ] **Step 5: Verify Review Focus item 5 inline**

In `appendToSheet`, the guard `if (!spreadsheetId || !serviceAccountEmail || !privateKey)` returns early without throwing, so callers' `try/catch` is not needed for the missing-env case. Confirm the warning log reads `[googleSheets] env vars not configured — skipping sheet write` so it is grep-able in production logs.

---

## Task 2: Create `lib/quizData.ts`

**Files:**
- Create: `lib/quizData.ts`

**Interfaces:**
- Consumes: nothing (pure data).
- Produces:
  - `QuizOption { text: string; points: number }`
  - `QuizQuestion { id: number; text: string; isSegmentation: boolean; options: QuizOption[] }`
  - `QuizProfile { id: number; label: string; minScore: number; maxScore: number; body: string }`
  - `QUIZ_QUESTIONS: QuizQuestion[]` (8 items, index 0 = Q1 segmentation)
  - `QUIZ_PROFILES: QuizProfile[]` (4 profiles, ordered by id)
  - `getProfile(totalScore: number): QuizProfile`

- [ ] **Step 1: Write `lib/quizData.ts`**

```typescript
// lib/quizData.ts

export interface QuizOption {
  text: string;
  points: number; // 0 for the segmentation question
}

export interface QuizQuestion {
  id: number; // 1–8
  text: string;
  isSegmentation: boolean; // true only for Q1
  options: QuizOption[];
}

export interface QuizProfile {
  id: number; // 1–4
  label: string;
  minScore: number;
  maxScore: number;
  body: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: 'Qual ponto da sua vida você mais gostaria de mudar hoje?',
    isSegmentation: true,
    options: [
      { text: 'A parte de carreira/dinheiro', points: 0 },
      { text: 'A minha confiança e meus problemas de insegurança', points: 0 },
      { text: 'Minha comunicação', points: 0 },
      { text: 'Minha disciplina/rotina', points: 0 },
      { text: 'Sinceramente? Um pouco de tudo isso', points: 0 },
    ],
  },
  {
    id: 2,
    text: 'Se alguém perguntasse onde você quer estar daqui a 1 ano, o que você responderia?',
    isSegmentation: false,
    options: [
      { text: 'Tenho uma visão bem clara e já sei quais são alguns dos próximos passos.', points: 4 },
      { text: 'Sei mais ou menos o que quero, mas ainda não transformei isso num plano.', points: 3 },
      { text: 'Sei principalmente o que eu NÃO quero continuar vivendo.', points: 2 },
      { text: 'Sinceramente, não faço ideia.', points: 1 },
    ],
  },
  {
    id: 3,
    text: 'Quando alguma coisa na sua vida começa a te incomodar, o que normalmente acontece?',
    isSegmentation: false,
    options: [
      { text: 'Tento entender o problema e faço alguma coisa concreta para mudar.', points: 4 },
      { text: 'Penso bastante no que poderia fazer, mas demoro para agir.', points: 3 },
      { text: 'Vou empurrando enquanto ainda dá para aguentar.', points: 2 },
      { text: 'Normalmente espero alguma coisa acontecer para a situação mudar.', points: 1 },
    ],
  },
  {
    id: 4,
    text: 'Quem está decidindo os próximos passos da sua vida profissional hoje?',
    isSegmentation: false,
    options: [
      { text: 'Eu: tenho buscado oportunidades, habilidades e movimentos que me aproximem do que quero.', points: 4 },
      { text: 'Eu tento assumir isso, mas ainda dependo bastante do que aparece no meu trabalho atual.', points: 3 },
      { text: 'Basicamente minha empresa ou meu chefe: se surgir uma oportunidade, ótimo.', points: 2 },
      { text: 'Ninguém. Estou trabalhando e vendo no que vai dar.', points: 1 },
    ],
  },
  {
    id: 5,
    text: 'Quando você percebe que não conhece as pessoas certas ou não tem acesso a determinado ambiente, o que faz?',
    isSegmentation: false,
    options: [
      { text: 'Procuro formas de me aproximar, conhecer pessoas e construir esse acesso.', points: 4 },
      { text: 'Até tento, mas geralmente não sei como fazer isso sem parecer interesseiro.', points: 3 },
      { text: 'Fico esperando uma oportunidade aparecer naturalmente.', points: 2 },
      { text: 'Normalmente penso que esse tipo de oportunidade é para quem já nasceu com contatos.', points: 1 },
    ],
  },
  {
    id: 6,
    text: 'Qual dessas frases mais parece com você hoje?',
    isSegmentation: false,
    options: [
      { text: '"Tenho tomado decisões mesmo sem ter certeza absoluta de que vão dar certo."', points: 4 },
      { text: '"Sei de algumas decisões que preciso tomar, mas ainda estou adiando."', points: 3 },
      { text: '"Fico pensando tanto nas possibilidades que muitas vezes não escolho nenhuma."', points: 2 },
      { text: '"Prefiro esperar as coisas ficarem mais claras antes de mudar qualquer coisa."', points: 1 },
    ],
  },
  {
    id: 7,
    text: 'Pensando nos últimos 12 meses, quanto a sua vida realmente avançou?',
    isSegmentation: false,
    options: [
      { text: 'Consigo apontar mudanças concretas em quem sou, no que faço ou nas oportunidades que tenho.', points: 4 },
      { text: 'Avancei em algumas coisas, mas menos do que gostaria.', points: 3 },
      { text: 'Trabalhei, me esforcei e fiz muita coisa, mas sinto que continuo praticamente no mesmo lugar.', points: 2 },
      { text: 'Parece que todo ano eu vivo versões diferentes do mesmo ano.', points: 1 },
    ],
  },
  {
    id: 8,
    text: 'Quando você pensa no futuro que deseja, qual frase mais representa o que sente?',
    isSegmentation: false,
    options: [
      { text: 'Sei que muita coisa foge do meu controle, mas estou tentando assumir responsabilidade pelo que depende de mim.', points: 4 },
      { text: 'Quero mudar, só preciso de mais clareza sobre onde colocar minha energia.', points: 3 },
      { text: 'Sinto que minha vida depende demais de coisas que eu não consigo controlar.', points: 2 },
      { text: 'Hoje, sinceramente, estou mais esperando minha situação melhorar do que construindo essa mudança.', points: 1 },
    ],
  },
];

export const QUIZ_PROFILES: QuizProfile[] = [
  {
    id: 1,
    label: 'PASSAGEIRO DA PRÓPRIA VIDA',
    minScore: 7,
    maxScore: 13,
    body: `Hoje, as circunstâncias estão decidindo mais sobre a sua vida do que você.

Você quer uma vida melhor.

O problema é que, entre querer mudar e saber o que fazer, você acabou entrando num modo muito comum de só seguir o fluxo da vida.

Trabalho aparece = você trabalha. Problema aparece = você resolve.

TODO SANTO DIA A MESMA COISA!

Só que aí o ano termina e parece que você não construiu quase nada, não foi pra lugar nenhum…

ENTÃO COMO RESOLVER ISSO?

Eu sei que nem tudo depende de você.

Sua origem, a economia, as oportunidades que você recebeu, as pessoas que conheceu e muitas outras circunstâncias influenciam o seu caminho.

Mas existe uma parte dessa história que precisa voltar para suas mãos.

No dia 31 de outubro, às 15h, eu vou te ajudar a fazer exatamente isso no O Brasil Não Vai Te Salvar (evento 100% on-line).

Você vai construir comigo um Plano de Governo Pessoal pra assumir o controle da sua vida e evoluir 4 anos em apenas 4 meses, independentemente do seu chefe, da parte da família que desacredita de você ou de quem ganhar as eleições.`,
  },
  {
    id: 2,
    label: 'INCONFORMADO SEM MAPA',
    minScore: 14,
    maxScore: 19,
    body: `Você já percebeu que quer mais da vida e pensa bastante sobre seu futuro, sua carreira e sobre as metas que quer alcançar.

Você não é do tipo que aceitaria nascer e morrer do mesmo jeito. Você sabe que tem muito por aí pra conquistar, que te traria a felicidade que você merece…

O problema é justamente esse: existem várias coisas que você gostaria de mudar e pouca clareza o que fazer primeiro.

ENTÃO COMO RESOLVER ISSO?

Eu sei que nem tudo depende de você.

Sua origem, a economia, as oportunidades que você recebeu, as pessoas que conheceu e muitas outras circunstâncias influenciam o seu caminho.

Seu inconformismo é um bom primeiro passo, mas que tal transformar isso em ação agora?

No dia 31 de outubro, às 15h, eu vou te ajudar a fazer exatamente isso no O Brasil Não Vai Te Salvar (evento 100% on-line).

Você vai construir comigo um Plano de Governo Pessoal pra assumir o controle da sua vida e evoluir 4 anos em apenas 4 meses, independentemente do seu chefe, da parte da família que desacredita de você ou de quem ganhar as eleições.`,
  },
  {
    id: 3,
    label: 'CAÇADOR DE MUDANÇAS',
    minScore: 20,
    maxScore: 24,
    body: `Você não simplesmente aceita a vida que caiu no seu colo. Você já tem fome de mudança.

Já toma decisões, procura oportunidades e provavelmente consegue enxergar algumas mudanças importantes que fez nos últimos meses.

Só que suas ações ainda estão dispersas: você melhora uma coisa aqui, começa outra ali, estuda, trabalha, tenta crescer…

Mas falta algo que conecte tudo isso a uma direção maior, então você acaba avançando menos do que poderia, mesmo se esforçando pra caramba. Seu próximo passo é construir um plano que conecte sua carreira, suas habilidades e seu desenvolvimento pessoal ao progresso de vida que você realmente quer.

ENTÃO COMO RESOLVER ISSO?

Sua origem, a economia, as oportunidades que você recebeu, as pessoas que conheceu e muitas outras circunstâncias influenciam o seu caminho, mas você já sabe que sua vida pode ser melhor.

Quer ver sua vida melhorando e seu esforço valendo a pena?

No dia 31 de outubro, às 15h, eu vou te ajudar com isso no O Brasil Não Vai Te Salvar (evento 100% on-line).

Você vai construir comigo um Plano de Governo Pessoal pra assumir o controle da sua vida e evoluir 4 anos em apenas 4 meses, independentemente do seu chefe, da parte da família que desacredita de você ou de quem ganhar as eleições.`,
  },
  {
    id: 4,
    label: 'NO COMANDO',
    minScore: 25,
    maxScore: 28,
    body: `Você já entendeu uma coisa que muita gente demora anos para perceber: ninguém vai construir sua vida por você.

Você não é inocente e sabe que não pode controlar tudo, mas também não usa isso como justificativa para abandonar aquilo que consegue controlar.

Sua origem, a economia, as oportunidades que você recebeu, as pessoas que conheceu e muitas outras circunstâncias influenciam o seu caminho, mas você já sabe que sua vida pode ser melhor.

Disposição pra construir uma vida diferente com suas próprias mãos você já tem.

MAS COMO TIRAR ISSO DO PAPEL?

No dia 31 de outubro, às 15h, eu vou te ajudar com isso no O Brasil Não Vai Te Salvar (evento 100% on-line).

Você vai construir comigo um Plano de Governo Pessoal pra assumir o controle da sua vida e evoluir 4 anos em apenas 4 meses, independentemente do seu chefe, da parte da família que desacredita de você ou de quem ganhar as eleições.`,
  },
];

/**
 * Returns the profile matching totalScore.
 * Score range: 7 (all 'd') to 28 (all 'a') across Q2–Q8 (7 questions).
 * Falls back to nearest edge profile if score is somehow outside bounds.
 */
export function getProfile(totalScore: number): QuizProfile {
  const profile = QUIZ_PROFILES.find(
    (p) => totalScore >= p.minScore && totalScore <= p.maxScore
  );
  if (!profile) {
    if (totalScore < 7) return QUIZ_PROFILES[0];
    return QUIZ_PROFILES[QUIZ_PROFILES.length - 1];
  }
  return profile;
}
```

- [ ] **Step 2: Verify Review Focus item 1 — boundary score**

Mentally trace `getProfile(7)`:
- Profile 1: `7 >= 7 && 7 <= 13` → true → returns Perfil 1. ✓
- `getProfile(28)`: `28 >= 25 && 28 <= 28` → returns Perfil 4. ✓
- `getProfile(14)`: `14 >= 14 && 14 <= 19` → returns Perfil 2. ✓

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd C:\Users\gisal\projetos\obrasil-nao-vai-te-salvar && npx tsc --noEmit
```

Expected: no errors.

---

## Task 3: Create `app/api/quiz-leads/route.ts`

**Files:**
- Create: `app/api/quiz-leads/route.ts`

**Interfaces:**
- Consumes: `appendToSheet` from `lib/googleSheets.ts` (Task 1).
- Produces: `POST /api/quiz-leads` — accepts `{ nome, email, whatsapp, pontuacaoTotal?, perfilResultado?, respostaSegmentacao? }`, returns `{ ok: true }` on success.

- [ ] **Step 1: Write `app/api/quiz-leads/route.ts`**

```typescript
// app/api/quiz-leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';

function validateWhatsApp(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11;
}

interface QuizLeadBody {
  nome?: string;
  email?: string;
  whatsapp?: string;
  pontuacaoTotal?: number;
  perfilResultado?: string;
  respostaSegmentacao?: string;
}

export async function POST(req: NextRequest) {
  let body: QuizLeadBody;
  try {
    body = (await req.json()) as QuizLeadBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { nome, email, whatsapp, pontuacaoTotal, perfilResultado, respostaSegmentacao } = body;

  if (!nome?.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
  }
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
  }
  if (!whatsapp || !validateWhatsApp(whatsapp)) {
    return NextResponse.json({ error: 'WhatsApp inválido' }, { status: 400 });
  }

  // Columns: timestamp | nome | email | whatsapp | pontuacaoTotal | perfilResultado | respostaSegmentacao
  try {
    await appendToSheet('Quiz Leads!A:G', [
      [
        new Date().toISOString(),
        nome.trim(),
        email.trim(),
        whatsapp.trim(),
        pontuacaoTotal ?? '',
        perfilResultado ?? '',
        respostaSegmentacao ?? '',
      ],
    ]);
  } catch (err) {
    // Per spec: log error but do not block the user
    console.error('[quiz-leads] Google Sheets write failed:', err);
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Run build**

```bash
cd C:\Users\gisal\projetos\obrasil-nao-vai-te-salvar && npm run build
```

Expected: exits 0.

---

## Task 4: Create `app/quiz/page.tsx`

**Files:**
- Create: `app/quiz/page.tsx`

**Interfaces:**
- Consumes:
  - `QUIZ_QUESTIONS`, `QUIZ_PROFILES`, `getProfile` from `lib/quizData.ts` (Task 2)
  - `trackEvent` from `lib/analytics.ts`
  - `POST /api/quiz-leads` (Task 3)
  - `POST /api/checkout` (existing)
- Produces: the `/quiz` route.

**State machine:**
- `screen`: `'intro' | 'question' | 'capture' | 'result'`
- `currentIndex`: `number` — index into `QUIZ_QUESTIONS` (0–7)
- `answers`: `(string | number | null)[]` — length 8; index 0 = Q1 text, indices 1–7 = point values
- `score`: `number` — running sum for Q2–Q8 only
- `selectedOption`: `number | null` — prevents double-click during auto-advance delay
- `profile`: `QuizProfile | null` — set when last question is answered

- [ ] **Step 1: Write `app/quiz/page.tsx`**

```tsx
// app/quiz/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUIZ_QUESTIONS, getProfile, QuizProfile } from '@/lib/quizData';
import { trackEvent } from '@/lib/analytics';

interface FormState {
  nome: string;
  email: string;
  whatsapp: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  whatsapp?: string;
}

function validateWhatsApp(value: string): boolean {
  return value.replace(/\D/g, '').length === 11;
}

type Screen = 'intro' | 'question' | 'capture' | 'result';

export default function QuizPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | number | null)[]>(
    Array(QUIZ_QUESTIONS.length).fill(null)
  );
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [profile, setProfile] = useState<QuizProfile | null>(null);
  const [form, setForm] = useState<FormState>({ nome: '', email: '', whatsapp: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // ── Intro ──────────────────────────────────────────────────────────────────

  function handleStart() {
    trackEvent('QuizStart');
    setScreen('question');
  }

  // ── Questions ──────────────────────────────────────────────────────────────

  function handleAnswer(optionIndex: number) {
    if (selectedOption !== null) return; // Review Focus #3: prevent double-click

    const question = QUIZ_QUESTIONS[currentIndex];
    const option = question.options[optionIndex];

    setSelectedOption(optionIndex);

    const newAnswers = [...answers];
    // Q1 segmentation: store the option text. Q2–Q8: store points.
    newAnswers[currentIndex] = question.isSegmentation ? option.text : option.points;
    setAnswers(newAnswers);

    // Score only accumulates for non-segmentation questions (Review Focus #2)
    const newScore = question.isSegmentation ? score : score + option.points;
    setScore(newScore);

    // Auto-advance after short delay for visual feedback
    // TODO: design — swap setTimeout for a CSS transition + transitionend event
    setTimeout(() => {
      setSelectedOption(null);
      if (currentIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        // Last question answered — calculate profile before showing capture
        const calculatedProfile = getProfile(newScore);
        setProfile(calculatedProfile);
        setScreen('capture');
      }
    }, 400);
  }

  // ── Capture form ───────────────────────────────────────────────────────────

  function validateForm(): FormErrors {
    const e: FormErrors = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'E-mail inválido.';
    if (!validateWhatsApp(form.whatsapp))
      e.whatsapp = 'WhatsApp inválido. Use o formato: (11) 99999-9999';
    return e;
  }

  async function handleCaptureSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const payload = {
      nome: form.nome.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.trim(),
      pontuacaoTotal: score,
      perfilResultado: profile?.label ?? '',
      respostaSegmentacao: (answers[0] as string | null) ?? '',
    };

    // Review Focus #4: API failure must NOT block the user
    try {
      const res = await fetch('/api/quiz-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error('[quiz] Lead API error:', await res.text());
      }
      trackEvent('QuizLead', { perfil: profile?.label });
    } catch (err) {
      console.error('[quiz] Lead submission error:', err);
    } finally {
      setSubmitting(false);
    }

    setScreen('result');
  }

  // ── Result CTAs ────────────────────────────────────────────────────────────

  async function handlePremiumCheckout() {
    setCheckoutLoading(true);
    try {
      trackEvent('InitiateCheckout', { plan: 'premium' });
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano: 'premium' }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok) {
        console.error('[quiz] Checkout error:', data.error);
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      console.error('[quiz] Checkout network error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  }

  const question = QUIZ_QUESTIONS[currentIndex];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <main className="hero-surface min-h-screen" data-page="quiz">

      {/* ═══════════════════════════════════════════════════════════════════
          INTRO SCREEN
      ═══════════════════════════════════════════════════════════════════ */}
      {screen === 'intro' && (
        <section
          className="flex min-h-screen flex-col items-center justify-center px-5 py-20 text-center sm:px-8"
          data-screen="intro"
        >
          <div className="mx-auto max-w-2xl">
            {/* TODO: design — animated lime accent badge above headline */}
            <h1
              className="mb-5 font-display text-5xl font-black uppercase leading-none tracking-tight text-paper sm:text-7xl"
              data-quiz="headline"
            >
              Você governa sua vida ou sua vida governa você?
            </h1>
            <p className="mb-4 text-lg font-medium text-cream/80 sm:text-xl" data-quiz="subheadline">
              Faça o teste e descubra quanto do seu futuro está realmente nas suas mãos hoje.
            </p>
            <p className="mb-3 text-base text-cream/70" data-quiz="body">
              8 perguntas para você, que não nasceu em berço de ouro, descobrir o quanto está sendo
              vítima das circunstâncias e como resolver isso.
            </p>
            <p
              className="mb-10 text-sm font-bold uppercase tracking-widest text-lime/80"
              data-quiz="timing"
            >
              Tempo: 2 min
            </p>
            {/* TODO: design — glow/pulse on hover */}
            <button
              onClick={handleStart}
              className="min-h-14 rounded-xl bg-lime px-10 py-4 font-display text-2xl font-black uppercase tracking-wide text-ink shadow-lime transition duration-300 hover:-translate-y-1 hover:bg-sun"
              data-cta="quiz-start"
            >
              COMECE AQUI
            </button>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          QUESTION SCREEN
      ═══════════════════════════════════════════════════════════════════ */}
      {screen === 'question' && (
        <section
          className="flex min-h-screen flex-col items-center justify-center px-5 py-16 sm:px-8"
          data-screen="question"
        >
          <div className="mx-auto w-full max-w-2xl">

            {/* Progress — TODO: design — animated fill, percentage label */}
            <div className="mb-8" data-quiz="progress">
              <p className="mb-2 text-center text-sm font-bold uppercase tracking-widest text-cream/60">
                Pergunta {currentIndex + 1} de {QUIZ_QUESTIONS.length}
              </p>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full bg-cream/15"
                data-progress-track
              >
                <div
                  className="h-full rounded-full bg-lime transition-all duration-500"
                  style={{
                    width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                  data-progress-fill
                />
              </div>
            </div>

            {/* Question text — TODO: design — fade/slide transition between questions */}
            <h2
              className="mb-8 text-center font-display text-3xl font-black uppercase leading-tight tracking-tight text-paper sm:text-4xl"
              data-quiz="question-text"
            >
              {question.text}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-3" data-quiz="options">
              {question.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedOption !== null}
                  className={[
                    'w-full rounded-xl border px-6 py-4 text-left text-base font-medium transition duration-200 disabled:cursor-not-allowed',
                    selectedOption === i
                      ? 'border-lime bg-lime font-bold text-ink'
                      : 'border-cream/20 bg-cream/5 text-cream hover:border-lime/60 hover:bg-cream/10',
                  ].join(' ')}
                  data-option={i}
                  // TODO: design — selected state scale/pulse animation
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          CAPTURE SCREEN
      ═══════════════════════════════════════════════════════════════════ */}
      {screen === 'capture' && (
        <section
          className="flex min-h-screen flex-col items-center justify-center px-5 py-20 sm:px-8"
          data-screen="capture"
        >
          <div className="mx-auto w-full max-w-md">
            {/* TODO: design — celebration icon/confetti above headline */}
            <h2
              className="mb-2 text-center font-display text-4xl font-black uppercase leading-none tracking-tight text-paper sm:text-5xl"
              data-quiz="capture-headline"
            >
              Seu resultado está pronto!
            </h2>
            <p className="mb-8 text-center text-base text-cream/70" data-quiz="capture-sub">
              Deixe seus dados para receber seu diagnóstico:
            </p>

            <form
              onSubmit={handleCaptureSubmit}
              noValidate
              className="flex flex-col gap-5 rounded-3xl border border-cream/10 bg-paper p-6 text-ink shadow-2xl sm:p-9"
              data-form="quiz-capture"
            >
              {/* Nome */}
              <div>
                <label
                  htmlFor="quiz-nome"
                  className="mb-2 block text-sm font-extrabold text-forest"
                >
                  Seu nome
                </label>
                <input
                  id="quiz-nome"
                  type="text"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  className="min-h-12 w-full rounded-xl border border-ink/15 bg-cream/50 px-4 py-3 text-base text-ink transition placeholder:text-ink/35 hover:border-emerald/50 focus:border-emerald focus:bg-paper focus:outline-none focus:ring-4 focus:ring-emerald/10"
                  aria-describedby={errors.nome ? 'quiz-error-nome' : undefined}
                  data-field="nome"
                />
                {errors.nome && (
                  <p
                    id="quiz-error-nome"
                    role="alert"
                    className="mt-2 text-xs font-bold text-red-700"
                    data-state="error"
                  >
                    {errors.nome}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label
                  htmlFor="quiz-whatsapp"
                  className="mb-2 block text-sm font-extrabold text-forest"
                >
                  Seu WhatsApp (com DDD)
                </label>
                <input
                  id="quiz-whatsapp"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="min-h-12 w-full rounded-xl border border-ink/15 bg-cream/50 px-4 py-3 text-base text-ink transition placeholder:text-ink/35 hover:border-emerald/50 focus:border-emerald focus:bg-paper focus:outline-none focus:ring-4 focus:ring-emerald/10"
                  aria-describedby={errors.whatsapp ? 'quiz-error-whatsapp' : undefined}
                  data-field="whatsapp"
                />
                {errors.whatsapp && (
                  <p
                    id="quiz-error-whatsapp"
                    role="alert"
                    className="mt-2 text-xs font-bold text-red-700"
                    data-state="error"
                  >
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="quiz-email"
                  className="mb-2 block text-sm font-extrabold text-forest"
                >
                  Seu melhor e-mail
                </label>
                <input
                  id="quiz-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="min-h-12 w-full rounded-xl border border-ink/15 bg-cream/50 px-4 py-3 text-base text-ink transition placeholder:text-ink/35 hover:border-emerald/50 focus:border-emerald focus:bg-paper focus:outline-none focus:ring-4 focus:ring-emerald/10"
                  aria-describedby={errors.email ? 'quiz-error-email' : undefined}
                  data-field="email"
                />
                {errors.email && (
                  <p
                    id="quiz-error-email"
                    role="alert"
                    className="mt-2 text-xs font-bold text-red-700"
                    data-state="error"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 min-h-14 rounded-xl bg-lime px-6 py-4 font-display text-xl font-black uppercase tracking-wide text-ink shadow-lime transition duration-300 hover:-translate-y-1 hover:bg-sun disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                data-cta="quiz-capture-submit"
              >
                {submitting ? 'Enviando...' : 'VER O RESULTADO'}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          RESULT SCREEN
      ═══════════════════════════════════════════════════════════════════ */}
      {screen === 'result' && profile && (
        <section
          className="flex min-h-screen flex-col items-center justify-center px-5 py-20 sm:px-8"
          data-screen="result"
        >
          <div className="mx-auto w-full max-w-2xl">
            {/* Profile card — TODO: design — per-profile color accent, badge, score display */}
            <div
              className="mb-8 rounded-2xl border border-cream/10 bg-forest/60 p-8 text-paper shadow-card sm:p-12"
              data-quiz="result-card"
              data-profile={`perfil-${profile.id}`}
            >
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-lime/80">
                Seu perfil
              </p>
              <h2
                className="mb-6 font-display text-4xl font-black uppercase leading-none tracking-tight text-lime sm:text-5xl"
                data-quiz="profile-label"
              >
                {profile.label}
              </h2>
              {/* TODO: design — bold highlights, visual separators between paragraphs */}
              <div
                className="space-y-4 text-base leading-relaxed text-cream/85"
                data-quiz="profile-body"
              >
                {profile.body.split('\n\n').map((paragraph, i) => {
                  const isAllCaps =
                    paragraph === paragraph.toUpperCase() && paragraph.trim().length < 80;
                  return (
                    <p key={i} className={isAllCaps ? 'font-black text-paper' : ''}>
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* CTAs — TODO: design — primary/secondary visual hierarchy, spacing */}
            <div className="flex flex-col gap-4 sm:flex-row" data-quiz="result-ctas">
              <button
                onClick={() => router.push('/obrigado')}
                className="flex-1 min-h-14 rounded-xl border-2 border-lime bg-transparent px-6 py-4 font-display text-xl font-black uppercase tracking-wide text-lime transition duration-300 hover:-translate-y-1 hover:bg-lime hover:text-ink"
                data-cta="quiz-free"
              >
                PARTICIPAR DE GRAÇA
              </button>
              <button
                onClick={handlePremiumCheckout}
                disabled={checkoutLoading}
                className="flex-1 min-h-14 rounded-xl bg-lime px-6 py-4 font-display text-xl font-black uppercase tracking-wide text-ink shadow-lime transition duration-300 hover:-translate-y-1 hover:bg-sun disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                data-cta="quiz-premium"
              >
                {checkoutLoading ? 'Aguarde...' : 'QUERO O INGRESSO PREMIUM'}
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Run build**

```bash
cd C:\Users\gisal\projetos\obrasil-nao-vai-te-salvar && npm run build
```

Expected: exits 0. Fix any TypeScript errors before continuing.

- [ ] **Step 3: Verify Review Focus #2 inline**

In `handleAnswer`: when `question.isSegmentation` is true (Q1, index 0), `newScore = score` (unchanged). `newAnswers[0]` is set to `option.text` (a string), not `option.points`. Confirmed: score stays 0, `answers[0]` is the text. ✓

- [ ] **Step 4: Verify Review Focus #3 inline**

In `handleAnswer`: the guard `if (selectedOption !== null) return;` fires immediately on a second click while the 400ms timeout is pending. Since `setSelectedOption(optionIndex)` is called synchronously before the timeout, any click within 400ms hits the guard. ✓

- [ ] **Step 5: Verify Review Focus #4 inline**

In `handleCaptureSubmit`: the `fetch` call is wrapped in `try/catch`. Whether `res.ok` is false or an exception is thrown, `setScreen('result')` runs unconditionally at the end (after the `finally` block). ✓

---

## Task 5: Update README + final build + commit

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: nothing new.
- Produces: updated README with "Quiz Leads" tab documentation; verified build; git commit.

- [ ] **Step 1: Add "Quiz Leads" section to README**

In `README.md`, under the "Google Sheets (Lead capture)" section, add the following after the existing note about `Sheet1`:

```markdown
### Quiz Leads tab

The quiz at `/quiz` writes to a separate tab named **"Quiz Leads"** in the same spreadsheet.

**You must create this tab manually before leads will be saved:**
1. Open your Google Sheets spreadsheet.
2. Click the **+** button at the bottom to add a new sheet.
3. Rename it exactly to `Quiz Leads` (case-sensitive).

Columns written (in order): `timestamp` | `nome` | `email` | `whatsapp` | `pontuacaoTotal` | `perfilResultado` | `respostaSegmentacao`

If the tab does not exist, the Sheets API will return an error that is caught and logged server-side — the user is not blocked.
```

Also add a row to the "Project Structure" section:

```
  api/
    quiz-leads/route.ts # POST /api/quiz-leads — saves quiz lead to "Quiz Leads" sheet tab

lib/
  quizData.ts         # Quiz questions, options, scoring, profile definitions
  googleSheets.ts     # Shared Google Sheets auth + appendToSheet helper
```

- [ ] **Step 2: Final build**

```bash
cd C:\Users\gisal\projetos\obrasil-nao-vai-te-salvar && npm run build
```

Expected: exits 0 with no errors or warnings about new files.

- [ ] **Step 3: Commit**

```bash
cd C:\Users\gisal\projetos\obrasil-nao-vai-te-salvar && git add lib/googleSheets.ts lib/quizData.ts app/api/leads/route.ts app/api/quiz-leads/route.ts app/quiz/page.tsx README.md docs/superpowers/plans/2026-10-05-quiz-captacao.md && git commit -m "$(cat <<'EOF'
feat: quiz de captacao de leads

- /quiz: single-page quiz with 8 questions, auto-advance, scoring
- Profiles: 4 result profiles based on Q2-Q8 score (7-28 pts)
- Lead capture form POSTs to /api/quiz-leads -> Google Sheets "Quiz Leads" tab
- lib/googleSheets.ts: shared Sheets auth helper (refactored from /api/leads)
- Analytics: QuizStart, QuizLead, InitiateCheckout events
- Visual hotspots marked with // TODO: design + data-* for next Codex pass

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Tela intro: headline, subheadline, body, timing, CTA "COMECE AQUI" → Task 4 intro screen
- [x] 8 perguntas, uma por vez → Task 4 question screen, `currentIndex` advances
- [x] Barra de progresso "Pergunta X de 8" → Task 4 progress div
- [x] Q1 segmentation stored, not scored → Task 2 `isSegmentation: true`, Task 4 `handleAnswer`
- [x] Q2-Q8 a=4, b=3, c=2, d=1 → Task 2 `points` values
- [x] Auto-advance with transition → Task 4 `setTimeout(400ms)` + `// TODO: design` note
- [x] Tela captura: "Seu resultado está pronto!", form, CTA "VER O RESULTADO" → Task 4 capture screen
- [x] POST /api/quiz-leads with all 6 fields → Task 4 `handleCaptureSubmit`, Task 3 route
- [x] Aba separada "Quiz Leads" → Task 3 `appendToSheet('Quiz Leads!A:G', ...)`
- [x] Colunas: timestamp, nome, email, whatsapp, pontuacaoTotal, perfilResultado, respostaSegmentacao → Task 3
- [x] Non-blocking on failure → Task 3 `try/catch` + console.error
- [x] lib/googleSheets.ts helper compartilhado → Task 1
- [x] Perfil calculado client-side antes de enviar → Task 4, `getProfile(newScore)` called in `handleAnswer` before `setScreen('capture')`
- [x] 4 perfis com faixas corretas → Task 2 `QUIZ_PROFILES`
- [x] Tela resultado: perfil label + body → Task 4 result screen
- [x] CTA "PARTICIPAR DE GRAÇA" → `/obrigado` → Task 4 `router.push('/obrigado')`
- [x] CTA "QUERO O INGRESSO PREMIUM" → /api/checkout `{ plano: 'premium' }` → Task 4 `handlePremiumCheckout`
- [x] Analytics: QuizStart, QuizLead, InitiateCheckout → Task 4
- [x] // TODO: design + data-* on progress bar, question transitions, option selected state, result card → Task 4
- [x] Reaproveitar cores/fontes existentes → Task 4 uses `hero-surface`, `font-display`, `bg-lime`, `text-ink`, etc.
- [x] README atualizado → Task 5
- [x] npm run build → Tasks 1, 3, 4, 5
- [x] git commit → Task 5

**Placeholder scan:** None found.

**Type consistency:**
- `appendToSheet(range: string, values: (string | number)[][])` defined in Task 1, used identically in Tasks 1 (refactored leads), 3 (quiz-leads).
- `getProfile(totalScore: number): QuizProfile` defined in Task 2, used in Task 4.
- `QuizProfile` interface defined in Task 2, used as state type in Task 4.
- `QUIZ_QUESTIONS` used in Task 4: `QUIZ_QUESTIONS[currentIndex]`, `.length`, `.options`. All properties (`text`, `isSegmentation`, `options[i].text`, `options[i].points`) defined in Task 2.

**Review Focus coverage:**
1. Score boundary 7 → verified in Task 2 Step 2 (mental trace).
2. Q1 not scored, text stored → verified inline in Task 4 Step 3.
3. Double-click prevention → verified inline in Task 4 Step 4.
4. API failure non-blocking → verified inline in Task 4 Step 5.
5. Missing env vars → verified inline in Task 1 Step 5.
