# O Brasil Não Vai Te Salvar — Next.js Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a complete Next.js 14 App Router project with 3 pages, 2 API routes, and Google Sheets + Asaas integrations for the "O Brasil Não Vai Te Salvar" live event sales page.

**Architecture:** Next.js 14 App Router with TypeScript, Tailwind CSS (structural only — no design). Pages and API routes live in `app/`. UI split into focused components under `components/`. Shared constants and API helpers in `lib/`.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Google Sheets API (googleapis), Asaas REST API (fetch), GA4, Meta Pixel.

**Spec:** `SPEC_CLAUDE.md` and `COPY.md` in the project root.

## Global Constraints

- Next.js 14+ App Router; NO pages/ directory
- TypeScript strict mode
- Tailwind CSS installed but only structural classes (no color palette, no typography design)
- Copy text must be taken literally from `COPY.md` — do not rewrite
- All credentials via env vars (placeholders only, never real values)
- Markup must be semantic HTML with `// TODO: design` comments at visual hotspots
- `npm run build` must pass with zero errors before commit
- Components named exactly: `Hero`, `Dobra2`, `MinisteriosGrid`, `PlanosTable`, `MentorBio`, `CapturaForm`

## Review Focus

- Asaas checkout: if `ASAAS_API_KEY` is missing/wrong, must return a user-friendly error (not a 500 crash)
- Google Sheets: if API call fails, must NOT block the user redirect to `/obrigado`
- WhatsApp validation on `/captura`: must accept `(11) 99999-9999` and `11999999999` formats but reject short numbers
- Start CTA on sales page must scroll to dobra-4 (ingressos) not navigate away
- Analytics events must fire on both `/obrigado` load and checkout API call, even when pixel/GA IDs are not set

---

## File Structure

**Created:**
- `package.json` — dependencies + scripts
- `tsconfig.json` — TypeScript config
- `next.config.ts` — Next.js config
- `tailwind.config.ts` — Tailwind config
- `postcss.config.mjs` — PostCSS config
- `app/globals.css` — base Tailwind imports
- `app/layout.tsx` — root layout with GA4 + Meta Pixel
- `app/page.tsx` — `/` sales page (assembles all 5 dobras)
- `app/captura/page.tsx` — `/captura` capture page
- `app/obrigado/page.tsx` — `/obrigado` thank-you page
- `app/api/leads/route.ts` — POST handler → Google Sheets
- `app/api/checkout/route.ts` — POST handler → Asaas payment link
- `components/Hero.tsx` — Dobra 1: headline + CTA
- `components/Dobra2.tsx` — Dobra 2: storytelling text
- `components/MinisteriosGrid.tsx` — Dobra 3: 4 ministry cards
- `components/PlanosTable.tsx` — Dobra 4: pricing table/cards
- `components/MentorBio.tsx` — Dobra 5: Fellipe Barcelos bio
- `components/CapturaForm.tsx` — client form with validation
- `components/AnalyticsGA4.tsx` — GA4 script injector
- `components/MetaPixel.tsx` — Meta Pixel script injector
- `lib/plans.ts` — plan names, prices, descriptions
- `lib/analytics.ts` — trackEvent helper (gtag + fbq)
- `.env.example` — all env var placeholders
- `README.md` — setup guide for Asaas, Google Sheets, Analytics

---

### Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `app/globals.css`

**Interfaces:**
- Produces: working `npm run dev` and `npm run build`

- [ ] **Step 1: Initialize project with create-next-app**

```bash
cd /c/Users/gisal/projetos/obrasil-nao-vai-te-salvar
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --no-import-alias --yes
```

- [ ] **Step 2: Install googleapis dependency**

```bash
npm install googleapis
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run build
```
Expected: build succeeds (default Next.js app)

---

### Task 2: Plan constants

**Files:**
- Create: `lib/plans.ts`

**Interfaces:**
- Produces: `PLANS` object with `start`, `pro`, `premium` keys; each has `name`, `price`, `priceLabel`, `cta`

- [ ] **Step 1: Create lib/plans.ts**

```typescript
// lib/plans.ts
export type PlanKey = 'start' | 'pro' | 'premium';

export interface Plan {
  key: PlanKey;
  name: string;
  badge: string;
  price: number;       // in BRL cents; 0 = free
  priceLabel: string;
  cta: string;
}

export const PLANS: Record<PlanKey, Plan> = {
  start: {
    key: 'start',
    name: 'INGRESSO START',
    badge: 'à prova de desculpas!',
    price: 0,
    priceLabel: 'De graça',
    cta: 'QUERO O START',
  },
  pro: {
    key: 'pro',
    name: 'INGRESSO PRO',
    badge: 'o mais escolhido!',
    price: 2990,
    priceLabel: 'R$29,90',
    cta: 'QUERO O PRO',
  },
  premium: {
    key: 'premium',
    name: 'INGRESSO PREMIUM',
    badge: 'o mais completo!',
    price: 4990,
    priceLabel: 'R$49,90',
    cta: 'QUERO O PREMIUM',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add lib/plans.ts
git commit -m "feat: add plan constants"
```

---

### Task 3: Analytics components and helpers

**Files:**
- Create: `components/AnalyticsGA4.tsx`
- Create: `components/MetaPixel.tsx`
- Create: `lib/analytics.ts`

**Interfaces:**
- Produces: `<AnalyticsGA4 />`, `<MetaPixel />` (server components), `trackEvent(name, params?)` (client function)

- [ ] **Step 1: Create AnalyticsGA4 component**

```tsx
// components/AnalyticsGA4.tsx
import Script from 'next/script';

export default function AnalyticsGA4() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
```

- [ ] **Step 2: Create MetaPixel component**

```tsx
// components/MetaPixel.tsx
import Script from 'next/script';

export default function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) return null;
  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}
```

- [ ] **Step 3: Create analytics helper**

```typescript
// lib/analytics.ts
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', eventName, params ?? {});
  }
  if (window.fbq) {
    window.fbq('track', eventName, params ?? {});
  }
}
```

---

### Task 4: Hero component (Dobra 1)

**Files:**
- Create: `components/Hero.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `<Hero />` server component; CTA scrolls to `#ingressos`

- [ ] **Step 1: Create Hero component**

```tsx
// components/Hero.tsx
// TODO: design — apply headline typography, background, CTA button styles

export default function Hero() {
  return (
    <section
      id="hero"
      data-section="hero"
      className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center"
    >
      {/* TODO: design — main headline */}
      <h1 className="text-4xl font-bold mb-4">O BRASIL NÃO VAI TE SALVAR</h1>

      {/* TODO: design — subheadline */}
      <p className="max-w-2xl mb-6">
        Pare de esperar sua vida melhorar e construa, em uma tarde, um plano
        para fazer seus próximos 4 meses valerem mais que os últimos 4 anos.
      </p>

      <p className="max-w-2xl mb-6">
        O fim da sua procrastinação, da sua insegurança e do seu salário de merd@.
      </p>

      <p className="max-w-2xl mb-8">
        Uma imersão ao vivo para quem não quer só torcer por uma vida melhor de
        braços cruzados, com ingressos a partir de R$0 (estar quebrado não é desculpa!).
      </p>

      {/* TODO: design — event date badge */}
      <p className="font-bold mb-8">31 DE OUTUBRO • 15H • 100% ON-LINE</p>

      {/* TODO: design — CTA button primary style */}
      <a
        href="#ingressos"
        className="inline-block px-8 py-4 font-bold"
        data-cta="hero-main"
      >
        GARANTIR MEU INGRESSO
      </a>
    </section>
  );
}
```

---

### Task 5: Dobra2, MinisteriosGrid, MentorBio components

**Files:**
- Create: `components/Dobra2.tsx`
- Create: `components/MinisteriosGrid.tsx`
- Create: `components/MentorBio.tsx`

**Interfaces:**
- Produces: three server components used in `app/page.tsx`

- [ ] **Step 1: Create Dobra2 component**

```tsx
// components/Dobra2.tsx
// TODO: design — storytelling section typography and spacing

export default function Dobra2() {
  return (
    <section
      id="sobre"
      data-section="dobra2"
      className="max-w-2xl mx-auto px-4 py-16"
    >
      {/* TODO: design — body text style */}
      <p className="mb-4">Eu não nasci playboy, e nem você.</p>
      <p className="mb-4">
        Seria burrice fingir que todo mundo começa da mesma linha de largada,
        que políticas públicas não importam ou que basta &ldquo;querer muito&rdquo; pra
        conseguir qualquer coisa.
      </p>
      <p className="mb-4">
        Mas existe outro erro tão perigoso quanto: entregar completamente o seu
        futuro pro que você não consegue controlar sozinho (como a cabeça do
        político X ou Y).
      </p>
      <p>
        Durante a imersão, eu vou montar com você o seu{' '}
        <strong>PLANO DE GOVERNO PESSOAL</strong>: um plano prático pra fazer
        sua vida avançar 4 anos nos próximos 4 meses.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Create MinisteriosGrid component**

```tsx
// components/MinisteriosGrid.tsx
// TODO: design — card grid layout, card border/background styles

const ministerios = [
  {
    title: 'MINISTÉRIO DA DEFESA',
    body: 'Confiança, comunicação e posicionamento. Aprenda a ocupar espaços, defender seu valor, blindar seu emocional e parar de deixar a insegurança decidir por você.',
  },
  {
    title: 'MINISTÉRIO DO PLANEJAMENTO',
    body: 'Prioridades, procrastinação e execução. Organize seu tempo e sua energia para parar de adiar o que precisa ser feito e finalmente progredir na vida.',
  },
  {
    title: 'MINISTÉRIO DO TRABALHO',
    body: 'Carreira, renda e crescimento profissional. Entenda quais movimentos podem aumentar seu valor e abrir novas oportunidades.',
  },
  {
    title: 'MINISTÉRIO DA EDUCAÇÃO',
    body: 'Estudos, habilidades e competências. Descubra o que vale a pena aprender para chegar mais perto da vida que você quer.',
  },
];

export default function MinisteriosGrid() {
  return (
    <section
      id="como-funciona"
      data-section="ministerios"
      className="max-w-4xl mx-auto px-4 py-16"
    >
      {/* TODO: design — section heading style */}
      <h2 className="text-2xl font-bold mb-8 text-center">
        Como vai funcionar o Plano de Governo Pessoal?
      </h2>
      <p className="text-center mb-8">
        No dia 31, vamos reorganizar os &ldquo;ministérios&rdquo; mais importantes da sua vida.
      </p>

      {/* TODO: design — responsive grid, card visual style */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2" data-grid="ministerios">
        {ministerios.map((m) => (
          <article
            key={m.title}
            className="p-6 border"
            data-card="ministerio"
          >
            {/* TODO: design — card title style */}
            <h3 className="font-bold mb-2">{m.title}</h3>
            <p>{m.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create MentorBio component**

```tsx
// components/MentorBio.tsx
// TODO: design — bio section layout, photo placeholder, name style

export default function MentorBio() {
  return (
    <section
      id="mentor"
      data-section="mentor"
      className="max-w-3xl mx-auto px-4 py-16"
    >
      {/* TODO: design — mentor name headline style */}
      <h2 className="text-2xl font-bold mb-6">FELLIPE BARCELOS</h2>

      {/* TODO: design — photo placeholder */}
      <div
        className="w-32 h-32 mb-6"
        data-placeholder="mentor-photo"
        aria-label="Foto do mentor Fellipe Barcelos"
      />

      {/* TODO: design — bio list style */}
      <ul className="space-y-3 list-disc list-inside">
        <li>
          Mais velho de 3 irmãos, cresceu em diferentes quebradas do Litoral
          Paulista e estudou a vida inteira em escola pública.
        </li>
        <li>
          Passou por Engenharia em universidades federais, trabalhou no maior
          porto da América Latina e, depois, decidiu construir o próprio
          caminho empreendendo.
        </li>
        <li>
          É fundador do Mantora Lab, sua empresa de marketing e vendas, que
          atende grandes nomes do mercado digital (como Hosaka e Drª. Jannuzzi).
        </li>
        <li>
          Hoje, ele dedica seu tempo para orientar quem veio da mesma realidade
          com menos privilégios e já reúne uma comunidade de mais de 80 mil
          seguidores que também vieram de baixo e querem uma vida de progresso
          constante.
        </li>
      </ul>
    </section>
  );
}
```

---

### Task 6: PlanosTable component (Dobra 4)

**Files:**
- Create: `components/PlanosTable.tsx`

**Interfaces:**
- Consumes: `PLANS` from `lib/plans.ts`
- Produces: `<PlanosTable />` client component; Start CTA → `/captura`, Pro/Premium CTA → POST `/api/checkout`

- [ ] **Step 1: Create PlanosTable component**

```tsx
// components/PlanosTable.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PLANS } from '@/lib/plans';
import { trackEvent } from '@/lib/analytics';

// TODO: design — pricing table layout, plan card styles, CTA button variants

const features = [
  { label: 'Acesso', start: '1 vaga no evento + grupo VIP', pro: '1 vaga no evento + grupo VIP', premium: '1 vaga no evento + grupo VIP' },
  { label: 'Plano de Governo Pessoal', start: 'Material preenchível', pro: 'Material preenchível', premium: 'Material preenchível' },
  { label: 'Mapa de Competências Valiosas', start: '—', pro: 'Incluso', premium: 'Incluso' },
  { label: 'Agente Mentor Profissional', start: '—', pro: 'IA exclusiva inclusa', premium: 'IA exclusiva inclusa' },
  { label: 'Gravação do evento', start: '—', pro: 'Por 30 dias', premium: 'Por 120 dias' },
  { label: 'Kit Anti-Procrastinação', start: '—', pro: 'Incluso', premium: 'Incluso' },
  { label: 'Guia do aumento', start: '—', pro: '—', premium: 'Incluso' },
  { label: 'Revisão do Plano de Governo', start: '—', pro: '—', premium: 'Inclusa' },
  { label: 'Plataforma Vida na Bala', start: '—', pro: '—', premium: '1 mês grátis' },
];

export default function PlanosTable() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCta(planKey: 'start' | 'pro' | 'premium') {
    setError(null);
    if (planKey === 'start') {
      router.push('/captura');
      return;
    }

    setLoadingPlan(planKey);
    try {
      trackEvent('InitiateCheckout', { plan: planKey });
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano: planKey }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Erro ao iniciar checkout. Tente novamente.');
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section
      id="ingressos"
      data-section="planos"
      className="max-w-5xl mx-auto px-4 py-16"
    >
      {/* TODO: design — section heading style */}
      <h2 className="text-2xl font-bold mb-8 text-center">Escolha seu ingresso</h2>

      {/* TODO: design — error banner style */}
      {error && (
        <p role="alert" className="mb-4 p-3 border text-center" data-state="error">
          {error}
        </p>
      )}

      {/* TODO: design — responsive table/card grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" data-table="planos">
          <thead>
            <tr>
              <th className="p-3 text-left">Benefício</th>
              {(['start', 'pro', 'premium'] as const).map((key) => (
                <th key={key} className="p-3 text-center" data-plan={key}>
                  {/* TODO: design — plan header card */}
                  <div>
                    <span className="block font-bold">{PLANS[key].name}</span>
                    <span className="block text-sm">({PLANS[key].badge})</span>
                    <span className="block font-bold mt-1">{PLANS[key].priceLabel}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.label} className="border-t">
                <td className="p-3">{f.label}</td>
                <td className="p-3 text-center">{f.start}</td>
                <td className="p-3 text-center">{f.pro}</td>
                <td className="p-3 text-center">{f.premium}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t">
              <td className="p-3" />
              {(['start', 'pro', 'premium'] as const).map((key) => (
                <td key={key} className="p-3 text-center">
                  {/* TODO: design — CTA button styles per plan tier */}
                  <button
                    onClick={() => handleCta(key)}
                    disabled={loadingPlan !== null}
                    className="px-4 py-2 font-bold disabled:opacity-50"
                    data-cta={`plano-${key}`}
                  >
                    {loadingPlan === key ? 'Aguarde...' : PLANS[key].cta}
                  </button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
```

---

### Task 7: Main sales page (app/page.tsx)

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Hero`, `Dobra2`, `MinisteriosGrid`, `PlanosTable`, `MentorBio`

- [ ] **Step 1: Replace default page with sales page**

```tsx
// app/page.tsx
import Hero from '@/components/Hero';
import Dobra2 from '@/components/Dobra2';
import MinisteriosGrid from '@/components/MinisteriosGrid';
import PlanosTable from '@/components/PlanosTable';
import MentorBio from '@/components/MentorBio';

export default function HomePage() {
  return (
    <main>
      {/* Dobra 1 — Hero */}
      <Hero />

      {/* Dobra 2 — Storytelling */}
      <Dobra2 />

      {/* Dobra 3 — Ministérios */}
      <MinisteriosGrid />

      {/* Dobra 4 — Ingressos */}
      <PlanosTable />

      {/* Dobra 5 — Mentor */}
      <MentorBio />
    </main>
  );
}
```

---

### Task 8: CapturaForm component and /captura page

**Files:**
- Create: `components/CapturaForm.tsx`
- Create: `app/captura/page.tsx`

**Interfaces:**
- Produces: `<CapturaForm />` client component; POST `/api/leads`; redirect to `/obrigado` on success

- [ ] **Step 1: Create CapturaForm component**

```tsx
// components/CapturaForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

// TODO: design — form layout, input styles, submit button style

function validateWhatsApp(value: string): boolean {
  // Accepts formats: 11999999999 (11 digits) or (11) 99999-9999
  const digits = value.replace(/\D/g, '');
  return digits.length === 11;
}

export default function CapturaForm() {
  const router = useRouter();
  const [form, setForm] = useState({ nome: '', email: '', whatsapp: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = 'Nome é obrigatório.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'E-mail inválido.';
    if (!validateWhatsApp(form.whatsapp))
      e.whatsapp = 'WhatsApp inválido. Use o formato: (11) 99999-9999';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      // Even if API fails we proceed (per spec: "não bloquear o usuário")
      if (!res.ok) {
        console.error('Lead API error:', await res.text());
      }
      trackEvent('Lead', { plan: 'start' });
      router.push('/obrigado');
    } catch (err) {
      console.error('Lead submission error:', err);
      // Proceed anyway per spec
      trackEvent('Lead', { plan: 'start' });
      router.push('/obrigado');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 max-w-md mx-auto"
      data-form="captura"
    >
      {/* TODO: design — form field styles */}
      <div>
        <label htmlFor="nome" className="block mb-1 font-medium">
          Seu nome
        </label>
        <input
          id="nome"
          type="text"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="w-full border p-2"
          aria-describedby={errors.nome ? 'error-nome' : undefined}
          data-field="nome"
        />
        {errors.nome && (
          <p id="error-nome" role="alert" className="text-sm mt-1" data-state="error">
            {errors.nome}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block mb-1 font-medium">
          Seu melhor e-mail
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2"
          aria-describedby={errors.email ? 'error-email' : undefined}
          data-field="email"
        />
        {errors.email && (
          <p id="error-email" role="alert" className="text-sm mt-1" data-state="error">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="whatsapp" className="block mb-1 font-medium">
          Seu WhatsApp (com DDD)
        </label>
        <input
          id="whatsapp"
          type="tel"
          placeholder="(11) 99999-9999"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          className="w-full border p-2"
          aria-describedby={errors.whatsapp ? 'error-whatsapp' : undefined}
          data-field="whatsapp"
        />
        {errors.whatsapp && (
          <p id="error-whatsapp" role="alert" className="text-sm mt-1" data-state="error">
            {errors.whatsapp}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="text-sm" data-state="error">
          {serverError}
        </p>
      )}

      {/* TODO: design — submit button style */}
      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-3 font-bold disabled:opacity-50"
        data-cta="captura-submit"
      >
        {submitting ? 'Enviando...' : 'FINALIZAR CADASTRO'}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create /captura page**

```tsx
// app/captura/page.tsx
import CapturaForm from '@/components/CapturaForm';

// TODO: design — capture page layout and visual treatment

export default function CapturaPage() {
  return (
    <main className="min-h-screen px-4 py-16">
      {/* TODO: design — page header style */}
      <section className="max-w-2xl mx-auto text-center mb-10" data-section="captura-hero">
        <h1 className="text-2xl font-bold mb-2">
          O BRASIL NÃO VAI TE SALVAR · INGRESSO START
        </h1>
        <p className="text-lg font-semibold mb-4">Você está quase lá…</p>
        <p>
          Preencha seus dados aqui pra confirmar sua vaga e receber o acesso ao
          evento e aos seus bônus do Ingresso Start.
        </p>
      </section>

      <CapturaForm />
    </main>
  );
}
```

---

### Task 9: /obrigado page

**Files:**
- Create: `app/obrigado/page.tsx`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_WHATSAPP_GROUP_URL` env var, `trackEvent` from `lib/analytics`

- [ ] **Step 1: Create /obrigado page**

```tsx
// app/obrigado/page.tsx
'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

// TODO: design — progress bar visual, page layout, CTA button style

export default function ObrigadoPage() {
  useEffect(() => {
    trackEvent('CompleteRegistration', { plan: 'start' });
  }, []);

  const groupUrl = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ?? '#';

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center"
      data-page="obrigado"
    >
      {/* TODO: design — progress bar track and fill styles */}
      <div
        className="w-full max-w-md mb-6"
        role="progressbar"
        aria-valuenow={98}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso da inscrição"
        data-progress="98"
      >
        <p className="mb-2 font-medium">Sua inscrição está 98% concluída!</p>
        <div className="w-full bg-gray-200 h-4 rounded">
          <div className="bg-green-500 h-4 rounded" style={{ width: '98%' }} />
        </div>
      </div>

      {/* TODO: design — heading style */}
      <h1 className="text-2xl font-bold mb-4">Só falta um passo!</h1>

      <p className="max-w-md mb-8">
        Clique no botão abaixo e entre agora nosso grupo oficial do WhatsApp pra
        ter acesso à imersão O Brasil não Vai Te Salvar:
      </p>

      {/* TODO: design — CTA button primary style */}
      <a
        href={groupUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 font-bold mb-6"
        data-cta="whatsapp-group"
      >
        ENTRAR NO GRUPO
      </a>

      <p className="text-sm max-w-sm">
        &ldquo;E relaxa: o grupo é só pra te avisar sobre o evento e mandar materiais
        importantes. Nada de spam.&rdquo;
      </p>
    </main>
  );
}
```

---

### Task 10: API route — /api/leads (Google Sheets)

**Files:**
- Create: `app/api/leads/route.ts`

**Interfaces:**
- Consumes: `{ nome: string, email: string, whatsapp: string }` POST body
- Produces: `{ ok: true }` on success; `{ error: string }` on validation fail

- [ ] **Step 1: Create leads API route**

```typescript
// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

function validateWhatsApp(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length === 11;
}

export async function POST(req: NextRequest) {
  let body: { nome?: string; email?: string; whatsapp?: string };
  try {
    body = await req.json();
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

  // Attempt to write to Google Sheets (non-blocking on failure per spec)
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
      console.warn('[leads] Google Sheets env vars not configured — skipping sheet write');
    } else {
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
        range: 'Sheet1!A:D',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[new Date().toISOString(), nome.trim(), email.trim(), whatsapp.trim()]],
        },
      });
    }
  } catch (err) {
    // Per spec: log error but do not block the user
    console.error('[leads] Google Sheets write failed:', err);
  }

  return NextResponse.json({ ok: true });
}
```

---

### Task 11: API route — /api/checkout (Asaas)

**Files:**
- Create: `app/api/checkout/route.ts`

**Interfaces:**
- Consumes: `{ plano: "pro" | "premium" }` POST body
- Produces: `{ checkoutUrl: string }` on success; `{ error: string }` on failure

- [ ] **Step 1: Create checkout API route**

```typescript
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PLANS } from '@/lib/plans';

export async function POST(req: NextRequest) {
  let body: { plano?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { plano } = body;
  if (plano !== 'pro' && plano !== 'premium') {
    return NextResponse.json({ error: 'Plano inválido. Use "pro" ou "premium".' }, { status: 400 });
  }

  const apiKey = process.env.ASAAS_API_KEY;
  const apiUrl = process.env.ASAAS_API_URL ?? 'https://api-sandbox.asaas.com/v3';

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Checkout indisponível no momento. Tente novamente mais tarde.' },
      { status: 503 }
    );
  }

  const plan = PLANS[plano];
  const valueInReais = plan.price / 100;

  try {
    const response = await fetch(`${apiUrl}/paymentLinks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: apiKey,
      },
      body: JSON.stringify({
        name: `${plan.name} — O Brasil Não Vai Te Salvar`,
        value: valueInReais,
        billingType: 'UNDEFINED', // lets customer choose payment method
        chargeType: 'DETACHED',
        description: `Ingresso ${plan.name} para a imersão ao vivo de 31 de outubro.`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[checkout] Asaas error:', data);
      return NextResponse.json(
        { error: 'Erro ao criar checkout. Tente novamente em instantes.' },
        { status: 502 }
      );
    }

    const checkoutUrl: string = data.url ?? data.invoiceUrl ?? data.checkoutUrl;
    if (!checkoutUrl) {
      console.error('[checkout] Asaas response missing URL:', data);
      return NextResponse.json(
        { error: 'Não foi possível obter o link de pagamento. Tente novamente.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error('[checkout] Network error:', err);
    return NextResponse.json(
      { error: 'Erro de conexão com o gateway de pagamento. Tente novamente.' },
      { status: 502 }
    );
  }
}
```

---

### Task 12: Root layout with analytics

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `<AnalyticsGA4 />`, `<MetaPixel />`

- [ ] **Step 1: Update root layout**

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import AnalyticsGA4 from '@/components/AnalyticsGA4';
import MetaPixel from '@/components/MetaPixel';

// TODO: design — add font imports here (e.g., next/font/google)

export const metadata: Metadata = {
  title: 'O Brasil Não Vai Te Salvar — Imersão ao Vivo',
  description:
    'Pare de esperar sua vida melhorar. Construa, em uma tarde, um plano para fazer seus próximos 4 meses valerem mais que os últimos 4 anos. 31 de outubro, 15h, 100% on-line.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AnalyticsGA4 />
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
```

---

### Task 13: .env.example and README.md

**Files:**
- Create: `.env.example`
- Create: `README.md`

- [ ] **Step 1: Create .env.example**

```bash
# Asaas — Checkout Pro/Premium
# Docs: https://docs.asaas.com/
ASAAS_API_KEY=your_asaas_api_key_here
# Use sandbox for testing, switch to https://api.asaas.com/v3 in production
ASAAS_API_URL=https://api-sandbox.asaas.com/v3

# Google Sheets — Lead capture
# See README.md for service account setup instructions
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email_here
# Paste the full private key from the JSON file (keep the BEGIN/END PRIVATE KEY lines)
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=your_private_key_here

# Analytics (optional — features are disabled when these are not set)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=000000000000000

# WhatsApp group link shown on /obrigado
NEXT_PUBLIC_WHATSAPP_GROUP_URL=https://chat.whatsapp.com/your_group_link
```

- [ ] **Step 2: Create README.md**

```markdown
# O Brasil Não Vai Te Salvar — Landing Page

Next.js 14 App Router landing page for the "O Brasil Não Vai Te Salvar" live event.

## Quick Start

1. `cp .env.example .env.local` and fill in the values (see sections below)
2. `npm install`
3. `npm run dev`

---

## Asaas (Pro/Premium checkout)

1. Create an account at [asaas.com](https://asaas.com).
2. Go to **Integrações → Chaves de API** and copy your API key.
3. Set `ASAAS_API_KEY` in `.env.local`.
4. For **sandbox** (testing): keep `ASAAS_API_URL=https://api-sandbox.asaas.com/v3`.
5. For **production**: set `ASAAS_API_URL=https://api.asaas.com/v3`.

The checkout route (`/api/checkout`) creates a Payment Link via Asaas and returns its URL. The user is redirected there to complete payment.

---

## Google Sheets (Lead capture)

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project and enable the **Google Sheets API**.
2. Create a **Service Account** (IAM → Service Accounts → Create).
3. Download the JSON key file for that service account.
4. Copy the `client_email` value → `GOOGLE_SERVICE_ACCOUNT_EMAIL` in `.env.local`.
5. Copy the `private_key` value (the entire multi-line string) → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` in `.env.local`. Newlines must be literal `\n` or the full string wrapped in quotes.
6. Create a Google Sheets spreadsheet. Copy the spreadsheet ID from its URL (the long string between `/d/` and `/edit`). Set `GOOGLE_SHEETS_SPREADSHEET_ID`.
7. Share the spreadsheet with the service account email (Editor permission).

The first sheet (`Sheet1`) will receive rows: `[timestamp, nome, email, whatsapp]`.

> **Note:** If the Sheets write fails (missing env vars, network error, permission issue), the user is **not** blocked — they are redirected to `/obrigado` and the error is logged server-side. To make failures visible, check your Vercel/server logs.

---

## Analytics

- **GA4:** Set `NEXT_PUBLIC_GA_ID` to your Measurement ID (format: `G-XXXXXXXXXX`).
- **Meta Pixel:** Set `NEXT_PUBLIC_META_PIXEL_ID` to your Pixel ID.
- Both are optional. When not set, the scripts are not injected.
- Conversion events fired:
  - `Lead` — on `/obrigado` load and form submit on `/captura`
  - `InitiateCheckout` — when a user clicks Pro/Premium CTA
  - `CompleteRegistration` — on `/obrigado` page load

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `ASAAS_API_KEY` | Yes (for paid tiers) | Asaas API key |
| `ASAAS_API_URL` | No (defaults to sandbox) | Asaas API base URL |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | No (leads still logged) | Google Sheets spreadsheet ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | No | Service account email |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | No | Service account private key |
| `NEXT_PUBLIC_GA_ID` | No | GA4 Measurement ID |
| `NEXT_PUBLIC_META_PIXEL_ID` | No | Meta Pixel ID |
| `NEXT_PUBLIC_WHATSAPP_GROUP_URL` | Yes (for /obrigado CTA) | WhatsApp group invite link |
```

---

### Task 14: Build and commit

**Files:**
- Modify: none (verification step)

- [ ] **Step 1: Run build**

```bash
npm run build
```
Expected: zero TypeScript/ESLint errors, successful build output.

- [ ] **Step 2: Commit everything**

```bash
git add -A
git commit -m "feat: estrutura, rotas e integrações"
```
