import { useNavigate } from "react-router-dom";
import {
  Mic, Star, Trophy, TrendingUp, Clock, Target,
  ChevronRight, Play, BarChart2, CheckCircle2,
  AlertCircle, Zap, BrainCircuit, RefreshCw,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────
function ScoreDot({ score }) {
  const pct = (score / 5) * 100;
  const color =
    score >= 4 ? "bg-green-500" : score >= 3 ? "bg-amber-400" : "bg-red-400";
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white ${color}`}
    >
      {score}
    </span>
  );
}

function ScoreBar({ score, max = 5 }) {
  const pct = Math.min(100, (score / max) * 100);
  const color =
    score >= 4 ? "from-green-400 to-emerald-500"
    : score >= 3 ? "from-amber-400 to-yellow-500"
    : "from-red-400 to-rose-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function DifficultyBadge({ difficulty }) {
  const map = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${map[difficulty] || "bg-slate-100 text-slate-600"}`}>
      {difficulty}
    </span>
  );
}

function StatusBadge({ status }) {
  return status === "completed" ? (
    <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
      <CheckCircle2 className="h-3 w-3" /> Done
    </span>
  ) : (
    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
      <AlertCircle className="h-3 w-3" /> In Progress
    </span>
  );
}

function timeAgo(ts) {
  if (!ts) return "";
  const s = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

// ── main component ────────────────────────────────────────────────────────────
export default function InterviewStatsCard({ data = {} }) {
  const navigate = useNavigate();

  const {
    totalSessions = 0,
    completedSessions = 0,
    averageScore = 0,
    bestScore = 0,
    recentSessions = [],
    roleBreakdown = {},
    difficultyBreakdown = {},
    scoreTrend = [],
  } = data;

  const hasData = totalSessions > 0;
  const avgPct = Math.round((averageScore / 5) * 100);
  const topRoles = Object.entries(roleBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="col-span-1 md:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-md">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Mock Interview Tracker</h3>
            <p className="text-xs text-slate-500">AI-powered interview practice &amp; progress</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/mock-interview")}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-indigo-700 transition"
          >
            <Play className="h-3.5 w-3.5" /> Start Interview
          </button>
          <button
            type="button"
            onClick={() => navigate("/mock-interview")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            History
          </button>
        </div>
      </div>

      {!hasData ? (
        /* ── Empty state ─────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
            <Mic className="h-8 w-8 text-indigo-400" />
          </div>
          <h4 className="text-base font-bold text-slate-800">No interviews yet</h4>
          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Practice AI-powered mock interviews and track your performance over time.
          </p>
          <button
            type="button"
            onClick={() => navigate("/mock-interview")}
            className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
          >
            <Mic className="h-4 w-4" /> Take your first interview
          </button>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {/* ── Top stat cards ─────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatBox
              icon={<Target className="h-4 w-4 text-indigo-600" />}
              bg="bg-indigo-50"
              label="Total Sessions"
              value={totalSessions}
              sub={`${completedSessions} completed`}
            />
            <StatBox
              icon={<BarChart2 className="h-4 w-4 text-amber-600" />}
              bg="bg-amber-50"
              label="Avg Score"
              value={`${averageScore}/5`}
              sub={`${avgPct}% proficiency`}
              progress={avgPct}
              progressColor={avgPct >= 70 ? "bg-green-500" : avgPct >= 50 ? "bg-amber-400" : "bg-red-400"}
            />
            <StatBox
              icon={<Trophy className="h-4 w-4 text-yellow-600" />}
              bg="bg-yellow-50"
              label="Best Score"
              value={`${bestScore}/5`}
              sub="personal best"
            />
            <StatBox
              icon={<TrendingUp className="h-4 w-4 text-green-600" />}
              bg="bg-green-50"
              label="Completion"
              value={`${totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}%`}
              sub={`${completedSessions} of ${totalSessions}`}
              progress={totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0}
              progressColor="bg-green-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Recent sessions ──────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Recent Sessions
              </h4>
              {recentSessions.length === 0 ? (
                <p className="text-sm text-slate-400">No sessions yet.</p>
              ) : (
                recentSessions.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 hover:bg-indigo-50 hover:border-indigo-200 transition cursor-pointer group"
                    onClick={() => navigate("/mock-interview")}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                      <Mic className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800 truncate">{s.role}</p>
                        <DifficultyBadge difficulty={s.difficulty} />
                        <StatusBadge status={s.status} />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                        <span>{s.totalQuestions} questions</span>
                        <span>·</span>
                        <span>{timeAgo(s.createdAt)}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {s.status === "completed" ? (
                        <>
                          <ScoreDot score={Math.round(s.overallScore)} />
                          <p className="mt-1 text-[10px] text-slate-400">{s.overallScore}/5</p>
                        </>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition" />
                      )}
                    </div>
                  </div>
                ))
              )}
              <button
                type="button"
                onClick={() => navigate("/mock-interview")}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-300 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition"
              >
                View all sessions <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* ── Right panel: score trend + top roles ─────────────── */}
            <div className="space-y-4">
              {/* Score trend */}
              {scoreTrend.length > 1 && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Score Trend
                  </h4>
                  <div className="space-y-2">
                    {scoreTrend.map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-5 text-[10px] font-bold text-slate-400">#{i + 1}</span>
                        <div className="flex-1">
                          <ScoreBar score={t.score} />
                        </div>
                        <span className="w-8 text-right text-[11px] font-bold text-slate-600">
                          {t.score}/5
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top roles */}
              {topRoles.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Most Practiced
                  </h4>
                  <div className="space-y-2">
                    {topRoles.map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <Zap className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                          <span className="text-xs font-semibold text-slate-700 truncate">{role}</span>
                        </div>
                        <span className="ml-2 shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                          {count}×
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Difficulty breakdown */}
              {Object.values(difficultyBreakdown).some(v => v > 0) && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Difficulty Mix
                  </h4>
                  <div className="space-y-2">
                    {[
                      { key: "easy", label: "Easy", color: "bg-green-500" },
                      { key: "medium", label: "Medium", color: "bg-amber-400" },
                      { key: "hard", label: "Hard", color: "bg-red-400" },
                    ].map(({ key, label, color }) => {
                      const count = difficultyBreakdown[key] || 0;
                      const pct = totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0;
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="w-12 text-xs text-slate-500">{label}</span>
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${color} transition-all duration-500`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-6 text-right text-[11px] font-bold text-slate-500">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── StatBox sub-component ─────────────────────────────────────────────────────
function StatBox({ icon, bg, label, value, sub, progress, progressColor }) {
  return (
    <div className={`rounded-xl border border-slate-100 ${bg} p-4 space-y-2`}>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-500">{label}</span>
      </div>
      <p className="text-2xl font-black text-slate-800">{value}</p>
      {progress != null && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/60">
          <div
            className={`h-full rounded-full ${progressColor} transition-all duration-700`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <p className="text-[11px] text-slate-500">{sub}</p>
    </div>
  );
}
