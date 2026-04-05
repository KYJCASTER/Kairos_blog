"use client"

import Link from "next/link"
import { ArrowRight, Sparkles, Code2, Coffee } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" />
      
      {/* 装饰图案 */}
      <div className="absolute top-40 left-20 dot-pattern w-32 h-32 opacity-30" />
      <div className="absolute bottom-40 right-20 dot-pattern w-24 h-24 opacity-30" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 徽章 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold">河南大学 · 2024级 · 网络工程</span>
        </div>

        {/* 主标题 */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <span className="gradient-text">Kairos</span>
          <span className="text-gray-800"> 博客</span>
        </h1>

        {/* 副标题 */}
        <p className="text-xl sm:text-2xl text-gray-600 mb-4 animate-fade-in-up font-medium" style={{ animationDelay: '0.2s' }}>
          开发者成长日记
        </p>
        <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-lg animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          记录学习历程，分享技术见解。在这里探索 Java、Go、Python 与前端开发的无限可能。
        </p>

        {/* 特性标签 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
            <Code2 className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">全栈开发</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
            <Coffee className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-gray-700">持续学习</span>
          </div>
        </div>

        {/* CTA 按钮 */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Link href="/blog">
            <button className="btn-primary inline-flex items-center gap-2 text-base">
              开始阅读
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/about">
            <button className="btn-secondary">
              了解更多
            </button>
          </Link>
        </div>

        {/* 技能标签 */}
        <div className="mt-16 flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          {["Java", "Go", "Python", "React", "Next.js", "网络安全"].map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
