// src/components/student/PracticeSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Code2, Laptop, Building2, ArrowRight, BarChart3 } from 'lucide-react';

const PracticeSection = () => {
  const navigate = useNavigate();

  const practices = [
    {
      id: 'aptitude',
      title: 'Aptitude & Logic',
      desc: 'Master Quantitative, Verbal, and Logical reasoning for placement exams.',
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50',
      border: 'hover:border-purple-500',
      path: '/practice/aptitude'
    },
    {
      id: 'dsa',
      title: 'DSA & Coding',
      desc: 'Solve 50 levels of Data Structures and Algorithms from Basics to Hard.',
      icon: <Code2 className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50',
      border: 'hover:border-blue-500',
      path: '/practice/dsa'
    },
    {
      id: 'dev',
      title: 'Full Stack Dev',
      desc: 'Test your knowledge on React, Node.js, SQL, and System Design.',
      icon: <Laptop className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
      border: 'hover:border-green-500',
      path: '/practice/dev'
    },
    {
      id: 'companies',
      title: 'Company Interview',
      desc: 'Practice real interview questions from top tech companies.',
      icon: <Building2 className="w-8 h-8 text-orange-600" />,
      color: 'bg-orange-50',
      border: 'hover:border-orange-500',
      path: '/practice/companies'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Practice Arena</h2>
          <p className="text-gray-500 mt-2">Choose a track and start leveling up your skills today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {practices.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`p-6 rounded-2xl border border-gray-100 shadow-sm cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${item.border} group bg-white`}
            >
              <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4 transition-colors group-hover:scale-110 duration-300`}>
                {item.icon}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                {item.desc}
              </p>
              
              <div className="flex items-center font-semibold text-gray-700 text-sm group-hover:text-blue-600">
                Start <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
          >
            <BarChart3 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            View Your Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeSection;