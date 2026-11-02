export const API_BASE = (() => {
  // For SSR or build-time, allow an explicit Vite env override (VITE_API_BASE)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (import.meta as any).env;
    if (env && env.VITE_API_BASE) return env.VITE_API_BASE;
  } catch (e) {
    /* ignore */
  }

  // In the browser, use relative paths so Vite dev proxy handles /api/* in dev,
  // and Vercel serverless routes serve /api/* on the same origin without CORS issues.
  return "";
})();

export function apiPath(path: string) {
  // ensure path starts with '/'
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}
