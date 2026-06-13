"use client"

import { useEffect, useState } from "react"
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
 */
export function BackToTop() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setShown(window.scrollY > 600)
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <button
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
        "hover:bg-foreground hover:text-background hover:scale-[1.06]",
        "active:scale-95",
        shown
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none",
      )}
    >
      <ArrowUpIcon className="w-[18px] h-[18px]" />
    </button>
  )
}
