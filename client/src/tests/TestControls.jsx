import { RotateCcw, ChevronRight, LogOut, RotateCw } from "lucide-react";

export default function TestControls({
  isSubmitted,
  loading,
  onSubmit,
  onNext,
  onNextLevel,
  onExit,
  canGoNextLevel = false
}) {
  return (
    <div className="w-full">
      {/* Main Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-end">
        {/* Submit Answer Button */}
        {!isSubmitted && (
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-xl hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/3 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Check Answer
                <ChevronRight size={18} />
              </>
            )}
          </button>
        )}

        {/* Next Question Button */}
        {isSubmitted && !canGoNextLevel && (
          <button
            onClick={onNext}
            disabled={loading}
            className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/3 border-t-white rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RotateCw size={18} />
                Next Question
              </>
            )}
          </button>
        )}

        {/* Next Level Button */}
        {isSubmitted && canGoNextLevel && (
          <button
            onClick={onNextLevel}
            disabled={loading}
            className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:shadow-xl hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/3 border-t-white rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Next Level
                <ChevronRight size={18} />
              </>
            )}
          </button>
        )}

        {/* Exit Button */}
        <button
          onClick={onExit}
          disabled={loading}
          className="flex-1 sm:flex-none px-8 py-4 bg-slate-600 text-white font-bold rounded-xl hover:shadow-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Exit Level
        </button>
      </div>

      {/* Hint Text */}
      {!isSubmitted && (
        <p className="text-center text-slate-500 text-sm mt-4 font-medium">
          Select an option and check your answer
        </p>
      )}
    </div>
  );
}
