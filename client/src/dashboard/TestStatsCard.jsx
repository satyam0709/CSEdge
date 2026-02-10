import { Target, TrendingUp, Clock, Zap, Code2, BookOpen, TrendingDown, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

const getTestTypeIcon = (type) => {
  const icons = {
    'aptitude': <Zap className="w-4 h-4 text-blue-600" />,
    'dsa': <Code2 className="w-4 h-4 text-purple-600" />,
    'dev': <BookOpen className="w-4 h-4 text-green-600" />,
    'unknown': <Target className="w-4 h-4 text-gray-600" />
  };
  return icons[type] || icons['unknown'];
};

const getTestTypeLabel = (type) => {
  const labels = {
    'aptitude': 'Aptitude',
    'dsa': 'DSA & Coding',
    'dev': 'Development',
    'unknown': 'Unknown'
  };
  return labels[type] || type;
};

const getAccuracyColor = (accuracy) => {
  const acc = Number(accuracy);
  if (acc >= 80) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' };
  if (acc >= 60) return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300' };
  return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' };
};

export default function TestStatsCard({ tests = {} }) {
  const navigate = useNavigate();
  const attempts = tests?.attempts || 0;
  const accuracy = tests?.accuracy || 0;
  const avgTime = tests?.avgTime || 0;
  const weakLevels = tests?.weakLevels || {};

  const accuracyColor = getAccuracyColor(accuracy);
  const hasData = attempts > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-all">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            Test Performance
          </h3>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-50 transition-all"
          >
            Details →
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="space-y-3 mb-6">
          {/* Total Attempts */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Attempts</p>
                <p className="text-2xl font-bold text-blue-600">{attempts}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Questions solved</p>
            </div>
          </div>

          {/* Accuracy */}
          <div className={`flex items-center justify-between p-4 bg-gradient-to-r ${accuracyColor.bg} rounded-lg border ${accuracyColor.border}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 ${accuracyColor.bg} rounded-lg`}>
                <Brain className={`w-4 h-4 ${accuracyColor.text}`} />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Accuracy Rate</p>
                <p className={`text-2xl font-bold ${accuracyColor.text}`}>{accuracy}%</p>
              </div>
            </div>
            <div className="text-right text-xs">
              <p className={`font-semibold ${accuracyColor.text}`}>
                {accuracy >= 80 ? '✨ Excellent' : accuracy >= 60 ? '⚡ Good' : '📈 Improving'}
              </p>
            </div>
          </div>

          {/* Average Time */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Time per Question</p>
                <p className="text-2xl font-bold text-purple-600">{avgTime}s</p>
              </div>
            </div>
            <div className="text-right text-xs">
              <p className="text-purple-600 font-semibold">
                {avgTime < 60 ? '⚡ Fast' : avgTime < 120 ? '🎯 Normal' : '⏱️ Slow'}
              </p>
            </div>
          </div>
        </div>

        {/* Weak Areas */}

        {/* Weak Areas */}
        {Object.keys(weakLevels).length > 0 && (
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h4 className="font-bold text-gray-900">⚠️ Areas to Improve</h4>
              <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                {Object.keys(weakLevels).length} areas
              </span>
            </div>
            <div className="space-y-2">
              {Object.keys(weakLevels).map(key => {
                const weakLevel = weakLevels[key];
                const testType = typeof weakLevel === 'object' ? weakLevel.type : 'unknown';
                const level = typeof weakLevel === 'object' ? weakLevel.level : weakLevel;
                const mistakes = typeof weakLevel === 'object' ? weakLevel.mistakes : weakLevels[key];
                
                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        {getTestTypeIcon(testType)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {getTestTypeLabel(testType)} - Level {level}
                        </p>
                        <p className="text-xs text-gray-600">{mistakes} {mistakes === 1 ? 'mistake' : 'mistakes'}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 transition-all">
                      Review
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {hasData && Object.keys(weakLevels).length === 0 && (
          <div className="pt-6 border-t border-gray-200 text-center">
            <div className="inline-block p-3 bg-green-50 rounded-full mb-3">
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-sm font-semibold text-green-700">No weak levels - Excellent performance!</p>
            <p className="text-xs text-gray-600 mt-1">Keep up the great work!</p>
          </div>
        )}

        {!hasData && (
          <div className="pt-6 border-t border-gray-200 text-center">
            <div className="inline-block p-3 bg-gray-100 rounded-full mb-3">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-sm font-semibold text-gray-700">No test attempts yet</p>
            <p className="text-xs text-gray-600 mt-1">Start practicing to see your performance</p>
          </div>
        )}
      </div>
    </div>
  );
}
