"use client"

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { FuseResult, IFuseOptions } from "fuse.js"

import { SearchIcon } from "@/components/icons"
import { cn } from "@/lib/utils"
import { site } from "@/lib/site"

/**
 * Site-wide ⌘K search palette — the "index card" of the blog.
 *
 * Opens on ⌘K / Ctrl-K, on "/" (outside typing contexts), or via the
 * `kairos:open-search` window event (the navbar button dispatches it).
 * The article corpus (public/search-index.json) and Fuse are both lazy —
 * fetched only the first time the palette opens, same contract as the
 * /blog inline search.
 */

interface PaletteItem {
  id: string
  type: "page" | "post"
  title: string
  href: string
  /** Right-rail hint: page path or post date. */
  hint: string
  tags?: string[]
  keywords?: string
  excerpt?: string
  body?: string
}

interface SearchEntry {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  date: string
  body: string
}

const STATIC_PAGES: PaletteItem[] = [
  { id: "p-home", type: "page", title: "首页", href: "/", hint: "/", keywords: "home index kairos" },
  { id: "p-blog", type: "page", title: "文章", href: "/blog", hint: "/blog", keywords: "blog posts all 全部文章" },
  { id: "p-series", type: "page", title: "系列", href: "/series", hint: "/series", keywords: "series collections 专题" },
  { id: "p-tags", type: "page", title: "标签", href: "/tags", hint: "/tags", keywords: "tags topics 话题" },
  { id: "p-archive", type: "page", title: "档案", href: "/archive", hint: "/archive", keywords: "archive ledger 归档 账簿" },
  { id: "p-curriculum", type: "page", title: "学习足迹", href: "/curriculum", hint: "/curriculum", keywords: "curriculum courses 课程 书单" },
  { id: "p-about", type: "page", title: "关于", href: "/about", hint: "/about", keywords: "about me 作者 简介" },
  { id: "p-frontispiece", type: "page", title: "扉页", href: "/frontispiece", hint: "/frontispiece", keywords: "frontispiece cover 封面" },
]

const FUSE_OPTIONS: IFuseOptions<PaletteItem> = {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "tags", weight: 0.25 },
    { name: "keywords", weight: 0.2 },
    { name: "excerpt", weight: 0.15 },
    { name: "body", weight: 0.1 },
  ],
  threshold: 0.34,
  ignoreLocation: true,
  minMatchCharLength: 1,
  includeMatches: true,
}

type FuseConstructor = typeof import("fuse.js").default

/** Renders `text` with the matched ranges wrapped in <mark>. */
function Marked({
  text,
  indices,
}: {
  text: string
  indices?: readonly [number, number][]
}) {
  if (!indices || indices.length === 0) return <>{text}</>
  const parts: React.ReactNode[] = []
  let last = 0
  indices.forEach(([start, end], i) => {
    if (start > last) parts.push(text.slice(last, start))
    parts.push(
      <mark
        key={i}
        className="bg-primary-100 text-primary-dark dark:text-primary-light rounded-[3px] px-px"
      >
        {text.slice(start, end + 1)}
      </mark>,
    )
    last = end + 1
  })
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT" ||
    el.isContentEditable
  )
}

export function SearchPalette() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const [active, setActive] = useState(0)

  const [corpus, setCorpus] = useState<PaletteItem[] | null>(null)
  const [FuseCtor, setFuseCtor] = useState<FuseConstructor | null>(null)
  const loadStarted = useRef(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef<HTMLElement | null>(null)

  const ensureLoaded = useCallback(() => {
    if (loadStarted.current) return
    loadStarted.current = true
    Promise.all([
      fetch(`${site.basePath}/search-index.json`, { cache: "force-cache" })
        .then((r) => (r.ok ? r.json() : []))
        .then((data: SearchEntry[]) =>
          setCorpus([
            ...STATIC_PAGES,
            ...data.map<PaletteItem>((p) => ({
              id: `post-${p.slug}`,
              type: "post",
              title: p.title,
              href: `/blog/${p.slug}`,
              hint: p.date,
              tags: p.tags,
              excerpt: p.excerpt,
              body: p.body,
            })),
          ]),
        )
        .catch(() => setCorpus(STATIC_PAGES)),
      import("fuse.js").then((m) => setFuseCtor(() => m.default)),
    ]).catch(() => {})
  }, [])

  const openPalette = useCallback(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null
    setOpen(true)
    setQuery("")
    setActive(0)
    ensureLoaded()
  }, [ensureLoaded])

  const closePalette = useCallback(() => {
    setOpen(false)
    restoreFocusRef.current?.focus?.()
  }, [])

  // Global listeners: ⌘K / Ctrl-K toggles, "/" opens, custom event opens.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        if (open) closePalette()
        else openPalette()
        return
      }
      if (e.key === "/" && !isTypingTarget(e.target)) {
        e.preventDefault()
        openPalette()
      }
    }
    const onOpen = () => openPalette()
    window.addEventListener("keydown", onKey)
    window.addEventListener("kairos:open-search", onOpen)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("kairos:open-search", onOpen)
    }
  }, [open, openPalette, closePalette])

  // Focus the input + lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const id = window.setTimeout(() => inputRef.current?.focus(), 30)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.clearTimeout(id)
      document.body.style.overflow = prev
    }
  }, [open])

  const fuse = useMemo(() => {
    if (!FuseCtor || !corpus) return null
    return new FuseCtor(corpus, FUSE_OPTIONS)
  }, [FuseCtor, corpus])

  // Result groups. Empty query → all pages + five freshest posts (the
  // corpus keeps date-desc order from the build script).
  const { pages, posts } = useMemo<{
    pages: FuseResult<PaletteItem>[]
    posts: FuseResult<PaletteItem>[]
  }>(() => {
    const q = deferredQuery.trim()
    if (!q || !fuse) {
      const base = corpus ?? STATIC_PAGES
      return {
        pages: base
          .filter((i) => i.type === "page")
          .map((item, refIndex) => ({ item, refIndex })),
        posts: base
          .filter((i) => i.type === "post")
          .slice(0, 5)
          .map((item, refIndex) => ({ item, refIndex })),
      }
    }
    const matched = fuse.search(q, { limit: 12 })
    return {
      pages: matched.filter((r) => r.item.type === "page"),
      posts: matched.filter((r) => r.item.type === "post").slice(0, 8),
    }
  }, [deferredQuery, fuse, corpus])

  const flat = useMemo(() => [...pages, ...posts], [pages, posts])

  // Keep the active row in range whenever results shift.
  useEffect(() => {
    setActive((i) => Math.min(i, Math.max(0, flat.length - 1)))
  }, [flat.length])

  const go = useCallback(
    (href: string) => {
      closePalette()
      router.push(href)
    },
    [closePalette, router],
  )

  // Panel-scoped keys: ↑↓ / Enter / Esc / Tab trap.
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      closePalette()
      return
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      if (!flat.length) return
      const next =
        e.key === "ArrowDown"
          ? (active + 1) % flat.length
          : (active - 1 + flat.length) % flat.length
      setActive(next)
      listRef.current
        ?.querySelector(`[data-index="${next}"]`)
        ?.scrollIntoView({ block: "nearest" })
      return
    }
    if (e.key === "Enter") {
      e.preventDefault()
      const target = flat[active]
      if (target) go(target.item.href)
      return
    }
    if (e.key === "Tab" && panelRef.current) {
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        "input, a[href], button",
      )
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  if (!open) return null

  let rowIndex = -1
  const renderRow = (r: (typeof flat)[number]) => {
    rowIndex += 1
    const i = rowIndex
    const titleMatch = r.matches?.find((m) => m.key === "title")
    return (
      <li key={r.item.id} role="option" aria-selected={i === active}>
        <a
          id={`search-palette-item-${i}`}
          href={`${site.basePath}${r.item.href === "/" ? "" : r.item.href}/`}
          data-index={i}
          data-active={i === active}
          onClick={(e) => {
            e.preventDefault()
            go(r.item.href)
          }}
          onMouseEnter={() => setActive(i)}
          className={cn(
            "flex items-baseline gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-150",
            "data-[active=true]:bg-primary-50 dark:data-[active=true]:bg-primary-50",
          )}
        >
          <span
            className={cn(
              "serif text-[0.9375rem] font-medium truncate transition-colors",
              i === active ? "text-primary" : "text-foreground",
            )}
          >
            <Marked text={r.item.title} indices={titleMatch?.indices} />
          </span>
          {r.item.tags?.slice(0, 2).map((t) => (
            <span
              key={t}
              className="hidden sm:inline font-mono text-[10px] text-muted-light shrink-0"
            >
              #{t}
            </span>
          ))}
          <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-light shrink-0 tabular-nums">
            {r.item.hint}
          </span>
        </a>
      </li>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center pt-[10vh] sm:pt-[14vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="全站搜索"
      onKeyDown={onPanelKeyDown}
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-[backdrop-fade_200ms_var(--ease-soft)]"
        onClick={closePalette}
      />

      {/* Panel — the index card */}
      <div
        ref={panelRef}
        className="relative w-full max-w-xl bg-card border hairline-strong rounded-xl shadow-lg overflow-hidden animate-[palette-in_240ms_var(--ease-out)]"
      >
        <div className="flex items-center gap-3 px-4 border-b hairline">
          <SearchIcon className="w-4 h-4 text-muted-light shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            placeholder="搜索文章、标签、页面…"
            enterKeyHint="search"
            role="combobox"
            aria-expanded="true"
            aria-controls="search-palette-list"
            aria-activedescendant={flat.length ? `search-palette-item-${active}` : undefined}
            aria-label="搜索全站"
            className="w-full py-3.5 bg-transparent text-foreground placeholder:text-muted-light focus:outline-none text-[0.9375rem]"
          />
          <kbd className="kbd shrink-0">esc</kbd>
        </div>

        <div
          id="search-palette-list"
          ref={listRef}
          role="listbox"
          aria-label="搜索结果"
          className="max-h-[52vh] overflow-y-auto scrollbars-thin py-2"
        >
          {flat.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted">
              没有找到「{deferredQuery.trim()}」相关的内容
            </p>
          ) : (
            <>
              {pages.length > 0 && (
                <div>
                  <p className="px-4 pt-2 pb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-light">
                    页面
                  </p>
                  <ul>{pages.map(renderRow)}</ul>
                </div>
              )}
              {posts.length > 0 && (
                <div>
                  <p className="px-4 pt-2 pb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-light">
                    {deferredQuery.trim() ? "文章" : "最近书写"}
                  </p>
                  <ul>{posts.map(renderRow)}</ul>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-4 px-4 py-2.5 border-t hairline text-[11px] text-muted-light">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd>
            选择
          </span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="kbd">↵</kbd>
            打开
          </span>
          <span className="ml-auto hidden sm:inline font-mono text-[10px] uppercase tracking-[0.18em]">
            Kairos Index
          </span>
        </div>
      </div>
    </div>
  )
}
