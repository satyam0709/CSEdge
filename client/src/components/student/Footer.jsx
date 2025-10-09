import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-while/30'>

        {/* Logo + Text Section */}
        <div className='flex flex-col md:items-start text-center w-full'>
          <img src={assets.logo_dark} alt='logo' className='w-28 lg:w-32 cursor-pointer' />
          <p className='mt-6 text-center md:text-left text-gray-300 max-w-md'>
            Learn. Grow. Succeed. Your journey starts here.
          </p>
        </div>

        {/* Company Links Section */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>
            Company
          </h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href='#' className='hover:text-white transition'>Home</a></li>
            <li><a href='#' className='hover:text-white transition'>About Us</a></li>
            <li><a href='#' className='hover:text-white transition'>Contact</a></li>
            <li><a href='#' className='hover:text-white transition'>Privacy Policy</a></li>
          </ul>
        </div>

        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>
            Subscribe to our Newsletter
            </h2>
            <p className='text-sm text-white/80'>
              Stay updated with the latest courses, offers, and news.
            </p>
            <div className="flex items-center gap-2 pt-4">
              <input type="email" placeholder='Enter your email' 
              className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500
                outline-none w-64 h-9 rounded px-2 text-sm'
              />
              <button className='bg-blue-600 w-24 h-9 text-white rounded'>Subscribe</button>
            </div>
              
        </div>

      </div>

      <p className='text-white/60 text-sm text-center'>
        &copy; {new Date().getFullYear()} CodeSprint. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
