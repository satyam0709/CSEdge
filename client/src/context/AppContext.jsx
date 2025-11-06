import { createContext } from "react";
import { useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";


// ...existing code...
export const AppContext = createContext();
export const AppContextProvider = (props)=>{

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator , setIsEducator] = useState(true);
    const [enrolledCourses , setEnrolledCourses] = useState([]);

    const fetchAllCourses = async()=>{
        setAllCourses(dummyCourses);
    }

    const calculateRating = (course)=>{
        if(course.courseRatings.length === 0) return 0;
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating;
        });
        return (totalRating / course.courseRatings.length);
    }

    const calculateChapterTime = (chapter)=>{
        let time = 0;
        chapter.chapterContent.map((lecture)=>
            time += lecture.lectureDuration)
            return humanizeDuration(time*60*1000 , {units : ['h' , 'm']});
    }

    const calculateCourseTime = (course)=>{
        let time = 0;
        course.courseContent.forEach((chapter)=>
            chapter.chapterContent.forEach((lecture)=>
                time += lecture.lectureDuration ))
            return humanizeDuration(time*60*1000 , {units : ['h' , 'm']});
    }

    // expose a calculateCourseDuration alias used by MyEnrollments
    const calculateCourseDuration = (course) => {
        // reuse calculateCourseTime so formatting is consistent across the app
        return calculateCourseTime(course);
    }

    const calculateNumberOfLectures = (course)=>{
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    const fetchUserEnrolledCourses = async()=>{
        setEnrolledCourses(dummyCourses);
    }

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
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
            fetchUserEnrolledCourses
        }

        useEffect(()=>{
            fetchAllCourses()
            fetchUserEnrolledCourses()
        },[])
        
    return (
        <AppContext.Provider 
        value={value}>
            {props.children}
     </AppContext.Provider>
    )
}
