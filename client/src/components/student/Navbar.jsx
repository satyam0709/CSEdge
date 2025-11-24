import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const { isEducator, setIsEducator, backendUrl, getToken } = useContext(AppContext)

  const becomeEducator = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${backendUrl}/api/educator/update-role`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (data.success) {
        setIsEducator(true)
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
    <div className='flex items-center justify-between py-3 px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10'>

      <img onClick={() => navigate('/')} src={assets.logo} alt="logo" className='w-28 lg:w-32 cursor-pointer' />

      <div className='hidden md:flex items-center gap-5 text-gray-500'>

        <div className='flex items-center gap-4'>

          {user ?
            <div className='flex items-center gap-4'>

              <Link to='/my-enrollments' className='text-gray-500 hover:text-gray-700 transition'>My Enrollments</Link>

              <button onClick={isEducator ? () => navigate('/educator') : becomeEducator} className='flex items-center gap-2 border border-gray-500/30 px-3 py-1.5 rounded-full hover:bg-gray-50 transition'>

                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
                <img src={assets.user_icon} alt="" className='w-4 h-4' />

              </button>

              <UserButton />

            </div>
            : <button onClick={() => navigate('/login')} className='bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition'>Login</button>}

        </div>

      </div>

      <div className='flex items-center gap-2 sm:gap-3 md:hidden'>

        {user ? <UserButton /> : <button onClick={() => navigate('/login')}><img src={assets.user_icon} alt="" /></button>}

      </div>

    </div>
  )
}

export default Navbar