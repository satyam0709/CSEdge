import React, { useState } from 'react';

export const Companies = () => {
  // Navigation State: 'categories' | 'companies'
  const [view, setView] = useState('categories');
  const [activeSection, setActiveSection] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const sections = [
    {
      id: 0,
      title: "MAANG & Product Giants",
      icon: "⚡",
      description: "Top tier product companies including Google, Meta, and Amazon.",
      gradient: "from-blue-600 via-blue-500 to-indigo-600",
      hoverGradient: "hover:from-blue-700 hover:via-blue-600 hover:to-indigo-700",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
      companies: [
        { name: "Google", url: "https://www.naukri.com/code360/problems?company[]=Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
        { name: "Microsoft", url: "https://www.naukri.com/code360/problems?company[]=Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
        { name: "Amazon", url: "https://www.naukri.com/code360/problems?company[]=Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
        { name: "Meta", url: "https://www.naukri.com/code360/problems?company[]=Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
        { name: "Apple", url: "https://www.naukri.com/code360/problems?company[]=Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
        { name: "Netflix", url: "https://www.naukri.com/code360/problems?company[]=Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
        { name: "Adobe", url: "https://www.naukri.com/code360/problems?company[]=Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.svg" },
        { name: "Uber", url: "https://www.naukri.com/code360/problems?company[]=Uber", logo: "https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg" },
        { name: "Flipkart", url: "https://www.naukri.com/code360/problems?company[]=Flipkart", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Flipkart_logo.svg" },
        { name: "Walmart", url: "https://www.naukri.com/code360/problems?company[]=Walmart", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg" },
        { name: "Salesforce", url: "https://www.naukri.com/code360/problems?company[]=Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
        { name: "Oracle", url: "https://www.naukri.com/code360/problems?company[]=Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
        { name: "LinkedIn", url: "https://www.naukri.com/code360/problems?company[]=LinkedIn", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" },
        { name: "Airbnb", url: "https://www.naukri.com/code360/problems?company[]=Airbnb", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" },
        { name: "Spotify", url: "https://www.naukri.com/code360/problems?company[]=Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
        { name: "Twitter", url: "https://www.naukri.com/code360/problems?company[]=Twitter", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" },
        { name: "Snapchat", url: "https://www.naukri.com/code360/problems?company[]=Snapchat", logo: "https://upload.wikimedia.org/wikipedia/en/a/ad/Snapchat_logo.svg" },
        { name: "ByteDance", url: "https://www.naukri.com/code360/problems?company[]=ByteDance", logo: "https://upload.wikimedia.org/wikipedia/en/a/a9/ByteDance_Logo.svg" },
        { name: "Atlassian", url: "https://www.naukri.com/code360/problems?company[]=Atlassian", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Atlassian_Logo.svg" },
        { name: "SAP", url: "https://www.naukri.com/code360/problems?company[]=SAP", logo: "https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg" }
      ]
    },
    {
      id: 1,
      title: "Fintech & Banking",
      icon: "💼",
      description: "High paying financial institutions and payment gateways.",
      gradient: "from-purple-600 via-purple-500 to-pink-600",
      hoverGradient: "hover:from-purple-700 hover:via-purple-600 hover:to-pink-700",
      textColor: "text-purple-600",
      bgLight: "bg-purple-50",
      companies: [
        { name: "PayPal", url: "https://www.naukri.com/code360/problems?company[]=PayPal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
        { name: "Goldman Sachs", url: "https://www.naukri.com/code360/problems?company[]=Goldman%20Sachs", logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg" },
        { name: "JPMorgan", url: "https://www.naukri.com/code360/problems?company[]=JPMorgan", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/JPMorgan_Chase.svg" },
        { name: "Morgan Stanley", url: "https://www.naukri.com/code360/problems?company[]=Morgan%20Stanley", logo: "https://upload.wikimedia.org/wikipedia/commons/3/34/Morgan_Stanley_Logo_1.svg" },
        { name: "Visa", url: "https://www.naukri.com/code360/problems?company[]=Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
        { name: "Mastercard", url: "https://www.naukri.com/code360/problems?company[]=Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" },
        { name: "American Express", url: "https://www.naukri.com/code360/problems?company[]=American%20Express", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" },
        { name: "Deutsche Bank", url: "https://www.naukri.com/code360/problems?company[]=Deutsche%20Bank", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Deutsche_Bank_logo_without_wordmark.svg" },
        { name: "Paytm", url: "https://www.naukri.com/code360/problems?company[]=Paytm", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" },
        { name: "PhonePe", url: "https://www.naukri.com/code360/problems?company[]=PhonePe", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/PhonePe_Logo.svg" },
        { name: "Razorpay", url: "https://www.naukri.com/code360/problems?company[]=Razorpay", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" },
        { name: "Stripe", url: "https://www.naukri.com/code360/problems?company[]=Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
        { name: "Square", url: "https://www.naukri.com/code360/problems?company[]=Square", logo: "https://upload.wikimedia.org/wikipedia/commons/1/12/Square%2C_Inc._logo.svg" },
        { name: "Robinhood", url: "https://www.naukri.com/code360/problems?company[]=Robinhood", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Robinhood_Markets_Logo.svg" },
        { name: "Coinbase", url: "https://www.naukri.com/code360/problems?company[]=Coinbase", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Coinbase.svg" },
        { name: "Cred", url: "https://www.naukri.com/code360/problems?company[]=CRED", logo: "https://upload.wikimedia.org/wikipedia/commons/3/32/CRED_Logo.png" }
      ]
    },
    {
      id: 2,
      title: "Service Based & IT Giants",
      icon: "🎯",
      description: "Mass recruiters and consultancy giants.",
      gradient: "from-slate-700 via-slate-600 to-gray-800",
      hoverGradient: "hover:from-slate-800 hover:via-slate-700 hover:to-gray-900",
      textColor: "text-slate-700",
      bgLight: "bg-slate-50",
      companies: [
        { name: "TCS", url: "https://www.naukri.com/code360/problems?company[]=TCS", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg" },
        { name: "Infosys", url: "https://www.naukri.com/code360/problems?company[]=Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
        { name: "Wipro", url: "https://www.naukri.com/code360/problems?company[]=Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
        { name: "Accenture", url: "https://www.naukri.com/code360/problems?company[]=Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
        { name: "Cognizant", url: "https://www.naukri.com/code360/problems?company[]=Cognizant", logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg" },
        { name: "Capgemini", url: "https://www.naukri.com/code360/problems?company[]=Capgemini", logo: "https://upload.wikimedia.org/wikipedia/commons/9/98/Capgemini_Logo_2023.svg" },
        { name: "IBM", url: "https://www.naukri.com/code360/problems?company[]=IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
        { name: "HCL", url: "https://www.naukri.com/code360/problems?company[]=HCL", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/HCL_Technologies_logo.svg" },
        { name: "Deloitte", url: "https://www.naukri.com/code360/problems?company[]=Deloitte", logo: "https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg" },
        { name: "Tech Mahindra", url: "https://www.naukri.com/code360/problems?company[]=Tech%20Mahindra", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Tech_Mahindra_New_Logo.svg" },
        { name: "LTIMindtree", url: "https://www.naukri.com/code360/problems?company[]=LTIMindtree", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/LTIMindtree_logo.svg" },
        { name: "Mphasis", url: "https://www.naukri.com/code360/problems?company[]=Mphasis", logo: "https://upload.wikimedia.org/wikipedia/commons/6/66/Mphasis_logo.svg" },
        { name: "Persistent", url: "https://www.naukri.com/code360/problems?company[]=Persistent%20Systems", logo: "https://upload.wikimedia.org/wikipedia/commons/5/58/Persistent_Systems_logo.svg" },
        { name: "Coforge", url: "https://www.naukri.com/code360/problems?company[]=Coforge", logo: "https://upload.wikimedia.org/wikipedia/commons/6/63/Coforge_Logo.svg" },
        { name: "Hexaware", url: "https://www.naukri.com/code360/problems?company[]=Hexaware", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Hexaware_logo.svg" },
        { name: "Nagarro", url: "https://www.naukri.com/code360/problems?company[]=Nagarro", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Nagarro_logo.svg" },
        { name: "Thoughtworks", url: "https://www.naukri.com/code360/problems?company[]=ThoughtWorks", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Thoughtworks_logo.svg" },
        { name: "EPAM Systems", url: "https://www.naukri.com/code360/problems?company[]=EPAM", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1c/EPAM_logo.svg" }
      ]
    },
    {
      id: 3,
      title: "E-commerce & Food Tech",
      icon: "🛒",
      description: "Fast paced startups and delivery giants.",
      gradient: "from-orange-600 via-orange-500 to-amber-600",
      hoverGradient: "hover:from-orange-700 hover:via-orange-600 hover:to-amber-700",
      textColor: "text-orange-600",
      bgLight: "bg-orange-50",
      companies: [
        { name: "Swiggy", url: "https://www.naukri.com/code360/problems?company[]=Swiggy", logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg" },
        { name: "Zomato", url: "https://www.naukri.com/code360/problems?company[]=Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png" },
        { name: "Meesho", url: "https://www.naukri.com/code360/problems?company[]=Meesho", logo: "https://upload.wikimedia.org/wikipedia/commons/6/66/Meesho_Logo.png" },
        { name: "Myntra", url: "https://www.naukri.com/code360/problems?company[]=Myntra", logo: "https://upload.wikimedia.org/wikipedia/en/d/d5/Myntra_logo.png" },
        { name: "Dunzo", url: "https://www.naukri.com/code360/problems?company[]=Dunzo", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Dunzo_logo.png" },
        { name: "Urban Company", url: "https://www.naukri.com/code360/problems?company[]=Urban%20Company", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Urban_Company_Logo.svg" },
        { name: "BigBasket", url: "https://www.naukri.com/code360/problems?company[]=BigBasket", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Bigbasket_logo.png" },
        { name: "Blinkit", url: "https://www.naukri.com/code360/problems?company[]=Grofers", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Blinkit-yellow-rounded_logo.svg" },
        { name: "Zepto", url: "https://www.naukri.com/code360/problems?company[]=Zepto", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Zepto_logo.png" },
        { name: "Instacart", url: "https://www.naukri.com/code360/problems?company[]=Instacart", logo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Instacart_logo_and_wordmark.svg" }
      ]
    }
  ];

  // --- Handlers ---
  const handleSectionClick = (section) => {
    setActiveSection(section);
    setView('companies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompanyClick = (company) => {
    // Directly open the company's question page in a new tab
    window.open(company.url, '_blank', 'noopener,noreferrer');
  };

  const handleBack = () => {
    setView('categories');
    setActiveSection(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Render Views ---

  // 1. Categories View (Home)
  const renderCategories = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      {sections.map((section) => (
        <div 
          key={section.id}
          onClick={() => handleSectionClick(section)}
          className="group cursor-pointer bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-2 relative overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${section.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${section.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                {section.icon}
              </div>
              <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:${section.gradient} transition-all`}>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 transition-all">
              {section.title}
            </h3>
            
            <p className="text-gray-500 mb-6 leading-relaxed">
              {section.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold ${section.textColor} px-4 py-2 rounded-full ${section.bgLight}`}>
                {section.companies.length} Companies
              </span>
              <span className="text-xs text-gray-400 font-medium">Click to explore →</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // 2. Companies View (Grid)
  const renderCompanies = () => (
    <div className="max-w-7xl mx-auto">
      {/* Section Header */}
      <div className={`rounded-3xl p-8 mb-10 text-white shadow-2xl bg-gradient-to-r ${activeSection.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="text-5xl bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl">
            {activeSection.icon}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-black mb-2">{activeSection.title}</h2>
            <p className="text-white/90 text-sm sm:text-base">
              Click any company card below to access their Coding Ninjas problem set
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="font-bold text-sm">{activeSection.companies.length} Companies</span>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {activeSection.companies.map((company, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCompanyClick(company)}
            className={`
              group relative cursor-pointer bg-white rounded-2xl h-48
              border-2 transition-all duration-300 flex flex-col items-center justify-center p-6
              transform hover:-translate-y-2
              ${hoveredCard === index 
                ? `shadow-2xl scale-105 z-10` 
                : 'border-gray-100 shadow-md hover:border-gray-200'
              }
            `}
            style={{
              borderColor: hoveredCard === index ? activeSection.textColor.replace('text-', '') : undefined
            }}
          >
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${activeSection.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
            
            {/* Logo */}
            <div className="relative w-full h-20 flex items-center justify-center mb-4">
              <img 
                src={company.logo} 
                alt={`${company.name} logo`}
                className={`
                  max-h-full max-w-full object-contain transition-all duration-300
                  ${hoveredCard === index ? 'scale-110 filter-none' : 'filter grayscale opacity-70 group-hover:opacity-90'}
                `}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${company.name}&size=128&background=random`;
                }}
              />
            </div>
            
            {/* Company Name */}
            <h4 className={`
              font-bold text-center text-sm transition-colors duration-300 relative z-10
              ${hoveredCard === index ? activeSection.textColor : 'text-gray-600 group-hover:text-gray-800'}
            `}>
              {company.name}
            </h4>
            
            {/* Click to Practice Badge */}
            {hoveredCard === index && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full text-center">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${activeSection.bgLight} ${activeSection.textColor}`}>
                  Solve on Code360
                </span>
              </div>
            )}
            
            {/* Arrow Indicator */}
            <div className={`
              absolute top-3 right-3 w-7 h-7 rounded-full bg-gradient-to-r ${activeSection.gradient}
              flex items-center justify-center opacity-0 group-hover:opacity-100
              transition-all duration-300 transform group-hover:scale-110
            `}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
      
      {/* Info Card */}
      <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-5xl">🎯</div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-black mb-2">Start Your Journey</h3>
            <p className="text-gray-300">
              These companies have free question sets available on Coding Ninjas (Naukri Code360). 
              Click any card to access their interview question collections directly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold">Code360 Links Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative'>
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className='relative z-10 pt-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
        {/* Navigation Header */}
        <div className="mb-12">
          {view === 'companies' && (
            <button 
              onClick={handleBack}
              className="mb-8 flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-all font-bold group"
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center group-hover:border-gray-400 group-hover:shadow-lg transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-lg">Back to Categories</span>
            </button>
          )}

          {view === 'categories' && (
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6 border border-blue-200">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-gray-700">70+ Companies • Coding Ninjas Studio</span>
              </div>
              
              <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6'>
                <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Company-Wise
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Coding Archives
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
                Practice company-specific interview questions directly from Coding Ninjas (Code360)
              </p>
            </div>
          )}
        </div>

        {/* View Content */}
        <div className="animate-fade-in-up">
          {view === 'categories' && renderCategories()}
          {view === 'companies' && renderCompanies()}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 10px) scale(1.05); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
      `}</style>
    </div>
  );
};