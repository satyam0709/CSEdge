export function nameFromEmail(email, fallback = "Member") {
  const local = String(email || "").split("@")[0] || "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  return cleaned || fallback;
}

function isGenericName(name) {
  const n = String(name || "").trim().toLowerCase();
  return !n || n === "user" || n === "student" || n === "learner" || n === "member";
}

export function normalizeDisplayName({ fullName = "", username = "", email = "", fallback = "Member" } = {}) {
  const safeFull = String(fullName || "").trim();
  if (!isGenericName(safeFull)) return safeFull;
  const safeUser = String(username || "").trim();
  if (!isGenericName(safeUser)) return safeUser;
  return nameFromEmail(email, fallback);
}
