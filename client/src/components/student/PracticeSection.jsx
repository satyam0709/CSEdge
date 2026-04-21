// src/components/student/PracticeSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Code2,
  Laptop,
  Building2,
  ArrowRight,
  BarChart3,
  BookOpen,
  Trophy,
  Mic,
  FileUser,
  Database,
  Medal,
  ListChecks,
  Library,
  FileText,
  LayoutGrid,
  ExternalLink,
} from 'lucide-react';

const CpResourceCard = ({ item, index }) => (
  <a
    href={item.href}
    target="_blank"
    rel="noopener noreferrer"
    className={`stagger-card block p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl ${item.border} group bg-white/95 backdrop-blur no-underline`}
    style={{ '--d': `${index * 70}ms` }}
  >
    <div
      className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
    >
      {item.icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
      {item.title}
    </h3>
    <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.desc}</p>
    <div className="flex items-center font-semibold text-gray-700 text-sm group-hover:text-violet-600">
      Open resource
      <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </div>
  </a>
);

const Card = ({ item, navigate, index }) => (
  <div
    onClick={() => navigate(item.path)}
    className={`stagger-card p-4 sm:p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl ${item.border} group bg-white/95 backdrop-blur`}
    style={{ '--d': `${index * 70}ms` }}
  >
    <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4 transition-colors group-hover:scale-110 duration-300`}>
      {item.icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
      {item.title}
    </h3>
    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
      {item.desc}
    </p>
    <div className="flex items-center font-semibold text-gray-700 text-sm group-hover:text-blue-600">
      {item.cta || 'Start'} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

const PracticeSection = () => {
  const navigate = useNavigate();

  const practices = [
    {
      id: 'aptitude',
      title: 'Aptitude & Logic',
      desc: 'Master Quantitative, Verbal, and Logical reasoning for placement exams.',
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50',
      border: 'hover:border-purple-500',
      path: '/practice/aptitude',
    },
    {
      id: 'dsa',
      title: 'DSA & Coding',
      desc: 'Solve 50 levels of Data Structures and Algorithms from Basics to Hard.',
      icon: <Code2 className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50',
      border: 'hover:border-blue-500',
      path: '/practice/dsa',
    },
    {
      id: 'dev',
      title: 'Full Stack Dev',
      desc: 'Test your knowledge on React, Node.js, SQL, and System Design.',
      icon: <Laptop className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
      border: 'hover:border-green-500',
      path: '/practice/dev',
    },
    {
      id: 'sql',
      title: 'SQL & Database Lab',
      desc: 'Master complex queries, joins, indexes and database design across 50 levels.',
      icon: <Database className="w-8 h-8 text-emerald-600" />,
      color: 'bg-emerald-50',
      border: 'hover:border-emerald-500',
      path: '/practice/sql',
    },
  ];

  const careerItems = [
    {
      id: 'companies',
      title: 'Company Interview',
      desc: 'Practice real interview questions from top tech companies.',
      icon: <Building2 className="w-8 h-8 text-orange-600" />,
      color: 'bg-orange-50',
      border: 'hover:border-orange-500',
      path: '/practice/companies',
      cta: 'Explore',
    },
    {
      id: 'study-share',
      title: 'Community Notes',
      desc: 'Share your own notes, screenshots & PDFs — help others prep (no pirated material).',
      icon: <BookOpen className="w-8 h-8 text-teal-600" />,
      color: 'bg-teal-50',
      border: 'hover:border-teal-500',
      path: '/study-share',
      cta: 'Browse',
    },
    {
      id: 'mock-interview',
      title: 'Mock Interview Simulator',
      desc: 'AI-driven interview practice with real-time feedback. Pick your role and get graded answers.',
      icon: <Mic className="w-8 h-8 text-indigo-600" />,
      color: 'bg-indigo-50',
      border: 'hover:border-indigo-500',
      path: '/mock-interview',
      cta: 'Practice Now',
    },
    {
      id: 'resume-builder',
      title: 'Resume & Portfolio Builder',
      desc: 'Build a job-ready resume with live preview, auto-save, and PDF export — tailored for CSE students.',
      icon: <FileUser className="w-8 h-8 text-rose-600" />,
      color: 'bg-rose-50',
      border: 'hover:border-rose-500',
      path: '/resume-builder',
      cta: 'Build Resume',
    },
  ];

  const cpResources = [
    {
      id: 'cses',
      title: 'CSES Problem Set',
      desc: 'Classic tasks from intro to advanced — build speed, patterns, and contest stamina.',
      href: 'https://cses.fi/problemset/',
      icon: <ListChecks className="w-8 h-8 text-violet-600" />,
      color: 'bg-violet-50',
      border: 'hover:border-violet-500',
    },
    {
      id: 'cp-algorithms',
      title: 'CP-Algorithms',
      desc: 'Clear write-ups on DS, graphs, strings, math, and more — your free reference library.',
      href: 'https://cp-algorithms.com/',
      icon: <Library className="w-8 h-8 text-indigo-600" />,
      color: 'bg-indigo-50',
      border: 'hover:border-indigo-500',
    },
    {
      id: 'handbook',
      title: 'Competitive Programmer’s Handbook',
      desc: 'Antti Laaksonen’s book (PDF) — structured theory from basics to harder topics.',
      href: 'https://cses.fi/book/book.pdf',
      icon: <FileText className="w-8 h-8 text-fuchsia-600" />,
      color: 'bg-fuchsia-50',
      border: 'hover:border-fuchsia-500',
    },
    {
      id: 'tle-sheet',
      title: 'TLE Eliminators CP Sheet',
      desc: 'A curated roadmap of problems — stay consistent and level up with a guided checklist.',
      href: 'https://www.tle-eliminators.com/cp-sheet',
      icon: <LayoutGrid className="w-8 h-8 text-sky-600" />,
      color: 'bg-sky-50',
      border: 'hover:border-sky-500',
    },
  ];

  return (
    <>
      {/* ── Practice Arena ───────────────────────────────────────────── */}
      <div className="py-10 md:py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Practice Arena</h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base">Choose a track and start leveling up your skills today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practices.map((item, index) => (
              <Card key={item.id} item={item} navigate={navigate} index={index} />
            ))}
          </div>

          {/* Dashboard Button */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-base btn-primary group px-8 py-3.5 text-sm md:text-base"
            >
              <BarChart3 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              View Your Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Competitive programming resources ─────────────────────────── */}
      <div className="py-10 md:py-16 bg-gradient-to-b from-slate-50/90 via-white/50 to-transparent border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-3 rounded-full bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-700 ring-1 ring-violet-200/80">
              <Medal className="w-4 h-4" />
              For competitive programmers
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
              Reading &amp; practice beyond the arena
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Trusted problem banks, algorithms wiki, the classic handbook PDF, and a guided sheet — same polish as the rest of your journey, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cpResources.map((item, index) => (
              <CpResourceCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Career Excellence ─────────────────────────────────────────── */}
      <div className="py-10 md:py-16 bg-white/70 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-3 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700 ring-1 ring-amber-200">
              <Trophy className="w-4 h-4" />
              Career Excellence
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Go Beyond the Basics</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">Real interview prep and community-powered resources to land your dream job.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerItems.map((item, index) => (
              <Card key={item.id} item={item} navigate={navigate} index={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PracticeSection;