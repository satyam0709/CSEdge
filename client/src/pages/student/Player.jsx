import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import Footer from '../../components/student/Footer'
import { Rating } from 'react-simple-star-rating'
import axiosInstance from '../../utils/axios'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading.jsx'
import { ChevronLeft, ChevronRight, CheckCircle, Circle } from 'lucide-react'

// Extract YouTube video ID from any YouTube URL format
const extractVideoId = (url) => {
  if (!url) return null
  // Already a video ID (11 chars, no slashes)
  if (url.length === 11 && !url.includes('/')) return url
  // Embed URL: https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&/]+)/)
  if (embedMatch) return embedMatch[1]
  // Watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return watchMatch[1]
  // Short URL: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/)
  if (shortMatch) return shortMatch[1]
  // Fallback: last path segment
  return url.split('/').pop().split('?')[0]
}

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    backendUrl,
    getToken,
    userData,
    fetchUserEnrolledCourses,
  } = useContext(AppContext)

  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null) // { lecture, chapterIndex, lectureIndex }
  const [progressData, setProgressData] = useState(null)
  const [initialRating, setInitialRating] = useState(0)

  // ── Build a flat list of all lectures for easy prev/next ──────────────────
  const allLectures = courseData
    ? courseData.courseContent.flatMap((chapter, chIdx) =>
        chapter.chapterContent.map((lec, lecIdx) => ({
          ...lec,
          chapterIndex: chIdx,
          lectureIndex: lecIdx,
          chapterTitle: chapter.chapterTitle,
          chapterNum: chIdx + 1,
          lectureNum: lecIdx + 1,
        }))
      )
    : []

  const currentFlatIndex = playerData
    ? allLectures.findIndex((l) => l.lectureId === playerData.lectureId)
    : -1

  const canGoPrev = currentFlatIndex > 0
  const canGoNext = currentFlatIndex < allLectures.length - 1

  const playLecture = useCallback(
    (lecture) => {
      setPlayerData(lecture)
      // Auto-open the chapter this lecture belongs to
      setOpenSections((prev) => ({ ...prev, [lecture.chapterIndex]: true }))
    },
    []
  )

  const goToPrev = () => {
    if (canGoPrev) playLecture(allLectures[currentFlatIndex - 1])
  }

  const goToNext = () => {
    if (canGoNext) playLecture(allLectures[currentFlatIndex + 1])
  }

  // ── Course data ────────────────────────────────────────────────────────────
  const getCourseData = useCallback(() => {
    const course = enrolledCourses.find((c) => c._id === courseId)
    if (course) {
      setCourseData(course)
      course.courseRatings?.forEach((item) => {
        if (item.userId === userData?._id) setInitialRating(item.rating)
      })
    }
  }, [enrolledCourses, courseId, userData])

  useEffect(() => {
    if (enrolledCourses.length > 0) getCourseData()
  }, [enrolledCourses, getCourseData])

  // Auto-play first lecture when course loads
  useEffect(() => {
    if (courseData && !playerData && courseData.courseContent?.length > 0) {
      const firstChapter = courseData.courseContent[0]
      if (firstChapter?.chapterContent?.length > 0) {
        playLecture({
          ...firstChapter.chapterContent[0],
          chapterIndex: 0,
          lectureIndex: 0,
          chapterTitle: firstChapter.chapterTitle,
          chapterNum: 1,
          lectureNum: 1,
        })
        setOpenSections({ 0: true })
      }
    }
  }, [courseData])

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  // ── Progress ───────────────────────────────────────────────────────────────
  const getCourseProgress = useCallback(async () => {
    try {
      const token = await getToken()
      const { data } = await axiosInstance.post(
        '/api/user/get-course-progress',
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) setProgressData(data.progressData)
    } catch (error) {
      console.error('Progress fetch error:', error)
    }
  }, [courseId, getToken])

  const markLecAsCompleted = async (lectureId) => {
    try {
      const token = await getToken()
      const { data } = await axiosInstance.post(
        '/api/user/update-course-progress',
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Lecture marked as completed!')
        getCourseProgress()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getCourseProgress()
  }, [getCourseProgress])

  const handleRate = async (rating) => {
    try {
      const token = await getToken()
      const { data } = await axiosInstance.post(
        '/api/user/add-rating',
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success('Rating submitted!')
        fetchUserEnrolledCourses()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const isCompleted = (lectureId) =>
    progressData?.lectureCompleted?.includes(lectureId)

  // ── Total progress percentage ──────────────────────────────────────────────
  const progressPercent =
    allLectures.length > 0 && progressData
      ? Math.round(
          (progressData.lectureCompleted?.length / allLectures.length) * 100
        )
      : 0

  // ── Render ─────────────────────────────────────────────────────────────────
  if (!courseData) return <Loading />

  const videoId = playerData ? extractVideoId(playerData.lectureUrl) : null

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">

        {/* ── Left sidebar: Course structure ─────────────────────────────── */}
        <div className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 md:h-screen md:sticky md:top-0 md:overflow-y-auto flex-shrink-0">
          {/* Sidebar header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900 text-base line-clamp-2">
              {courseData.courseTitle}
            </h2>
            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{progressData?.lectureCompleted?.length || 0} / {allLectures.length} lectures</span>
                <span>{progressPercent}% complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Chapter list */}
          <div className="divide-y divide-gray-100">
            {courseData.courseContent.map((chapter, chIdx) => (
              <div key={chIdx}>
                {/* Chapter header */}
                <button
                  onClick={() => toggleSection(chIdx)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <img
                      src={assets.down_arrow_icon}
                      alt=""
                      className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${
                        openSections[chIdx] ? 'rotate-180' : ''
                      }`}
                    />
                    <span className="font-semibold text-gray-800 text-sm truncate">
                      {chapter.chapterTitle}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                    {chapter.chapterContent.length} videos
                  </span>
                </button>

                {/* Lectures */}
                {openSections[chIdx] && (
                  <ul className="py-1">
                    {chapter.chapterContent.map((lecture, lecIdx) => {
                      const flatIdx = allLectures.findIndex(
                        (l) => l.lectureId === lecture.lectureId
                      )
                      const isActive = playerData?.lectureId === lecture.lectureId
                      const done = isCompleted(lecture.lectureId)

                      return (
                        <li key={lecIdx}>
                          <button
                            onClick={() =>
                              playLecture({
                                ...lecture,
                                chapterIndex: chIdx,
                                lectureIndex: lecIdx,
                                chapterTitle: chapter.chapterTitle,
                                chapterNum: chIdx + 1,
                                lectureNum: lecIdx + 1,
                              })
                            }
                            className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                              isActive
                                ? 'bg-blue-50 border-r-2 border-blue-600'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {/* Completion icon */}
                            <div className="flex-shrink-0 mt-0.5">
                              {done ? (
                                <CheckCircle size={16} className="text-green-500" />
                              ) : (
                                <Circle
                                  size={16}
                                  className={isActive ? 'text-blue-600' : 'text-gray-300'}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-xs font-medium leading-snug ${
                                  isActive ? 'text-blue-700' : 'text-gray-700'
                                }`}
                              >
                                {flatIdx + 1}. {lecture.lectureTitle}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {lecture.lectureDuration} min
                              </p>
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Rating */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Rate this course:</p>
            <Rating initialValue={initialRating} onPointerMove={handleRate} size={24} />
          </div>
        </div>

        {/* ── Right: Video player ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-h-screen">
          {playerData && videoId ? (
            <div className="flex flex-col flex-1">
              {/* Video embed — plays INSIDE the platform, no YouTube redirect */}
              <div className="w-full bg-black">
                <div className="w-full aspect-video max-h-[70vh]">
                  <iframe
                    key={videoId}  // re-mount when video changes
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={playerData.lectureTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ border: 'none' }}
                  />
                </div>
              </div>

              {/* Video info + controls */}
              <div className="p-4 md:p-6 bg-white border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">
                      {playerData.chapterTitle} • Lecture {playerData.lectureNum}
                    </p>
                    <h1 className="text-lg md:text-xl font-bold text-gray-900">
                      {playerData.lectureTitle}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      {playerData.lectureDuration} min
                    </p>
                  </div>

                  {/* Mark complete button */}
                  <button
                    onClick={() => markLecAsCompleted(playerData.lectureId)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex-shrink-0 ${
                      isCompleted(playerData.lectureId)
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isCompleted(playerData.lectureId) ? (
                      <>
                        <CheckCircle size={16} />
                        Completed
                      </>
                    ) : (
                      <>
                        <Circle size={16} />
                        Mark as Complete
                      </>
                    )}
                  </button>
                </div>

                {/* Prev / Next navigation */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                  <button
                    onClick={goToPrev}
                    disabled={!canGoPrev}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      canGoPrev
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>

                  <span className="text-sm text-gray-400">
                    {currentFlatIndex + 1} / {allLectures.length}
                  </span>

                  <button
                    onClick={goToNext}
                    disabled={!canGoNext}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      canGoNext
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Upcoming lecture preview */}
              {canGoNext && (
                <div className="p-4 md:p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Up Next
                  </h3>
                  <button
                    onClick={goToNext}
                    className="flex items-center gap-3 w-full text-left p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${extractVideoId(allLectures[currentFlatIndex + 1]?.lectureUrl)}/mqdefault.jpg`}
                      alt="next"
                      className="w-24 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">
                        {allLectures[currentFlatIndex + 1]?.chapterTitle}
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {allLectures[currentFlatIndex + 1]?.lectureTitle}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {allLectures[currentFlatIndex + 1]?.lectureDuration} min
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-blue-500 ml-auto flex-shrink-0" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Placeholder when no lecture is selected */
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <img
                src={courseData.courseThumbnail}
                alt={courseData.courseTitle}
                className="w-64 h-40 object-cover rounded-2xl shadow-lg mb-6"
              />
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {courseData.courseTitle}
              </h2>
              <p className="text-gray-500 mb-6">
                Select a lecture from the sidebar to start learning
              </p>
              <button
                onClick={() => allLectures.length > 0 && playLecture(allLectures[0])}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Start First Lecture →
              </button>
            </div>
          )}

          <Footer />
        </div>
      </div>
    </>
  )
}

export default Player