import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-pink-100 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            {/* Logo */}
            <div>
              <Link to="/" className="flex items-center py-4 sm:py-5 px-2 group">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg flex items-center justify-center mr-3 transform group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">K</span>
                  </div>
                  <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent group-hover:from-pink-700 group-hover:to-blue-700 transition-all duration-300">Kairos博客</span>
                </div>
              </Link>
            </div>

            {/* Primary Nav */}
            <div className="hidden md:flex items-center space-x-1">
              <Link 
                to="/" 
                className={`relative py-4 sm:py-5 px-4 transition-all duration-300 group ${
                  isActive('/') 
                    ? 'text-pink-600' 
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                <span className="relative z-10">首页</span>
                {isActive('/') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 animate-fade-in-up"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/about" 
                className={`relative py-4 sm:py-5 px-4 transition-all duration-300 group ${
                  isActive('/about') 
                    ? 'text-pink-600' 
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                <span className="relative z-10">关于</span>
                {isActive('/about') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 animate-fade-in-up"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/blog" 
                className={`relative py-4 sm:py-5 px-4 transition-all duration-300 group ${
                  isActive('/blog') 
                    ? 'text-pink-600' 
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                <span className="relative z-10">博客</span>
                {isActive('/blog') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 animate-fade-in-up"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              className="outline-none mobile-menu-button p-2 rounded-lg hover:bg-pink-50 transition-all duration-300 transform hover:scale-110" 
              onClick={toggleMenu}
              aria-label="切换菜单"
            >
              <svg
                className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-pink-600 transition-all duration-300 ${
                  isMenuOpen ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${
        isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
      } md:hidden bg-white/95 backdrop-blur-md border-t border-pink-100 overflow-hidden transition-all duration-300 ease-in-out`}>
        <div className="py-2">
          <Link 
            to="/" 
            className={`block py-3 px-4 mx-2 rounded-lg text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
              isActive('/') 
                ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 hover:text-pink-600'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              首页
            </div>
          </Link>
          <Link 
            to="/about" 
            className={`block py-3 px-4 mx-2 rounded-lg text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
              isActive('/about') 
                ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 hover:text-pink-600'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              关于
            </div>
          </Link>
          <Link 
            to="/blog" 
            className={`block py-3 px-4 mx-2 rounded-lg text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
              isActive('/blog') 
                ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 hover:text-pink-600'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              博客
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;