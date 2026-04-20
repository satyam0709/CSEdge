import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  ExternalLink,
  Clock3,
  Activity,
  RefreshCw,
  Building2,
} from "lucide-react";

const JOB_PLATFORMS = [
  {
    id: "naukri",
    name: "Naukri.com",
    desc: "Best for India-focused fresher and lateral software roles.",
    cta: "Open Naukri Jobs",
    url: "https://www.naukri.com/software-developer-jobs",
    accent: "from-sky-500 to-blue-600",
    badge: "India Hiring",
  },
  {
    id: "linkedin",
    name: "LinkedIn Jobs",
    desc: "High-quality product/startup opportunities with networking edge.",
    cta: "Open LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs/software-engineer-jobs/",
    accent: "from-blue-600 to-indigo-600",
    badge: "Network + Apply",
  },
  {
    id: "indeed",
    name: "Indeed",
    desc: "Large listing volume for internships, remote, and full-time roles.",
    cta: "Open Indeed Jobs",
    url: "https://in.indeed.com/jobs?q=software+developer",
    accent: "from-indigo-500 to-violet-600",
    badge: "High Volume",
  },
  {
    id: "wellfound",
    name: "Wellfound (AngelList)",
    desc: "Top startup jobs for fast-growth teams and equity-based roles.",
    cta: "Open Wellfound Jobs",
    url: "https://wellfound.com/jobs",
    accent: "from-cyan-500 to-blue-700",
    badge: "Startup Picks",
  },
];

function formatNow(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function JobApplyHubSection() {
  const [now, setNow] = useState(new Date());
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastRefresh(new Date());
      setRefreshing(false);
    }, 700);
  };

  const minutesAgo = useMemo(() => {
    const diffMs = Date.now() - lastRefresh.getTime();
    const m = Math.max(0, Math.floor(diffMs / 60000));
    return m;
  }, [lastRefresh, now]);

  return (
    <section className="ui-section-wrap py-8 md:py-12">
      <div className="relative overflow-hidden rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-3 py-6 sm:px-6 md:px-8 shadow-[0_18px_45px_rgba(37,99,235,0.15)]">
        <div className="pointer-events-none absolute -top-14 right-0 h-56 w-56 rounded-full bg-blue-300/25 blur-3xl animate-float-soft" />
        <div className="pointer-events-none absolute -bottom-16 left-0 h-60 w-60 rounded-full bg-indigo-300/20 blur-3xl animate-float-soft" />

        <div className="relative z-10 flex justify-center">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 md:text-4xl">
              Apply to Jobs on Top Platforms
            </h2>
            <p className="mt-2 max-w-3xl text-xs sm:text-sm text-slate-600 md:text-base mx-auto">
              Open curated platforms instantly and start applying to software
              roles. Blue-themed, animated, and optimized for phone/tablet/laptop.
            </p>
          </div>

        </div>

        <div className="relative z-10 mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {JOB_PLATFORMS.map((p, idx) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="stagger-card ui-hover-lift group rounded-2xl border border-blue-200 bg-white p-4 text-left shadow-sm"
              style={{ "--d": `${idx * 70}ms` }}
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <div
                  className={`inline-flex rounded-xl bg-gradient-to-r ${p.accent} p-2.5 text-white shadow-md`}
                >
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                  {p.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.desc}</p>

              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                {p.cta}
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </a>
          ))}
        </div>

        <div className="relative z-10 mt-6 flex justify-center">
          <button
            type="button"
            onClick={refresh}
            className="btn-base btn-primary px-5 py-2.5 text-sm"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Hub"}
          </button>
        </div>
      </div>
    </section>
  );
}
