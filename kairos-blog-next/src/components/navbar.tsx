"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { SearchBox } from "./search-box"
import { Zap, User, BookOpen } from "lucide-react"

const navItems = [
  { href: "/", label: "首页", icon: Zap },
  { href: "/blog", label: "博客", icon: BookOpen },
  { href: "/about", label: "关于", icon: User },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-[#FEFAE0] dark:bg-[#1A1A2E] border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[#E63946] border-4 border-black rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <span className="font-comic text-xl text-white">K</span>
            </div>
            <span className="font-comic text-2xl tracking-wider hidden sm:block">
              KAIROS
            </span>
          </Link>

          {/* Nav Links + Search */}
          <div className="flex items-center gap-1">
            {/* Search - Desktop */}
            <div className="hidden lg:block mr-4">
              <SearchBox variant="compact" />
            </div>

            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 font-comic text-lg tracking-wider transition-all",
                    "hover:-translate-y-1",
                    isActive && "text-[#E63946]"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#E63946] rounded-full" />
                  )}
                </Link>
              )
            })}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
