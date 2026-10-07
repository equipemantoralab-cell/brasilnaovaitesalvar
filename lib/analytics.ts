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
