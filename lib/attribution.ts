export const ATTRIBUTION_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
  'ttclid',
] as const;

export const ATTRIBUTION_HEADERS = [
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'UTM Term',
  'UTM Content',
  'Facebook Click ID',
  'Google Click ID',
  'TikTok Click ID',
] as const;

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];
export type AttributionData = Partial<Record<AttributionField, string>>;

const ATTRIBUTION_STORAGE_KEY = 'brasil-attribution-params';

function readStoredParams() {
  if (typeof window === 'undefined') return new URLSearchParams();
  const stored = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
  return stored ? new URLSearchParams(stored) : new URLSearchParams();
}

export function captureAttribution(searchParams?: URLSearchParams) {
  if (typeof window === 'undefined') return new URLSearchParams();

  const current = searchParams ?? new URLSearchParams(window.location.search);
  const incoming = new URLSearchParams();

  ATTRIBUTION_FIELDS.forEach((field) => {
    const value = current.get(field)?.trim();
    if (value) incoming.set(field, value);
  });

  if (Array.from(incoming).length === 0) return readStoredParams();

  const hasNewUtm = ATTRIBUTION_FIELDS.some(
    (field) => field.startsWith('utm_') && incoming.has(field)
  );
  const params = hasNewUtm ? new URLSearchParams() : readStoredParams();

  incoming.forEach((value, key) => params.set(key, value));
  window.sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, params.toString());
  return params;
}

export function getAttributionData(): AttributionData {
  const params = captureAttribution();
  const data: AttributionData = {};

  ATTRIBUTION_FIELDS.forEach((field) => {
    const value = params.get(field);
    if (value) data[field] = value;
  });

  return data;
}

export function getAttributionValues(data: Record<string, unknown>) {
  return ATTRIBUTION_FIELDS.map((field) => {
    const value = data[field];
    return typeof value === 'string' ? value.trim() : '';
  });
}

export function appendAttributionToUrl(rawUrl: string) {
  const url = new URL(rawUrl);
  const params = captureAttribution();

  params.forEach((value, key) => url.searchParams.set(key, value));
  return url.toString();
}
