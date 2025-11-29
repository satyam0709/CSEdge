import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CourseList from './pages/student/CourseList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentEnrolled from './pages/educator/StudentEnrolled'
import Navbar from './components/student/Navbar'
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import  AptitudeDashboard from './components/aptitude/AptitudeDashboard';
import CodingDashboard from './components/coding/CodingDashboard';
import DevDashboard from './components/dev/DevDashboard';
import CompanyDashboard from './components/companies/CompanyDashboard';

const App = () => {

  const isEducatorRoute = useMatch('/educator/*');

  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer/>
      {!isEducatorRoute && <Navbar />}
      
      <Routes>
        {/* Student / Public Routes */}
        <Route path='/' element={<Home />}/>
        <Route path='/course-list' element={<CourseList />}/>
        <Route path='/course-list/:input' element={<CourseList />}/>
        <Route path='/course/:id' element={<CourseDetails />}/>
        <Route path='/my-enrollments' element={<MyEnrollments />}/>
        <Route path='/player/:courseId' element={<Player />}/>
        <Route path='/loading/:path' element={<Loading />}/>
        <Route path='/login' element={<Login />} />

        {/* Educator Routes */}
        <Route path='/educator' element={<Educator/>}>
            <Route path='/educator' element={<Dashboard/>}/>
            <Route path='add-course' element={<AddCourse />}/>
            <Route path='my-courses' element={<MyCourses />}/>
            <Route path='student-enrolled' element={<StudentEnrolled />}/>
        </Route>  {/* <--- I MOVED THIS CLOSING TAG UP. IT WAS AT THE BOTTOM. */}

        {/* Practice Routes (Must be OUTSIDE Educator) */}
        <Route path="/company-practice" element={<CompanyDashboard />} />
        <Route path="/coding" element={<CodingDashboard />} />
        <Route path="/dev-practice" element={<DevDashboard />} />
        <Route path="/aptitude-practice" element={<AptitudeDashboard />} />

      </Routes>
    </div>
  )
}

export default App