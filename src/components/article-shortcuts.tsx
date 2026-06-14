"use client"

import { useEffect } from "react"

/**
 * Article-scoped keyboard shortcuts for power readers:
 *
 *   j / ↓ next h2 chapter
 *   k / ↑ previous h2 chapter
 *   g g  scroll to top
 *   G    scroll to bottom
 *   t    toggle the mobile TOC drawer / focus the desktop TOC
 *
 * The shortcuts are captured on `keydown` against window. We bail when the
 * user is typing in an input/textarea/contenteditable, when a modifier is
 * held (so browser shortcuts still work), and when the prefers-reduced-motion
 * media query is set we use instant scrolling.
 *
 * Mounted only inside the article page so the shortcuts don't leak into the
 * rest of the site.
 */
export function ArticleShortcuts() {
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
      if (isTypingTarget(e.target)) return

      const k = e.key

      if (k === "j" || k === "ArrowDown") {
        // Plain ArrowDown is a normal browser scroll; only hijack `j`.
        if (k !== "j") return
        e.preventDefault()
        const chapters = getChapters()
        if (!chapters.length) return
        const cursor = findCursor(chapters)
        const next = chapters[Math.min(chapters.length - 1, cursor + 1)]
        if (next) scrollToHeading(next)
        return
      }

      if (k === "k" || k === "ArrowUp") {
        if (k !== "k") return
        e.preventDefault()
        const chapters = getChapters()
        if (!chapters.length) return
        const cursor = findCursor(chapters)
        // If we're already inside chapter N (cursor = N), `k` should jump to
        // the *start* of chapter N first, then to N-1 on subsequent presses.
        const here = cursor >= 0 ? chapters[cursor] : null
        if (here && here.getBoundingClientRect().top < -8) {
          scrollToHeading(here)
          return
        }
        const prev = chapters[Math.max(0, cursor - 1)]
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

  return null
}
