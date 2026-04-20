import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='w-full mt-10 md:mt-14'>
      <div className='ui-section-wrap'>
        <div className='bg-slate-950 text-left rounded-3xl overflow-hidden border border-slate-800 shadow-[0_18px_45px_rgba(2,6,23,0.45)]'>
      <div className='flex flex-col md:flex-row items-start px-6 sm:px-8 md:px-10 lg:px-12 justify-between gap-10 md:gap-16 py-12 border-b border-white/15'>

        {/* Logo + Text Section */}
        <div className='flex flex-col md:items-start text-center w-full max-w-md'>
          <img src={assets.logo_dark} alt='logo' className='w-28 lg:w-32 cursor-pointer' />
          <p className='mt-6 text-center md:text-left text-slate-300 max-w-md leading-relaxed'>
            Learn. Grow. Succeed. Your journey starts here.
          </p>
        </div>

        {/* Company Links Section */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5 tracking-wide'>
            Company
          </h2>
          <ul className='grid grid-cols-2 gap-x-8 gap-y-2 md:flex md:flex-col w-full text-sm text-white/80 md:space-y-2'>
            <li><Link to='/' className='hover:text-white transition'>Home</Link></li>
            <li><Link to='/course-list' className='hover:text-white transition'>Courses</Link></li>
            <li><Link to='/practice/dsa' className='hover:text-white transition'>DSA Practice</Link></li>
            <li><Link to='/my-enrollments' className='hover:text-white transition'>My Enrollments</Link></li>
          </ul>
        </div>

        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5 tracking-wide'>
            Subscribe to our Newsletter
            </h2>
            <p className='text-sm text-white/80'>
              Stay updated with the latest courses, offers, and news.
            </p>
            <div className="flex items-center gap-2 pt-4">
              <input type="email" placeholder='Enter your email' 
              className='border border-white/20 bg-slate-900/80 text-slate-300 placeholder-slate-500
                outline-none w-64 h-10 rounded-lg px-3 text-sm focus:border-blue-400'
              />
              <button className='bg-blue-600 w-24 h-10 text-white rounded-lg hover:bg-blue-700 transition'>Subscribe</button>
            </div>
              
        </div>

      </div>

      <p className='text-white/60 text-sm text-center py-5'>
        &copy; {new Date().getFullYear()} CSEdge. All rights reserved.
      </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
