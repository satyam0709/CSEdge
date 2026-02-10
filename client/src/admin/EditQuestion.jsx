import { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

export default function EditQuestion({ question, close, reload }) {
  const [form, setForm] = useState(question);
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
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/admin/question/${form._id}`, form);
      
      if (data.success) {
        toast.success("Question updated successfully");
        reload();
        close();
      } else {
        toast.error(data.message || "Failed to update question");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-100">
      <h3 className="font-bold text-lg mb-4">Edit Question</h3>

      <div className="space-y-3">
        <textarea
          value={form.question}
          onChange={e => setForm({ ...form, question: e.target.value })}
          placeholder="Question text"
          className="w-full border rounded px-3 py-2 h-20"
        />

        <div className="space-y-2">
          <label className="font-semibold">Options:</label>
          {form.options.map((opt, i) => (
            <input
              key={i}
              value={opt}
              onChange={e => updateOption(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className="w-full border rounded px-3 py-2"
            />
          ))}
        </div>

        <input
          value={form.correctAnswer}
          onChange={e =>
            setForm({ ...form, correctAnswer: e.target.value })
          }
          placeholder="Correct Answer (must match one option)"
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          value={form.explanation || ""}
          onChange={e =>
            setForm({ ...form, explanation: e.target.value })
          }
          placeholder="Explanation"
          className="w-full border rounded px-3 py-2 h-16"
        />

        <div className="flex gap-2">
          <button 
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button 
            onClick={close}
            className="flex-1 bg-gray-400 text-white px-4 py-2 rounded font-semibold hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
