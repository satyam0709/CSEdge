import React from 'react';
import { CheckCircle2, Trophy, Star, TrendingUp, ChevronRight, RotateCcw } from 'lucide-react';

export default function LevelCompletionScreen({ 
  levelNumber, 
  score, 
  correctCount, 
  totalQuestions, 
  passed,
  onRetry,
  onNextLevel,
  onExit
}) {
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const passThreshold = 60;
  const isPassed = percentage >= passThreshold;

  // Determine color scheme based on performance
  const getPerformanceColor = () => {
    if (percentage >= 90) return { bg: 'from-emerald-50 to-teal-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' };
    if (percentage >= 70) return { bg: 'from-blue-50 to-indigo-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700' };
    if (percentage >= passThreshold) return { bg: 'from-amber-50 to-orange-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700' };
    return { bg: 'from-rose-50 to-pink-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700' };
  };

  const perfColor = getPerformanceColor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:p-12 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className={`bg-gradient-to-br ${perfColor.bg} rounded-3xl shadow-2xl border-2 ${perfColor.border} p-8 md:p-12`}>
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`w-24 h-24 ${isPassed ? 'bg-emerald-100' : 'bg-amber-100'} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {isPassed ? (
                <CheckCircle2 className={`${isPassed ? 'text-emerald-600' : 'text-amber-600'}`} size={56} />
              ) : (
                <Trophy className="text-amber-600" size={56} />
              )}
            </div>
            
            <h1 className={`text-4xl md:text-5xl font-black mb-2 ${perfColor.text}`}>
              {isPassed ? 'Great Job!' : 'Good Try!'}
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Level {levelNumber} {isPassed ? 'Passed' : 'Not Passed'}
            </p>
          </div>

          {/* Score Display */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {/* Percentage */}
            <div className={`${perfColor.badge} rounded-2xl p-6 text-center`}>
              <div className="text-3xl md:text-4xl font-black mb-1">{percentage}%</div>
              <div className="text-sm font-medium opacity-75">Score</div>
            </div>

            {/* Correct Answers */}
            <div className={`${perfColor.badge} rounded-2xl p-6 text-center`}>
              <div className="text-3xl md:text-4xl font-black mb-1">{correctCount}/{totalQuestions}</div>
              <div className="text-sm font-medium opacity-75">Correct</div>
            </div>

            {/* Rating */}
            <div className={`${perfColor.badge} rounded-2xl p-6 text-center`}>
              <div className="flex justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={24}
                    className={i < Math.ceil((percentage / 100) * 5) ? 'fill-current' : 'opacity-30'}
                  />
                ))}
              </div>
              <div className="text-sm font-medium opacity-75">Rating</div>
            </div>
          </div>

          {/* Performance Feedback */}
          <div className="bg-white/60 backdrop-blur rounded-2xl p-6 mb-10">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className={perfColor.text.split(' ')[0]} size={24} />
              <h3 className="font-bold text-slate-900 text-lg">Performance Insight</h3>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {percentage >= 90 && `Excellent! You've mastered this level. Move on to the next challenge!`}
              {percentage >= 70 && percentage < 90 && `Very good! You're doing great. Try the next level to improve further.`}
              {percentage >= passThreshold && percentage < 70 && `You passed! With some more practice, you can improve your score.`}
              {percentage < passThreshold && `Keep practicing! Review the incorrect answers and try again to pass this level.`}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-slate-700">Level Progress</span>
              <span className="text-sm font-bold text-slate-700">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${isPassed ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {!isPassed && (
              <button
                onClick={onRetry}
                className="flex-1 py-4 px-6 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition-all hover:shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Retry Level
              </button>
            )}

            {isPassed && (
              <button
                onClick={onNextLevel}
                className="flex-1 py-4 px-6 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all hover:shadow-lg flex items-center justify-center gap-2"
              >
                Next Level
                <ChevronRight size={20} />
              </button>
            )}

            <button
              onClick={onExit}
              className="flex-1 py-4 px-6 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-all hover:shadow-lg"
            >
              Back to Levels
            </button>
          </div>
        </div>

        {/* Footer Encouragement */}
        <p className="text-center text-slate-400 text-sm mt-8 font-medium">
          Keep practicing to improve your skills and unlock new levels! 🚀
        </p>
      </div>
    </div>
  );
}
