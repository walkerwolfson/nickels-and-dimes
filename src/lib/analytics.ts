// Thin client-side wrapper around the GA4 gtag queue set up by
// <GoogleAnalytics> in app/layout.tsx. Safe to call anywhere on the client;
// it no-ops during SSR or if GA hasn't loaded (ad blockers, dev).

type GtagParams = Record<string, string | number | boolean | undefined>;

export function track(event: string, params?: GtagParams): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", event, params ?? {});
}
