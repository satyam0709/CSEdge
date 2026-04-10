/**
 * Shared Gemini model ordering and retry policy (Flash-Prep + lecture chat).
 * Avoid defaulting to gemini-2.0-flash first — many free-tier keys show limit:0 on that model.
 */

export const DEFAULT_GEMINI_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

export function buildGeminiModelList() {
  const primary = process.env.GEMINI_MODEL?.trim();
  const extra = process.env.GEMINI_MODEL_FALLBACK?.trim();
  const ordered = [];
  const pushUnique = (m) => {
    if (m && !ordered.includes(m)) ordered.push(m);
  };
  if (primary) pushUnique(primary);
  if (extra) {
    for (const m of extra.split(",")) pushUnique(m.trim());
  }
  for (const m of DEFAULT_GEMINI_MODELS) pushUnique(m);
  return ordered;
}

export function isRetryableGeminiError(msg, httpStatus) {
  if (httpStatus === 503 || httpStatus === 429 || httpStatus === 504) return true;
  const s = String(msg || "").toLowerCase();
  return (
    s.includes("high demand") ||
    s.includes("try again later") ||
    s.includes("temporarily") ||
    s.includes("overloaded") ||
    s.includes("unavailable") ||
    s.includes("quota") ||
    s.includes("limit: 0") ||
    s.includes("resource_exhausted") ||
    s.includes("rate limit") ||
    s.includes("429") ||
    s.includes("not found") ||
    s.includes("does not exist") ||
    s.includes("404") ||
    s.includes("exceeded your current quota") ||
    s.includes("billing")
  );
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
