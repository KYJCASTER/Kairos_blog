"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Article-scoped keyboard shortcuts for power readers:
 *
 *   j / k  next / previous h2 chapter
 *   g g    scroll to top
 *   G      scroll to bottom
 *   t      toggle the mobile TOC drawer / focus the desktop TOC
 *   ?      this help card
 *
 * The shortcuts are captured on `keydown` against window. We bail when the
 * user is typing in an input/textarea/contenteditable, when a modifier is
 * held (so browser shortcuts still work), and when the prefers-reduced-motion
 * media query is set we use instant scrolling.
 *
 * Mounted only inside the article page so the shortcuts don't leak into the
 * rest of the site.
 */

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["j", "k"], label: "下一章 / 上一章" },
  { keys: ["g", "g"], label: "回到卷首" },
  { keys: ["G"], label: "跳至卷末" },
  { keys: ["t"], label: "目录抽屉 / 聚焦目录" },
  { keys: ["⌘K"], label: "全站搜索" },
  { keys: ["?"], label: "这张卡片" },
]

export function ArticleShortcuts() {
  const [helpOpen, setHelpOpen] = useState(false)
  // Mirror for the keydown closure — the listener is bound once, so it
  // can't read fresh state directly.
  const helpOpenRef = useRef(false)
  const setHelp = (v: boolean) => {
    helpOpenRef.current = v
    setHelpOpen(v)
  }

  useEffect(() => {
    let lastG = 0
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth"

    const isTypingTarget = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false
      const tag = el.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true
      if (el.isContentEditable) return true
      return false
    }

    const getChapters = () =>
      Array.from(document.querySelectorAll<HTMLElement>("#article-body h2[id]"))

    /** Find the chapter currently above (or at) the visible reading line. */
    const findCursor = (chapters: HTMLElement[]) => {
      const line = 120 // visual reading line, just below the navbar
      let cursor = -1
      for (let i = 0; i < chapters.length; i++) {
        const top = chapters[i].getBoundingClientRect().top
        if (top - line <= 0) cursor = i
        else break
      }
      return cursor
    }

    const scrollToHeading = (h: HTMLElement) => {
      const top = h.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top, behavior })
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const k = e.key

      // While the help card is open it owns the keyboard: only Esc / ?
      // act (both close it), everything else is swallowed.
      if (helpOpenRef.current) {
        if (k === "Escape" || k === "?") {
          e.preventDefault()
          setHelp(false)
        }
        return
      }

      if (isTypingTarget(e.target)) return

      if (k === "?") {
        e.preventDefault()
        setHelp(true)
        return
      }

      if (k === "j" || k === "ArrowDown") {
        // Plain ArrowDown is a normal browser scroll; only hijack `j`.
        if (k !== "j") return
        e.preventDefault()
        const chapters = getChapters()
        if (!chapters.length) return
        const cursor = findCursor(chapters)
        // No chapter ahead — let `j` quietly do nothing rather than slamming
        // back to the current chapter top (which is what Math.min(cursor, last)
        // would do).
        if (cursor + 1 >= chapters.length) return
        const next = chapters[cursor + 1]
        if (next) scrollToHeading(next)
        return
      }

      if (k === "k" || k === "ArrowUp") {
        if (k !== "k") return
        e.preventDefault()
        const chapters = getChapters()
        if (!chapters.length) return
        const cursor = findCursor(chapters)
        // Three cases:
        //   cursor === -1  → reader is above the first chapter (in the title
        //                    block). `k` should do nothing rather than push
        //                    them down into chapter 1.
        //   inside chap N  → first press jumps to the *start* of chap N, then
        //                    subsequent presses go N-1, N-2 …
        //   exactly at N   → jump to chap N-1.
        if (cursor < 0) return
        const here = chapters[cursor]
        if (here && here.getBoundingClientRect().top < -8) {
          scrollToHeading(here)
          return
        }
        if (cursor === 0) return
        const prev = chapters[cursor - 1]
        if (prev) scrollToHeading(prev)
        return
      }

      if (k === "g") {
        const now = Date.now()
        if (now - lastG < 500) {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior })
          lastG = 0
        } else {
          lastG = now
        }
        return
      }

      if (k === "G") {
        e.preventDefault()
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior })
        return
      }

      if (k === "t") {
        // Mobile drawer is the closest <details> with TOC summary; on
        // desktop the rail isn't a details element — focus the first link
        // instead, which scrolls the rail into view if needed.
        e.preventDefault()
        const drawer = document.querySelector<HTMLDetailsElement>(
          "details:has(.toc-rail)"
        )
        if (drawer && getComputedStyle(drawer).display !== "none") {
          drawer.open = !drawer.open
          return
        }
        const firstLink = document.querySelector<HTMLAnchorElement>(
          ".toc-rail .toc-chapter-link"
        )
        firstLink?.focus()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  if (!helpOpen) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="阅读快捷键"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-[backdrop-fade_200ms_var(--ease-soft)]"
        onClick={() => setHelp(false)}
      />
      <div className="relative w-full max-w-xs bg-card border hairline-strong rounded-xl shadow-lg p-5 animate-[palette-in_240ms_var(--ease-out)]">
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-light">
            阅读快捷键
          </p>
          <kbd className="kbd">esc</kbd>
        </div>
        <ul className="space-y-2.5">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 shrink-0">
                {s.keys.map((k, i) => (
                  <kbd key={i} className="kbd">
                    {k}
                  </kbd>
                ))}
              </span>
              <span className="text-sm text-muted">{s.label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 pt-3 border-t hairline font-mono text-[10px] uppercase tracking-[0.2em] text-muted-light">
          Lector Clavis · Reader&apos;s Keys
        </p>
      </div>
    </div>
  )
}
