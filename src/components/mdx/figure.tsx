import type { ReactNode } from "react"
import { site } from "@/lib/site"

interface FigureProps {
  src: string
  alt?: string
  caption?: ReactNode
  /** Float at wider viewports; full-bleed by default. */
  width?: "narrow" | "wide" | "bleed"
}

/**
 * Captioned figure for MDX articles. Prepends the site basePath to absolute
 * paths so images served from /public/ resolve correctly under GitHub Pages.
 * Uses a plain <img> rather than next/image — images are unoptimized in
 * static-export mode anyway.
 */
export function Figure({ src, alt = "", caption, width = "narrow" }: FigureProps) {
  const url = src.startsWith("/") && !src.startsWith(site.basePath)
    ? `${site.basePath}${src}`
    : src

  return (
    <figure className="figure" data-width={width}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={alt} loading="lazy" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
