import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExternalLink, Calendar, Clock, RefreshCw,
  Trophy, BookOpen, ChevronLeft, Zap, Code2,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (ms) =>
  new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

const fmtTime = (ms) =>
  new Date(ms).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });

const minsToHrs = (m) => {
  const h = Math.floor(m / 60), rem = m % 60;
  return h ? `${h}h ${rem ? rem + "m" : ""}`.trim() : `${rem}m`;
};

const countdown = (ms) => {
  const diff = ms - Date.now();
  if (diff <= 0) return "Live now!";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const DIFF_COLOR = {
  Easy:   "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100   text-amber-700",
  Hard:   "bg-rose-100    text-rose-700",
  School: "bg-sky-100     text-sky-700",
  Basic:  "bg-blue-100    text-blue-700",
};

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "lc", label: "LeetCode",
    short: "LC",
    color: "amber",
    accent: "#F89F1B",
    bg: "bg-amber-50",  border: "border-amber-300",
    text: "text-amber-700", badge: "bg-amber-100",
    activeBg: "bg-amber-500", activeText: "text-white",
    hasPOTD: true, hasContest: true,
  },
  {
    id: "cc", label: "CodeChef",
    short: "CC",
    color: "orange",
    accent: "#5B4638",
    bg: "bg-orange-50", border: "border-orange-300",
    text: "text-orange-700", badge: "bg-orange-100",
    activeBg: "bg-orange-500", activeText: "text-white",
    hasPOTD: false, hasContest: true,
  },
  {
    id: "cf", label: "Codeforces",
    short: "CF",
    color: "blue",
    accent: "#1F8AC0",
    bg: "bg-blue-50",   border: "border-blue-300",
    text: "text-blue-700",   badge: "bg-blue-100",
    activeBg: "bg-blue-500",   activeText: "text-white",
    hasPOTD: false, hasContest: true,
  },
  {
    id: "gfg", label: "GeeksforGeeks",
    short: "GFG",
    color: "green",
    accent: "#2F8D46",
    bg: "bg-green-50",  border: "border-green-300",
    text: "text-green-700",  badge: "bg-green-100",
    activeBg: "bg-green-600",  activeText: "text-white",
    hasPOTD: true, hasContest: false,
  },
];

// ─── Fetchers (browser-side) ──────────────────────────────────────────────────
async function fetchLCPotd() {
  const r = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query {
        activeDailyCodingChallengeQuestion {
          date link
          question { title difficulty topicTags { name } }
        }
      }`,
    }),
  });
  const j = await r.json();
  const q = j?.data?.activeDailyCodingChallengeQuestion;
  if (!q) return null;
  return {
    title: q.question.title,
    difficulty: q.question.difficulty,
    link: `https://leetcode.com${q.link}`,
    date: q.date,
    tags: q.question.topicTags?.slice(0, 3).map(t => t.name) || [],
  };
}

async function fetchLCContests() {
  const r = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query { allContests { title startTime duration titleSlug } }`,
    }),
  });
  const j = await r.json();
  const nowSec = Date.now() / 1000;
  return (j?.data?.allContests || [])
    .filter(c => c.startTime > nowSec)
    .sort((a, b) => a.startTime - b.startTime)
    .slice(0, 4)
    .map(c => ({
      title: c.title,
      startTime: c.startTime * 1000,
      duration: Math.round(c.duration / 60),
      link: `https://leetcode.com/contest/${c.titleSlug}`,
    }));
}

async function fetchCFContests() {
  const r = await fetch("https://codeforces.com/api/contest.list?gym=false");
  const j = await r.json();
  if (j.status !== "OK") return [];
  return j.result
    .filter(c => c.phase === "BEFORE")
    .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
    .slice(0, 5)
    .map(c => ({
      title: c.name,
      startTime: c.startTimeSeconds * 1000,
      duration: Math.round(c.durationSeconds / 60),
      link: `https://codeforces.com/contest/${c.id}`,
    }));
}

async function fetchCCContests() {
  const r = await fetch(
    "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all"
  );
  const j = await r.json();
  return (j?.future_contests || []).slice(0, 5).map(c => ({
    title: c.contest_name,
    startTime: new Date(c.contest_start_date_iso).getTime(),
    endTime: new Date(c.contest_end_date_iso).getTime(),
    link: `https://www.codechef.com/${c.contest_code}`,
    code: c.contest_code,
  }));
}

async function fetchGFGPotd() {
  const r = await fetch(
    "https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problem/today/"
  );
  const j = await r.json();
  const p = j?.problem_of_the_day;
  if (!p) return null;
  return {
    title: p.problem_title || p.title,
    difficulty: p.difficulty_level,
    link: `https://www.geeksforgeeks.org/problems/${p.slug}/1`,
    date: new Date().toISOString().split("T")[0],
    accuracy: p.accuracy,
    score: p.max_score,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function PotdCard({ potd, tab }) {
  if (!potd) return (
    <div className={`rounded-2xl border ${tab.border} ${tab.bg} p-6 text-center`}>
      <p className="text-gray-400 text-sm">Could not load Problem of the Day</p>
    </div>
  );

  return (
    <a
      href={potd.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-2xl border-2 ${tab.border} ${tab.bg}
        p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${tab.badge} ${tab.text}`}>
              Problem of the Day
            </span>
            {potd.date && (
              <span className="text-xs text-gray-400">{potd.date}</span>
            )}
          </div>

          <h3 className="text-xl font-black text-gray-900 mb-3 leading-snug group-hover:underline underline-offset-2">
            {potd.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {potd.difficulty && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${DIFF_COLOR[potd.difficulty] || "bg-gray-100 text-gray-600"}`}>
                {potd.difficulty}
              </span>
            )}
            {potd.tags?.map(t => (
              <span key={t} className="text-xs px-2 py-0.5 bg-white/80 border border-gray-200 rounded-full text-gray-500">
                {t}
              </span>
            ))}
            {potd.accuracy && (
              <span className="text-xs text-gray-400">Accuracy: {potd.accuracy}%</span>
            )}
          </div>
        </div>

        <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${tab.badge} flex items-center justify-center`}>
          <ExternalLink size={16} className={tab.text} />
        </div>
      </div>
    </a>
  );
}

function ContestCard({ contest, tab }) {
  const timeLeft = countdown(contest.startTime);
  const isLive = contest.startTime <= Date.now();

  return (
    <a
      href={contest.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-2xl border ${tab.border} bg-white
        p-5 hover:shadow-lg hover:border-opacity-100 transition-all duration-200 hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:underline underline-offset-2">
          {contest.title}
        </h4>
        <span className={`flex-shrink-0 text-xs font-black px-2.5 py-1 rounded-full ${
          isLive
            ? "bg-red-100 text-red-600 animate-pulse"
            : `${tab.badge} ${tab.text}`
        }`}>
          {isLive ? "🔴 LIVE" : `⏰ ${timeLeft}`}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {fmtDate(contest.startTime)} · {fmtTime(contest.startTime)}
        </span>
        {contest.duration && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {minsToHrs(contest.duration)}
          </span>
        )}
      </div>
    </a>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContestPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lc");
  const [data, setData] = useState({
    lc:  { potd: null,  contests: [], loaded: false, error: null },
    cc:  { potd: null,  contests: [], loaded: false, error: null },
    cf:  { potd: null,  contests: [], loaded: false, error: null },
    gfg: { potd: null,  contests: [], loaded: false, error: null },
  });
  const [loading, setLoading] = useState(false);

  const tab = TABS.find(t => t.id === activeTab);

  const loadTab = useCallback(async (id) => {
    if (data[id].loaded) return;   // already fetched
    setLoading(true);
    try {
      let potd = null, contests = [];

      if (id === "lc") {
        [potd, contests] = await Promise.all([
          fetchLCPotd().catch(() => null),
          fetchLCContests().catch(() => []),
        ]);
      } else if (id === "cc") {
        contests = await fetchCCContests().catch(() => []);
      } else if (id === "cf") {
        contests = await fetchCFContests().catch(() => []);
      } else if (id === "gfg") {
        potd = await fetchGFGPotd().catch(() => null);
      }

      setData(prev => ({
        ...prev,
        [id]: { potd, contests, loaded: true, error: null },
      }));
    } catch (e) {
      setData(prev => ({
        ...prev,
        [id]: { ...prev[id], loaded: true, error: e.message },
      }));
    } finally {
      setLoading(false);
    }
  }, [data]);

  // Load first tab on mount
  useEffect(() => { loadTab("lc"); }, []);

  const handleTabClick = (id) => {
    setActiveTab(id);
    loadTab(id);
  };

  const handleRefresh = () => {
    setData(prev => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], loaded: false },
    }));
    setTimeout(() => loadTab(activeTab), 50);
  };

  const current = data[activeTab];

  return (
    // pt-20 clears the sticky student navbar
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Page header ── */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-semibold transition-colors"
          >
            <ChevronLeft size={18} /> Back
          </button>

          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Trophy size={22} className="text-amber-500" />
              Contests & Daily Challenges
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Real-time data from LeetCode, CodeChef, Codeforces & GFG
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 font-semibold transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex gap-2 mb-8 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-200 w-fit">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => handleTabClick(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-200
                ${activeTab === t.id
                  ? `${t.activeBg} ${t.activeText} shadow-md scale-105`
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
            >
              {/* Dot indicator if loaded and has data */}
              {data[t.id].loaded && (data[t.id].potd || data[t.id].contests.length > 0) && (
                <span className={`w-1.5 h-1.5 rounded-full ${activeTab === t.id ? "bg-white/70" : "bg-green-500"}`} />
              )}
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.short}</span>
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {loading && !current.loaded ? (
          <Skeleton />
        ) : (
          <div className="space-y-8">

            {/* POTD section — LC and GFG */}
            {tab.hasPOTD && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={16} className={tab.text} />
                  <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">
                    Problem of the Day
                  </h2>
                </div>
                <PotdCard potd={current.potd} tab={tab} />
              </section>
            )}

            {/* Contests section — LC, CC, CF */}
            {tab.hasContest && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Code2 size={16} className={tab.text} />
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-500">
                      Upcoming Contests
                    </h2>
                  </div>
                  {current.contests.length > 0 && (
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${tab.badge} ${tab.text}`}>
                      {current.contests.length} upcoming
                    </span>
                  )}
                </div>

                {current.contests.length === 0 && current.loaded ? (
                  <div className={`rounded-2xl border ${tab.border} ${tab.bg} p-8 text-center`}>
                    <Zap size={32} className={`${tab.text} mx-auto mb-2 opacity-40`} />
                    <p className="text-gray-400 text-sm">No upcoming contests found right now</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {current.contests.map((c, i) => (
                      <ContestCard key={i} contest={c} tab={tab} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* GFG has no contests — show message */}
            {tab.id === "gfg" && !tab.hasContest && (
              <section>
                <div className={`rounded-2xl border ${tab.border} ${tab.bg} p-6 text-center`}>
                  <p className={`font-semibold ${tab.text}`}>
                    GeeksforGeeks doesn't have competitive contests. Visit GFG for practice problems!
                  </p>
                  <a
                    href="https://practice.geeksforgeeks.org/explore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 mt-3 text-sm font-bold ${tab.text} hover:underline`}
                  >
                    Explore GFG Problems <ExternalLink size={13} />
                  </a>
                </div>
              </section>
            )}

            {/* Error state */}
            {current.error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
                <p className="text-red-600 font-semibold">Failed to load data</p>
                <p className="text-red-400 text-sm mt-1">{current.error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-3 text-sm font-bold text-red-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}