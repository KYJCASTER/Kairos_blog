import type { Metadata } from "next"
import Link from "next/link"
import { getAllTags } from "@/lib/posts"
import { Hash } from "lucide-react"

export const metadata: Metadata = {
  title: "标签",
  description: "按主题浏览所有文章。",
}

export default function TagsPage() {
  const tags = getAllTags()

  return (
    <main className="min-h-screen pt-28 pb-20 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
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
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/blog?tag=${encodeURIComponent(tag.name)}`}
                className="card p-5 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: tag.color }}
                  >
                    <Hash className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs text-muted-light tabular-nums">
                    {tag.count}
                  </span>
                </div>
                <p className="serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tag.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
