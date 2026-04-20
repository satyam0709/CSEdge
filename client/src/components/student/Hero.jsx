import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const PLATFORMS = [
  {
    id: 'lc',
    name: 'LeetCode',
    logo: 'https://leetcode.com/favicon.ico',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    shadow: 'shadow-amber-100',
    dot: 'bg-amber-400',
    // position & animation
    style: { top: '18%', left: '8%' },
    animation: 'float-1',
  },
  {
    id: 'gfg',
    name: 'GFG',
    logo: 'https://media.geeksforgeeks.org/gfg-gg-logo.svg',
    bg: 'bg-green-50',
    border: 'border-green-300',
    shadow: 'shadow-green-100',
    dot: 'bg-green-400',
    style: { top: '12%', right: '10%' },
    animation: 'float-2',
  },
  {
    id: 'cf',
    name: 'Codeforces',
    logo: 'https://codeforces.org/s/0/favicon-32x32.png',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    shadow: 'shadow-blue-100',
    dot: 'bg-blue-400',
    style: { top: '55%', left: '4%' },
    animation: 'float-3',
  },
  {
    id: 'cc',
    name: 'CodeChef',
    logo: 'https://www.codechef.com/favicon.ico',
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    shadow: 'shadow-orange-100',
    dot: 'bg-orange-400',
    style: { top: '60%', right: '6%' },
    animation: 'float-4',
  },
]

const Hero = () => {
  const navigate = useNavigate()
  const [pointer, setPointer] = useState({ x: 0, y: 0 })

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14
    setPointer({ x, y })
  }

  return (
    <div
      className="flex flex-col items-center justify-center w-full md:pt-32 pt-16 px-4 sm:px-6 md:px-0 space-y-6 md:space-y-7 text-center relative overflow-hidden"
      onMouseMove={handleMove}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 via-white to-transparent" />
      <div
        className="absolute -top-28 left-1/2 w-[42rem] h-[42rem] bg-blue-200/25 blur-3xl rounded-full -z-10 transition-transform duration-300 ease-out"
        style={{ transform: `translate(calc(-50% + ${pointer.x}px), ${pointer.y}px)` }}
      />

      {/* ── Floating platform boxes ─────────────────────────────────────── */}
      <style>{`
        @keyframes float-1 {
          0%,100% { transform: translate(0px,  0px) rotate(-2deg); }
          33%      { transform: translate(8px, -12px) rotate(1deg);  }
          66%      { transform: translate(-5px, 6px) rotate(-1deg);  }
        }
        @keyframes float-2 {
          0%,100% { transform: translate(0px,  0px) rotate(2deg);  }
          33%      { transform: translate(-10px, 10px) rotate(-2deg); }
          66%      { transform: translate(6px, -8px) rotate(1deg);   }
        }
        @keyframes float-3 {
          0%,100% { transform: translate(0px,  0px) rotate(1deg);  }
          40%      { transform: translate(12px, -10px) rotate(-1deg); }
          70%      { transform: translate(-4px, 8px) rotate(2deg);   }
        }
        @keyframes float-4 {
          0%,100% { transform: translate(0px,  0px) rotate(-1deg); }
          35%      { transform: translate(-8px, -14px) rotate(2deg);  }
          70%      { transform: translate(10px, 5px) rotate(-2deg);   }
        }
        .float-1 { animation: float-1 6s ease-in-out infinite; }
        .float-2 { animation: float-2 7s ease-in-out infinite; }
        .float-3 { animation: float-3 8s ease-in-out infinite; }
        .float-4 { animation: float-4 6.5s ease-in-out infinite; }
      `}</style>

      {PLATFORMS.map((p) => (
        <button
          key={p.id}
          onClick={() => navigate('/contests')}
          title={`${p.name} — View contests & POTD`}
          className={`
            absolute ${p.animation} hidden lg:flex
            flex flex-col items-center justify-center gap-1.5
            w-20 h-20 cursor-pointer rounded-2xl border-2
            ${p.bg} ${p.border} shadow-lg ${p.shadow}
            hover:scale-110 hover:shadow-xl
            transition-transform duration-200 z-10
          `}
          style={p.style}
        >
          {/* Live pulse */}
          <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${p.dot} animate-pulse`} />

          {/* Logo */}
          <img
            src={p.logo}
            alt={p.name}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          {/* Fallback */}
          <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 font-black text-xs items-center justify-center hidden">
            {p.id.toUpperCase()}
          </div>

          {/* Name */}
          <span className="text-[10px] font-bold text-gray-400 leading-none tracking-wide">
            {p.name}
          </span>
        </button>
      ))}

      {/* ── Main heading ─────────────────────────────────────────────────── */}
      <h1 className="relative font-extrabold text-gray-900 max-w-4xl text-3xl sm:text-4xl md:text-6xl mx-auto leading-tight">
        Build Skills Faster.
        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
          Prepare with Confidence. Get Placement Ready.
        </span>
        <img
          src={assets.sketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-7 right-0 opacity-80"
        />
      </h1>

      <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed px-1">
        One focused workspace for coding practice, mock interviews, guided courses, and real placement preparation.
      </p>

    </div>
  )
}

export default Hero