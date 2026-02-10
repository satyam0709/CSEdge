import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Target, TrendingUp, Clock, AlertCircle } from "lucide-react";

export default function TestAnalytics({ type }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`/api/test/analytics?type=${type}`);
        if (data.success) {
          setAnalytics(data.analytics);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [type]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow border border-red-200">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">No analytics available yet. Start practicing to see your performance data.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Performance</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600 text-sm font-medium">Total Attempts</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{analytics.attempts}</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <span className="text-gray-600 text-sm font-medium">Accuracy</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{analytics.accuracy}%</p>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <span className="text-gray-600 text-sm font-medium">Avg Time</span>
          </div>
          <p className="text-3xl font-bold text-purple-600">{analytics.avgTime}s</p>
        </div>
      </div>

      {Object.keys(analytics.weakLevels).length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-gray-900">Areas to Improve</h4>
          </div>
          <div className="space-y-2">
            {Object.keys(analytics.weakLevels)
              .sort((a, b) => Number(b) - Number(a))
              .map(level => (
                <div
                  key={level}
                  className="p-3 bg-orange-50 border border-orange-100 rounded-lg flex justify-between items-center"
                >
                  <span className="text-gray-700">
                    <span className="font-semibold">Level {level}</span> - {analytics.weakLevels[level]} mistakes
                  </span>
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                    {level <= 15 ? "Beginner" : level <= 30 ? "Intermediate" : "Advanced"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {Object.keys(analytics.weakLevels).length === 0 && (
        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-green-600 font-medium text-lg">🎉 Perfect! No weak areas detected.</p>
          <p className="text-gray-600 text-sm mt-1">Keep up the great performance!</p>
        </div>
      )}
    </div>
  );
}
