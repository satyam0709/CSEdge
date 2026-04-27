import { clerkClient } from "@clerk/express";

/** Comma-separated allowlist. If empty/unset, any signed-in user can use BPSC (set to restrict). */
function parseAllowedEmails() {
  const raw = String(process.env.BPSC_ALLOWED_EMAILS || "");
  return new Set(
    raw
      .split(",")
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function getRequesterEmail(userId) {
  if (!userId) return "";
  try {
    const user = await clerkClient.users.getUser(String(userId));
    return String(user.emailAddresses?.[0]?.emailAddress || "").trim().toLowerCase();
  } catch {
    return "";
  }
}

export async function hasBpscAccess(userId) {
  if (!userId) return false;
  const allowed = parseAllowedEmails();
  if (!allowed.size) return true;
  const email = await getRequesterEmail(userId);
  return Boolean(email && allowed.has(email));
}
