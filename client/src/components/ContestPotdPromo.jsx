import { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "../utils/axios";
import { ExternalLink, Trophy, Sparkles, X } from "lucide-react";

const SESSION_SNOOZE = "lms_promo_session_snooze";

function contestEndTime(c) {
  if (c.endTime) return c.endTime;
  if (c.duration != null && c.startTime) {
    return c.startTime + c.duration * 60 * 1000;
  }
  return null;
}

function isContestLive(c, now) {
  const end = contestEndTime(c);
  if (c.startTime > now) return false;
  if (!end) return c.startTime <= now;
  return now >= c.startTime && now < end;
}

function contestDoneKey(c) {
  return `lms_promo_contest_done_${c.source}_${c.startTime}`;
}

function potdDoneKey(p) {
  const d = p.date || "";
  const t = (p.title || "").slice(0, 48);
  return `lms_promo_potd_done_${p.source}_${d}_${t}`;
}

/**
 * On home routes: if a contest is LIVE and not marked done → modal.
 * Else if today's POTD (LC or GFG) not marked done → modal.
 * "Mark as done" saves to localStorage (won't show again for that item).
 * "Later" snoozes until the browser session ends (sessionStorage).
 */
export default function ContestPotdPromo() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState(null);
  const [contest, setContest] = useState(null);
  const [potd, setPotd] = useState(null);

  const eligiblePath =
    pathname === "/" || pathname === "/home" || pathname === "";

  const evaluate = useCallback(async () => {
    if (!eligiblePath) return;
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_SNOOZE) === "1") {
      return;
    }

    try {
      const { data } = await axios.get("/api/contest", { timeout: 28000 });
      if (!data.success) return;

      const contests = data.contests || [];
      const potds = data.potds || [];
      const now = Date.now();

      const live = contests.filter((c) => isContestLive(c, now));
      const firstLive = live.find((c) => !localStorage.getItem(contestDoneKey(c)));

      if (firstLive) {
        setContest(firstLive);
        setPotd(null);
        setKind("contest");
        setOpen(true);
        return;
      }

      const lc = potds.find((p) => p.source === "leetcode");
      const gfg = potds.find((p) => p.source === "gfg");
      const p = lc || gfg;
      if (!p) return;
      if (localStorage.getItem(potdDoneKey(p))) return;

      setContest(null);
      setPotd(p);
      setKind("potd");
      setOpen(true);
    } catch (e) {
      console.warn("[ContestPotdPromo]", e);
    }
  }, [eligiblePath]);

  useEffect(() => {
    if (!eligiblePath) {
      setOpen(false);
      return;
    }
    const t = window.setTimeout(() => evaluate(), 600);
    return () => clearTimeout(t);
  }, [eligiblePath, evaluate]);

  const markDone = () => {
    if (kind === "contest" && contest) {
      localStorage.setItem(contestDoneKey(contest), "1");
    }
    if (kind === "potd" && potd) {
      localStorage.setItem(potdDoneKey(potd), "1");
    }
    setOpen(false);
  };

  const remindLater = () => {
    sessionStorage.setItem(SESSION_SNOOZE, "1");
    setOpen(false);
  };

  if (!open || !kind) return null;

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={remindLater}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {kind === "contest" && contest && (
          <>
            <div className="mb-3 flex items-center gap-2 text-red-600">
              <Trophy size={22} className="shrink-0" />
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide">
                Live contest
              </span>
            </div>
            <h2 id="promo-title" className="pr-8 text-xl font-bold leading-snug text-slate-900">
              {contest.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              A contest is running now. Join from the contest page or open the platform directly.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href={contest.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Open contest <ExternalLink size={16} />
              </a>
              <Link
                to="/contests"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                View contests hub
              </Link>
            </div>
          </>
        )}

        {kind === "potd" && potd && (
          <>
            <div className="mb-3 flex items-center gap-2 text-blue-600">
              <Sparkles size={22} className="shrink-0" />
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide">
                Problem of the Day
              </span>
            </div>
            <h2 id="promo-title" className="pr-8 text-xl font-bold leading-snug text-slate-900">
              {potd.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Try today&apos;s POTD when you have time. Mark as done here when you&apos;ve solved it so we don&apos;t
              show this again.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href={potd.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Solve now <ExternalLink size={16} />
              </a>
              <Link
                to="/contests"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Open practice hub
              </Link>
            </div>
          </>
        )}

        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={markDone}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            {kind === "contest" ? "Dismiss — I’ve seen this" : "Mark POTD as done"}
          </button>
          <button
            type="button"
            onClick={remindLater}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
