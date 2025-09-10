import React from 'react';
import { useParams, Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  tags: string[];
  readTime: string;
  author: string;
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // 完整的博客文章数据
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "React 入门完全指南",
      excerpt: "从零开始学习React，掌握现代前端开发的核心技术。本文将带你了解React的基本概念、组件化思想以及如何构建你的第一个React应用。",
      content: `# React 入门完全指南

## 什么是React？

React是由Facebook开发的一个用于构建用户界面的JavaScript库。它采用组件化的开发模式，让开发者能够创建可复用的UI组件。

## React的核心概念

### 1. 组件（Components）

组件是React应用的基本构建块。每个组件都是一个独立的、可复用的代码片段。

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}
\`\`\`

### 2. JSX语法

JSX是JavaScript的语法扩展，让你能够在JavaScript中编写类似HTML的代码。

\`\`\`jsx
const element = <h1>Hello, world!</h1>;
\`\`\`

### 3. Props（属性）

Props是组件的输入参数，用于从父组件向子组件传递数据。

\`\`\`jsx
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}
\`\`\`

### 4. State（状态）

State是组件内部的数据，当state发生变化时，组件会重新渲染。

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## 创建你的第一个React应用

### 1. 安装Node.js

首先确保你的电脑上安装了Node.js。你可以从官网下载并安装最新版本。

### 2. 使用Create React App

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

### 3. 项目结构

\`\`\`
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
\`\`\`

## 总结

React是一个强大而灵活的前端框架，掌握它的核心概念是成为优秀前端开发者的重要一步。通过不断练习和实践，你将能够构建出复杂而高效的用户界面。

下一步，建议你学习React Router、状态管理（Redux或Context API）以及React Hooks等高级概念。`,
      date: "2024-01-15",
      category: "前端开发",
      tags: ["React", "JavaScript", "前端"],
      readTime: "8分钟",
      author: "Kairos"
    },
    {
      id: 2,
      title: "JavaScript 基础语法详解",
      excerpt: "深入理解JavaScript的核心语法，包括变量、函数、对象等基本概念，为进阶学习打下坚实基础。",
      content: `# JavaScript 基础语法详解

## 变量声明

JavaScript中有三种声明变量的方式：

### var
\`\`\`javascript
var name = "John";
var age = 25;
\`\`\`

### let
\`\`\`javascript
let name = "John";
let age = 25;
\`\`\`

### const
\`\`\`javascript
const PI = 3.14159;
const name = "John";
\`\`\`

## 数据类型

### 基本数据类型
- Number: 数字
- String: 字符串
- Boolean: 布尔值
- Undefined: 未定义
- Null: 空值
- Symbol: 符号（ES6新增）

### 引用数据类型
- Object: 对象
- Array: 数组
- Function: 函数

## 函数

### 函数声明
\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}
\`\`\`

### 箭头函数
\`\`\`javascript
const greet = (name) => {
  return \`Hello, \${name}!\`;
};
\`\`\`

## 对象和数组

### 对象
\`\`\`javascript
const person = {
  name: "John",
  age: 30,
  city: "New York"
};
\`\`\`

### 数组
\`\`\`javascript
const fruits = ["apple", "banana", "orange"];
\`\`\`

## 控制流

### 条件语句
\`\`\`javascript
if (age >= 18) {
  console.log("成年人");
} else {
  console.log("未成年人");
}
\`\`\`

### 循环
\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log(i);
}
\`\`\`

## 总结

掌握这些JavaScript基础语法是进行前端开发的必备技能。建议多加练习，熟练掌握这些概念。`,
      date: "2024-01-12",
      category: "编程语言",
      tags: ["JavaScript", "基础", "语法"],
      readTime: "6分钟",
      author: "Kairos"
    },
    {
      id: 3,
      title: "CSS Grid 布局完全指南",
      excerpt: "学习CSS Grid布局系统，掌握现代网页布局的强大工具，创建复杂而灵活的页面结构。",
      content: `# CSS Grid 布局完全指南

## 什么是CSS Grid？

CSS Grid是一个二维布局系统，可以同时处理行和列，是目前最强大的CSS布局方案。

## 基本概念

### Grid Container（网格容器）
\`\`\`css
.container {
  display: grid;
}
\`\`\`

### Grid Item（网格项）
网格容器的直接子元素自动成为网格项。

## 核心属性

### 定义网格
\`\`\`css
.container {
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-template-rows: 100px 100px;
  gap: 10px;
}
\`\`\`

### 使用fr单位
\`\`\`css
.container {
  grid-template-columns: 1fr 2fr 1fr;
}
\`\`\`

### repeat()函数
\`\`\`css
.container {
  grid-template-columns: repeat(3, 1fr);
}
\`\`\`

## 网格项定位

### 基于线的定位
\`\`\`css
.item {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 2;
}
\`\`\`

### 简写形式
\`\`\`css
.item {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
}
\`\`\`

## 实际应用示例

### 经典网页布局
\`\`\`css
.page {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: 60px 1fr 40px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## 响应式设计

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
\`\`\`

## 总结

CSS Grid为现代网页布局提供了强大而灵活的解决方案。通过掌握这些基本概念和属性，你可以创建出复杂而美观的页面布局。`,
      date: "2024-01-10",
      category: "前端开发",
      tags: ["CSS", "Grid", "布局"],
      readTime: "10分钟",
      author: "Kairos"
    }
    // 可以继续添加更多文章...
  ];

  const post = blogPosts.find(p => p.id === parseInt(id || '0'));

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">文章未找到</h1>
          <p className="text-gray-600 mb-8">抱歉，您要查找的文章不存在。</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300"
          >
            返回博客列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      {/* 返回按钮 */}
      <div className="container mx-auto px-4 pt-8">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-gray-600 hover:text-pink-600 transition-colors duration-300 mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回博客列表
        </Link>
      </div>

      {/* 文章内容 */}
      <article className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* 文章头部 */}
          <header className="mb-12 text-center">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-pink-500 to-blue-500 text-white text-sm font-medium rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {post.author}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {post.date}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.readTime}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-sm rounded-full border border-gray-200">
                  #{tag}
                </span>
              ))}
            </div>
          </header>

          {/* 文章正文 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
              dangerouslySetInnerHTML={{ 
                __html: post.content
                  .replace(/\n/g, '<br>')
                  .replace(/# (.*?)(<br>|$)/g, '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>')
                  .replace(/## (.*?)(<br>|$)/g, '<h2 class="text-2xl font-bold mb-4 mt-6">$1</h2>')
                  .replace(/### (.*?)(<br>|$)/g, '<h3 class="text-xl font-bold mb-3 mt-4">$1</h3>')
                  .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>$1</code></pre>')
                  .replace(/`([^`]+)`/g, '<code class="bg-pink-50 text-pink-600 px-2 py-1 rounded">$1</code>')
              }}
            />
          </div>

          {/* 文章底部 */}
          <footer className="mt-12 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">喜欢这篇文章吗？</h3>
              <p className="text-gray-600 mb-6">如果您觉得这篇文章对您有帮助，欢迎分享给更多的人！</p>
              <div className="flex justify-center space-x-4">
                <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105">
                  分享文章
                </button>
                <Link 
                  to="/blog" 
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-pink-300 hover:text-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                  更多文章
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;