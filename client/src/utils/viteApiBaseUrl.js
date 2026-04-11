/**
 * Canonical: VITE_API_URL. Alias: VITE_BACKEND_URL (used on some Vercel projects).
 * Returns trimmed origin with no trailing slash, or "" if unset.
 */
export function viteConfiguredApiBase() {
  const raw =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_BACKEND_URL ||
    "";
  return String(raw).trim().replace(/\/+$/, "");
}
