// app/quiz/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QUIZ_QUESTIONS, getProfile, QuizProfile } from '@/lib/quizData';
import { trackEvent } from '@/lib/analytics';
import { submitNetlifyForm } from '@/lib/netlifyForms';

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

const PROFILE_VISUALS: Record<
  QuizProfile['id'],
  { accent: string; badge: string; glow: string; icon: string }
> = {
  1: {
    accent: 'text-sky',
    badge: 'border-sky/30 bg-sky/10 text-sky',
    glow: 'bg-sky/20',
    icon: 'border-sky/40 bg-sky/10 text-sky',
  },
  2: {
    accent: 'text-sun',
    badge: 'border-sun/30 bg-sun/10 text-sun',
    glow: 'bg-sun/20',
    icon: 'border-sun/40 bg-sun/10 text-sun',
  },
  3: {
    accent: 'text-lime',
    badge: 'border-lime/30 bg-lime/10 text-lime',
    glow: 'bg-lime/20',
    icon: 'border-lime/40 bg-lime/10 text-lime',
  },
  4: {
    accent: 'text-paper',
    badge: 'border-paper/30 bg-paper/10 text-paper',
    glow: 'bg-paper/20',
    icon: 'border-paper/40 bg-paper/10 text-paper',
  },
};

function ProfileIcon({ profileId }: { profileId: QuizProfile['id'] }) {
  if (profileId === 1) {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 19V8.5a7 7 0 0 1 14 0V19M3 19h18M8 8.5h8M9 19v-5h6v5" />
      </svg>
    );
  }

  if (profileId === 2) {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" />
      </svg>
    );
  }

  if (profileId === 3) {
    return (
      <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19 19 4M11 4h8v8M5 8v11h11" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

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
    if (selectedOption !== null) return; // prevent double-click during auto-advance delay

    const question = QUIZ_QUESTIONS[currentIndex];
    const option = question.options[optionIndex];

    setSelectedOption(optionIndex);

    const newAnswers = [...answers];
    // Q1 segmentation: store the option text for CRM segmentation.
    // Q2–Q8: store points (4/3/2/1).
    newAnswers[currentIndex] = question.isSegmentation ? option.text : option.points;
    setAnswers(newAnswers);

    // Score only accumulates for non-segmentation questions (Q2–Q8)
    const newScore = question.isSegmentation ? score : score + option.points;
    setScore(newScore);

    // Auto-advance after brief visual feedback delay
    setTimeout(() => {
      setSelectedOption(null);
      if (currentIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        // All 8 questions answered — calculate profile before showing capture form
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

    // Non-blocking: API failure must NOT stop the user from seeing their result
    try {
      const res = await fetch('/api/quiz-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error('[quiz] Lead API error:', await res.text());
      }
    } catch (err) {
      console.error('[quiz] Lead submission error:', err);
    }

    try {
      await submitNetlifyForm('quiz-diagnostico', payload);
    } catch (err) {
      console.error('[quiz] Netlify Forms submission error:', err);
    }

    setSubmitting(false);

    // Fire analytics after the try/catch so it always runs, even on network errors
    trackEvent('QuizLead', { perfil: profile?.label });

    // Always advance to result, regardless of API outcome
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
    <main className="quiz-surface relative min-h-screen overflow-hidden text-cream" data-page="quiz">

      <div className="pointer-events-none fixed -left-24 top-16 h-64 w-64 rounded-full border border-lime/15 sm:h-96 sm:w-96" aria-hidden="true" />
      <div className="pointer-events-none fixed -right-20 bottom-10 h-48 w-48 rotate-12 border-[22px] border-sky/[0.07] sm:h-64 sm:w-64" aria-hidden="true" />

      {/* ═══════════════════════════════════════════════════════════════════
          INTRO SCREEN
      ═══════════════════════════════════════════════════════════════════ */}
      {screen === 'intro' && (
        <section
          className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 py-12 text-center sm:px-8 sm:py-20"
          data-screen="intro"
        >
          <div className="mx-auto flex max-w-3xl animate-quiz-enter flex-col items-center">
            <div className="mb-7 flex h-16 w-16 animate-float items-center justify-center rounded-2xl border border-lime/30 bg-lime/10 text-lime shadow-lime" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
              </svg>
            </div>
            <h1
              className="mb-6 font-display text-[clamp(3.5rem,14vw,6.5rem)] font-black uppercase leading-[0.82] tracking-[-0.035em] text-paper"
              data-quiz="headline"
            >
              Você governa sua vida ou sua vida governa você?
            </h1>
            <p className="mb-4 max-w-2xl text-lg font-bold leading-relaxed text-cream sm:text-2xl" data-quiz="subheadline">
              Faça o teste e descubra quanto do seu futuro está realmente nas suas mãos hoje.
            </p>
            <p className="mb-6 max-w-xl text-sm leading-6 text-cream/65 sm:text-base sm:leading-7" data-quiz="body">
              8 perguntas para você, que não nasceu em berço de ouro, descobrir o quanto está sendo
              vítima das circunstâncias e como resolver isso.
            </p>
            <p
              className="mb-8 rounded-full border border-cream/15 bg-cream/[0.06] px-5 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-lime backdrop-blur sm:mb-10"
              data-quiz="timing"
            >
              Tempo: 2 min
            </p>
            <button
              onClick={handleStart}
              className="group min-h-14 w-full max-w-sm animate-soft-pulse rounded-xl bg-lime px-8 py-4 font-display text-2xl font-black uppercase tracking-wide text-ink shadow-lime transition duration-300 hover:-translate-y-1 hover:bg-paper hover:shadow-2xl active:translate-y-0 sm:w-auto sm:min-w-80"
              data-cta="quiz-start"
            >
              COMECE AQUI <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          QUESTION SCREEN
      ═══════════════════════════════════════════════════════════════════ */}
      {screen === 'question' && (
        <section
          className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-16"
          data-screen="question"
        >
          <div className="mx-auto w-full max-w-3xl">

            <div className="mb-6 sm:mb-9" data-quiz="progress">
              <p className="mb-3 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-cream/65 sm:text-sm">
                Pergunta {currentIndex + 1} de {QUIZ_QUESTIONS.length}
              </p>
              <div
                className="h-2 w-full overflow-hidden rounded-full border border-cream/10 bg-cream/10 shadow-inner"
                data-progress-track
              >
                <div
                  className="relative h-full overflow-hidden rounded-full bg-lime shadow-lime transition-all duration-700 ease-out"
                  style={{
                    width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                  data-progress-fill
                >
                  <span className="absolute inset-y-0 left-0 w-1/3 animate-progress-shine skew-x-[-24deg] bg-paper/55" aria-hidden="true" />
                </div>
              </div>
              <div className="mt-3 flex justify-between px-0.5" aria-hidden="true">
                {QUIZ_QUESTIONS.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${index <= currentIndex ? 'w-5 bg-lime' : 'w-1.5 bg-cream/20'}`}
                  />
                ))}
              </div>
            </div>

            <div key={currentIndex} className="animate-quiz-enter rounded-3xl border border-cream/10 bg-ink/90 p-4 shadow-2xl backdrop-blur-sm sm:p-8">
              <h2
                className="mb-6 text-center font-display text-3xl font-black uppercase leading-[1.02] tracking-tight text-paper sm:mb-8 sm:text-5xl"
                data-quiz="question-text"
              >
                {question.text}
              </h2>

              <div className="flex flex-col gap-2.5 sm:gap-3" data-quiz="options">
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedOption !== null}
                    className={[
                      'group flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-semibold leading-snug transition duration-200 sm:px-5 sm:py-4 sm:text-base',
                      selectedOption === i
                        ? 'scale-[1.015] border-lime bg-lime font-extrabold text-ink shadow-lime'
                        : selectedOption !== null
                          ? 'border-cream/10 bg-cream/[0.03] text-cream/45'
                          : 'border-cream/20 bg-cream/[0.06] text-cream hover:-translate-y-0.5 hover:border-lime/60 hover:bg-cream/10',
                    ].join(' ')}
                    data-option={i}
                  >
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition duration-200 ${selectedOption === i ? 'border-ink bg-ink text-lime' : 'border-cream/30 bg-ink/20'}`} aria-hidden="true">
                      {selectedOption === i && (
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="m4 10 4 4 8-8" />
                        </svg>
                      )}
                    </span>
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          CAPTURE SCREEN
      ═══════════════════════════════════════════════════════════════════ */}
      {screen === 'capture' && (
        <section
          className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 py-12 sm:px-8 sm:py-20"
          data-screen="capture"
        >
          <div className="mx-auto w-full max-w-md animate-quiz-enter">
            <div className="relative mx-auto mb-6 flex h-20 w-20 animate-quiz-pop items-center justify-center rounded-full border border-lime/40 bg-lime/10 text-lime shadow-lime" aria-hidden="true">
              <span className="absolute inset-2 animate-soft-pulse rounded-full border border-lime/30" />
              <svg viewBox="0 0 24 24" className="relative h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="m5 12 4 4L19 6" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            </div>
            <h2
              className="mb-3 text-center font-display text-5xl font-black uppercase leading-[0.88] tracking-tight text-paper sm:text-6xl"
              data-quiz="capture-headline"
            >
              Seu resultado está pronto!
            </h2>
            <p className="mb-7 text-center text-base leading-relaxed text-cream/70" data-quiz="capture-sub">
              Deixe seus dados para receber seu diagnóstico:
            </p>

            <form
              onSubmit={handleCaptureSubmit}
              noValidate
              className="cream-paper flex flex-col gap-5 rounded-3xl border border-ink bg-paper p-5 text-ink shadow-2xl sm:p-8"
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
                  name="nome"
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
                  name="whatsapp"
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
                  name="email"
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
                className="mt-2 min-h-14 rounded-xl bg-lime px-6 py-4 font-display text-xl font-black uppercase tracking-wide text-ink shadow-lime transition duration-300 hover:-translate-y-1 hover:bg-forest hover:text-lime hover:shadow-2xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
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
          className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 py-10 sm:px-8 sm:py-20"
          data-screen="result"
        >
          <div className="mx-auto w-full max-w-3xl animate-quiz-enter">
            <div
              className="relative mb-6 overflow-hidden rounded-3xl border border-cream/15 bg-ink/90 p-5 text-paper shadow-2xl backdrop-blur-sm sm:mb-8 sm:p-10"
              data-quiz="result-card"
              data-profile={`perfil-${profile.id}`}
            >
              <div className={`pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl ${PROFILE_VISUALS[profile.id].glow}`} aria-hidden="true" />
              <div className="relative mb-6 flex items-start gap-4 border-b border-cream/10 pb-6 sm:items-center">
                <div className={`flex h-16 w-16 shrink-0 animate-quiz-pop items-center justify-center rounded-2xl border ${PROFILE_VISUALS[profile.id].icon}`} aria-hidden="true">
                  <ProfileIcon profileId={profile.id} />
                </div>
                <div>
                  <p className={`mb-2 inline-flex rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] ${PROFILE_VISUALS[profile.id].badge}`}>
                    Seu perfil
                  </p>
                  <h2
                    className={`font-display text-4xl font-black uppercase leading-[0.88] tracking-tight sm:text-6xl ${PROFILE_VISUALS[profile.id].accent}`}
                    data-quiz="profile-label"
                  >
                    {profile.label}
                  </h2>
                </div>
              </div>
              <div
                className="relative space-y-4 text-sm leading-7 text-cream/80 sm:text-base sm:leading-8"
                data-quiz="profile-body"
              >
                {profile.body.split('\n\n').map((paragraph, i) => {
                  // All-caps short lines (e.g. "ENTÃO COMO RESOLVER ISSO?") get emphasis
                  const isCallout =
                    paragraph.trim() === paragraph.trim().toUpperCase() &&
                    paragraph.trim().length < 80;
                  return (
                    <p key={i} className={isCallout ? `my-6 border-l-2 pl-4 font-black uppercase tracking-wide ${PROFILE_VISUALS[profile.id].accent}` : ''}>
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4" data-quiz="result-ctas">
              <button
                onClick={() => router.push('/obrigado')}
                className="min-h-14 flex-1 rounded-xl border-2 border-lime bg-transparent px-5 py-4 font-display text-lg font-black uppercase tracking-wide text-lime transition duration-300 hover:-translate-y-1 hover:bg-lime hover:text-ink active:translate-y-0 sm:text-xl"
                data-cta="quiz-free"
              >
                PARTICIPAR DE GRAÇA
              </button>
              <button
                onClick={handlePremiumCheckout}
                disabled={checkoutLoading}
                className="min-h-14 flex-1 rounded-xl bg-lime px-5 py-4 font-display text-lg font-black uppercase tracking-wide text-ink shadow-lime transition duration-300 hover:-translate-y-1 hover:bg-paper hover:shadow-2xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:text-xl"
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
