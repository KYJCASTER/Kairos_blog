"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { Heading } from "@/lib/markdown"

interface TableOfContentsProps {
  headings: Heading[]
  /**
   * Where this instance is rendered. Each placement only renders its own
   * markup so the post page can put the mobile drawer above the article body
   * and the desktop rail in a sticky aside.
   */
  placement?: "mobile" | "desktop"
}

/**
 * Sticky right-rail / mobile drawer TOC. Tracks the most-recently-passed
 * heading using IntersectionObserver to highlight the active section.
 */
export function TableOfContents({ headings, placement = "desktop" }: TableOfContentsProps) {
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

  if (placement === "mobile") {
    return (
      <details className="lg:hidden mb-8 rounded-xl border hairline bg-card/40 px-5 py-3 group">
        <summary className="cursor-pointer flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <span>本页目录 · {headings.length}</span>
          <span aria-hidden className="text-muted-light transition-transform duration-300 group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div className="mt-4">
          <TocList headings={headings} activeId={activeId} variant="mobile" />
        </div>
      </details>
    )
  }

  return (
    <nav
      aria-label="目录"
      className="hidden lg:block sticky top-28 max-h-[calc(100vh-9rem)] overflow-y-auto scrollbars-thin"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-light mb-3">
        本页目录
      </p>
      <TocList headings={headings} activeId={activeId} variant="desktop" />
    </nav>
  )
}

function TocList({
  headings,
  activeId,
  variant,
}: {
  headings: Heading[]
  activeId: string
  variant: "mobile" | "desktop"
}) {
  return (
    <ul className="space-y-1.5 text-sm border-l hairline">
      {headings.map((h, i) => {
        const active = activeId === h.id
        return (
          <li key={`${h.id}-${i}`}>
            <a
              href={`#${h.id}`}
              className={cn(
                "group/toc relative block py-1 -ml-px border-l-2",
                "transition-[color,border-color,padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                active
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted hover:text-foreground hover:border-border-strong"
              )}
              style={{
                paddingLeft: `${(h.level - 2) * 0.75 + 0.875}rem`,
                fontSize: h.level >= 3 ? "0.8125rem" : undefined,
              }}
            >
              {variant === "desktop" && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary",
                    "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    active ? "scale-100 opacity-100" : "scale-0 opacity-0"
                  )}
                />
              )}
              {h.text}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
