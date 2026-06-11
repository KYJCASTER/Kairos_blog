"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { GitHubIcon } from "./icons"
import { site } from "@/lib/site"

const navItems = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "文章" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" },
] as const

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "transition-[background,backdrop-filter,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        scrolled
          ? "bg-background/75 backdrop-blur-xl border-b hairline shadow-[0_1px_0_0_rgba(0,0,0,0.02)]"
          : "bg-transparent border-b border-transparent"
      )}
      role="navigation"
      aria-label="主导航"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <div className="h-16 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            aria-label={`${site.name} 首页`}
          >
            <span className="w-8 h-8 rounded-md bg-foreground text-background flex items-center justify-center font-serif font-bold text-base transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-primary group-hover:rotate-[-6deg] group-hover:scale-105">
              K
            </span>
            <span className="hidden sm:inline serif text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
              {site.name}
            </span>
          </Link>

          {/* Center nav (hidden on small screens, becomes scrollable row) */}
          <div className="flex-1 flex items-center justify-center">
            <ul className="flex items-center gap-1 text-sm">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname?.startsWith(`${item.href}/`))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group/nav relative px-3 py-2 rounded-md font-medium transition-colors duration-300",
                        active
                          ? "text-foreground"
                          : "text-muted hover:text-foreground"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                      {/* Underline: scales in on active, hint-scales on hover. */}
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-primary origin-center",
                          "transition-transform duration-500 ease-[cubic-bezier(0.34,1.36,0.64,1)]",
                          active
                            ? "scale-x-100"
                            : "scale-x-0 group-hover/nav:scale-x-50 group-hover/nav:opacity-40"
                        )}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggle />
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors duration-300"
              aria-label="GitHub"
            >
              <GitHubIcon className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
