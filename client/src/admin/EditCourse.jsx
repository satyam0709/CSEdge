import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

export default function EditCourse({ course, close, reload }) {
  const [form, setForm] = useState({ ...course });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ ...course });
  }, [course]);

  const validateForm = () => {
    if (!form.courseTitle.trim()) return toast.error("Title is required") && false;
    if (!form.courseDescription.trim()) return toast.error("Description is required") && false;
    if (form.coursePrice < 0) return toast.error("Price cannot be negative") && false;
    if (form.discount < 0 || form.discount > 100) return toast.error("Discount 0-100") && false;
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/admin/course/${course._id}`, form);
      if (data.success) {
        toast.success("Course updated");
        reload();
        close();
      } else {
        toast.error(data.message || "Failed to update course");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-50">
      <h3 className="font-bold text-lg mb-4">Edit Course</h3>
      <div className="space-y-4">
        <input
          type="text"
          value={form.courseTitle || ""}
          onChange={e => setForm({ ...form, courseTitle: e.target.value })}
          placeholder="Course Title"
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Course Description"
          value={form.courseDescription || ""}
          onChange={e => setForm({ ...form, courseDescription: e.target.value })}
          className="w-full border rounded px-3 py-2 h-20"
        />
        <input
          type="text"
          value={form.courseThumbnail || ""}
          onChange={e => setForm({ ...form, courseThumbnail: e.target.value })}
          placeholder="Thumbnail URL"
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-4">
          <input
            type="number"
            value={form.coursePrice || 0}
            onChange={e => setForm({ ...form, coursePrice: parseFloat(e.target.value) })}
            placeholder="Price"
            className="w-1/2 border rounded px-3 py-2"
          />
          <input
            type="number"
            value={form.discount || 0}
            onChange={e => setForm({ ...form, discount: parseFloat(e.target.value) })}
            placeholder="Discount %"
            className="w-1/2 border rounded px-3 py-2"
            min="0"
            max="100"
          />
        </div>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={e => setForm({ ...form, isPublished: e.target.checked })}
            className="form-checkbox"
          />
          Published
        </label>
        <div className="flex gap-3">
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
