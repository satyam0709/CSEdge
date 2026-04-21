import MentorSettings from "../models/MentorSettings.js";
import MentorSessionRequest from "../models/MentorSessionRequest.js";
import {
  isMentorSmtpConfigured,
  sendMentorEmail,
} from "../utils/sendMentorEmail.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function defaultAvailability() {
  return (
    process.env.MENTOR_AVAILABILITY_TEXT?.trim() ||
    "Mon–Fri 6:00–8:00 PM IST — update this in Educator → 1:1 Mentor setup."
  );
}

export async function ensureMentorSettings() {
  let doc = await MentorSettings.findOne();
  if (!doc) {
    doc = await MentorSettings.create({
      notifyEmail: (process.env.MENTOR_NOTIFY_EMAIL || "").trim(),
      googleMeetLink: (process.env.MENTOR_GOOGLE_MEET_LINK || "").trim(),
      availabilityText: defaultAvailability(),
      isLive: false,
    });
  }
  return doc;
}

// ─── Public (student-facing) ──────────────────────────────────────────────────

export async function getMentorPublicInfo(req, res) {
  try {
    const s = await ensureMentorSettings();
    return res.json({
      success: true,
      googleMeetLink: s.googleMeetLink || "",
      availabilityText: s.availabilityText || "",
      isLive: s.isLive,
      updatedAt: s.updatedAt,
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

    if (!fromName || fromName.length < 2)
      return res.status(400).json({ success: false, message: "Name must be at least 2 characters." });
    if (!fromEmail || !EMAIL_RE.test(fromEmail))
      return res.status(400).json({ success: false, message: "Enter a valid email address." });
    if (!topic || topic.length < 3)
      return res.status(400).json({ success: false, message: "Topic must be at least 3 characters." });
    if (!message || message.length < 10)
      return res.status(400).json({ success: false, message: "Message must be at least 10 characters." });

    const settings = await ensureMentorSettings();
    const row = await MentorSessionRequest.create({ fromName, fromEmail, topic, message });

    let emailed = false;
    const notifyTo = (settings.notifyEmail || "").trim();

    if (notifyTo && isMentorSmtpConfigured()) {
      const subject = `[1:1 Mentor] ${topic} — from ${fromName}`;
      const text = [
        `New 1:1 career help request.`,
        ``,
        `Name    : ${fromName}`,
        `Email   : ${fromEmail}`,
        `Topic   : ${topic}`,
        ``,
        `Message :`,
        message,
        ``,
        `— Request ID: ${row._id}`,
        `— Review in your educator dashboard.`,
      ].join("\n");

      try {
        await sendMentorEmail({ to: notifyTo, subject, text });
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
        ? "Request sent. The mentor has been notified and will get back to you."
        : notifyTo
          ? "Request saved. Email notification failed — the mentor can still see it in their dashboard."
          : "Request saved. The mentor will review it in their dashboard.",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

// ─── Admin (educator-facing) ───────────────────────────────────────────────────

export async function getMentorSettingsAdmin(req, res) {
  try {
    const s = await ensureMentorSettings();
    return res.json({
      success: true,
      settings: {
        notifyEmail: s.notifyEmail || "",
        googleMeetLink: s.googleMeetLink || "",
        availabilityText: s.availabilityText || "",
        isLive: s.isLive,
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

    if (notifyEmail && !EMAIL_RE.test(notifyEmail))
      return res.status(400).json({ success: false, message: "Notification email is invalid." });
    if (googleMeetLink && !/^https:\/\//i.test(googleMeetLink))
      return res.status(400).json({ success: false, message: "Meet link must start with https://" });

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
        isLive: s.isLive,
        updatedAt: s.updatedAt,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export async function patchMentorLiveStatus(req, res) {
  try {
    const isLive = Boolean(req.body?.isLive);
    await ensureMentorSettings();
    const s = await MentorSettings.findOneAndUpdate(
      {},
      { $set: { isLive } },
      { new: true }
    );
    return res.json({ success: true, isLive: s.isLive });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export async function listMentorSessionRequestsAdmin(req, res) {
  try {
    const limit = Math.min(200, Math.max(1, parseInt(req.query?.limit || "100", 10) || 100));
    const statusFilter = req.query?.status;
    const query = statusFilter && ["pending", "seen", "resolved"].includes(statusFilter)
      ? { status: statusFilter }
      : {};

    const rows = await MentorSessionRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const counts = await MentorSessionRequest.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusCounts = { pending: 0, seen: 0, resolved: 0 };
    for (const c of counts) statusCounts[c._id] = c.count;

    return res.json({ success: true, requests: rows, counts: statusCounts });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}

export async function patchMentorRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const status = String(req.body?.status || "").trim();
    if (!["pending", "seen", "resolved"].includes(status))
      return res.status(400).json({ success: false, message: "Invalid status value." });

    const row = await MentorSessionRequest.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!row) return res.status(404).json({ success: false, message: "Request not found." });

    return res.json({ success: true, request: row });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}