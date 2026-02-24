import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext)

  return (
    <div className='py-16 md:px-40 px-8'>
      {/* Heading — centered */}
      <h2 className='text-3xl font-semibold text-gray-800 text-center'>
        Some Best Suggested Courses
      </h2>

      {/* Sub-description — centered */}
      <p className='text-sm md:text-base text-gray-400 mt-3 text-center max-w-2xl mx-auto'>
        Explore our top recommended courses designed to enhance your skills and
        knowledge. Whether you're looking to advance your career or learn
        something new, these courses offer valuable insights and practical
        experience.
      </p>

      {/* ─── Course Cards sit BETWEEN heading and button ─── */}
      <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {allCourses.length > 0
          ? allCourses.slice(0, 3).map((course, index) => (
              <CourseCard key={course._id || index} course={course} />
            ))
          : [1, 2, 3].map((i) => (
              <div
                key={i}
                className='border border-gray-200 rounded-xl overflow-hidden animate-pulse'
              >
                <div className='bg-gray-200 h-44 w-full' />
                <div className='p-4 space-y-3'>
                  <div className='h-4 bg-gray-200 rounded w-3/4' />
                  <div className='h-3 bg-gray-200 rounded w-1/2' />
                  <div className='h-3 bg-gray-200 rounded w-1/4' />
                </div>
              </div>
            ))}
      </div>

      {/* Show all courses — below grid, centered */}
      <div className='mt-10 flex justify-center'>
        <Link
          to='/course-list'
          onClick={() => scrollTo(0, 0)}
          className='text-gray-600 border border-gray-600 px-5 py-2.5 rounded-full hover:bg-gray-100 transition duration-300 text-sm font-medium'
        >
          Show all courses
        </Link>
      </div>
    </div>
  )
}

export default CoursesSection