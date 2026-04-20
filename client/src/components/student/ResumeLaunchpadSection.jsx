import { useMemo, useState } from "react";
import {
  FileCode2,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Gauge,
  Download,
  Bot,
  ShieldCheck,
} from "lucide-react";

const OVERLEAF_URL = "https://www.overleaf.com/project";
const CLAUDE_URL = "https://claude.ai/new";
const ATS_CHECK_URL = "https://enhancv.com/resources/resume-checker/";

const ATS_PROMPT = `# THE ULTIMATE ATS RESUME PROMPT (2025-2026 Market)
You are a senior technical resume writer with 10+ years of experience placing developers
at FAANG companies, funded startups, and top product firms. Your job is to write a
one-page, ATS-optimized resume for a software developer in the 2026 job market.

Candidate Profile:
- Name: [YOUR FULL NAME]
- Location: [CITY, COUNTRY]
- Email: [EMAIL] | Phone: [PHONE] | GitHub: [GITHUB URL] | LinkedIn: [LINKEDIN URL]
- Role Target: [TARGET ROLE]
- Years of Experience: [YEARS]
- Core Stack: [STACK]
- Other Tools: [TOOLS]
- Key Projects:
  1. [Project 1 + tech + measurable impact]
  2. [Project 2 + tech + measurable impact]
  3. [Project 3 + tech + measurable impact]
- Education: [DEGREE OR SELF-TAUGHT]
- Certifications: [LIST OR NONE]
- Job Description I am targeting:
  [PASTE FULL JD]

STRICT RULES:
1) Single-column markdown. ATS-safe.
2) Exactly one page.
3) Sections in order:
   Contact Info, Professional Summary, Technical Skills, Professional Experience,
   Key Projects, Education.
4) Extract top 10-12 JD keywords and use naturally across sections.
5) Every bullet = Action Verb + What + How + Impact (with metric).
6) Summary must include years, top skills, biggest win, role alignment.
7) Remove fluff; only evidence-based statements.
8) Mirror exact JD phrases for ATS match.
9) Output:
   - Full resume in markdown
   - TOP 5 KEYWORDS USED
   - 3 CUSTOMIZATION TIPS
10) Tone: Professional, confident, direct.

Generate the full resume now.`;

const CHECKLIST = [
  "Every bullet has at least one metric",
  "Summary includes exact target role title",
  "Top 5 JD keywords are used multiple times",
  "Resume fits one page in final format",
  "GitHub link is live with real code",
  "Fluff words removed",
  "Spelling and grammar checked",
  "Professional email is used",
];

export default function ResumeLaunchpadSection() {
  const [promptText, setPromptText] = useState(ATS_PROMPT);
  const [copied, setCopied] = useState(false);
  const [checks, setChecks] = useState(() => CHECKLIST.map(() => false));

  const completed = checks.filter(Boolean).length;
  const readiness = Math.round((completed / CHECKLIST.length) * 100);

  const readinessText = useMemo(() => {
    if (readiness >= 90) return "Production-ready resume package";
    if (readiness >= 65) return "Strong draft — polish remaining items";
    return "Draft stage — complete checklist items";
  }, [readiness]);

  const toggleCheck = (idx) => {
    setChecks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const downloadPrompt = () => {
    const blob = new Blob([promptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ats_resume_prompt_2026.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="ui-section-wrap py-12 md:py-16">
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-8 sm:px-6 md:px-8 shadow-[0_18px_45px_rgba(37,99,235,0.15)]">
        <div className="pointer-events-none absolute -left-20 top-8 h-64 w-64 rounded-full bg-blue-300/25 blur-3xl animate-float-soft" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl animate-float-soft" />

        <div className="relative z-10 text-left">
          <h2 className="text-2xl font-extrabold leading-tight text-slate-900 md:text-4xl">
            Build ATS-Optimized Resume in 4 Steps
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 md:text-base">
            Open your Overleaf template, customize the ATS prompt, run it in Claude,
            then validate score with ATS checker. Everything below is interactive and
            responsive.
          </p>
        </div>

        <div className="relative z-10 mt-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <a
            href={OVERLEAF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="stagger-card ui-hover-lift rounded-2xl border border-blue-200 bg-white p-4 text-left text-slate-900"
            style={{ "--d": "30ms" }}
          >
            <FileCode2 className="mb-2 h-6 w-6 text-cyan-300" />
            <p className="font-bold">Step 1: Open Overleaf Project</p>
            <p className="mt-1 text-xs text-slate-600">
              Edit your LaTeX resume template directly.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-200">
              Launch <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>

          <button
            type="button"
            onClick={copyPrompt}
            className="stagger-card ui-hover-lift rounded-2xl border border-blue-200 bg-white p-4 text-left text-slate-900"
            style={{ "--d": "90ms" }}
          >
            {copied ? (
              <Check className="mb-2 h-6 w-6 text-emerald-300" />
            ) : (
              <Copy className="mb-2 h-6 w-6 text-blue-300" />
            )}
            <p className="font-bold">Step 2: Copy ATS Prompt</p>
            <p className="mt-1 text-xs text-slate-600">
              Copy instantly, then fill your profile + job description.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-200">
              {copied ? "Copied" : "Copy Prompt"}
            </span>
          </button>

          <a
            href={CLAUDE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="stagger-card ui-hover-lift rounded-2xl border border-blue-200 bg-white p-4 text-left text-slate-900"
            style={{ "--d": "150ms" }}
          >
            <Bot className="mb-2 h-6 w-6 text-violet-300" />
            <p className="font-bold">Step 3: Generate Resume</p>
            <p className="mt-1 text-xs text-slate-600">
              Paste prompt in Claude/LLM and generate one-page ATS resume.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-200">
              Open Claude <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>

          <a
            href={ATS_CHECK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="stagger-card ui-hover-lift rounded-2xl border border-blue-200 bg-white p-4 text-left text-slate-900"
            style={{ "--d": "210ms" }}
          >
            <ShieldCheck className="mb-2 h-6 w-6 text-emerald-300" />
            <p className="font-bold">Step 4: Check ATS Score</p>
            <p className="mt-1 text-xs text-slate-600">
              Validate keyword alignment and parser compatibility.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-200">
              Run ATS Check <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>

        <div className="relative z-10 mt-7 grid grid-cols-1 gap-5 xl:grid-cols-5">
          <div className="xl:col-span-3 rounded-2xl border border-blue-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold text-slate-900">ATS Prompt Editor</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="btn-base rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={downloadPrompt}
                  className="btn-base rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              </div>
            </div>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              spellCheck={false}
              className="h-72 w-full resize-y rounded-xl border border-blue-200 bg-slate-950 p-3 font-mono text-xs leading-relaxed text-slate-200 outline-none focus:border-blue-400"
            />
          </div>

          <div className="xl:col-span-2 rounded-2xl border border-blue-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Realtime Resume Readiness</p>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {completed}/{CHECKLIST.length}
              </span>
            </div>

            <div className="mb-3 flex items-center gap-3">
              <Gauge className="h-5 w-5 text-cyan-300" />
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 transition-all duration-500"
                  style={{ width: `${readiness}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-900">{readiness}%</span>
            </div>
            <p className="mb-4 text-xs text-slate-600">{readinessText}</p>

            <div className="space-y-2">
              {CHECKLIST.map((item, idx) => (
                <label
                  key={item}
                  className="flex cursor-pointer items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/40 px-3 py-2 text-xs text-slate-700 hover:bg-blue-50"
                >
                  <input
                    type="checkbox"
                    checked={checks[idx]}
                    onChange={() => toggleCheck(idx)}
                    className="mt-0.5"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
