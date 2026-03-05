import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

// ─── All company groups data ──────────────────────────────────────────────────
const GROUPS = [
  {
    id: "maang",
    name: "MAANG & Product Giants",
    description: "Top tier product companies including Google, Meta, and Amazon.",
    icon: "⚡",
    gradient: "from-blue-500 to-indigo-600",
    badge: "bg-blue-100 text-blue-700",
    companies: [
      { id: "google",    name: "Google",    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
      { id: "microsoft", name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
      { id: "amazon",    name: "Amazon",    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
      { id: "meta",      name: "Meta",      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1920px-Meta_Platforms_Inc._logo.svg.png" },
      { id: "apple",     name: "Apple",     logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
      { id: "netflix",   name: "Netflix",   logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
      { id: "uber",      name: "Uber",      logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" },
      { id: "linkedin",  name: "LinkedIn",  logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" },
      { id: "airbnb",    name: "Airbnb",    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" },
      { id: "twitter",   name: "Twitter",   logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" },
    ],
  },
  {
    id: "fintech",
    name: "Fintech & Banking",
    description: "High paying financial institutions and payment gateways.",
    icon: "💼",
    gradient: "from-purple-500 to-pink-600",
    badge: "bg-purple-100 text-purple-700",
    companies: [
      { id: "stripe",   name: "Stripe",   logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
      { id: "paypal",   name: "PayPal",   logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" },
      { id: "razorpay", name: "Razorpay", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" },
      { id: "paytm",    name: "Paytm",    logo: "https://upload.wikimedia.org/wikipedia/commons/4/42/Paytm_logo.png" },
      { id: "zerodha",  name: "Zerodha",  logo: "https://zerodha.com/static/images/logo.svg" },
      { id: "phonepe",  name: "PhonePe",  logo: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" },
    ],
  },
  {
    id: "startups",
    name: "Unicorn Startups",
    description: "Fast-growing unicorns and top Indian startups.",
    icon: "🦄",
    gradient: "from-orange-400 to-red-500",
    badge: "bg-orange-100 text-orange-700",
    companies: [
      { id: "swiggy", name: "Swiggy",  logo: "https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg" },
      { id: "zomato", name: "Zomato",  logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png" },
      { id: "byju",   name: "BYJU'S",  logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Byjus_logo.png" },
      { id: "ola",    name: "Ola",     logo: "https://upload.wikimedia.org/wikipedia/commons/1/10/Ola_Cabs_logo.svg" },
      { id: "cred",   name: "CRED",    logo: "https://upload.wikimedia.org/wikipedia/commons/1/17/CRED_logo.png" },
      { id: "meesho", name: "Meesho",  logo: "https://upload.wikimedia.org/wikipedia/commons/7/73/Meesho_Logo.svg" },
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce & Retail",
    description: "Biggest online retail platforms and marketplaces.",
    icon: "🛒",
    gradient: "from-yellow-400 to-orange-500",
    badge: "bg-yellow-100 text-yellow-700",
    companies: [
      { id: "amazon",   name: "Amazon",   logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
      { id: "flipkart", name: "Flipkart", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Flipkart_logo_%28CMYK%29.svg" },
      { id: "walmart",  name: "Walmart",  logo: "https://upload.wikimedia.org/wikipedia/commons/1/14/Walmart_Spark.svg" },
      { id: "shopify",  name: "Shopify",  logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" },
      { id: "ebay",     name: "eBay",     logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" },
      { id: "myntra",   name: "Myntra",   logo: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Myntra-logo.jpg" },
    ],
  },
  {
    id: "cloud",
    name: "Cloud & Infrastructure",
    description: "Cloud providers and DevOps powerhouses.",
    icon: "☁️",
    gradient: "from-sky-400 to-blue-600",
    badge: "bg-sky-100 text-sky-700",
    companies: [
      { id: "aws",        name: "AWS",          logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
      { id: "gcp",        name: "Google Cloud", logo: "https://upload.wikimedia.org/wikipedia/commons/0/01/Google-cloud-platform.svg" },
      { id: "azure",      name: "Azure",        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg" },
      { id: "oracle",     name: "Oracle",       logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
      { id: "salesforce", name: "Salesforce",   logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
      { id: "ibm",        name: "IBM",          logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    ],
  },
  {
    id: "social",
    name: "Social & Entertainment",
    description: "Social media, streaming and entertainment platforms.",
    icon: "🎬",
    gradient: "from-pink-500 to-rose-600",
    badge: "bg-pink-100 text-pink-700",
    companies: [
      { id: "youtube",   name: "YouTube",   logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" },
      { id: "instagram", name: "Instagram", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" },
      { id: "snapchat",  name: "Snapchat",  logo: "https://upload.wikimedia.org/wikipedia/en/a/ad/Snapchat_logo.svg" },
      { id: "spotify",   name: "Spotify",   logo: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
      { id: "discord",   name: "Discord",   logo: "https://upload.wikimedia.org/wikipedia/commons/9/98/Discord_logo.svg" },
    ],
  },
];

export default function CompanyInterview() {
  const navigate = useNavigate();

  // null = show category list  |  object = show that group's companies
  const [activeGroup, setActiveGroup] = useState(null);

  // ── Scroll to top whenever view changes ──────────────────────────────────
  const showGroup = (group) => {
    window.scrollTo(0, 0);
    setActiveGroup(group);
  };

  const goBack = () => {
    window.scrollTo(0, 0);
    setActiveGroup(null);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW A — Category list
  // ══════════════════════════════════════════════════════════════════════════
  if (!activeGroup) {
    return (
      // pt-20 matches the student navbar height (same as CourseList, Hero, etc.)
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">

        {/* Hero text */}
        <div className="text-center pt-10 pb-8 px-6">
          <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            70+ Companies • Interview Prep
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
            Company-Wise
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Coding Archives
            </span>
          </h1>
          <p className="text-gray-500 mt-4 text-base max-w-xl mx-auto">
            Practice company-specific interview questions from top tech companies
          </p>
        </div>

        {/* Category cards grid */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {GROUPS.map((group) => (
              <button
                key={group.id}
                onClick={() => showGroup(group)}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm p-7 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col gap-4 relative"
              >
                {/* Arrow icon */}
                <ChevronRight
                  size={20}
                  className="absolute top-5 right-5 text-gray-300 group-hover:text-indigo-500 transition-colors"
                />

                {/* Category icon */}
                <div className={`w-14 h-14 bg-gradient-to-br ${group.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                  {group.icon}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1.5">{group.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{group.description}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${group.badge}`}>
                    {group.companies.length} Companies
                  </span>
                  <span className="text-sm text-gray-400 group-hover:text-indigo-500 transition-colors font-medium">
                    Click to explore →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // VIEW B — Companies inside selected group
  // ══════════════════════════════════════════════════════════════════════════
  return (
    // pt-20 matches the student navbar height
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-20">

      {/* Back button bar — NOT sticky, no z-index conflict */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-semibold transition-colors text-sm"
          >
            <ChevronLeft size={18} />
            Back to Categories
          </button>
        </div>
      </div>

      {/* Group hero banner */}
      <div className={`bg-gradient-to-br ${activeGroup.gradient} text-white`}>
        <div className="max-w-6xl mx-auto px-6 py-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow flex-shrink-0">
            {activeGroup.icon}
          </div>
          <div>
            <h1 className="text-3xl font-black">{activeGroup.name}</h1>
            <p className="text-white/80 text-sm mt-1">{activeGroup.description}</p>
            <span className="inline-block mt-2 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
              {activeGroup.companies.length} Companies
            </span>
          </div>
        </div>
      </div>

      {/* Companies grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs text-gray-400 mb-6 font-semibold uppercase tracking-widest">
          Click any company to view & add interview resources
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {activeGroup.companies.map((company) => (
            <button
              key={company.id}
              onClick={() => navigate(`/company/${company.id}`)}
              className="group bg-white rounded-xl border border-gray-200 p-5 flex flex-col items-center gap-3 hover:shadow-md hover:border-indigo-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Logo */}
              <div className="h-12 w-full flex items-center justify-center">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-h-10 max-w-[110px] w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    // Show letter avatar fallback
                    const fb = e.target.parentElement.querySelector(".fallback");
                    if (fb) fb.style.display = "flex";
                  }}
                />
                <div className="fallback w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-black text-lg items-center justify-center hidden">
                  {company.name[0]}
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors text-center leading-tight">
                {company.name}
              </p>
            </button>
          ))}
        </div>

        {/* Info footer */}
        <div className={`mt-12 bg-gradient-to-br ${activeGroup.gradient} rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4`}>
          <div className="text-3xl flex-shrink-0">{activeGroup.icon}</div>
          <div className="text-white flex-1">
            <p className="font-bold text-lg">Start Your Journey</p>
            <p className="text-white/80 text-sm mt-1">
              Click any company card to add articles, resources and manage interview prep material.
            </p>
          </div>
          <a
            href="https://www.naukri.com/code360/problems"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Code360 <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}