import type { Metadata } from "next"
import Link from "next/link"

import { getPublishedPosts } from "@/lib/posts"
import { computeReadingStats } from "@/lib/reading-time"
import { ArchiveLedger, type ArchiveLedgerItem } from "@/components/archive-ledger"
import { SectionOrnament } from "@/components/section-ornament"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "档案",
  description: `${site.name} 全部文章按年月铺开的紧凑档案。`,
  alternates: { canonical: "/archive" },
}

const MONTH_LABEL: Record<string, string> = {
  "01": "一月", "02": "二月", "03": "三月", "04": "四月",
  "05": "五月", "06": "六月", "07": "七月", "08": "八月",
  "09": "九月", "10": "十月", "11": "十一月", "12": "十二月",
}

export default function ArchivePage() {
  const posts = getPublishedPosts()

  // Aggregate totals while we're already iterating once over the corpus.
  // Total words use the CJK-aware reader so a Chinese-only post isn't
  // counted as a single word.
  let totalWords = 0
  for (const p of posts) totalWords += computeReadingStats(p.content).totalWords

  // Group: year → month → posts (already date-DESC sorted by getAllPosts).
  const byYear = new Map<string, Map<string, ArchiveLedgerItem[]>>()
  for (const p of posts) {
    const year = p.date.slice(0, 4)
    const month = p.date.slice(5, 7)
    let yearMap = byYear.get(year)
    if (!yearMap) {
      yearMap = new Map()
      byYear.set(year, yearMap)
    }
    let monthArr = yearMap.get(month)
    if (!monthArr) {
      monthArr = []
      yearMap.set(month, monthArr)
    }
    monthArr.push({ slug: p.slug, title: p.title, date: p.date, tags: p.tags })
  }

  const years = Array.from(byYear.keys())

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <header className="mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            Archive
          </p>
          <h1 className="serif text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-5">
            档案
          </h1>
          <p className="text-muted leading-relaxed max-w-2xl">
            所有文章按年月铺开。这里没有头图，没有摘要——只是一份册子。
            最适合想找某一篇旧文、或者只是路过看看堆了多少。
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light mt-6 tabular-nums">
            共 {posts.length} 篇 · 跨越 {years.length} 年 · 总计 {totalWords.toLocaleString()} 字
          </p>
        </header>

        <SectionOrnament variant="diamond" />

        {posts.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="serif text-xl text-muted">尚未发布任何文章</p>
          </div>
        ) : (
          <div className="space-y-16">
            {years.map((year) => {
              const monthMap = byYear.get(year)!
              const yearTotal = Array.from(monthMap.values()).reduce(
                (acc, arr) => acc + arr.length,
                0,
              )
              return (
                <section key={year}>
                  <div className="flex items-baseline gap-4 mb-6">
                    <h2 className="serif text-5xl font-semibold text-muted-light tabular-nums leading-none">
                      {year}
                    </h2>
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light tabular-nums">
                      {yearTotal} 篇
                    </span>
                    <span className="flex-1 h-px bg-border" />
                  </div>

                  <div className="space-y-8">
                    {Array.from(monthMap.entries()).map(([month, items]) => (
                      <div key={month}>
                        <h3 className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-light mb-2 tabular-nums">
                          {month} · {MONTH_LABEL[month] ?? ""}
                        </h3>
                        <ArchiveLedger posts={items} />
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}

        <SectionOrnament variant="rule" />

        <div className="text-center">
          <Link href="/blog" className="btn-secondary">
            回到文章列表
          </Link>
        </div>
      </div>
    </main>
  )
}
