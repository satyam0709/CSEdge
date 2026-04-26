import { clerkClient } from "@clerk/express";

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
  const allowed = parseAllowedEmails();
  if (!allowed.size) return false;
  const email = await getRequesterEmail(userId);
  return Boolean(email && allowed.has(email));
}
