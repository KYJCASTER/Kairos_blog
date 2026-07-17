import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllTags, getPostsByTagSlug } from "@/lib/posts"
import { PostArchiveList } from "@/components/post-archive-list"
import { Reveal } from "@/components/reveal"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllTags().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const result = getPostsByTagSlug(slug)
  if (!result) return { title: "未找到的标签" }
  const { tag, posts } = result
  const title = `#${tag.name}`
  const description = `所有以「${tag.name}」为主题的文章，共 ${posts.length} 篇。`
  return {
    title,
    description,
    alternates: { canonical: `/tags/${tag.slug}` },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}

export default async function TagPage({ params }: PageProps) {
  const { slug } = await params
  const result = getPostsByTagSlug(slug)
  if (!result) notFound()
  const { tag, posts } = result

  // Group by year (already date-sorted desc upstream).
  const byYear = new Map<string, typeof posts>()
  for (const p of posts) {
    const year = p.date.slice(0, 4)
    const arr = byYear.get(year) ?? []
    arr.push(p)
    byYear.set(year, arr)
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal>
        <header className="tag-hero mb-14" style={{ "--ink": tag.color }}>
          <div>
            <Link
              href="/tags"
              className="inline-block text-sm text-muted hover:text-primary transition-colors mb-5"
            >
              ← 所有标签
            </Link>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
              主题索引 · {posts.length} 篇
            </p>
            <h1 className="serif text-4xl sm:text-6xl font-semibold tracking-tight text-foreground">
              #{tag.name}
            </h1>
            <p className="mt-4 text-muted leading-relaxed max-w-2xl">
              这里收集所有以「{tag.name}」为线索的文章，像一张持续增补的主题卡片。
            </p>
          </div>
          <span aria-hidden className="tag-hero-mark serif italic">#</span>
        </header>
        </Reveal>

        <div className="space-y-12">
          {Array.from(byYear.entries()).map(([year, items]) => (
            <section key={year}>
              <div className="flex items-baseline gap-4 mb-4">
                <h2 className="serif text-3xl font-semibold text-muted-light tabular-nums">
                  {year}
                </h2>
                <span className="text-xs text-muted-light font-mono">
                  {items.length} 篇
                </span>
                <span className="flex-1 h-px bg-border" />
              </div>
              <PostArchiveList posts={items} />
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
