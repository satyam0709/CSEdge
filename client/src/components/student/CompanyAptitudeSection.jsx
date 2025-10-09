import React, { useState } from 'react';
import { Search, Building2, TrendingUp, Users, ChevronLeft, Clock, CheckCircle, XCircle, BookOpen, Target } from 'lucide-react';

const CompanyAptitudeSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  
  const companies = [
    { 
      id: 1,
      name: 'TCS', 
      logo: '🏢', 
      category: 'IT Services',
      description: 'Tata Consultancy Services - Leading IT Services Company',
      totalTests: 4,
      categories: [
        {
          id: 'quant',
          name: 'Quantitative Aptitude',
          icon: '📊',
          description: 'Numbers, Percentage, Profit & Loss, Time & Work',
          questionCount: 50,
          duration: 30,
          questions: [
            {
              id: 1,
              question: "If A can complete a work in 10 days and B can complete it in 15 days, how many days will they take working together?",
              options: ["5 days", "6 days", "7.5 days", "8 days"],
              correctAnswer: 1,
              explanation: "Combined work rate = 1/10 + 1/15 = 1/6. So they complete the work in 6 days.",
              difficulty: "Medium"
            },
            {
              id: 2,
              question: "A sum of ₹1200 is lent at 10% per annum compound interest. What is the amount after 2 years?",
              options: ["₹1452", "₹1440", "₹1460", "₹1480"],
              correctAnswer: 0,
              explanation: "Amount = P(1+R/100)^n = 1200(1.1)² = ₹1452",
              difficulty: "Medium"
            },
            {
              id: 3,
              question: "The average of 5 consecutive odd numbers is 27. What is the largest number?",
              options: ["29", "31", "33", "35"],
              correctAnswer: 1,
              explanation: "If average is 27, middle number is 27. Numbers are 23,25,27,29,31. Largest is 31",
              difficulty: "Easy"
            }
          ]
        },
        {
          id: 'reasoning',
          name: 'Logical Reasoning',
          icon: '🧠',
          description: 'Pattern Recognition, Series, Blood Relations',
          questionCount: 40,
          duration: 25,
          questions: [
            {
              id: 1,
              question: "What comes next in the series: 2, 6, 12, 20, 30, ?",
              options: ["40", "42", "44", "46"],
              correctAnswer: 1,
              explanation: "The differences are 4, 6, 8, 10, 12... So next is 30 + 12 = 42",
              difficulty: "Medium"
            },
            {
              id: 2,
              question: "If CODING is written as DPEIJH, how is RIDING written?",
              options: ["SJEJOH", "SJEIJH", "SJFJOH", "SIEJOH"],
              correctAnswer: 0,
              explanation: "Each letter is shifted by +1. R→S, I→J, D→E, I→J, N→O, G→H",
              difficulty: "Easy"
            },
            {
              id: 3,
              question: "Pointing to a photograph, a man said 'She is the daughter of my grandfather's only son'. Who is she to him?",
              options: ["Sister", "Daughter", "Mother", "Niece"],
              correctAnswer: 1,
              explanation: "Grandfather's only son = His father. So she is his father's daughter = His sister or daughter",
              difficulty: "Hard"
            }
          ]
        },
        {
          id: 'coding',
          name: 'Coding Questions',
          icon: '💻',
          description: 'Programming Logic, Output Prediction, Debugging',
          questionCount: 30,
          duration: 35,
          questions: [
            {
              id: 1,
              question: "What is the output of: int x = 5; System.out.println(++x + x++);",
              options: ["11", "12", "13", "10"],
              correctAnswer: 1,
              explanation: "++x makes x=6, then 6+6=12, then x++ makes x=7. Output is 12",
              difficulty: "Medium"
            },
            {
              id: 2,
              question: "Which data structure uses LIFO principle?",
              options: ["Queue", "Stack", "Array", "Tree"],
              correctAnswer: 1,
              explanation: "Stack follows Last In First Out (LIFO) principle",
              difficulty: "Easy"
            },
            {
              id: 3,
              question: "Time complexity of binary search is:",
              options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
              correctAnswer: 1,
              explanation: "Binary search divides the search space in half each time, giving O(log n)",
              difficulty: "Easy"
            }
          ]
        },
        {
          id: 'verbal',
          name: 'Verbal Ability',
          icon: '📝',
          description: 'Grammar, Vocabulary, Reading Comprehension',
          questionCount: 35,
          duration: 20,
          questions: [
            {
              id: 1,
              question: "Choose the correct synonym for 'METICULOUS':",
              options: ["Careful", "Careless", "Fast", "Lazy"],
              correctAnswer: 0,
              explanation: "Meticulous means showing great attention to detail; very careful and precise",
              difficulty: "Easy"
            },
            {
              id: 2,
              question: "Fill in the blank: He has been working here _____ 2020.",
              options: ["from", "since", "for", "till"],
              correctAnswer: 1,
              explanation: "'Since' is used with a specific point in time (2020)",
              difficulty: "Easy"
            },
            {
              id: 3,
              question: "Identify the type of sentence: 'What a beautiful day!'",
              options: ["Declarative", "Interrogative", "Exclamatory", "Imperative"],
              correctAnswer: 2,
              explanation: "Exclamatory sentences express strong emotion and end with '!'",
              difficulty: "Easy"
            }
          ]
        }
      ]
    },
    { 
      id: 2,
      name: 'Infosys', 
      logo: '💼', 
      category: 'IT Services',
      description: 'Infosys Limited - Global Technology Services',
      totalTests: 4,
      categories: [
        {
          id: 'quant',
          name: 'Quantitative Aptitude',
          icon: '📊',
          description: 'Mathematical Problems & Calculations',
          questionCount: 45,
          duration: 30,
          questions: [
            {
              id: 1,
              question: "If 20% of a number is 50, what is 40% of that number?",
              options: ["80", "100", "120", "150"],
              correctAnswer: 1,
              explanation: "If 20% = 50, then 100% = 250. So 40% = 100",
              difficulty: "Easy"
            },
            {
              id: 2,
              question: "The average of 5 consecutive numbers is 18. What is the largest number?",
              options: ["18", "19", "20", "21"],
              correctAnswer: 2,
              explanation: "If average is 18, middle number is 18. So numbers are 16,17,18,19,20",
              difficulty: "Medium"
            },
            {
              id: 3,
              question: "A shopkeeper sells an item at 20% profit. If cost price is ₹500, what is selling price?",
              options: ["₹550", "₹600", "₹650", "₹700"],
              correctAnswer: 1,
              explanation: "Selling Price = 500 + (20% of 500) = 500 + 100 = ₹600",
              difficulty: "Easy"
            }
          ]
        },
        {
          id: 'reasoning',
          name: 'Logical Reasoning',
          icon: '🧠',
          description: 'Analytical & Logical Skills',
          questionCount: 40,
          duration: 25,
          questions: []
        },
        {
          id: 'coding',
          name: 'Coding Questions',
          icon: '💻',
          description: 'Problem Solving & Algorithms',
          questionCount: 35,
          duration: 40,
          questions: []
        },
        {
          id: 'verbal',
          name: 'Verbal Ability',
          icon: '📝',
          description: 'English Language Skills',
          questionCount: 30,
          duration: 20,
          questions: []
        }
      ]
    },
    { 
      id: 3,
      name: 'Wipro', 
      logo: '🏭', 
      category: 'IT Services',
      description: 'Wipro Technologies - IT Services & Consulting',
      totalTests: 4,
      categories: []
    },
    { 
      id: 4,
      name: 'Accenture', 
      logo: '🎯', 
      category: 'Consulting',
      description: 'Accenture - Professional Services Company',
      totalTests: 4,
      categories: []
    },
    { 
      id: 5,
      name: 'Cognizant', 
      logo: '⚡', 
      category: 'IT Services',
      description: 'Cognizant Technology Solutions',
      totalTests: 4,
      categories: []
    },
    { id: 6, name: 'IBM', logo: '🔷', category: 'Technology', totalTests: 4, categories: [] },
    { id: 7, name: 'Google', logo: '🔍', category: 'Tech Giant', totalTests: 4, categories: [] },
    { id: 8, name: 'Microsoft', logo: '🪟', category: 'Tech Giant', totalTests: 4, categories: [] },
    { id: 9, name: 'Amazon', logo: '📦', category: 'E-commerce', totalTests: 4, categories: [] },
    { id: 10, name: 'Capgemini', logo: '💡', category: 'Consulting', totalTests: 4, categories: [] },
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { icon: <Building2 className="w-6 h-6" />, label: 'Companies', value: '50+' },
    { icon: <TrendingUp className="w-6 h-6" />, label: 'Practice Tests', value: '200+' },
    { icon: <Users className="w-6 h-6" />, label: 'Students Placed', value: '25K+' },
  ];

  const handleCompanyClick = (company) => {
    if (company.categories && company.categories.length > 0) {
      setSelectedCompany(company);
      setSelectedCategory(null);
    }
  };

  const handleCategoryClick = (category) => {
    if (category.questions && category.questions.length > 0) {
      setSelectedCategory(category);
      setCurrentQuestion(0);
      setUserAnswers({});
      setShowResults(false);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setUserAnswers({});
    setShowResults(false);
  };

  const handleBackToCompanies = () => {
    setSelectedCompany(null);
    setSelectedCategory(null);
    setUserAnswers({});
    setShowResults(false);
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < selectedCategory.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedCategory.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getScorePercentage = () => {
    return Math.round((calculateScore() / selectedCategory.questions.length) * 100);
  };

  if (selectedCategory && !showResults) {
    const question = selectedCategory.questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <button 
              onClick={handleBackToCategories}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Test Categories
            </button>
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCompany.logo}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedCompany.name}</h2>
                  <p className="text-gray-600">{selectedCategory.name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-600">
                    Question {currentQuestion + 1} of {selectedCategory.questions.length}
                  </span>
                </div>
                <div className="bg-purple-50 px-4 py-1 rounded-lg text-center">
                  <span className="text-xs font-semibold text-purple-600">
                    Difficulty: {question.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <div className="flex items-start gap-3 mb-6">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                {currentQuestion + 1}
              </div>
              <p className="text-lg text-gray-800 leading-relaxed">{question.question}</p>
            </div>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(question.id, index)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    userAnswers[question.id] === index
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      userAnswers[question.id] === index
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300'
                    }`}>
                      {userAnswers[question.id] === index && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 flex-wrap">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex gap-2 flex-wrap justify-center">
              {selectedCategory.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    index === currentQuestion
                      ? 'bg-blue-600 text-white'
                      : userAnswers[selectedCategory.questions[index].id] !== undefined
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === selectedCategory.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length !== selectedCategory.questions.length}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                Submit Test
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = getScorePercentage();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
            <div className="text-6xl mb-4">
              {percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Test Completed!</h2>
            <p className="text-gray-600 mb-6">{selectedCompany.name} - {selectedCategory.name}</p>
            
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-8 mb-6">
              <p className="text-lg mb-2">Your Score</p>
              <p className="text-5xl font-bold mb-2">{score} / {selectedCategory.questions.length}</p>
              <p className="text-2xl">{percentage}%</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{score}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{selectedCategory.questions.length - score}</p>
                <p className="text-sm text-gray-600">Incorrect</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{selectedCategory.questions.length}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setUserAnswers({});
                  setShowResults(false);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry Test
              </button>
              <button
                onClick={handleBackToCategories}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Categories
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Answer Review</h3>
            
            {selectedCategory.questions.map((q, index) => {
              const isCorrect = userAnswers[q.id] === q.correctAnswer;
              
              return (
                <div key={q.id} className="mb-6 pb-6 border-b last:border-b-0">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0 ${
                      isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-3">{q.question}</p>
                      
                      <div className="space-y-2 mb-3">
                        {q.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg ${
                              optIndex === q.correctAnswer
                                ? 'bg-green-50 border-2 border-green-500'
                                : optIndex === userAnswers[q.id] && !isCorrect
                                ? 'bg-red-50 border-2 border-red-500'
                                : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {optIndex === q.correctAnswer && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                              {optIndex === userAnswers[q.id] && !isCorrect && (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                              <span className={
                                optIndex === q.correctAnswer
                                  ? 'text-green-700 font-semibold'
                                  : optIndex === userAnswers[q.id] && !isCorrect
                                  ? 'text-red-700'
                                  : 'text-gray-700'
                              }>
                                {option}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-semibold text-blue-800 mb-1">Explanation:</p>
                        <p className="text-sm text-blue-700">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (selectedCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <button 
              onClick={handleBackToCompanies}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Companies
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-5xl">{selectedCompany.logo}</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{selectedCompany.name}</h2>
                <p className="text-gray-600">{selectedCompany.description}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedCompany.totalTests} Test Categories Available</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Select Test Category</h3>
            
            {selectedCompany.categories && selectedCompany.categories.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {selectedCompany.categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat)}
                    className={`border-2 rounded-xl p-6 transition-all ${
                      cat.questions && cat.questions.length > 0
                        ? 'border-gray-200 hover:border-blue-500 hover:shadow-lg cursor-pointer'
                        : 'border-gray-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{cat.icon}</div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{cat.name}</h4>
                        {cat.description && (
                          <p className="text-sm text-gray-600 mb-3">{cat.description}</p>
                        )}
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1 text-blue-600">
                            <Target className="w-4 h-4" />
                            <span>{cat.questionCount} Questions</span>
                          </div>
                          <div className="flex items-center gap-1 text-purple-600">
                            <Clock className="w-4 h-4" />
                            <span>{cat.duration} mins</span>
                          </div>
                        </div>
                        {cat.questions && cat.questions.length > 0 ? (
                          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                            Start Test
                          </button>
                        ) : (
                          <div className="mt-4 w-full bg-gray-100 text-gray-500 py-2 rounded-lg text-center font-semibold">
                            Coming Soon
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Test categories coming soon for this company!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Company-Wise Aptitude Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Prepare for top company placement exams with curated aptitude tests. Practice company-specific patterns and ace your interviews!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                {stat.icon}
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for companies or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Select a Company
          </h2>
          
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleCompanyClick(company)}
                  className={`group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 ${
                    company.categories && company.categories.length > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                      {company.logo}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{company.category}</p>
                    <div className={`text-xs font-semibold py-1 px-3 rounded-full inline-block ${
                      company.categories && company.categories.length > 0
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {company.categories && company.categories.length > 0
                        ? `${company.totalTests} Tests Available`
                        : 'Coming Soon'
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No companies found matching your search.</p>
            </div>
          )}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Why Practice Company-Wise Questions?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</span>
                Company-Specific Patterns
              </h3>
              <p className="text-blue-100 text-sm">Each company has unique question patterns and difficulty levels. Practice accordingly.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</span>
                Real Interview Questions
              </h3>
              <p className="text-blue-100 text-sm">Questions collected from actual placement drives and interviews.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</span>
                Track Your Progress
              </h3>
              <p className="text-blue-100 text-sm">Monitor your performance and identify areas for improvement.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">✓</span>
                Boost Confidence
              </h3>
              <p className="text-blue-100 text-sm">Regular practice increases your speed and accuracy for the actual test.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAptitudeSection;