// components/PlanosTable.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PLANS } from '@/lib/plans';
import { trackEvent } from '@/lib/analytics';

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
      className="hero-surface relative px-5 py-20 text-cream sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center font-display text-6xl font-black uppercase leading-none tracking-tight text-paper sm:mb-16 sm:text-8xl">Escolha seu ingresso</h2>

        {error && (
          <p role="alert" className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-300/40 bg-red-950/60 p-4 text-center text-sm font-bold text-red-100" data-state="error">
            {error}
          </p>
        )}

        <div className="-mx-5 overflow-x-auto px-5 pb-5 sm:mx-0 sm:px-0">
          <table className="min-w-[780px] w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-cream/10 bg-paper text-ink shadow-2xl" data-table="planos">
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
                    className={`min-h-12 w-full rounded-xl px-4 py-3 text-xs font-black tracking-wide transition duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${key === 'pro' ? 'bg-forest text-lime shadow-lg hover:bg-ink' : 'border-2 border-forest bg-transparent text-forest hover:bg-forest hover:text-cream'}`}
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
