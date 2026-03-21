import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from '@clerk/clerk-react';
import axiosInstance from '../utils/axios';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_API_URL || 'https://csedge-backend.onrender.com';
  const currency = import.meta.env.VITE_CURRENCY;

  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // ── Courses ────────────────────────────────────────────────────────────────
  const fetchAllCourses = async (searchTerm = '') => {
    try {
      // FIX: axios.get(url, config) — only ONE config object, no duplicate params
      const { data } = await axiosInstance.get('/api/course/all', {
        params: searchTerm ? { search: searchTerm } : undefined,
      });

      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ── User data ──────────────────────────────────────────────────────────────
  const fetchUserData = async () => {
    if (user?.publicMetadata?.role === 'educator') {
      setIsEducator(true);
    }

    try {
      const token = await getToken();
      const { data } = await axiosInstance.get('/api/user/data', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ── Enrolled courses ───────────────────────────────────────────────────────
  const fetchUserEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axiosInstance.get('/api/user/enrolled-courses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ── Calculation helpers ────────────────────────────────────────────────────
  const calculateRating = (course) => {
    if (!course.courseRatings?.length) return 0;
    const total = course.courseRatings.reduce((sum, r) => sum + r.rating, 0);
    return Math.floor(total / course.courseRatings.length);
  };

  const calculateChapterTime = (chapter) => {
    const time = chapter.chapterContent.reduce((sum, lec) => sum + lec.lectureDuration, 0);
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  };

  const calculateCourseTime = (course) => {
    let time = 0;
    course.courseContent.forEach((chapter) =>
      chapter.chapterContent.forEach((lec) => { time += lec.lectureDuration; })
    );
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  };

  // Alias used by MyEnrollments
  const calculateCourseDuration = (course) => calculateCourseTime(course);

  const calculateNumberOfLectures = (course) => {
    return course.courseContent.reduce((total, chapter) => {
      return total + (Array.isArray(chapter.chapterContent) ? chapter.chapterContent.length : 0);
    }, 0);
  };

  // ── Effects ────────────────────────────────────────────────────────────────
  // Load all courses on mount
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // FIX: Only one useEffect for user — fetch user data AND enrolled courses together.
  // Previously two useEffects both called fetchUserEnrolledCourses causing double API calls.
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserEnrolledCourses();
    }
  }, [user]);

  // ── Context value ──────────────────────────────────────────────────────────
  const value = {
    currency,
    allCourses,
    enrolledCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateCourseDuration,
    calculateChapterTime,
    calculateCourseTime,
    calculateNumberOfLectures,
    fetchUserEnrolledCourses,
    backendUrl,
    userData,
    setUserData,
    getToken,
    fetchAllCourses,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};