import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import TestStatsCard from "./TestStatsCard";
import CourseStatsCard from "./CourseStatsCard";
import ExternalProblems from "../components/student/ExternalProblems";
import { Loader } from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching dashboard from /api/user/dashboard");
        const { data } = await axios.get("/api/user/dashboard");
        console.log("Dashboard response:", data);
        
        if (data.success && data.dashboard) {
          setDashboard(data.dashboard);
        } else {
          setError(data.message || "Failed to load dashboard");
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        const errorMsg = err.response?.data?.message || err.message || "Error loading dashboard";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
            <p className="text-gray-600">Welcome back! Track your progress and continue practicing.</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-all"
          >
            ← Back to Practice
          </button>
        </div>

        {/* Stats and Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TestStatsCard tests={dashboard?.tests || {}} />
          <CourseStatsCard courses={dashboard?.courses || {}} />
          <ExternalProblems />
        </div>
      </div>
    </div>
  );
}
