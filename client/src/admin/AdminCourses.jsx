import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2 } from "lucide-react";

const EMPTY_FORM = {
  courseTitle: "",
  courseDescription: "",
  courseThumbnail: "",
  coursePrice: 0,
  discount: 0,
  isPublished: true,
};

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // null = adding new
  const [form, setForm] = useState(EMPTY_FORM);

  // ─── Load courses ────────────────────────────────────────────────
  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/courses");
      if (data.success) {
        setCourses(data.courses || []);
      } else {
        toast.error(data.message || "Failed to load courses");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCourses(); }, []);

  // ─── Open form ───────────────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      courseTitle: course.courseTitle || "",
      courseDescription: course.courseDescription || "",
      courseThumbnail: course.courseThumbnail || "",
      coursePrice: course.coursePrice || 0,
      discount: course.discount || 0,
      isPublished: course.isPublished ?? true,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  };

  // ─── Validate ────────────────────────────────────────────────────
  const validate = () => {
    if (!form.courseTitle.trim()) { toast.error("Title is required"); return false; }
    if (!form.courseDescription.trim()) { toast.error("Description is required"); return false; }
    if (Number(form.coursePrice) < 0) { toast.error("Price cannot be negative"); return false; }
    if (Number(form.discount) < 0 || Number(form.discount) > 100) {
      toast.error("Discount must be 0–100"); return false;
    }
    return true;
  };

  // ─── Save (add or update) ────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = {
        ...form,
        coursePrice: parseFloat(form.coursePrice),
        discount: parseFloat(form.discount),
        // Required by schema
        courseContent: editing?.courseContent || [],
        courseRatings: editing?.courseRatings || [],
        enrolledStudents: editing?.enrolledStudents || [],
        educator: editing?.educator || "admin",
      };

      let data;
      if (editing) {
        ({ data } = await axios.put(`/api/admin/course/${editing._id}`, payload));
      } else {
        ({ data } = await axios.post("/api/admin/course", payload));
      }

      if (data.success) {
        toast.success(editing ? "Course updated!" : "Course added!");
        closeForm();
        loadCourses();
      } else {
        toast.error(data.message || "Save failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course permanently?")) return;
    try {
      const { data } = await axios.delete(`/api/admin/course/${id}`);
      if (data.success) {
        toast.success("Course deleted");
        loadCourses();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ─── Toggle publish ──────────────────────────────────────────────
  const handleTogglePublish = async (course) => {
    try {
      const { data } = await axios.put(`/api/admin/course/${course._id}`, {
        ...course,
        isPublished: !course.isPublished,
      });
      if (data.success) {
        toast.success(`Course ${!course.isPublished ? "published" : "unpublished"}`);
        loadCourses();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit or remove courses visible to students</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
        >
          <Plus size={18} /> Add Course
        </button>
      </div>

      {/* Course table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={24} />
            <span>Loading courses...</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📚</div>
            <p className="font-medium text-gray-600">No courses yet</p>
            <p className="text-sm mt-1">Click "Add Course" to create your first course.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Course</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Price</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Discount</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    {/* Course info */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.courseThumbnail || "/placeholder.png"}
                          alt={course.courseTitle}
                          className="w-14 h-10 object-cover rounded-md border border-gray-200 bg-gray-100"
                          onError={(e) => { e.target.src = "/placeholder.png" }}
                        />
                        <div>
                          <p className="font-semibold text-gray-800 max-w-xs truncate">
                            {course.courseTitle}
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5 max-w-xs truncate">
                            {course.courseDescription?.replace(/<[^>]*>/g, "")?.slice(0, 60)}…
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800">
                      ₹{course.coursePrice?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-5 py-4">
                      {course.discount > 0 ? (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                          {course.discount}% off
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">None</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          course.isPublished
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {course.isPublished ? (
                          <><Eye size={13} /> Published</>
                        ) : (
                          <><EyeOff size={13} /> Draft</>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(course)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? "Edit Course" : "Add New Course"}
              </h2>
              <button onClick={closeForm} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.courseTitle}
                  onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
                  placeholder="e.g. Full Stack Web Development"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.courseDescription}
                  onChange={(e) => setForm({ ...form, courseDescription: e.target.value })}
                  placeholder="Brief description of the course..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={form.courseThumbnail}
                  onChange={(e) => setForm({ ...form, courseThumbnail: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {form.courseThumbnail && (
                  <img
                    src={form.courseThumbnail}
                    alt="Preview"
                    className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-200"
                    onError={(e) => { e.target.style.display = "none" }}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.coursePrice}
                    onChange={(e) => setForm({ ...form, coursePrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Discount %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    form.isPublished ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.isPublished ? "translate-x-5" : ""
                    }`}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {form.isPublished ? "Published (visible to students)" : "Draft (hidden)"}
                </span>
              </label>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={closeForm}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors"
              >
                {saving ? (
                  <><Loader2 size={15} className="animate-spin" /> Saving...</>
                ) : (
                  <><Save size={15} /> {editing ? "Save Changes" : "Add Course"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}