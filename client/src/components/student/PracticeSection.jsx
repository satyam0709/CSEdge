// src/components/student/PracticeSection.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Brain, Code2, Laptop, Building2, ArrowRight,
  BarChart3, BookOpen, Trophy, Mic, FileUser,
  Database, Medal, ListChecks, Library, Target,
  LayoutGrid, ExternalLink,
} from 'lucide-react'
import PlacementSheetsTracker from './PlacementSheetsTracker'

/* ── Internal card components ─────────────────────────────────────── */

const Card = ({ item, onClick, index }) => (
  <div
    onClick={onClick}
    className="stagger-card group relative cursor-pointer rounded-2xl p-5 md:p-6 overflow-hidden"
    style={{
      '--d': `${index * 70}ms`,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(148,163,184,0.2)',
      boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px) scale(1.012)'
      e.currentTarget.style.borderColor = item.glowColor
      e.currentTarget.style.boxShadow = `0 20px 55px ${item.shadowColor}, 0 0 0 1px ${item.glowColor}`
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)'
      e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,23,42,0.06)'
    }}
  >
    {/* Hover glow bg */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
      style={{ background: `linear-gradient(135deg, ${item.bgGlow} 0%, transparent 70%)` }}
    />

    <div className="relative z-10">
      <div
        className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
      >
        {item.icon}
      </div>
      <h3 className={`text-lg font-bold text-gray-900 mb-2 transition-colors ${item.hoverText}`}>
        {item.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.desc}</p>
      <div className={`flex items-center font-semibold text-gray-700 text-sm ${item.hoverText}`}>
        {item.cta || 'Start'}
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-200" />
      </div>
    </div>
  </div>
)

const LinkCard = ({ item, index }) => (
  <a
    href={item.href}
    target="_blank"
    rel="noopener noreferrer"
    className="stagger-card group relative block rounded-2xl p-5 md:p-6 overflow-hidden no-underline"
    style={{
      '--d': `${index * 70}ms`,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(148,163,184,0.2)',
      boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-6px) scale(1.012)'
      e.currentTarget.style.borderColor = item.glowColor
      e.currentTarget.style.boxShadow = `0 20px 55px ${item.shadowColor}, 0 0 0 1px ${item.glowColor}`
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)'
      e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,23,42,0.06)'
    }}
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-2xl"
      style={{ background: `linear-gradient(135deg, ${item.bgGlow} 0%, transparent 70%)` }}
    />

    <div className="relative z-10">
      <div
        className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}
      >
        {item.icon}
      </div>
      <h3 className={`text-lg font-bold text-gray-900 mb-2 transition-colors ${item.hoverText}`}>
        {item.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">{item.desc}</p>
      <div className={`flex items-center font-semibold text-gray-700 text-sm ${item.hoverText}`}>
        Open resource
        <ExternalLink className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </div>
  </a>
)

/* ── Section heading ──────────────────────────────────────────────── */
const SectionHeading = ({ badge, badgeIcon, badgeColor, badgeBg, badgeBorder, title, sub }) => (
  <div className="text-center mb-10 md:mb-14">
    {badge && (
      <div
        className="inline-flex items-center gap-2 mb-4 rounded-full px-4 py-1.5 text-sm font-semibold"
        style={{
          background: badgeBg,
          border: `1px solid ${badgeBorder}`,
          color: badgeColor,
        }}
      >
        {badgeIcon}
        {badge}
      </div>
    )}
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
      {title}
    </h2>
    {sub && (
      <p className="text-slate-500 mt-3 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
        {sub}
      </p>
    )}
  </div>
)

/* ── Main component ───────────────────────────────────────────────── */
const PracticeSection = () => {
  const navigate = useNavigate()

  const practices = [
    {
      id: 'aptitude',
      title: 'Aptitude & Logic',
      desc: 'Master Quantitative, Verbal, and Logical reasoning for placement exams.',
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50',
      hoverText: 'group-hover:text-purple-600',
      glowColor: 'rgba(147,51,234,0.35)',
      shadowColor: 'rgba(147,51,234,0.12)',
      bgGlow: 'rgba(147,51,234,0.04)',
      path: '/practice/aptitude',
    },
    {
      id: 'dsa',
      title: 'DSA & Coding',
      desc: 'Solve 50 levels of Data Structures and Algorithms from Basics to Hard.',
      icon: <Code2 className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50',
      hoverText: 'group-hover:text-blue-600',
      glowColor: 'rgba(37,99,235,0.38)',
      shadowColor: 'rgba(37,99,235,0.13)',
      bgGlow: 'rgba(37,99,235,0.04)',
      path: '/practice/dsa',
    },
    {
      id: 'dev',
      title: 'Full Stack Dev',
      desc: 'Test your knowledge on React, Node.js, SQL, and System Design.',
      icon: <Laptop className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
      hoverText: 'group-hover:text-green-600',
      glowColor: 'rgba(22,163,74,0.35)',
      shadowColor: 'rgba(22,163,74,0.12)',
      bgGlow: 'rgba(22,163,74,0.04)',
      path: '/practice/dev',
    },
    {
      id: 'sql',
      title: 'SQL & Database Lab',
      desc: 'Master complex queries, joins, indexes and database design across 50 levels.',
      icon: <Database className="w-8 h-8 text-emerald-600" />,
      color: 'bg-emerald-50',
      hoverText: 'group-hover:text-emerald-600',
      glowColor: 'rgba(5,150,105,0.35)',
      shadowColor: 'rgba(5,150,105,0.12)',
      bgGlow: 'rgba(5,150,105,0.04)',
      path: '/practice/sql',
    },
  ]

  const careerItems = [
    {
      id: 'companies',
      title: 'Company Interview',
      desc: 'Practice real interview questions from top tech companies.',
      icon: <Building2 className="w-8 h-8 text-orange-600" />,
      color: 'bg-orange-50',
      hoverText: 'group-hover:text-orange-600',
      glowColor: 'rgba(234,88,12,0.35)',
      shadowColor: 'rgba(234,88,12,0.12)',
      bgGlow: 'rgba(234,88,12,0.04)',
      path: '/practice/companies',
      cta: 'Explore',
    },
    {
      id: 'study-share',
      title: 'Community Notes',
      desc: 'Share your own notes, screenshots & PDFs — help others prep.',
      icon: <BookOpen className="w-8 h-8 text-teal-600" />,
      color: 'bg-teal-50',
      hoverText: 'group-hover:text-teal-600',
      glowColor: 'rgba(13,148,136,0.35)',
      shadowColor: 'rgba(13,148,136,0.12)',
      bgGlow: 'rgba(13,148,136,0.04)',
      path: '/study-share',
      cta: 'Browse',
    },
    {
      id: 'mock-interview',
      title: 'Mock Interview AI',
      desc: 'AI-driven interview practice with real-time feedback. Pick your role and get graded.',
      icon: <Mic className="w-8 h-8 text-indigo-600" />,
      color: 'bg-indigo-50',
      hoverText: 'group-hover:text-indigo-600',
      glowColor: 'rgba(79,70,229,0.35)',
      shadowColor: 'rgba(79,70,229,0.12)',
      bgGlow: 'rgba(79,70,229,0.04)',
      path: '/mock-interview',
      cta: 'Practice Now',
    },
    {
      id: 'resume-builder',
      title: 'Resume & Portfolio',
      desc: 'Build a job-ready resume with live preview, auto-save, and PDF export.',
      icon: <FileUser className="w-8 h-8 text-rose-600" />,
      color: 'bg-rose-50',
      hoverText: 'group-hover:text-rose-600',
      glowColor: 'rgba(225,29,72,0.35)',
      shadowColor: 'rgba(225,29,72,0.12)',
      bgGlow: 'rgba(225,29,72,0.04)',
      path: '/resume-builder',
      cta: 'Build Resume',
    },
  ]

  const cpResources = [
    {
      id: 'striver-sde',
      title: "Striver's SDE Sheet",
      desc: '191 high-impact interview problems curated for top product companies.',
      href: 'https://takeuforward.org/dsa/strivers-sde-sheet-top-coding-interview-problems',
      icon: <ListChecks className="w-8 h-8 text-violet-600" />,
      color: 'bg-violet-50',
      hoverText: 'group-hover:text-violet-600',
      glowColor: 'rgba(124,58,237,0.35)',
      shadowColor: 'rgba(124,58,237,0.12)',
      bgGlow: 'rgba(124,58,237,0.04)',
    },
    {
      id: 'striver-a2z',
      title: "Striver's A2Z Sheet",
      desc: 'Complete A-to-Z roadmap with 451 problems from basics to advanced DSA.',
      href: 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z',
      icon: <Library className="w-8 h-8 text-indigo-600" />,
      color: 'bg-indigo-50',
      hoverText: 'group-hover:text-indigo-600',
      glowColor: 'rgba(79,70,229,0.35)',
      shadowColor: 'rgba(79,70,229,0.12)',
      bgGlow: 'rgba(79,70,229,0.04)',
    },
    {
      id: 'blind-75',
      title: 'Blind 75 Sheet',
      desc: 'The classic 75-question interview set widely used for focused prep.',
      href: 'https://takeuforward.org/dsa/blind-75-leetcode-problems-detailed-video-solutions',
      icon: <Target className="w-8 h-8 text-fuchsia-600" />,
      color: 'bg-fuchsia-50',
      hoverText: 'group-hover:text-fuchsia-600',
      glowColor: 'rgba(192,38,211,0.35)',
      shadowColor: 'rgba(192,38,211,0.12)',
      bgGlow: 'rgba(192,38,211,0.04)',
    },
    {
      id: 'love-babbar-450',
      title: 'Love Babbar 450 Sheet',
      desc: 'Popular 450 DSA problem list for placement revision and topic coverage.',
      href: 'https://docs.google.com/spreadsheets/d/1AwCIidxvuZ241A1g6fzJ9SuyA2sVHKd4/edit?usp=sharing&ouid=102783754980211739433&rtpof=true&sd=true',
      icon: <LayoutGrid className="w-8 h-8 text-sky-600" />,
      color: 'bg-sky-50',
      hoverText: 'group-hover:text-sky-600',
      glowColor: 'rgba(2,132,199,0.35)',
      shadowColor: 'rgba(2,132,199,0.12)',
      bgGlow: 'rgba(2,132,199,0.04)',
    },
  ]

  return (
    <>
      {/* ── Practice Arena ──────────────────────────────────────────── */}
      <div className="py-12 md:py-18 bg-transparent w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            title="Practice Arena"
            sub="Choose a track and start leveling up your skills — 50 levels per domain, completely free."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {practices.map((item, index) => (
              <Card
                key={item.id}
                item={item}
                onClick={() => navigate(item.path)}
                index={index}
              />
            ))}
          </div>

          {/* Dashboard CTA */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="shimmer-btn group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-white text-sm md:text-base"
              style={{
                background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                boxShadow: '0 0 28px rgba(37,99,235,0.45), 0 8px 22px rgba(37,99,235,0.3)',
              }}
            >
              <BarChart3 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              View Your Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <PlacementSheetsTracker />
        </div>
      </div>

      {/* ── Competitive Programming Resources ───────────────────────── */}
      <div
        className="py-12 md:py-18 w-full"
        style={{
          background:
            'linear-gradient(180deg, rgba(248,250,255,0.95) 0%, rgba(255,255,255,0.5) 100%)',
          borderTop: '1px solid rgba(148,163,184,0.18)',
          borderBottom: '1px solid rgba(148,163,184,0.12)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            badge="Most famous placement sheets"
            badgeIcon={<Medal className="w-4 h-4" />}
            badgeColor="#7c3aed"
            badgeBg="rgba(124,58,237,0.08)"
            badgeBorder="rgba(124,58,237,0.25)"
            title="Top DSA Sheets for Placements"
            sub="Handpicked high-value sheets used by most placement aspirants. Open any sheet and continue your prep track instantly."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {cpResources.map((item, index) => (
              <LinkCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Career Excellence ────────────────────────────────────────── */}
      <div className="py-12 md:py-18 w-full bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            badge="Career Excellence"
            badgeIcon={<Trophy className="w-4 h-4" />}
            badgeColor="#b45309"
            badgeBg="rgba(180,83,9,0.08)"
            badgeBorder="rgba(180,83,9,0.22)"
            title="Go Beyond the Basics"
            sub="Real interview prep and community-powered resources to land your dream job."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {careerItems.map((item, index) => (
              <Card
                key={item.id}
                item={item}
                onClick={() => navigate(item.path)}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default PracticeSection
