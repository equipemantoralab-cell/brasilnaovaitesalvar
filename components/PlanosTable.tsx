// components/PlanosTable.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PLANS } from '@/lib/plans';
import { trackEvent } from '@/lib/analytics';
import { getPagTrustCheckoutUrl } from '@/lib/checkout';

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

  function handleCta(planKey: PlanKey) {
    setError(null);
    if (planKey === 'start') {
      router.push('/captura');
      return;
    }

    setLoadingPlan(planKey);
    try {
      trackEvent('InitiateCheckout', { plan: planKey });
      window.location.assign(getPagTrustCheckoutUrl(planKey));
    } catch {
      setError('Não foi possível abrir o checkout. Tente novamente.');
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
            className="grid grid-cols-3 gap-2"
            aria-label="Escolha uma opção de ingresso"
          >
            {(['pro', 'start', 'premium'] as const).map((key) => {
              const isSelected = selectedPlan === key;
              const shortName = key === 'start' ? 'Start' : key === 'pro' ? 'Pro' : 'Premium';
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedPlan(key)}
                  className={`relative flex min-h-[118px] min-w-0 flex-col border-2 p-2.5 text-left transition duration-200 ${isSelected ? 'border-sun bg-ink text-paper shadow-[3px_3px_0_#f7ca45]' : 'border-ink/20 bg-paper text-ink'}`}
                  aria-pressed={isSelected}
                >
                  <span className="flex h-4 w-full items-start">
                    {key === 'pro' && (
                      <span className="max-w-full bg-sun px-1.5 py-0.5 text-[7px] font-black uppercase leading-none tracking-[0.04em] text-ink">
                      Mais escolhido
                      </span>
                    )}
                  </span>
                  <span className={`mt-1.5 block text-[8px] font-extrabold uppercase tracking-[0.1em] ${isSelected ? 'text-paper/65' : 'text-ink/55'}`}>
                    Ingresso
                  </span>
                  <span className={`mt-1 block whitespace-nowrap font-display uppercase leading-none ${key === 'premium' ? 'text-[1rem]' : 'text-[1.45rem]'} ${isSelected ? 'text-sun' : 'text-forest'}`}>
                    {shortName}
                  </span>
                  <span className={`mt-auto block whitespace-nowrap pr-6 pt-2 text-[12px] font-black leading-none ${isSelected ? 'text-paper' : 'text-ink'}`}>
                    {PLANS[key].priceLabel}
                  </span>
                  <span className={`absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 text-[10px] font-black ${isSelected ? 'border-sun bg-sun text-ink' : 'border-ink/20 text-transparent'}`} aria-hidden="true">
                    ✓
                  </span>
                </button>
              );
            })}
          </div>

          <article className="poster-card mt-3 overflow-hidden bg-paper text-ink" aria-live="polite">
            <header className="border-b border-ink/15 p-4">
              <span className="text-[9px] font-black uppercase tracking-[0.12em] text-forest">Ingresso selecionado</span>
              <h3 className="mt-1 font-display text-3xl uppercase leading-none text-ink">{PLANS[selectedPlan].name}</h3>
              <p className="mt-1 text-[11px] font-semibold text-ink/65">{PLANS[selectedPlan].badge}</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-2">
                <span className="text-2xl font-black text-ink">{PLANS[selectedPlan].priceLabel}</span>
                {selectedPlan === 'pro' && <span className="text-[9px] font-black uppercase tracking-wide text-forest">O mais escolhido</span>}
              </p>
            </header>

            <ul className="grid grid-cols-2">
              {features.map((feature) => {
                const value = feature[selectedPlan];
                const isIncluded = value !== '—';
                return (
                  <li key={feature.label} className={`flex min-h-[48px] gap-2 border-b border-ink/10 px-3 py-2.5 odd:border-r ${isIncluded ? 'text-ink' : 'bg-cream/55 text-ink/40'}`}>
                    <span className={`text-sm font-black leading-none ${isIncluded ? 'text-forest' : 'text-campaignRed/55'}`} aria-hidden="true">
                      {isIncluded ? '✓' : '×'}
                    </span>
                    <span className="min-w-0 flex-1">
                      <strong className="block text-[10px] font-extrabold leading-tight">{feature.label}</strong>
                      {isIncluded && <span className="mt-0.5 block text-[9px] font-semibold leading-tight text-ink/60">{value}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="bg-cream p-3">
              <button
                onClick={() => handleCta(selectedPlan)}
                disabled={loadingPlan !== null}
                className="min-h-11 w-full border-2 border-ink bg-sun px-4 py-3 text-xs font-black uppercase tracking-wide text-ink shadow-[4px_4px_0_#232324] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
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
