import { cn } from "@/lib/utils"

/**
 * Tiny ornament used between page sections — two short hairline rules
 * with a centred diamond ◇. Echoes the wax-seal / colophon vocabulary
 * already established by the hero kicker and footer bookplate.
 *
 * Variants:
 *   "diamond" (default) — ◇ between rules, the most "page break" feeling
 *   "asterism"          — ⁂ centred, no rules, used inside articles
 *   "rule"              — single hairline, no glyph, for quietest breaks
 */
export function SectionOrnament({
  variant = "diamond",
  className,
}: {
  variant?: "diamond" | "asterism" | "rule"
  className?: string
}) {
  if (variant === "rule") {
    return (
      <hr
        aria-hidden
        className={cn(
          "mx-auto my-12 h-px w-24 border-0 bg-border-strong/50",
          className,
        )}
      />
    )
  }

  if (variant === "asterism") {
    return (
      <div
        aria-hidden
        className={cn(
          "my-10 text-center text-muted-light select-none serif text-2xl leading-none",
          className,
        )}
      >
        ⁂
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center justify-center gap-4 my-12 select-none",
        className,
      )}
    >
      <span className="block h-px w-16 sm:w-20 bg-border-strong/40" />
      <span className="text-muted-light text-[0.6rem] tracking-[0.4em]">◇</span>
      <span className="block h-px w-16 sm:w-20 bg-border-strong/40" />
    </div>
  )
}
