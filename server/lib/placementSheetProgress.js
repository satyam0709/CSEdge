export const PLACEMENT_SHEET_META = {
  striverSde191: {
    key: "striverSde191",
    title: "Striver SDE Sheet",
    total: 191,
    href: "https://takeuforward.org/dsa/strivers-sde-sheet-top-coding-interview-problems",
  },
  striverA2z451: {
    key: "striverA2z451",
    title: "Striver A2Z Sheet",
    total: 451,
    href: "https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z",
  },
  blind75: {
    key: "blind75",
    title: "Blind 75",
    total: 75,
    href: "https://takeuforward.org/dsa/blind-75-leetcode-problems-detailed-video-solutions",
  },
  loveBabbar450: {
    key: "loveBabbar450",
    title: "Love Babbar 450",
    total: 450,
    href: "https://docs.google.com/spreadsheets/d/1AwCIidxvuZ241A1g6fzJ9SuyA2sVHKd4/edit?usp=sharing&ouid=102783754980211739433&rtpof=true&sd=true",
  },
};

export const PLACEMENT_SHEET_KEYS = Object.keys(PLACEMENT_SHEET_META);

function isoDayUTC(value = new Date()) {
  const d = value instanceof Date ? value : new Date(value);
  return d.toISOString().slice(0, 10);
}

function computeStreak(activityDays = [], today = new Date()) {
  const daySet = new Set((activityDays || []).map((d) => String(d)));
  let streak = 0;
  let cursor = new Date(today);
  cursor.setUTCHours(0, 0, 0, 0);
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!daySet.has(key)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

export function buildPlacementSheetSnapshot(doc) {
  const rows = PLACEMENT_SHEET_KEYS.map((key) => {
    const meta = PLACEMENT_SHEET_META[key];
    const completedRaw = Number(doc?.sheets?.[key] ?? 0);
    const completed = Math.min(meta.total, Math.max(0, Number.isFinite(completedRaw) ? completedRaw : 0));
    const percent = Math.round((completed / meta.total) * 100);
    return {
      key,
      title: meta.title,
      href: meta.href,
      total: meta.total,
      completed,
      percent,
      remaining: meta.total - completed,
    };
  });

  const totalSolved = rows.reduce((acc, row) => acc + row.completed, 0);
  const totalQuestions = rows.reduce((acc, row) => acc + row.total, 0);
  const overallPercent = totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0;
  const dailyTargetRaw = Number(doc?.dailyTarget ?? 5);
  const dailyTarget = Math.min(300, Math.max(1, Number.isFinite(dailyTargetRaw) ? Math.trunc(dailyTargetRaw) : 5));
  const todayKey = isoDayUTC();
  const dailySolvedMap = doc?.dailySolvedMap || {};
  const solvedTodayRaw = Number(dailySolvedMap?.[todayKey] ?? 0);
  const solvedToday = Math.max(0, Number.isFinite(solvedTodayRaw) ? Math.trunc(solvedTodayRaw) : 0);
  const activityDays = Array.isArray(doc?.activityDays) ? doc.activityDays : [];
  const streakDays = computeStreak(activityDays, new Date());

  return {
    sheets: rows,
    overall: {
      solved: totalSolved,
      total: totalQuestions,
      percent: overallPercent,
    },
    daily: {
      target: dailyTarget,
      solvedToday,
      remainingToday: Math.max(0, dailyTarget - solvedToday),
      streakDays,
      targetHitToday: solvedToday >= dailyTarget,
    },
    updatedAt: doc?.updatedAt || null,
  };
}

export function buildPlacementSheetLeaderboardRows(progressDocs = [], userMap = new Map()) {
  return progressDocs
    .map((doc) => {
      const snapshot = buildPlacementSheetSnapshot(doc);
      const profile = userMap.get(String(doc.userId)) || {};
      return {
        userId: String(doc.userId),
        name: profile.name || "Student",
        imageUrl: profile.imageUrl || "",
        solved: snapshot.overall.solved,
        total: snapshot.overall.total,
        percent: snapshot.overall.percent,
        streakDays: snapshot.daily.streakDays,
        solvedToday: snapshot.daily.solvedToday,
      };
    })
    .sort((a, b) => {
      if (b.solved !== a.solved) return b.solved - a.solved;
      if (b.streakDays !== a.streakDays) return b.streakDays - a.streakDays;
      return String(a.name).localeCompare(String(b.name));
    });
}
