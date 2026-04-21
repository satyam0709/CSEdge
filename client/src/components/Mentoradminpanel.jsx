import { useEffect, useState, useCallback, useRef } from "react";
import {
  Radio,
  Settings2,
  Inbox,
  Loader2,
  RefreshCw,
  Save,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
} from "lucide-react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

const POLL_MS = 15_000;
const STATUS_META = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200" },
  seen: { label: "Seen", color: "bg-blue-100 text-blue-800 border-blue-200" },
  resolved: { label: "Resolved", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

export default function MentorAdminPanel() {
  const [tab, setTab] = useState("requests");
  const [isLive, setIsLive] = useState(false);
  const [togglingLive, setTogglingLive] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    notifyEmail: "",
    googleMeetLink: "",
    availabilityText: "",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Requests
  const [requests, setRequests] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, seen: 0, resolved: 0 });
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [secondsLeft, setSecondsLeft] = useState(POLL_MS / 1000);
  const [updatingId, setUpdatingId] = useState(null);

  const pollRef = useRef(null);
  const countdownRef = useRef(null);

  // ── Fetch settings ────────────────────────────────────────────────────────────
  const loadSettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const { data } = await axios.get("/api/mentor/admin/settings");
      if (data?.success) {
        setSettings({
          notifyEmail: data.settings.notifyEmail || "",
          googleMeetLink: data.settings.googleMeetLink || "",
          availabilityText: data.settings.availabilityText || "",
        });
        setIsLive(data.settings.isLive ?? false);
      }
    } catch {
      toast.error("Could not load mentor settings.");
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  // ── Fetch requests ────────────────────────────────────────────────────────────
  const loadRequests = useCallback(async (silent = false) => {
    if (!silent) setRefreshing(true);
    try {
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const { data } = await axios.get(`/api/mentor/admin/requests${params}`);
      if (data?.success) {
        setRequests(data.requests || []);
        setCounts(data.counts || { pending: 0, seen: 0, resolved: 0 });
      }
    } catch {
      if (!silent) toast.error("Could not refresh requests.");
    } finally {
      setLoadingRequests(false);
      if (!silent) setRefreshing(false);
      setSecondsLeft(POLL_MS / 1000);
    }
  }, [statusFilter]);

  useEffect(() => { loadSettings(); }, [loadSettings]);
  useEffect(() => { loadRequests(false); }, [loadRequests]);

  // Poll every 15s
  useEffect(() => {
    pollRef.current = setInterval(() => loadRequests(true), POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [loadRequests]);

  // Countdown display
  useEffect(() => {
    countdownRef.current = setInterval(
      () => setSecondsLeft((s) => (s <= 1 ? POLL_MS / 1000 : s - 1)),
      1000
    );
    return () => clearInterval(countdownRef.current);
  }, []);

  // ── Toggle live ───────────────────────────────────────────────────────────────
  const toggleLive = async () => {
    setTogglingLive(true);
    const next = !isLive;
    try {
      const { data } = await axios.patch("/api/mentor/admin/live", { isLive: next });
      if (data?.success) {
        setIsLive(data.isLive);
        toast.success(data.isLive ? "Session is now live." : "Session ended.");
      }
    } catch {
      toast.error("Could not update live status.");
    } finally {
      setTogglingLive(false);
    }
  };

  // ── Save settings ─────────────────────────────────────────────────────────────
  const saveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const { data } = await axios.put("/api/mentor/admin/settings", settings);
      if (data?.success) {
        toast.success("Settings saved.");
        setSettings({
          notifyEmail: data.settings.notifyEmail || "",
          googleMeetLink: data.settings.googleMeetLink || "",
          availabilityText: data.settings.availabilityText || "",
        });
      } else {
        toast.error(data?.message || "Save failed.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  // ── Update request status ─────────────────────────────────────────────────────
  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const { data } = await axios.patch(`/api/mentor/admin/requests/${id}`, { status });
      if (data?.success) {
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: data.request.status } : r))
        );
        setCounts((prev) => {
          const old = requests.find((r) => r._id === id)?.status;
          if (!old || old === status) return prev;
          return {
            ...prev,
            [old]: Math.max(0, (prev[old] || 0) - 1),
            [status]: (prev[status] || 0) + 1,
          };
        });
        toast.success("Status updated.");
      }
    } catch {
      toast.error("Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition";

  return (
    <div className="rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/70 shadow-[0_14px_40px_rgba(16,185,129,0.1)] overflow-hidden">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-4 border-b border-emerald-100/70 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold text-slate-900">1:1 Mentor Control</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage your live session, settings, and student requests.</p>
        </div>

        {/* Go live toggle */}
        <button
          onClick={toggleLive}
          disabled={togglingLive || loadingSettings}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition shadow-md disabled:opacity-60 ${
            isLive
              ? "bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-300/50 ring-offset-1"
              : "bg-emerald-500 hover:bg-emerald-600 text-white"
          }`}
        >
          {togglingLive ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Radio className={`h-4 w-4 ${isLive ? "animate-pulse" : ""}`} />
          )}
          {isLive ? "End Session" : "Go Live"}
        </button>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
      <div className="flex border-b border-emerald-100/70 px-5">
        {[
          {
            id: "requests",
            label: "Requests",
            icon: <Inbox className="h-4 w-4" />,
            badge: counts.pending || null,
          },
          {
            id: "settings",
            label: "Settings",
            icon: <Settings2 className="h-4 w-4" />,
            badge: null,
          },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition -mb-px ${
              tab === t.id
                ? "border-emerald-500 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.icon}
            {t.label}
            {t.badge ? (
              <span className="rounded-full bg-amber-500 text-white text-xs font-bold px-1.5 py-0.5 min-w-[18px] text-center leading-none">
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6">
        {/* ── Requests tab ──────────────────────────────────────────────────── */}
        {tab === "requests" && (
          <div>
            {/* Filter + refresh bar */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="flex gap-2 flex-wrap">
                {["all", "pending", "seen", "resolved"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${
                      statusFilter === s
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    {s === "all" ? `All (${Object.values(counts).reduce((a, b) => a + b, 0)})` : `${STATUS_META[s].label} (${counts[s] ?? 0})`}
                  </button>
                ))}
              </div>

              <button
                onClick={() => loadRequests(false)}
                disabled={refreshing}
                className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-600 transition disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing…" : `Auto-refresh in ${secondsLeft}s`}
              </button>
            </div>

            {/* Requests list */}
            {loadingRequests ? (
              <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading requests…
              </div>
            ) : requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
                <Inbox className="h-8 w-8 opacity-40" />
                <p className="text-sm">No requests yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div
                    key={r._id}
                    className="rounded-2xl border border-white/80 bg-white/95 p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-slate-900">{r.fromName}</span>
                          <span className="text-xs text-slate-400">{r.fromEmail}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_META[r.status]?.color}`}>
                            {STATUS_META[r.status]?.label}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-emerald-700">{r.topic}</p>
                        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                          {r.message}
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(r.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>

                      {/* Status actions */}
                      <div className="flex flex-col gap-1.5 shrink-0">
                        {r.status !== "seen" && (
                          <button
                            onClick={() => updateStatus(r._id, "seen")}
                            disabled={updatingId === r._id}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition disabled:opacity-50"
                          >
                            {updatingId === r._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />}
                            Mark seen
                          </button>
                        )}
                        {r.status !== "resolved" && (
                          <button
                            onClick={() => updateStatus(r._id, "resolved")}
                            disabled={updatingId === r._id}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition disabled:opacity-50"
                          >
                            {updatingId === r._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                            Resolve
                          </button>
                        )}
                        {r.status !== "pending" && (
                          <button
                            onClick={() => updateStatus(r._id, "pending")}
                            disabled={updatingId === r._id}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition disabled:opacity-50"
                          >
                            {updatingId === r._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Clock className="h-3 w-3" />}
                            Reopen
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Settings tab ──────────────────────────────────────────────────── */}
        {tab === "settings" && (
          <form onSubmit={saveSettings} className="space-y-5 max-w-2xl">
            {loadingSettings ? (
              <div className="flex items-center gap-2 py-10 text-slate-400 justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading settings…
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Google Meet link
                  </label>
                  <input
                    type="url"
                    value={settings.googleMeetLink}
                    onChange={(e) => setSettings((s) => ({ ...s, googleMeetLink: e.target.value }))}
                    className={inputCls}
                    placeholder="https://meet.google.com/abc-defg-hij"
                  />
                  <p className="mt-1 text-xs text-slate-400">Students see a "Join" button when this is set and you're live.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Availability hours
                  </label>
                  <textarea
                    rows={4}
                    value={settings.availabilityText}
                    onChange={(e) => setSettings((s) => ({ ...s, availabilityText: e.target.value }))}
                    className={`${inputCls} resize-y`}
                    placeholder={"Mon–Fri 6:00–8:00 PM IST\nSaturday 10:00 AM–12:00 PM IST"}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                    Notification email
                  </label>
                  <input
                    type="email"
                    value={settings.notifyEmail}
                    onChange={(e) => setSettings((s) => ({ ...s, notifyEmail: e.target.value }))}
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                  <p className="mt-1 text-xs text-slate-400">Student requests are emailed here when SMTP is configured.</p>
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 flex gap-2 text-xs text-amber-800">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    SMTP is configured via <code className="font-mono bg-amber-100 px-1 rounded">MENTOR_SMTP_*</code> env
                    variables on the server. No UI override — ask your admin to set them.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="btn-base btn-primary gap-2 px-6 py-2.5 disabled:opacity-60"
                >
                  {savingSettings ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {savingSettings ? "Saving…" : "Save settings"}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}