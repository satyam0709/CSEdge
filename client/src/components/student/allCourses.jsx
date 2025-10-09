import React, { useState } from 'react';
import { BookOpen, Youtube, GraduationCap, ChevronRight, ArrowLeft } from 'lucide-react';

const coursesData = [
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
  },
  {
    id: 'oop',
    title: "OOP's",
    description: 'Object Oriented Programming',
    resources: {
      blogs: [
        { title: 'OOP Principles Explained', url: '#', author: 'Dev.to' }
      ],
      youtube: [
        { title: 'OOP in Java', channel: 'Programming with Mosh', url: '#' }
      ],
      courses: [
        { title: 'OOP Fundamentals', platform: 'Udemy', url: '#' }
      ]
    }
  },
  {
    id: 'aptitude',
    title: 'Aptitude',
    description: 'Quantitative & Logical Reasoning',
    resources: {
      blogs: [
        { title: 'Aptitude Tips & Tricks', url: '#', author: 'IndiaBix' }
      ],
      youtube: [
        { title: 'Aptitude Complete Course', channel: 'Arun Sharma', url: '#' }
      ],
      courses: [
        { title: 'Placement Aptitude', platform: 'GeeksforGeeks', url: '#' }
      ]
    }
  },
  {
    id: 'lld',
    title: 'LLD',
    description: 'Low Level Design',
    resources: {
      blogs: [
        { title: 'LLD Design Patterns', url: '#', author: 'Refactoring Guru' }
      ],
      youtube: [
        { title: 'LLD Interview Prep', channel: 'Concept && Coding', url: '#' }
      ],
      courses: [
        { title: 'System Design LLD', platform: 'Scaler', url: '#' }
      ]
    }
  },
  {
    id: 'fundamentals',
    title: 'Computer Fundamentals',
    description: 'Core CS Concepts',
    subcategories: [
      {
        id: 'cn',
        title: 'Computer Network',
        resources: {
          blogs: [
            { title: 'Networking Basics', url: '#', author: 'NetworkChuck' }
          ],
          youtube: [
            { title: 'Computer Networks Full Course', channel: 'Gate Smashers', url: '#' }
          ],
          courses: [
            { title: 'Computer Networking', platform: 'Coursera', url: '#' }
          ]
        }
      },
      {
        id: 'os',
        title: 'Operating System',
        resources: {
          blogs: [
            { title: 'OS Concepts', url: '#', author: 'GeeksforGeeks' }
          ],
          youtube: [
            { title: 'Operating Systems', channel: 'Neso Academy', url: '#' }
          ],
          courses: [
            { title: 'OS Fundamentals', platform: 'Udacity', url: '#' }
          ]
        }
      },
      {
        id: 'dbms',
        title: 'DBMS',
        resources: {
          blogs: [
            { title: 'Database Management', url: '#', author: 'TutorialsPoint' }
          ],
          youtube: [
            { title: 'DBMS Complete Course', channel: 'Gate Smashers', url: '#' }
          ],
          courses: [
            { title: 'Database Systems', platform: 'Stanford Online', url: '#' }
          ]
        }
      }
    ]
  },
  {
    id: 'se',
    title: 'Software Engineering',
    description: 'SDLC & Best Practices',
    resources: {
      blogs: [
        { title: 'Software Development Lifecycle', url: '#', author: 'Martin Fowler' }
      ],
      youtube: [
        { title: 'Software Engineering Basics', channel: 'CS Dojo', url: '#' }
      ],
      courses: [
        { title: 'Software Engineering', platform: 'MIT OCW', url: '#' }
      ]
    }
  },
  {
    id: 'webdev',
    title: 'Web Development',
    description: 'Full Stack Development',
    subcategories: [
      {
        id: 'frontend',
        title: 'Frontend',
        resources: {
          blogs: [
            { title: 'React Best Practices', url: '#', author: 'CSS-Tricks' }
          ],
          youtube: [
            { title: 'Frontend Development', channel: 'Traversy Media', url: '#' }
          ],
          courses: [
            { title: 'Frontend Masters', platform: 'Frontend Masters', url: '#' }
          ]
        }
      },
      {
        id: 'backend',
        title: 'Backend',
        resources: {
          blogs: [
            { title: 'REST API Design', url: '#', author: 'Microsoft Docs' }
          ],
          youtube: [
            { title: 'Backend Development', channel: 'Fireship', url: '#' }
          ],
          courses: [
            { title: 'Backend with Node.js', platform: 'The Odin Project', url: '#' }
          ]
        }
      },
      {
        id: 'fullstack',
        title: 'Full Stack',
        resources: {
          blogs: [
            { title: 'MERN Stack Guide', url: '#', author: 'freeCodeCamp' }
          ],
          youtube: [
            { title: 'Full Stack Course', channel: 'Code with Harry', url: '#' }
          ],
          courses: [
            { title: 'Full Stack Open', platform: 'University of Helsinki', url: '#' }
          ]
        }
      }
    ]
  },
  {
    id: 'languages',
    title: 'Programming Languages',
    description: 'Learn Popular Languages',
    subcategories: [
      { id: 'c', title: 'C', resources: { blogs: [{ title: 'C Programming', url: '#', author: 'Learn-C' }], youtube: [{ title: 'C Tutorial', channel: 'Neso Academy', url: '#' }], courses: [{ title: 'C for Everyone', platform: 'Coursera', url: '#' }] } },
      { id: 'cpp', title: 'C++', resources: { blogs: [{ title: 'Modern C++', url: '#', author: 'isocpp.org' }], youtube: [{ title: 'C++ Full Course', channel: 'freeCodeCamp', url: '#' }], courses: [{ title: 'C++ Programming', platform: 'Udacity', url: '#' }] } },
      { id: 'java', title: 'Java', resources: { blogs: [{ title: 'Java Tutorial', url: '#', author: 'Baeldung' }], youtube: [{ title: 'Java Complete Course', channel: 'Telusko', url: '#' }], courses: [{ title: 'Java Programming', platform: 'Coursera', url: '#' }] } },
      { id: 'python', title: 'Python', resources: { blogs: [{ title: 'Python Guide', url: '#', author: 'Real Python' }], youtube: [{ title: 'Python for Beginners', channel: 'Programming with Mosh', url: '#' }], courses: [{ title: 'Python Crash Course', platform: 'Codecademy', url: '#' }] } },
      { id: 'js', title: 'JavaScript', resources: { blogs: [{ title: 'JavaScript.info', url: '#', author: 'javascript.info' }], youtube: [{ title: 'JS Mastery', channel: 'JavaScript Mastery', url: '#' }], courses: [{ title: 'JavaScript Basics', platform: 'freeCodeCamp', url: '#' }] } }
    ]
  }
];

export default function CourseCard() {
  const [view, setView] = useState('main');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesData.map((course) => (
                <div
                  key={course.id}
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
                  {currentResources.blogs.map((blog, idx) => (
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
                  {currentResources.youtube.map((video, idx) => (
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
                  {currentResources.courses.map((course, idx) => (
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