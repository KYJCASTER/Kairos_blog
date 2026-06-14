"use client"

import { useEffect, useState } from "react"

/**
 * Compact percentage indicator that lives in the top-right of the viewport
 * on article pages. Mirrors the same calculation as <ReadingProgress /> but
 * surfaces the number for readers who want a precise sense of "how much
 * left?". Hidden until the reader has actually started scrolling, and on
 * narrow viewports where the navbar is busy.
 */
export function ReadingPercent({ targetSelector }: { targetSelector: string }) {
  const [progress, setProgress] = useState(0)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(targetSelector)
    if (!el) return

    let ticking = false
    const update = () => {
      const { top, height } = el.getBoundingClientRect()
      const viewport = window.innerHeight
      const total = height - viewport
      const passed = Math.max(0, -top)
      const ratio = total > 0 ? Math.min(1, passed / total) : 0
      setProgress(ratio)
      // Show after the reader is past the title block and before the
      // article ends with comments. Threshold > 1% lets us hide on first
      // paint without a flicker.
      setShown(ratio > 0.01 && ratio < 0.995)
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    // Lazy-loaded images / collapsed details elements grow the article body
    // after first paint; recompute progress when that happens.
    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => onScroll())
      ro.observe(el)
    }
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      ro?.disconnect()
    }
  }, [targetSelector])

  return (
    <div className="reading-percent" data-shown={shown ? "true" : "false"} aria-hidden>
      {Math.round(progress * 100)}%
    </div>
  )
}
