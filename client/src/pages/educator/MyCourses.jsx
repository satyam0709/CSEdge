import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'

export const MyCourses = () => {

  const { currency, allCourses } = useContext(AppContext)
  const [courses, setCourses] = useState(null)

  const fetchEducatorCourses = async () => {
    setCourses(allCourses)
  }

  useEffect(() => {
    fetchEducatorCourses()
  }, [])

  return courses ? (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          My Courses
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">All Courses</th>
                <th className="px-4 py-3 text-left font-semibold">Earnings</th>
                <th className="px-4 py-3 text-left font-semibold">Students</th>
                <th className="px-4 py-3 text-left font-semibold">Published On</th>
              </tr>
            </thead>

            <tbody className="text-gray-600">
              {courses.map((course) => (
                <tr
                  key={course._id}
                  className="border-t hover:bg-gray-50 transition-all duration-200"
                >
                  <td className="px-4 py-3 flex items-center space-x-3">
                    <img
                      src={course.courseThumbnail || course.course?.Thumbnail}
                      alt="Course Thumbnail"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <span className="truncate font-medium text-gray-800">
                      {course.courseTitle || course.course?.courseTitle}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {currency}{" "}
                    {Math.floor(
                      (course.enrolledStudents?.length || 0) *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {course.enrolledStudents?.length || 0}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default MyCourses
