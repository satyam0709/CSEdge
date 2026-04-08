import fetch from 'node-fetch';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes — fresher contest / POTD data
const cache = { data: null, fetchedAt: 0 };

const LEETCODE_POTD_QUERY = `
  query {
    activeDailyCodingChallengeQuestion {
      date
      link
      question {
        title
        difficulty
        titleSlug
        topicTags { name }
      }
    }
  }
`;

const LEETCODE_CONTESTS_QUERY = `
  query {
    allContests {
      title
      startTime
      duration
      titleSlug
    }
  }
`;

async function fetchLeetCodePOTD() {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({ query: LEETCODE_POTD_QUERY }),
      timeout: 8000,
    });
    const json = await res.json();
    const q = json?.data?.activeDailyCodingChallengeQuestion;
    if (!q) return null;
    return {
      source: 'leetcode',
      type: 'potd',
      title: q.question.title,
      difficulty: q.question.difficulty,
      link: `https://leetcode.com${q.link}`,
      date: q.date,
      tags: q.question.topicTags?.slice(0, 3).map(t => t.name) || [],
    };
  } catch {
    return null;
  }
}

async function fetchLeetCodeContests() {
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://leetcode.com',
      },
      body: JSON.stringify({ query: LEETCODE_CONTESTS_QUERY }),
      timeout: 8000,
    });
    const json = await res.json();
    const all = json?.data?.allContests || [];

    // Upcoming OR currently live (not finished yet) — was future-only, so live contests were missing
    return all
      .filter((c) => {
        const durSec = Number(c.duration) || 0;
        const endMs = c.startTime * 1000 + durSec * 1000;
        return endMs > Date.now();
      })
      .sort((a, b) => a.startTime - b.startTime)
      .slice(0, 10)
      .map(c => {
        const startMs = c.startTime * 1000;
        const durSec = Number(c.duration) || 0;
        return {
          source: 'leetcode',
          type: 'contest',
          title: c.title,
          startTime: startMs,
          duration: Math.round(durSec / 60),
          endTime: startMs + durSec * 1000,
          link: `https://leetcode.com/contest/${c.titleSlug}`,
          isWeekly: c.title.toLowerCase().includes('weekly'),
          isBiweekly: c.title.toLowerCase().includes('biweekly'),
        };
      });
  } catch {
    return [];
  }
}

async function fetchCodeforcesContests() {
  try {
    const res = await fetch(
      'https://codeforces.com/api/contest.list?gym=false',
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }
    );
    const json = await res.json();
    if (json.status !== 'OK') return [];

    return json.result
      .filter((c) => {
        if (c.phase === 'FINISHED') return false;
        const endMs = (c.startTimeSeconds + c.durationSeconds) * 1000;
        return endMs > Date.now();
      })
      .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
      .slice(0, 12)
      .map(c => {
        const startMs = c.startTimeSeconds * 1000;
        const durSec = c.durationSeconds || 0;
        return {
          source: 'codeforces',
          type: 'contest',
          title: c.name,
          startTime: startMs,
          duration: Math.round(durSec / 60),
          endTime: startMs + durSec * 1000,
          link: `https://codeforces.com/contest/${c.id}`,
        };
      });
  } catch {
    return [];
  }
}

async function fetchCodeChefContests() {
  try {
    const res = await fetch(
      'https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all',
      { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000 }
    );
    const json = await res.json();
    const future = json?.future_contests || [];
    const present = json?.present_contests || [];
    const seen = new Set();
    const merged = [];
    for (const c of [...present, ...future]) {
      const code = c.contest_code;
      if (!code || seen.has(code)) continue;
      seen.add(code);
      merged.push(c);
    }

    return merged.slice(0, 12).map((c) => ({
      source: 'codechef',
      type: 'contest',
      title: c.contest_name,
      startTime: new Date(c.contest_start_date_iso).getTime(),
      endTime: new Date(c.contest_end_date_iso).getTime(),
      link: `https://www.codechef.com/${c.contest_code}`,
      code: c.contest_code,
    }));
  } catch {
    return [];
  }
}

async function fetchGFGPOTD() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'application/json, text/plain, */*',
  };
  const parsePotd = (json) => {
    const p = json?.problem_of_the_day;
    if (!p) return null;
    const slug = p.slug || p.problem_slug;
    const path = slug ? `https://www.geeksforgeeks.org/problems/${slug}/1` : 'https://www.geeksforgeeks.org/problem-of-the-day/';
    return {
      source: 'gfg',
      type: 'potd',
      title: p.problem_title || p.title,
      difficulty: p.difficulty_level,
      link: path,
      date: new Date().toISOString().split('T')[0],
      accuracy: p.accuracy,
      score: p.max_score,
    };
  };

  try {
    const res = await fetch(
      'https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problem/today/',
      { headers, timeout: 10000 }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return parsePotd(json);
  } catch {
    return null;
  }
}

async function fetchAllData() {
  console.log('[contests] Fetching fresh data from external APIs...');
  const [leetPOTD, gfgPOTD, leetContests, cfContests, ccContests] =
    await Promise.allSettled([
      fetchLeetCodePOTD(),
      fetchGFGPOTD(),
      fetchLeetCodeContests(),
      fetchCodeforcesContests(),
      fetchCodeChefContests(),
    ]);

  const getValue = (result) =>
    result.status === 'fulfilled' ? result.value : null;

  const lcPotd = getValue(leetPOTD);
  const gfgPotd = getValue(gfgPOTD);
  const lcList = getValue(leetContests) || [];
  const cfList = getValue(cfContests) || [];
  const ccList = getValue(ccContests) || [];

  const mergedContests = [...lcList, ...cfList, ...ccList]
    .filter(Boolean)
    .sort((a, b) => a.startTime - b.startTime);

  return {
    potds: [lcPotd, gfgPotd].filter(Boolean),
    contests: mergedContests,
    platforms: {
      lc: { potd: lcPotd, contests: lcList },
      gfg: { potd: gfgPotd, contests: [] },
      cf: { potd: null, contests: cfList },
      cc: { potd: null, contests: ccList },
    },
    fetchedAt: Date.now(),
  };
}

export const getContestsAndPOTD = async (req, res) => {
  try {
    const now = Date.now();
    const isStale = !cache.data || (now - cache.fetchedAt) > CACHE_TTL_MS;

    if (isStale) {
      // If we have stale data, return it immediately and refresh in background
      if (cache.data) {
        fetchAllData().then((fresh) => {
          cache.data = fresh;
          cache.fetchedAt = Date.now();
        });
        return res.json({ success: true, ...cache.data, stale: true });
      }
      // No data at all — must wait for first fetch
      const fresh = await fetchAllData();
      cache.data = fresh;
      cache.fetchedAt = now;
    }

    res.json({ success: true, ...cache.data, stale: false });
  } catch (err) {
    console.error('[contests] Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const bustContestCache = (req, res) => {
  cache.data = null;
  cache.fetchedAt = 0;
  res.json({ success: true, message: 'Cache cleared. Next request will fetch fresh data.' });
};