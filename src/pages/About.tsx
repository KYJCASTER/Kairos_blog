import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-600"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 页面标题 */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              关于我
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            了解更多关于我的背景、技能和兴趣
          </p>
        </div>

        {/* 个人简介 */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-pink-100 animate-fade-in-scale animation-delay-200">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 animate-fade-in-left animation-delay-400">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg animate-float border-4 border-gradient-to-r from-pink-500 to-blue-500">
                  <img 
                    src="/头像.jpg" 
                    alt="Kairos头像" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left animate-fade-in-right animation-delay-600">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Kairos</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  我是河南大学网络工程专业的学生，对技术充满热情。从前端开发到网络安全，
                  我喜欢探索各种技术领域，并通过实践项目来提升自己的技能。
                </p>
                <p className="text-gray-600 leading-relaxed">
                  这个博客是我分享学习心得、技术见解和生活感悟的地方。
                  希望通过记录和分享，能够帮助到更多的人，也让自己在技术路上走得更远。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 教育背景 */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100 animate-fade-in-up animation-delay-800">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                教育背景
              </span>
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 animate-fade-in-left animation-delay-1000">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">河南大学</h3>
                  <p className="text-gray-600 mb-1">网络工程专业 | 本科在读</p>
                  <p className="text-sm text-gray-500">2021年 - 2025年（预计）</p>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    主要学习计算机网络、网络安全、数据结构与算法、软件工程等课程。
                    通过理论学习和实践项目，掌握了扎实的计算机基础知识。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 技能专长 */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12 animate-fade-in-up animation-delay-1000">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                技能专长
              </span>
            </h2>
            <p className="text-gray-600">我在以下技术领域有所涉猎和实践</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 前端开发 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-pink-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-scale animation-delay-1200">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">前端开发</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">React</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">TypeScript</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Vue.js</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 后端开发 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-scale animation-delay-1400">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">后端开发</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Node.js</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Python</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Java</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 网络技术 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-scale animation-delay-1600">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">网络技术</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">网络协议</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">网络安全</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">路由交换</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '70%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 兴趣爱好 */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-pink-100 animate-fade-in-up animation-delay-1400">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                兴趣爱好
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4 animate-fade-in-left animation-delay-1600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-gray-700">技术博客写作</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <span className="text-gray-700">开源项目贡献</span>
                </div>
              </div>
              <div className="space-y-4 animate-fade-in-right animation-delay-1600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">数据分析与可视化</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  </div>
                  <span className="text-gray-700">新技术探索</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100 text-center animate-fade-in-scale animation-delay-1600">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                联系我
              </span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              如果你对我的项目感兴趣，或者想要交流技术问题，欢迎通过以下方式联系我。
              我很乐意与志同道合的朋友一起学习和成长！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:kairos@example.com" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                发送邮件
              </a>
              <a 
                href="https://github.com/KYJCASTER" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-pink-300 hover:text-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;