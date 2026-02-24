import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";

import UserDashboard from "./dashboard/UserDashboard";
import AptitudeTest from "./pages/AptitudeTest";
import CodingTest from "./pages/CodingTest";
import DevTest from "./pages/DevTest";
import CompanyInterview from "./pages/CompanyInterview";
import CompanyDetail from "./pages/CompanyDetail";
import CourseDetails from "./pages/student/CourseDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import CourseList from "./pages/student/CourseList";
import Home from "./pages/student/Home";
import Login from "./pages/Login";
import EducatorDashboard from "./pages/educator/Dashboard";
import Educator from "./pages/educator/Educator";
import MyCourses from "./pages/educator/MyCourses";
import AddCourse from "./pages/educator/AddCourse";
import StudentEnrolled from "./pages/educator/StudentEnrolled";
import AdminCourses from "./admin/AdminCourses";
import Player from "./pages/student/Player";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Student */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/home" element={<Home />} />

        {/* Course list — supports /course-list and /course-list/:input for search */}
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />

        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />

        {/* Practice */}
        <Route path="/practice/aptitude" element={<AptitudeTest />} />
        <Route path="/practice/dsa" element={<CodingTest />} />
        <Route path="/practice/dev" element={<DevTest />} />
        <Route path="/practice/companies" element={<CompanyInterview />} />
        <Route path="/company/:companyId" element={<CompanyDetail />} />

        {/* Educator panel */}
        <Route path="/educator" element={<Educator />}>
          <Route index element={<EducatorDashboard />} />
          <Route path="dashboard" element={<EducatorDashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
          {/* Admin course management — visible to educator/admin role */}
          <Route path="admin-courses" element={<AdminCourses />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;