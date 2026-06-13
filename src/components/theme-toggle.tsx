"use client"

import { useTheme } from "next-themes"
import { SunIcon, MoonIcon } from "@/components/icons"
import { useSyncExternalStore } from "react"

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

  const current = resolvedTheme || theme
  const isDark = current === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2.5 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors duration-300"
      aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
    >
      {/* Both icons share the same cell — cross-fade + slight rotation
          gives a small but human flip moment instead of a hard swap. */}
      <span className="relative block w-[18px] h-[18px]">
        <SunIcon
          aria-hidden
          className={[
            "absolute inset-0 w-[18px] h-[18px]",
            "transition-all duration-500 ease-[cubic-bezier(0.34,1.36,0.64,1)]",
            hydrated && isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-75",
          ].join(" ")}
        />
        <MoonIcon
          aria-hidden
          className={[
            "absolute inset-0 w-[18px] h-[18px]",
            "transition-all duration-500 ease-[cubic-bezier(0.34,1.36,0.64,1)]",
            hydrated && !isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 rotate-90 scale-75",
          ].join(" ")}
        />
      </span>
    </button>
  )
}
