import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import { Rating } from 'react-simple-star-rating';
import axiosInstance from '../../utils/axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading.jsx'

const Player = () => {

  const {enrolledCourses , calculateChapterTime , backendUrl , getToken ,
    userData , fetchUserEnrolledCourses} = useContext(AppContext);
  const {courseId} = useParams()
  const [courseData , setCourseData] = useState(null)
  const [openSections , setOpenSections] = useState({})
  const [playerData , setPlayerData] = useState(null)
  const [progressData ,setProgressData] = useState(null);
  const [initialRating ,setInitialRating] = useState(0);

  const getCourseData = ()=>{
    const course = enrolledCourses.find((course)=> course._id === courseId);
    if(course){
      setCourseData(course)
      course.courseRatings.map((item)=>{
        if(item.userId === userData._id){
          setInitialRating(item.rating)
        }
      })
    }
  }

    const toggleSection = index => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(()=>{
    if(enrolledCourses.length > 0){
      getCourseData();
    }
  },[enrolledCourses])

  const markLecAsCompleted = async (lectureId)=>{
    try {
        const token = await getToken()
        const {data} = await axios.post(backendUrl+'/api/user/update-course-progress' ,
          {courseId , lectureId} , {headers:{Authorization:`Bearer ${token}`}})

        if(data.success){
          toast.success(data.message);
          getCourseProgress()
        }
        else{
          toast.error(data.message)
        }

    } catch (error) {
      toast.error(error.message);
    }
  }

  const getCourseProgress = async ()=>{
    try {

      const token = await getToken()
      const {data} = await axios.post(backendUrl+'/api/user/get-course-progress',
        {courseId} , {headers:{Authorization:`Bearer ${token}`}}
      )

      if(data.success){
        setProgressData(data.progressData)
      }
      else{
        toast.error(data.message);
      }
      
    } catch (error) {
      toast.error(error.message);
    }
  }

  const handleRate = async (rating)=>{
    try {

      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/user/add-rating' , 
        {courseId , rating} , {headers:{Authorization:`Bearer ${token}`}})

        if(data.success){
          toast.success(data.message)
          fetchUserEnrolledCourses()
        }
        else{
          toast.error(data.message)
        }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    getCourseProgress()
  },[])

  return  courseData ? (
    <>
    <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
      {/* Left */}
      <div className='text-gray-800'>
        <h2 className='text-xl font-semibold'>
          Course Structure
        </h2>
                  {/* <div className="pt-8 text-gray-800"> */}
                    {/* <h2 className="text-xl font-semibold">Course Structure</h2> */}
        
                    <div className="pt-5 space-y-4">
                      {courseData && courseData.courseContent.map((chapter, index) => (
                        <div
                          key={index}
                          className="border border-gray-300 rounded-lg overflow-hidden"
                        >
                          {/* CHAPTER HEADER */}
                          <div
                            className="flex justify-between items-center cursor-pointer bg-gray-100 px-4 py-2"
                            onClick={() => toggleSection(index)}
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={assets.down_arrow_icon}
                                alt="arrow"
                                className={`w-4 h-4 transform transition-transform duration-300 ${
                                  openSections[index] ? 'rotate-180' : ''
                                }`}
                              />
                              <p className="font-medium">{chapter.chapterTitle}</p>
                            </div>
                            <p className="text-sm text-gray-600">
                              {chapter.chapterContent.length} lectures —{' '}
                              {calculateChapterTime(chapter)}
                            </p>
                          </div>
        
                          {/* LECTURES LIST */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              openSections[index] ? 'max-h-96' : 'max-h-0'
                            }`}
                          >
                            <ul className="md:pl-10 pl-6 pr-4 py-2 text-gray-600 border-t border-gray-300">
                              {chapter.chapterContent.map((lecture, i) => (
                                <li key={i} className="flex items-start gap-2 py-2">
                                  <img
                                    src={progressData && progressData.lectureCompleted.includes(
                                     lecture.lectureId
                                     ) ? assets.blue_tick_icon : assets.play_icon}
                                    alt="play"
                                    className="w-4 h-4 mt-1"
                                  />
                                  <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-sm">
                                    <p>{lecture.lectureTitle}</p>
                                    <div className="flex gap-2">
                                      {lecture.lectureUrl && (
                                        <p
                                          onClick={() =>
                                            setPlayerData({...lecture , chapter:index+1 , lecture:i+1})
                                          }
                                          className="text-blue-500 cursor-pointer"
                                        >
                                          Watch
                                        </p>
                                      )}
                                      <p className="text-gray-500">
                                        {lecture.lectureDuration} mins
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  
    <div className='flex flex-row items-center gap-3 py-3 mt-10'>
  <h1 className='text-xl font-bold'>Rate this Course:</h1>
  <Rating initialValue={initialRating} onRate={handleRate}/>
</div>
      </div>


      {/* Right */}
      <div className='md:mt-10'>
        {playerData ? (
          <div>
               <YouTube
                        videoId={playerData.lectureUrl.split('/').pop()}
                        iframeClassName="w-full aspect-video rounded-lg"
                    />
                    <div className='flex justify-between items-center mt-1'>
                      <p>
                        {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                      </p>
                       <button onClick={()=> markLecAsCompleted(playerData.lectureId)} className='text-blue-600'>{progressData && progressData.lectureCompleted.includes(
                        playerData.lectureId
                       ) ? 'Completed':'Mark Complete'}</button>
                    </div>
          </div>
        ):
          <img src={courseData ? courseData.courseThumbnail : ''} alt="" />
      }
    </div>
  </div>
  <Footer/>
  </>
  ) : <Loading/>
}

export default Player