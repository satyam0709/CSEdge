import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { Save, RefreshCw, Inbox, Loader2 } from "lucide-react";

export default function MentorSetup() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    notifyEmail: "",
    googleMeetLink: "",
    availabilityText: "",
  });

  const authHeaders = useCallback(async () => {
    const token = await getToken();
    return { Authorization: `Bearer ${token}` };
  }, [getToken]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const h = await authHeaders();
      const [sRes, rRes] = await Promise.all([
        axios.get("/api/admin/mentor-settings", { headers: h }),
        axios.get("/api/admin/mentor-session-requests?limit=100", {
          headers: h,
        }),
      ]);
      if (sRes.data?.success && sRes.data.settings) {
        setForm({
          notifyEmail: sRes.data.settings.notifyEmail || "",
          googleMeetLink: sRes.data.settings.googleMeetLink || "",
          availabilityText: sRes.data.settings.availabilityText || "",
        });
      } else {
        toast.error(sRes.data?.message || "Could not load mentor settings.");
      }
      if (rRes.data?.success) {
        setRequests(rRes.data.requests || []);
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || e.message || "Load failed.");
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const h = await authHeaders();
      const { data } = await axios.put("/api/admin/mentor-settings", form, {
        headers: h,
      });
      if (data?.success) {
        toast.success("Mentor settings saved.");
        if (data.settings) {
          setForm({
            notifyEmail: data.settings.notifyEmail || "",
            googleMeetLink: data.settings.googleMeetLink || "",
            availabilityText: data.settings.availabilityText || "",
          });
        }
      } else {
        toast.error(data?.message || "Save failed.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Save failed."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center gap-2 text-slate-600">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading mentor tools…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 text-left">
      <h1 className="text-2xl font-bold text-slate-900">1:1 Mentor setup</h1>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        Students see this on the home page: Meet link, your office hours, and a
        form that stores every request here. Add{" "}
        <strong className="text-slate-800">SMTP variables</strong> on the server
        if you want instant email when someone submits.
      </p>

      <form
        onSubmit={onSave}
        className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Mentor notification email
          </label>
          <input
            type="email"
            value={form.notifyEmail}
            onChange={(e) =>
              setForm((f) => ({ ...f, notifyEmail: e.target.value }))
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="mentor@yourdomain.com"
          />
          <p className="mt-1 text-xs text-slate-500">
            Session-request notifications are sent to this address when SMTP is
            configured.
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Google Meet link (https only)
          </label>
          <input
            type="url"
            value={form.googleMeetLink}
            onChange={(e) =>
              setForm((f) => ({ ...f, googleMeetLink: e.target.value }))
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder="https://meet.google.com/..."
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            When you are free (shown to students)
          </label>
          <textarea
            rows={6}
            value={form.availabilityText}
            onChange={(e) =>
              setForm((f) => ({ ...f, availabilityText: e.target.value }))
            }
            className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm"
            placeholder={`Example:\nMon–Thu: 7:00–8:30 PM IST\nSat: 10 AM–12 PM IST\nUpdate Meet link before each slot if it changes.`}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save settings
        </button>
      </form>

      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Inbox className="h-5 w-5 text-indigo-600" />
            Recent student requests
          </h2>
          <button
            type="button"
            onClick={() => loadAll()}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        {requests.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No requests yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2">Topic</th>
                  <th className="px-3 py-2">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r._id} className="align-top hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-900">
                        {r.fromName}
                      </div>
                      <a
                        className="text-indigo-600 hover:underline"
                        href={`mailto:${encodeURIComponent(r.fromEmail)}`}
                      >
                        {r.fromEmail}
                      </a>
                    </td>
                    <td className="max-w-[180px] px-3 py-2 text-slate-800">
                      {r.topic}
                    </td>
                    <td className="max-w-md px-3 py-2 text-slate-600 whitespace-pre-wrap">
                      {r.message}
                    </td>
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
