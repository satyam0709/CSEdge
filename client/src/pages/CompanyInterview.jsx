import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ChevronLeft } from "lucide-react";

export default function CompanyInterview() {
  const navigate = useNavigate();

  const companies = [
    {
      id: "microsoft",
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    },
    {
      id: "google",
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
      id: "meta",
      name: "Meta",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/1920px-Meta_Platforms_Inc._logo.svg.png",
    },
    {
      id: "amazon",
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    },
    {
      id: "apple",
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
    },
    {
      id: "netflix",
      name: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    },
    {
      id: "uber",
      name: "Uber",
      logo: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-indigo-600 font-semibold transition-colors mb-4"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl">
              <Building2 size={32} className="text-orange-600" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">
                Company Interview Resources
              </h1>
              <p className="text-gray-600 mt-1">
                Read articles and resources from top tech companies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <button
              key={company.id}
              onClick={() => navigate(`/company/${company.id}`)}
              className="group bg-white p-8 rounded-xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all text-left"
            >
              {/* Logo */}
              <div className="mb-4 h-16 flex items-center">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="company-logo"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/fallback-logo.png";
                  }}
                />
              </div>

              {/* Company name */}
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {company.name}
              </h3>

              <p className="text-gray-600 mt-3 text-sm">
                Click to add articles and read resources
              </p>

              <div className="mt-6 inline-flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                View Resources →
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
