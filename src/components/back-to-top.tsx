"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpIcon } from "@/components/icons"
import { cn } from "@/lib/utils"

/**
 * Floating "back to top" button.
 *
 * Long-form articles need this. We hide it until the user has actually
 * scrolled (>600px) so it never fights the hero on first paint, and fade
 * + slide it out of the way on disappear so it never feels mechanical.
 * Smooth scroll + focus on <html> so screen-reader/keyboard users land
 * back at the top of the document, not floating in the middle.
 *
 * The ring around the button tracks overall scroll progress — written as
 * the --btt-progress CSS var from the rAF-throttled scroll handler, so
 * the arc updates without a single React re-render.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      buttonRef.current?.style.setProperty("--btt-progress", progress.toFixed(4))
      setShown(window.scrollY > 600)
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    // Content height can change (images, comments iframe) — recompute.
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" })
        // Move focus back to the document so screen readers recover anchor.
        const html = document.documentElement
        html.setAttribute("tabindex", "-1")
        html.focus({ preventScroll: true })
        html.removeAttribute("tabindex")
      }}
      aria-label="返回顶部"
      // aria-hidden when invisible so screen readers don't announce the
      // off-screen button as a stray reachable control.
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={cn(
        "fixed z-40 bottom-6 right-6 sm:bottom-8 sm:right-8",
        "w-11 h-11 rounded-full",
        "bg-card/85 backdrop-blur-md text-foreground",
        "border hairline-strong shadow-[var(--shadow-md)]",
        "flex items-center justify-center",
        "transition-[opacity,transform,background,color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "hover:bg-foreground hover:text-background hover:scale-[1.025]",
        "active:scale-[0.985]",
        shown
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none",
      )}
    >
      {/* Scroll-progress arc — sits just outside the button's border. */}
      <svg
        aria-hidden
        viewBox="0 0 48 48"
        className="absolute -inset-[4px] w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90 pointer-events-none"
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="var(--border-strong)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="btt-ring"
        />
      </svg>
      <ArrowUpIcon className="w-[18px] h-[18px]" />
    </button>
  )
}
