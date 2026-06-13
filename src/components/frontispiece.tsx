import Link from "next/link"

import { getPublishedPosts, getAllSeries } from "@/lib/posts"
import { computeReadingStats } from "@/lib/reading-time"
import { WaxSeal } from "@/components/wax-seal"
import { site } from "@/lib/site"

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

/**
 * The frontispiece artwork — used in two contexts:
 *
 *   1. mode="page" — its own route at /frontispiece. The "Turn" CTA
 *      navigates to /blog (the table of contents).
 *   2. mode="intro" — the first viewport of the home page (/). The CTA
 *      becomes an in-page anchor that smooth-scrolls down to the rest
 *      of the home page (hero / latest posts / about preview).
 *
 * The frontispiece is otherwise identical between modes — same border,
 * seal, epigraph, colophon — so a reader who finds either treatment
 * gets the same visual punctuation.
 */
export function Frontispiece({ mode }: { mode: "page" | "intro" }) {
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

  const isIntro = mode === "intro"

  return (
    <section
      // intro mode: occupies the first viewport like a stage curtain;
      // page mode: regular top padding for navbar clearance.
      className={
        isIntro
          ? "relative min-h-[100svh] flex flex-col justify-center pt-24 pb-12 px-5 sm:px-6 overflow-hidden"
          : "relative min-h-screen pt-24 pb-20 px-5 sm:px-6 overflow-hidden"
      }
      aria-label={isIntro ? "扉页 · 入场" : undefined}
    >
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

      <article className="relative max-w-3xl w-full mx-auto">
        {/* ============ Outer page frame ============ */}
        <div
          className="relative border hairline-strong rounded-sm bg-card/40 px-8 sm:px-14 py-12 sm:py-16"
          style={{ outline: "1px solid var(--border)", outlineOffset: "6px" }}
        >
          {/* Corner flourish — top-left */}
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
            className="flex justify-center my-10 sm:my-14 animate-fade-in-up"
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

          {/* ============ Volume colophon ============ */}
          <div
            className="mt-12 sm:mt-14 grid grid-cols-3 gap-6 sm:gap-10 animate-fade-in-up"
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
            className="mt-12 sm:mt-14 flex flex-col items-center text-center gap-2 animate-fade-in-up"
            style={{ animationDelay: "0.66s" }}
          >
            <span aria-hidden className="block w-10 h-px bg-border-strong/60" />
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-muted-light leading-relaxed">
              Imprinted by {site.author} &nbsp;·&nbsp; Kaifeng, Henan
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-light leading-relaxed">
              {earliestLabel
                ? <>Since {earliestLabel} &nbsp;·&nbsp; {series.length} Series</>
                : <>Sub Astris Apertis</>}
            </p>
          </div>

          {/* ============ "Turn the page" CTA ============
              In intro mode: anchor that scrolls to #beyond (the rest of
              the home page). In page mode: link to /blog. */}
          <div
            className="mt-12 sm:mt-14 flex flex-col items-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.82s" }}
          >
            {isIntro ? (
              <a
                href="#beyond"
                className="group relative inline-flex items-center gap-3 serif italic text-lg text-foreground hover:text-primary transition-colors"
              >
                <span className="text-primary/70 group-hover:text-primary transition-colors">〔</span>
                <span>翻开书页</span>
                <span aria-hidden className="font-mono not-italic text-xs uppercase tracking-[0.28em] text-muted-light group-hover:text-primary/80 transition-colors">
                  Turn ↓
                </span>
                <span className="text-primary/70 group-hover:text-primary transition-colors">〕</span>
              </a>
            ) : (
              <Link
                href="/blog"
                className="group relative inline-flex items-center gap-3 serif italic text-lg text-foreground hover:text-primary transition-colors"
              >
                <span className="text-primary/70 group-hover:text-primary transition-colors">〔</span>
                <span>翻开书页</span>
                <span aria-hidden className="font-mono not-italic text-xs uppercase tracking-[0.28em] text-muted-light group-hover:text-primary/80 transition-colors">
                  Turn →
                </span>
                <span className="text-primary/70 group-hover:text-primary transition-colors">〕</span>
              </Link>
            )}
            {!isIntro && (
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-light">
                or wander · &nbsp;
                <Link href="/archive" className="hover:text-foreground transition-colors">/archive</Link>
                &nbsp;·&nbsp;
                <Link href="/series" className="hover:text-foreground transition-colors">/series</Link>
                &nbsp;·&nbsp;
                <Link href="/curriculum" className="hover:text-foreground transition-colors">/curriculum</Link>
              </p>
            )}
          </div>
        </div>

        {/* Folio number / scroll prompt */}
        {isIntro ? (
          <div
            aria-hidden
            className="mt-6 flex flex-col items-center gap-1 animate-fade-in-up"
            style={{ animationDelay: "1.0s" }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-light tabular-nums">
              — &nbsp; folio &nbsp;I&nbsp; —
            </span>
            <span className="text-muted-light text-xs animate-[scroll-hint_2.4s_var(--ease-soft)_infinite]">
              ▾
            </span>
          </div>
        ) : (
          <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.32em] text-muted-light tabular-nums">
            — &nbsp; folio &nbsp;I&nbsp; —
          </p>
        )}
      </article>
    </section>
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
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-light/60 mt-2">·</p>
      )}
      <p className="serif italic text-xs text-muted mt-1">{sub}</p>
    </div>
  )
}
