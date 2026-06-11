"use client"

import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: React.ReactNode
  /** Extra delay before the in-state flips, ms. Use for stagger. */
  delay?: number
  /** Wrapper element. Defaults to a div so it can wrap any block content. */
  as?: "div" | "section" | "article" | "li" | "span"
  className?: string
  /** Fire once (default) or every time the element re-enters the viewport. */
  once?: boolean
}

// Stable "am I hydrated?" boolean — same pattern as ThemeToggle, avoids
// the setState-in-effect lint complaint while still flipping post-hydration.
const noop = () => () => {}
const useHydrated = () =>
  useSyncExternalStore(noop, () => true, () => false)

/**
 * Fades + slides children into place when they cross into the viewport.
 *
 * Implementation notes:
 * - SSR/no-JS friendly: the `.reveal` class is only applied client-side,
 *   so static-export viewers without JS see content immediately
 *   (no flash of invisible content).
 * - Respects `prefers-reduced-motion` via the CSS in globals.css.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const armed = useHydrated()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!armed) return
    const node = ref.current
    if (!node) return

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            // Use a timeout (rather than CSS transition-delay) so a long
            // stagger doesn't keep elements invisible if the user scrolls
            // past quickly — once "in", they stay in.
            if (delay > 0) {
              window.setTimeout(() => setVisible(true), delay)
            } else {
              setVisible(true)
            }
            if (once) obs.unobserve(e.target)
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [armed, delay, once])

  return (
    <Tag
      ref={ref as never}
      className={cn(armed && "reveal", className)}
      data-reveal={visible ? "in" : undefined}
    >
      {children}
    </Tag>
  )
}
