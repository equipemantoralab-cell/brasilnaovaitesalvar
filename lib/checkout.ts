export type PaidPlanKey = 'pro' | 'premium';

const PAGTRUST_CHECKOUT_URLS: Record<PaidPlanKey, string> = {
  pro: 'https://checkout.pagtrust.com.br/ck5b636b58?funnel=fn5b111e20',
  premium: 'https://checkout.pagtrust.com.br/cke9e8c7cf?funnel=fnceaaefaf',
};

const ATTRIBUTION_STORAGE_KEY = 'brasil-attribution-params';

function isAttributionParam(key: string) {
  return key.startsWith('utm_') || ['fbclid', 'gclid', 'ttclid'].includes(key);
}

function getAttributionParams() {
  const params = new URLSearchParams();
  if (typeof window === 'undefined') return params;

  const currentParams = new URLSearchParams(window.location.search);
  currentParams.forEach((value, key) => {
    if (isAttributionParam(key)) params.set(key, value);
  });

  if (Array.from(params).length > 0) {
    window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, params.toString());
    return params;
  }

  const savedParams = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
  return savedParams ? new URLSearchParams(savedParams) : params;
}

export function getPagTrustCheckoutUrl(plan: PaidPlanKey) {
  const checkoutUrl = new URL(PAGTRUST_CHECKOUT_URLS[plan]);
  getAttributionParams().forEach((value, key) => {
    checkoutUrl.searchParams.set(key, value);
  });
  return checkoutUrl.toString();
}
