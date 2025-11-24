import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { assets, dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { currency ,  backendUrl , getToken , isEducator} = useContext(AppContext);

  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
     try {
      const token = await getToken()
      const {data} = await axios.get(backendUrl + '/api/educator/dashboard', {headers: {Authorization: `Bearer ${token}`}})

      if(data.success){
        setDashboardData(data.dashboardData);
      }
      else{
        toast.error(data.message)
      }
      
     } catch (error) {
      toast.error(error.message);
     }
  };

  useEffect(() => {
    if(isEducator){
    fetchDashboardData();
    }
  }, [isEducator]);

  return dashboardData ? (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Total Enrollments Card */}
            <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
              <img src={assets.patients_icon} alt="students_icon" className="w-12 h-12 mb-3" />
              <p className="text-3xl font-semibold text-indigo-600">
                {dashboardData.enrolledStudentData.length}
              </p>
              <p className="text-gray-500 font-medium mt-1">Total Enrollments</p>
            </div>

        {/* Total Courses */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
          <img src={assets.appointments_icon} alt="courses_icon" className="w-12 h-12 mb-3" />
          <p className="text-3xl font-semibold text-indigo-600">{dashboardData.totalCourses}</p>
          <p className="text-gray-500 font-medium mt-1">Total Courses</p>
        </div>

        {/* Total Earnings */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
          <img src={assets.earning_icon} alt="earning_icon" className="w-12 h-12 mb-3" />
          <p className="text-3xl font-semibold text-indigo-600">
            {currency} {dashboardData.totalEarnings}
          </p>
          <p className="text-gray-500 font-medium mt-1">Total Earnings</p>
        </div>
      </div>

            {/* Latest Enrollments Table */}
            <div>
              <h2 className="pb-4 text-lg font-medium text-gray-800">Latest Enrollments</h2>

              <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-lg bg-white border border-gray-200 shadow-sm">
                <table className="table-fixed md:table-auto w-full overflow-hidden">
                  <thead className="text-gray-900 border-b border-gray-300 text-sm text-left bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                      <th className="px-4 py-3 font-semibold">Student Name</th>
                      <th className="px-4 py-3 font-semibold">Course Title</th>
                    </tr>
                  </thead>

                  <tbody className="text-sm text-gray-600">
                    {dashboardData.enrolledStudentData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="text-center hidden sm:table-cell px-4 py-3">{index + 1}</td>
                        <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                          <img
                            src={item.student.imageUrl}
                            alt="Profile"
                            className="w-9 h-9 rounded-full object-cover"
                          />
                          <span className="truncate font-medium text-gray-800">
                            {item.student.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
