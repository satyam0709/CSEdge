import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
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
import ContestPage from "./pages/ContestPage";

function App() {
  const { pathname } = useLocation();
  const { isSignedIn } = useUser();
  const isEducatorRoute = pathname.startsWith("/educator");
  const showTicker = isSignedIn && !isEducatorRoute;
  return (
    <>
      {!isEducatorRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/home" element={<Home />} />
        <Route path="/course-list" element={<CourseList />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/contests" element={<ContestPage />} />
        <Route path="/practice/aptitude" element={<AptitudeTest />} />
        <Route path="/practice/dsa" element={<CodingTest />} />
        <Route path="/practice/dev" element={<DevTest />} />
        <Route path="/practice/companies" element={<CompanyInterview />} />
        <Route path="/company/:companyId" element={<CompanyDetail />} />
        <Route path="/educator" element={<Educator />}>
          <Route index element={<EducatorDashboard />} />
          <Route path="dashboard" element={<EducatorDashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
          <Route path="students" element={<StudentEnrolled />} />
          <Route path="admin-courses" element={<AdminCourses />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;