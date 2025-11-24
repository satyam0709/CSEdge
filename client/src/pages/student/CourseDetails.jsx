import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import YouTube from 'react-youtube';
import { toast } from 'react-toastify';
import axios from 'axios';

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseTime,
    calculateNumberOfLectures,
    currency,
    backendUrl,
    userData,
    getToken
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/' + id)

      if (data.success) {
        setCourseData(data.courseData)
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn('Login to enroll');
      }
      if (isAlreadyEnrolled) {
        return toast.warn('Already enrolled')
      }

      const token = await getToken();

      const { data } = await axios.post(backendUrl + '/api/user/purchase', {
        courseId: courseData._id
      },
        { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        const { session_url } = data
        window.location.replace(session_url)
      }
      else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // Load course data by ID
  useEffect(() => {
    fetchCourseData()
  }, []);

  // Improved Enrollment Check Logic
  useEffect(() => {
    if (userData && courseData) {
      const isEnrolled = userData.enrolledCourses.some(course => 
        (typeof course === 'object' ? course._id : course) === courseData._id
      );
      setIsAlreadyEnrolled(isEnrolled);
    }
  }, [userData, courseData]);

  const toggleSection = index => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Improved YouTube ID extraction
  const extractYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (!courseData) return <Loading />;

  const discountedPrice = (
    courseData.coursePrice -
    (courseData.discount * courseData.coursePrice) / 100
  ).toFixed(2);

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>

        {/* LEFT COLUMN */}
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-2xl text-xl font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>

          {/* Course Description */}
          <div
            className="pt-3 rich-text"
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
          ></div>

          {/* REVIEW AND RATING */}
          <div className="flex items-center flex-wrap gap-3 pt-3 pb-4 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, index) => (
                <img
                  key={index}
                  src={
                    index < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="rating-star"
                  className="w-4 h-4"
                />
              ))}
            </div>
            <p className="text-blue-500">
              ({courseData.courseRatings.length}{' '}
              {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})
            </p>
            <p>
              {courseData.enrolledStudents.length}{' '}
              {courseData.enrolledStudents.length > 1
                ? 'students'
                : 'student'}
            </p>
            <p className="text-sm text-gray-700">
              Course by {courseData.educator.name}
            </p>
          </div>

          {/* COURSE STRUCTURE */}
          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>

            <div className="pt-5 space-y-4">
              {courseData.courseContent.map((chapter, index) => (
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
                        className={`w-4 h-4 transform transition-transform duration-300 ${openSections[index] ? 'rotate-180' : ''
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
                    className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'
                      }`}
                  >
                    <ul className="md:pl-10 pl-6 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-2">
                          <img
                            src={assets.play_icon}
                            alt="play"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-sm">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: extractYouTubeID(lecture.lectureUrl),
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Preview
                                </p>
                              )}
                              <p className="text-gray-500">
                                {lecture.lectureTime}
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
          </div>

          {/* Full Description */}
          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>
            <div
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
            ></div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="z-10 w-full md:w-1/3">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName="w-full aspect-video rounded-lg"
            />
          ) : (
            <img
              src={courseData.courseThumbnail || assets.default_course_image}
              alt="Course Thumbnail"
              className="rounded-2xl shadow-md w-full"
            />
          )}

          <div className="p-5">
            <div className="flex items-center gap-2">
              <img
                className="w-3.5"
                src={assets.time_left_clock_icon}
                alt="time left"
              />
              <p className="text-red-500">
                <span className="font-medium">5 days</span> left at this price
              </p>
            </div>

            <div className="flex items-center pt-2 gap-2">
              <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                {currency} {discountedPrice}
              </p>
              <p className="md:text-lg text-gray-500 line-through">
                {currency} {courseData.coursePrice}
              </p>
              <p className="md:text-lg text-gray-500">
                {courseData.discount}% off
              </p>
            </div>

            <div className="flex items-center text-sm md:text-default gap-4 pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star icon" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="lesson icon" />
                <p>{calculateCourseTime(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="lesson icon" />
                <p>{calculateNumberOfLectures(courseData)} lessons</p>
              </div>
            </div>

            <button onClick={enrollCourse}
              className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
              {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>

            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">
                What's in the course?
              </p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                <li>Lifetime access with free updates</li>
                <li>Certificate of completion</li>
                <li>Downloadable resources</li>
                <li>Access on mobile and TV</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CourseDetails;