import Link from "next/link"
import { ArrowRight, Code2, Shield, Globe, Heart } from "lucide-react"

export function AboutPreview() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-50/30 to-transparent" />
      
      <div className="max-w-5xl mx-auto relative">
        <div className="card p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* 头像区域 */}
            <div className="relative shrink-0">
              <div className="w-40 h-40 rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10 rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="./avatar.svg"
                  alt="Kairos"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 装饰元素 */}
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-amber-400 rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-orange-400 rounded-full -z-10 opacity-80" />
            </div>

            {/* 介绍区域 */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
                <Heart className="w-4 h-4" />
                关于我
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                你好，我是 <span className="gradient-text">Kairos</span>
              </h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                河南大学 2024 级网络工程专业学生，热爱编程和技术探索。
                专注于后端开发、网络安全和前端技术，持续学习，不断进步。
              </p>
              
              {/* 技能图标 */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                  <Code2 className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">全栈开发</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-700">网络安全</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100">
                  <Globe className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm font-medium text-gray-700">开源贡献</span>
                </div>
              </div>

              <Link href="/about">
                <button className="btn-primary inline-flex items-center gap-2">
                  了解更多
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
