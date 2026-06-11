import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { getPublishedPosts, getPostBySlug, getAdjacentPosts } from "@/lib/posts"
import { renderMDX, extractHeadings } from "@/lib/markdown"
import { computeReadingStats } from "@/lib/reading-time"
import { formatDate } from "@/lib/utils"
import { TableOfContents } from "@/components/table-of-contents"
import { ReadingProgress } from "@/components/reading-progress"
import { CodeCopyButtons } from "@/components/code-copy-buttons"
import { ArticleJsonLd } from "@/components/json-ld"
import { site } from "@/lib/site"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "未找到" }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [site.author],
      tags: post.tags,
      url: `${site.url}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: { canonical: `/blog/${post.slug}` },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const [content, headings, { prev, next }, stats] = [
    await renderMDX(post.content, post.title),
    extractHeadings(post.content, post.title),
    getAdjacentPosts(post.slug),
    computeReadingStats(post.content),
  ]

  return (
    <>
      <ReadingProgress targetSelector="#article-body" />
      <CodeCopyButtons />
      <ArticleJsonLd post={post} />

      <article className="pt-28 pb-20 px-5 sm:px-6">
        {/* Back link */}
        <div className="max-w-3xl mx-auto mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            返回文章列表
          </Link>
        </div>

        {/* Header */}
        <header className="max-w-3xl mx-auto mb-12 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light mb-5">
            <time dateTime={post.date} className="tabular-nums">
              {formatDate(post.date)}
            </time>
            <span className="mx-3 text-border-strong">/</span>
            <span>{stats.minutes} 分钟</span>
            <span className="mx-3 text-border-strong">/</span>
            <span>{stats.totalWords.toLocaleString()} 字</span>
          </p>

          <h1 className="serif text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.12] text-foreground mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="serif italic text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              {post.excerpt}
            </p>
          )}

          {post.tags.length > 0 && (
            <>
              <span aria-hidden className="block w-10 h-px bg-border-strong/50 mx-auto mt-8 mb-5" />
              <div className="flex flex-wrap justify-center gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="tag-chip"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </>
          )}
        </header>

        {/* Body + sticky TOC */}
        <div className="grid lg:grid-cols-[1fr_220px] gap-12 max-w-5xl mx-auto">
          <div id="article-body" className="prose max-w-none min-w-0">
            {content}
          </div>
          <aside>
            <TableOfContents headings={headings} />
          </aside>
        </div>

        {/* Prev / next nav */}
        {(prev || next) && (
          <nav
            aria-label="文章导航"
            className="max-w-3xl mx-auto mt-20 pt-10 border-t hairline grid sm:grid-cols-2 gap-4"
          >
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="card p-5 group sm:text-left"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-light mb-2 flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3" /> 更新
                </p>
                <p className="serif font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="card p-5 group text-right"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-light mb-2 flex items-center justify-end gap-1.5">
                  更旧 <ArrowRight className="w-3 h-3" />
                </p>
                <p className="serif font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {next.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>
    </>
  )
}
