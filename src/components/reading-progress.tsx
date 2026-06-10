"use client"

import { useEffect, useState } from "react"

/**
 * Thin fixed bar at the top of the viewport that fills as the user scrolls
 * through the article. Reads the height of `targetSelector` element so the
 * progress reflects article body, not whole page.
 */
export function ReadingProgress({ targetSelector }: { targetSelector: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = document.querySelector<HTMLElement>(targetSelector)
    if (!el) return

    let ticking = false
    const update = () => {
      const { top, height } = el.getBoundingClientRect()
      const viewport = window.innerHeight
      // 0 when top of article is at top of viewport,
      // 1 when bottom of article reaches bottom of viewport.
      const total = height - viewport
      const passed = Math.max(0, -top)
      setProgress(total > 0 ? Math.min(1, passed / total) : 0)
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
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [targetSelector])

  return (
    <div
      className="reading-progress"
      style={{ ["--progress" as never]: progress } as React.CSSProperties}
      aria-hidden="true"
    />
  )
}
