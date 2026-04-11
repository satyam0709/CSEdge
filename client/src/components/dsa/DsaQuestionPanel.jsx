import { BookOpen, Layers, Cpu } from "lucide-react";

const PLATFORM_STYLES = {
  leetcode: "bg-amber-100 text-amber-900 ring-amber-200",
  geeksforgeeks: "bg-green-100 text-green-900 ring-green-200",
  gfg: "bg-green-100 text-green-900 ring-green-200",
  codeforces: "bg-red-100 text-red-900 ring-red-200",
  interviewbit: "bg-violet-100 text-violet-900 ring-violet-200",
  hackerrank: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  cses: "bg-sky-100 text-sky-900 ring-sky-200",
  csedge: "bg-indigo-100 text-indigo-900 ring-indigo-200",
  cseedge: "bg-indigo-100 text-indigo-900 ring-indigo-200",
  default: "bg-slate-100 text-slate-800 ring-slate-200",
};

function inferPlatform(question) {
  const p = (question.platform || "").trim();
  if (p) return p;
  const t = (question.topic || "").toLowerCase();
  if (t.includes("leetcode")) return "LeetCode";
  if (t.includes("gfg") || t.includes("geeks")) return "GeeksforGeeks";
  if (t.includes("codeforces")) return "Codeforces";
  if (t.includes("interviewbit")) return "InterviewBit";
  if (t.includes("hackerrank")) return "HackerRank";
  return "DSA Practice";
}

function platformBadgeClass(label) {
  const key = label.toLowerCase().replace(/\s+/g, "");
  for (const [k, cls] of Object.entries(PLATFORM_STYLES)) {
    if (key.includes(k)) return cls;
  }
  return PLATFORM_STYLES.default;
}

export default function DsaQuestionPanel({
  question,
  currentQuestionNumber = 1,
  totalQuestions = 15,
}) {
  if (!question) return null;

  const platformLabel = inferPlatform(question);
  const badgeClass = platformBadgeClass(platformLabel);

  return (
    <section className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100/80 overflow-hidden">
      <header className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ${badgeClass}`}
          >
            <Cpu className="h-3.5 w-3.5" />
            {platformLabel}
          </span>
          {question.topic ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              <BookOpen className="h-3.5 w-3.5" />
              {question.topic}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800">
            <Layers className="h-3.5 w-3.5" />
            Level {question.level ?? "—"}
          </span>
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Question {currentQuestionNumber} of {totalQuestions}
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-all duration-500"
            style={{
              width: `${Math.min(100, (currentQuestionNumber / totalQuestions) * 100)}%`,
            }}
          />
        </div>
      </header>

      <div className="flex-1 space-y-5 p-5 md:p-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Problem statement
          </h2>
          <p className="text-lg md:text-xl font-semibold text-slate-900 leading-relaxed whitespace-pre-wrap">
            {question.question}
          </p>
        </div>

        {question.constraints?.trim() ? (
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-amber-900 mb-2">
              Constraints
            </h3>
            <p className="text-sm text-amber-950/90 whitespace-pre-wrap leading-relaxed">
              {question.constraints}
            </p>
          </div>
        ) : null}

        {(question.sampleInput?.trim() || question.sampleOutput?.trim()) ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {question.sampleInput?.trim() ? (
              <div className="rounded-xl border border-slate-200 bg-slate-900 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
                  Sample input
                </h3>
                <pre className="font-mono text-sm text-emerald-300 whitespace-pre-wrap break-all">
                  {question.sampleInput}
                </pre>
              </div>
            ) : null}
            {question.sampleOutput?.trim() ? (
              <div className="rounded-xl border border-slate-200 bg-slate-900 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
                  Sample output
                </h3>
                <pre className="font-mono text-sm text-sky-300 whitespace-pre-wrap break-all">
                  {question.sampleOutput}
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
