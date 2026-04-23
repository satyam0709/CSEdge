import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const PLATFORMS = [
  {
    id: 'lc',
    name: 'LeetCode',
    logo: 'https://leetcode.com/favicon.ico',
    style: { top: '28%', left: '4%' },
    floatClass: 'float-1',
    glowColor: 'rgba(251,191,36,0.45)',
    accentColor: '#fbbf24',
    label: 'POTD Live',
  },
  {
    id: 'gfg',
    name: 'GFG',
    logo: 'https://media.geeksforgeeks.org/gfg-gg-logo.svg',
    style: { top: '20%', right: '5%' },
    floatClass: 'float-2',
    glowColor: 'rgba(34,197,94,0.45)',
    accentColor: '#22c55e',
    label: 'Practice',
  },
  {
    id: 'cf',
    name: 'Codeforces',
    logo: 'https://codeforces.org/s/0/favicon-32x32.png',
    style: { top: '62%', left: '3%' },
    floatClass: 'float-3',
    glowColor: 'rgba(59,130,246,0.45)',
    accentColor: '#60a5fa',
    label: 'Contests',
  },
  {
    id: 'cc',
    name: 'CodeChef',
    logo: 'https://www.codechef.com/favicon.ico',
    style: { top: '65%', right: '4%' },
    floatClass: 'float-4',
    glowColor: 'rgba(249,115,22,0.45)',
    accentColor: '#f97316',
    label: 'Compete',
  },
]

const Hero = () => {
  const navigate = useNavigate()
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 28
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 28
    setPointer({ x, y })
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: 'calc(100vh - 0px)',
        background:
          'linear-gradient(165deg, #010812 0%, #040d20 28%, #070f28 55%, #030918 82%, #010610 100%)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
    >

      {/* ── Background orbs (pointer-events-none layer) ──────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="hero-orb-1 absolute"
          style={{
            width: 720, height: 720,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(37,99,235,0.42) 0%, rgba(37,99,235,0.12) 40%, transparent 70%)',
            top: -220, left: -230,
            transform: `translate(${pointer.x * 0.55}px, ${pointer.y * 0.55}px)`,
            transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        <div
          className="hero-orb-2 absolute"
          style={{
            width: 620, height: 620,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(99,102,241,0.38) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)',
            top: '5%', right: -180,
            transform: `translate(${-pointer.x * 0.38}px, ${pointer.y * 0.38}px)`,
            transition: 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        <div
          className="hero-orb-3 absolute"
          style={{
            width: 480, height: 480,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(14,165,233,0.07) 45%, transparent 70%)',
            bottom: '2%', left: '22%',
            transform: `translate(${pointer.x * 0.22}px, ${-pointer.y * 0.22}px)`,
            transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        <div
          className="absolute"
          style={{
            width: 300, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
            bottom: '18%', right: '12%',
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* ── Dot grid ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(96,165,250,0.13) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage:
            'radial-gradient(ellipse 85% 65% at 50% 55%, black 35%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 65% at 50% 55%, black 35%, transparent 100%)',
        }}
      />

      {/* ── Horizontal glow stripe ────────────────────────────────── */}
      <div
        className="absolute w-full pointer-events-none"
        style={{
          height: 1,
          top: '52%',
          background:
            'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), rgba(99,102,241,0.3), transparent)',
        }}
      />

      {/* ── Floating platform badges — z-30 so they stay clickable ── */}
      {PLATFORMS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => navigate('/contests')}
          title={`${p.name} — View contests & POTD`}
          className={`${p.floatClass} hidden lg:flex absolute flex-col items-center gap-1.5 cursor-pointer rounded-2xl transition-all duration-200 hover:scale-110 hover:brightness-125`}
          style={{
            ...p.style,
            zIndex: 30,
            width: 72, height: 72,
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid rgba(255,255,255,0.16)`,
            boxShadow: `0 0 20px ${p.glowColor}, 0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)`,
            justifyContent: 'center',
          }}
        >
          {/* Live pulse dot */}
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
            style={{
              background: p.accentColor,
              boxShadow: `0 0 7px ${p.accentColor}`,
            }}
          />

          {/* Logo */}
          <img
            src={p.logo}
            alt={p.name}
            className="w-7 h-7 object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />

          {/* Platform name */}
          <span
            className="text-[9px] font-bold leading-none tracking-wider"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            {p.name}
          </span>

          {/* Label chip */}
          <span
            className="text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-none"
            style={{
              background: `${p.accentColor}22`,
              color: p.accentColor,
              border: `1px solid ${p.accentColor}44`,
            }}
          >
            {p.label}
          </span>
        </button>
      ))}

      {/* ── Main content — z-20, sits above orbs but below badges ── */}
      <div
        className="relative flex flex-col items-center text-center px-4 sm:px-6 pt-24 md:pt-36 pb-20 md:pb-28 space-y-7 md:space-y-8"
        style={{ zIndex: 20 }}
      >

        {/* Badge */}
        <div className="hero-badge">
          <span
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-semibold tracking-wide select-none"
            style={{
              background: 'rgba(37,99,235,0.16)',
              border: '1px solid rgba(59,130,246,0.38)',
              color: '#93c5fd',
              backdropFilter: 'blur(14px)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
              style={{ boxShadow: '0 0 8px #34d399' }}
            />
            CSEdge — Your Placement Partner
            <span
              className="px-2 py-0.5 rounded-md text-[11px] font-black tracking-wider"
              style={{ background: 'rgba(37,99,235,0.45)', color: '#bfdbfe' }}
            >
              FREE
            </span>
          </span>
        </div>

        {/* Headline */}
        <div className="hero-headline relative">
          <h1 className="font-black max-w-5xl text-[2.6rem] sm:text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.07] tracking-tight">
            <span style={{ color: '#f0f6ff' }}>Build Skills Faster.</span>
            <span className="block mt-2 gradient-text-animate">
              Get Placement Ready.
            </span>
          </h1>
          <img
            src={assets.sketch}
            alt=""
            aria-hidden="true"
            className="hidden md:block absolute -bottom-7 right-0"
            style={{
              opacity: 0.22,
              filter: 'invert(1) brightness(3) hue-rotate(190deg)',
            }}
          />
        </div>

        {/* Subtext */}
        <p
          className="hero-sub max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed"
          style={{ color: 'rgba(148,163,184,0.88)' }}
        >
          One focused workspace for coding practice, mock interviews,
          guided courses, and real placement preparation — all for free.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/course-list')}
            className="shimmer-btn group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-white text-sm sm:text-base"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
              boxShadow: '0 0 30px rgba(37,99,235,0.55), 0 10px 28px rgba(37,99,235,0.38)',
            }}
          >
            Start Learning Free
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <button
            onClick={() => navigate('/practice/dsa')}
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.058)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#e2e8f0',
              backdropFilter: 'blur(14px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(96,165,250,0.45)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Practice DSA
            <svg
              className="w-4 h-4 opacity-75"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </button>
        </div>

        {/* Feature row — replaces fake stats */}
        <div className="hero-stats flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-1">
          {[
            { icon: '⚡', text: 'DSA + Aptitude + SQL Tracks' },
            { icon: '🤖', text: 'AI Mock Interviews' },
            { icon: '📄', text: 'Resume Builder' },
            { icon: '🏆', text: 'Company Archives' },
          ].map((f) => (
            <span
              key={f.text}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium"
              style={{
                background: 'rgba(255,255,255,0.055)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(203,213,225,0.85)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span>{f.icon}</span>
              {f.text}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div
          className="w-full max-w-sm"
          style={{
            height: 1,
            background:
              'linear-gradient(90deg, transparent, rgba(59,130,246,0.45), rgba(99,102,241,0.4), transparent)',
          }}
        />

        {/* Scroll indicator */}
        <div
          className="hero-scroll-indicator flex flex-col items-center gap-2"
          style={{ color: 'rgba(100,116,139,0.7)' }}
        >
          <span className="text-[10px] tracking-[0.14em] uppercase font-medium">Scroll to explore</span>
          <div
            className="w-6 h-9 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: '1.5px solid rgba(100,116,139,0.35)' }}
          >
            <div
              className="w-1.5 h-2 rounded-full bg-blue-400"
              style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
            />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Hero
