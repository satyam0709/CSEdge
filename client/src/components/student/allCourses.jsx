import React, { useState, useEffect } from 'react';
import { BookOpen, Youtube, GraduationCap, ChevronRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const fallbackCoursesData = [
  {
    id: 'dsa',
    title: 'DSA',
    description: 'Data Structures & Algorithms',
    resources: {
      blogs: [
        { title: 'Introduction to DSA', url: '#', author: 'Tech Blog' },
        { title: 'Arrays and Strings Guide', url: '#', author: 'Code Masters' }
      ],
      youtube: [
        { title: 'DSA Complete Course', channel: 'CodeHelp', url: '#' },
        { title: 'Problem Solving Patterns', channel: 'TechDose', url: '#' }
      ],
      courses: [
        { title: 'DSA Masterclass', platform: 'Coursera', url: '#' },
        { title: 'Algorithm Design', platform: 'edX', url: '#' }
      ]
    }
  }
];

export default function CourseCard() {
  const [view, setView] = useState('main');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/course/all`;
      console.log('Fetching from:', apiUrl);
      
      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data);
      
      if (response.data.success && response.data.courses) {
        setCoursesData(response.data.courses);
      } else {
        console.warn('No courses in response, using fallback data');
        setCoursesData(fallbackCoursesData);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Using demo data.');
      setCoursesData(fallbackCoursesData);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    if (course.subcategories) {
      setView('subcategories');
    } else {
      setView('resources');
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setView('resources');
  };

  const handleBack = () => {
    if (view === 'resources' && selectedCourse?.subcategories) {
      setView('subcategories');
      setSelectedSubcategory(null);
    } else {
      setView('main');
      setSelectedCourse(null);
      setSelectedSubcategory(null);
    }
  };

  const currentResources = selectedSubcategory?.resources || selectedCourse?.resources;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-300">
            {error}
          </div>
        )}

        {view !== 'main' && (
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        )}

        {view === 'main' && (
          <>
            <h1 className="text-5xl font-bold text-slate-800 mb-4 text-center">
              Learn Smart.<span className="text-blue-600">Prepare Right.</span>
              <br />
              <span className="text-blue-600">Succeed Big</span>
            </h1>
            <p className="text-slate-600 text-center mb-12 text-lg max-w-2xl mx-auto">
              We bring everything together to help you achieve your personal and professional goals.
            </p>

            {coursesData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600">No courses available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesData.map((course) => (
                  <div
                    key={course._id || course.id}
                    onClick={() => handleCourseClick(course)}
                    className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border border-slate-200"
                  >
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{course.title}</h2>
                    <p className="text-slate-600 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600 font-medium">
                        {course.subcategories ? `${course.subcategories.length} topics` : 'View resources'}
                      </span>
                      <ChevronRight className="text-blue-600" size={20} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === 'subcategories' && selectedCourse && (
          <>
            <h1 className="text-4xl font-bold text-slate-800 mb-4">{selectedCourse.title}</h1>
            <p className="text-slate-600 mb-8">{selectedCourse.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCourse.subcategories.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleSubcategoryClick(sub)}
                  className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border border-slate-200"
                >
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{sub.title}</h3>
                  <div className="flex items-center justify-end">
                    <ChevronRight className="text-blue-600" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'resources' && currentResources && (
          <>
            <h1 className="text-4xl font-bold text-slate-800 mb-8">
              {selectedSubcategory?.title || selectedCourse?.title}
            </h1>

            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-blue-600" size={28} />
                  <h2 className="text-2xl font-bold text-slate-800">Blogs & Articles</h2>
                </div>
                <div className="space-y-3">
                  {currentResources.blogs?.map((blog, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors border border-slate-200">
                      <h3 className="text-slate-800 font-semibold mb-1">{blog.title}</h3>
                      <p className="text-slate-600 text-sm">by {blog.author}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <Youtube className="text-blue-600" size={28} />
                  <h2 className="text-2xl font-bold text-slate-800">YouTube Videos</h2>
                </div>
                <div className="space-y-3">
                  {currentResources.youtube?.map((video, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors border border-slate-200">
                      <h3 className="text-slate-800 font-semibold mb-1">{video.title}</h3>
                      <p className="text-slate-600 text-sm">{video.channel}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="text-blue-600" size={28} />
                  <h2 className="text-2xl font-bold text-slate-800">Free Courses</h2>
                </div>
                <div className="space-y-3">
                  {currentResources.courses?.map((course, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors border border-slate-200">
                      <h3 className="text-slate-800 font-semibold mb-1">{course.title}</h3>
                      <p className="text-slate-600 text-sm">{course.platform}</p>
                    </div>
                  ))}
                </div> 
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}