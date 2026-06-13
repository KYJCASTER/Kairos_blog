import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllTags, getPostsByTagSlug } from "@/lib/posts"
import { ArrowUpRightIcon } from "@/components/icons"
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
    <main className="min-h-screen pt-28 pb-20 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-14">
          <Link
            href="/tags"
            className="inline-block text-sm text-muted hover:text-primary transition-colors mb-5"
          >
            ← 所有标签
          </Link>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            主题 · {posts.length} 篇
          </p>
          <h1
            className="serif text-4xl sm:text-5xl font-semibold tracking-tight"
            style={{ color: tag.color }}
          >
            #{tag.name}
          </h1>
        </header>

        <div className="space-y-12">
          {Array.from(byYear.entries()).map(([year, items]) => (
            <div key={year}>
              <div className="flex items-baseline gap-4 mb-2">
                <h2 className="serif text-3xl font-semibold text-muted-light tabular-nums">
                  {year}
                </h2>
                <span className="text-xs text-muted-light font-mono">
                  {items.length} 篇
                </span>
                <span className="flex-1 h-px bg-border" />
              </div>
              <ul className="divide-y hairline">
                {items.map((post, i) => (
                  <li key={post.slug}>
                    <Reveal delay={Math.min(i, 6) * 70}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group grid sm:grid-cols-[120px_1fr_auto] gap-2 sm:gap-8 py-7 items-baseline"
                      >
                        <time className="font-mono text-[11px] text-muted-light tabular-nums tracking-wider uppercase">
                          {post.date.slice(5).replace("-", " / ")}
                        </time>
                        <div className="min-w-0">
                          <h3 className="serif text-xl sm:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted mt-2 line-clamp-2">{post.excerpt}</p>
                        </div>
                        <ArrowUpRightIcon className="hidden sm:block w-5 h-5 text-muted-light group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.36,0.64,1)]" />
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
