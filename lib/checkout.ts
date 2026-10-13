import { appendAttributionToUrl } from '@/lib/attribution';

export type PaidPlanKey = 'pro' | 'premium';

const PAGTRUST_CHECKOUT_URLS: Record<PaidPlanKey, string> = {
  pro: 'https://checkout.pagtrust.com.br/ck5b636b58?funnel=fn5b111e20',
  premium: 'https://checkout.pagtrust.com.br/cke9e8c7cf?funnel=fnceaaefaf',
};

export function getPagTrustCheckoutUrl(plan: PaidPlanKey) {
  return appendAttributionToUrl(PAGTRUST_CHECKOUT_URLS[plan]);
}
