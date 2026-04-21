import nodemailer from "nodemailer";

export function isMentorSmtpConfigured() {
  return !!(
    process.env.MENTOR_SMTP_HOST &&
    process.env.MENTOR_SMTP_USER &&
    process.env.MENTOR_SMTP_PASS &&
    process.env.MENTOR_EMAIL_FROM
  );
}

/**
 * Sends one email. Throws on SMTP failure (caller should catch).
 * @param {{ to: string; subject: string; text: string; html?: string }} opts
 */
export async function sendMentorEmail({ to, subject, text, html }) {
  if (!isMentorSmtpConfigured()) {
    throw new Error("Mentor SMTP is not configured");
  }
  const transporter = nodemailer.createTransport({
    host: process.env.MENTOR_SMTP_HOST,
    port: Number(process.env.MENTOR_SMTP_PORT || 587),
    secure: process.env.MENTOR_SMTP_SECURE === "true",
    auth: {
      user: process.env.MENTOR_SMTP_USER,
      pass: process.env.MENTOR_SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.MENTOR_EMAIL_FROM,
    to,
    subject,
    text,
    html: html || undefined,
  });
}
