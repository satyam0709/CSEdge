import TestAttempt from "../models/TestAttempt.js";
import User from "../models/user.js";
import { buildHeatmap, buildReadiness } from "../lib/adminAnalytics.js";

async function resolveUserId(req) {
  const qUserId = String(req.query.userId || "").trim();
  if (qUserId) return qUserId;
  return req.auth().userId;
}

function buildUserFilters(query) {
  const branch = String(query.branch || "").trim();
  const year = String(query.year || "").trim();
  const college = String(query.college || "").trim();
  const filter = {};

  if (branch) filter.branch = new RegExp(branch, "i");
  if (year) filter.year = new RegExp(year, "i");
  if (college) filter.college = new RegExp(college, "i");
  return filter;
}

function toCsvCell(value) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export const getSkillHeatmap = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    const days = Number(req.query.days || 120);
    const attempts = await TestAttempt.find({ userId }).select("type createdAt").lean();

    return res.json({
      success: true,
      userId,
      heatmap: buildHeatmap(attempts, days),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPredictivePlacementScore = async (req, res) => {
  try {
    const userId = await resolveUserId(req);
    const windowDays = Number(req.query.windowDays || 60);
    const attempts = await TestAttempt.find({ userId }).select("type isCorrect createdAt").lean();
    const readiness = buildReadiness(attempts, windowDays);

    return res.json({
      success: true,
      userId,
      readiness,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalyticsUserOptions = async (_req, res) => {
  try {
    const users = await User.find({})
      .select("_id name email imageUrl branch year college")
      .sort({ updatedAt: -1 })
      .limit(250)
      .lean();

    return res.json({
      success: true,
      users: users.map((u) => ({
        userId: u._id,
        name: u.name || "Unknown User",
        email: u.email || "",
        imageUrl: u.imageUrl || "",
        branch: u.branch || "",
        year: u.year || "",
        college: u.college || "",
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReadinessLeaderboard = async (req, res) => {
  try {
    const windowDays = Math.max(14, Math.min(365, Number(req.query.windowDays || 60)));
    const limit = Math.max(5, Math.min(200, Number(req.query.limit || 25)));
    const userFilters = buildUserFilters(req.query);
    const users = await User.find(userFilters)
      .select("_id name email imageUrl branch year college")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    const userIds = users.map((u) => String(u._id));
    const attempts = await TestAttempt.find({ userId: { $in: userIds } })
      .select("userId type isCorrect createdAt")
      .lean();

    const attemptsByUser = new Map();
    for (const attempt of attempts) {
      const uid = String(attempt.userId);
      if (!attemptsByUser.has(uid)) attemptsByUser.set(uid, []);
      attemptsByUser.get(uid).push(attempt);
    }

    const leaderboard = users
      .map((u) => {
        const readiness = buildReadiness(attemptsByUser.get(String(u._id)) || [], windowDays);
        return {
          userId: String(u._id),
          name: u.name || "Unknown User",
          email: u.email || "",
          imageUrl: u.imageUrl || "",
          branch: u.branch || "",
          year: u.year || "",
          college: u.college || "",
          readiness: readiness.readiness,
          label: readiness.label,
          attemptsConsidered: readiness.attemptsConsidered,
          companyTier: readiness.companyTier,
        };
      })
      .sort((a, b) => b.readiness - a.readiness);

    return res.json({
      success: true,
      windowDays,
      filters: {
        branch: String(req.query.branch || "").trim(),
        year: String(req.query.year || "").trim(),
        college: String(req.query.college || "").trim(),
      },
      leaderboard,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const exportReadinessLeaderboardCsv = async (req, res) => {
  try {
    const windowDays = Math.max(14, Math.min(365, Number(req.query.windowDays || 60)));
    const limit = Math.max(5, Math.min(5000, Number(req.query.limit || 500)));
    const userFilters = buildUserFilters(req.query);
    const users = await User.find(userFilters)
      .select("_id name email branch year college")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    const userIds = users.map((u) => String(u._id));
    const attempts = await TestAttempt.find({ userId: { $in: userIds } })
      .select("userId type isCorrect createdAt")
      .lean();

    const attemptsByUser = new Map();
    for (const attempt of attempts) {
      const uid = String(attempt.userId);
      if (!attemptsByUser.has(uid)) attemptsByUser.set(uid, []);
      attemptsByUser.get(uid).push(attempt);
    }

    const rows = users
      .map((u) => {
        const readiness = buildReadiness(attemptsByUser.get(String(u._id)) || [], windowDays);
        return {
          userId: String(u._id),
          name: u.name || "Unknown User",
          email: u.email || "",
          branch: u.branch || "",
          year: u.year || "",
          college: u.college || "",
          readiness: readiness.readiness,
          label: readiness.label,
          tier: readiness.companyTier?.tier || "",
          attempts: readiness.attemptsConsidered,
        };
      })
      .sort((a, b) => b.readiness - a.readiness);

    const header = [
      "rank",
      "userId",
      "name",
      "email",
      "branch",
      "year",
      "college",
      "readiness",
      "label",
      "tier",
      "attempts",
      "windowDays",
    ];
    const lines = [header.join(",")];
    rows.forEach((row, idx) => {
      lines.push(
        [
          idx + 1,
          row.userId,
          row.name,
          row.email,
          row.branch,
          row.year,
          row.college,
          row.readiness,
          row.label,
          row.tier,
          row.attempts,
          windowDays,
        ]
          .map(toCsvCell)
          .join(",")
      );
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="readiness-leaderboard-${timestamp}.csv"`
    );
    return res.status(200).send(lines.join("\n"));
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
