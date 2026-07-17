"use client"

import { useEffect, useMemo, useState, useRef, useDeferredValue, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { IFuseOptions } from "fuse.js"

import { SearchIcon, XIcon } from "@/components/icons"
import { PostArchiveList } from "@/components/post-archive-list"
import { site } from "@/lib/site"
import Link from "next/link"

// Lightweight item rendered in the year-grouped list. No body content —
// the search corpus is fetched on demand from public/search-index.json.
interface ListItem {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  date: string
}

// What the search corpus JSON contains. Adds `body` for fuzzy matching.
interface SearchEntry extends ListItem {
  body: string
}

interface BlogIndexProps {
  posts: ListItem[]
  allTags: { name: string; count: number; color: string }[]
}

// Type-only — the runtime value is dynamically imported on first use.
type FuseConstructor = typeof import("fuse.js").default

const FUSE_OPTIONS: IFuseOptions<SearchEntry> = {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "tags", weight: 0.25 },
    { name: "excerpt", weight: 0.15 },
    { name: "body", weight: 0.1 },
  ],
  threshold: 0.34,
  ignoreLocation: true,
  minMatchCharLength: 2,
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

  // Search corpus + Fuse constructor are loaded lazily — only paid for when
  // the user actually wants to search. Visitors who only browse the year-
  // grouped list never download Fuse or the body snippets.
  const [corpus, setCorpus] = useState<SearchEntry[] | null>(null)
  const [FuseCtor, setFuseCtor] = useState<FuseConstructor | null>(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const loadStarted = useRef(false)

  const ensureSearchLoaded = useCallback(() => {
    if (loadStarted.current) return
    loadStarted.current = true
    setSearchLoading(true)
    Promise.all([
      fetch(`${site.basePath}/search-index.json`, { cache: "force-cache" })
        .then((r) => (r.ok ? r.json() : []))
        .then((data: SearchEntry[]) => setCorpus(data))
        .catch(() => setCorpus([])),
      import("fuse.js").then((m) => setFuseCtor(() => m.default)),
    ]).finally(() => setSearchLoading(false))
  }, [])

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

  // Trigger lazy load whenever there's an actual search term — covers both
  // the user-typed and deep-link cases (?search=foo).
  useEffect(() => {
    if (query.trim()) ensureSearchLoaded()
  }, [query, ensureSearchLoaded])

  // Esc clears the query. (⌘K / Ctrl-K now opens the site-wide search
  // palette — see <SearchPalette /> — so this page only handles its own
  // input's Escape.)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setQuery("")
        inputRef.current?.blur()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const fuse = useMemo(() => {
    if (!FuseCtor || !corpus) return null
    return new FuseCtor(corpus, FUSE_OPTIONS)
  }, [FuseCtor, corpus])

  const filtered = useMemo(() => {
    let base: ListItem[] = posts
    const q = deferredQuery.trim()
    if (q) {
      if (fuse) {
        // Fuse is loaded: use fuzzy match against the body-augmented corpus.
        const matched = fuse.search(q).map((r) => r.item)
        const slugs = new Set(matched.map((m) => m.slug))
        base = posts.filter((p) => slugs.has(p.slug))
        // preserve fuzzy-match order
        base.sort(
          (a, b) =>
            matched.findIndex((m) => m.slug === a.slug) -
            matched.findIndex((m) => m.slug === b.slug),
        )
      } else {
        // Fuse not loaded yet — fall back to a simple title/tag/excerpt
        // substring match so deep-links and the brief loading window still
        // surface results immediately.
        const needle = q.toLowerCase()
        base = posts.filter(
          (p) =>
            p.title.toLowerCase().includes(needle) ||
            p.excerpt.toLowerCase().includes(needle) ||
            p.tags.some((t) => t.toLowerCase().includes(needle)),
        )
      }
    }
    if (activeTag) base = base.filter((p) => p.tags.includes(activeTag))
    return base
  }, [deferredQuery, activeTag, posts, fuse])

  // Group by year (already date-sorted desc upstream).
  const groupedByYear = useMemo(() => {
    const groups = new Map<string, ListItem[]>()
    for (const p of filtered) {
      const year = p.date.slice(0, 4)
      const arr = groups.get(year) ?? []
      arr.push(p)
      groups.set(year, arr)
    }
    return Array.from(groups.entries()) // preserves insertion order = desc
  }, [filtered])

  const hasFilter = Boolean(query || activeTag)
  const clearFilters = () => {
    setQuery("")
    setActiveTag(null)
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* Header */}
      <section className="px-5 sm:px-6 mb-12">
        <div className="max-w-5xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            文章 · {posts.length} 篇
          </p>
          <h1 className="serif text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            所有文章
          </h1>
          <p className="text-sm text-muted mt-4">
            想看更紧凑的全列表？
            <Link
              href="/archive"
              className="ml-1 text-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
            >
              翻档案 →
            </Link>
          </p>
        </div>
      </section>

      {/* Search + tag filters */}
      <section className="px-5 sm:px-6 mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="relative mb-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={ensureSearchLoaded}
              placeholder={searchLoading ? "正在准备搜索…" : "搜索标题、标签、正文…"}
              enterKeyHint="search"
              className="w-full pl-11 pr-20 py-3 rounded-xl bg-card border hairline focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-light transition-all"
              aria-label="搜索文章"
            />
            {query ? (
              <button
                onClick={() => setQuery("")}
                aria-label="清除"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted hover:text-foreground hover:bg-surface"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("kairos:open-search"))}
                aria-label="打开全站搜索（⌘K）"
                className="kbd hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2"
              >
                ⌘K
              </button>
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
          <p
            aria-live="polite"
            className="sr-only"
          >
            {hasFilter ? `${filtered.length} 篇匹配` : `共 ${posts.length} 篇文章`}
          </p>
          {hasFilter && (
            <div className="filter-summary mb-8">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light mb-1">
                  筛选中 · {filtered.length} / {posts.length} 篇
                </p>
                <div className="flex flex-wrap gap-2">
                  {query && <span className="tag-chip tag-chip-static">关键词：{query}</span>}
                  {activeTag && <span className="tag-chip tag-chip-static">标签：{activeTag}</span>}
                </div>
              </div>
              <button onClick={clearFilters} className="btn-secondary shrink-0">
                清除筛选
              </button>
            </div>
          )}

          {filtered.length === 0 && query.trim() && (searchLoading || !fuse) ? (
            <div className="card p-12 text-center" aria-live="polite">
              <p className="serif text-xl text-muted mb-2">正在搜索…</p>
              <p className="text-sm text-muted-light">正在准备全文搜索索引</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="serif text-xl text-muted mb-2">没有匹配的文章</p>
              <p className="text-sm text-muted-light">
                试试换个关键词，或者{" "}
                <button onClick={clearFilters} className="text-primary hover:underline">
                  清除筛选
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {hasFilter ? (
                <section>
                  <div className="flex items-baseline gap-4 mb-4">
                    <h2 className="serif text-3xl font-semibold text-muted-light tabular-nums">
                      Results
                    </h2>
                    <span className="text-xs text-muted-light font-mono">
                      {filtered.length} 篇
                    </span>
                    <span className="flex-1 h-px bg-border" />
                  </div>
                  <PostArchiveList posts={filtered} />
                </section>
              ) : (
                groupedByYear.map(([year, items]) => (
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
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
