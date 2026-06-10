"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/markdown"

interface TableOfContentsProps {
  headings: Heading[]
}

/**
 * Sticky right-rail TOC. Tracks the most-recently-passed heading using
 * IntersectionObserver to highlight the active section. Hidden < lg.
 */
export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (!headings.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the heading closest to the top that is currently visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          )
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      // Trigger zone is the top third of the viewport — feels right
      // for "what section am I reading now?"
      { rootMargin: "-80px 0px -70% 0px", threshold: [0, 1] }
    )

    for (const h of headings) {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [headings])

  if (!headings.length) return null

  return (
    <nav
      aria-label="目录"
      className="hidden lg:block sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto scrollbars-thin"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-light mb-3">
        本页目录
      </p>
      <ul className="space-y-1.5 text-sm border-l hairline">
        {headings.map((h) => {
          const active = activeId === h.id
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={cn(
                  "block py-1 -ml-px border-l-2 transition-colors",
                  active
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted hover:text-foreground"
                )}
                style={{
                  paddingLeft: `${(h.level - 2) * 0.75 + 0.875}rem`,
                  fontSize: h.level >= 3 ? "0.8125rem" : undefined,
                }}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
