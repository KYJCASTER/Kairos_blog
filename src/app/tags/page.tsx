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
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <li key={tag.name}>
                <Link
                  href={`/tags/${tag.slug}`}
                  className="tag-card group"
                  style={{ ["--ink" as never]: tag.color } as React.CSSProperties}
                >
                  <span aria-hidden className="tag-card-mark serif italic">#</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-light">
                    {tag.count.toString().padStart(2, "0")} 篇文章
                  </span>
                  <span className="serif text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mt-5">
                    {tag.name}
                  </span>
                  <span className="mt-6 h-px w-16 bg-[var(--ink)] opacity-50 transition-all duration-500 group-hover:w-24" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
