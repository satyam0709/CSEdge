import { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";

export default function AddCourse({ reload }) {
  const [form, setForm] = useState({
    courseTitle: "",
    courseDescription: "",
    courseThumbnail: "",
    coursePrice: 0,
    discount: 0,
    isPublished: true
  });
  const [loading, setLoading] = useState(false);

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
      const { data } = await axios.post("/api/admin/course", form);
      if (data.success) {
        toast.success("Course added successfully");
        setForm({
          courseTitle: "",
          courseDescription: "",
          courseThumbnail: "",
          coursePrice: 0,
          discount: 0,
          isPublished: true
        });
        reload();
      } else {
        toast.error(data.message || "Failed to add course");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-gray-50">
      <h3 className="font-bold text-lg mb-4">Add New Course</h3>
      <div className="space-y-4">
        <input
          type="text"
          value={form.courseTitle}
          onChange={e => setForm({ ...form, courseTitle: e.target.value })}
          placeholder="Course Title"
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Course Description"
          value={form.courseDescription}
          onChange={e => setForm({ ...form, courseDescription: e.target.value })}
          className="w-full border rounded px-3 py-2 h-20"
        />
        <input
          type="text"
          value={form.courseThumbnail}
          onChange={e => setForm({ ...form, courseThumbnail: e.target.value })}
          placeholder="Thumbnail URL"
          className="w-full border rounded px-3 py-2"
        />
        <div className="flex gap-4">
          <input
            type="number"
            value={form.coursePrice}
            onChange={e => setForm({ ...form, coursePrice: parseFloat(e.target.value) })}
            placeholder="Price"
            className="w-1/2 border rounded px-3 py-2"
          />
          <input
            type="number"
            value={form.discount}
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
        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Course"}
        </button>
      </div>
    </div>
  );
}
