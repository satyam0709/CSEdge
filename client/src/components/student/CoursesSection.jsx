import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'
import SearchBar from './SearchBar'

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext)

  return (
    <div className='section-shell py-10 md:py-16 px-4 sm:px-6 md:px-10'>
      {/* Course search — lives with the catalog, not the hero */}
      <div className='flex flex-col items-center mb-7 md:mb-10'>
        <p className='section-accent mb-3'>Find a course</p>
        <SearchBar />
      </div>

      {/* Heading — centered */}
      <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 text-center'>
        Some Best Suggested Courses
      </h2>

      {/* Sub-description — centered */}
      <p className='text-sm md:text-base text-slate-500 mt-2.5 md:mt-3 text-center max-w-2xl mx-auto leading-relaxed'>
        Explore our top recommended courses designed to enhance your skills and
        knowledge. Whether you're looking to advance your career or learn
        something new, these courses offer valuable insights and practical
        experience.
      </p>

      {/* ─── Course Cards sit BETWEEN heading and button ─── */}
      <div className='mt-7 md:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
        {allCourses.length > 0
          ? allCourses.slice(0, 3).map((course, index) => (
              <div key={course._id || index} className='stagger-card' style={{ '--d': `${index * 80}ms` }}>
                <CourseCard course={course} />
              </div>
            ))
          : [1, 2, 3].map((i) => (
              <div
                key={i}
                className='stagger-card border border-gray-200 rounded-xl overflow-hidden animate-pulse transition-all duration-300 hover:border-blue-500 hover:ring-4 hover:ring-blue-100/80 hover:shadow-lg'
                style={{ '--d': `${i * 80}ms` }}
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
          className='btn-base btn-secondary px-5 py-2.5 text-sm'
        >
          Show all courses
        </Link>
      </div>
    </div>
  )
}

export default CoursesSection