import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';

// Extract YouTube video ID from embed/watch/short URLs
const extractVideoId = (url) => {
  if (!url) return null;
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch) return embedMatch[1];
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch) return shortMatch[1];
  return null;
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseTime,
    calculateNumberOfLectures,
    currency,
    userData,
    getToken,
    fetchUserEnrolledCourses,
  } = useContext(AppContext);

  // ── Fetch course ────────────────────────────────────────────────────────────
  const fetchCourseData = async () => {
    try {
      const { data } = await axiosInstance.get('/api/course/' + id);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => { fetchCourseData(); }, [id]);

  // ── Enrollment check ────────────────────────────────────────────────────────
  useEffect(() => {
    if (userData && courseData) {
      const enrolled = userData.enrolledCourses?.some(
        (c) => (typeof c === 'object' ? c._id : c) === courseData._id
      );
      setIsAlreadyEnrolled(enrolled);
    }
  }, [userData, courseData]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // ── Enroll / Purchase ───────────────────────────────────────────────────────
  const handleEnroll = async () => {
    if (!userData) return toast.warn('Please log in to enroll.');
    if (isAlreadyEnrolled) {
      // Already enrolled → go straight to player
      return navigate('/player/' + courseData._id);
    }

    try {
      setEnrolling(true);
      const token = await getToken();

      const discountedPrice = (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      );

      // ─── FREE COURSE: enroll directly, no Stripe ──────────────────────────
      if (discountedPrice <= 0) {
        const { data } = await axiosInstance.post(
          '/api/user/enroll-free',
          { courseId: courseData._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          toast.success('Enrolled successfully! Redirecting to course...');
          await fetchUserEnrolledCourses();   // refresh context
          navigate('/player/' + courseData._id);
        } else {
          toast.error(data.message || 'Enrollment failed');
        }
        return;
      }

      // ─── PAID COURSE: go through Stripe ───────────────────────────────────
      const { data } = await axiosInstance.post(
        '/api/user/purchase',
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (!courseData) return <Loading />;

  const discountedPrice = (
    courseData.coursePrice -
    (courseData.discount * courseData.coursePrice) / 100
  ).toFixed(2);

  const isFree = parseFloat(discountedPrice) <= 0;

  const buttonLabel = () => {
    if (enrolling) return 'Please wait...';
    if (isAlreadyEnrolled) return 'Go to Course →';
    if (isFree) return 'Enroll for Free';
    return 'Buy Now';
  };

  return (
    <>
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 pt-20 text-left'>
        <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70'></div>

        {/* ── LEFT COLUMN ──────────────────────────────────────────────────── */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='md:text-2xl text-xl font-semibold text-gray-800'>
            {courseData.courseTitle}
          </h1>

          <div
            className='pt-3 rich-text'
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
          />

          {/* Rating row */}
          <div className='flex items-center flex-wrap gap-3 pt-3 pb-4 text-sm'>
            <p>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                  alt='star'
                  className='w-4 h-4'
                />
              ))}
            </div>
            <p className='text-blue-500'>
              ({courseData.courseRatings?.length}{' '}
              {courseData.courseRatings?.length !== 1 ? 'ratings' : 'rating'})
            </p>
            <p>
              {courseData.enrolledStudents?.length}{' '}
              {courseData.enrolledStudents?.length !== 1 ? 'students' : 'student'}
            </p>
            <p className='text-sm text-gray-700'>
              Course by{' '}
              <span className='font-medium'>
                {courseData.educator?.name || 'CSEdge'}
              </span>
            </p>
          </div>

          {/* Course structure */}
          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>
            <div className='pt-5 space-y-4'>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border border-gray-300 rounded-lg overflow-hidden'>
                  <div
                    className='flex justify-between items-center cursor-pointer bg-gray-100 px-4 py-2'
                    onClick={() => toggleSection(index)}
                  >
                    <div className='flex items-center gap-2'>
                      <img
                        src={assets.down_arrow_icon}
                        alt='arrow'
                        className={`w-4 h-4 transform transition-transform duration-300 ${openSections[index] ? 'rotate-180' : ''}`}
                      />
                      <p className='font-medium'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm text-gray-600'>
                      {chapter.chapterContent.length} lectures —{' '}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className='md:pl-10 pl-6 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className='flex items-start gap-2 py-2'>
                          <img src={assets.play_icon} alt='play' className='w-4 h-4 mt-1' />
                          <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-sm'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {lecture.isPreviewFree && (
                                <button
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: extractVideoId(lecture.lectureUrl),
                                      title: lecture.lectureTitle,
                                    })
                                  }
                                  className='text-blue-500 hover:underline cursor-pointer'
                                >
                                  Preview
                                </button>
                              )}
                              <span className='text-gray-500'>
                                {lecture.lectureDuration} min
                              </span>
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

          {/* Full description */}
          <div className='py-20 text-sm md:text-default'>
            <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
            <div
              className='pt-3 rich-text'
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
            />
          </div>
        </div>

        {/* ── RIGHT COLUMN ─────────────────────────────────────────────────── */}
        <div className='z-10 w-full md:w-1/3 sticky top-4'>
          {/* Preview player or thumbnail */}
          {playerData?.videoId ? (
            <div className='w-full rounded-2xl overflow-hidden shadow-md'>
              <iframe
                src={`https://www.youtube.com/embed/${playerData.videoId}?autoplay=1&rel=0`}
                title={playerData.title}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                className='w-full aspect-video'
                style={{ border: 'none' }}
              />
            </div>
          ) : (
            <img
              src={courseData.courseThumbnail}
              alt='Course Thumbnail'
              className='rounded-2xl shadow-md w-full object-cover'
            />
          )}

          <div className='p-5'>
            {/* Price display */}
            {isFree ? (
              <div className='flex items-center gap-2 pt-2'>
                <p className='text-gray-800 md:text-4xl text-2xl font-bold text-green-600'>
                  FREE
                </p>
              </div>
            ) : (
              <>
                {!isFree && courseData.coursePrice > 0 && (
                  <div className='flex items-center gap-1 mt-1'>
                    <img src={assets.time_left_clock_icon} alt='time' className='w-3.5' />
                    <p className='text-red-500 text-sm'>
                      <span className='font-medium'>5 days</span> left at this price
                    </p>
                  </div>
                )}
                <div className='flex items-center pt-2 gap-2'>
                  <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>
                    {currency}{discountedPrice}
                  </p>
                  {courseData.discount > 0 && (
                    <>
                      <p className='md:text-lg text-gray-500 line-through'>
                        {currency}{courseData.coursePrice}
                      </p>
                      <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Stats row */}
            <div className='flex items-center text-sm gap-4 pt-4 text-gray-500'>
              <div className='flex items-center gap-1'>
                <img src={assets.star} alt='star' />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className='h-4 w-px bg-gray-500/40'></div>
              <div className='flex items-center gap-1'>
                <img src={assets.lesson_icon} alt='lessons' />
                <p>{calculateCourseTime(courseData)}</p>
              </div>
              <div className='h-4 w-px bg-gray-500/40'></div>
              <div className='flex items-center gap-1'>
                <img src={assets.lesson_icon} alt='lessons' />
                <p>{calculateNumberOfLectures(courseData)} lessons</p>
              </div>
            </div>

            {/* CTA button */}
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className={`md:mt-6 mt-4 w-full py-3 rounded text-white font-medium transition
                ${enrolling
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isFree || isAlreadyEnrolled
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {buttonLabel()}
            </button>

            {/* What's included */}
            <div className='pt-6'>
              <p className='md:text-xl text-lg font-medium text-gray-800'>
                What's in the course?
              </p>
              <ul className='ml-4 pt-2 text-sm list-disc text-gray-500 space-y-1'>
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