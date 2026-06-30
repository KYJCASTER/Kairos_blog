import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getAllSeries, getSeriesBySlug } from "@/lib/posts"
import { PostArchiveList } from "@/components/post-archive-list"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSeries().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const series = getSeriesBySlug(slug)
  if (!series) return { title: "未找到的系列" }
  const title = `《${series.name}》系列`
  const description = `「${series.name}」系列共 ${series.count} 篇文章，从 ${series.startDate} 至 ${series.endDate}。`
  return {
    title,
    description,
    alternates: { canonical: `/series/${series.slug}` },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { slug } = await params
  const series = getSeriesBySlug(slug)
  if (!series) notFound()

  return (
    <div className="min-h-screen pt-28 pb-20 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-14">
          <Link
            href="/series"
            className="inline-block text-sm text-muted hover:text-primary transition-colors mb-5"
          >
            ← 所有系列
          </Link>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3 tabular-nums">
            系列 · {String(series.count).padStart(2, "0")} 篇 ·{" "}
            <time dateTime={series.startDate}>{series.startDate}</time>
            {series.startDate !== series.endDate && (
              <>
                {" "}→ <time dateTime={series.endDate}>{series.endDate}</time>
              </>
            )}
          </p>
          <h1 className="serif text-4xl sm:text-6xl font-semibold tracking-tight text-foreground">
            《{series.name}》
          </h1>
          <p className="mt-4 text-muted leading-relaxed max-w-2xl">
            按发布时间从早到晚排列。建议从第一篇读起——后面的文章默认你已经读过前面的。
          </p>
        </header>

        <section>
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light">
              全部 {series.count} 篇 · 顺序阅读
            </h2>
            <span className="flex-1 h-px bg-border" />
          </div>
          <PostArchiveList posts={series.posts} variant="series" />
        </section>
      </div>
    </div>
  )
}
