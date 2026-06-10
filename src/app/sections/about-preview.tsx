import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { site } from "@/lib/site"

export function AboutPreview() {
  return (
    <section className="py-20 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="card p-8 sm:p-12">
          <div className="grid sm:grid-cols-[auto_1fr] gap-8 items-start">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent-light opacity-20 blur-xl" />
              {/* eslint-disable-next-line @next/next/no-img-element -- next/image disabled by output:export */}
              <img
                src={`${site.basePath}/avatar.svg`}
                alt={site.author}
                className="relative w-full h-full rounded-2xl object-cover border hairline-strong"
              />
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
                关于作者
              </p>
              <h2 className="serif text-2xl sm:text-3xl font-semibold leading-tight text-foreground mb-4">
                你好，我是 <span className="italic text-primary">{site.name}</span>。
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                我是河南大学 2024 级网络工程专业的学生，正在把对编程的喜欢
                和对计算机网络的好奇心，慢慢沉淀成可以分享给别人的文字。
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors group"
              >
                更多关于我
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
