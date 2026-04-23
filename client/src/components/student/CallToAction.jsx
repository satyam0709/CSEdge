import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

/* Generate deterministic star positions once */
function genStars(n) {
  const stars = []
  for (let i = 0; i < n; i++) {
    stars.push({
      top:     `${((i * 137.508) % 100).toFixed(2)}%`,
      left:    `${((i * 73.861) % 100).toFixed(2)}%`,
      dur:     `${2.2 + ((i * 1.618) % 3.5).toFixed(2)}s`,
      delay:   `${((i * 0.577) % 2.5).toFixed(2)}s`,
      size:    i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
      opacity: 0.2 + ((i * 0.137) % 0.7),
    })
  }
  return stars
}

const CallToAction = () => {
  const navigate = useNavigate()
  const stars = useMemo(() => genStars(80), [])

  return (
    <div
      className="relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden my-8 md:my-10"
      style={{
        background:
          'linear-gradient(155deg, #020917 0%, #060e22 35%, #0a1535 65%, #040b1c 100%)',
        border: '1px solid rgba(59,130,246,0.2)',
        boxShadow:
          '0 0 0 1px rgba(59,130,246,0.12), 0 40px 80px rgba(2,9,23,0.7), 0 0 60px rgba(37,99,235,0.12)',
      }}
    >
      {/* ── Star field ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((s, i) => (
          <div
            key={i}
            className="star-item"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              '--dur': s.dur,
              '--delay': s.delay,
            }}
          />
        ))}
      </div>

      {/* ── Background orbs ────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute"
          style={{
            width: 500, height: 500,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(37,99,235,0.28) 0%, transparent 70%)',
            top: -150, left: -100,
            animation: 'orbFloat1 10s ease-in-out infinite',
          }}
        />
        <div
          className="absolute"
          style={{
            width: 400, height: 400,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
            bottom: -100, right: -80,
            animation: 'orbFloat2 13s ease-in-out infinite',
          }}
        />
        <div
          className="absolute"
          style={{
            width: 250, height: 250,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)',
            top: '40%', right: '25%',
            filter: 'blur(10px)',
          }}
        />
      </div>

      {/* ── Dot grid overlay ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(rgba(96,165,250,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 50% 50%, black 20%, transparent 100%)',
        }}
      />

      {/* ── Glowing top line ───────────────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(59,130,246,0.6), rgba(99,102,241,0.6), transparent)',
        }}
      />

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-10 md:px-16 py-14 md:py-20 space-y-6">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
          style={{
            background: 'rgba(37,99,235,0.18)',
            border: '1px solid rgba(59,130,246,0.38)',
            color: '#93c5fd',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
            style={{ boxShadow: '0 0 6px #34d399' }}
          />
          Start your journey today
        </div>

        {/* Heading */}
        <h1
          className="font-black max-w-3xl text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] leading-tight"
          style={{ color: '#f0f6ff' }}
        >
          Ready to Elevate Your{' '}
          <span className="gradient-text-animate">Learning Journey?</span>
        </h1>

        {/* Sub text */}
        <p
          className="max-w-xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed"
          style={{ color: 'rgba(148,163,184,0.88)' }}
        >
          Join CSEdge and unlock your potential with expert-led courses,
          guided practice tracks, and placement-focused resources —{' '}
          <span style={{ color: '#93c5fd' }}>completely free</span>.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 py-1">
          {[
            '🚀 50+ Practice Levels',
            '🤖 AI Mock Interviews',
            '📄 Resume Builder',
            '🏆 Company Archives',
          ].map((f) => (
            <span
              key={f}
              className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(203,213,225,0.9)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/course-list')}
            className="shimmer-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-white text-sm sm:text-base"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
              boxShadow:
                '0 0 32px rgba(37,99,235,0.55), 0 10px 28px rgba(37,99,235,0.38)',
            }}
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#e2e8f0',
              backdropFilter: 'blur(12px)',
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
            View Dashboard
            <img src={assets.arrow_icon} alt="" className="w-4 h-4 invert opacity-70" />
          </button>
        </div>

        {/* Bottom glow line */}
        <div
          className="w-full max-w-xs mt-2"
          style={{
            height: 1,
            background:
              'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), rgba(99,102,241,0.45), transparent)',
          }}
        />
      </div>
    </div>
  )
}

export default CallToAction
