import { Cpu } from "lucide-react";
import { resolveDsaPlatform } from "./dsaPlatformUtils";

const RING = {
  leetcode: "ring-amber-300 bg-amber-50 text-amber-950",
  gfg: "ring-green-300 bg-green-50 text-green-950",
  codeforces: "ring-red-300 bg-red-50 text-red-950",
  custom: "ring-indigo-300 bg-indigo-50 text-indigo-950",
};

export default function DsaPlatformStrip({ question, questionNumber = 1 }) {
  const { active, source, all } = resolveDsaPlatform(question, questionNumber);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-3 md:p-4">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        <Cpu className="h-3.5 w-3.5 text-slate-400" aria-hidden />
        Question source (platform-style)
        {source === "rotate" ? (
          <span className="font-normal normal-case text-slate-400">
            — rotated when not set in data
          </span>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {all.map((p) => {
          const on = p.id === active.id;
          const ring = RING[p.id] || RING.custom;
          return (
            <span
              key={p.id}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                on
                  ? `${ring} ring-2 shadow-sm scale-[1.02]`
                  : "bg-white text-slate-500 ring-1 ring-slate-200 opacity-80"
              }`}
            >
              <span className="font-mono text-[10px] opacity-70">{p.short}</span>
              {p.label}
            </span>
          );
        })}
        {active.id === "custom" ? (
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-2 ${RING.custom} scale-[1.02]`}
          >
            {active.label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
