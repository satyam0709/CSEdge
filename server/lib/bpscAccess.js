import { clerkClient } from "@clerk/express";

const HARDCODED_ALLOWED_BPSC_EMAILS = new Set([
  "shivamsinghpatna09@gmail.com",
]);

function parseAllowedEmails() {
  const raw = String(process.env.BPSC_ALLOWED_EMAILS || "");
  const fromEnv = new Set(
    raw
      .split(",")
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean)
  );
  HARDCODED_ALLOWED_BPSC_EMAILS.forEach((email) => fromEnv.add(email));
  return fromEnv;
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
