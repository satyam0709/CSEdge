import { useState, useEffect, useCallback, useRef } from "react";
import axiosInstance from "../../utils/axios";
import { StickyNote, Loader2, Check } from "lucide-react";
import { toast } from "react-toastify";

const MAX_LEN = 50000;
const DEBOUNCE_MS = 1200;

/**
 * Per-lecture notes stored in MongoDB via PUT /api/user/lecture-note (Clerk auth).
 */
export default function LectureNotesPanel({ courseId, lectureId, getToken }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved
  const debounceRef = useRef(null);
  const lastSavedRef = useRef("");

  const fetchNote = useCallback(async () => {
    if (!courseId || !lectureId) return;
    setLoading(true);
    try {
      const token = await getToken();
      const { data } = await axiosInstance.get("/api/user/lecture-note", {
        params: { courseId, lectureId },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        const c = data.note?.content ?? "";
        setText(c);
        lastSavedRef.current = c;
      } else {
        toast.error(data.message || "Could not load notes");
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not load notes");
    } finally {
      setLoading(false);
    }
  }, [courseId, lectureId, getToken]);

  const save = useCallback(
    async (content) => {
      if (!courseId || !lectureId) return;
      if (content === lastSavedRef.current) return;
      setSaveStatus("saving");
      try {
        const token = await getToken();
        const { data } = await axiosInstance.put(
          "/api/user/lecture-note",
          { courseId, lectureId, content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
          lastSavedRef.current = content;
          setSaveStatus("saved");
          window.setTimeout(() => setSaveStatus("idle"), 2000);
        } else {
          toast.error(data.message || "Save failed");
          setSaveStatus("idle");
        }
      } catch (e) {
        console.error(e);
        toast.error("Could not save notes");
        setSaveStatus("idle");
      }
    },
    [courseId, lectureId, getToken]
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setText("");
    lastSavedRef.current = "";
    fetchNote();
  }, [courseId, lectureId, fetchNote]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const scheduleSave = (value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      save(value);
    }, DEBOUNCE_MS);
  };

  const onChange = (e) => {
    let v = e.target.value;
    if (v.length > MAX_LEN) v = v.slice(0, MAX_LEN);
    setText(v);
    scheduleSave(v);
  };

  const onBlur = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    save(text);
  };

  if (!courseId || !lectureId) return null;

  return (
    <div className="border-t border-gray-200 bg-amber-50/40 px-4 py-4 md:px-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-gray-800">
          <StickyNote className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold">Your notes for this lecture</h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {loading && (
            <span className="inline-flex items-center gap-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
            </span>
          )}
          {!loading && saveStatus === "saving" && (
            <span className="inline-flex items-center gap-1 text-blue-600">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
            </span>
          )}
          {!loading && saveStatus === "saved" && (
            <span className="inline-flex items-center gap-1 text-green-600">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
          {!loading && saveStatus === "idle" && text.length > 0 && (
            <span>Auto-saves as you type</span>
          )}
        </div>
      </div>
      <p className="mb-2 text-xs text-gray-500">
        Notes are saved to your account and stay here when you come back later.
      </p>
      <textarea
        value={text}
        onChange={onChange}
        onBlur={onBlur}
        disabled={loading}
        placeholder="Jot down timestamps, formulas, ideas…"
        className="min-h-[140px] w-full resize-y rounded-xl border border-amber-200/80 bg-white p-3 text-sm text-gray-900 shadow-inner outline-none ring-amber-100 focus:border-amber-400 focus:ring-2 disabled:opacity-60"
        spellCheck="true"
      />
      <p className="mt-1 text-right text-xs text-gray-400">
        {text.length} / {MAX_LEN}
      </p>
    </div>
  );
}
