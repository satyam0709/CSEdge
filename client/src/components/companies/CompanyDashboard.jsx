// src/components/companies/CompanyDashboard.jsx
import React, { useState } from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import axios from '../../utils/axios';
import CodingTest from '../coding/CodingTest'; // REUSING YOUR EXISTING COMPONENT

const CompanyDashboard = () => {
  const [activeCompany, setActiveCompany] = useState(null);
  const [questions, setQuestions] = useState([]);

  if (activeCompany) {
    const mockLevel = {
      id: activeCompany.id,
      name: activeCompany.name,
      topic: "Previous Year Questions",
      difficulty: "Interview",
      requiredScore: 50,
      timeLimit: 1800 // 30 mins
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <button 
          onClick={() => setActiveCompany(null)}
          className="mb-4 ml-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Back to Companies
        </button>
        <CodingTest 
          level={mockLevel}
          questions={questions}
          onComplete={(res) => alert(`You scored ${res.score} points!`)}
          onExit={() => setActiveCompany(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-full bg-blue-50 mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">Target Your Dream Company</h1>
          <p className="text-xl text-gray-500 mt-4">Practice real interview questions asked by top tech giants.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { id: 'google', name: 'Google', color: 'text-blue-600' },
            { id: 'amazon', name: 'Amazon', color: 'text-orange-600' },
            { id: 'microsoft', name: 'Microsoft', color: 'text-green-600' }
          ].map((company) => (
            <div 
              key={company.id}
              onClick={async () => {
                try {
                  const { data } = await axios.get('/api/test/questions', { params: { type: 'dev', level: 1, limit: 10 } });
                  if (data.success) setQuestions(data.questions.map(q => ({ id: q._id, question: q.question, options: q.options })));
                } catch (err) { console.error(err); }
                setActiveCompany(company);
              }}
              className="group relative bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              
              <div className="p-8">
                <div className="h-16 flex items-center mb-6">
                  {/* If you have real logos use <img>, else text fallback */}
                   <h3 className={`text-2xl font-bold ${company.color}`}>{company.name}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span>Coding Rounds</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <span>Technical Interview</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  Start Practice <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;