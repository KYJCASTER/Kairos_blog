import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Roman numerals up to 3999 — sufficient for years and post counts. */
export function toRoman(n: number): string {
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

/**
 * Format an ISO date in zh-CN long form ("2025年4月5日") or short form ("04 / 05").
 * Uses fixed UTC parsing so the output doesn't shift across the user's timezone.
 */
export function formatDate(iso: string, style: "long" | "short" = "long"): string {
  // Treat "YYYY-MM-DD" as a calendar date, not a UTC instant — avoids
  // the "off-by-one day" bug for timezones east/west of UTC.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  const [, y, mo, d] = m
  if (style === "short") return `${mo} / ${d}`
  return `${y} 年 ${Number(mo)} 月 ${Number(d)} 日`
}
