import { useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import { Activity, Minus, Plus, ExternalLink, Flame, Target } from "lucide-react";
import { toast } from "react-toastify";
import axios from "../../utils/axios";
import { getSocketBaseUrl } from "../../utils/socketBaseUrl";

export default function PlacementSheetsTracker() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState("");
  const [progress, setProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [dailyTargetInput, setDailyTargetInput] = useState("5");
  const [sheetInputs, setSheetInputs] = useState({});

  const sheets = useMemo(() => progress?.sheets || [], [progress]);

  useEffect(() => {
    if (!progress) return;
    setDailyTargetInput(String(progress?.daily?.target ?? 5));
    const next = {};
    for (const row of progress.sheets || []) next[row.key] = String(row.completed);
    setSheetInputs(next);
  }, [progress]);

  const loadProgress = async () => {
    if (!isSignedIn) {
      setProgress(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/placement-sheets/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data?.success) {
        setProgress(data.progress);
      } else {
        toast.error(data?.message || "Could not load sheet progress");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, user?.id]);

  useEffect(() => {
    if (!isSignedIn) return undefined;
    let socket;
    let cancelled = false;

    (async () => {
      try {
        const token = await getToken();
        if (!token || cancelled) return;
        socket = io(getSocketBaseUrl(), {
          path: "/placement-sheet-socket.io",
          transports: ["websocket"],
          auth: { token },
        });
        socket.on("connect", () => {
          socket.emit("placement-sheet:subscribe");
          socket.emit("placement-sheet:subscribe-leaderboard");
        });
        socket.on("placement-sheet:update", (payload) => {
          setProgress(payload || null);
          setLoading(false);
        });
        socket.on("placement-sheet:leaderboard-update", ({ leaderboard: rows }) => {
          setLeaderboard(rows || []);
        });
      } catch {
        /* ignore socket setup errors */
      }
    })();

    return () => {
      cancelled = true;
      if (socket) socket.disconnect();
    };
  }, [getToken, isSignedIn]);

  const bump = async (sheetKey, delta) => {
    if (!isSignedIn || !sheetKey || !delta) return;
    try {
      setBusyKey(`${sheetKey}:${delta}`);
      const token = await getToken();
      const { data } = await axios.patch(
        "/api/placement-sheets/me",
        { sheetKey, delta },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.success) {
        setProgress(data.progress);
      } else {
        toast.error(data?.message || "Failed to update progress");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setBusyKey("");
    }
  };

  const setAbsolute = async (sheetKey) => {
    if (!isSignedIn || !sheetKey) return;
    const raw = Number(sheetInputs[sheetKey]);
    if (!Number.isFinite(raw)) {
      toast.error("Enter a valid number");
      return;
    }
    try {
      setBusyKey(`${sheetKey}:set`);
      const token = await getToken();
      const { data } = await axios.patch(
        "/api/placement-sheets/me",
        { sheetKey, completed: Math.trunc(raw) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.success) setProgress(data.progress);
      else toast.error(data?.message || "Failed to save");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setBusyKey("");
    }
  };

  const saveDailyTarget = async () => {
    const raw = Number(dailyTargetInput);
    if (!Number.isFinite(raw)) {
      toast.error("Daily target must be a number");
      return;
    }
    try {
      setBusyKey("daily-target");
      const token = await getToken();
      const { data } = await axios.patch(
        "/api/placement-sheets/me/daily-target",
        { dailyTarget: Math.trunc(raw) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.success) setProgress(data.progress);
      else toast.error(data?.message || "Failed to update daily target");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setBusyKey("");
    }
  };

  return (
    <div
      className="mt-8 rounded-2xl p-5 md:p-6 text-left"
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(99,102,241,0.18)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            Sheet Progress Tracker
          </h3>
          <p className="text-sm text-slate-500">
            Real-time synced progress for top placement sheets.
          </p>
        </div>
        {progress?.overall ? (
          <div className="text-right">
            <p className="text-sm text-slate-500">Overall</p>
            <p className="text-base font-black text-indigo-700">
              {progress.overall.solved}/{progress.overall.total} ({progress.overall.percent}%)
            </p>
            <p className="text-xs text-emerald-700 mt-1 inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {progress?.daily?.streakDays || 0} day streak
            </p>
          </div>
        ) : null}
      </div>

      {!isSignedIn ? (
        <p className="text-sm text-slate-500">Sign in to track your sheet progress in real time.</p>
      ) : loading ? (
        <p className="text-sm text-slate-500">Loading your progress...</p>
      ) : (
        <div className="space-y-5">
          <div
            className="rounded-xl p-4 md:p-5"
            style={{ border: "1px solid rgba(16,185,129,0.25)", background: "rgba(236,253,245,0.7)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-800 inline-flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-700" /> Daily Target
                </p>
                <p className="text-xs text-slate-600">
                  Solved today: {progress?.daily?.solvedToday || 0} / {progress?.daily?.target || 0}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={300}
                  value={dailyTargetInput}
                  onChange={(e) => setDailyTargetInput(e.target.value)}
                  className="w-24 rounded-lg border border-emerald-300 px-2 py-1.5 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={saveDailyTarget}
                  disabled={busyKey === "daily-target"}
                  className="rounded-lg bg-emerald-600 text-white text-sm font-semibold px-3 py-1.5 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sheets.map((sheet) => (
              <div
                key={sheet.key}
                className="rounded-xl p-4"
                style={{
                  border: "1px solid rgba(148,163,184,0.2)",
                  background: "rgba(248,250,255,0.9)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-slate-800">{sheet.title}</p>
                  <a
                    href={sheet.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 inline-flex items-center gap-1 text-xs font-semibold"
                  >
                    Open
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {sheet.completed}/{sheet.total} solved
                </p>
                <div className="w-full h-2 rounded-full bg-slate-200 mt-3 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${sheet.percent}%`,
                      background: "linear-gradient(90deg, #4f46e5, #2563eb)",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-semibold text-indigo-700">{sheet.percent}%</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => bump(sheet.key, -1)}
                      disabled={busyKey === `${sheet.key}:-1`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                      title="Decrease solved count"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => bump(sheet.key, 1)}
                      disabled={busyKey === `${sheet.key}:1`}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
                      title="Increase solved count"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={sheet.total}
                      value={sheetInputs[sheet.key] ?? ""}
                      onChange={(e) =>
                        setSheetInputs((prev) => ({ ...prev, [sheet.key]: e.target.value }))
                      }
                      className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setAbsolute(sheet.key)}
                      disabled={busyKey === `${sheet.key}:set`}
                      className="rounded-lg border border-indigo-300 text-indigo-700 text-xs font-semibold px-2.5 py-1.5 hover:bg-indigo-50 disabled:opacity-50"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-4 md:p-5"
            style={{ border: "1px solid rgba(99,102,241,0.2)", background: "rgba(238,242,255,0.65)" }}
          >
            <p className="font-bold text-slate-800 mb-3">Realtime Sheet Leaderboard</p>
            {!leaderboard.length ? (
              <p className="text-sm text-slate-500">No leaderboard data yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="text-left py-2">Rank</th>
                      <th className="text-left py-2">Student</th>
                      <th className="text-left py-2">Solved</th>
                      <th className="text-left py-2">Percent</th>
                      <th className="text-left py-2">Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.slice(0, 10).map((row, idx) => (
                      <tr key={row.userId} className="border-t border-indigo-100">
                        <td className="py-2 font-bold text-slate-700">#{idx + 1}</td>
                        <td className="py-2 text-slate-700">{row.name}</td>
                        <td className="py-2 text-indigo-700 font-semibold">
                          {row.solved}/{row.total}
                        </td>
                        <td className="py-2 text-slate-600">{row.percent}%</td>
                        <td className="py-2 text-emerald-700 font-semibold">{row.streakDays}d</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
