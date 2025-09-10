import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState('');
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  
  // 分页配置
  const postsPerPage = 6; // 每页显示6篇文章
  const blogPosts = [
    {
      id: 1,
      title: "React 入门完全指南",
      excerpt: "从零开始学习 React，包括组件创建、JSX 语法、状态管理和事件处理。React 是构建用户界面的强大库，本文将带你快速上手。",
      date: "2024年1月20日",
      category: "前端开发",
      readTime: "15分钟阅读",
      tags: ["React", "JavaScript", "前端", "入门"]
    },
    {
      id: 2,
      title: "JavaScript 基础语法详解",
      excerpt: "掌握 JavaScript 的核心概念，包括变量、函数、对象、数组和条件渲染。JavaScript 是 Web 开发的基础，让我们从基础开始。",
      date: "2024年1月18日",
      category: "编程语言",
      readTime: "12分钟阅读",
      tags: ["JavaScript", "基础", "语法", "编程"]
    },
    {
      id: 3,
      title: "CSS Grid 网格布局实战",
      excerpt: "CSS Grid 是最强大的布局方案，可以将网页划分成网格并任意组合。本文通过实例演示如何使用 Grid 创建复杂布局。",
      date: "2024年1月15日",
      category: "前端开发",
      readTime: "10分钟阅读",
      tags: ["CSS", "Grid", "布局", "响应式"]
    },
    {
      id: 4,
      title: "前端开发学习路线图",
      excerpt: "完整的前端学习指南，从 HTML、CSS 基础到 JavaScript 框架，再到工具和测试。为前端新手提供系统的学习路径。",
      date: "2024年1月12日",
      category: "学习指南",
      readTime: "18分钟阅读",
      tags: ["前端", "学习路线", "HTML", "CSS"]
    },
    {
      id: 5,
      title: "网络工程基础知识",
      excerpt: "网络工程专业核心概念介绍，包括网络协议、路由交换、网络安全等基础知识，适合计算机网络初学者。",
      date: "2024年1月10日",
      category: "网络工程",
      readTime: "20分钟阅读",
      tags: ["网络", "协议", "路由", "安全"]
    },
    {
      id: 6,
      title: "React 组件与 JSX 详解",
      excerpt: "深入理解 React 组件的创建和嵌套，掌握 JSX 语法的使用技巧。学习如何构建可复用的 UI 组件。",
      date: "2024年1月8日",
      category: "前端开发",
      readTime: "14分钟阅读",
      tags: ["React", "JSX", "组件", "UI"]
    },
    {
      id: 7,
      title: "Web 开发工具推荐",
      excerpt: "精选的前端开发工具和资源，包括代码编辑器、调试工具、在线学习平台等，提升开发效率的必备工具。",
      date: "2024年1月5日",
      category: "开发工具",
      readTime: "16分钟阅读",
      tags: ["工具", "效率", "开发", "资源"]
    },
    {
      id: 8,
      title: "现代前端框架对比",
      excerpt: "React、Vue、Angular 三大前端框架的特点对比，帮助开发者选择最适合项目需求的技术栈。",
      date: "2024年1月3日",
      category: "技术对比",
      readTime: "22分钟阅读",
      tags: ["框架", "React", "Vue", "Angular"]
    },
    {
      id: 9,
      title: "编程学习方法分享",
      excerpt: "高效的编程学习技巧和方法，包括如何阅读技术文档、实践项目选择、问题解决思路等实用建议。",
      date: "2023年12月30日",
      category: "学习方法",
      readTime: "13分钟阅读",
      tags: ["学习", "方法", "编程", "技巧"]
    },
    {
      id: 10,
      title: "Node.js 快速入门指南",
      excerpt: "Node.js 是基于 Chrome V8 引擎的 JavaScript 运行环境。本文介绍 Node.js 的基本概念、安装配置和核心模块使用。",
      date: "2023年12月28日",
      category: "后端开发",
      readTime: "17分钟阅读",
      tags: ["Node.js", "JavaScript", "后端", "服务器"]
    },
    {
      id: 11,
      title: "Git 版本控制基础教程",
      excerpt: "Git 是分布式版本控制系统，是程序员必备技能。学习 Git 的基本命令、分支管理和协作开发流程。",
      date: "2023年12月25日",
      category: "开发工具",
      readTime: "19分钟阅读",
      tags: ["Git", "版本控制", "协作", "GitHub"]
    },
    {
      id: 12,
      title: "网络协议详解：TCP/IP",
      excerpt: "深入理解 TCP/IP 协议栈，包括网络层、传输层的工作原理，以及 HTTP、HTTPS 等应用层协议的特点。",
      date: "2023年12月22日",
      category: "网络工程",
      readTime: "25分钟阅读",
      tags: ["TCP/IP", "网络协议", "HTTP", "网络安全"]
    }
  ];

  const categories = ["全部", "前端开发", "编程语言", "网络工程", "学习指南", "开发工具", "技术对比", "学习方法", "后端开发"];

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
              我的博客
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            分享技术见解、学习心得和生活感悟
          </p>
        </div>

        {/* 分类筛选 */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1); // 切换分类时重置到第一页
                }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-pink-300 hover:text-pink-600 hover:shadow-lg'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 博客文章列表 */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(() => {
              // 先筛选分类
              const filteredPosts = blogPosts.filter(post => selectedCategory === '全部' || post.category === selectedCategory);
              
              // 计算总页数
              const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
              
              // 如果当前页超出范围，重置到第一页
              if (currentPage > totalPages && totalPages > 0) {
                setCurrentPage(1);
              }
              
              // 计算当前页的文章
              const startIndex = (currentPage - 1) * postsPerPage;
              const endIndex = startIndex + postsPerPage;
              const currentPosts = filteredPosts.slice(startIndex, endIndex);
              
              return currentPosts.map((post, index) => (
              <article
                key={post.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-scale"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="p-6">
                  {/* 文章分类和阅读时间 */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-blue-500 text-white text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>

                  {/* 文章标题 */}
                  <h2 className="text-xl font-bold text-gray-800 mb-3 hover:text-pink-600 transition-colors duration-300 cursor-pointer">
                    {post.title}
                  </h2>

                  {/* 文章摘要 */}
                  <p className={`text-gray-600 leading-relaxed mb-4 transition-all duration-300 ${
                    expandedPost === post.id ? '' : 'line-clamp-3'
                  }`}>
                    {post.excerpt}
                  </p>

                  {/* 标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-pink-100 hover:text-pink-600 transition-colors duration-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* 文章摘要 */}
                  <p className={`text-gray-600 leading-relaxed mb-4 transition-all duration-300 ${
                    expandedPost === post.id ? '' : 'line-clamp-3'
                  }`}>
                    {post.excerpt}
                  </p>

                  {/* 底部操作区 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                        className="inline-flex items-center text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors duration-300"
                      >
                        {expandedPost === post.id ? '收起摘要' : '展开摘要'}
                        <svg className={`ml-1 w-4 h-4 transform transition-transform duration-300 ${
                          expandedPost === post.id ? 'rotate-180' : ''
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <Link 
                        to={`/blog/${post.id}`}
                        className="inline-flex items-center text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors duration-300"
                      >
                        阅读全文
                        <svg className="ml-1 w-4 h-4 transform transition-transform duration-300 hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ));
            })()}
          </div>
        </div>

        {/* 分页 */}
        <div className="max-w-4xl mx-auto mb-16 animate-fade-in-up animation-delay-800">
          <div className="flex justify-center items-center space-x-2">
            <button 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-200 hover:border-pink-300 hover:text-pink-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {(() => {
              // 计算总页数
              const filteredPosts = blogPosts.filter(post => selectedCategory === '全部' || post.category === selectedCategory);
              const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
              
              // 生成页码数组
              const pageNumbers = [];
              for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
              }
              
              return pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    page === currentPage
                      ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:border-pink-300 hover:text-pink-600'
                  }`}
                >
                  {page}
                </button>
              ));
            })()}
            
            <button 
              onClick={() => {
                const filteredPosts = blogPosts.filter(post => selectedCategory === '全部' || post.category === selectedCategory);
                const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
                setCurrentPage(Math.min(totalPages, currentPage + 1));
              }}
              disabled={(() => {
                const filteredPosts = blogPosts.filter(post => selectedCategory === '全部' || post.category === selectedCategory);
                const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
                return currentPage >= totalPages;
              })()}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                (() => {
                  const filteredPosts = blogPosts.filter(post => selectedCategory === '全部' || post.category === selectedCategory);
                  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
                  return currentPage >= totalPages;
                })()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-600 border border-gray-200 hover:border-pink-300 hover:text-pink-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 搜索和订阅 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-blue-100 text-center animate-fade-in-scale animation-delay-1000">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                保持联系
              </span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              订阅我的博客，第一时间获取最新的技术文章和学习心得。
              让我们一起在技术的道路上不断前进！
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="输入您的邮箱地址"
                className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100 transition-all duration-300"
              />
              <button 
                onClick={() => {
                  if (email) {
                    alert(`感谢订阅！我们会将最新文章发送到 ${email}`);
                    setEmail('');
                  } else {
                    alert('请输入有效的邮箱地址');
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                订阅
              </button>
            </div>
            
            <div className="flex justify-center space-x-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;