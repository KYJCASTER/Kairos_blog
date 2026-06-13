"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

/**
 * The frontispiece's centrepiece — a circular wax seal carrying the
 * monogram "K" inside a Latin motto ring. Drawn entirely in SVG so it
 * scales crisply and inherits theme tokens.
 *
 * Interaction: clicking the seal "presses" it briefly and reveals a
 * second mark (verification stamp) just outside the lower-right edge,
 * then both fade. The whole interaction is keyboard-reachable —
 * <button> wraps the SVG.
 *
 * The seal is decorative; nothing routes off it. The reveal is a small
 * "this page is real, this page was checked" wink rather than UI.
 */
export function WaxSeal({ className }: { className?: string }) {
  const [stamped, setStamped] = useState(false)

  const press = () => {
    setStamped(true)
    // Auto-clear after the verification stamp's own fade-out so a second
    // click can re-trigger it (the bookbinder is allowed second thoughts).
    window.setTimeout(() => setStamped(false), 2400)
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={press}
        aria-label="Kairos Press 印记 · 点击验讫"
        className={cn(
          "group relative block rounded-full",
          "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "hover:rotate-[-1.5deg] active:scale-[0.97]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        )}
      >
        <svg
          viewBox="0 0 200 200"
          className={cn(
            "w-32 h-32 sm:w-40 sm:h-40 text-primary/85",
            "drop-shadow-[0_2px_0_rgba(0,0,0,0.04)]",
            stamped && "animate-[seal-press_640ms_var(--ease-out)_both]",
          )}
          aria-hidden
        >
          {/* Outer ring (drawn) */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            opacity="0.9"
          />
          {/* Inner ring */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.55"
          />
          {/* Hairline divots — 8 ticks at compass points */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4
            const r1 = 80
            const r2 = 86
            const x1 = 100 + Math.cos(angle) * r1
            const y1 = 100 + Math.sin(angle) * r1
            const x2 = 100 + Math.cos(angle) * r2
            const y2 = 100 + Math.sin(angle) * r2
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.55"
              />
            )
          })}
          {/* Curved Latin motto along the upper arc */}
          <defs>
            <path
              id="seal-arc-top"
              d="M 22 100 A 78 78 0 0 1 178 100"
              fill="none"
            />
            <path
              id="seal-arc-bottom"
              d="M 30 110 A 70 70 0 0 0 170 110"
              fill="none"
            />
          </defs>
          <text
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="11"
            letterSpacing="6"
            fill="currentColor"
            opacity="0.78"
          >
            <textPath
              href="#seal-arc-top"
              startOffset="50%"
              textAnchor="middle"
            >
              TEMPUS · VERBUM · VIA
            </textPath>
          </text>
          {/* Tiny dingbat decoration on the lower arc — mirrors the wreath */}
          <text
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="10"
            letterSpacing="10"
            fill="currentColor"
            opacity="0.55"
          >
            <textPath
              href="#seal-arc-bottom"
              startOffset="50%"
              textAnchor="middle"
            >
              ✦  ◆  ✦
            </textPath>
          </text>
          {/* Centre monogram K — Fraunces italic, bold weight */}
          <text
            x="100"
            y="118"
            textAnchor="middle"
            fontFamily="var(--font-serif), ui-serif, serif"
            fontStyle="italic"
            fontWeight="700"
            fontSize="72"
            fill="currentColor"
            opacity="0.94"
          >
            K
          </text>
          {/* "PRESS" beneath the monogram, small caps */}
          <text
            x="100"
            y="142"
            textAnchor="middle"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="8"
            letterSpacing="3"
            fill="currentColor"
            opacity="0.7"
          >
            PRESS
          </text>
        </svg>
      </button>

      {/* Verification stamp — appears just off the seal's lower-right
          when the user clicks. Slightly tilted, very faint, like a
          librarian's date stamp pressed on an inventory card. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -bottom-1 -right-3 sm:-right-5",
          "rotate-[-9deg] origin-top-left",
          "font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em]",
          "px-2 py-1 rounded-sm border border-current text-primary",
          "transition-[opacity,transform] duration-500 ease-out",
          stamped
            ? "opacity-80 translate-y-0"
            : "opacity-0 translate-y-1",
        )}
      >
        验讫 · checked
      </span>
    </div>
  )
}
