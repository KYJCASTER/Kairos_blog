"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ComicButton } from "./ui/comic-button"
import { Search } from "lucide-react"

interface SearchBoxProps {
  className?: string
  variant?: "default" | "compact"
}

export function SearchBox({ className = "", variant = "default" }: SearchBoxProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/blog?search=${encodeURIComponent(query.trim())}`)
    }
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSearch} className={`flex gap-2 ${className}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索..."
          className="px-3 py-2 border-4 border-black font-comic text-sm focus:outline-none focus:ring-2 focus:ring-[#4361EE] bg-white dark:bg-gray-800 w-32 lg:w-48"
        />
        <ComicButton type="submit" variant="secondary" size="sm" skew={false}>
          <Search className="w-4 h-4" />
        </ComicButton>
      </form>
    )
  }

  return (
    <form onSubmit={handleSearch} className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章..."
          className="w-full pl-10 pr-4 py-3 border-4 border-black font-comic focus:outline-none focus:ring-2 focus:ring-[#4361EE] bg-white dark:bg-gray-800"
        />
      </div>
      <ComicButton type="submit" variant="primary" skew={false}>
        搜索
      </ComicButton>
    </form>
  )
}
