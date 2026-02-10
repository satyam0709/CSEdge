import { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

export default function AddQuestion({ reload }) {
  const [form, setForm] = useState({
    type: "aptitude",
    level: 1,
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    explanation: "",
    topic: ""
  });
  
  const [loading, setLoading] = useState(false);

  const updateOption = (i, value) => {
    const newOpts = [...form.options];
    newOpts[i] = value;
    setForm({ ...form, options: newOpts });
  };

  const validateForm = () => {
    if (!form.question.trim()) {
      toast.error("Question is required");
      return false;
    }
    if (form.options.some(opt => !opt.trim())) {
      toast.error("All options must be filled");
      return false;
    }
    if (!form.correctAnswer.trim()) {
      toast.error("Correct answer is required");
      return false;
    }
    if (!form.options.includes(form.correctAnswer)) {
      toast.error("Correct answer must be one of the options");
      return false;
    }
    if (form.level < 1 || form.level > 50) {
      toast.error("Level must be between 1 and 50");
      return false;
    }
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const { data } = await axios.post("/api/admin/question", form);
      
      if (data.success) {
        toast.success("Question added successfully");
        setForm({
          type: "aptitude",
          level: 1,
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          explanation: "",
          topic: ""
        });
        reload();
      } else {
        toast.error(data.message || "Failed to add question");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-50">
      <h3 className="font-bold text-lg mb-4">Add New Question</h3>

      <div className="space-y-4">
        <select 
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="aptitude">Aptitude</option>
          <option value="dsa">DSA</option>
          <option value="dev">Dev</option>
          <option value="coding">Coding</option>
        </select>

        <input
          type="number"
          value={form.level}
          onChange={e => setForm({ ...form, level: parseInt(e.target.value) })}
          placeholder="Level (1-50)"
          min="1"
          max="50"
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          value={form.topic}
          onChange={e => setForm({ ...form, topic: e.target.value })}
          placeholder="Topic"
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          placeholder="Question text"
          value={form.question}
          onChange={e => setForm({ ...form, question: e.target.value })}
          className="w-full border rounded px-3 py-2 h-20"
        />

        <div className="space-y-2">
          <label className="font-semibold">Options:</label>
          {form.options.map((opt, i) => (
            <input
              key={i}
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={e => updateOption(i, e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          ))}
        </div>

        <input
          placeholder="Correct Answer (must match one option)"
          value={form.correctAnswer}
          onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          placeholder="Explanation"
          value={form.explanation}
          onChange={e => setForm({ ...form, explanation: e.target.value })}
          className="w-full border rounded px-3 py-2 h-16"
        />

        <button 
          onClick={submit}
          disabled={loading}
          className="w-full bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Question"}
        </button>
      </div>
    </div>
  );
}
