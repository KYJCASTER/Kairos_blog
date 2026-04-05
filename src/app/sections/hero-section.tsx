"use client"

import { ComicButton } from "@/components/ui/comic-button"
import { SpeechBubble } from "@/components/ui/speech-bubble"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-20">
      {/* Speed lines background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 bg-black"
            style={{
              top: `${Math.random() * 100}%`,
              left: 0,
              right: 0,
              transform: `rotate(${Math.random() * 10 - 5}deg)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Main title */}
        <h1 className="font-comic text-6xl sm:text-8xl md:text-9xl tracking-wider mb-6 transform -rotate-2">
          <span className="text-[#E63946]">K</span>
          <span className="text-[#4361EE]">A</span>
          <span className="text-[#FFD60A]">I</span>
          <span className="text-[#7209B7]">R</span>
          <span className="text-[#2ECC71]">O</span>
          <span className="text-[#F39C12]">S</span>
        </h1>

        {/* Subtitle bubble */}
        <div className="flex justify-center mb-8">
          <SpeechBubble direction="bottom" color="yellow" className="max-w-md">
            <p className="font-comic text-2xl tracking-wider">开发者日志</p>
            <p className="text-sm mt-2 opacity-80">河南大学 · 2024级 · 网络工程</p>
          </SpeechBubble>
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["Java", "Go", "Python", "前端"].map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 bg-white border-4 border-black font-comic text-lg comic-shadow-sm transform hover:-translate-y-1 transition-transform"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/blog">
            <ComicButton variant="primary" size="lg">
              开始阅读 →
            </ComicButton>
          </Link>
          <Link href="/about">
            <ComicButton variant="secondary" size="lg">
              了解我
            </ComicButton>
          </Link>
        </div>
      </div>
    </section>
  )
}
