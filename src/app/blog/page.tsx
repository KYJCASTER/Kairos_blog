import type { Metadata } from "next"
import { Suspense } from "react"
import { getPostList, getAllTags } from "@/lib/posts"
import { BlogIndex } from "@/components/blog-index"

export const metadata: Metadata = {
  title: "文章",
  description: "所有发布的技术文章，支持按标题、标签、正文搜索。",
}

export default function BlogPage() {
  // No body content here — the search corpus is built into
  // public/search-index.json and lazy-fetched on first focus of the search
  // input. Keeps the initial /blog HTML payload small.
  const posts = getPostList()
  const tags = getAllTags()
  return (
    // Suspense boundary required because BlogIndex calls useSearchParams().
    <Suspense fallback={<BlogIndexFallback />}>
      <BlogIndex posts={posts} allTags={tags} />
    </Suspense>
  )
}

function BlogIndexFallback() {
  return (
    <main className="min-h-screen pt-28 pb-20 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
          文章
        </p>
        <h1 className="serif text-4xl sm:text-5xl font-semibold text-foreground tracking-tight mb-12">
          所有书写
        </h1>
        <div className="h-12 rounded-xl bg-surface animate-pulse mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-surface animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}
