import type { Metadata } from "next"
import Link from "next/link"
import { getAllTags } from "@/lib/posts"

export const metadata: Metadata = {
  title: "标签",
  description: "按主题浏览所有文章。",
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
            主题 · {tags.length} 个
          </p>
          <h1 className="serif text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            按标签探索
          </h1>
        </header>

        {tags.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="serif text-xl text-muted">暂无标签</p>
          </div>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-2">
            {tags.map((tag) => (
              <li key={tag.name}>
                <Link
                  href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                  className="group flex items-baseline gap-4 py-4 border-b hairline"
                  style={{ ["--ink" as never]: tag.color } as React.CSSProperties}
                >
                  {/* italic-serif "#" reads like a margin mark on a page */}
                  <span
                    aria-hidden
                    className="serif italic text-3xl leading-none font-light shrink-0 transition-colors duration-300"
                    style={{ color: "var(--ink)", opacity: 0.7 }}
                  >
                    #
                  </span>
                  <div className="flex-1 min-w-0 flex items-baseline justify-between gap-3">
                    <span className="serif text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                      {tag.name}
                    </span>
                    <span className="font-mono text-xs text-muted-light tabular-nums shrink-0">
                      {tag.count.toString().padStart(2, "0")}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
