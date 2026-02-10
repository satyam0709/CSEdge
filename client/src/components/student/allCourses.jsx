import React, { useState, useEffect } from 'react';
import { BookOpen, Youtube, GraduationCap, ChevronRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';

// Updated data with real YouTube Embed URLs
const fallbackCoursesData = [
  {
    id: 'dsa',
    title: 'DSA Master Series',
    description: 'Complete Data Structures & Algorithms Roadmap',
    resources: {
      blogs: [
        { title: 'Introduction to Algorithms', url: '#', author: 'GeeksforGeeks' },
        { title: 'Big O Notation Guide', url: '#', author: 'FreeCodeCamp' },
        { title: 'Graph Theory Explained', url: '#', author: 'BaseCS' }
      ],
      youtube: [
        { 
          title: 'Striver A2Z DSA Course', 
          channel: 'take U forward', 
          // Converted to embed URL with list parameter
          embedUrl: 'https://www.youtube.com/embed/0bHoB32fuj0?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz' 
        },
        { 
          title: 'DSA Placement Course', 
          channel: 'Apna College', 
          // Converted to embed URL with list parameter
          embedUrl: 'https://www.youtube.com/embed/VTLCoHnyACE?list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt' 
        }
      ],
      courses: [
        { title: 'Algorithms Specialization', platform: 'Coursera', url: '#' },
        { title: 'CS50 Introduction to CS', platform: 'edX', url: '#' },
        { title: 'LeetCode Premium', platform: 'LeetCode', url: '#' }
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
      // Ensure your VITE_API_URL is correctly set in your .env file
      const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/course/all`;
      console.log('Fetching from:', apiUrl);
      
      const response = await axios.get(apiUrl);
      console.log('API Response:', response.data);
      
      if (response.data.success && response.data.courses && response.data.courses.length > 0) {
        setCoursesData(response.data.courses);
      } else {
        console.warn('No courses in response or API error, using fallback data');
        setCoursesData(fallbackCoursesData);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Using curated resources.');
      setCoursesData(fallbackCoursesData);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    if (course.subcategories && course.subcategories.length > 0) {
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
          <p className="text-slate-600">Loading learning resources...</p>
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

        {/* MAIN VIEW */}
        {view === 'main' && (
          <>
            <h1 className="text-5xl font-bold text-slate-800 mb-4 text-center">
              Learn Smart. <span className="text-blue-600">Prepare Right.</span>
              <br />
              <span className="text-blue-600">Succeed Big</span>
            </h1>
            <p className="text-slate-600 text-center mb-12 text-lg max-w-2xl mx-auto">
              Curated roadmaps and resources to help you master Data Structures, Algorithms, and System Design.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesData.map((course) => (
                <div
                  key={course._id || course.id}
                  onClick={() => handleCourseClick(course)}
                  className="bg-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border border-slate-200"
                >
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{course.title}</h2>
                  <p className="text-slate-600 mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">
                      {course.subcategories ? `${course.subcategories.length} topics` : 'View resources'}
                    </span>
                    <ChevronRight className="text-blue-600" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* SUBCATEGORIES VIEW */}
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

        {/* RESOURCES VIEW */}
        {view === 'resources' && currentResources && (
          <>
            <h1 className="text-4xl font-bold text-slate-800 mb-8">
              {selectedSubcategory?.title || selectedCourse?.title} Resources
            </h1>

            <div className="space-y-12">
              
              {/* VIDEO SECTION - UPDATED */}
              {currentResources.youtube && currentResources.youtube.length > 0 && (
                <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <Youtube className="text-red-600" size={32} />
                    <h2 className="text-2xl font-bold text-slate-800">Video Playlists</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {currentResources.youtube.map((video, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg bg-black">
                          {video.embedUrl ? (
                            <iframe 
                              src={video.embedUrl} 
                              title={video.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                              allowFullScreen
                            ></iframe>
                          ) : (
                            // Fallback if no embedUrl exists (for older data)
                            <div className="flex items-center justify-center h-full text-white">
                              <a href={video.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                Watch on YouTube
                              </a>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">{video.title}</h3>
                          <span className="text-sm text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                            {video.channel}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BLOGS SECTION */}
              {currentResources.blogs && currentResources.blogs.length > 0 && (
                <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="text-blue-600" size={28} />
                    <h2 className="text-2xl font-bold text-slate-800">Reading Material</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentResources.blogs.map((blog, idx) => (
                      <a 
                        key={idx} 
                        href={blog.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-slate-50 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-200 transition-all border border-slate-200 group"
                      >
                        <h3 className="text-slate-800 font-semibold mb-1 group-hover:text-blue-700">
                          {blog.title}
                        </h3>
                        <p className="text-slate-500 text-sm">Author: {blog.author}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* COURSES SECTION */}
              {currentResources.courses && currentResources.courses.length > 0 && (
                <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200">
                  <div className="flex items-center gap-3 mb-6">
                    <GraduationCap className="text-blue-600" size={28} />
                    <h2 className="text-2xl font-bold text-slate-800">External Courses</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentResources.courses.map((course, idx) => (
                      <a 
                        key={idx} 
                        href={course.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-slate-50 rounded-lg p-4 hover:bg-green-50 hover:border-green-200 transition-all border border-slate-200 group"
                      >
                        <h3 className="text-slate-800 font-semibold mb-1 group-hover:text-green-700">
                          {course.title}
                        </h3>
                        <p className="text-slate-500 text-sm">{course.platform}</p>
                      </a>
                    ))}
                  </div> 
                </div>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
}