import { CheckCircle, XCircle, AlertCircle, Lightbulb, ListChecks } from "lucide-react";
import DsaQuestionPanel from "../components/dsa/DsaQuestionPanel";
import DsaIdePanel from "../components/dsa/DsaIdePanel";
import { resolveDsaPlatform } from "../components/dsa/dsaPlatformUtils";

export default function TestPage({
  question,
  selectedAnswer,
  onSelectAnswer,
  isSubmitted,
  loading,
  currentQuestionNumber = 1,
  totalQuestions = 15,
  onBack,
  /** Two-column DSA layout: question details + IDE, then MCQ options below. */
  dsaLayout = false,
}) {
  if (!question) return null;

  const optionsBlock = (
    <div className={dsaLayout ? "" : "mb-10"}>
      {!dsaLayout ? (
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-relaxed">
          {question.question}
        </h3>
      ) : (
        <div className="mb-6">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500">
            <ListChecks className="h-4 w-4 text-indigo-500" />
            Select the correct answer
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Pick the option that matches the problem above.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {question.options &&
          question.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrect = isSubmitted && question.correctAnswer === idx;
            const isUserWrong = isSubmitted && isSelected && !isCorrect;
            const optionLetter = String.fromCharCode(65 + idx);

            return (
              <button
                key={idx}
                onClick={() => !isSubmitted && onSelectAnswer(idx)}
                disabled={isSubmitted || loading}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group
                  ${
                    isSubmitted
                      ? isCorrect
                        ? "bg-emerald-50 border-emerald-500 shadow-lg"
                        : isUserWrong
                          ? "bg-rose-50 border-rose-500 shadow-lg"
                          : "bg-slate-50 border-slate-200 opacity-60"
                      : isSelected
                        ? "bg-indigo-50 border-indigo-600 shadow-xl translate-x-2"
                        : "bg-white border-slate-300 hover:border-indigo-400 hover:bg-slate-50 hover:shadow-lg"
                  }`}
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl font-bold text-lg flex items-center justify-center transition-all
                    ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-lg"
                        : isCorrect
                          ? "bg-emerald-600 text-white"
                          : isUserWrong
                            ? "bg-rose-600 text-white"
                            : "bg-slate-200 text-slate-700 group-hover:bg-indigo-200 group-hover:text-indigo-700"
                    }`}
                  >
                    {optionLetter}
                  </div>

                  <div className="flex-1">
                    <span
                      className={`text-lg font-medium ${
                        isCorrect
                          ? "text-emerald-900"
                          : isUserWrong
                            ? "text-rose-900"
                            : "text-slate-800"
                      }`}
                    >
                      {option}
                    </span>
                  </div>

                  {isSubmitted && isCorrect && (
                    <CheckCircle className="text-emerald-600 flex-shrink-0 w-6 h-6" />
                  )}
                  {isSubmitted && isUserWrong && (
                    <XCircle className="text-rose-600 flex-shrink-0 w-6 h-6" />
                  )}
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );

  return (
    <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 md:p-10 transition-all">
      {!dsaLayout && (
        <div className="mb-10 pb-6 border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
                Question {currentQuestionNumber} of {totalQuestions}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 md:w-64 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 h-full transition-all duration-500"
                  style={{
                    width: `${(currentQuestionNumber / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-5 py-2 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 text-sm font-bold rounded-full">
                Level {question.level || "N/A"}
              </span>
            </div>
          </div>
        </div>
      )}

      {dsaLayout ? (
        <>
          <div className="mb-10 grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8 xl:items-start">
            <DsaQuestionPanel
              question={question}
              currentQuestionNumber={currentQuestionNumber}
              totalQuestions={totalQuestions}
            />
            <DsaIdePanel
              starterCode={question.starterCode}
              questionKey={question._id}
              platformLabel={resolveDsaPlatform(question, currentQuestionNumber).active.label}
            />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 md:p-8">
            {optionsBlock}
          </div>
        </>
      ) : (
        optionsBlock
      )}

      {isSubmitted && question.explanation && (
        <div className="mt-10 p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-500/20">
                <Lightbulb className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-amber-400 mb-2 uppercase text-sm tracking-wide">
                Explanation
              </h4>
              <p className="text-slate-200 text-base leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
