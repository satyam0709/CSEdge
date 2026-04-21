import MentorSettings from "../models/MentorSettings.js";
import MentorSessionRequest from "../models/MentorSessionRequest.js";
import { isMentorSmtpConfigured, sendMentorEmail } from "../utils/sendMentorEmail.js";

const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function defaultAvailability() {
  return (
    process.env.MENTOR_AVAILABILITY_TEXT?.trim() ||
    "Example: Mon–Fri 6:00–8:00 PM IST — update this in Educator → 1:1 Mentor setup."
  );
}

export async function ensureMentorSettings() {
  let doc = await MentorSettings.findOne();
  if (!doc) {
    doc = await MentorSettings.create({
      notifyEmail: (process.env.MENTOR_NOTIFY_EMAIL || "").trim(),
      googleMeetLink: (process.env.MENTOR_GOOGLE_MEET_LINK || "").trim(),
      availabilityText: defaultAvailability(),
    });
  }
  return doc;
}

export async function getMentorPublicInfo(req, res) {
  try {
    const s = await ensureMentorSettings();
    return res.json({
      success: true,
      googleMeetLink: s.googleMeetLink || "",
      availabilityText: s.availabilityText || "",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export async function postMentorSessionRequest(req, res) {
  try {
    const fromName = String(req.body?.fromName || "").trim();
    const fromEmail = String(req.body?.fromEmail || "").trim();
    const topic = String(req.body?.topic || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!fromName || fromName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name (at least 2 characters).",
      });
    }
    if (!fromEmail || !EMAIL_RE.test(fromEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }
    if (!topic || topic.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Please add a short topic (e.g. resume, internships, DSA plan).",
      });
    }
    if (!message || message.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please describe your question in at least 10 characters.",
      });
    }

    const settings = await ensureMentorSettings();
    const row = await MentorSessionRequest.create({
      fromName,
      fromEmail,
      topic,
      message,
    });

    let emailed = false;
    const notifyTo = (settings.notifyEmail || "").trim();

    if (notifyTo && isMentorSmtpConfigured()) {
      const subject = `[LMS 1:1 Mentor] ${topic} — ${fromName}`;
      const text = [
        `New 1:1 career help request on your LMS.`,
        ``,
        `Name: ${fromName}`,
        `Email: ${fromEmail}`,
        `Topic: ${topic}`,
        ``,
        `Message:`,
        message,
        ``,
        `— Stored id: ${row._id}`,
      ].join("\n");

      try {
        await sendMentorEmail({
          to: notifyTo,
          subject,
          text,
        });
        emailed = true;
      } catch (mailErr) {
        console.error("[mentor] email send failed:", mailErr?.message || mailErr);
      }
    }

    return res.json({
      success: true,
      emailed,
      id: row._id,
      message: emailed
        ? "Your request was emailed to the mentor. They will get back to you soon."
        : notifyTo
          ? "Request saved. Email could not be sent (check server SMTP settings); the mentor can still see it in the dashboard."
          : "Request saved. The mentor will review it once their notification email is set in the educator dashboard.",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export async function getMentorSettingsAdmin(req, res) {
  try {
    const s = await ensureMentorSettings();
    return res.json({
      success: true,
      settings: {
        notifyEmail: s.notifyEmail || "",
        googleMeetLink: s.googleMeetLink || "",
        availabilityText: s.availabilityText || "",
        updatedAt: s.updatedAt,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export async function putMentorSettingsAdmin(req, res) {
  try {
    const notifyEmail = String(req.body?.notifyEmail ?? "").trim().slice(0, 320);
    const googleMeetLink = String(req.body?.googleMeetLink ?? "").trim().slice(0, 2000);
    const availabilityText = String(req.body?.availabilityText ?? "").trim().slice(0, 8000);

    if (notifyEmail && !EMAIL_RE.test(notifyEmail)) {
      return res.status(400).json({
        success: false,
        message: "Notification email looks invalid.",
      });
    }
    if (googleMeetLink && !/^https:\/\//i.test(googleMeetLink)) {
      return res.status(400).json({
        success: false,
        message: "Meet link should start with https://",
      });
    }

    await ensureMentorSettings();
    const s = await MentorSettings.findOneAndUpdate(
      {},
      { $set: { notifyEmail, googleMeetLink, availabilityText } },
      { new: true }
    );

    return res.json({
      success: true,
      settings: {
        notifyEmail: s.notifyEmail || "",
        googleMeetLink: s.googleMeetLink || "",
        availabilityText: s.availabilityText || "",
        updatedAt: s.updatedAt,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export async function listMentorSessionRequestsAdmin(req, res) {
  try {
    const limit = Math.min(
      200,
      Math.max(1, Number.parseInt(String(req.query?.limit || "80"), 10) || 80)
    );
    const rows = await MentorSessionRequest.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.json({ success: true, requests: rows });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}
