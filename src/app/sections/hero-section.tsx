import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { site } from "@/lib/site"

export function HeroSection() {
  return (
    <section className="relative pt-36 sm:pt-44 pb-24 px-5 sm:px-6 overflow-hidden">
      {/* Subtle background flourish */}
      <div className="absolute -top-40 -right-32 w-[28rem] h-[28rem] rounded-full bg-primary/8 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-32 w-[24rem] h-[24rem] rounded-full bg-accent/8 blur-3xl pointer-events-none" />
      <div className="noise" />

      <div className="relative max-w-3xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6 animate-fade-in-up">
          <span className="inline-block w-6 h-px bg-primary align-middle mr-3" />
          河南大学 · 网络工程 · 2024 级
        </p>

        <h1
          className="serif text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] tracking-tight text-foreground mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.06s" }}
        >
          代码之外，
          <br />
          仍是<span className="italic text-primary">语言</span>。
        </h1>

        <p
          className="text-lg sm:text-xl text-muted leading-relaxed mb-10 max-w-2xl animate-fade-in-up"
          style={{ animationDelay: "0.12s" }}
        >
          {site.description}
          这里收录我在 Java、Go、Python 与 Web 上的思考片段，希望它们对路过的你也有用。
        </p>

        <div
          className="flex flex-wrap items-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "0.18s" }}
        >
          <Link href="/blog" className="btn-primary">
            浏览文章
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/about" className="btn-secondary">
            关于我
          </Link>
        </div>

        <div
          className="mt-16 flex items-center gap-6 text-xs text-muted-light animate-fade-in-up"
          style={{ animationDelay: "0.24s" }}
        >
          <span className="font-mono uppercase tracking-wider">现在专注</span>
          <span className="flex-1 h-px bg-border" />
          <span className="flex flex-wrap gap-3 font-medium text-muted">
            <span>Java 并发</span>
            <span>·</span>
            <span>Go 服务端</span>
            <span>·</span>
            <span>网络安全</span>
          </span>
        </div>
      </div>
    </section>
  )
}
