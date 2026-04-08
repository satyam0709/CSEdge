import React from 'react'
import { Link } from 'react-router-dom'
import { useUser, UserButton } from '@clerk/clerk-react'
import { assets } from '../../assets/assets'
const Navbar = () => {
  const { user } = useUser();
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to='/'>
        <img src={assets.logo} alt="Logo" className='w-28 lg:w-32'/>
      </Link>
      <div className='flex items-center gap-3 sm:gap-5 text-gray-500 relative flex-wrap justify-end'>
        <nav className='flex items-center gap-2 sm:gap-3 text-xs sm:text-sm'>
          <Link
            to='/'
            className='font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-full px-3 py-1.5 hover:bg-gray-50 whitespace-nowrap'
          >
            Home
          </Link>
          <span className='text-gray-300' aria-hidden>|</span>
          <Link to='/my-enrollments' className='hover:text-gray-800 whitespace-nowrap'>My Enrollments</Link>
          <span className='text-gray-300' aria-hidden>|</span>
          <Link to='/educator' className='hover:text-gray-800 whitespace-nowrap'>Educator</Link>
        </nav>
        <p className='text-sm'>
          Hi! {user ? user.fullName : 'Developer'}
        </p>
        {user ? <UserButton/> : <img className='max-w-8' src={assets.profile_img}></img>}
      </div>
    </div>
  )
}

export default Navbar