import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);

  const { allCourses , calculateRating } = useContext(AppContext);

  const fetchCourseData = () => {
    const findCourse = allCourses.find(course => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    fetchCourseData();
  }, [id, allCourses]);

  return  courseData?(
    <>
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between 
      md:px-36 px-8 pt-20 text-left'>
      
      <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70'></div>

      {/* LEFT COL */}
      <div className='max-w-xl z-10 text-gray-500'>
        <h1 className='md:text-2xl text-xl font-semibold text-gray-800'>
          {courseData.courseTitle}
        </h1>
        <p className='pt-4 md:text-base text-sm'
         dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}>
        </p>
        
        {/* review and rating */}
        
         <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
                  <p>{calculateRating(courseData)}</p>
                  <div className='flex'>
                    {[...Array(5)].map((_, index) => (
                      <img key={index} src={index< Math.floor (calculateRating(courseData)) ? assets.star : assets.star_blank} alt=""
                      className='w-4 h-4'/>
                    ))}
                  </div>
                  <p className='text-blue-500'>({courseData.courseRatings.length}{courseData.courseRatings.length > 1 ? '  ratings':'  rating'})</p>
               
                  <p> 
                    {courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? '  students':'  student'}
                  </p>
                  <p className='text-sm'> Course by <span className='text-blue-600 underline'></span>
                    {courseData.instructorName}
                  </p>
                </div>


      </div>

      {/* RIGHT COL */}
      <div></div>
    </div>
    </>
  ): <Loading/>;
}

export default CourseDetails
