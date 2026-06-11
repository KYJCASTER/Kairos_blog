import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { tagColor, type PostSummary } from "@/lib/posts"
import { formatDate } from "@/lib/utils"

interface PostCardProps {
  post: PostSummary
  /** "featured" = larger cover, used at top of the blog list. */
  variant?: "default" | "featured" | "compact"
}

export function PostCard({ post, variant = "default" }: PostCardProps) {
  // Derive the cover gradient from the first tag, so each card looks distinct
  // without needing a hand-authored cover image.
  const primaryTag = post.tags[0]
  const tagHue = primaryTag ? tagColor(primaryTag) : "hsl(28 65% 52%)"
  const coverStyle: React.CSSProperties = post.cover
    ? { backgroundImage: `url(${post.cover})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {
        background: `linear-gradient(135deg, ${tagHue} 0%, var(--accent-light) 100%)`,
      }

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
              <div className="cover-zoom absolute inset-0" style={coverStyle}>
                <div className="cover-drift absolute inset-0" />
              </div>
              <span className="absolute inset-0 flex items-center justify-center serif text-7xl font-bold text-white/30 select-none pointer-events-none">
                {post.title.slice(0, 1)}
              </span>
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent pointer-events-none" />
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
          <div className="cover-zoom absolute inset-0" style={coverStyle}>
            <div className="cover-drift absolute inset-0" />
          </div>
          <span className="absolute inset-0 flex items-center justify-center serif text-5xl font-bold text-white/30 select-none pointer-events-none">
            {post.title.slice(0, 1)}
          </span>
          <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-transparent pointer-events-none" />
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
