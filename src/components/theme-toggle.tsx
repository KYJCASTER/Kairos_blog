"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
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
      className="p-2.5 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
      aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
    >
      {!hydrated ? (
        <span className="w-[18px] h-[18px] block" />
      ) : isDark ? (
        <Sun className="w-[18px] h-[18px]" />
      ) : (
        <Moon className="w-[18px] h-[18px]" />
      )}
    </button>
  )
}
