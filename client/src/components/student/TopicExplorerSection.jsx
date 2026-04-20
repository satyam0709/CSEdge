import React, { useState, useMemo } from 'react';
import { ExternalLink, Search, Code2, Flame, Layers, GitBranch, Zap, X } from 'lucide-react';

// ── All LeetCode topics from the image with their counts & slugs ──────────────
const ALL_TOPICS = [
  // Tier 1 – Hot (≥400 problems)
  { name: 'Array', count: 2141, slug: 'array', tier: 1 },
  { name: 'String', count: 867, slug: 'string', tier: 1 },
  { name: 'Hash Table', count: 808, slug: 'hash-table', tier: 1 },
  { name: 'Math', count: 666, slug: 'math', tier: 1 },
  { name: 'Dynamic Programming', count: 652, slug: 'dynamic-programming', tier: 1 },
  { name: 'Sorting', count: 512, slug: 'sorting', tier: 1 },
  { name: 'Greedy', count: 460, slug: 'greedy', tier: 1 },

  // Tier 2 – Popular (200–399)
  { name: 'Depth-First Search', count: 337, slug: 'depth-first-search', tier: 2 },
  { name: 'Binary Search', count: 333, slug: 'binary-search', tier: 2 },
  { name: 'Database', count: 310, slug: 'database', tier: 2 },
  { name: 'Bit Manipulation', count: 281, slug: 'bit-manipulation', tier: 2 },
  { name: 'Matrix', count: 273, slug: 'matrix', tier: 2 },
  { name: 'Tree', count: 261, slug: 'tree', tier: 2 },
  { name: 'Breadth-First Search', count: 255, slug: 'breadth-first-search', tier: 2 },
  { name: 'Two Pointers', count: 251, slug: 'two-pointers', tier: 2 },
  { name: 'Prefix Sum', count: 242, slug: 'prefix-sum', tier: 2 },
  { name: 'Heap (Priority Queue)', count: 214, slug: 'heap-priority-queue', tier: 2 },
  { name: 'Simulation', count: 207, slug: 'simulation', tier: 2 },
  { name: 'Counting', count: 203, slug: 'counting', tier: 2 },

  // Tier 3 – Common (100–199)
  { name: 'Graph Theory', count: 181, slug: 'graph', tier: 3 },
  { name: 'Binary Tree', count: 179, slug: 'binary-tree', tier: 3 },
  { name: 'Stack', count: 179, slug: 'stack', tier: 3 },
  { name: 'Sliding Window', count: 164, slug: 'sliding-window', tier: 3 },
  { name: 'Enumeration', count: 146, slug: 'enumeration', tier: 3 },
  { name: 'Design', count: 136, slug: 'design', tier: 3 },
  { name: 'Backtracking', count: 113, slug: 'backtracking', tier: 3 },

  // Tier 4 – Intermediate (50–99)
  { name: 'Union-Find', count: 99, slug: 'union-find', tier: 4 },
  { name: 'Number Theory', count: 94, slug: 'number-theory', tier: 4 },
  { name: 'Linked List', count: 82, slug: 'linked-list', tier: 4 },
  { name: 'Ordered Set', count: 76, slug: 'ordered-set', tier: 4 },
  { name: 'Segment Tree', count: 75, slug: 'segment-tree', tier: 4 },
  { name: 'Monotonic Stack', count: 73, slug: 'monotonic-stack', tier: 4 },
  { name: 'Divide and Conquer', count: 65, slug: 'divide-and-conquer', tier: 4 },
  { name: 'Combinatorics', count: 61, slug: 'combinatorics', tier: 4 },
  { name: 'Trie', count: 61, slug: 'trie', tier: 4 },
  { name: 'Bitmask', count: 55, slug: 'bitmask', tier: 4 },
  { name: 'Queue', count: 54, slug: 'queue', tier: 4 },
  { name: 'Recursion', count: 51, slug: 'recursion', tier: 4 },

  // Tier 5 – Advanced (20–49)
  { name: 'Geometry', count: 45, slug: 'geometry', tier: 5 },
  { name: 'Binary Indexed Tree', count: 44, slug: 'binary-indexed-tree', tier: 5 },
  { name: 'Memoization', count: 43, slug: 'memoization', tier: 5 },
  { name: 'Hash Function', count: 42, slug: 'hash-function', tier: 5 },
  { name: 'Binary Search Tree', count: 42, slug: 'binary-search-tree', tier: 5 },
  { name: 'Topological Sort', count: 40, slug: 'topological-sort', tier: 5 },
  { name: 'Shortest Path', count: 38, slug: 'shortest-path', tier: 5 },
  { name: 'String Matching', count: 37, slug: 'string-matching', tier: 5 },
  { name: 'Rolling Hash', count: 32, slug: 'rolling-hash', tier: 5 },
  { name: 'Game Theory', count: 30, slug: 'game-theory', tier: 5 },
  { name: 'Interactive', count: 25, slug: 'interactive', tier: 5 },
  { name: 'Data Stream', count: 24, slug: 'data-stream', tier: 5 },
  { name: 'Monotonic Queue', count: 23, slug: 'monotonic-queue', tier: 5 },
  { name: 'Brainteaser', count: 21, slug: 'brainteaser', tier: 5 },

  // Tier 6 – Expert (<20)
  { name: 'Doubly-Linked List', count: 15, slug: 'doubly-linked-list', tier: 6 },
  { name: 'Merge Sort', count: 15, slug: 'merge-sort', tier: 6 },
  { name: 'Randomized', count: 12, slug: 'randomized', tier: 6 },
  { name: 'Counting Sort', count: 11, slug: 'counting-sort', tier: 6 },
  { name: 'Iterator', count: 9, slug: 'iterator', tier: 6 },
  { name: 'Concurrency', count: 9, slug: 'concurrency', tier: 6 },
  { name: 'Quickselect', count: 8, slug: 'quickselect', tier: 6 },
  { name: 'Suffix Array', count: 8, slug: 'suffix-array', tier: 6 },
  { name: 'Sweep Line', count: 8, slug: 'line-sweep', tier: 6 },
  { name: 'Probability and Statistics', count: 7, slug: 'probability-and-statistics', tier: 6 },
  { name: 'Minimum Spanning Tree', count: 6, slug: 'minimum-spanning-tree', tier: 6 },
  { name: 'Bucket Sort', count: 6, slug: 'bucket-sort', tier: 6 },
  { name: 'Shell', count: 4, slug: 'shell', tier: 6 },
  { name: 'Reservoir Sampling', count: 4, slug: 'reservoir-sampling', tier: 6 },
  { name: 'Eulerian Circuit', count: 3, slug: 'eulerian-circuit', tier: 6 },
  { name: 'Radix Sort', count: 3, slug: 'radix-sort', tier: 6 },
  { name: 'Strongly Connected Component', count: 2, slug: 'strongly-connected-component', tier: 6 },
  { name: 'Rejection Sampling', count: 2, slug: 'rejection-sampling', tier: 6 },
  { name: 'Biconnected Component', count: 1, slug: 'biconnected-component', tier: 6 },
];

// ── Tier styling ──────────────────────────────────────────────────────────────
const TIER_STYLE = {
  1: { bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-400', text: 'text-orange-800', badge: 'bg-orange-200 text-orange-800', dot: 'bg-orange-500' },
  2: { bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200 hover:border-blue-400', text: 'text-blue-800', badge: 'bg-blue-200 text-blue-800', dot: 'bg-blue-500' },
  3: { bg: 'bg-violet-50 hover:bg-violet-100 border-violet-200 hover:border-violet-400', text: 'text-violet-800', badge: 'bg-violet-200 text-violet-800', dot: 'bg-violet-500' },
  4: { bg: 'bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-400', text: 'text-green-800', badge: 'bg-green-200 text-green-800', dot: 'bg-green-500' },
  5: { bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200 hover:border-amber-400', text: 'text-amber-800', badge: 'bg-amber-200 text-amber-800', dot: 'bg-amber-500' },
  6: { bg: 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-400', text: 'text-slate-700', badge: 'bg-slate-200 text-slate-700', dot: 'bg-slate-400' },
};

const TIER_LABELS = {
  1: { label: 'Hot Topics', icon: <Flame className="w-3.5 h-3.5" /> },
  2: { label: 'Popular', icon: <Zap className="w-3.5 h-3.5" /> },
  3: { label: 'Core Algorithms', icon: <GitBranch className="w-3.5 h-3.5" /> },
  4: { label: 'Intermediate', icon: <Layers className="w-3.5 h-3.5" /> },
  5: { label: 'Advanced', icon: <Code2 className="w-3.5 h-3.5" /> },
  6: { label: 'Expert', icon: <Code2 className="w-3.5 h-3.5" /> },
};

const FILTER_TABS = [
  { id: 'all', label: 'All Topics' },
  { id: '1', label: '🔥 Hot' },
  { id: '2', label: '⚡ Popular' },
  { id: '3', label: '🌿 Core' },
  { id: '4', label: '🎯 Intermediate' },
  { id: '5', label: '🚀 Advanced' },
  { id: '6', label: '💎 Expert' },
];

function lcUrl(slug) {
  return `https://leetcode.com/problemset/?topicSlugs=${slug}`;
}

export default function TopicExplorerSection() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    let topics = ALL_TOPICS;
    if (activeTab !== 'all') {
      topics = topics.filter(t => String(t.tier) === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      topics = topics.filter(t => t.name.toLowerCase().includes(q));
    }
    return topics;
  }, [search, activeTab]);

  const visible = showAll || search || activeTab !== 'all' ? filtered : filtered.slice(0, 42);
  const hasMore = !showAll && !search && activeTab === 'all' && filtered.length > 42;

  return (
    <section className="ui-section-wrap py-10 md:py-14">
      <div className="ui-soft-card overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-10 sm:px-6 md:px-8">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight leading-tight">
            Practice by Topic On LeetCode
            </h1>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm">
            <span className="text-slate-300"><span className="text-white font-bold">{ALL_TOPICS.length}</span> topics</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300"><span className="text-white font-bold">{ALL_TOPICS.reduce((a, t) => a + t.count, 0).toLocaleString()}+</span> problems</span>
            <span className="text-slate-500">·</span>
            <a
              href="https://leetcode.com/problemset/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-semibold transition"
            >
              Open LeetCode <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* ── Search + filter row ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setShowAll(true); }}
              placeholder="Search topics… e.g. Tree, DP, Graph"
              className="w-full rounded-xl bg-slate-700/90 border border-slate-600 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setShowAll(false); }}
                className={`rounded-lg px-3 py-2 text-xs font-bold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white border border-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Topic chips ──────────────────────────────────────────────── */}
        {visible.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No topics match "{search}"</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {visible.map(topic => {
              const s = TIER_STYLE[topic.tier];
              return (
                <a
                  key={topic.slug}
                  href={lcUrl(topic.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                className={`group inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 ${s.bg} ${s.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                  <span>{topic.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${s.badge}`}>
                    {topic.count >= 1000 ? `${(topic.count / 1000).toFixed(1)}k` : topic.count}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
                </a>
              );
            })}
          </div>
        )}

        {/* ── Show more / collapse ─────────────────────────────────────── */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 hover:text-white transition"
            >
              Show all {filtered.length} topics ↓
            </button>
          </div>
        )}
        {showAll && activeTab === 'all' && !search && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="text-sm text-slate-400 hover:text-slate-200 transition"
            >
              Collapse ↑
            </button>
          </div>
        )}

        {/* ── Legend ───────────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {Object.entries(TIER_LABELS).map(([tier, { label, icon }]) => {
            const s = TIER_STYLE[Number(tier)];
            return (
              <button
                key={tier}
                type="button"
                onClick={() => { setActiveTab(tier); setShowAll(false); }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition hover:scale-105 ${s.bg} ${s.text}`}
              >
                {icon} {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
