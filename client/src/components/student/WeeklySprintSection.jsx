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
      <section className="ui-section-wrap py-6 md:py-8">
        <div className="ui-soft-card p-6 text-left">
          <p className="text-sm text-gray-500">Loading Weekly Sprint leaderboard...</p>
        </div>
      </section>
    );
  }

  if (!sprint) return null;

  return (
    <section className="ui-section-wrap py-6 md:py-8">
      <div
        className="ui-hover-lift p-5 sm:p-6 md:p-7 text-left rounded-2xl relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(99,102,241,0.18)',
          boxShadow: '0 14px 40px rgba(15,23,42,0.08), 0 0 0 1px rgba(99,102,241,0.1)',
        }}
      >
        {/* Background accent */}
        <div
          className="absolute top-0 right-0 w-64 h-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"
                style={{ boxShadow: '0 0 8px #34d399' }}
              />
              Weekly Sprint Arena
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {sprint.title} · Live competition ·{' '}
              <span className="font-semibold text-indigo-600">
                {sprint.totalParticipants || 0} participants
              </span>
            </p>
          </div>
        
        </div>
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/arena")}
            className="shimmer-btn inline-flex items-center gap-2 text-white px-4 py-2 rounded-xl text-sm font-semibold"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #2563eb)',
              boxShadow: '0 0 16px rgba(79,70,229,0.4)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"
              style={{ boxShadow: '0 0 5px #6ee7b7' }}
            />
            Open Full Arena
          </button>
        </div>

        {sprint.featured?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {sprint.featured.slice(0, 3).map((row, fi) => (
              <div
                key={row.userId}
                className="rounded-xl p-4 ui-hover-lift stagger-card"
                style={{
                  '--d': `${fi * 80}ms`,
                  background: 'rgba(248,250,255,0.85)',
                  border: '1px solid rgba(99,102,241,0.16)',
                  boxShadow: '0 4px 16px rgba(79,70,229,0.06)',
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(99,102,241,0.7)' }}>
                  Featured Student
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={row.imageUrl || 'https://placehold.co/80x80?text=User'}
                    alt={row.name}
                    className="w-10 h-10 rounded-full object-cover border-2"
                    style={{ borderColor: 'rgba(99,102,241,0.3)' }}
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {medal(row.rank)} #{row.rank} {row.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Score{' '}
                      <span className="font-semibold text-indigo-600">{row.score}</span>
                      {' '}· Accuracy{' '}
                      <span className="font-semibold text-emerald-600">{row.accuracy}%</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(148,163,184,0.18)' }}>
          <table className="w-full min-w-[560px] text-xs sm:text-sm">
            <thead>
              <tr style={{ background: 'rgba(248,250,255,0.9)', borderBottom: '1px solid rgba(148,163,184,0.18)' }}>
                <th className="text-left px-4 py-3 font-bold text-slate-500 tracking-wide uppercase text-[11px]">Rank</th>
                <th className="text-left px-4 py-3 font-bold text-slate-500 tracking-wide uppercase text-[11px]">Student</th>
                <th className="text-left px-4 py-3 font-bold text-slate-500 tracking-wide uppercase text-[11px]">Score</th>
                <th className="text-left px-4 py-3 font-bold text-slate-500 tracking-wide uppercase text-[11px]">Accuracy</th>
                <th className="text-left px-4 py-3 font-bold text-slate-500 tracking-wide uppercase text-[11px]">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {(sprint.leaderboard || []).slice(0, 10).map((row, i) => (
                <tr
                  key={row.userId}
                  className="transition-colors duration-150 hover:bg-blue-50/40"
                  style={{ borderBottom: '1px solid rgba(148,163,184,0.12)' }}
                >
                  <td className="px-4 py-3 font-bold text-slate-700">
                    {i < 3 ? (
                      <span>{['🥇','🥈','🥉'][i]} #{row.rank}</span>
                    ) : (
                      <span className="text-slate-500">#{row.rank}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{row.name}</td>
                  <td className="px-4 py-3 font-black" style={{ color: '#4f46e5' }}>{row.score}</td>
                  <td className="px-4 py-3 text-slate-600">{row.accuracy}%</td>
                  <td className="px-4 py-3 text-slate-500">{row.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </section>
  );
}
