// components/PlanosTable.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PLANS } from '@/lib/plans';
import { trackEvent } from '@/lib/analytics';

type PlanKey = 'start' | 'pro' | 'premium';

const features: Array<{ label: string; start: string; pro: string; premium: string }> = [
  {
    label: 'Acesso',
    start: '1 vaga no evento + grupo VIP',
    pro: '1 vaga no evento + grupo VIP',
    premium: '1 vaga no evento + grupo VIP',
  },
  {
    label: 'Plano de Governo Pessoal',
    start: 'Material preenchível',
    pro: 'Material preenchível',
    premium: 'Material preenchível',
  },
  {
    label: 'Mapa de Competências Valiosas',
    start: '—',
    pro: 'Incluso',
    premium: 'Incluso',
  },
  {
    label: 'Agente Mentor Profissional',
    start: '—',
    pro: 'IA exclusiva inclusa',
    premium: 'IA exclusiva inclusa',
  },
  {
    label: 'Gravação do evento',
    start: '—',
    pro: 'Por 30 dias',
    premium: 'Por 120 dias',
  },
  {
    label: 'Kit Anti-Procrastinação',
    start: '—',
    pro: 'Incluso',
    premium: 'Incluso',
  },
  { label: 'Guia do aumento', start: '—', pro: '—', premium: 'Incluso' },
  {
    label: 'Revisão do Plano de Governo',
    start: '—',
    pro: '—',
    premium: 'Inclusa',
  },
  {
    label: 'Plataforma Vida na Bala',
    start: '—',
    pro: '—',
    premium: '1 mês grátis',
  },
];

export default function PlanosTable() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('pro');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCta(planKey: PlanKey) {
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
      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Erro ao iniciar checkout. Tente novamente.');
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
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
      className="relative overflow-hidden bg-campaignRed px-5 py-20 text-cream sm:px-8 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[url('/brand/textura-grunge.webp')] bg-[length:480px_480px] opacity-20 mix-blend-multiply" aria-hidden="true" />
      <div className="mx-auto max-w-6xl">
        <div className="relative mb-12 text-center sm:mb-16">
          <span className="inline-block rotate-[-1deg] bg-forest px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-paper">O evento é gratuito. Você escolhe como quer participar.</span>
          <h2 className="mt-5 font-display text-7xl uppercase leading-none text-paper sm:text-9xl">Escolha seu ingresso</h2>
        </div>

        {error && (
          <p role="alert" className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-300/40 bg-red-950/60 p-4 text-center text-sm font-bold text-red-100" data-state="error">
            {error}
          </p>
        )}

        <div className="sm:hidden">
          <div
            className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Escolha uma opção de ingresso"
          >
            {(['pro', 'start', 'premium'] as const).map((key) => {
              const isSelected = selectedPlan === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPlan(key)}
                  className={`relative min-w-[72%] snap-start border-2 p-5 text-left transition duration-200 ${isSelected ? 'border-sun bg-ink text-paper shadow-[6px_6px_0_#f7ca45]' : 'border-ink/20 bg-paper text-ink shadow-[4px_4px_0_rgba(35,35,36,0.22)]'}`}
                  aria-pressed={isSelected}
                >
                  {key === 'pro' && (
                    <span className="absolute -top-3 left-4 bg-sun px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-ink">
                      Mais escolhido
                    </span>
                  )}
                  <span className={`block text-[11px] font-extrabold uppercase tracking-[0.16em] ${isSelected ? 'text-paper/65' : 'text-ink/55'}`}>
                    Ingresso
                  </span>
                  <span className={`mt-2 block font-display text-4xl uppercase leading-none ${isSelected ? 'text-sun' : 'text-forest'}`}>
                    {PLANS[key].name}
                  </span>
                  <span className={`mt-4 block text-xl font-black ${isSelected ? 'text-paper' : 'text-ink'}`}>
                    {PLANS[key].priceLabel}
                  </span>
                  <span className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border-2 text-lg font-black ${isSelected ? 'border-sun bg-sun text-ink' : 'border-ink/20 text-transparent'}`} aria-hidden="true">
                    ✓
                  </span>
                </button>
              );
            })}
          </div>

          <article className="poster-card mt-4 overflow-hidden bg-paper text-ink" aria-live="polite">
            <header className="border-b border-ink/15 p-6">
              <span className="text-xs font-black uppercase tracking-[0.14em] text-forest">Ingresso selecionado</span>
              <h3 className="mt-2 font-display text-5xl uppercase leading-none text-ink">{PLANS[selectedPlan].name}</h3>
              <p className="mt-2 text-sm font-semibold text-ink/65">{PLANS[selectedPlan].badge}</p>
              <p className="mt-6 flex flex-wrap items-baseline gap-2">
                <span className="text-4xl font-black text-ink">{PLANS[selectedPlan].priceLabel}</span>
                {selectedPlan === 'pro' && <span className="text-xs font-black uppercase tracking-wide text-forest">O mais escolhido</span>}
              </p>
            </header>

            <ul>
              {features.map((feature) => {
                const value = feature[selectedPlan];
                const isIncluded = value !== '—';
                return (
                  <li key={feature.label} className={`flex gap-3 border-b border-ink/10 px-6 py-4 ${isIncluded ? 'text-ink' : 'bg-cream/55 text-ink/40'}`}>
                    <span className={`mt-0.5 text-xl font-black leading-none ${isIncluded ? 'text-forest' : 'text-campaignRed/55'}`} aria-hidden="true">
                      {isIncluded ? '✓' : '×'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block text-sm font-extrabold leading-snug">{feature.label}</strong>
                      {isIncluded && <span className="mt-1 block text-xs font-semibold text-ink/60">{value}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="bg-cream p-5">
              <button
                onClick={() => handleCta(selectedPlan)}
                disabled={loadingPlan !== null}
                className="min-h-14 w-full border-2 border-ink bg-sun px-5 py-4 text-sm font-black uppercase tracking-wide text-ink shadow-[5px_5px_0_#232324] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                data-cta={`plano-${selectedPlan}-mobile`}
              >
                {loadingPlan === selectedPlan ? 'Aguarde...' : PLANS[selectedPlan].cta}
              </button>
            </div>
          </article>
        </div>

        <div className="hidden overflow-x-auto pb-5 sm:block">
          <table className="poster-card relative min-w-[780px] w-full border-separate border-spacing-0 overflow-hidden bg-paper text-ink" data-table="planos">
          <thead>
            <tr className="bg-cream">
              <th className="w-[25%] border-b border-ink/10 p-5 text-left text-xs font-extrabold uppercase tracking-[0.14em] text-ink/60">Benefício</th>
              {(['start', 'pro', 'premium'] as const).map((key) => (
                <th key={key} className={`relative border-b border-l border-ink/10 p-5 text-center ${key === 'pro' ? 'bg-lime' : ''}`} data-plan={key}>
                  <div className={key === 'pro' ? 'scale-105' : ''}>
                    <span className="block font-display text-3xl font-black uppercase leading-none text-forest">{PLANS[key].name}</span>
                    <span className="mt-2 block text-[11px] font-bold uppercase tracking-wide text-ink/55">({PLANS[key].badge})</span>
                    <span className="mt-3 block text-xl font-black text-ink">{PLANS[key].priceLabel}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.label} className="odd:bg-paper even:bg-cream/60">
                <td className="border-b border-ink/[0.08] p-4 text-sm font-extrabold">{f.label}</td>
                <td className="border-b border-l border-ink/[0.08] p-4 text-center text-sm font-medium text-ink/70">{f.start}</td>
                <td className="border-b border-l border-ink/[0.08] bg-lime/[0.12] p-4 text-center text-sm font-bold text-forest">{f.pro}</td>
                <td className="border-b border-l border-ink/[0.08] p-4 text-center text-sm font-medium text-ink/70">{f.premium}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-cream">
              <td className="p-4" />
              {(['start', 'pro', 'premium'] as const).map((key) => (
                <td key={key} className={`border-l border-ink/10 p-4 text-center ${key === 'pro' ? 'bg-lime/30' : ''}`}>
                  <button
                    onClick={() => handleCta(key)}
                    disabled={loadingPlan !== null}
                    className={`min-h-12 w-full border-2 border-ink px-4 py-3 text-xs font-black uppercase tracking-wide transition duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${key === 'pro' ? 'bg-forest text-paper shadow-[5px_5px_0_#232324] hover:bg-ink' : 'bg-sun text-ink shadow-[5px_5px_0_#232324] hover:bg-campaignRed hover:text-paper'}`}
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
      </div>
    </section>
  );
}
