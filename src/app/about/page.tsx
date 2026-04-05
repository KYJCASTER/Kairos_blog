import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { Mail, MapPin, BookOpen, Code, Heart, Zap, ArrowRight } from "lucide-react"

const skills = ["Java", "Go", "Python", "React", "Next.js", "TypeScript", "Git", "Linux"]

const timeline = [
  {
    year: "2024",
    title: "大学入学",
    description: "进入河南大学网络工程专业，开始计算机学习之旅",
    icon: BookOpen,
  },
  {
    year: "2024",
    title: "学习 Java",
    description: "开始系统学习 Java 编程语言，掌握面向对象编程思想",
    icon: Code,
  },
  {
    year: "2025",
    title: "探索全栈开发",
    description: "学习 React、Next.js 等前端技术，尝试全栈开发",
    icon: Zap,
  },
  {
    year: "未来",
    title: "持续成长",
    description: "继续深耕技术领域，探索网络安全和系统架构",
    icon: Heart,
  },
]

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/10 rotate-3 mx-auto">
                <img
                  src="./avatar.svg"
                  alt="Kairos"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-400 rounded-full flex items-center justify-center text-white font-bold border-4 border-white">
                K
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800">
              关于 <span className="gradient-text">Kairos</span>
            </h1>
            <p className="text-gray-500 text-xl mb-8">
              河南大学 2024 级网络工程专业学生
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/KYJCASTER"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn-primary inline-flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </a>
              <a href="mailto:kairos@example.com">
                <button className="btn-secondary inline-flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  邮箱
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 text-center">
              <p className="text-lg text-gray-600 leading-relaxed">
                你好！我是 Kairos，一名热爱技术的网络工程专业学生。
                我喜欢探索新技术，分享学习心得，记录成长历程。
                这个博客是我技术探索的见证，希望能对你有所帮助。
              </p>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              我的<span className="gradient-text">技能栈</span>
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
              {skills.map((skill) => (
                <div key={skill} className="card px-6 py-3">
                  <span className="font-bold text-gray-800">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              成长<span className="gradient-text">历程</span>
            </h2>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-amber-400 hidden sm:block rounded-full" />

              <div className="space-y-8">
                {timeline.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="relative flex flex-col sm:flex-row gap-4 sm:gap-8">
                      <div className="flex items-center gap-4 sm:block">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <span className="sm:hidden text-xl font-bold text-orange-500">
                          {item.year}
                        </span>
                      </div>

                      <div className="card p-6 flex-1 sm:ml-0">
                        <span className="hidden sm:block text-sm text-orange-500 font-semibold mb-1">
                          {item.year}
                        </span>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">
                联系<span className="gradient-text">我</span>
              </h2>

              <div className="grid sm:grid-cols-3 gap-6 mb-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-bold text-gray-800">位置</h3>
                  <p className="text-sm text-gray-500">河南 · 开封</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-gray-800">邮箱</h3>
                  <p className="text-sm text-gray-500">2016559265w@gmail.com</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800">GitHub</h3>
                  <p className="text-sm text-gray-500">@KYJCASTER</p>
                </div>
              </div>

              <p className="text-lg text-gray-500 mb-6">
                有任何问题或建议？欢迎交流！
              </p>
              <Link href="/blog">
                <button className="btn-primary inline-flex items-center gap-2">
                  阅读我的文章
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Kairos Blog
          </p>
        </div>
      </footer>
    </>
  )
}
