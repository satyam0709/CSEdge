import { useEffect, useMemo, useState } from "react";
import axios from "../../utils/axios";
import { useAuth } from "@clerk/clerk-react";

export default function BpscDashboardPanel({ title = "BPSC Practice Dashboard" }) {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/bpsc/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data?.success) throw new Error(data?.message || "Could not load BPSC dashboard");
      setDashboard(data.dashboard || null);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Could not load BPSC dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(() => dashboard?.recentReview || [], [dashboard]);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">
          Auto-refresh every 20s. Track score, mistakes, and detailed answer review.
        </p>

        {loading ? (
          <p className="mt-8 text-slate-500">Loading...</p>
        ) : error ? (
          <p className="mt-8 text-red-600">{error}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white border rounded-xl p-4">
                <p className="text-xs text-slate-500">Attempts</p>
                <p className="text-2xl font-bold text-slate-900">{dashboard?.totalAttempts || 0}</p>
              </div>
              <div className="bg-white border rounded-xl p-4">
                <p className="text-xs text-slate-500">Correct</p>
                <p className="text-2xl font-bold text-emerald-700">{dashboard?.correctCount || 0}</p>
              </div>
              <div className="bg-white border rounded-xl p-4">
                <p className="text-xs text-slate-500">Wrong</p>
                <p className="text-2xl font-bold text-rose-700">{dashboard?.wrongCount || 0}</p>
              </div>
              <div className="bg-white border rounded-xl p-4">
                <p className="text-xs text-slate-500">Accuracy</p>
                <p className="text-2xl font-bold text-indigo-700">{dashboard?.accuracy || 0}%</p>
              </div>
            </div>

            <div className="mt-6 bg-white border rounded-xl p-4">
              <h2 className="font-bold text-slate-900 mb-3">Level-wise performance</h2>
              {!dashboard?.perLevel?.length ? (
                <p className="text-sm text-slate-500">No level attempts yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead>
                      <tr className="text-left text-slate-500 border-b">
                        <th className="py-2">Level</th>
                        <th className="py-2">Attempts</th>
                        <th className="py-2">Correct</th>
                        <th className="py-2">Wrong</th>
                        <th className="py-2">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.perLevel.map((r) => (
                        <tr key={r.level} className="border-b border-slate-100">
                          <td className="py-2 font-semibold">L{r.level}</td>
                          <td className="py-2">{r.attempts}</td>
                          <td className="py-2 text-emerald-700">{r.correct}</td>
                          <td className="py-2 text-rose-700">{r.wrong}</td>
                          <td className="py-2">{r.accuracy}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-6 bg-white border rounded-xl p-4">
              <h2 className="font-bold text-slate-900 mb-3">Recent answer review</h2>
              {!rows.length ? (
                <p className="text-sm text-slate-500">No review data yet.</p>
              ) : (
                <div className="space-y-3">
                  {rows.map((r, idx) => (
                    <div
                      key={`${r.questionId}-${idx}`}
                      className={`rounded-lg border p-3 ${r.isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        L{r.level} · {r.topic || "General"} · {r.question}
                      </p>
                      <p className="text-xs mt-1 text-slate-700">
                        Your answer: <span className="font-semibold">{r.selectedAnswer || "Not answered"}</span>
                      </p>
                      <p className="text-xs text-slate-700">
                        Correct answer: <span className="font-semibold">{r.correctAnswer || "—"}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
