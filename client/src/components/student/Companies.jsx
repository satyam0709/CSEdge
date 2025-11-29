import React, { useState } from 'react';

export const Companies = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedSection, setSelectedSection] = useState(0);
  
  const sections = [
    {
      title: "MAANG & Product Giants",
      icon: "⚡",
      accent: "blue",
      companies: [
        { name: "Google", url: "https://www.naukri.com/code360/problem-lists/top-google-coding-interview-questions", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
        { name: "Microsoft", url: "https://www.naukri.com/code360/problem-lists/top-microsoft-coding-interview-questions", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
        { name: "Amazon", url: "https://www.naukri.com/code360/problem-lists/top-amazon-coding-interview-questions", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
        { name: "Meta", url: "https://www.naukri.com/code360/problem-lists/top-facebook-coding-interview-questions", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
        { name: "Apple", url: "https://www.naukri.com/code360/company/apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
        { name: "Netflix", url: "https://www.naukri.com/code360/company/netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
        { name: "Adobe", url: "https://www.naukri.com/code360/company/adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg" },
        { name: "Uber", url: "https://www.naukri.com/code360/company/uber", logo: "https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg" },
        { name: "Flipkart", url: "https://www.naukri.com/code360/company/flipkart", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/Flipkart_logo.svg" },
        { name: "Walmart", url: "https://www.naukri.com/code360/company/walmart", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg" }
      ]
    },
    {
      title: "Fintech & Banking",
      icon: "💼",
      accent: "slate",
      companies: [
        { name: "PayPal", url: "https://www.naukri.com/code360/company/paypal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
        { name: "Goldman Sachs", url: "https://www.naukri.com/code360/company/goldman-sachs", logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg" },
        { name: "JPMorgan", url: "https://www.naukri.com/code360/company/jpmorgan-chase", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/JPMorgan_Chase.svg" },
        { name: "Morgan Stanley", url: "https://www.naukri.com/code360/company/morgan-stanley", logo: "https://upload.wikimedia.org/wikipedia/commons/3/34/Morgan_Stanley_Logo_1.svg" },
        { name: "Visa", url: "https://www.naukri.com/code360/company/visa", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
        { name: "Mastercard", url: "https://www.naukri.com/code360/company/mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
        { name: "American Express", url: "https://www.naukri.com/code360/company/american-express", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" },
        { name: "Deutsche Bank", url: "https://www.naukri.com/code360/company/deutsche-bank", logo: "https://upload.wikimedia.org/wikipedia/commons/8/81/Deutsche_Bank_logo.svg" }
      ]
    },
    {
      title: "Service Based & Mass Recruiters",
      icon: "🎯",
      accent: "gray",
      companies: [
        { name: "TCS", url: "https://www.naukri.com/code360/company/tcs", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg" },
        { name: "Infosys", url: "https://www.naukri.com/code360/company/infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
        { name: "Wipro", url: "https://www.naukri.com/code360/company/wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
        { name: "Accenture", url: "https://www.naukri.com/code360/company/accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
        { name: "Cognizant", url: "https://www.naukri.com/code360/company/cognizant", logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg" },
        { name: "Capgemini", url: "https://www.naukri.com/code360/company/capgemini", logo: "https://upload.wikimedia.org/wikipedia/commons/9/98/Capgemini_Logo_2023.svg" },
        { name: "IBM", url: "https://www.naukri.com/code360/company/ibm", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
        { name: "HCL", url: "https://www.naukri.com/code360/company/hcl-technologies", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/HCL_Technologies_logo.svg" },
        { name: "Deloitte", url: "https://www.naukri.com/code360/company/deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg" },
        { name: "Tech Mahindra", url: "https://www.naukri.com/code360/company/tech-mahindra", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Tech_Mahindra_New_Logo.svg" }
      ]
    }
  ];

  const handleCompanyClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getAccentClasses = (accent) => {
    switch(accent) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-600 to-blue-700',
          hover: 'hover:from-blue-700 hover:to-blue-800',
          border: 'border-blue-200',
          shadow: 'shadow-blue-100',
          text: 'text-blue-600',
          lightBg: 'bg-blue-50'
        };
      case 'slate':
        return {
          bg: 'bg-gradient-to-br from-slate-700 to-slate-900',
          hover: 'hover:from-slate-800 hover:to-black',
          border: 'border-slate-200',
          shadow: 'shadow-slate-100',
          text: 'text-slate-700',
          lightBg: 'bg-slate-50'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-700 to-gray-900',
          hover: 'hover:from-gray-800 hover:to-black',
          border: 'border-gray-200',
          shadow: 'shadow-gray-100',
          text: 'text-gray-700',
          lightBg: 'bg-gray-50'
        };
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 relative overflow-hidden'>
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-96 h-96 border border-gray-200 rounded-full opacity-20"></div>
          <div className="absolute top-40 right-40 w-72 h-72 border border-blue-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-40 left-1/3 w-80 h-80 border border-gray-300 rounded-full opacity-20"></div>
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Content */}
      <div className='relative z-10 pt-20 pb-24 px-6 max-w-7xl mx-auto'>
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-8">
            {/* Main Title with sleek animation */}
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500 opacity-10 blur-3xl rounded-full animate-pulse"></div>
              <h1 className='relative text-6xl md:text-7xl font-black tracking-tight'>
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-black bg-clip-text text-transparent">
                  Company
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent ml-4">
                  Archives
                </span>
              </h1>
            </div>
            
            {/* Subtitle */}
            <p className='mt-6 text-xl text-gray-600 font-medium'>
              Master Technical Interviews with Real Questions from Top Companies
            </p>
          </div>
          
          {/* Stats badges */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">30+ Companies</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-gray-800 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">1000+ Questions</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700">Updated Daily</span>
            </div>
          </div>
        </div>

        {/* Section Tabs - Sleek Design */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1 bg-gray-100 rounded-2xl shadow-inner">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => setSelectedSection(index)}
                className={`
                  px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  ${selectedSection === index 
                    ? 'bg-white text-gray-900 shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <span className="mr-2 text-xl">{section.icon}</span>
                {section.title}
              </button>
            ))}
          </div>
        </div>
        
        {/* Companies Grid */}
        {sections.map((section, secIndex) => {
          const accentClasses = getAccentClasses(section.accent);
          
          return (
            <div 
              key={secIndex} 
              className={`
                transition-all duration-500
                ${selectedSection === secIndex ? 'opacity-100' : 'hidden opacity-0'}
              `}
            >
              {/* Section Container */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Section Header */}
                <div className={`${accentClasses.bg} ${accentClasses.hover} text-white px-8 py-6 transition-colors duration-300`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{section.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold">{section.title}</h3>
                        <p className="text-white/80 text-sm mt-1">Click any company to access their question bank</p>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        {section.companies.length} Companies
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Companies Grid */}
                <div className="p-8 bg-gradient-to-b from-gray-50 to-white">
                  <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6'>
                    {section.companies.map((company, index) => (
                      <div
                        key={index}
                        onMouseEnter={() => setHoveredCard(`${secIndex}-${index}`)}
                        onMouseLeave={() => setHoveredCard(null)}
                        onClick={() => handleCompanyClick(company.url)}
                        className={`
                          relative group cursor-pointer
                          transform transition-all duration-300 ease-out
                          ${hoveredCard === `${secIndex}-${index}` ? 'scale-105 -translate-y-2' : 'scale-100'}
                        `}
                      >
                        {/* Card */}
                        <div className={`
                          relative h-36 bg-white rounded-2xl overflow-hidden
                          border-2 ${hoveredCard === `${secIndex}-${index}` ? 'border-blue-400 shadow-2xl' : 'border-gray-100 shadow-md'}
                          transition-all duration-300
                        `}>
                          {/* Hover Gradient Overlay */}
                          <div className={`
                            absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                          `}></div>
                          
                          {/* Logo Container */}
                          <div className="relative h-full flex flex-col items-center justify-center p-6">
                            {/* Logo with grayscale effect */}
                            <div className="w-full h-16 flex items-center justify-center mb-2">
                              <img 
                                src={company.logo} 
                                alt={company.name}
                                className={`
                                  max-h-full max-w-full object-contain transition-all duration-300
                                  ${hoveredCard === `${secIndex}-${index}` 
                                    ? 'filter-none' 
                                    : 'filter grayscale opacity-70'
                                  }
                                `}
                              />
                            </div>
                            
                            {/* Company Name - Always visible */}
                            <div className="text-center">
                              <p className={`
                                text-sm font-semibold transition-colors duration-300
                                ${hoveredCard === `${secIndex}-${index}` ? 'text-blue-600' : 'text-gray-500'}
                              `}>
                                {company.name}
                              </p>
                            </div>
                          </div>
                          
                          {/* Corner accent */}
                          <div className={`
                            absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-blue-500 to-transparent
                            opacity-0 group-hover:opacity-20 transition-opacity duration-300
                          `}></div>
                          
                          {/* Click indicator */}
                          <div className={`
                            absolute bottom-2 right-2 opacity-0 group-hover:opacity-100
                            transition-opacity duration-300
                          `}>
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom CTA - Minimalist design */}
        <div className="mt-20 text-center">
          <div className="inline-block">
            <div className="bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 rounded-2xl shadow-2xl">
              <p className="text-lg font-semibold mb-1">
                Ready to Excel in Technical Interviews?
              </p>
              <p className="text-gray-300 text-sm">
                Select a company above to start practicing with real interview questions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};