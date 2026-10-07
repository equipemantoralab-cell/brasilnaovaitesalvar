// lib/plans.ts
export type PlanKey = 'start' | 'pro' | 'premium';

export interface Plan {
  key: PlanKey;
  name: string;
  badge: string;
  price: number; // in BRL cents; 0 = free
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
