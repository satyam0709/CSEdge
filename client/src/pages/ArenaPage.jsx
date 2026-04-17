import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@clerk/clerk-react";
import axios from "../utils/axios";
import { getSocketBaseUrl } from "../utils/socketBaseUrl";

const PAGE_SIZE = 10;

function getCountdownParts(endDate) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { done: true, text: "Sprint ended" };
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return { done: false, text: `${d}d ${h}h ${m}m left` };
}

export default function ArenaPage() {
  const { userId } = useAuth();
  const [sprint, setSprint] = useState(null);
  const [page, setPage] = useState(1);
  const [countdown, setCountdown] = useState("");
  const [query, setQuery] = useState("");

  const leaderboard = sprint?.leaderboard || [];
  const podiumRows = leaderboard.slice(0, 3);
  const filteredLeaderboard = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leaderboard;
    return leaderboard.filter((row) => String(row.name || "").toLowerCase().includes(q));
  }, [leaderboard, query]);
  const myRow = useMemo(
    () => (userId ? leaderboard.find((row) => String(row.userId) === String(userId)) : null),
    [leaderboard, userId]
  );
  const totalPages = Math.max(1, Math.ceil(filteredLeaderboard.length / PAGE_SIZE));
  const pageRows = useMemo(
    () => filteredLeaderboard.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredLeaderboard, page]
  );

  useEffect(() => {
    const load = async () => {
      const { data } = await axios.get("/api/sprint/active");
      if (data.success) setSprint(data.sprint || null);
    };
    load();
  }, []);

  useEffect(() => {
    const socket = io(getSocketBaseUrl(), {
      path: "/weekly-sprint-socket.io",
      transports: ["websocket"],
    });
    socket.on("connect", () => socket.emit("sprint:subscribe-active"));
    socket.on("sprint:active-update", ({ sprint: liveSprint }) => {
      setSprint(liveSprint || null);
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!sprint?.endDate) {
      setCountdown("");
      return;
    }
    const update = () => setCountdown(getCountdownParts(sprint.endDate).text);
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, [sprint?.endDate]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  if (!sprint) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-gray-900">Sprint Arena</h1>
          <p className="text-sm text-gray-500 mt-2">No active sprint right now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{sprint.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Public realtime sprint leaderboard · {sprint.totalParticipants || 0} participants
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {countdown || "Live"}
          </span>
        </div>

        {myRow ? (
          <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-left">
            <p className="text-xs text-indigo-700 font-semibold">Your Live Rank</p>
            <p className="text-sm text-gray-800 mt-1">
              #{myRow.rank} · Score {myRow.score} · Accuracy {myRow.accuracy}% · Attempts{" "}
              {myRow.attempts}
            </p>
          </div>
        ) : null}

        {podiumRows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            {podiumRows.map((row) => (
              <div
                key={row.userId}
                className={`rounded-xl border p-4 text-left ${
                  row.rank === 1
                    ? "bg-amber-50 border-amber-200"
                    : row.rank === 2
                    ? "bg-slate-50 border-slate-200"
                    : "bg-orange-50 border-orange-200"
                }`}
              >
                <p className="text-xs font-semibold text-gray-600">Podium #{row.rank}</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{row.name}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Score {row.score} · Accuracy {row.accuracy}% · Active {row.activeDays} days
                </p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student name..."
            className="w-full md:w-80 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Rank</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Student</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Score</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Accuracy</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Attempts</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Active Days</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr
                  key={row.userId}
                  className={`border-b ${
                    String(row.userId) === String(userId)
                      ? "bg-indigo-50 border-indigo-100"
                      : "border-gray-100"
                  }`}
                >
                  <td className="px-3 py-2 font-medium">#{row.rank}</td>
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2 font-semibold text-indigo-700">{row.score}</td>
                  <td className="px-3 py-2">{row.accuracy}%</td>
                  <td className="px-3 py-2">{row.attempts}</td>
                  <td className="px-3 py-2">{row.activeDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-3 py-2 rounded-lg text-sm border border-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <p className="text-sm text-gray-600">
            Page {page} / {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-3 py-2 rounded-lg text-sm border border-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
