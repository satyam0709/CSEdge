import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { toast } from "react-toastify";
import axios from "axios";

export const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);
  const [courses, setCourses] = useState(null);

  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        // 🔥 Normalize course structure
        const normalized = data.courses.map((c) => {
          const core = c.course || c;

          return {
            _id: c._id,
            thumbnail: core.courseThumbnail || "",
            title: core.courseTitle || "Untitled Course",
            price: core.coursePrice || 0,
            discount: core.discount || 0,
            students: c.enrolledStudents || [],
            createdAt: c.createdAt,
          };
        });

        setCourses(normalized);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load courses");
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  if (!courses) return <Loading />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          My Courses
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  All Courses
                </th>
                <th className="px-4 py-3 text-left font-semibold">Earnings</th>
                <th className="px-4 py-3 text-left font-semibold">Students</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Published On
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-600">
              {courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-8 text-gray-500 font-medium"
                  >
                    No courses found.
                  </td>
                </tr>
              ) : (
                courses.map((course) => {
                  const effectivePrice =
                    course.price -
                    (course.discount * course.price) / 100;

                  const earnings = Math.floor(
                    course.students.length * effectivePrice
                  );

                  return (
                    <tr
                      key={course._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 flex items-center space-x-3">
                        <img
                          src={
                            course.thumbnail && course.thumbnail.trim() !== ""
                              ? course.thumbnail
                              : "/placeholder.png"
                          }
                          alt="Course Thumbnail"
                          className="w-16 h-16 object-cover rounded-lg"
                        />

                        <span className="truncate font-medium text-gray-800">
                          {course.title}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {currency} {earnings}
                      </td>

                      <td className="px-4 py-3">
                        {course.students.length}
                      </td>

                      <td className="px-4 py-3">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
