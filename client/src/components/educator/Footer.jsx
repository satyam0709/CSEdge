import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left Section - Logo & Text */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-2">
            <img src={assets.logo} alt="CSEdge logo" className="w-10 h-10" />
            <h2 className="text-xl font-semibold text-white">CSEdge</h2>
          </div>
          <p className="text-sm text-gray-400">
            Copyright © 2025 CSEdge. All Rights Reserved.
          </p>
        </div>

        {/* Right Section - Social Icons */}
        <div className="flex gap-5 mt-5 md:mt-0">
          <a href="#" className="hover:scale-110 transition-transform duration-200">
            <img src={assets.facebook_icon} alt="Facebook" className="w-6 h-6" />
          </a>
          <a href="#" className="hover:scale-110 transition-transform duration-200">
            <img src={assets.twitter_icon} alt="Twitter" className="w-6 h-6" />
          </a>
          <a href="#" className="hover:scale-110 transition-transform duration-200">
            <img src={assets.instagram_icon} alt="Instagram" className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-500">
        Made with ❤️ by CSEdge Team
      </div>
    </footer>
  );
};

export default Footer;
