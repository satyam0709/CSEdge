import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from '@clerk/clerk-react';
import axiosInstance from '../utils/axios';
import { viteConfiguredApiBase } from '../utils/viteApiBaseUrl.js';
import { toast } from 'react-toastify';
export const AppContext = createContext();
export const AppContextProvider = (props) => {
  const backendUrl =
    viteConfiguredApiBase() || "https://csedge-backend.onrender.com";
  const currency = import.meta.env.VITE_CURRENCY;
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const fetchAllCourses = async (searchTerm = '') => {
    try {
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

  const calculateCourseDuration = (course) => calculateCourseTime(course);

  const calculateNumberOfLectures = (course) => {
    return course.courseContent.reduce((total, chapter) => {
      return total + (Array.isArray(chapter.chapterContent) ? chapter.chapterContent.length : 0);
    }, 0);
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      await fetchUserData();
      if (!cancelled) await fetchUserEnrolledCourses();
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

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