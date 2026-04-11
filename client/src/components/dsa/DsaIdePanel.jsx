import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

const DEFAULT_CPP = `// Your logic here (scratch pad — MCQ answer is submitted below)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    return 0;
}
`;

export default function DsaIdePanel({ starterCode, questionKey }) {
  const initial =
    (starterCode && String(starterCode).trim()) || DEFAULT_CPP;
  const [source, setSource] = useState(initial);

  useEffect(() => {
    setSource((starterCode && String(starterCode).trim()) || DEFAULT_CPP);
  }, [questionKey, starterCode]);

  return (
    <section className="flex flex-col rounded-2xl border border-slate-800 bg-[#0d1117] shadow-lg overflow-hidden min-h-[320px] lg:min-h-[420px]">
      <header className="flex items-center justify-between gap-3 border-b border-slate-700/80 bg-[#161b22] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="ml-2 flex items-center gap-1.5 font-mono text-xs text-slate-400">
            <Terminal className="h-3.5 w-3.5 text-slate-500" />
            solution.cpp
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          IDE
        </span>
      </header>
      <div className="flex-1 flex flex-col min-h-0">
        <textarea
          value={source}
          onChange={(e) => setSource(e.target.value)}
          spellCheck={false}
          className="flex-1 min-h-[260px] lg:min-h-[360px] w-full resize-y bg-[#0d1117] p-4 font-mono text-[13px] leading-relaxed text-slate-100 caret-indigo-400 outline-none focus:ring-0 border-0"
          aria-label="Code editor scratch pad"
        />
      </div>
      <footer className="border-t border-slate-700/80 bg-[#161b22] px-4 py-2 text-[11px] text-slate-500">
        Local editor only — choose the correct option under the question to submit your answer.
      </footer>
    </section>
  );
}
