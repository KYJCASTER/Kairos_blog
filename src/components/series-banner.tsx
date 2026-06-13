import Link from "next/link"
import { ArrowLeft, ArrowRight, Layers } from "lucide-react"

import type { PostSummary, SeriesInfo } from "@/lib/posts"

interface SeriesBannerProps {
  series: SeriesInfo
  /** 0-based index within the series. */
  index: number
  /** Earlier post in the series (or null if this is the first). */
  prev: PostSummary | null
  /** Later post in the series (or null if this is the last). */
  next: PostSummary | null
}

/**
 * Renders at the top of an in-series article. Sits between the back-link and
 * the article header so the reader sees their progress before they start
 * reading. Visually a card; semantically <nav> for the prev/next links.
 */
export function SeriesBanner({ series, index, prev, next }: SeriesBannerProps) {
  const total = series.count
  const position = `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`

  return (
    <aside
      aria-label={`本系列 ${series.name}，第 ${index + 1} 篇 / 共 ${total} 篇`}
      className="card max-w-3xl mx-auto mb-12 px-5 py-4 sm:px-6 sm:py-5"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="w-7 h-7 rounded-full bg-surface border hairline inline-flex items-center justify-center text-primary shrink-0">
          <Layers className="w-3.5 h-3.5" />
        </span>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-light tabular-nums flex-1">
          本系列 · 第 {position} 篇
        </p>
        <Link
          href={`/series/${series.slug}`}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted hover:text-primary transition-colors"
        >
          全部 →
        </Link>
      </div>

      <Link
        href={`/series/${series.slug}`}
        className="serif text-lg font-semibold text-foreground hover:text-primary transition-colors block leading-snug"
      >
        {series.name}
      </Link>

      <nav
        aria-label="系列内导航"
        className="grid sm:grid-cols-2 gap-2 mt-4 pt-4 border-t hairline"
      >
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="group flex items-start gap-2 text-sm text-muted hover:text-foreground transition-colors min-w-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 mt-0.5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <span className="min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-light block mb-0.5">
                上一篇
              </span>
              <span className="serif truncate block group-hover:text-primary transition-colors">
                {prev.title}
              </span>
            </span>
          </Link>
        ) : (
          <span className="text-sm text-muted-light italic">——这是系列的开篇——</span>
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="group flex items-start gap-2 text-sm text-muted hover:text-foreground transition-colors sm:text-right sm:justify-end min-w-0"
          >
            <span className="min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-light block mb-0.5">
                下一篇
              </span>
              <span className="serif truncate block group-hover:text-primary transition-colors">
                {next.title}
              </span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : (
          <span className="text-sm text-muted-light italic sm:text-right">——这是系列最新一篇——</span>
        )}
      </nav>
    </aside>
  )
}
