import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { site } from "@/lib/site"

export function HeroSection() {
  return (
    <section className="relative pt-36 sm:pt-44 pb-24 px-5 sm:px-6 overflow-hidden">
      {/* Soft parchment vignettes — warm corner washes, no hard color blobs */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 100% 0%, rgba(194, 65, 12, 0.06), transparent 60%), " +
            "radial-gradient(ellipse 55% 45% at 0% 100%, rgba(180, 83, 9, 0.05), transparent 65%)",
        }}
      />
      <div className="noise" />

      <div className="relative max-w-3xl mx-auto">
        {/* Wax-seal style hairline mark above the kicker */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
          <span aria-hidden className="block w-2 h-2 rounded-full bg-primary/80" />
          <span aria-hidden className="block flex-1 max-w-[3rem] h-px bg-primary/40" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            河南大学 · 网络工程 · 2024 级
          </p>
        </div>

        <h1
          className="serif text-5xl sm:text-6xl md:text-7xl font-semibold leading-[1.05] tracking-tight text-foreground mb-8 animate-fade-in-up"
          style={{ animationDelay: "0.06s" }}
        >
          代码之外，
          <br />
          仍是
          <span className="relative inline-block italic text-primary">
            语言
            {/* Hand-drawn swash underline — SVG path with a wobble that
                feels like a fountain-pen flourish. Animates the stroke in
                after the headline lands. */}
            <svg
              aria-hidden
              viewBox="0 0 200 24"
              preserveAspectRatio="none"
              className="absolute left-[-4%] right-[-4%] -bottom-2 sm:-bottom-3 w-[108%] h-[0.45em] pointer-events-none"
            >
              <path
                d="M2 16 C 30 6, 60 22, 96 12 S 160 4, 198 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.55"
                style={{
                  strokeDasharray: 260,
                  strokeDashoffset: 260,
                  animation:
                    "swash-draw 1.1s 0.55s var(--ease-out) forwards",
                }}
              />
            </svg>
          </span>
          。
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
          className="mt-20 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-light animate-fade-in-up"
          style={{ animationDelay: "0.24s" }}
        >
          <span className="font-mono uppercase tracking-wider">现在专注</span>
          <span aria-hidden className="text-border-strong">/</span>
          <span className="serif italic text-muted text-sm">
            Java 并发 · Go 服务端 · 网络安全
          </span>
        </div>
      </div>
    </section>
  )
}
