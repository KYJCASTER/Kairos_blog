import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { tagColor, type PostSummary } from "@/lib/posts"
import { site } from "@/lib/site"
import { formatDate } from "@/lib/utils"

interface PostCardProps {
  post: PostSummary
  /** "featured" = larger cover, used at top of the blog list. */
  variant?: "default" | "featured" | "compact"
}

/**
 * Render a parchment "cover" panel.
 *
 * No raw cover image? We compose a paper surface with an ink-wash bloom
 * tinted by the post's primary tag (constrained to our warm palette via
 * tagColor), and a giant italic serif monogram of the first character.
 * The effect should read like "an embossed page", not "a coloured tile".
 */
function resolveCoverUrl(cover: string): string {
  if (/^(https?:)?\/\//i.test(cover) || cover.startsWith("data:")) return cover
  if (cover.startsWith(site.basePath)) return cover
  if (cover.startsWith("/")) return `${site.basePath}${cover}`
  return cover
}

function hashString(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (h * 33 + input.charCodeAt(i)) | 0
  return Math.abs(h)
}

function CoverArtwork({ variant }: { variant: number }) {
  const common = "absolute inset-0 w-full h-full text-[var(--ink)]"

  switch (variant) {
    case 0:
      return (
        <svg className={common} viewBox="0 0 400 260" aria-hidden>
          <path d="M46 150 A112 112 0 1 1 276 91" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.26" />
          <path d="M78 150 A82 82 0 1 1 250 104" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.22" />
          <circle cx="278" cy="91" r="12" fill="currentColor" opacity="0.22" />
          <circle cx="278" cy="91" r="26" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.16" />
        </svg>
      )
    case 1:
      return (
        <svg className={common} viewBox="0 0 400 260" aria-hidden>
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              d={`M-20 ${58 + i * 18} C70 ${18 + i * 8}, 126 ${118 + i * 4}, 210 ${75 + i * 11} S340 ${36 + i * 17}, 430 ${88 + i * 10}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={i % 3 === 0 ? 2.2 : 1.1}
              opacity={0.09 + i * 0.012}
              strokeLinecap="round"
            />
          ))}
          <rect x="282" y="46" width="56" height="150" rx="28" fill="currentColor" opacity="0.10" />
        </svg>
      )
    case 2:
      return (
        <svg className={common} viewBox="0 0 400 260" aria-hidden>
          <path d="M88 82 L154 118 L222 90 L294 136" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.22" />
          <path d="M154 118 L178 190 L248 206 L294 136" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.18" />
          <path d="M178 190 L110 214 L248 206" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.14" />
          {[ [88,82,6], [154,118,5], [222,90,4], [294,136,6], [178,190,6], [248,206,5], [110,214,4] ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="currentColor" opacity="0.26" />
          ))}
        </svg>
      )
    case 3:
      return (
        <svg className={common} viewBox="0 0 400 260" aria-hidden>
          <path d="M70 58 H330 M70 96 H294 M70 134 H342 M70 172 H262 M70 210 H318" stroke="currentColor" strokeWidth="1" opacity="0.16" strokeLinecap="round" />
          <path d="M104 42 V226 M184 42 V226 M264 42 V226" stroke="currentColor" strokeWidth="1" opacity="0.08" />
          <path d="M89 77 C134 61 184 65 238 48" fill="none" stroke="currentColor" strokeWidth="2.4" opacity="0.20" strokeLinecap="round" />
          <circle cx="322" cy="188" r="34" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.18" />
        </svg>
      )
    case 4:
      return (
        <svg className={common} viewBox="0 0 400 260" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <path
              key={i}
              d={`M${34 + i * 18} ${214 - i * 18} C${96 + i * 12} ${140 - i * 24}, ${168 + i * 20} ${236 - i * 28}, ${254 + i * 18} ${136 - i * 14} S${354 - i * 8} ${96 + i * 17}, ${386 - i * 13} ${70 + i * 24}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              opacity={0.09 + i * 0.035}
              strokeLinecap="round"
            />
          ))}
          <path d="M62 206 L338 54" stroke="currentColor" strokeWidth="1" opacity="0.10" strokeDasharray="4 10" />
        </svg>
      )
    case 5:
      return (
        <svg className={common} viewBox="0 0 400 260" aria-hidden>
          <circle cx="200" cy="130" r="76" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.18" />
          <circle cx="200" cy="130" r="104" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.11" strokeDasharray="2 9" />
          <path d="M200 54 V206 M124 130 H276" stroke="currentColor" strokeWidth="1" opacity="0.12" />
          <path d="M154 176 C184 148 214 114 246 84" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.20" />
        </svg>
      )
    case 6:
      return (
        <svg className={common} viewBox="0 0 400 260" aria-hidden>
          {[52, 88, 124, 160, 196, 232, 268, 304].map((x, i) => (
            <rect key={x} x={x} y={70 + (i % 3) * 16} width="16" height={122 - (i % 4) * 18} rx="8" fill="currentColor" opacity={0.09 + (i % 4) * 0.035} />
          ))}
          <path d="M44 196 C118 162 168 208 230 170 S310 112 358 142" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.18" strokeLinecap="round" />
        </svg>
      )
    default:
      return (
        <svg className={common} viewBox="0 0 400 260" aria-hidden>
          <path d="M82 54 H318 V206 H82 Z" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.14" />
          <path d="M112 82 H288 M112 112 H260 M112 142 H302 M112 172 H238" stroke="currentColor" strokeWidth="1.1" opacity="0.15" strokeLinecap="round" />
          <path d="M284 58 L318 92 L284 126 L250 92 Z" fill="currentColor" opacity="0.12" />
          <path d="M82 206 C132 184 176 222 224 196 S294 166 318 184" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.18" strokeLinecap="round" />
        </svg>
      )
  }
}

export function CoverPanel({
  post,
  monogramSize,
}: {
  post: PostSummary
  monogramSize: "lg" | "xl"
}) {
  const primaryTag = post.tags[0]
  const ink = primaryTag ? tagColor(primaryTag) : "hsl(28 52% 40%)"
  const variant = hashString(`${post.slug}:${post.title}`) % 8

  // Hand-authored cover takes precedence, but still gets a warm overlay so it
  // stays inside the parchment palette and works under the GitHub Pages basePath.
  if (post.cover) {
    return (
      <div className="cover-zoom absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${resolveCoverUrl(post.cover)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(31,27,22,0.14),transparent_42%,rgba(194,65,12,0.12))] mix-blend-multiply dark:mix-blend-screen" />
      </div>
    )
  }

  const monogramClass =
    monogramSize === "xl"
      ? "text-[10rem] sm:text-[12rem]"
      : "text-[7rem] sm:text-[8rem]"

  return (
    <>
      <div className="cover-zoom absolute inset-0 parchment">
        <div
          className="ink-wash absolute inset-0 cover-drift transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-40"
          style={{ "--ink": ink }}
        />
        <div
          className="cover-art absolute inset-0 transition-opacity duration-700 group-hover:opacity-90"
          style={{ "--ink": ink }}
        >
          <CoverArtwork variant={variant} />
        </div>
      </div>
      <span
        aria-hidden
        className={`monogram absolute inset-0 flex items-center justify-center serif italic font-light leading-none select-none pointer-events-none ${monogramClass}`}
        style={{ color: ink }}
      >
        {post.title.slice(0, 1)}
      </span>
      {/* hand-stamped corner mark */}
      {primaryTag && (
        <span
          aria-hidden
          className="stamp-mark absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-[0.22em] pointer-events-none"
          style={{ color: ink }}
        >
          № {primaryTag}
        </span>
      )}
    </>
  )
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex items-baseline gap-4 py-4 border-b hairline last:border-b-0"
      >
        <time className="font-mono text-xs text-muted-light shrink-0 tabular-nums">
          {formatDate(post.date, "short")}
        </time>
        <div className="flex-1 min-w-0">
          <h3 className="serif text-base font-medium text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {post.title}
          </h3>
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-light group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0" />
      </Link>
    )
  }

  if (variant === "featured") {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="card overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-[3/2] md:aspect-auto md:min-h-[260px] relative overflow-hidden">
              <CoverPanel post={post} monogramSize="xl" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="p-6 sm:p-8 flex flex-col">
              <div className="flex items-center gap-2 text-xs text-muted-light mb-3">
                <span className="font-mono tabular-nums">{formatDate(post.date)}</span>
                {post.tags.slice(0, 2).map((t) => (
                  <span key={t} className="divider-dot">{t}</span>
                ))}
              </div>
              <h3 className="serif text-2xl sm:text-3xl font-semibold leading-tight mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                {post.title}
              </h3>
              <p className="text-sm text-muted line-clamp-3 mb-4 flex-1">
                {post.excerpt}
              </p>
              <span className="text-sm font-medium text-primary inline-flex items-center gap-1.5 self-start">
                继续阅读
                <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" />
              </span>
            </div>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="card h-full overflow-hidden flex flex-col">
        <div className="aspect-[16/9] relative overflow-hidden">
          <CoverPanel post={post} monogramSize="lg" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-transparent pointer-events-none" />
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-light mb-2">
            <span className="font-mono tabular-nums">{formatDate(post.date)}</span>
          </div>
          <h3 className="serif text-lg font-semibold leading-snug mb-2 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((t) => (
                <span key={t} className="tag-chip tag-chip-static">{t}</span>
              ))}
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted-light group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0" />
          </div>
        </div>
      </article>
    </Link>
  )
}
