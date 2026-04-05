import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "content/posts")

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  tags: string[]
  published: boolean
}

export function getAllPosts(): Post[] {
  // 确保目录存在
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        id,
        slug: data.slug || id,
        title: data.title || "Untitled",
        excerpt: data.excerpt || "",
        content,
        date: data.date || new Date().toISOString().split("T")[0],
        tags: data.tags || [],
        published: data.published !== false,
      }
    })

  // 按日期排序
  return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((post) => post.published)
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts()
  return posts.find((post) => post.slug === slug) || null
}

export function getAllTags(): { name: string; count: number }[] {
  const posts = getPublishedPosts()
  const tagCount: Record<string, number> = {}

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    })
  })

  return Object.entries(tagCount).map(([name, count]) => ({ name, count }))
}
