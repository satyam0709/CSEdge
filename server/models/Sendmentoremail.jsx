import nodemailer from "nodemailer";

export function isMentorSmtpConfigured() {
  return !!(
    process.env.MENTOR_SMTP_HOST?.trim() &&
    process.env.MENTOR_SMTP_USER?.trim() &&
    process.env.MENTOR_SMTP_PASS?.trim()
  );
}

let _transport = null;

function getTransport() {
  if (!_transport) {
    _transport = nodemailer.createTransport({
      host: process.env.MENTOR_SMTP_HOST,
      port: Number(process.env.MENTOR_SMTP_PORT) || 587,
      secure: process.env.MENTOR_SMTP_SECURE === "true",
      auth: {
        user: process.env.MENTOR_SMTP_USER,
        pass: process.env.MENTOR_SMTP_PASS,
      },
    });
  }
  return _transport;
}

export async function sendMentorEmail({ to, subject, text, html }) {
  await getTransport().sendMail({
    from: `"CSEdge Mentor" <${process.env.MENTOR_EMAIL_FROM || process.env.MENTOR_SMTP_USER}>`,
    to,
    subject,
    text,
    ...(html ? { html } : {}),
  });
}