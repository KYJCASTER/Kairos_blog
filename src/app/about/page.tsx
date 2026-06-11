import type { Metadata } from "next"
import Link from "next/link"
import { Mail, MapPin, ArrowRight } from "lucide-react"
import { GitHubIcon } from "@/components/icons"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "关于",
  description: `关于 ${site.author} —— 河南大学网络工程专业学生、本站作者。`,
}

/** Technologies grouped by familiarity, so the page reads as a CV note
 *  rather than a row of brand chips. */
const stack = [
  {
    label: "日常",
    items: ["Go", "TypeScript", "React", "Next.js"],
  },
  {
    label: "在学",
    items: ["Java 并发", "Gin", "GORM", "Redis"],
  },
  {
    label: "工具",
    items: ["Linux", "Git", "Wireshark", "Docker"],
  },
] as const

/** Timeline reads like ledger entries. No coloured icons — just dates,
 *  a thin rule, and serif copy. */
const timeline = [
  { year: "2024 · 秋", title: "入学", body: "进入河南大学网络工程专业，正式开始计算机学习之旅。" },
  { year: "2024 · 冬", title: "扎根 Java", body: "系统学习 Java 与面向对象，了解程序背后的运作方式。" },
  { year: "2025 · 春", title: "走向全栈", body: "把视线扩展到前端与系统服务，搭起这个博客作为练习场。" },
  { year: "2026 · 夏", title: "转向 Go", body: "读完《Go 语言圣经》和 Gin 教程，开始写第一个像样的后端项目。" },
  { year: "未来",      title: "持续生长", body: "在网络安全、系统设计、开源协作上慢慢深入。" },
] as const

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-5 sm:px-6">
      {/* Hero */}
      <section className="max-w-3xl mx-auto mb-20">
        <div className="flex flex-col sm:flex-row items-start gap-8">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element -- next/image disabled by output:export */}
            <img
              src={`${site.basePath}/avatar.svg`}
              alt={site.author}
              className="relative w-full h-full rounded-2xl object-cover border hairline-strong"
            />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
              About
            </p>
            <h1 className="serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
              {site.author}
            </h1>
            <p className="text-muted leading-relaxed mb-6">
              河南大学 2024 级网络工程专业本科生。我喜欢把学到的东西写下来——
              一来是给自己讲第二遍，二来希望路过的同好不必再踩一次同样的坑。
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <GitHubIcon className="w-4 h-4" />
                GitHub
              </a>
              <a href={`mailto:${site.email}`} className="btn-secondary">
                <Mail className="w-4 h-4" />
                邮件
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="max-w-3xl mx-auto mb-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
          技术栈
        </p>
        <h2 className="serif text-2xl sm:text-3xl font-semibold text-foreground mb-8">
          熟悉与正在学习的工具
        </h2>
        <dl className="space-y-5">
          {stack.map((group) => (
            <div
              key={group.label}
              className="grid grid-cols-[5rem_1fr] gap-x-6 items-baseline border-b hairline pb-4"
            >
              <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light">
                {group.label}
              </dt>
              <dd className="flex flex-wrap gap-x-5 gap-y-1.5">
                {group.items.map((item, i) => (
                  <span key={item} className="serif text-foreground">
                    {item}
                    {i < group.items.length - 1 && (
                      <span aria-hidden className="ml-5 text-muted-light">·</span>
                    )}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto mb-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
          时间线
        </p>
        <h2 className="serif text-2xl sm:text-3xl font-semibold text-foreground mb-8">
          一些节点
        </h2>
        <ol className="relative ml-2 border-l border-border-strong/60 space-y-7 pl-7">
          {timeline.map((item) => (
            <li key={item.title} className="relative">
              {/* small ink-stamp marker */}
              <span
                aria-hidden
                className="absolute -left-[33px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary/80 ring-4 ring-background"
              />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light mb-1">
                {item.year}
              </p>
              <h3 className="serif text-lg font-semibold text-foreground mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Contact */}
      <section className="max-w-3xl mx-auto">
        <div className="card p-8 sm:p-10">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            联系
          </p>
          <h2 className="serif text-2xl sm:text-3xl font-semibold text-foreground mb-6">
            欢迎来聊
          </h2>
          <div className="grid sm:grid-cols-3 gap-5 mb-6 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-light text-xs mb-0.5">位置</p>
                <p className="text-foreground">{site.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-light text-xs mb-0.5">邮箱</p>
                <a
                  href={`mailto:${site.email}`}
                  className="text-foreground hover:text-primary transition-colors break-all"
                >
                  {site.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GitHubIcon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-muted-light text-xs mb-0.5">GitHub</p>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  @{site.githubHandle}
                </a>
              </div>
            </div>
          </div>
          <Link href="/blog" className="btn-primary">
            读我的文章
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
