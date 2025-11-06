import React, { useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/student/Loading';

const StudentEnrolled = () => {

  const [enrolledStudents , setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async()=>{
    setEnrolledStudents(dummyStudentEnrolled)
  }

  useEffect(()=>{
    fetchEnrolledStudents()
  },[])

  return enrolledStudents ?  (
   <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Enrolled Students
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Student Name</th>
                <th className="px-4 py-3 text-left font-semibold">Course Title</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>

            <tbody className="text-gray-600">
            {enrolledStudents.map((item,index)=>(
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='px-4 py-3 text-center hidden sm:table-cell'>{index+1}</td>
                <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                  <img src={item.student.imageUrl} alt="IMAGE"  className='w-9 h-9 rounded-full'/>
                  <span className='truncate'>{item.student.name}</span>
                  </td>
                  <td className='px-4 py-3 truncate'>{item.courseTitle}</td>
                  <td className='px-4 py-3 hidden sm:table-cell'>{new DataTransfer(item.purchaseDate).toLocalDateString}</td>
                  </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  ) : <Loading/>
}

export default StudentEnrolled