import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
