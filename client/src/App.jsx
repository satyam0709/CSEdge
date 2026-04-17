import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// ─── Pages (all files that DEFINITELY exist in your project) ──────────────────
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
import SignUpPage from "./pages/SignUp";
import Loading from "./components/student/Loading";
import EducatorDashboard from "./pages/educator/Dashboard";
import Educator from "./pages/educator/Educator";
import MyCourses from "./pages/educator/MyCourses";
import AddCourse from "./pages/educator/AddCourse";
import StudentEnrolled from "./pages/educator/StudentEnrolled";
import AdminCourses from "./admin/AdminCourses";
import AdminAnalytics from "./admin/AdminAnalytics";
import Player from "./pages/student/Player";
import ContestPage from "./pages/ContestPage";
import ContestPotdPromo from "./components/ContestPotdPromo";
import GlobalChatAssistant from "./components/student/GlobalChatAssistant.jsx";
import StudyShare from "./pages/student/StudyShare.jsx";
import MockInterview from "./pages/MockInterview.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";
import SqlTest from "./pages/SqlTest.jsx";

function App() {
  const { pathname } = useLocation();
  const isEducatorRoute = pathname.startsWith("/educator");

  return (
    <>
      {!isEducatorRoute && <Navbar />}
      <ContestPotdPromo />
      <GlobalChatAssistant />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        {/* Clerk path routing uses nested URLs (e.g. /sign-up/verify-email-address for OTP) — needs /* */}
        <Route path="/login/*" element={<Login />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/contests" element={<ContestPage />} />

        {/* Student (auth required) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route
          path="/course-list"
          element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-list/:input"
          element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <CourseDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-enrollments"
          element={
            <ProtectedRoute>
              <MyEnrollments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/:courseId"
          element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          }
        />

        {/* ✅ Stripe redirects here after payment — was MISSING causing homepage redirect */}
        <Route
          path="/loading/:path"
          element={
            <ProtectedRoute>
              <Loading />
            </ProtectedRoute>
          }
        />

        {/* Practice (auth required) */}
        <Route
          path="/practice/aptitude"
          element={
            <ProtectedRoute>
              <AptitudeTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice/dsa"
          element={
            <ProtectedRoute>
              <CodingTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice/dev"
          element={
            <ProtectedRoute>
              <DevTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice/companies"
          element={
            <ProtectedRoute>
              <CompanyInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice/sql"
          element={
            <ProtectedRoute>
              <SqlTest />
            </ProtectedRoute>
          }
        />
        <Route path="/study-share" element={<StudyShare />} />
        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute>
              <MockInterview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-builder"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/:companyId"
          element={
            <ProtectedRoute>
              <CompanyDetail />
            </ProtectedRoute>
          }
        />

        {/* Educator (auth required) */}
        <Route
          path="/educator"
          element={
            <ProtectedRoute>
              <Educator />
            </ProtectedRoute>
          }
        >
          <Route index element={<EducatorDashboard />} />
          <Route path="dashboard" element={<EducatorDashboard />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
          <Route path="students" element={<StudentEnrolled />} />
          <Route path="admin-courses" element={<AdminCourses />} />
          <Route path="admin-analytics" element={<AdminAnalytics />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;