import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { io } from "socket.io-client";
import axios from "../utils/axios";
import { getSocketBaseUrl } from "../utils/socketBaseUrl";
import { toast } from "react-toastify";

function skillBadge(type) {
  if (type === "dsa") return "bg-indigo-100 text-indigo-700";
  if (type === "dev") return "bg-blue-100 text-blue-700";
  if (type === "aptitude") return "bg-emerald-100 text-emerald-700";
  return "bg-gray-100 text-gray-600";
}

function heatColor(point) {
  if (!point.total) return "bg-gray-100";
  if (point.intensity < 0.25) return "bg-indigo-200";
  if (point.intensity < 0.5) return "bg-indigo-300";
  if (point.intensity < 0.75) return "bg-indigo-500";
  return "bg-indigo-700";
}

export default function AdminAnalytics() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [days, setDays] = useState(120);
  const [windowDays, setWindowDays] = useState(60);
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [branchFilter, setBranchFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [sprints, setSprints] = useState([]);
  const [newSprint, setNewSprint] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    featuredCount: 5,
  });

  const readiness = snapshot?.readiness;
  const points = snapshot?.heatmap?.points || [];

  const monthlyGroups = useMemo(() => {
    const map = new Map();
    points.forEach((p) => {
      const month = p.date.slice(0, 7);
      if (!map.has(month)) map.set(month, []);
      map.get(month).push(p);
    });
    return Array.from(map.entries());
  }, [points]);

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/analytics/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data.success) throw new Error(data.message || "Failed to load users");
      setUsers(data.users || []);
      if (!userId && data.users?.length) setUserId(data.users[0].userId);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const fetchSnapshot = async (selectedUserId) => {
    if (!selectedUserId) return;
    setLoading(true);
    try {
      const token = await getToken();
      const [heatRes, readinessRes] = await Promise.all([
        axios.get("/api/admin/analytics/skill-heatmap", {
          params: { userId: selectedUserId, days },
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/analytics/predictive-readiness", {
          params: { userId: selectedUserId, windowDays },
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!heatRes.data.success) throw new Error(heatRes.data.message || "Heatmap fetch failed");
      if (!readinessRes.data.success) {
        throw new Error(readinessRes.data.message || "Readiness fetch failed");
      }

      setSnapshot({
        userId: selectedUserId,
        heatmap: heatRes.data.heatmap,
        readiness: readinessRes.data.readiness,
        lastUpdatedAt: new Date().toISOString(),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/analytics/readiness-leaderboard", {
        params: {
          windowDays,
          limit: 25,
          branch: branchFilter || undefined,
          year: yearFilter || undefined,
          college: collegeFilter || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data.success) throw new Error(data.message || "Failed to load leaderboard");
      setLeaderboard(data.leaderboard || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const exportLeaderboardCsv = async () => {
    try {
      const token = await getToken();
      const response = await axios.get("/api/admin/analytics/readiness-leaderboard/export.csv", {
        params: {
          windowDays,
          limit: 500,
          branch: branchFilter || undefined,
          year: yearFilter || undefined,
          college: collegeFilter || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute(
        "download",
        `readiness-leaderboard-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Leaderboard CSV exported");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Export failed");
    }
  };

  const fetchSprints = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/sprints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setSprints(data.sprints || []);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const createSprint = async () => {
    try {
      if (!newSprint.title || !newSprint.startDate || !newSprint.endDate) {
        toast.error("Title, start date and end date are required");
        return;
      }
      const token = await getToken();
      const { data } = await axios.post("/api/admin/sprints", newSprint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data.success) throw new Error(data.message || "Failed to create sprint");
      toast.success("Weekly sprint created");
      setNewSprint({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        featuredCount: 5,
      });
      fetchSprints();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const toggleSprintPublish = async (sprint) => {
    try {
      const token = await getToken();
      const { data } = await axios.put(
        `/api/admin/sprints/${sprint._id}`,
        { isPublished: !sprint.isPublished },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data.success) throw new Error(data.message || "Failed to update sprint");
      fetchSprints();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSprints();
  }, []);

  useEffect(() => {
    fetchSnapshot(userId);
  }, [userId, days, windowDays]);

  useEffect(() => {
    fetchLeaderboard();
  }, [windowDays, branchFilter, yearFilter, collegeFilter]);

  useEffect(() => {
    let socket;
    const startSocket = async () => {
      if (!userId) return;
      const token = await getToken();
      socket = io(getSocketBaseUrl(), {
        path: "/admin-analytics-socket.io",
        transports: ["websocket"],
        auth: { token },
      });

      socket.on("analytics:update", (data) => {
        if (String(data.userId) !== String(userId)) return;
        setSnapshot(data);
        fetchLeaderboard().catch(() => {});
      });

      socket.on("analytics:error", (payload) => {
        toast.error(payload?.message || "Realtime analytics error");
      });

      socket.on("connect", () => {
        socket.emit("analytics:subscribe", {
          userId,
          heatmapDays: days,
          readinessWindowDays: windowDays,
        });
      });
    };

    startSocket().catch((error) => toast.error(error.message));
    return () => {
      if (socket?.connected) socket.emit("analytics:unsubscribe", { userId });
      socket?.disconnect();
    };
  }, [userId, days, windowDays, getToken]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Realtime skill heatmap and predictive placement readiness for monitored users.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap gap-3 items-end mb-6">
        <div className="min-w-[260px]">
          <label className="block text-xs text-gray-600 mb-1">User</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {users.map((u) => (
              <option key={u.userId} value={u.userId}>
                {u.name} {u.email ? `(${u.email})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Heatmap Days</label>
          <input
            type="number"
            min={7}
            max={365}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Readiness Window</label>
          <input
            type="number"
            min={14}
            max={365}
            value={windowDays}
            onChange={(e) => setWindowDays(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-36"
          />
        </div>
        <button
          type="button"
          onClick={() => fetchSnapshot(userId)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Predictive Placement Score</p>
          <p className="text-4xl font-bold text-indigo-700 mt-2">
            {readiness ? `${readiness.readiness}%` : "--"}
          </p>
          <p className="mt-2 text-sm text-gray-600">{readiness?.label || "No data yet"}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Accuracy Signal</p>
          <p className="text-3xl font-semibold text-gray-900 mt-2">
            {readiness ? `${readiness.factors.weightedAccuracy}%` : "--"}
          </p>
          <p className="text-xs text-gray-500 mt-1">Weighted across DSA, Dev and Aptitude</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Realtime Status</p>
          <p className="text-sm text-gray-900 mt-2">
            {snapshot?.lastUpdatedAt
              ? `Updated ${new Date(snapshot.lastUpdatedAt).toLocaleString()}`
              : "Waiting for updates"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Live updates trigger when this user submits new attempts.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Weekly Sprint Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
          <input
            value={newSprint.title}
            onChange={(e) => setNewSprint((p) => ({ ...p, title: e.target.value }))}
            placeholder="Sprint title"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            value={newSprint.description}
            onChange={(e) => setNewSprint((p) => ({ ...p, description: e.target.value }))}
            placeholder="Description"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={newSprint.startDate}
            onChange={(e) => setNewSprint((p) => ({ ...p, startDate: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={newSprint.endDate}
            onChange={(e) => setNewSprint((p) => ({ ...p, endDate: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={createSprint}
            className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700"
          >
            Create Sprint
          </button>
        </div>
        <div className="space-y-2">
          {sprints.slice(0, 5).map((s) => (
            <div
              key={s._id}
              className="flex flex-wrap items-center justify-between gap-2 border border-gray-200 rounded-lg px-3 py-2"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                <p className="text-xs text-gray-500">
                  {new Date(s.startDate).toLocaleDateString()} -{" "}
                  {new Date(s.endDate).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleSprintPublish(s)}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  s.isPublished
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {s.isPublished ? "Published" : "Draft"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Company Tier Mapping</h2>
        {readiness?.companyTier ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Recommended Tier:{" "}
              <span className="font-semibold text-indigo-700">{readiness.companyTier.tier}</span>
            </p>
            <p className="text-sm text-gray-600">{readiness.companyTier.guidance}</p>
            <div className="flex flex-wrap gap-2">
              {(readiness.companyTier.examples || []).map((name) => (
                <span
                  key={name}
                  className="px-2 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No tier mapping available yet.</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Skill Heatmap</h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading heatmap...</p>
        ) : points.length === 0 ? (
          <p className="text-sm text-gray-500">No attempts found in selected range.</p>
        ) : (
          <div className="space-y-4 overflow-x-auto">
            {monthlyGroups.map(([month, monthPoints]) => (
              <div key={month}>
                <p className="text-xs text-gray-500 mb-2">{month}</p>
                <div className="flex flex-wrap gap-1 max-w-[860px]">
                  {monthPoints.map((p) => (
                    <div
                      key={p.date}
                      title={`${p.date} | Total: ${p.total} | DSA: ${p.dsa} | Dev: ${p.dev} | Aptitude: ${p.aptitude}`}
                      className={`w-4 h-4 rounded-[3px] ${heatColor(p)} border border-white`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Skill Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(readiness?.typeBreakdown || []).map((row) => (
            <div key={row.type} className="border border-gray-200 rounded-lg p-3">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${skillBadge(row.type)}`}>
                {row.type.toUpperCase()}
              </span>
              <p className="text-2xl font-semibold text-gray-900 mt-2">{row.accuracy}%</p>
              <p className="text-xs text-gray-500">{row.attempts} attempts in window</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Readiness Leaderboard</h2>
          <button
            type="button"
            onClick={exportLeaderboardCsv}
            className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-700"
          >
            Export CSV
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
          <input
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            placeholder="Filter by branch"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            placeholder="Filter by year"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            placeholder="Filter by college"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              setBranchFilter("");
              setYearFilter("");
              setCollegeFilter("");
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
        {leaderboard.length === 0 ? (
          <p className="text-sm text-gray-500">No leaderboard data available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Rank</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">User</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Readiness</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Tier</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Branch</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Year</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">College</th>
                  <th className="text-left px-3 py-2 font-semibold text-gray-600">Attempts</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row, idx) => (
                  <tr key={row.userId} className="border-b border-gray-100">
                    <td className="px-3 py-2">{idx + 1}</td>
                    <td className="px-3 py-2">
                      <p className="font-medium text-gray-900">{row.name}</p>
                      <p className="text-xs text-gray-500">{row.email || row.userId}</p>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-semibold text-indigo-700">{row.readiness}%</span>
                      <span className="text-xs text-gray-500 ml-2">{row.label}</span>
                    </td>
                    <td className="px-3 py-2">{row.companyTier?.tier || "-"}</td>
                    <td className="px-3 py-2">{row.branch || "-"}</td>
                    <td className="px-3 py-2">{row.year || "-"}</td>
                    <td className="px-3 py-2">{row.college || "-"}</td>
                    <td className="px-3 py-2">{row.attemptsConsidered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
