import type { Metadata } from "next"
import Link from "next/link"

import { getPublishedPosts, getAllSeries } from "@/lib/posts"
import { computeReadingStats } from "@/lib/reading-time"
import { WaxSeal } from "@/components/wax-seal"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: "扉页",
  description: `${site.name} 的扉页 —— 像翻开一本厚书的前几页：印社徽记、卷首题词与一份小小的目录。`,
  alternates: { canonical: "/frontispiece" },
}

// Roman numerals up to 3999 — sufficient for years and post counts.
function toRoman(n: number): string {
  if (n <= 0) return ""
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ]
  let result = ""
  let rem = n
  for (const [v, s] of map) {
    while (rem >= v) {
      result += s
      rem -= v
    }
  }
  return result
}

const MONTH_LATIN = [
  "Ianuarius", "Februarius", "Martius", "Aprilis", "Maius", "Iunius",
  "Iulius", "Augustus", "September", "October", "November", "December",
] as const

export default function FrontispiecePage() {
  const posts = getPublishedPosts()
  const series = getAllSeries()

  // CJK-aware total word count — sum across the whole corpus.
  let totalWords = 0
  for (const p of posts) totalWords += computeReadingStats(p.content).totalWords

  // Earliest post date drives the "since" line. Posts are date-DESC.
  const earliest = posts.length ? posts[posts.length - 1].date : ""
  const earliestYear = earliest ? parseInt(earliest.slice(0, 4), 10) : 0
  const earliestMonth = earliest ? parseInt(earliest.slice(5, 7), 10) : 0
  const earliestLabel = earliest
    ? `${MONTH_LATIN[earliestMonth - 1]} ${toRoman(earliestYear)}`
    : ""

  const currentYear = new Date().getFullYear()
  const yearsSpan = earliest
    ? Math.max(1, currentYear - earliestYear + 1)
    : 0

  return (
    <main className="relative min-h-screen pt-24 pb-20 px-5 sm:px-6 overflow-hidden">
      {/* Soft parchment vignettes — same vocabulary as the home hero */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[65vh] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 40% at 100% 0%, rgba(194, 65, 12, 0.05), transparent 60%), " +
            "radial-gradient(ellipse 45% 35% at 0% 100%, rgba(180, 83, 9, 0.04), transparent 65%)",
        }}
      />

      <article className="relative max-w-3xl mx-auto">
        {/* ============ Outer page frame ============
            A double rule with the upper-left flourish drawn in.
            The flourish is a single SVG path that strokes-in over a
            second, giving the impression of a hand sketching the
            border the moment the page is opened. */}
        <div
          className="relative border hairline-strong rounded-sm bg-card/40 px-8 sm:px-14 py-14 sm:py-20"
          style={{ outline: "1px solid var(--border)", outlineOffset: "6px" }}
        >
          {/* Corner flourish — top-left. Path is drawn with stroke-dash. */}
          <svg
            aria-hidden
            viewBox="0 0 80 80"
            className="absolute -top-1 -left-1 w-12 sm:w-16 text-primary/65"
            fill="none"
          >
            <path
              d="M 4 30 C 4 14, 14 4, 30 4 M 8 14 Q 14 8, 22 6 M 4 24 L 4 18 L 10 18"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              style={{
                strokeDasharray: 120,
                strokeDashoffset: 120,
                animation: "swash-draw 1.4s 0.3s var(--ease-out) forwards",
              }}
            />
          </svg>
          {/* Mirrored flourish — bottom-right */}
          <svg
            aria-hidden
            viewBox="0 0 80 80"
            className="absolute -bottom-1 -right-1 w-12 sm:w-16 text-primary/65 rotate-180"
            fill="none"
          >
            <path
              d="M 4 30 C 4 14, 14 4, 30 4 M 8 14 Q 14 8, 22 6 M 4 24 L 4 18 L 10 18"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              style={{
                strokeDasharray: 120,
                strokeDashoffset: 120,
                animation: "swash-draw 1.4s 0.6s var(--ease-out) forwards",
              }}
            />
          </svg>

          {/* ============ Press imprint ============ */}
          <div className="text-center animate-fade-in-up">
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.42em] text-muted">
              Kairos &nbsp;·&nbsp; Press
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span aria-hidden className="block w-8 h-px bg-border-strong/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-light">
                Open Access · {toRoman(currentYear)}
              </span>
              <span aria-hidden className="block w-8 h-px bg-border-strong/60" />
            </div>
          </div>

          {/* ============ The mark ============ */}
          <div
            className="flex justify-center my-12 sm:my-16 animate-fade-in-up"
            style={{ animationDelay: "0.18s" }}
          >
            <WaxSeal />
          </div>

          {/* ============ Bilingual epigraph ============ */}
          <div
            className="text-center animate-fade-in-up"
            style={{ animationDelay: "0.34s" }}
          >
            <p className="serif italic text-2xl sm:text-3xl text-foreground tracking-tight leading-snug">
              Verba volant,
              <br className="sm:hidden" />
              <span className="sm:ml-2">scripta manent.</span>
            </p>
            <p className="serif text-base sm:text-lg text-muted mt-4 leading-relaxed">
              口舌之言易散，
              <br className="sm:hidden" />
              <span className="sm:ml-1">笔墨之迹长存。</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-light mt-5">
              — proverbium romanum
            </p>
          </div>

          {/* ============ Volume colophon ============
              The "this volume contains" line — uses real corpus data.
              Numbers in serif tabular nums, labels in mono small-caps.
              Reads like the verso of a real book's title page. */}
          <div
            className="mt-14 sm:mt-16 grid grid-cols-3 gap-6 sm:gap-10 animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <Stat
              label="Volumina"
              sub="篇"
              value={posts.length.toString()}
              roman={toRoman(posts.length)}
            />
            <Stat
              label="Verba"
              sub="字"
              value={totalWords.toLocaleString("en-US")}
              roman={null}
            />
            <Stat
              label="Anno"
              sub="年"
              value={yearsSpan.toString()}
              roman={toRoman(yearsSpan)}
            />
          </div>

          {/* ============ Provenance line ============ */}
          <div
            className="mt-14 sm:mt-16 flex flex-col items-center text-center gap-2 animate-fade-in-up"
            style={{ animationDelay: "0.66s" }}
          >
            <span aria-hidden className="block w-10 h-px bg-border-strong/60" />
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-muted-light leading-relaxed">
              Imprinted by {site.author} &nbsp;·&nbsp; Kaifeng, Henan
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-light leading-relaxed">
              {earliestLabel
                ? <>Since {earliestLabel} &nbsp;·&nbsp; {series.length} {series.length === 1 ? "Series" : "Series"}</>
                : <>Sub Astris Apertis</>}
            </p>
          </div>

          {/* ============ "Turn the page" CTA ============ */}
          <div
            className="mt-14 sm:mt-16 flex flex-col items-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.82s" }}
          >
            <Link
              href="/blog"
              className="group relative inline-flex items-center gap-3 serif italic text-lg text-foreground hover:text-primary transition-colors"
            >
              <span className="text-primary/70 group-hover:text-primary transition-colors">
                〔
              </span>
              <span>翻开书页</span>
              <span aria-hidden className="font-mono not-italic text-xs uppercase tracking-[0.28em] text-muted-light group-hover:text-primary/80 transition-colors">
                Turn →
              </span>
              <span className="text-primary/70 group-hover:text-primary transition-colors">
                〕
              </span>
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-light">
              or wander · &nbsp;
              <Link
                href="/archive"
                className="hover:text-foreground transition-colors"
              >
                /archive
              </Link>
              &nbsp;·&nbsp;
              <Link
                href="/series"
                className="hover:text-foreground transition-colors"
              >
                /series
              </Link>
              &nbsp;·&nbsp;
              <Link
                href="/curriculum"
                className="hover:text-foreground transition-colors"
              >
                /curriculum
              </Link>
            </p>
          </div>
        </div>

        {/* Folio number — like the bottom of every right-hand page in
            an old book. Always reads "I" because this is page one. */}
        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.32em] text-muted-light tabular-nums">
          — &nbsp; folio &nbsp;I&nbsp; —
        </p>
      </article>
    </main>
  )
}

function Stat({
  label,
  sub,
  value,
  roman,
}: {
  label: string
  sub: string
  value: string
  roman: string | null
}) {
  return (
    <div className="text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-light mb-2">
        {label}
      </p>
      <p className="serif text-3xl sm:text-4xl font-semibold text-foreground tabular-nums leading-none">
        {value}
      </p>
      {roman ? (
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary/65 mt-2 tabular-nums">
          {roman}
        </p>
      ) : (
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-light/60 mt-2">
          ·
        </p>
      )}
      <p className="serif italic text-xs text-muted mt-1">{sub}</p>
    </div>
  )
}
