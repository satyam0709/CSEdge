import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { getSocketBaseUrl } from "../../utils/socketBaseUrl";

function medal(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return "🏅";
}

export default function WeeklySprintSection() {
  const navigate = useNavigate();
  const [sprint, setSprint] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadActiveSprint = async () => {
    try {
      const { data } = await axios.get("/api/sprint/active");
      if (data.success) setSprint(data.sprint);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveSprint();
  }, []);

  useEffect(() => {
    const socket = io(getSocketBaseUrl(), {
      path: "/weekly-sprint-socket.io",
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("sprint:subscribe-active");
    });

    socket.on("sprint:active-update", ({ sprint: liveSprint }) => {
      setSprint(liveSprint || null);
      setLoading(false);
    });

    return () => socket.disconnect();
  }, []);

  if (loading) {
    return (
      <section className="w-full max-w-6xl px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left">
          <p className="text-sm text-gray-500">Loading Weekly Sprint leaderboard...</p>
        </div>
      </section>
    );
  }

  if (!sprint) return null;

  return (
    <section className="w-full max-w-6xl px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Weekly Sprint Arena</h2>
            <p className="text-sm text-gray-500 mt-1">
              {sprint.title} · Live competition · {sprint.totalParticipants || 0} participants
            </p>
          </div>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            Realtime Public Leaderboard
          </span>
        </div>
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate("/arena")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
          >
            Open Full Arena
          </button>
        </div>

        {sprint.featured?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {sprint.featured.slice(0, 3).map((row) => (
              <div key={row.userId} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <p className="text-xs text-gray-500">Featured Student</p>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src={row.imageUrl || "https://placehold.co/80x80?text=User"}
                    alt={row.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {medal(row.rank)} #{row.rank} {row.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Score {row.score} · Accuracy {row.accuracy}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Rank</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Student</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Score</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Accuracy</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {(sprint.leaderboard || []).slice(0, 10).map((row) => (
                <tr key={row.userId} className="border-b border-gray-100">
                  <td className="px-3 py-2 font-medium">#{row.rank}</td>
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2 font-semibold text-indigo-700">{row.score}</td>
                  <td className="px-3 py-2">{row.accuracy}%</td>
                  <td className="px-3 py-2">{row.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
