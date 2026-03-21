import { useState } from "react";

export default function QuestionCard({ question, onSubmit }) {
  const [selected, setSelected] = useState(null);
  // FIX: submitted was never set to true, so explanation never showed and
  // the "Submitted" label on the button never appeared
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === null) {
      alert("Please select an option");
      return;
    }
    setSubmitted(true);   // ← FIX: mark as submitted so explanation shows
    onSubmit(selected);
  };

  const handleNext = () => {
    // Reset for next question
    setSelected(null);
    setSubmitted(false);
  };

  const handleSelectOption = (index) => {
    if (!submitted) {
      setSelected(index);
    }
  };

  const isCorrect = submitted && selected === question.correctAnswer;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h3>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOpt = submitted && question.correctAnswer === i;
          const isWrong = submitted && isSelected && !isCorrectOpt;

          return (
            <button
              key={i}
              onClick={() => handleSelectOption(i)}
              disabled={submitted}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3
                ${submitted
                  ? isCorrectOpt
                    ? "bg-green-50 border-green-500"
                    : isWrong
                    ? "bg-red-50 border-red-500"
                    : "bg-white border-gray-200 opacity-60"
                  : isSelected
                  ? "bg-blue-50 border-blue-500"
                  : "bg-white border-gray-300 hover:border-blue-300"
                }
                ${submitted ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <input
                type="radio"
                name="option"
                checked={isSelected}
                onChange={() => handleSelectOption(i)}
                disabled={submitted}
                className="w-4 h-4"
              />
              <span className={`${isCorrectOpt ? "text-green-800 font-semibold" : isWrong ? "text-red-800" : "text-gray-900"}`}>
                {opt}
              </span>
            </button>
          );
        })}
      </div>

      {/* Submit / Next button */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg transition-colors"
        >
          Submit Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-3 rounded-lg transition-colors"
        >
          Next Question →
        </button>
      )}

      {/* FIX: Explanation now shows because submitted is properly set to true */}
      {submitted && question.explanation && (
        <div className={`mt-6 p-4 rounded-lg border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <h4 className={`font-bold mb-2 ${isCorrect ? "text-green-900" : "text-red-900"}`}>
            {isCorrect ? "✅ Correct!" : "❌ Incorrect"} — Explanation
          </h4>
          <p className="text-gray-800 text-sm">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}