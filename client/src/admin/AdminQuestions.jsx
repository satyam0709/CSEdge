import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import AddQuestion from "./AddQuestion";
import EditQuestion from "./EditQuestion";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/questions", {
        params: { type: type || undefined, level: level || undefined }
      });
      
      if (data.success) {
        setQuestions(data.questions || []);
      } else {
        toast.error(data.message || "Failed to load questions");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [type, level]);

  const deleteQuestion = async (id) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    
    try {
      const { data } = await axios.delete(`/api/admin/question/${id}`);
      
      if (data.success) {
        toast.success("Question deleted successfully");
        loadQuestions();
      } else {
        toast.error(data.message || "Failed to delete question");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Admin – Question Management</h2>

      {/* Filters */}
      <div className="flex gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <select 
          value={type}
          onChange={e => setType(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="aptitude">Aptitude</option>
          <option value="dsa">DSA</option>
          <option value="dev">Dev</option>
          <option value="coding">Coding</option>
        </select>

        <input
          type="number"
          placeholder="Level (1-50)"
          value={level}
          onChange={e => setLevel(e.target.value)}
          className="border rounded px-3 py-2"
          min="1"
          max="50"
        />
        
        <button
          onClick={() => { setType(""); setLevel(""); }}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Clear Filters
        </button>
      </div>

      <AddQuestion reload={loadQuestions} />

      {editing && (
        <EditQuestion
          question={editing}
          close={() => setEditing(null)}
          reload={loadQuestions}
        />
      )}

      <div className="mt-6 bg-white rounded-lg shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-4 text-center">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No questions found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Level</th>
                <th className="px-4 py-3 text-left font-semibold">Topic</th>
                <th className="px-4 py-3 text-left font-semibold">Question</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(q => (
                <tr key={q._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 capitalize">{q.type}</td>
                  <td className="px-4 py-3">{q.level}</td>
                  <td className="px-4 py-3">{q.topic || "-"}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{q.question}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => setEditing(q)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteQuestion(q._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
