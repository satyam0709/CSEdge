import React, { useContext } from 'react'
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

  const becomeEducator = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${backendUrl}/api/educator/update-role`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setIsEducator(true)
        try {
          await user?.reload()
        } catch (e) {
          console.warn('Clerk user reload after role update:', e)
        }
        toast.success(data.message)
      } else {
        toast.error(data.message || 'Unable to update educator role')
      }
    } catch (error) {
      console.error('Become educator error:', error)
      toast.error('Unable to update educator role') 
    }
  }

  return (
    <div className='flex items-center justify-between py-3 px-4 sm:px-8 md:px-12 lg:px-24 border-b border-slate-200/80 bg-white/90 sticky top-0 z-50 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-lg'>

      <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
        <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='w-28 lg:w-32 cursor-pointer shrink-0' />
        {showHomeButton && (
          <Link
            to='/'
            className='text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-full px-3 py-1.5 hover:bg-slate-50 transition whitespace-nowrap shrink-0'
          >
            Home
          </Link>
        )}
      </div>

      <div className='hidden md:flex items-center gap-5 text-slate-500'>

        <div className='flex items-center gap-4'>

          {user ?
            <div className='flex items-center gap-4'>

              <Link to='/my-enrollments' className='text-slate-500 hover:text-slate-900 transition font-medium'>My Enrollments</Link>

              <button onClick={isEducator ? () => navigate('/educator') : becomeEducator} className='flex items-center gap-2 border border-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-50 hover:border-slate-400 transition font-medium'>

                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                <img src={assets.user_icon} alt="" className='w-4 h-4' />

              </button>

              <UserButton />

            </div>
            : (
              <>
                <button type='button' onClick={() => navigate('/login')} className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full hover:from-blue-700 hover:to-indigo-700 transition shadow-md hover:shadow-lg'>Login</button>
              </>
            )}

        </div>

      </div>

      <div className='flex items-center gap-2 sm:gap-3 md:hidden'>

        {user ? (
          <>
            <nav className='flex items-center gap-1.5 text-xs text-gray-600 mr-1 overflow-x-auto max-w-[66vw] no-scrollbar' aria-label='Account'>
              {showHomeButton && (
                <Link to='/' className='whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 transition'>
                  Home
                </Link>
              )}
              <Link to='/my-enrollments' className='whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition'>My Enrollments</Link>
              <Link to='/study-share' className='whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition'>Study hub</Link>
              {isEducator ? (
                <Link to='/educator' className='whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700 hover:border-blue-300 hover:text-blue-700 transition'>Educator</Link>
              ) : (
                <button
                  type='button'
                  onClick={becomeEducator}
                  className='whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-left text-slate-700 hover:border-blue-300 hover:text-blue-700 transition'
                >
                  Educator
                </button>
              )}
            </nav>
            <UserButton />
          </>
        ) : (
          <div className='flex items-center gap-2'>
            <button type='button' onClick={() => navigate('/login')} aria-label='Login' className='cursor-pointer'>
              <img src={assets.user_icon} alt="" />
            </button>
          </div>
        )}

      </div>

    </div>
  )
}

export default Navbar