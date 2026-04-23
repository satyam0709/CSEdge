import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3000)
  }

  const NAV_LINKS = [
    { label: 'Home',          to: '/' },
    { label: 'Courses',       to: '/course-list' },
    { label: 'DSA Practice',  to: '/practice/dsa' },
    { label: 'My Enrollments',to: '/my-enrollments' },
    { label: 'Mock Interview', to: '/mock-interview' },
    { label: 'Study Hub',     to: '/study-share' },
  ]

  const SOCIALS = [
    {
      label: 'GitHub',
      href: 'https://github.com/CSEdge',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/company/csedge',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: 'Twitter/X',
      href: 'https://twitter.com/CSEdge_Learn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.907-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com/@CSEdge',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="w-full mt-10 md:mt-14">
      <div className="ui-section-wrap">
        <div
          className="rounded-3xl overflow-hidden text-left relative"
          style={{
            background:
              'linear-gradient(160deg, #010610 0%, #040c1e 35%, #060f26 65%, #020810 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow:
              '0 30px 70px rgba(2,8,20,0.8), 0 0 0 1px rgba(59,130,246,0.08)',
          }}
        >
          {/* ── Background glow orbs ─────────────────────────────── */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute"
              style={{
                width: 400, height: 400,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
                top: -100, left: -80,
                animation: 'orbFloat1 12s ease-in-out infinite',
              }}
            />
            <div
              className="absolute"
              style={{
                width: 300, height: 300,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)',
                bottom: -80, right: -50,
                animation: 'orbFloat2 16s ease-in-out infinite',
              }}
            />
          </div>

          {/* ── Top glow line ─────────────────────────────────────── */}
          <div
            className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(59,130,246,0.5), rgba(99,102,241,0.45), transparent)',
            }}
          />

          {/* ── Main content ──────────────────────────────────────── */}
          <div className="relative z-10 flex flex-col md:flex-row items-start px-6 sm:px-8 md:px-10 lg:px-12 justify-between gap-10 md:gap-16 py-10 md:py-14 border-b border-white/[0.08]">

            {/* Logo + tagline */}
            <div className="flex flex-col items-start w-full max-w-xs">
              <img
                src={assets.logo_dark}
                alt="CSEdge logo"
                className="w-28 lg:w-32 cursor-pointer hover:opacity-80 transition-opacity"
              />
              <p className="mt-5 text-slate-400 leading-relaxed text-sm">
                Learn. Grow. Succeed.{' '}
                <span
                  className="gradient-text-animate font-semibold"
                  style={{ fontSize: 'inherit' }}
                >
                  Your journey starts here.
                </span>
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3 mt-6">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(148,163,184,0.8)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(37,99,235,0.25)'
                      e.currentTarget.style.borderColor = 'rgba(59,130,246,0.45)'
                      e.currentTarget.style.color = '#93c5fd'
                      e.currentTarget.style.boxShadow = '0 0 14px rgba(37,99,235,0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                      e.currentTarget.style.color = 'rgba(148,163,184,0.8)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col items-start w-full">
              <h2
                className="font-bold mb-5 tracking-widest uppercase text-xs"
                style={{ color: 'rgba(148,163,184,0.6)' }}
              >
                Platform
              </h2>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 md:flex md:flex-col md:gap-3 w-full text-sm">
                {NAV_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-slate-400 hover:text-white transition-colors duration-200 font-medium group flex items-center gap-1.5"
                    >
                      <span
                        className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="hidden md:flex flex-col items-start w-full max-w-sm">
              <h2
                className="font-bold mb-2 tracking-widest uppercase text-xs"
                style={{ color: 'rgba(148,163,184,0.6)' }}
              >
                Newsletter
              </h2>
              <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                Stay updated with the latest courses, contests, and placement tips.
              </p>

              {subscribed ? (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold"
                  style={{
                    background: 'rgba(34,197,94,0.12)',
                    border: '1px solid rgba(34,197,94,0.3)',
                    color: '#4ade80',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Subscribed! Thanks 🎉
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 h-10 rounded-xl px-4 text-sm outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.14)',
                      color: '#e2e8f0',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(59,130,246,0.5)'
                      e.target.style.boxShadow = '0 0 0 2px rgba(37,99,235,0.15)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.14)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="submit"
                    className="shimmer-btn h-10 px-4 rounded-xl text-sm font-bold text-white whitespace-nowrap"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                      boxShadow: '0 0 16px rgba(37,99,235,0.4)',
                    }}
                  >
                    Subscribe
                  </button>
                </form>
              )}

              {/* Feature highlights */}
              <div className="flex flex-col gap-2 mt-6">
                {[
                  '⚡ DSA · Aptitude · SQL · Full Stack tracks',
                  '🤖 AI-powered mock interview simulator',
                  '🏆 Company-wise coding archives',
                ].map((f) => (
                  <span key={f} className="text-xs text-slate-500 flex items-start gap-1">{f}</span>
                ))}
              </div>
            </div>

          </div>

          {/* ── Bottom bar ───────────────────────────────────────────── */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 sm:px-8 md:px-10 lg:px-12 py-5">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} CSEdge. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span
                className="flex items-center gap-1.5"
                style={{ color: 'rgba(100,116,139,0.75)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                  style={{ boxShadow: '0 0 5px #34d399' }}
                />
                All systems operational
              </span>
              <span style={{ color: 'rgba(100,116,139,0.4)' }}>·</span>
              <span style={{ color: 'rgba(100,116,139,0.75)' }}>
                Built with ❤️ for students
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
