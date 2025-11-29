// src/components/student/PracticeSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Code2, Laptop, ArrowRight } from 'lucide-react';

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
      path: '/aptitude-practice'
    },
    {
      id: 'coding',
      title: 'DSA & Coding',
      desc: 'Solve 50 levels of Data Structures and Algorithms from Basics to Hard.',
      icon: <Code2 className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50',
      border: 'hover:border-blue-500',
      path: '/coding'
    },
    {
      id: 'dev',
      title: 'Full Stack Dev',
      desc: 'Test your knowledge on React, Node.js, SQL, and System Design.',
      icon: <Laptop className="w-8 h-8 text-green-600" />,
      color: 'bg-green-50',
      border: 'hover:border-green-500',
      path: '/dev-practice'
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Practice Arena</h2>
          <p className="text-gray-500 mt-2">Choose a track and start leveling up your skills today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {practices.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`p-8 rounded-2xl border border-gray-100 shadow-sm cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl ${item.border} group bg-white`}
            >
              <div className={`w-16 h-16 rounded-xl ${item.color} flex items-center justify-center mb-6 transition-colors group-hover:scale-110 duration-300`}>
                {item.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-500 mb-6 leading-relaxed">
                {item.desc}
              </p>
              
              <div className="flex items-center font-semibold text-gray-900 group-hover:text-blue-600">
                Start Practicing <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PracticeSection;