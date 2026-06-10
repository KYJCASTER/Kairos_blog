import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getPublishedPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"

export function LatestPosts() {
  const posts = getPublishedPosts()
  const [featured, ...rest] = posts
  const grid = rest.slice(0, 4)

  if (!posts.length) {
    return (
      <section className="py-20 px-5 sm:px-6">
        <div className="max-w-5xl mx-auto card p-10 text-center">
          <p className="serif text-xl text-muted mb-2">文章正在创作中…</p>
          <p className="text-sm text-muted-light font-mono">
            在 content/posts/ 添加一个 .md 文件即可
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">
              最近书写
            </p>
            <h2 className="serif text-3xl sm:text-4xl font-semibold text-foreground">
              新文章
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-primary transition-colors group"
          >
            全部 {posts.length} 篇
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </header>

        {featured && <PostCard post={featured} variant="featured" />}

        {grid.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6 mt-6">
            {grid.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link href="/blog" className="btn-secondary">
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
