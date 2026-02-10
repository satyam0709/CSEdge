import React from 'react';
import { CheckCircle2, Lock, PlayCircle, Zap, Trophy, Target, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getDifficultyColor = (difficulty) => {
  const colors = {
    'Beginner': { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-700', icon: 'text-emerald-600' },
    'Intermediate': { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-700', icon: 'text-amber-600' },
    'Advanced': { bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-700', icon: 'text-orange-600' },
    'Expert': { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-700', icon: 'text-rose-600' }
  };
  return colors[difficulty] || colors['Beginner'];
};

export default function LevelSelector({ levels, onSelectLevel, loading, testType = "Aptitude", onRetry }) {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading levels...</p>
        </div>
      </div>
    );
  }

  // empty state when no levels
  const hasLevels = levels && levels.length > 0;

  if (!hasLevels) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-12 flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target size={40} className="text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">No Levels Available</h2>
            <p className="text-slate-600 text-lg mb-8">
              Currently, there are no {testType} levels available. Please try again later or contact support.
            </p>
            <button
              onClick={onRetry}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
            >
              Retry Loading Levels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Sticky Header with Back Button */}
        <div className="sticky top-0 z-40 bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-12 pb-6 shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-indigo-600 font-bold transition-all duration-200 group mb-6"
          >
            <div className="p-1 rounded-full group-hover:bg-indigo-50 transition-colors">
              <ChevronLeft size={20} />
            </div>
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white">
              <Target size={28} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900">{testType} Mastery</h1>
              <p className="text-slate-600 mt-1 font-medium text-base md:text-lg">Choose your level and test your skills</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-12 pt-8">
          {/* Level Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 mb-16">
          {levels.map((level) => {
            const diffColor = getDifficultyColor(level.difficulty || 'Beginner');
            const isAttempted = level.accuracy > 0;
            const isPassed = level.status === 'strong' || level.accuracy >= (level.requiredScore || 60);

            return (
              <button
                key={level.level}
                onClick={() => onSelectLevel(level.level)}
                disabled={loading}
                className={`relative group rounded-2xl p-6 border-2 border-slate-200 bg-white transition-all duration-300 text-left overflow-hidden
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer'}
                `}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Top Row */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${diffColor.bg}`}>
                      <span className={`text-xl font-bold ${diffColor.text}`}>
                        {Number(level.level) < 10 ? '0' : ''}{level.level}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {isAttempted && (
                        <div className={`px-3 py-1 rounded-lg text-xs font-bold ${diffColor.bg} ${diffColor.text}`}>
                          {level.accuracy}%
                        </div>
                      )}
                      {isPassed && (
                        <CheckCircle2 className={`${diffColor.icon}`} size={20} />
                      )}
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold mb-3 ${diffColor.bg} ${diffColor.text}`}>
                    {level.difficulty || 'Beginner'}
                  </div>

                  {/* Level Name */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Level {level.level}</h3>
                  
                  {/* Status */}
                  <p className={`text-sm mb-3 ${isAttempted ? 'text-slate-600' : 'text-slate-500'}`}>
                    {isPassed ? '✓ Passed' : isAttempted ? 'Attempted' : 'Not Attempted'}
                  </p>

                  {/* Questions Info */}
                  <div className="flex items-center gap-1 text-slate-600 text-sm mb-4">
                    <Zap size={16} className="text-amber-500" />
                    <span>{level.questionsCount || 15} Questions</span>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 group-hover:border-indigo-200">
                    <span className="text-xs font-bold uppercase text-slate-500 group-hover:text-indigo-600 transition-colors">
                      {isAttempted ? 'Retry' : 'Start'}
                    </span>
                    <PlayCircle size={18} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Attempted Badge */}
                {isAttempted && (
                  <div className="absolute top-3 right-3 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

          {/* Legend */}
          <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              Difficulty Levels
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((diff) => {
                const color = getDifficultyColor(diff);
                return (
                  <div key={diff} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-lg ${color.bg} border-2 ${color.border}`} />
                    <span className="text-sm font-medium text-slate-600">{diff}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
