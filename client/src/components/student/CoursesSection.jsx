import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'
import SearchBar from './SearchBar'

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext)

  return (
    <div
      className="section-shell py-10 md:py-16 px-4 sm:px-6 md:px-10 relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />

      <div className="relative z-10">
        {/* Search bar */}
        <div className="flex flex-col items-center mb-8 md:mb-10">
          <p className="section-accent mb-3">Find a course</p>
          <SearchBar />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 text-center">
          Some Best{' '}
          <span className="gradient-text-animate">Suggested Courses</span>
        </h2>

        {/* Sub */}
        <p className="text-sm md:text-base text-slate-500 mt-3 text-center max-w-2xl mx-auto leading-relaxed">
          Explore our top recommended courses designed to enhance your skills.
          Whether you&apos;re advancing your career or learning something new,
          these courses deliver real, practical value.
        </p>

        {/* Cards */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
          {allCourses.length > 0
            ? allCourses.slice(0, 3).map((course, index) => (
                <div
                  key={course._id || index}
                  className="stagger-card"
                  style={{ '--d': `${index * 85}ms` }}
                >
                  <CourseCard course={course} />
                </div>
              ))
            : [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="stagger-card border border-gray-200 rounded-xl overflow-hidden animate-pulse"
                  style={{ '--d': `${i * 85}ms` }}
                >
                  <div className="bg-gray-200 h-44 w-full" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
        </div>

        {/* Show all */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/course-list"
            onClick={() => scrollTo(0, 0)}
            className="shimmer-btn btn-base btn-secondary px-6 py-2.5 text-sm font-semibold"
            style={{
              boxShadow: '0 0 0 1px rgba(148,163,184,0.35)',
            }}
          >
            Show all courses
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CoursesSection
