import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const SearchBar = ({ data }) => {
  const navigate = useNavigate()
  const [input, setInput] = useState(data ? data : '')

  const onSearchHandler = e => {
    e.preventDefault()
    navigate('/course-list/' + input)
  }

  return (
    <form onSubmit={onSearchHandler} className='flex items-center gap-2'>
      <div className='relative flex items-center'>
        <img
          src={assets.search_icon}
          alt='search-icon'
          className='absolute left-3 w-5 h-5 md:w-6 md:h-6'
        />
        <input
          onChange={e => setInput(e.target.value)}
          value={input}
          type='text'
          placeholder='Search for courses, topics, or keywords'
          className='border border-gray-300 rounded-full pl-10 md:pl-12 pr-4 py-2 w-64 md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>
      <button
        type='submit'
        className='bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300'
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar
