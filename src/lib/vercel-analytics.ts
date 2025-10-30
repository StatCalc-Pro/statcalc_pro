// Lightweight wrapper for Vercel RUM / Analytics.
// This file doesn't assume a specific global name — it checks common
// globals and fails silently when the script isn't present.

type AnyWindow = Window & {
  __VERCEL_INSIGHTS__?: any;
  vercelAnalytics?: any;
};

const getGlobal = () => {
  const w = window as AnyWindow;
  return w.__VERCEL_INSIGHTS__ || w.vercelAnalytics || null;
};

export function trackPageview(url?: string) {
  const g = getGlobal();
  if (!g) return;
  // Different snippets expose different APIs. Try common patterns.
  try {
    if (typeof g.page === "function") return g.page(url);
    if (typeof g.track === "function") return g.track("pageview", { url });
    if (typeof g.event === "function") return g.event("pageview", { url });
  } catch (e) {
    // swallow errors — analytics must not break app
    // eslint-disable-next-line no-console
    console.debug("Vercel analytics track pageview failed", e);
  }
}

export function trackEvent(name: string, payload?: Record<string, any>) {
  const g = getGlobal();
  if (!g) {
    // no-op fallback so calling code doesn't have to check
    // eslint-disable-next-line no-console
    console.debug("Vercel analytics unavailable, event:", name, payload);
    return;
  }
  try {
    if (typeof g.event === "function") return g.event(name, payload);
    if (typeof g.track === "function") return g.track(name, payload);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.debug("Vercel analytics track event failed", e);
  }
}

export default { trackPageview, trackEvent };
