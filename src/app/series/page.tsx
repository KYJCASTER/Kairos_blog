import type { Metadata } from "next"
import Link from "next/link"
import { Layers } from "lucide-react"

import { getAllSeries } from "@/lib/posts"
import { Reveal } from "@/components/reveal"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "系列",
  description: `${site.name} 所有按主题串成系列的文章合集，从第一篇读起。`,
  alternates: { canonical: "/series" },
}

export default function SeriesIndexPage() {
  const seriesList = getAllSeries()

  return (
    <div className="min-h-screen pt-28 pb-20 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
        <header className="mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            系列 · {seriesList.length} 个
          </p>
          <h1 className="serif text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            按系列阅读
          </h1>
          <p className="text-muted leading-relaxed max-w-2xl mt-4">
            有些话题需要好几篇才能讲完。这里把它们顺序串好——
            就像翻一本只取出某一章的小册子。
          </p>
        </header>
        </Reveal>

        {seriesList.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="serif text-xl text-muted">暂无系列</p>
            <p className="text-sm text-muted-light mt-2">
              在文章 frontmatter 加 <code className="font-mono">series:</code> 字段即可归入系列。
            </p>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-4">
            {seriesList.map((s, i) => (
              <Reveal as="li" key={s.slug} delay={Math.min(i * 80, 400)}>
                <Link
                  href={`/series/${s.slug}`}
                  className="card p-6 sm:p-7 block group h-full"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-surface border hairline inline-flex items-center justify-center text-primary">
                      <Layers className="w-4 h-4" />
                    </span>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-light tabular-nums">
                      {String(s.count).padStart(2, "0")} 篇 ·{" "}
                      <time dateTime={s.startDate}>{s.startDate}</time>
                      {s.startDate !== s.endDate && (
                        <>
                          {" "}→ <time dateTime={s.endDate}>{s.endDate}</time>
                        </>
                      )}
                    </p>
                  </div>
                  <h2 className="serif text-2xl font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                    {s.name}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed line-clamp-2">
                    最新一篇：{s.latest.title}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
