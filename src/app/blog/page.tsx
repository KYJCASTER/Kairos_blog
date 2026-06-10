import type { Metadata } from "next"
import { getSearchIndex, getAllTags } from "@/lib/posts"
import { BlogIndex } from "@/components/blog-index"

export const metadata: Metadata = {
  title: "文章",
  description: "所有发布的技术文章，支持按标题、标签、正文搜索。",
}

export default function BlogPage() {
  const posts = getSearchIndex()
  const tags = getAllTags()
  return <BlogIndex posts={posts} allTags={tags} />
}
