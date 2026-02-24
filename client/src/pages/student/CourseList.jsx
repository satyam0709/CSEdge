import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/student/SearchBar'
import { useParams } from 'react-router-dom'
import CourseCard from '../../components/student/CourseCard'
import { assets } from '../../assets/assets'
import Footer from '../../components/student/Footer'

const CourseList = () => {
  const { navigate, allCourses, fetchAllCourses } = useContext(AppContext)
  const { input } = useParams()
  const [filteredCourses, setFilteredCourses] = useState([])

  useEffect(() => {
    // whenever the search term changes we can re-fetch using backend filter
    if (input) {
      fetchAllCourses(input);
    } else {
      fetchAllCourses();
    }
  }, [input]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      if (input) {
        setFilteredCourses(
          allCourses.filter(item =>
            item.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
        )
      } else {
        setFilteredCourses(allCourses)
      }
    }
  }, [allCourses, input])

  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left'>
        {/* Header + Search */}
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-800'>Course List</h1>
            <p className='text-gray-500'>
              <span
                onClick={() => navigate('/')}
                className='text-blue-600 cursor-pointer hover:underline'
              >
                Home
              </span>{' '}
              / <span>Course List</span>
            </p>
          </div>
          <SearchBar data={input} />
        </div>

        {input && (
          <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 mb-8 text-gray-800 rounded-2xl'>
            <p>{input}</p>
            <img
              src={assets.cross_icon}
              alt=""
              className='cursor-pointer'
              onClick={() => navigate('/course-list')}
            />
          </div>
        )}

        {/* No courses found */}
        {filteredCourses.length === 0 && (
          <p className='text-gray-500 text-center mt-10'>
            No courses found for "{input}". Please try a different search term.
          </p>
        )}

        {/* Course Grid */}
        <div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6 my-10'>
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CourseList
