import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

export default function Recommendations({ type }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await axios.get(`/api/test/recommendations?type=${type}`);
        if (data.success) {
          setData(data.recommendations || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [type]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">Loading recommendations...</p>
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

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-500">Start solving questions to get personalized recommendations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Personalized Recommendations</h3>

      <div className="space-y-3">
        {data.map(r => {
          const getStatusIcon = () => {
            if (r.status === "weak") return <TrendingDown className="w-5 h-5 text-red-600" />;
            if (r.status === "average") return <Minus className="w-5 h-5 text-orange-600" />;
            return <TrendingUp className="w-5 h-5 text-green-600" />;
          };

          const getStatusColor = () => {
            if (r.status === "weak") return "bg-red-50 border-red-200";
            if (r.status === "average") return "bg-orange-50 border-orange-200";
            return "bg-green-50 border-green-200";
          };

          const getStatusTextColor = () => {
            if (r.status === "weak") return "text-red-700";
            if (r.status === "average") return "text-orange-700";
            return "text-green-700";
          };

          const getDifficultyLabel = () => {
            if (r.level <= 15) return "Beginner";
            if (r.level <= 30) return "Intermediate";
            return "Advanced";
          };

          return (
            <div
              key={r.level}
              className={`p-4 rounded-lg border ${getStatusColor()} flex items-center justify-between`}
            >
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon()}
                <div>
                  <p className="font-semibold text-gray-900">
                    Level {r.level} <span className="text-sm font-normal text-gray-600">({getDifficultyLabel()})</span>
                  </p>
                  <p className={`text-sm font-medium ${getStatusTextColor()}`}>
                    {r.accuracy}% Accuracy • Status: <span className="uppercase">{r.status}</span>
                  </p>
                </div>
              </div>

              {r.status === "weak" && (
                <div className="ml-4 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                  Focus Here
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-gray-600 text-center">
          💡 Spend more time on weak levels to improve your overall accuracy.
        </p>
      </div>
    </div>
  );
}
