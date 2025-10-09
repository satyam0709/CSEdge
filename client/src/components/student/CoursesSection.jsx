import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CoursesSection = () => {

  const {allCourses} = useContext(AppContext);

  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-800'>Some Best Suggested Courses</h2>
      <p className='text-sm md:text-base text-gray-400  mt-3'>
        Explore our top recommended courses designed to enhance your skills and knowledge. Whether you're looking to advance your career or learn something new, these courses offer valuable insights and practical experience.
      </p>

      <div className='grid md:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4'>
        {allCourses.slice(0,4).map((course , index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      <Link to="/course-list" onClick={()=> scrollTo(0,0)}
        className='text-gray-600 border border-gray-600 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-300 mt-4'
      >Show all courses</Link>
    </div>
  )
}

export default CoursesSection