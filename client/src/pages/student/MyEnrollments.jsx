import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import {Line} from 'rc-progress'
import Footer from '../../components/student/Footer'

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration , navigate} = useContext(AppContext)

  const [progressArray, setProgressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 5, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 5 },
    { lectureCompleted: 4, totalLectures: 6 },
    { lectureCompleted: 0, totalLectures: 3 },
    { lectureCompleted: 5, totalLectures: 7 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 10},
    { lectureCompleted: 3, totalLectures: 7 },
    { lectureCompleted: 7, totalLectures: 5 },
    { lectureCompleted: 1, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 2 },
    { lectureCompleted: 5, totalLectures: 5 },
  ])

  return (
    <>
    <div className="md:px-36 px-8 pt-10">
      <h1 className="text-2xl font-semibold mb-6">My Enrollments</h1>

      {enrolledCourses.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          You haven’t enrolled in any course yet.
        </p>
      ) : (
        <table className="w-full border mt-4 text-left text-sm border-gray-200">
          <thead className="text-gray-900 border-b border-gray-300 max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold">Course</th>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Completed</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledCourses.map((course, index) => (
              <tr key={index} className="border-b border-gray-500/20">
                <td className="md:px-4 pl-2 flex items-center gap-4 py-3 px-4">
                  <img
                    src={course.courseThumbnail}
                    alt=""
                    className="w-14 sm:w-24 md:w-28 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-sm font-medium text-gray-800">
                      {course.courseTitle}
                    </p>
                    <Line strokeWidth={2} 
                    percent={
                        progressArray[index]?(progressArray[index].lectureCompleted*100)/progressArray[index].totalLectures:0

                     } className='bg-gray-300 rounded-full'/>
                  </div>
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {calculateCourseDuration(course)}
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {progressArray[index]
                    ? `${progressArray[index].lectureCompleted}/${progressArray[index].totalLectures} Lectures`
                    : 'Progress N/A'}
                </td>
                <td className="px-4 py-3">
                  <button
                    className={`px-3 py-1 text-sm rounded-full pointer-events-auto ${
                      progressArray[index] &&
                      progressArray[index].lectureCompleted ===
                        progressArray[index].totalLectures
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  onClick={()=> navigate('/player/'+ course._id)}>
                    {progressArray[index] &&
                    progressArray[index].lectureCompleted ===
                      progressArray[index].totalLectures
                      ? 'Completed'
                      : 'On Going'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    <Footer/>
    </>
  )
}

export default MyEnrollments
