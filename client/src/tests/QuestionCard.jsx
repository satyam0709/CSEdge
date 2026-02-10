import { useState } from "react";

export default function QuestionCard({ question, onSubmit }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected === null) {
      alert("Please select an option");
      return;
    }
    onSubmit(selected);
    setSelected(null);
    setSubmitted(false);
  };

  const handleSelectOption = (index) => {
    if (!submitted) {
      setSelected(index);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h3>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelectOption(i)}
            disabled={submitted}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
              selected === i
                ? "bg-blue-50 border-blue-500"
                : "bg-white border-gray-300 hover:border-blue-300"
            } ${submitted ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="option"
              checked={selected === i}
              onChange={() => handleSelectOption(i)}
              disabled={submitted}
              className="w-4 h-4"
            />
            <span className="text-gray-900">{opt}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitted}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium px-4 py-3 rounded-lg transition-colors"
      >
        {submitted ? "Submitted" : "Submit"}
      </button>

      {question.explanation && submitted && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-900 mb-2">Explanation</h4>
          <p className="text-blue-800 text-sm">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
