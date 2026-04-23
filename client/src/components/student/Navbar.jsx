import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isEducator, setIsEducator, backendUrl, getToken } = useContext(AppContext)
  const showHomeButton = pathname === '/my-enrollments'

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const becomeEducator = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        `${backendUrl}/api/educator/update-role`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setIsEducator(true)
        try { await user?.reload() } catch (e) { console.warn(e) }
        toast.success(data.message)
      } else {
        toast.error(data.message || 'Unable to update educator role')
      }
    } catch (error) {
      console.error('Become educator error:', error)
      toast.error('Unable to update educator role')
    }
  }

  /* ── Scroll-aware classes ─────────────────────────────────────── */
  const navBg = scrolled
    ? 'bg-white/95 border-slate-200/70 shadow-[0_4px_24px_rgba(15,23,42,0.1)]'
    : 'bg-[rgba(4,12,30,0.42)] border-white/[0.07] shadow-none'

  const logoSrc = scrolled ? assets.logo : assets.logo_dark

  const linkCls = scrolled
    ? 'text-slate-500 hover:text-slate-900 transition font-medium'
    : 'text-white/75 hover:text-white transition font-medium'

  const educatorBtnCls = scrolled
    ? 'flex items-center gap-2 border border-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-50 hover:border-slate-400 transition font-medium text-slate-600'
    : 'flex items-center gap-2 border border-white/25 px-3 py-1.5 rounded-full hover:bg-white/10 transition font-medium text-white/80'

  return (
    <div
      className={`flex items-center justify-between py-3 px-4 sm:px-8 md:px-12 lg:px-24 border-b sticky top-0 z-50 backdrop-blur-xl transition-all duration-500 ${navBg}`}
    >

      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <img
          onClick={() => navigate('/')}
          src={logoSrc}
          alt="CSEdge logo"
          className="w-28 lg:w-32 cursor-pointer shrink-0 transition-all duration-500 hover:opacity-85 hover:scale-[1.03]"
        />
        {showHomeButton && (
          <Link
            to="/"
            className={`text-sm font-medium border rounded-full px-3 py-1.5 transition whitespace-nowrap shrink-0 ${
              scrolled
                ? 'text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
                : 'text-white/75 hover:text-white border-white/20 hover:bg-white/10'
            }`}
          >
            Home
          </Link>
        )}
      </div>

      {/* ── Desktop nav ───────────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-5">
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/my-enrollments" className={linkCls}>
                My Enrollments
              </Link>

              <button
                onClick={isEducator ? () => navigate('/educator') : becomeEducator}
                className={educatorBtnCls}
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                <img
                  src={assets.user_icon}
                  alt=""
                  className={`w-4 h-4 ${scrolled ? '' : 'invert'}`}
                />
              </button>

              <UserButton />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="shimmer-btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full font-semibold shadow-md"
              style={{ boxShadow: '0 0 18px rgba(37,99,235,0.45), 0 4px 12px rgba(37,99,235,0.3)' }}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile nav ────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3 md:hidden min-w-0">
        {user ? (
          <>
            <nav
              className="flex items-center gap-1.5 text-[11px] text-gray-600 mr-1 overflow-x-auto max-w-[62vw] no-scrollbar"
              aria-label="Account"
            >
              {showHomeButton && (
                <Link
                  to="/"
                  className={`whitespace-nowrap rounded-full border px-2.5 py-1 font-medium transition ${
                    scrolled
                      ? 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
                      : 'border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  Home
                </Link>
              )}
              <Link
                to="/my-enrollments"
                className={`whitespace-nowrap rounded-full border px-2 py-1 transition ${
                  scrolled
                    ? 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
                    : 'border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                Enrollments
              </Link>
              <Link
                to="/study-share"
                className={`whitespace-nowrap rounded-full border px-2.5 py-1 transition ${
                  scrolled
                    ? 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
                    : 'border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                Study hub
              </Link>
              {isEducator ? (
                <Link
                  to="/educator"
                  className={`whitespace-nowrap rounded-full border px-2.5 py-1 transition ${
                    scrolled
                      ? 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
                      : 'border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  Educator
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={becomeEducator}
                  className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-left transition ${
                    scrolled
                      ? 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
                      : 'border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  Educator
                </button>
              )}
            </nav>
            <UserButton />
          </>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              aria-label="Login"
              className="cursor-pointer"
            >
              <img
                src={assets.user_icon}
                alt=""
                className={scrolled ? '' : 'invert'}
              />
            </button>
          </div>
        )}
      </div>

    </div>
  )
}

export default Navbar
