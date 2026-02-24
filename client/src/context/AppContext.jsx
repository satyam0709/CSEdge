import { createContext } from "react";
import { useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import {useAuth , useUser} from '@clerk/clerk-react';
import axiosInstance from '../utils/axios';
import {toast} from 'react-toastify';


export const AppContext = createContext();
export const AppContextProvider = (props)=>{

    const   backendUrl = import.meta.env.VITE_API_URL || 'https://csedge-backend.onrender.com';


    const {getToken} = useAuth()
    const {user} = useUser()

    const [allCourses, setAllCourses] = useState([]);
    const [isEducator , setIsEducator] = useState(false);
    const [enrolledCourses , setEnrolledCourses] = useState([]);
    const [userData , setUserData] = useState(null);

    const fetchAllCourses = async(searchTerm='')=>{
        try {
            
            const {data} = await axiosInstance.get('/api/course/all', {
                params: searchTerm ? { search: searchTerm } : undefined
            }, {
                params: searchTerm ? { search: searchTerm } : undefined
            });

            if(data.success){
                setAllCourses(data.courses)
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async ()=>{

        if(user?.publicMetadata?.role === 'educator'){
            setIsEducator(true)
        }

        try {
            const token = await getToken();
            
          const {data} =  await axiosInstance.get('/api/user/data' , {headers: {Authorization: `Bearer ${token}`}}) ;

          if(data.success) {
            setUserData(data.user)
          }
          else{
            toast.error(data.message)
          }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const calculateRating = (course)=>{
        if(course.courseRatings.length === 0) return 0;
        let totalRating = 0;
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating;
        });
        return Math.floor(totalRating / course.courseRatings.length);
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

        try {
            const token = await getToken();
        const {data} = await axiosInstance.get('/api/user/enrolled-courses', {headers: {Authorization: `Bearer ${token}`}})
        
        if(data.success){
            setEnrolledCourses(data.enrolledCourses.reverse())
        }
        else{
            toast.error(data.message)
        }
        } catch (error) {
            toast.error(error.message)
        }
        
    }

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

       
    useEffect(()=>{
            fetchAllCourses()
        },[])

        useEffect(()=>{
            if(user){
                fetchUserData()
                fetchUserEnrolledCourses()
            }
        },[user])

        useEffect(()=>{
            if(userData){
                fetchUserEnrolledCourses()
            }
        },[userData])

    
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
        }
        
    return (
        <AppContext.Provider 
        value={value}>
            {props.children}
     </AppContext.Provider>
    )
}
