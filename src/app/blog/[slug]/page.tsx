import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { getPublishedPosts, getPostBySlug, getAdjacentPosts, getRelatedPosts, getSeriesContext, tagSlug } from "@/lib/posts"
import { renderMDX, extractHeadings } from "@/lib/markdown"
import { computeReadingStats } from "@/lib/reading-time"
import { formatDate, toRoman } from "@/lib/utils"
import { TableOfContents } from "@/components/table-of-contents"
import { ReadingProgress } from "@/components/reading-progress"
import { ReadingPercent } from "@/components/reading-percent"
import { CodeCopyButtons } from "@/components/code-copy-buttons"
import { HeadingAnchors } from "@/components/heading-anchors"
import { ArticleShortcuts } from "@/components/article-shortcuts"
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"
import { CoverPanel } from "@/components/post-card"
import { Comments } from "@/components/comments"
import { SeriesBanner } from "@/components/series-banner"
import { PointerParallax } from "@/components/pointer-parallax"
import { Reveal } from "@/components/reveal"
import { site, resolveImage, rssAlternates } from "@/lib/site"
import { articleThemeFor } from "@/lib/article-theme"

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

  // Resolve cover → absolute OG URL, falling back to the default OG image so
  // every article still renders a social card. Shared helper lives in site.ts.
  const ogImage = resolveImage(post.cover)
  const images = [{ url: ogImage, width: 1200, height: 630, alt: post.title }]

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      modifiedTime: post.updated || post.date,
      authors: [site.author],
      tags: post.tags,
      url: `${site.url}/blog/${post.slug}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
    alternates: { canonical: `/blog/${post.slug}`, types: rssAlternates },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const [content, headings, { prev, next }, related, stats, seriesContext] = [
    await renderMDX(post.content, post.title),
    extractHeadings(post.content, post.title),
    getAdjacentPosts(post.slug),
    getRelatedPosts(post.slug, 3),
    computeReadingStats(post.content),
    getSeriesContext(post.slug),
  ]

  // Folio number — the post's position in the whole corpus, oldest = I.
  // Posts are date-desc, so the folio is (total − index).
  const allPosts = getPublishedPosts()
  const folio = allPosts.length - allPosts.findIndex((p) => p.slug === post.slug)

  // Reading theme, resolved from tags/series. `display: contents` keeps the
  // wrapper out of layout while letting every descendant — including the
  // fixed-position progress bar and percent chip — inherit the theme's
  // custom-property overrides from globals.css.
  const theme = articleThemeFor(post)

  return (
    <div className="contents" data-theme={theme}>
      <ReadingProgress targetSelector="#article-body" />
      <ReadingPercent targetSelector="#article-body" />
      <CodeCopyButtons />
      <HeadingAnchors />
      <ArticleShortcuts />
      <ArticleJsonLd post={post} wordCount={stats.totalWords} />
      <BreadcrumbJsonLd post={post} />

      <article className="pt-28 pb-20 px-5 sm:px-6 print:pt-4">
        {/* Back link */}
        <div className="max-w-3xl mx-auto mb-10 print:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            返回文章列表
          </Link>
        </div>

        {seriesContext && (
          <SeriesBanner
            series={seriesContext.series}
            index={seriesContext.index}
            prev={seriesContext.prev}
            next={seriesContext.next}
          />
        )}

        {/* Header */}
        <header className="max-w-5xl mx-auto mb-14">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left article-enter">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light mb-5">
                <span className="text-primary/70">№ {toRoman(folio)}</span>
                <span className="mx-3 text-border-strong">/</span>
                <time dateTime={post.date} className="tabular-nums">
                  {formatDate(post.date)}
                </time>
                {post.updated && post.updated !== post.date && (
                  <>
                    <span className="mx-3 text-border-strong">/</span>
                    <time dateTime={post.updated} className="tabular-nums">
                      更新 {formatDate(post.updated)}
                    </time>
                  </>
                )}
                <span className="mx-3 text-border-strong">/</span>
                <span>{stats.minutes} 分钟</span>
                <span className="mx-3 text-border-strong">/</span>
                <span>{stats.totalWords.toLocaleString()} 字</span>
              </p>

              <h1 className="serif-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-foreground mb-6">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="serif italic text-lg text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  {post.excerpt}
                </p>
              )}

              {post.tags.length > 0 && (
                <>
                  <span aria-hidden className="theme-rule mx-auto lg:mx-0 mt-8 mb-5" />
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${tagSlug(tag)}`}
                        className="tag-chip"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div
              className="cover-frame group relative hidden sm:block print:hidden max-w-sm mx-auto lg:mx-0 w-full aspect-[4/5] overflow-hidden sheen animate-fade-in-up"
              style={{ animationDelay: "0.22s" }}
            >
              <PointerParallax className="absolute inset-0" strength={6}>
                <CoverPanel post={post} monogramSize="xl" />
              </PointerParallax>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-primary/10 pointer-events-none" />
            </div>
          </div>
        </header>

        {/* Body + sticky TOC. Body track is bounded by .prose's 68ch measure
            (see globals.css), so on wide viewports the visual column stays
            comfortably narrow even though the grid track has slack. */}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_220px] gap-12 max-w-5xl mx-auto">
          <div className="min-w-0">
            <TableOfContents headings={headings} placement="mobile" />
            <div id="article-body" className="prose">
              {content}
            </div>
          </div>
          <aside>
            <TableOfContents headings={headings} placement="desktop" />
          </aside>
        </div>

        {/* Related reading (tag-overlap-ranked) */}
        {related.length > 0 && (
          <section
            aria-labelledby="related-heading"
            className="max-w-3xl mx-auto mt-20 pt-10 border-t hairline print:hidden"
          >
            <h2
              id="related-heading"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light mb-6"
            >
              相关阅读
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {related.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 90}>
                  <Link href={`/blog/${p.slug}`} className="card p-5 block group h-full">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-light mb-2 tabular-nums">
                      {p.date}
                    </p>
                    <p className="serif font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                      <span className="link-draw">{p.title}</span>
                    </p>
                    {p.excerpt && (
                      <p className="text-sm text-muted mt-2 line-clamp-2">{p.excerpt}</p>
                    )}
                  </Link>
                </Reveal>
              ))}
            </ul>
          </section>
        )}

        {/* Prev / next nav */}
        {(prev || next) && (
          <nav
            aria-label="文章导航"
            className="max-w-3xl mx-auto mt-20 pt-10 border-t hairline grid sm:grid-cols-2 gap-4 print:hidden"
          >
            {prev ? (
              <Reveal delay={0}>
                <Link
                  href={`/blog/${prev.slug}`}
                  className="card p-5 group sm:text-left block h-full"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-light mb-2 flex items-center gap-1.5">
                    <ArrowLeft className="w-3 h-3" /> 更新
                  </p>
                  <p className="serif font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    <span className="link-draw">{prev.title}</span>
                  </p>
                </Link>
              </Reveal>
            ) : (
              <span />
            )}
            {next ? (
              <Reveal delay={90}>
                <Link
                  href={`/blog/${next.slug}`}
                  className="card p-5 group text-right block h-full"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-light mb-2 flex items-center justify-end gap-1.5">
                    更旧 <ArrowRight className="w-3 h-3" />
                  </p>
                  <p className="serif font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                    <span className="link-draw">{next.title}</span>
                  </p>
                </Link>
              </Reveal>
            ) : (
              <span />
            )}
          </nav>
        )}

        <Comments />
      </article>
    </div>
  )
}
