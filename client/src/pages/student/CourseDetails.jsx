import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';
import CourseStudyRoomPresence from '../../components/student/CourseStudyRoomPresence.jsx';

const extractVideoId = (url) => {
  if (!url) return null;
  const embed = url.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embed) return embed[1];
  const watch = url.match(/[?&]v=([^&]+)/);
  if (watch) return watch[1];
  const short = url.match(/youtu\.be\/([^?&/]+)/);
  if (short) return short[1];
  return null;
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    calculateRating, calculateChapterTime,
    calculateCourseTime, calculateNumberOfLectures,
    currency, userData, getToken, fetchUserEnrolledCourses,
  } = useContext(AppContext);

  const [courseData, setCourseData]           = useState(null);
  const [openSections, setOpenSections]       = useState({});
  const [isAlreadyEnrolled, setEnrolled]      = useState(false);
  const [playerData, setPlayerData]           = useState(null);
  const [enrolling, setEnrolling]             = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axiosInstance.get('/api/course/' + id);
        if (data.success) setCourseData(data.courseData);
        else toast.error(data.message);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchCourse();
  }, [id]);

  // ── Enrollment check ──────────────────────────────────────────────────────
  useEffect(() => {
    if (userData && courseData) {
      const enrolled = userData.enrolledCourses?.some(
        c => (typeof c === 'object' ? c._id : c) === courseData._id
      );
      setEnrolled(enrolled);
    }
  }, [userData, courseData]);

  if (!courseData) return <Loading />;

  const discountedPrice = (
    courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100
  ).toFixed(2);
  const isFree = parseFloat(discountedPrice) <= 0;

  const handleEnroll = async () => {
    if (!userData) return toast.warn('Please log in to enroll.');
    if (isAlreadyEnrolled) return navigate('/player/' + courseData._id);

    try {
      setEnrolling(true);
      const token = await getToken();

      if (isFree) {
        const { data } = await axiosInstance.post(
          '/api/user/enroll-free',
          { courseId: courseData._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.success) {
          toast.success('Enrolled! Redirecting...');
          await fetchUserEnrolledCourses();
          navigate('/player/' + courseData._id);
        } else {
          toast.error(data.message || 'Enrollment failed');
        }
        return;
      }

      const { data } = await axiosInstance.post(
        '/api/user/purchase',
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success && data.session_url) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message || 'Payment could not be initiated');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = i =>
    setOpenSections(prev => ({ ...prev, [i]: !prev[i] }));

  const btnLabel = enrolling
    ? 'Please wait...'
    : isAlreadyEnrolled
    ? 'Go to Course →'
    : isFree
    ? 'Enroll for Free'
    : 'Buy Now';

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70" />

        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-2xl text-xl font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>

          <div className="pt-3 rich-text"
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} />

          <div className="flex items-center flex-wrap gap-3 pt-3 pb-4 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img key={i}
                  src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                  alt="star" className="w-4 h-4" />
              ))}
            </div>
            <p className="text-blue-500">
              ({courseData.courseRatings?.length}{' '}
              {courseData.courseRatings?.length !== 1 ? 'ratings' : 'rating'})
            </p>
            <p>{courseData.enrolledStudents?.length} students</p>
            <p className="text-sm text-gray-700">
              Course by <span className="font-medium">
                {courseData.educator?.name || 'CSEdge'}
              </span>
            </p>
          </div>

          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5 space-y-4">
              {courseData.courseContent.map((chapter, idx) => (
                <div key={idx} className="border border-gray-300 rounded-lg overflow-hidden">
                  <div
                    className="flex justify-between items-center cursor-pointer bg-gray-100 px-4 py-2"
                    onClick={() => toggleSection(idx)}
                  >
                    <div className="flex items-center gap-2">
                      <img src={assets.down_arrow_icon} alt="arrow"
                        className={`w-4 h-4 transition-transform duration-300 ${openSections[idx] ? 'rotate-180' : ''}`} />
                      <p className="font-medium">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {chapter.chapterContent.length} lectures — {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[idx] ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className="md:pl-10 pl-6 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lec, i) => (
                        <li key={i} className="flex items-start gap-2 py-2">
                          <img src={assets.play_icon} alt="play" className="w-4 h-4 mt-1" />
                          <div className="flex items-center justify-between w-full text-xs md:text-sm text-gray-800">
                            <p>{lec.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lec.isPreviewFree && (
                                <button
                                  onClick={() => setPlayerData({
                                    videoId: extractVideoId(lec.lectureUrl),
                                    title: lec.lectureTitle,
                                  })}
                                  className="text-blue-500 hover:underline"
                                >Preview</button>
                              )}
                              <span className="text-gray-400">{lec.lectureDuration} min</span>
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

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">Course Description</h3>
            <div className="pt-3 rich-text"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} />
          </div>
        </div>

        <div className="z-10 w-full md:w-1/3 sticky top-4">
          {playerData?.videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${playerData.videoId}?autoplay=1&rel=0`}
              title={playerData.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full aspect-video rounded-2xl shadow-md"
              style={{ border: 'none' }}
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="Thumbnail"
              className="rounded-2xl shadow-md w-full object-cover" />
          )}

          <div className="p-5">
            {isFree ? (
              <p className="text-4xl font-bold text-green-600 pt-2">FREE</p>
            ) : (
              <div className="flex items-center pt-2 gap-2">
                <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
                  {currency}{discountedPrice}
                </p>
                {courseData.discount > 0 && (
                  <>
                    <p className="md:text-lg text-gray-400 line-through">
                      {currency}{courseData.coursePrice}
                    </p>
                    <p className="md:text-lg text-gray-500">{courseData.discount}% off</p>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center text-sm gap-4 pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="" />
                <p>{calculateCourseTime(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="" />
                <p>{calculateNumberOfLectures(courseData)} lessons</p>
              </div>
            </div>

            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className={`md:mt-6 mt-4 w-full py-3 rounded text-white font-medium transition
                ${enrolling
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isAlreadyEnrolled || isFree
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {btnLabel}
            </button>

            {isAlreadyEnrolled && (
              <div className="mt-4">
                <CourseStudyRoomPresence
                  courseId={String(courseData._id)}
                  getToken={getToken}
                  enabled
                />
              </div>
            )}

            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">What's in the course?</p>
              <ul className="ml-4 pt-2 text-sm list-disc text-gray-500 space-y-1">
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