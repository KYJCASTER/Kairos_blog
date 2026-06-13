import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { tagColor, type PostSummary } from "@/lib/posts"
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
function CoverPanel({
  post,
  monogramSize,
}: {
  post: PostSummary
  monogramSize: "lg" | "xl"
}) {
  const primaryTag = post.tags[0]
  const ink = primaryTag ? tagColor(primaryTag) : "hsl(28 52% 40%)"

  // Hand-authored cover takes precedence and bypasses the parchment treatment.
  if (post.cover) {
    return (
      <div className="cover-zoom absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${post.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
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
          style={{ ["--ink" as never]: ink } as React.CSSProperties}
        />
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
            <div className="aspect-[16/10] md:aspect-auto md:min-h-[260px] relative overflow-hidden">
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
            {post.tags[0] && <span className="divider-dot">{post.tags[0]}</span>}
          </div>
          <h3 className="serif text-lg font-semibold leading-snug mb-2 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted line-clamp-2 mb-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-light mt-auto pt-3 border-t hairline">
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 2).map((t) => (
                <span key={t} className="tag-chip">{t}</span>
              ))}
            </div>
            <ArrowUpRight className="w-4 h-4 group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" />
          </div>
        </div>
      </article>
    </Link>
  )
}
