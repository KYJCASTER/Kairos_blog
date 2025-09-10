import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-1000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-600"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 主标题区域 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              欢迎来到Kairos的博客
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            分享技术见解，记录成长历程
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
            <Link 
              to="/blog" 
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse-glow"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              阅读博客
            </Link>
            <Link 
              to="/about" 
              className="inline-flex items-center px-8 py-3 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-pink-300 hover:text-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              了解我
            </Link>
          </div>
        </div>

        {/* 关于我 */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-pink-100 animate-fade-in-scale animation-delay-600">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <span className="text-white text-3xl font-bold">K</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">关于我</h2>
              <p className="text-gray-600 leading-relaxed">
                我是Kairos，河南大学网络工程专业的学生。热爱技术，喜欢探索新的编程语言和框架。
                这个博客是我分享学习心得、技术见解和生活感悟的地方。
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-left animation-delay-800">
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">前端开发</h3>
                <p className="text-sm text-gray-600">React, Vue, TypeScript</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up animation-delay-1000">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">后端开发</h3>
                <p className="text-sm text-gray-600">Node.js, Python, Java</p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-right animation-delay-1200">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">数据分析</h3>
                <p className="text-sm text-gray-600">Python, SQL, 机器学习</p>
              </div>
            </div>
          </div>
        </div>

        {/* 最新博客 */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up animation-delay-800">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">最新博客</h2>
            <p className="text-gray-600">分享最新的技术见解和学习心得</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 博客卡片 1 */}
            <article className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-pink-100 overflow-hidden animate-fade-in-scale animation-delay-1000">
              <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-500 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-sm font-medium">React开发</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-pink-600 transition-colors duration-200">
                  React Hooks 最佳实践
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  深入探讨React Hooks的使用技巧和最佳实践，包括useState、useEffect等常用Hook的优化方法...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">2024年1月15日</span>
                  <Link to="/blog" className="text-pink-500 hover:text-pink-600 text-sm font-medium transition-colors duration-200">
                    阅读更多 →
                  </Link>
                </div>
              </div>
            </article>

            {/* 博客卡片 2 */}
            <article className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-blue-100 overflow-hidden animate-fade-in-scale animation-delay-1200">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-cyan-500 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-sm font-medium">网络工程</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-200">
                  网络协议深度解析
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  从TCP/IP协议栈到HTTP/HTTPS，全面解析网络通信的底层原理和实现机制...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">2024年1月10日</span>
                  <Link to="/blog" className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200">
                    阅读更多 →
                  </Link>
                </div>
              </div>
            </article>

            {/* 博客卡片 3 */}
            <article className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-purple-100 overflow-hidden animate-fade-in-scale animation-delay-1400">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-sm font-medium">学习心得</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-purple-600 transition-colors duration-200">
                  大学生活与技术成长
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  分享在河南大学学习网络工程专业的心得体会，以及如何平衡学业与技术提升...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">2024年1月5日</span>
                  <Link to="/blog" className="text-purple-500 hover:text-purple-600 text-sm font-medium transition-colors duration-200">
                    阅读更多 →
                  </Link>
                </div>
              </div>
            </article>
          </div>
          
          <div className="text-center mt-12 animate-fade-in-up animation-delay-1600">
            <Link 
              to="/blog" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              查看所有博客
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;