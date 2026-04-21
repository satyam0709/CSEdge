import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Video,
  CalendarClock,
  Send,
  Sparkles,
  Loader2,
  ExternalLink,
} from "lucide-react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";

export default function MentorOneOnOneSection() {
  const { user, isLoaded } = useUser();
  const [info, setInfo] = useState({
    googleMeetLink: "",
    availabilityText: "",
  });
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fromName: "",
    fromEmail: "",
    topic: "",
    message: "",
  });

  const loadInfo = useCallback(async () => {
    setLoadingInfo(true);
    try {
      const { data } = await axios.get("/api/mentor/info");
      if (data?.success) {
        setInfo({
          googleMeetLink: data.googleMeetLink || "",
          availabilityText: data.availabilityText || "",
        });
      }
    } catch {
      toast.error("Could not load mentor session details.");
    } finally {
      setLoadingInfo(false);
    }
  }, []);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      "";
    const name =
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      "";
    setForm((f) => ({
      ...f,
      fromEmail: f.fromEmail || email,
      fromName: f.fromName || name,
    }));
  }, [isLoaded, user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/mentor/session-request", form);
      if (data?.success) {
        toast.success(data.message || "Request sent.");
        setForm((f) => ({ ...f, topic: "", message: "" }));
      } else {
        toast.error(data?.message || "Something went wrong.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Could not send request.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const meetReady =
    info.googleMeetLink &&
    /^https:\/\//i.test(info.googleMeetLink.trim());

  return (
    <section className="ui-section-wrap py-8 md:py-12">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/80 px-3 py-6 sm:px-6 md:px-8 shadow-[0_18px_45px_rgba(16,185,129,0.12)]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-teal-200/25 blur-3xl" />

        <div className="relative text-center max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 mb-3 rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200/80 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Free · 1:1 career mentor
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Talk to a company-side mentor
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Book-style help for placements: resume, interviews, roadmap, or
            anything blocking you. Join the live Meet when it is open, check
            mentor hours, or send a message — the mentor gets notified on their
            inbox when email is configured on the server.
          </p>
        </div>

        <div className="relative grid gap-5 lg:grid-cols-2 lg:gap-6">
          <div className="space-y-5">
            <div
              className="stagger-card rounded-2xl border border-white/80 bg-white/95 p-5 shadow-sm backdrop-blur text-left"
              style={{ "--d": "0ms" }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Video className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900">Live session link</h3>
                  <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                    Your mentor publishes the current Google Meet here. Open it
                    when it matches the hours on the right.
                  </p>
                  {loadingInfo ? (
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading…
                    </div>
                  ) : meetReady ? (
                    <a
                      href={info.googleMeetLink.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 hover:shadow-lg"
                    >
                      Join Google Meet
                      <ExternalLink className="h-4 w-4 opacity-90" />
                    </a>
                  ) : (
                    <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                      Meet link not set yet. Ask your mentor to add it in
                      Educator → 1:1 Mentor setup.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div
              className="stagger-card rounded-2xl border border-white/80 bg-white/95 p-5 shadow-sm backdrop-blur text-left"
              style={{ "--d": "70ms" }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-800">
                  <CalendarClock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    When the mentor is available
                  </h3>
                  {loadingInfo ? (
                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading…
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                      {info.availabilityText ||
                        "Hours will appear here once your mentor publishes them."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="stagger-card flex flex-col rounded-2xl border border-white/80 bg-white/95 p-5 sm:p-6 shadow-sm backdrop-blur text-left"
            style={{ "--d": "140ms" }}
          >
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Send className="h-5 w-5 text-emerald-600" />
              Request a 1:1 (email to mentor)
            </h3>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">
              Describe your career question. The mentor receives an email when
              SMTP is configured; every request is also listed in the educator
              dashboard.
            </p>

            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your name
              <input
                required
                minLength={2}
                value={form.fromName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fromName: e.target.value }))
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                placeholder="e.g. Priya Sharma"
              />
            </label>

            <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your email
              <input
                required
                type="email"
                value={form.fromEmail}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fromEmail: e.target.value }))
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                placeholder="you@example.com"
              />
            </label>

            <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Topic
              <input
                required
                minLength={3}
                value={form.topic}
                onChange={(e) =>
                  setForm((f) => ({ ...f, topic: e.target.value }))
                }
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                placeholder="e.g. Final-year internship strategy"
              />
            </label>

            <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              What do you need help with?
              <textarea
                required
                minLength={10}
                rows={5}
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                placeholder="Context, timeline, and what you have already tried…"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="btn-base btn-primary mt-5 w-full justify-center gap-2 py-3 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send to mentor
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
