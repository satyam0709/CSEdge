import React from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const CallToAction = () => {
  const navigate = useNavigate()

  return (
    <div className='w-full max-w-7xl mx-auto rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900 px-6 md:px-12 py-14 md:py-16 my-10 shadow-[0_18px_45px_rgba(37,99,235,0.15)] relative overflow-hidden'>
      <style>{`
        @keyframes cta-float-a {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.45; }
          50% { transform: translate(-12px, 8px) scale(1.08); opacity: 0.7; }
        }
        @keyframes cta-float-b {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
          50% { transform: translate(10px, -12px) scale(1.12); opacity: 0.65; }
        }
        @keyframes cta-shimmer {
          0%, 100% { opacity: 0.14; }
          50% { opacity: 0.28; }
        }
      `}</style>
      <div
        className='absolute -top-12 -right-8 w-44 h-44 rounded-full bg-blue-300/30 blur-2xl pointer-events-none'
        style={{ animation: 'cta-float-a 7.5s ease-in-out infinite' }}
      />
      <div
        className='absolute -bottom-16 -left-10 w-52 h-52 rounded-full bg-indigo-300/25 blur-2xl pointer-events-none'
        style={{ animation: 'cta-float-b 8.5s ease-in-out infinite' }}
      />
      <div
        className='absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-blue-200/30 to-transparent'
        style={{ animation: 'cta-shimmer 5.5s ease-in-out infinite' }}
      />
      <div className='flex flex-col items-center space-y-7 text-center gap-3'>
        <h1 className='md:text-big text-small relative font-extrabold max-w-3xl text-4xl md:text-5xl mx-auto leading-tight'>
          Ready to Elevate Your Learning Journey?
        </h1>
        <p className='text-slate-600 max-w-xl mx-auto text-lg md:text-xl leading-relaxed'>
          Join us today and unlock your potential with expert-led courses, guided practice tracks, and placement-focused resources.
        </p>
        <div className='flex flex-wrap items-center justify-center gap-4 mt-4 font-medium text-base'>
          <button
            type='button'
            onClick={() => navigate('/course-list')}
            className='btn-base btn-primary px-8 py-3'
          >
            Get started
          </button>
          <button
            type='button'
            onClick={() => navigate('/dashboard')}
            className='btn-base rounded-full border border-blue-200 bg-white px-7 py-3 text-blue-700 hover:bg-blue-50'
          >
            Learn More <img src={assets.arrow_icon} alt='arrow icon' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CallToAction