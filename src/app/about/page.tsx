import { Navbar } from "@/components/navbar"
import { ComicCard } from "@/components/ui/comic-card"
import { SpeechBubble } from "@/components/ui/speech-bubble"
import { ComicButton } from "@/components/ui/comic-button"
import Link from "next/link"
import { Mail, MapPin, BookOpen, Code, Heart, Zap } from "lucide-react"

// GitHub SVG Icon Component
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

const skills = [
  { name: "Java", level: 75, color: "#E63946" },
  { name: "Go", level: 60, color: "#4361EE" },
  { name: "Python", level: 70, color: "#FFD60A" },
  { name: "React", level: 65, color: "#7209B7" },
  { name: "网络安全", level: 55, color: "#2ECC71" },
  { name: "数据库", level: 60, color: "#F39C12" },
]

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
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-[#4361EE] to-[#7209B7]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 bg-white border-4 border-black rounded-full overflow-hidden comic-shadow mx-auto">
                <img
                  src="/头像.jpg"
                  alt="Kairos"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#FFD60A] border-4 border-black rounded-full flex items-center justify-center font-comic text-xl">
                K
              </div>
            </div>
            <h1 className="font-comic text-5xl sm:text-6xl text-white mb-4 tracking-wider">
              关于我
            </h1>
            <p className="text-white/90 text-xl mb-8">
              河南大学 2024 级网络工程专业学生
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://github.com/KYJCASTER"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ComicButton variant="primary" skew={false}>
                  <GithubIcon className="w-5 h-5 inline mr-2" />
                  GitHub
                </ComicButton>
              </a>
              <a href="mailto:kairos@example.com">
                <ComicButton variant="secondary" skew={false}>
                  <Mail className="w-5 h-5 inline mr-2" />
                  邮箱
                </ComicButton>
              </a>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <SpeechBubble direction="bottom" color="yellow" className="max-w-2xl">
                <p className="font-comic text-xl leading-relaxed">
                  你好！我是 Kairos，一名热爱技术的网络工程专业学生。
                  我喜欢探索新技术，分享学习心得，记录成长历程。
                </p>
              </SpeechBubble>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="py-16 px-4 bg-[#FEFAE0]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-comic text-4xl text-center mb-12 tracking-wider">
              <span className="bg-[#E63946] text-white px-4 py-2 border-4 border-black comic-shadow inline-block transform rotate-1">
                技能栈
              </span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {skills.map((skill) => (
                <ComicCard key={skill.name} variant="default" color="white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-comic text-lg">{skill.name}</span>
                    <span className="font-comic text-sm opacity-60">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-6 bg-gray-200 border-2 border-black overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: skill.color,
                      }}
                    />
                  </div>
                </ComicCard>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-comic text-4xl text-center mb-12 tracking-wider">
              <span className="bg-[#4361EE] text-white px-4 py-2 border-4 border-black comic-shadow inline-block transform -rotate-1">
                成长历程
              </span>
            </h2>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-black hidden sm:block" />

              <div className="space-y-8">
                {timeline.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={index}
                      className="relative flex flex-col sm:flex-row gap-4 sm:gap-8"
                    >
                      {/* Icon */}
                      <div className="flex items-center gap-4 sm:block">
                        <div className="w-16 h-16 bg-[#FFD60A] border-4 border-black rounded-full flex items-center justify-center comic-shadow z-10 relative">
                          <Icon className="w-8 h-8" />
                        </div>
                        <span className="sm:hidden font-comic text-2xl text-[#4361EE]">
                          {item.year}
                        </span>
                      </div>

                      {/* Content */}
                      <ComicCard
                        variant={index % 2 === 0 ? "explosion" : "default"}
                        color="white"
                        className="flex-1"
                      >
                        <span className="hidden sm:block font-comic text-xl text-[#4361EE] mb-2">
                          {item.year}
                        </span>
                        <h3 className="font-comic text-xl mb-2">{item.title}</h3>
                        <p className="opacity-70">{item.description}</p>
                      </ComicCard>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16 px-4 bg-[#1A1A2E] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-comic text-4xl mb-8 tracking-wider">
              <span className="bg-[#FFD60A] text-black px-4 py-2 border-4 border-white comic-shadow inline-block transform rotate-1">
                联系我
              </span>
            </h2>

            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-[#E63946] border-4 border-white rounded-full flex items-center justify-center">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="font-comic text-xl">位置</h3>
                <p className="opacity-70">河南 · 开封</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-[#4361EE] border-4 border-white rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-comic text-xl">邮箱</h3>
                <p className="opacity-70">kairos@example.com</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-[#2ECC71] border-4 border-white rounded-full flex items-center justify-center">
                  <GithubIcon className="w-8 h-8" />
                </div>
                <h3 className="font-comic text-xl">GitHub</h3>
                <p className="opacity-70">@KYJCASTER</p>
              </div>
            </div>

            <p className="font-comic text-2xl mb-4">
              有任何问题或建议？欢迎交流！
            </p>
            <Link href="/blog">
              <ComicButton variant="primary" size="lg">
                阅读我的文章 →
              </ComicButton>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-8 text-center">
        <p className="font-comic text-lg">
          © {new Date().getFullYear()} Kairos 博客
        </p>
        <p className="text-sm opacity-60 mt-2">Made with 💥 and ☕</p>
      </footer>
    </>
  )
}
