"use client"

import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@/components/icons"
import { useRef, useSyncExternalStore } from "react"

// `useSyncExternalStore` with empty subscribe gives us a stable
// "am I hydrated?" boolean without the setState-in-effect lint complaint.
const noop = () => () => {}
const useHydrated = () =>
  useSyncExternalStore(
    noop,
    () => true,   // client snapshot — we're hydrated
    () => false   // server snapshot — we are not
  )

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const hydrated = useHydrated()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const current = resolvedTheme || theme
  const isDark = current === "dark"

  const toggle = () => {
    const next = isDark ? "light" : "dark"
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Circular reveal from the toggle — the incoming theme expands as a
    // circle clipped from the button's centre, like a lamp being switched
    // on in the reading room. Progressive enhancement: no API / reduced
    // motion → instant theme swap, nothing else changes.
    if (typeof document.startViewTransition !== "function" || reduceMotion) {
      setTheme(next)
      return
    }

    const rect = buttonRef.current?.getBoundingClientRect()
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth
    const y = rect ? rect.top + rect.height / 2 : 0
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    const vt = document.startViewTransition(() => setTheme(next))
    vt.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 560,
            easing: "cubic-bezier(0.32, 0.72, 0, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        )
      })
      .catch(() => {})
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggle}
      className="relative p-2.5 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors duration-300"
      // Gate the label on hydration too: the server can't know the stored
      // theme, so an ungated label mismatches first client render whenever
      // the visitor's saved theme isn't the default.
      aria-label={hydrated ? (isDark ? "切换到亮色模式" : "切换到暗色模式") : "切换主题"}
    >
      {/* Both icons share the same cell — cross-fade + slight rotation
          gives a small but human flip moment instead of a hard swap. */}
      <span className="relative block w-[18px] h-[18px]">
        <SunIcon
          aria-hidden
          className={[
            "absolute inset-0 w-[18px] h-[18px]",
            "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            hydrated && isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-75",
          ].join(" ")}
        />
        <MoonIcon
          aria-hidden
          className={[
            "absolute inset-0 w-[18px] h-[18px]",
            "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            hydrated && !isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-75",
          ].join(" ")}
        />
      </span>
    </button>
  )
}
