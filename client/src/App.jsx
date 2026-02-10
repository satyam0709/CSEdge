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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Student Routes */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />

        {/* Practice Routes */}
        <Route path="/practice/aptitude" element={<AptitudeTest />} />
        <Route path="/practice/dsa" element={<CodingTest />} />
        <Route path="/practice/dev" element={<DevTest />} />
        <Route path="/practice/companies" element={<CompanyInterview />} />
        <Route path="/company/:companyId" element={<CompanyDetail />} />

        {/* Educator Routes */}
        <Route path="/educator" element={<Educator />}>
          <Route index element={<EducatorDashboard />} />
          <Route path="dashboard" element={<EducatorDashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="students" element={<StudentEnrolled />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;
