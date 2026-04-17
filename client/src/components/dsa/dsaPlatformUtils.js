/** Platforms shown in UI — every DSA question maps to one (DB → topic → stable rotate). */
export const DSA_PLATFORM_DECK = [
  { id: "leetcode", label: "LeetCode", short: "LC" },
  { id: "gfg", label: "GeeksforGeeks", short: "GFG" },
  { id: "codeforces", label: "Codeforces", short: "CF" },
];

function hashQuestionId(id) {
  const s = String(id ?? "");
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * @returns {{ active: typeof DSA_PLATFORM_DECK[0], source: "db"|"topic"|"rotate", all: typeof DSA_PLATFORM_DECK }}
 */
export function resolveDsaPlatform(question, questionNumber = 1) {
  const all = DSA_PLATFORM_DECK;
  const explicit = (question?.platform || "").trim();
  if (explicit) {
    const lower = explicit.toLowerCase().replace(/\s+/g, "");
    const byDb = all.find((p) => {
      const lbl = p.label.toLowerCase().replace(/\s+/g, "");
      return (
        lower === p.id ||
        lower === lbl ||
        lower.includes(p.id) ||
        lbl.includes(lower) ||
        lower.includes(lbl.slice(0, 5))
      );
    });
    if (byDb) return { active: byDb, source: "db", all };
    return {
      active: { id: "custom", label: explicit, short: explicit.slice(0, 4).toUpperCase() },
      source: "db",
      all,
    };
  }

  const t = (question?.topic || "").toLowerCase();
  if (t.includes("leetcode")) return { active: all[0], source: "topic", all };
  if (t.includes("gfg") || t.includes("geek")) return { active: all[1], source: "topic", all };
  if (t.includes("codeforces") || t.includes("cf ")) return { active: all[2], source: "topic", all };

  const h = hashQuestionId(question?._id) + (Number(questionNumber) || 1);
  return { active: all[h % all.length], source: "rotate", all };
}
