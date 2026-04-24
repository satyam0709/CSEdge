import TestAttempt from "../models/TestAttempt.js";
import User from "../models/user.js";
import { clerkClient } from "@clerk/express";

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function normalizeDateRange(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function computeRankScore({ attempts, correct, accuracy, avgLevel, typesCovered }) {
  // Balanced, gamified but skill-first scoring.
  const accuracyBoost = accuracy * 0.55;
  const consistencyBoost = Math.min(attempts, 50) * 1.1;
  const correctnessBoost = correct * 1.4;
  const difficultyBoost = avgLevel * 1.8;
  const coverageBoost = typesCovered * 12;
  return Number(
    (accuracyBoost + consistencyBoost + correctnessBoost + difficultyBoost + coverageBoost).toFixed(
      2
    )
  );
}

function isGenericName(name) {
  const n = String(name || "").trim().toLowerCase();
  return !n || n === "student" || n === "user" || n === "learner";
}

function nameFromEmail(email) {
  const local = String(email || "").split("@")[0] || "";
  const cleaned = local.replace(/[._-]+/g, " ").trim();
  return cleaned || "Student";
}

async function fetchClerkProfiles(userIds) {
  const out = new Map();
  if (!Array.isArray(userIds) || userIds.length === 0) return out;
  try {
    const clerkUsers = await clerkClient.users.getUserList({ userId: userIds, limit: userIds.length });
    for (const cu of clerkUsers?.data || []) {
      const email = cu.emailAddresses?.[0]?.emailAddress || "";
      const full = `${cu.firstName || ""} ${cu.lastName || ""}`.trim();
      const name = full || cu.username || nameFromEmail(email) || "Student";
      out.set(String(cu.id), {
        name,
        email,
        imageUrl: cu.imageUrl || "",
      });
    }
  } catch {
    // Keep graceful fallback to Mongo profile data.
  }
  return out;
}

export async function buildSprintLeaderboard({
  startDate,
  endDate,
  limit = 50,
  featuredCount = 5,
}) {
  const { start, end } = normalizeDateRange(startDate, endDate);
  const safeLimit = clamp(Number(limit) || 50, 5, 500);
  const safeFeatured = clamp(Number(featuredCount) || 5, 1, 20);

  const attempts = await TestAttempt.find({
    createdAt: { $gte: start, $lte: end },
  })
    .select("userId type isCorrect level createdAt")
    .lean();

  const perUser = new Map();
  for (const a of attempts) {
    const uid = String(a.userId || "");
    if (!uid) continue;
    if (!perUser.has(uid)) {
      perUser.set(uid, {
        userId: uid,
        attempts: 0,
        correct: 0,
        levelSum: 0,
        typeSet: new Set(),
        daySet: new Set(),
      });
    }
    const row = perUser.get(uid);
    row.attempts += 1;
    if (a.isCorrect) row.correct += 1;
    row.levelSum += Number(a.level || 1);
    row.typeSet.add(String(a.type || "unknown"));
    row.daySet.add(new Date(a.createdAt).toISOString().slice(0, 10));
  }

  const userIds = Array.from(perUser.keys());
  const users = await User.find({ _id: { $in: userIds } })
    .select("_id name email imageUrl")
    .lean();
  const userMap = new Map(users.map((u) => [String(u._id), u]));
  const clerkProfiles = await fetchClerkProfiles(userIds);

  const leaderboard = Array.from(perUser.values())
    .map((row) => {
      const accuracy = row.attempts ? (row.correct / row.attempts) * 100 : 0;
      const avgLevel = row.attempts ? row.levelSum / row.attempts : 0;
      const typesCovered = row.typeSet.size;
      const activeDays = row.daySet.size;
      const score = computeRankScore({
        attempts: row.attempts,
        correct: row.correct,
        accuracy,
        avgLevel,
        typesCovered,
      });
      const profile = userMap.get(row.userId) || {};
      const clerkProfile = clerkProfiles.get(row.userId) || {};
      const chosenName = !isGenericName(profile?.name)
        ? profile.name
        : !isGenericName(clerkProfile?.name)
          ? clerkProfile.name
          : nameFromEmail(profile?.email || clerkProfile?.email);
      const chosenImage = profile?.imageUrl || clerkProfile?.imageUrl || "";

      return {
        userId: row.userId,
        name: chosenName || "Student",
        imageUrl: chosenImage,
        attempts: row.attempts,
        correct: row.correct,
        accuracy: Number(accuracy.toFixed(2)),
        avgLevel: Number(avgLevel.toFixed(2)),
        activeDays,
        typesCovered,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, safeLimit)
    .map((row, idx) => ({ ...row, rank: idx + 1 }));

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    leaderboard,
    featured: leaderboard.slice(0, safeFeatured),
    totalParticipants: perUser.size,
  };
}
