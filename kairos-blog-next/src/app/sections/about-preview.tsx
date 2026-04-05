import Link from "next/link"

export function AboutPreview() {
  return (
    <section className="py-20 px-4 bg-[#4361EE] dark:bg-[#7209B7]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 bg-white border-4 border-black rounded-full overflow-hidden comic-shadow">
              <img
                src="/头像.jpg"
                alt="Kairos"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFD60A] border-4 border-black rounded-full flex items-center justify-center font-comic">
              K
            </div>
          </div>

          {/* Introduction */}
          <div className="flex-1 text-white">
            <h2 className="font-comic text-3xl mb-4 tracking-wider">关于我</h2>
            <p className="text-lg mb-4 opacity-90">
              河南大学 2024 级网络工程专业学生，热爱编程和技术探索。
              正在学习 Java、Go、Python 和前端开发。
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {["Java", "Go", "Python", "React", "网络安全"].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-white text-black border-2 border-black font-comic text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
            <Link href="/about">
              <span className="inline-block font-comic text-lg px-6 py-2 bg-[#FFD60A] text-black border-4 border-black comic-shadow hover:comic-shadow-sm hover:translate-x-1 hover:translate-y-1 transition-all cursor-pointer">
                了解更多 →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
