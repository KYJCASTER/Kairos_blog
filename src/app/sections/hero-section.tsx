"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 grid-bg">
      {/* 背景光晕 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 徽章 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span className="text-sm text-slate-300">河南大学 · 2024级 · 网络工程</span>
        </div>

        {/* 主标题 */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="gradient-text">Kairos</span>
          <span className="text-white"> 博客</span>
        </h1>

        {/* 副标题 */}
        <p className="text-xl sm:text-2xl text-slate-400 mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          开发者日志
        </p>
        <p className="text-slate-500 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          记录学习历程，分享技术见解。探索 Java、Go、Python 与前端开发的无限可能。
        </p>

        {/* 技能标签 */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {["Java", "Go", "Python", "React", "Next.js", "网络安全"].map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
        </div>

        {/* CTA 按钮 */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Link href="/blog">
            <button className="btn-primary inline-flex items-center gap-2">
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

        {/* 滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
            <div className="w-1 h-2 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
