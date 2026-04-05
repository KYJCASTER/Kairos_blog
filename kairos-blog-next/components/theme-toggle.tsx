"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { ComicButton } from "./ui/comic-button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <ComicButton
      variant="secondary"
      size="sm"
      skew={false}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="ml-2"
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </ComicButton>
  )
}
