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
  cover?: string
  published: boolean
}

export interface PostSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  cover?: string
}

const toSummary = (p: Post): PostSummary => ({
  id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt,
  date: p.date, tags: p.tags, cover: p.cover,
})

/** Generate a short excerpt from the body when frontmatter omits it. */
function deriveExcerpt(body: string, max = 120): string {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[`#*_>~|]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > max ? text.slice(0, max) + "…" : text
}

let postsCache: Post[] | null = null

export function getAllPosts(): Post[] {
  if (postsCache) return postsCache
  if (!fs.existsSync(postsDirectory)) {
    postsCache = []
    return postsCache
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const all = fileNames
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((fileName): Post => {
      const id = fileName.replace(/\.mdx?$/, "")
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data, content } = matter(fileContents)

      return {
        id,
        slug: data.slug || id,
        title: data.title || "Untitled",
        excerpt: data.excerpt || deriveExcerpt(content),
        content,
        date: data.date || new Date().toISOString().split("T")[0],
        tags: Array.isArray(data.tags) ? data.tags : [],
        cover: data.cover,
        published: data.published !== false,
      }
    })

  postsCache = all.sort((a, b) => (a.date < b.date ? 1 : -1))
  return postsCache
}

export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((p) => p.published)
}

export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) || null
}

export interface TagInfo {
  name: string
  slug: string
  count: number
  color: string
}

/** Stable hash → HSL hue. Same tag always gets the same colour. */
function hashHue(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0
  return Math.abs(h) % 360
}

export function tagColor(name: string): string {
  // Sit in the warm-leaning palette to harmonize with the orange brand,
  // but allow enough hue rotation to keep tags distinguishable.
  return `hsl(${hashHue(name)} 65% 52%)`
}

export const tagSlug = (name: string) =>
  encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"))

export function getAllTags(): TagInfo[] {
  const counts: Record<string, number> = {}
  for (const post of getPublishedPosts())
    for (const t of post.tags) counts[t] = (counts[t] || 0) + 1

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      slug: tagSlug(name),
      count,
      color: tagColor(name),
    }))
    .sort((a, b) => b.count - a.count)
}

/** prev = newer post (earlier in list), next = older post. */
export function getAdjacentPosts(slug: string): {
  prev: PostSummary | null
  next: PostSummary | null
} {
  const posts = getPublishedPosts()
  const i = posts.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? toSummary(posts[i - 1]) : null,
    next: i < posts.length - 1 ? toSummary(posts[i + 1]) : null,
  }
}

/** Index used by the client-side search (no server in static-export mode). */
export interface SearchEntry {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  date: string
  body: string
}
export function getSearchIndex(): SearchEntry[] {
  return getPublishedPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tags: p.tags,
    date: p.date,
    // truncate so the index stays small enough to ship to the browser
    body: p.content.replace(/```[\s\S]*?```/g, " ").slice(0, 2000),
  }))
}
