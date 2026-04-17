import TestAttempt from "../models/TestAttempt.js";

const TYPE_KEYS = ["dsa", "dev", "aptitude"];
const READINESS_WEIGHTS = {
  dsa: 0.45,
  dev: 0.35,
  aptitude: 0.2,
};

export function getCompanyTierMapping(readiness) {
  const score = Number(readiness || 0);
  if (score >= 85) {
    return {
      tier: "Top Tier",
      guidance: "Strong profile for product and top service companies.",
      examples: ["Google", "Microsoft", "Amazon", "Atlassian", "Uber"],
    };
  }
  if (score >= 70) {
    return {
      tier: "Upper Mid Tier",
      guidance: "Good profile for high-growth companies; keep improving DSA speed.",
      examples: ["Adobe", "PayPal", "Salesforce", "Intuit", "VMware"],
    };
  }
  if (score >= 55) {
    return {
      tier: "Mid Tier",
      guidance: "Interview-ready for many companies; increase consistency and accuracy.",
      examples: ["Infosys", "Wipro", "Capgemini", "Cognizant", "Accenture"],
    };
  }
  return {
    tier: "Foundation",
    guidance: "Build fundamentals before targeting high cutoff interview rounds.",
    examples: ["Practice-focused internships", "Early-career trainee programs"],
  };
}

function toDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function buildHeatmap(attempts = [], days = 120) {
  const safeDays = clamp(Number(days) || 120, 7, 365);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - (safeDays - 1));
  start.setHours(0, 0, 0, 0);

  const byDay = new Map();
  for (let i = 0; i < safeDays; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    byDay.set(toDateKey(d), {
      date: toDateKey(d),
      dsa: 0,
      dev: 0,
      aptitude: 0,
      total: 0,
      intensity: 0,
      dominantSkill: null,
    });
  }

  for (const attempt of attempts) {
    const dateKey = toDateKey(attempt.createdAt);
    const row = byDay.get(dateKey);
    if (!row) continue;

    const type = TYPE_KEYS.includes(attempt.type) ? attempt.type : null;
    if (type) row[type] += 1;
    row.total += 1;
  }

  let maxDailyTotal = 0;
  for (const row of byDay.values()) {
    maxDailyTotal = Math.max(maxDailyTotal, row.total);
    const dominant = TYPE_KEYS.reduce((best, key) => {
      if (!best || row[key] > row[best]) return key;
      return best;
    }, null);
    row.dominantSkill = row[dominant] > 0 ? dominant : null;
  }

  const points = Array.from(byDay.values()).map((row) => ({
    ...row,
    intensity:
      maxDailyTotal === 0 ? 0 : clamp(Number((row.total / maxDailyTotal).toFixed(2)), 0, 1),
  }));

  return {
    days: safeDays,
    startDate: toDateKey(start),
    endDate: toDateKey(end),
    maxDailyTotal,
    points,
  };
}

export function buildReadiness(attempts = [], windowDays = 60) {
  const safeWindow = clamp(Number(windowDays) || 60, 14, 365);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - safeWindow);

  const recentAttempts = attempts.filter((a) => new Date(a.createdAt) >= cutoff);
  const typeStats = {
    dsa: { total: 0, correct: 0 },
    dev: { total: 0, correct: 0 },
    aptitude: { total: 0, correct: 0 },
  };

  for (const attempt of recentAttempts) {
    if (!TYPE_KEYS.includes(attempt.type)) continue;
    typeStats[attempt.type].total += 1;
    if (attempt.isCorrect) typeStats[attempt.type].correct += 1;
  }

  const weeklyBuckets = new Set(
    recentAttempts.map((a) => {
      const d = new Date(a.createdAt);
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      start.setHours(0, 0, 0, 0);
      return toDateKey(start);
    })
  );

  const coverageCount = TYPE_KEYS.filter((k) => typeStats[k].total > 0).length;
  const consistencyScore = clamp((weeklyBuckets.size / Math.ceil(safeWindow / 7)) * 100, 0, 100);
  const coverageScore = (coverageCount / TYPE_KEYS.length) * 100;

  const weightedAccuracy = TYPE_KEYS.reduce((sum, key) => {
    const s = typeStats[key];
    if (!s.total) return sum;
    const accuracy = (s.correct / s.total) * 100;
    return sum + accuracy * READINESS_WEIGHTS[key];
  }, 0);

  const readinessRaw = weightedAccuracy * 0.75 + consistencyScore * 0.15 + coverageScore * 0.1;
  const readiness = clamp(Number(readinessRaw.toFixed(2)), 0, 100);

  let label = "Needs Work";
  if (readiness >= 85) label = "Top-tier Ready";
  else if (readiness >= 70) label = "Strong";
  else if (readiness >= 55) label = "Improving";

  return {
    windowDays: safeWindow,
    attemptsConsidered: recentAttempts.length,
    readiness,
    label,
    companyTier: getCompanyTierMapping(readiness),
    factors: {
      weightedAccuracy: Number(weightedAccuracy.toFixed(2)),
      consistency: Number(consistencyScore.toFixed(2)),
      coverage: Number(coverageScore.toFixed(2)),
    },
    typeBreakdown: TYPE_KEYS.map((key) => {
      const s = typeStats[key];
      return {
        type: key,
        attempts: s.total,
        accuracy: s.total ? Number(((s.correct / s.total) * 100).toFixed(2)) : 0,
      };
    }),
  };
}

export async function getUserAnalyticsSnapshot({ userId, heatmapDays = 120, readinessWindowDays = 60 }) {
  const attempts = await TestAttempt.find({ userId }).select("type isCorrect createdAt").lean();
  return {
    userId,
    heatmap: buildHeatmap(attempts, heatmapDays),
    readiness: buildReadiness(attempts, readinessWindowDays),
    lastUpdatedAt: new Date().toISOString(),
  };
}
