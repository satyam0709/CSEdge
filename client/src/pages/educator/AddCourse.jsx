import React, { useContext, useEffect, useRef, useState } from 'react'
import uniqid from 'uniqid'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/axios'

const AddCourse = () => {

  const {backendUrl, getToken} = useContext(AppContext)
  const quillRef = useRef(null)
  const editorRef = useRef(null)

  const [courseTitle, setCourseTitle] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [image, setImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false,
  })

  // Initialize Quill editor once
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write a detailed description about your course...',
      })
    }
  }, [])

  // Handle chapter actions (add, remove, toggle)
  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Chapter Name:')
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0 ? chapters[chapters.length - 1].chapterOrder + 1 : 1,
        }
        setChapters([...chapters, newChapter])
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId))
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      )
    }
  }

  // Handle lecture actions (add, remove)
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId)
      setShowPopup(true)
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            return {
              ...chapter,
              chapterContent: chapter.chapterContent.filter((_, index) => index !== lectureIndex)
            }
          }
          return chapter
        })
      )
    }
  }

  // Add lecture with proper order tracking
  const addLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureDuration || !lectureDetails.lectureUrl) {
      alert('Please fill all lecture details')
      return
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder: chapter.chapterContent.length > 0 
              ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 
              : 1,
            lectureId: uniqid()
          }
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, newLecture]
          }
        }
        return chapter
      })
    )
    setShowPopup(false)
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    })
    setCurrentChapterId(null)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (!image) {
        toast.error('Thumbnail Not Selected')
        return
      }

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      }

      const formData = new FormData()
      formData.append('courseData', JSON.stringify(courseData))
      formData.append('image', image)

      const token = await getToken()
      const {data} = await axios.post(backendUrl + '/api/educator/add-course',
        formData, {headers: {Authorization: `Bearer ${token}`}}
      )

      if (data.success) {
        toast.success(data.message)
        setCourseTitle('')
        setCoursePrice(0)
        setDiscount(0)
        setImage(null)
        setChapters([])
        quillRef.current.root.innerHTML = ""
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  // Close popup
  const closePopup = () => {
    setShowPopup(false)
    setCurrentChapterId(null)
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false,
    })
  }

  return (
    <div className="min-h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full text-gray-500">
        {/* Course Title */}
        <div className="flex flex-col gap-1">
          <p>Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>

        {/* Course Description */}
        <div className="flex flex-col gap-1">
          <p>Course Description</p>
          <div ref={editorRef}></div>
        </div>

        {/* Course Price and Discount */}
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex flex-col gap-1">
            <p>Course Price:</p>
            <input
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
              required
            />
          </div>

          <div className="flex md:flex-row flex-col items-center gap-3">
            <p>Course Thumbnail:</p>
            <label htmlFor="thumbnailImage" className="flex items-center gap-3">
              <img src="/assets/file_upload_icon.png" alt="" className="p-3 bg-blue-500 rounded" />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
              <img
                className="max-h-10"
                src={image ? URL.createObjectURL(image) : ''}
                alt=""
              />
            </label>
          </div>
        </div>

        {/* Discount */}
        <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
            required
          />
        </div>

        {/* Adding Chapters & Lectures */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapter.chapterId} className="bg-white border rounded-lg mb-4">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                  <img
                    src="/assets/dropdown_icon.png"
                    width={14}
                    alt=""
                    onClick={() => handleChapter('toggle', chapter.chapterId)}
                    className={`mr-2 cursor-pointer transition-all ${
                      chapter.collapsed && '-rotate-90'
                    }`}
                  />
                  <span className="font-semibold">
                    {chapterIndex + 1} {chapter.chapterTitle}
                  </span>
                </div>
                <span className="text-gray-500">
                  {chapter.chapterContent.length} Lectures
                </span>
                <img
                  src="/assets/cross_icon.png"
                  alt=""
                  className="cursor-pointer"
                  onClick={() => handleChapter('remove', chapter.chapterId)}
                />
              </div>

              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div
                      key={lecture.lectureId}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>
                        {lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins -{' '}
                        <a
                          href={lecture.lectureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500"
                        >
                          Link
                        </a>{' '}
                        - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}
                      </span>
                      <img
                        src="/assets/cross_icon.png"
                        alt=""
                        className="cursor-pointer"
                        onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)}
                      />
                    </div>
                  ))}
                  <div
                    className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2"
                    onClick={() => handleLecture('add', chapter.chapterId)}
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}

          <div
            className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
            onClick={() => handleChapter('add')}
          >
            + Add Chapter
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-6 rounded-lg mt-4"
        >
          Save Course
        </button>
      </form>

      {/* Popup for Adding Lecture */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Add Lecture</h3>

            <div className="mb-3">
              <p className="mb-1">Lecture Title</p>
              <input
                type="text"
                value={lectureDetails.lectureTitle}
                onChange={(e) =>
                  setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })
                }
                className="w-full border border-gray-400 outline-none py-2 px-3 rounded"
                placeholder="Enter lecture title"
              />
            </div>

            <div className="mb-3">
              <p className="mb-1">Lecture Duration (mins)</p>
              <input
                type="number"
                value={lectureDetails.lectureDuration}
                onChange={(e) =>
                  setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })
                }
                className="w-full border border-gray-400 outline-none py-2 px-3 rounded"
                placeholder="Enter duration"
              />
            </div>

            <div className="mb-3">
              <p className="mb-1">Lecture URL</p>
              <input
                type="url"
                value={lectureDetails.lectureUrl}
                onChange={(e) =>
                  setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })
                }
                className="w-full border border-gray-400 outline-none py-2 px-3 rounded"
                placeholder="Enter video URL"
              />
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={lectureDetails.isPreviewFree}
                onChange={(e) =>
                  setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })
                }
                className="mr-2"
              />
              <label>Free Preview</label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={addLecture}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddCourse