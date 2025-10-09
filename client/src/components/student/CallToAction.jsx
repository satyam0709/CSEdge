import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center my-10 gap-4 pt-10 pb-24 '>
      <h1 className='md:text-big text-small relative font-bold text-gray-800 max-w-3xl  text-5xl mx-auto'>
        Ready to Elevate Your Learning Journey?
      </h1>
      <p className=' text-gray-500 max-w-sm mx-auto text-xl'>
        Join us today and unlock your potential with our expert-led courses and resources.
      </p>
      <div className='flex items-center gap-5 mt-4 font-medium text-lg'>
        <button className='px-10 py-3 rounded-md tex-while bg-blue-500'>Get started</button>
        <button className='flex items-center gap-2'>Learn More <img src={assets.arrow_icon}></img> </button>
      </div>
    </div>
  )
}

export default CallToAction