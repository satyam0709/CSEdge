import React from 'react'
import { assets } from '../../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7
                    text-center bg-gradient-to-b bg-white'>


  <h1 className='md:text-big text-small relative font-bold text-gray-800 max-w-3xl  text-5xl mx-auto'>
        Learn Smart.
        <span className='text-blue-600 text-5xl'>Prepare Right. Succeed Big </span>
        <img src={assets.sketch} alt="sketch" className='md:block hidden absolute-bottom-7 right-0' />
      </h1>
      {/* <p className='md:block hidden text-gray-500 max-w-xl text-2xl mx-auto'>
        Learn. Practice. Succeed. Comprehensive courses for computer science mastery and competitive exam preparation all in one place.
      </p> */}
      <p className=' text-gray-500 max-w-sm mx-auto text-xl'>
        We bring everything together to help you achieve your personal and professional goals.
      </p>
        <SearchBar/>
    </div>
  )
}

export default Hero