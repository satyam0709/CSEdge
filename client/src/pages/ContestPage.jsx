import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExternalLink,
  Calendar,
  Clock,
  RefreshCw,
  Trophy,
  BookOpen,
  ChevronLeft,
  Zap,
  Code2,
  LayoutGrid,
  Radio,
} from "lucide-react";
import axios from "../utils/axios";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (ms) =>
  new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtTime = (ms) =>
  new Date(ms).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtRelative = (ms) => {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const minsToHrs = (m) => {
  const h = Math.floor(m / 60),
    rem = m % 60;
  return h ? `${h}h ${rem ? rem + "m" : ""}`.trim() : `${rem}m`;
};

const countdown = (targetMs, now) => {
  const diff = targetMs - now;
  if (diff <= 0) return "Started";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
};

const DIFF_COLOR = {
  Easy: "bg-emerald-100 text-emerald-800",
  Medium: "bg-amber-100 text-amber-800",
  Hard: "bg-rose-100 text-rose-800",
  School: "bg-sky-100 text-sky-800",
  Basic: "bg-blue-100 text-blue-800",
  SCHOOL: "bg-sky-100 text-sky-800",
  BASIC: "bg-blue-100 text-blue-800",
  EASY: "bg-emerald-100 text-emerald-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  HARD: "bg-rose-100 text-rose-800",
};

const TABS = [
  {
    id: "all",
    label: "Overview",
    short: "All",
    hasPOTD: true,
    hasContest: true,
  },
  {
    id: "lc",
    label: "LeetCode",
    short: "LC",
    hasPOTD: true,
    hasContest: true,
  },
  {
    id: "cc",
    label: "CodeChef",
    short: "CC",
    hasPOTD: false,
    hasContest: true,
  },
  {
    id: "cf",
    label: "Codeforces",
    short: "CF",
    hasPOTD: false,
    hasContest: true,
  },
  {
    id: "gfg",
    label: "GeeksforGeeks",
    short: "GFG",
    hasPOTD: true,
    hasContest: false,
  },
];

const emptyPlatform = () => ({
  potd: null,
  contests: [],
});

function buildPlatformsFromLegacy(payload) {
  const potds = payload.potds || [];
  const contests = payload.contests || [];
  return {
    lc: {
      potd: potds.find((p) => p.source === "leetcode") || null,
      contests: contests.filter((c) => c.source === "leetcode"),
    },
    gfg: {
      potd: potds.find((p) => p.source === "gfg") || null,
      contests: [],
    },
    cf: {
      potd: null,
      contests: contests.filter((c) => c.source === "codeforces"),
    },
    cc: {
      potd: null,
      contests: contests.filter((c) => c.source === "codechef"),
    },
  };
}

function contestEndTime(c) {
  if (c.endTime) return c.endTime;
  if (c.duration && c.startTime) return c.startTime + c.duration * 60 * 1000;
  return null;
}

function isContestLive(c, now) {
  const end = contestEndTime(c);
  if (c.startTime > now) return false;
  if (!end) return c.startTime <= now;
  return now >= c.startTime && now < end;
}

function PotdCard({ potd }) {
  if (!potd) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-white/80 p-8 text-center shadow-sm backdrop-blur">
        <p className="text-sm text-slate-500">
          Could not load Problem of the Day. Try refresh.
        </p>
      </div>
    );
  }

  const raw = potd.difficulty;
  const diffClass =
    DIFF_COLOR[raw] ||
    DIFF_COLOR[typeof raw === "string" ? raw.toUpperCase() : ""] ||
    "bg-slate-100 text-slate-700";

  return (
    <a
      href={potd.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block cursor-pointer rounded-2xl border-2 border-blue-200/80 bg-gradient-to-br from-white to-blue-50/50 p-6 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
              Problem of the Day
            </span>
            {potd.date && (
              <span className="text-xs text-slate-500">{potd.date}</span>
            )}
          </div>

          <h3 className="mb-3 text-xl font-black leading-snug text-slate-900 group-hover:underline group-hover:underline-offset-2">
            {potd.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            {potd.difficulty && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${diffClass}`}
              >
                {potd.difficulty}
              </span>
            )}
            {potd.tags?.map((t) => (
              <span
                key={t}
                className="rounded-full border border-blue-100 bg-white/90 px-2 py-0.5 text-xs text-slate-600"
              >
                {t}
              </span>
            ))}
            {potd.accuracy != null && (
              <span className="text-xs text-slate-500">
                Accuracy: {potd.accuracy}%
              </span>
            )}
          </div>
        </div>

        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
          <ExternalLink size={16} className="text-blue-700" />
        </div>
      </div>
    </a>
  );
}

function ContestCard({ contest }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const live = isContestLive(contest, now);
  const upcoming = contest.startTime > now;
  const timeLeft = countdown(contest.startTime, now);

  return (
    <a
      href={contest.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block cursor-pointer rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h4 className="line-clamp-2 font-bold leading-snug text-slate-900 group-hover:text-blue-600 group-hover:underline group-hover:underline-offset-2">
          {contest.title}
        </h4>
        <span
          className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${
            live
              ? "animate-pulse bg-red-100 text-red-700"
              : upcoming
                ? "bg-blue-100 text-blue-800"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          {live ? "● LIVE" : upcoming ? `⏱ ${timeLeft}` : "Ended"}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar size={12} className="text-blue-500" />
          {fmtDate(contest.startTime)} · {fmtTime(contest.startTime)}
        </span>
        {contest.duration != null && (
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-blue-500" />
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
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-2xl bg-gradient-to-r from-blue-100/60 to-slate-100"
        />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ContestPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [platforms, setPlatforms] = useState({
    lc: emptyPlatform(),
    cc: emptyPlatform(),
    cf: emptyPlatform(),
    gfg: emptyPlatform(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [stale, setStale] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/contest", { timeout: 30000 });
      if (!data.success) {
        throw new Error(data.message || "Failed to load contests");
      }
      const next =
        data.platforms || buildPlatformsFromLegacy(data);
      setPlatforms({
        lc: next.lc || emptyPlatform(),
        cc: next.cc || emptyPlatform(),
        cf: next.cf || emptyPlatform(),
        gfg: next.gfg || emptyPlatform(),
      });
      setFetchedAt(data.fetchedAt || Date.now());
      setStale(!!data.stale);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => {
      load();
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [load]);

  const tab = TABS.find((t) => t.id === activeTab);

  const current = useMemo(() => {
    if (activeTab === "all") {
      return {
        potd: null,
        contests: [
          ...platforms.lc.contests,
          ...platforms.cf.contests,
          ...platforms.cc.contests,
        ].sort((a, b) => a.startTime - b.startTime),
      };
    }
    if (activeTab === "lc") return platforms.lc;
    if (activeTab === "cc") return platforms.cc;
    if (activeTab === "cf") return platforms.cf;
    if (activeTab === "gfg") return platforms.gfg;
    return { potd: null, contests: [] };
  }, [activeTab, platforms]);

  const stats = useMemo(
    () => ({
      lcN: platforms.lc.contests.length,
      cfN: platforms.cf.contests.length,
      ccN: platforms.cc.contests.length,
      hasLcPotd: !!platforms.lc.potd,
      hasGfgPotd: !!platforms.gfg.potd,
    }),
    [platforms]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-white pt-20 text-slate-800">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-700"
          >
            <ChevronLeft size={18} /> Back
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black text-slate-900 md:text-3xl">
              <span className="text-blue-600">
                <Trophy size={28} />
              </span>
              Contests & daily challenges
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Live data via your backend from LeetCode, CodeChef, Codeforces &
              GFG (no browser CORS issues).
            </p>
            {fetchedAt && (
              <p className="mt-1 text-xs text-slate-400">
                Last updated {fmtRelative(Date.now() - fetchedAt)}
                {stale ? " · refreshing in background" : ""}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => load()}
            disabled={loading}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-blue-100 bg-white/90 p-2 shadow-sm backdrop-blur">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                activeTab === t.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-blue-50"
              }`}
            >
              {t.id === "all" && <LayoutGrid size={16} />}
              {t.label}
            </button>
          ))}
        </div>

        {loading && !fetchedAt ? (
          <Skeleton />
        ) : (
          <div className="space-y-10">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                <p className="font-semibold text-red-700">{error}</p>
                <p className="mt-1 text-sm text-red-500/90">
                  Ensure the API server is running and{" "}
                  <code className="rounded bg-white px-1">/api/contest</code> is
                  reachable.
                </p>
                <button
                  type="button"
                  onClick={() => load()}
                  className="mt-3 cursor-pointer text-sm font-bold text-red-700 underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Overview */}
            {activeTab === "all" && !error && (
              <section className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      id: "lc",
                      name: "LeetCode",
                      n: stats.lcN,
                      potd: stats.hasLcPotd,
                      color: "from-amber-500/20 to-blue-500/10",
                    },
                    {
                      id: "cf",
                      name: "Codeforces",
                      n: stats.cfN,
                      potd: false,
                      color: "from-sky-500/20 to-blue-600/10",
                    },
                    {
                      id: "cc",
                      name: "CodeChef",
                      n: stats.ccN,
                      potd: false,
                      color: "from-violet-500/15 to-blue-500/10",
                    },
                    {
                      id: "gfg",
                      name: "GFG",
                      n: 0,
                      potd: stats.hasGfgPotd,
                      color: "from-emerald-500/15 to-blue-500/10",
                    },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveTab(p.id)}
                      className={`cursor-pointer rounded-2xl border border-blue-100 bg-gradient-to-br ${p.color} p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-800">
                          {p.name}
                        </span>
                        <Radio className="h-4 w-4 text-blue-500" />
                      </div>
                      <p className="mt-2 text-2xl font-black text-blue-700">
                        {p.id === "gfg"
                          ? p.potd
                            ? "POTD"
                            : "—"
                          : `${p.n} upcoming`}
                      </p>
                      <p className="text-xs text-slate-500">{p.id === "gfg" ? "Daily problem" : "Contests"}</p>
                    </button>
                  ))}
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <BookOpen size={16} className="text-blue-600" />
                      <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                        LeetCode — POTD
                      </h2>
                    </div>
                    <PotdCard potd={platforms.lc.potd} />
                  </div>
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <BookOpen size={16} className="text-blue-600" />
                      <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                        GFG — POTD
                      </h2>
                    </div>
                    <PotdCard potd={platforms.gfg.potd} />
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Code2 size={16} className="text-blue-600" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                      All upcoming contests (merged)
                    </h2>
                  </div>
                  {current.contests.length === 0 ? (
                    <div className="rounded-2xl border border-blue-100 bg-white/80 p-8 text-center">
                      <Zap className="mx-auto mb-2 h-8 w-8 text-blue-300" />
                      <p className="text-sm text-slate-500">
                        No upcoming contests right now.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {current.contests.map((c, i) => (
                        <ContestCard key={`${c.source}-${c.title}-${i}`} contest={c} />
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Single platform */}
            {activeTab !== "all" && tab?.hasPOTD && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-blue-600" />
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Problem of the Day
                  </h2>
                </div>
                <PotdCard potd={current.potd} />
              </section>
            )}

            {activeTab !== "all" && tab?.hasContest && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 size={16} className="text-blue-600" />
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">
                      Upcoming contests
                    </h2>
                  </div>
                  {current.contests?.length > 0 && (
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                      {current.contests.length} upcoming
                    </span>
                  )}
                </div>

                {!current.contests?.length ? (
                  <div className="rounded-2xl border border-blue-100 bg-white/80 p-8 text-center">
                    <Zap className="mx-auto mb-2 h-8 w-8 text-blue-300" />
                    <p className="text-sm text-slate-500">
                      No upcoming contests found.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {current.contests.map((c, i) => (
                      <ContestCard key={`${c.source}-${i}`} contest={c} />
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === "gfg" && (
              <section className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 shadow-inner">
                <p className="text-center text-sm font-medium text-slate-700">
                  GFG focuses on daily problems & practice tracks — use POTD
                  above or{" "}
                  <a
                    href="https://practice.geeksforgeeks.org/explore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer font-bold text-blue-700 underline"
                  >
                    open practice
                  </a>
                  .
                </p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
