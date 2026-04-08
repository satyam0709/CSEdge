import { useCallback, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import Footer from '../../components/student/Footer';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Filter,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';

const FOCUS_OPTIONS = [
  { value: 'all', label: 'All exams' },
  { value: 'placement', label: 'Placement / IT jobs' },
  { value: 'gate', label: 'GATE' },
  { value: 'cat', label: 'CAT / MBA' },
  { value: 'banking', label: 'Banking' },
  { value: 'ssc', label: 'SSC / Govt' },
  { value: 'upsc', label: 'UPSC' },
  { value: 'jee', label: 'JEE' },
  { value: 'neet', label: 'NEET' },
  { value: 'general', label: 'General prep' },
];

const focusLabel = (v) => FOCUS_OPTIONS.find((o) => o.value === v)?.label || v;

export default function StudyShare() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examFocus, setExamFocus] = useState('placement');
  const [file, setFile] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { examFocus: filter } : {};
      const { data } = await axios.get('/api/study-share', { params });
      if (data.success) setMaterials(data.materials || []);
    } catch (e) {
      toast.error('Could not load community notes.');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.info('Please log in to upload.');
      return;
    }
    if (!file) {
      toast.error('Choose an image or PDF.');
      return;
    }
    setSubmitting(true);
    try {
      const token = await getToken();
      const fd = new FormData();
      fd.append('title', title.trim());
      fd.append('description', description.trim());
      fd.append('examFocus', examFocus);
      fd.append('file', file);

      const { data } = await axios.post('/api/study-share', fd, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 120000,
      });

      if (data.success) {
        toast.success(data.message);
        setUploadOpen(false);
        setTitle('');
        setDescription('');
        setFile(null);
        load();
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Remove this note from the community?')) return;
    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/study-share/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success('Removed.');
        load();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not delete');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-1">
              Community
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Study notes hub
            </h1>
            <p className="text-slate-600 mt-2 max-w-2xl">
              Share <strong>your own</strong> summaries, formula sheets, and screenshots you made — in
              your words and layout — so others can prep faster. Not a place for pirated or scanned
              paid books.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
            >
              Home
            </Link>
            {isSignedIn ? (
              <button
                type="button"
                onClick={() => setUploadOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/25 hover:bg-indigo-700"
              >
                <Upload className="w-4 h-4" />
                Upload notes
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold"
              >
                Log in to upload
              </Link>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 sm:p-5 mb-8 flex gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-950 space-y-2">
            <p className="font-semibold">Copyright & fair use</p>
            <p>
              Only upload content <strong>you created</strong> (your notes, your diagrams, your cheat
              sheets). Do not upload full copies of commercial books, coaching PDFs, or leaked papers.
              Paraphrase, reorganize, and add your own explanations — that helps everyone and stays on
              the right side of copyright.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="inline-flex items-center gap-1 text-sm text-slate-500 mr-2">
            <Filter className="w-4 h-4" /> Filter
          </span>
          {FOCUS_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setFilter(o.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filter === o.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
            <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
            <p className="text-slate-700 font-medium">No notes here yet.</p>
            <p className="text-slate-500 text-sm mt-1">Be the first to share something useful.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((m) => (
              <li
                key={m._id}
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  {m.fileType === 'image' ? (
                    <img
                      src={m.fileUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-4">
                      <FileText className="w-14 h-14 text-red-500 mb-2" />
                      <span className="text-sm font-medium">PDF document</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-lg bg-black/60 text-white backdrop-blur-sm">
                    {focusLabel(m.examFocus)}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="font-bold text-slate-900 line-clamp-2">{m.title}</h2>
                  {m.description ? (
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{m.description}</p>
                  ) : null}
                  <p className="text-xs text-slate-400 mt-2">
                    By {m.uploaderName} · {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={m.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Open <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {user?.id === m.uploaderId && (
                      <button
                        type="button"
                        onClick={() => onDelete(m._id)}
                        className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {uploadOpen && (
        <div
          className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Upload study notes"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-bold text-slate-900">Upload your notes</h2>
              <button
                type="button"
                onClick={() => !submitting && setUploadOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                  required
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My OS deadlock summary — own notes"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What’s inside? Topic list, chapter, etc."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Exam / focus</label>
                <select
                  value={examFocus}
                  onChange={(e) => setExamFocus(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
                >
                  {FOCUS_OPTIONS.filter((o) => o.value !== 'all').map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  File * (image or PDF, max ~12 MB)
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-slate-300 cursor-pointer hover:border-indigo-400 text-sm text-slate-600">
                    <ImageIcon className="w-4 h-4" />
                    Choose file
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  {file && (
                    <span className="text-xs text-slate-500 truncate max-w-[200px]">{file.name}</span>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                Publish for community
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
