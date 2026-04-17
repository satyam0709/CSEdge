import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "../utils/axios";
import { withClerkAuth } from "../utils/testApiAuth";
import TestStatsCard from "./TestStatsCard";
import CourseStatsCard from "./CourseStatsCard";
import InterviewStatsCard from "./InterviewStatsCard";
import ExternalProblems from "../components/student/ExternalProblems";
import { Loader, RefreshCw, Radio } from "lucide-react";

/** How often to pull fresh stats from the API (polling — true push would need WebSockets). */
const DASHBOARD_POLL_MS = 30_000;

function formatAgo(ts) {
  if (!ts) return "";
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchDashboard = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      } else {
        setRefreshing(true);
      }

      const { data } = await axios.get(
        "/api/user/dashboard",
        await withClerkAuth(getToken)
      );

      if (!mounted.current) return;

      if (data.success && data.dashboard) {
        setDashboard(data.dashboard);
        setError(null);
        setLastUpdated(Date.now());
      } else {
        setError(data.message || "Failed to load dashboard");
      }
    } catch (err) {
      if (!mounted.current) return;
      console.error("Dashboard fetch error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Error loading dashboard";
      if (!silent) setError(errorMsg);
    } finally {
      if (mounted.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [getToken]);

  useEffect(() => {
    fetchDashboard(false);
  }, [fetchDashboard]);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchDashboard(true);
      }
    }, DASHBOARD_POLL_MS);
    return () => clearInterval(id);
  }, [fetchDashboard]);

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (loading && !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto mb-2 h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => fetchDashboard(false)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Your Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Stats refresh automatically every{" "}
              {DASHBOARD_POLL_MS / 1000}s while this tab is open.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-medium text-emerald-800 ring-1 ring-emerald-200">
                <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-600" />
                Live sync
              </span>
              {lastUpdated != null && (
                <span>Updated {formatAgo(lastUpdated)}</span>
              )}
              {refreshing && (
                <span className="inline-flex items-center gap-1 text-blue-600">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Refreshing…
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh now
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg bg-gray-200 px-6 py-2 font-semibold text-gray-700 transition-all hover:bg-gray-300"
            >
              ← Back to Practice
            </button>
          </div>
        </div>

        {/* ── Mock Interview Tracker (full-width) ── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
          <InterviewStatsCard data={dashboard?.mockInterview || {}} />
        </div>

        {/* ── Test / Course / External Problems ── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <TestStatsCard tests={dashboard?.tests || {}} />
          <CourseStatsCard courses={dashboard?.courses || {}} />
          <ExternalProblems />
        </div>
      </div>
    </div>
  );
}
