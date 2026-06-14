"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/markdown"

interface TableOfContentsProps {
  headings: Heading[]
  /**
   * Where this instance is rendered. Each placement only renders its own
   * markup so the post page can put the mobile drawer above the article body
   * and the desktop rail in a sticky aside.
   */
  placement?: "mobile" | "desktop"
}

/**
 * Group flat headings into h2 chapters with their h3/h4 children. h3+ before
 * the first h2 falls under a synthetic "preamble" entry that uses the first
 * h3 as its anchor. In practice articles always lead with h2, so this branch
 * almost never fires; we keep it just to never lose a heading.
 */
interface Chapter {
  /** h2 heading (or first child if no h2 came first). */
  head: Heading
  /** child h3/h4 headings until the next h2. */
  children: Heading[]
}

function groupChapters(headings: Heading[]): Chapter[] {
  const out: Chapter[] = []
  let cur: Chapter | null = null
  for (const h of headings) {
    if (h.level === 2) {
      cur = { head: h, children: [] }
      out.push(cur)
    } else if (cur) {
      cur.children.push(h)
    } else {
      // Stray h3/h4 before any h2 — treat the first one as a chapter head.
      cur = { head: h, children: [] }
      out.push(cur)
    }
  }
  return out
}

/**
 * Sticky right-rail (desktop) / collapsible drawer (mobile) TOC that doubles
 * as a chapter progress map. Each chapter row paints its own per-chapter fill
 * driven by `--chapter-progress` so readers can see *where in chapter 4* they
 * are, not just "chapter 4 is active".
 *
 * Active-state detection uses IntersectionObserver against headings; the
 * scroll-bound numerical progress is rAF-throttled and only writes to the
 * chapter currently being read (others are pinned to 0 or 1 by data-state).
 */
export function TableOfContents({ headings, placement = "desktop" }: TableOfContentsProps) {
  const chapters = useMemo(() => groupChapters(headings), [headings])
  const [activeId, setActiveId] = useState<string>("")
  const [overall, setOverall] = useState(0) // 0..1, fraction of chapters passed
  const railRef = useRef<HTMLDivElement | null>(null)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const chapterRefs = useRef<Map<string, HTMLLIElement>>(new Map())

  // Track active heading via IntersectionObserver. Same trigger zone as the
  // previous version — the top third of the viewport feels right for "what
  // section am I reading now?".
  useEffect(() => {
    if (!headings.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] }
    )

    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  // Compute per-chapter progress + overall. We don't keep these in React state
  // (would re-render on every scroll frame); instead we mutate CSS variables
  // directly. The active chapter id IS in state because it drives data-state.
  useEffect(() => {
    if (!chapters.length) return
    let raf = 0

    const update = () => {
      raf = 0
      const viewportTop = 96 // matches scroll-margin-top: 6rem
      // Pull the live position of every chapter head + its end (= next head's
      // top, or the article body's bottom). We refetch every frame because the
      // user might be loading images / expanding details elements.
      const article = document.getElementById("article-body")
      const articleBottom = article
        ? article.getBoundingClientRect().bottom + window.scrollY
        : Infinity

      const positions = chapters.map((c) => {
        const el = document.getElementById(c.head.id)
        return el ? el.getBoundingClientRect().top + window.scrollY : 0
      })

      let passed = 0
      for (let i = 0; i < chapters.length; i++) {
        const start = positions[i]
        const end = i + 1 < chapters.length ? positions[i + 1] : articleBottom
        const node = chapterRefs.current.get(chapters[i].head.id)
        if (!node) continue
        const scrollY = window.scrollY + viewportTop
        if (scrollY <= start) {
          node.style.setProperty("--chapter-progress", "0")
          node.dataset.state = i === 0 && scrollY > start - 200 ? "active" : "upcoming"
        } else if (scrollY >= end) {
          node.style.setProperty("--chapter-progress", "1")
          node.dataset.state = "done"
          passed++
        } else {
          const span = Math.max(1, end - start)
          const ratio = Math.min(1, Math.max(0, (scrollY - start) / span))
          node.style.setProperty("--chapter-progress", ratio.toFixed(4))
          node.dataset.state = "active"
          passed += ratio
        }
      }
      setOverall(chapters.length ? passed / chapters.length : 0)
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    // Article body height grows as lazy <img>s load — recompute when it does.
    // ResizeObserver beats listening to `window.load` because images can finish
    // long after the load event has fired (lazy / fetchpriority='low' images).
    let ro: ResizeObserver | null = null
    const article = document.getElementById("article-body")
    if (article && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => onScroll())
      ro.observe(article)
    }
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      ro?.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [chapters])

  // When the active chapter changes, scroll the desktop rail so its row sits
  // roughly in the middle of the visible TOC area. Long articles otherwise
  // leave the active row offscreen — defeats the point of a TOC. Only fires
  // on the desktop placement (mobile is a collapsible details element).
  useEffect(() => {
    if (placement !== "desktop" || !activeId) return
    const link = linkRefs.current.get(activeId)
    const rail = railRef.current
    if (!link || !rail) return
    const linkRect = link.getBoundingClientRect()
    const railRect = rail.getBoundingClientRect()
    if (linkRect.top < railRect.top + 32 || linkRect.bottom > railRect.bottom - 32) {
      const target =
        link.offsetTop - rail.clientHeight / 2 + link.clientHeight / 2
      rail.scrollTo({
        top: Math.max(0, target),
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      })
    }
  }, [activeId, placement])

  if (!headings.length) return null

  const list = (
    <ol ref={railRef as never} className="toc-rail space-y-0 list-none m-0 p-0 overflow-y-auto scrollbars-thin max-h-[calc(100vh-9rem)]">
      {chapters.map((c) => {
        const isActive = c.head.id === activeId
        const subActive = c.children.some((s) => s.id === activeId)
        return (
          <li
            key={c.head.id}
            ref={(el) => {
              // Keep the chapterRefs map in sync with the live DOM. React calls
              // the ref with `null` on unmount; without removing entries here
              // the map would accumulate forever during HMR / heading changes.
              if (el) chapterRefs.current.set(c.head.id, el)
              else chapterRefs.current.delete(c.head.id)
            }}
            className="toc-chapter"
            // NB: data-state is OWNED by the scroll handler in useEffect above.
            // Don't drive it from React state — the two would race and the
            // already-read chapters would flash back to "upcoming" on every
            // active-id change. React only owns the auxiliary data-has-active
            // flag below, which controls sub-list expansion.
            data-has-active={isActive || subActive ? "true" : "false"}
            style={{ ["--chapter-progress" as never]: 0 } as React.CSSProperties}
          >
            <a
              ref={(el) => {
                if (el) linkRefs.current.set(c.head.id, el)
                else linkRefs.current.delete(c.head.id)
              }}
              href={`#${c.head.id}`}
              className="toc-chapter-link"
            >
              {c.head.text}
            </a>
            {c.children.length > 0 && (isActive || subActive) && (
              <ul className="toc-sub">
                {c.children.map((s) => (
                  <li key={s.id}>
                    <a
                      ref={(el) => {
                        if (el) linkRefs.current.set(s.id, el)
                        else linkRefs.current.delete(s.id)
                      }}
                      href={`#${s.id}`}
                      className="toc-sub-link"
                      data-level={String(s.level)}
                      data-active={s.id === activeId ? "true" : "false"}
                    >
                      {s.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ol>
  )

  if (placement === "mobile") {
    return (
      <details className="lg:hidden mb-8 rounded-xl border hairline bg-card/40 px-5 py-3 group">
        <summary className="cursor-pointer flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <span>本页目录 · {chapters.length}</span>
          <span aria-hidden className="text-muted-light transition-transform duration-300 group-open:rotate-180">
            ▾
          </span>
        </summary>
        <span
          className="toc-overall-bar"
          aria-hidden
          style={{ ["--overall" as never]: overall.toFixed(4) } as React.CSSProperties}
        >
          <i />
        </span>
        <div className="mt-4">{list}</div>
      </details>
    )
  }

  return (
    <nav
      aria-label="目录"
      className={cn(
        "hidden lg:block sticky top-28 pr-2"
      )}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-light mb-3 flex items-center justify-between">
        <span>本页目录</span>
        <span className="tabular-nums">{Math.round(overall * 100)}%</span>
      </p>
      {list}
    </nav>
  )
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
}
