import Link from "next/link"
import { ArrowRight, Code2, Shield, Globe } from "lucide-react"

export function AboutPreview() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      
      <div className="max-w-6xl mx-auto">
        <div className="glass rounded-3xl p-8 md:p-12 gradient-border">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* 头像区域 */}
            <div className="relative shrink-0">
              <div className="w-40 h-40 rounded-2xl overflow-hidden glow">
                <img
                  src="/头像.jpg"
                  alt="Kairos"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 状态指示器 */}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-[#0a0a0f]" />
            </div>

            {/* 介绍区域 */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-4">
                关于 <span className="gradient-text">Kairos</span>
              </h2>
              <p className="text-slate-400 text-lg mb-6 leading-relaxed">
                河南大学 2024 级网络工程专业学生，热爱编程和技术探索。
                专注于后端开发、网络安全和前端技术，持续学习，不断进步。
              </p>
              
              {/* 技能图标 */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Code2 className="w-4 h-4 text-violet-400" />
                  <span className="text-sm">全栈开发</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">网络安全</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm">开源贡献</span>
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
