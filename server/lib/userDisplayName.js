export function nameFromEmail(email, fallback = "Member") {
  const local = String(email || "").split("@")[0] || "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  return cleaned || fallback;
}

export function normalizeDisplayName({ fullName = "", username = "", email = "", fallback = "Member" } = {}) {
  const safeFull = String(fullName || "").trim();
  if (safeFull) return safeFull;
  const safeUser = String(username || "").trim();
  if (safeUser) return safeUser;
  return nameFromEmail(email, fallback);
}
