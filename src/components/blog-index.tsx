"use client"

import { useEffect, useMemo, useState, useRef, useDeferredValue } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Fuse from "fuse.js"
import { Search, X, ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"

export interface SearchablePost {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  date: string
  body: string
}

interface BlogIndexProps {
  posts: SearchablePost[]
  allTags: { name: string; count: number; color: string }[]
}

export function BlogIndex({ posts, allTags }: BlogIndexProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize from URL so /blog?tag=Java or /blog?search=hooks is shareable.
  const initialTag = searchParams.get("tag") || null
  const initialQuery = searchParams.get("search") || ""

  const [query, setQuery] = useState(initialQuery)
  const deferredQuery = useDeferredValue(query)
  const [activeTag, setActiveTag] = useState<string | null>(initialTag)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reflect filter state back into the URL (no router push — just replace).
  // Skip the very first run so we don't dirty browser history on mount.
  const firstSync = useRef(true)
  useEffect(() => {
    if (firstSync.current) {
      firstSync.current = false
      return
    }
    const params = new URLSearchParams()
    if (query) params.set("search", query)
    if (activeTag) params.set("tag", activeTag)
    const qs = params.toString()
    router.replace(qs ? `/blog?${qs}` : "/blog", { scroll: false })
  }, [query, activeTag, router])

  // ⌘K / Ctrl-K to focus, Esc to clear.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("")
        inputRef.current?.blur()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: [
          { name: "title", weight: 0.5 },
          { name: "tags", weight: 0.25 },
          { name: "excerpt", weight: 0.15 },
          { name: "body", weight: 0.1 },
        ],
        threshold: 0.34,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [posts]
  )

  const filtered = useMemo(() => {
    let base: SearchablePost[] = posts
    if (deferredQuery.trim()) base = fuse.search(deferredQuery.trim()).map((r) => r.item)
    if (activeTag) base = base.filter((p) => p.tags.includes(activeTag))
    return base
  }, [deferredQuery, activeTag, posts, fuse])

  // Group by year (already date-sorted desc upstream).
  const groupedByYear = useMemo(() => {
    const groups = new Map<string, SearchablePost[]>()
    for (const p of filtered) {
      const year = p.date.slice(0, 4)
      const arr = groups.get(year) ?? []
      arr.push(p)
      groups.set(year, arr)
    }
    return Array.from(groups.entries()) // preserves insertion order = desc
  }, [filtered])

  const hasFilter = Boolean(query || activeTag)

  return (
    <main className="min-h-screen pt-28 pb-20">
      {/* Header */}
      <section className="px-5 sm:px-6 mb-12">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            文章 · {posts.length} 篇
          </p>
          <h1 className="serif text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            所有书写
          </h1>
        </div>
      </section>

      {/* Search + tag filters */}
      <section className="px-5 sm:px-6 mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索标题、标签、正文…"
              className="w-full pl-11 pr-20 py-3 rounded-xl bg-card border hairline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-light transition-all"
              aria-label="搜索文章"
            />
            {query ? (
              <button
                onClick={() => setQuery("")}
                aria-label="清除"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-light border hairline rounded px-1.5 py-0.5">
                ⌘K
              </kbd>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setActiveTag(null)}
                className={`tag-chip ${!activeTag ? "border-primary text-primary" : ""}`}
              >
                全部 <span className="opacity-60">{posts.length}</span>
              </button>
              {allTags.map((tag) => {
                const active = activeTag === tag.name
                return (
                  <button
                    key={tag.name}
                    onClick={() => setActiveTag(active ? null : tag.name)}
                    className="tag-chip"
                    style={active ? { borderColor: tag.color, color: tag.color } : undefined}
                  >
                    {tag.name} <span className="opacity-60">{tag.count}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="px-5 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="serif text-xl text-muted mb-2">没有匹配的文章</p>
              <p className="text-sm text-muted-light">
                试试换个关键词，或者{" "}
                <button
                  onClick={() => {
                    setQuery("")
                    setActiveTag(null)
                  }}
                  className="text-primary hover:underline"
                >
                  清除筛选
                </button>
              </p>
            </div>
          ) : (
            // When the user has typed/filtered, year grouping just feels noisy.
            <div className="space-y-12">
              {hasFilter ? (
                <YearList posts={filtered} />
              ) : (
                groupedByYear.map(([year, items]) => (
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
                    <YearList posts={items} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function YearList({ posts }: { posts: SearchablePost[] }) {
  return (
    <ul className="divide-y hairline">
      {posts.map((post, i) => (
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
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {post.tags.map((t) => (
                      <span key={t} className="tag-chip">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <ArrowUpRight className="hidden sm:block w-5 h-5 text-muted-light group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.36,0.64,1)]" />
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
