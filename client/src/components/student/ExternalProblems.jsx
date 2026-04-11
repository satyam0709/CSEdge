import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "../../utils/axios";
import { withClerkAuth } from "../../utils/testApiAuth";
import { RefreshCw, Radio, ExternalLink } from "lucide-react";

const POLL_MS = 30_000;

function formatAgo(ts) {
  if (!ts) return "";
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export default function ExternalProblems() {
  const { getToken } = useAuth();
  const [problems, setProblems] = useState([]);
  const [form, setForm] = useState({
    url: "",
    title: "",
    source: "",
    type: "dsa",
  });
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(async (silent = false) => {
    try {
      if (!silent) setListLoading(true);
      else setRefreshing(true);
      const { data } = await axios.get(
        "/api/user/external-problems",
        await withClerkAuth(getToken)
      );
      if (!mounted.current) return;
      if (data.success) setProblems(data.problems || []);
      setLastSynced(Date.now());
    } catch (err) {
      console.error(err);
    } finally {
      if (mounted.current) {
        setListLoading(false);
        setRefreshing(false);
      }
    }
  }, [getToken]);

  useEffect(() => {
    load(false);
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") load(true);
    }, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!form.url) return alert("URL required");
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/user/external-problem",
        form,
        await withClerkAuth(getToken)
      );
      if (data.success) {
        setForm({ url: "", title: "", source: "", type: "dsa" });
        await load(false);
      } else alert(data.message || "Failed");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    setLoading(false);
  };

  const toggle = async (id) => {
    try {
      const { data } = await axios.put(
        `/api/user/external-problem/${id}`,
        {},
        await withClerkAuth(getToken)
      );
      if (data.success) await load(true);
    } catch (err) {
      console.error(err);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this saved problem?")) return;
    try {
      const { data } = await axios.delete(
        `/api/user/external-problem/${id}`,
        await withClerkAuth(getToken)
      );
      if (data.success) await load(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold">Tracked External Problems</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800 ring-1 ring-emerald-200">
              <Radio className="h-3 w-3 animate-pulse text-emerald-600" />
              Auto-sync {POLL_MS / 1000}s
            </span>
            {lastSynced != null && (
              <span>List {formatAgo(lastSynced)}</span>
            )}
            {refreshing && (
              <span className="inline-flex items-center gap-1 text-blue-600">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Syncing…
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => load(true)}
          disabled={refreshing || listLoading}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${refreshing || listLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      <form onSubmit={add} className="space-y-2">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Problem URL"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Title (optional)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border px-3 py-2"
            placeholder="Source (eg. LeetCode)"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="rounded border px-2 py-2"
          >
            <option value="dsa">DSA</option>
            <option value="dev">Dev</option>
            <option value="aptitude">Aptitude</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Adding…" : "Add"}
        </button>
      </form>

      <div className="mt-4 space-y-2">
        {listLoading && problems.length === 0 ? (
          <div className="text-sm text-gray-500">Loading links…</div>
        ) : null}
        {!listLoading && problems.length === 0 ? (
          <div className="text-sm text-gray-500">No tracked problems yet.</div>
        ) : null}
        {problems.map((p) => (
          <div
            key={p._id}
            className="flex flex-col gap-2 rounded border p-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-blue-600 hover:underline"
              >
                {p.title || p.url}
                <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
              </a>
              <div className="text-xs text-gray-500">
                {p.source} • {new Date(p.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-1">
                <input
                  type="checkbox"
                  checked={p.solved}
                  onChange={() => toggle(p._id)}
                  className="cursor-pointer"
                />
                <span className="text-sm">Solved</span>
              </label>
              <button
                type="button"
                onClick={() => del(p._id)}
                className="cursor-pointer text-sm text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
