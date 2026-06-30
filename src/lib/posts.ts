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
  /** Optional revision date. Falls back to `date` for `dateModified` JSON-LD. */
  updated?: string
  tags: string[]
  cover?: string
  /** Series name. Posts sharing the same value are grouped under /series/<slug>. */
  series?: string
  published: boolean
}

export interface PostSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  updated?: string
  tags: string[]
  cover?: string
  series?: string
}

const toSummary = (p: Post): PostSummary => ({
  id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt,
  date: p.date, updated: p.updated, tags: p.tags, cover: p.cover,
  series: p.series,
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

// Allowed frontmatter keys. Anything outside this list is a typo (e.g.
// `tag:` instead of `tags:`) — we throw at build time rather than silently
// dropping the value.
//
// IMPORTANT: this list is mirrored in scripts/build-search-index.mjs
// (which runs at `prebuild` time, before next sees the project). Keep both
// in sync — adding a key here without updating that file means a typo'd
// frontmatter value will pass `prebuild` and only fail at build.
const ALLOWED_FRONTMATTER_KEYS = new Set([
  "title", "slug", "excerpt", "date", "updated", "tags", "cover", "series", "published",
])

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/

function validateFrontmatter(fileName: string, data: Record<string, unknown>): void {
  for (const key of Object.keys(data)) {
    if (!ALLOWED_FRONTMATTER_KEYS.has(key)) {
      throw new Error(
        `[posts] ${fileName}: unknown frontmatter key "${key}". ` +
          `Allowed: ${Array.from(ALLOWED_FRONTMATTER_KEYS).join(", ")}.`,
      )
    }
  }

  if (data.title !== undefined && typeof data.title !== "string") {
    throw new Error(`[posts] ${fileName}: \`title\` must be a string`)
  }
  if (data.slug !== undefined && typeof data.slug !== "string") {
    throw new Error(`[posts] ${fileName}: \`slug\` must be a string`)
  }
  if (data.excerpt !== undefined && typeof data.excerpt !== "string") {
    throw new Error(`[posts] ${fileName}: \`excerpt\` must be a string`)
  }
  if (data.cover !== undefined && typeof data.cover !== "string") {
    throw new Error(`[posts] ${fileName}: \`cover\` must be a string`)
  }
  if (data.series !== undefined && (typeof data.series !== "string" || data.series.trim() === "")) {
    throw new Error(`[posts] ${fileName}: \`series\` must be a non-empty string when set`)
  }
  if (data.published !== undefined && typeof data.published !== "boolean") {
    throw new Error(`[posts] ${fileName}: \`published\` must be true or false`)
  }
  for (const k of ["date", "updated"] as const) {
    const v = data[k]
    if (v === undefined) continue
    if (typeof v !== "string" || !ISO_DATE.test(v)) {
      throw new Error(
        `[posts] ${fileName}: \`${k}\` must be a "YYYY-MM-DD" string (got ${JSON.stringify(v)})`,
      )
    }
  }
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags) || !data.tags.every((t) => typeof t === "string")) {
      throw new Error(
        `[posts] ${fileName}: \`tags\` must be an array of strings, e.g. tags: ["Java", "笔记"]`,
      )
    }
  }
}

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

      validateFrontmatter(fileName, data)

      return {
        id,
        slug: typeof data.slug === "string" ? data.slug : id,
        title: typeof data.title === "string" ? data.title : "Untitled",
        excerpt:
          typeof data.excerpt === "string" && data.excerpt
            ? data.excerpt
            : deriveExcerpt(content),
        content,
        date:
          typeof data.date === "string"
            ? data.date
            : new Date().toISOString().split("T")[0],
        updated: typeof data.updated === "string" ? data.updated : undefined,
        tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
        cover: typeof data.cover === "string" ? data.cover : undefined,
        series: typeof data.series === "string" ? data.series : undefined,
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

/** Stable hash → index. Same tag always lands on the same slot. */
function hashIndex(input: string, mod: number): number {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0
  return Math.abs(h) % mod
}

/**
 * Tag colour. Kept tightly inside the warm-parchment palette
 * (terracotta / amber / sepia / olive-tan) so cards never look like
 * a "language chip" rainbow. Hand-picked HSL stops keep contrast
 * against both the cream light surface and the dark ink background.
 */
const TAG_PALETTE = [
  "hsl(18 58% 42%)",  // terracotta
  "hsl(28 52% 40%)",  // burnt sienna
  "hsl(34 48% 38%)",  // raw umber
  "hsl(40 44% 38%)",  // dark amber
  "hsl(12 44% 42%)",  // brick
  "hsl(46 36% 36%)",  // olive tan
  "hsl(22 38% 34%)",  // walnut
  "hsl(8 40% 40%)",   // rust
] as const

export function tagColor(name: string): string {
  return TAG_PALETTE[hashIndex(name, TAG_PALETTE.length)]
}

/** Stable URL-safe slug shared by tags and series. */
const slugify = (name: string) =>
  encodeURIComponent(name.toLowerCase().replace(/\s+/g, "-"))

export const tagSlug = slugify
export const seriesSlug = slugify

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

/** Posts whose tags overlap most with the given post (excluding itself). */
export function getRelatedPosts(slug: string, limit = 3): PostSummary[] {
  const target = getPostBySlug(slug)
  if (!target || target.tags.length === 0) return []
  const targetTags = new Set(target.tags)

  const scored = getPublishedPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const overlap = p.tags.filter((t) => targetTags.has(t)).length
      // tf-idf-ish: normalize by sqrt of other-side tag count so a post
      // with three tags doesn't crowd out a more focused match.
      const score = overlap === 0 ? 0 : overlap / Math.sqrt(p.tags.length || 1)
      return { post: p, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => (b.score === a.score ? (a.post.date < b.post.date ? 1 : -1) : b.score - a.score))
    .slice(0, limit)

  return scored.map((x) => toSummary(x.post))
}

/** Look up posts that carry a given tag (matched by its slug). */
export function getPostsByTagSlug(slug: string): { tag: TagInfo; posts: PostSummary[] } | null {
  const tag = getAllTags().find((t) => t.slug === slug)
  if (!tag) return null
  const posts = getPublishedPosts()
    .filter((p) => p.tags.includes(tag.name))
    .map(toSummary)
  return { tag, posts }
}

// ────────────────────────────────────────────────────────────────────────
// Series — multi-part articles grouped by `series:` frontmatter.
// Series are read-from-the-start by design, so series-internal listings
// are sorted ASCENDING (oldest → newest), opposite of the global index.
// ────────────────────────────────────────────────────────────────────────

export interface SeriesInfo {
  name: string
  slug: string
  count: number
  /** ASCENDING by date — series are read in publish order. */
  posts: PostSummary[]
  /** Convenience accessors for the series index page. */
  startDate: string
  endDate: string
  latest: PostSummary
}

function buildSeriesInfo(name: string, posts: Post[]): SeriesInfo {
  // posts arrive in DESC (the cache order). Sort ASC for series reading.
  const ascending = [...posts].sort((a, b) => (a.date < b.date ? -1 : 1)).map(toSummary)
  return {
    name,
    slug: seriesSlug(name),
    count: ascending.length,
    posts: ascending,
    startDate: ascending[0].date,
    endDate: ascending[ascending.length - 1].date,
    latest: ascending[ascending.length - 1],
  }
}

export function getAllSeries(): SeriesInfo[] {
  const buckets = new Map<string, Post[]>()
  for (const p of getPublishedPosts()) {
    if (!p.series) continue
    const arr = buckets.get(p.series) ?? []
    arr.push(p)
    buckets.set(p.series, arr)
  }
  return Array.from(buckets.entries())
    .map(([name, posts]) => buildSeriesInfo(name, posts))
    // List page: most-recently-updated series first.
    .sort((a, b) => (a.endDate < b.endDate ? 1 : -1))
}

export function getSeriesBySlug(slug: string): SeriesInfo | null {
  return getAllSeries().find((s) => s.slug === slug) ?? null
}

/**
 * Series context for a single post.
 *   - `index`: 0-based position in the series (0..count-1)
 *   - `prev` : earlier post in the series (by date) or null
 *   - `next` : later post in the series (by date) or null
 *
 * Note "prev/next" here is semantic to the series reader: prev = earlier,
 * next = later. This is the OPPOSITE of `getAdjacentPosts` (where prev =
 * newer in the global feed). Keep the asymmetry — both meanings are
 * correct in their own context.
 */
export function getSeriesContext(postSlug: string): {
  series: SeriesInfo
  index: number
  prev: PostSummary | null
  next: PostSummary | null
} | null {
  const post = getPostBySlug(postSlug)
  if (!post || !post.series) return null
  const series = getSeriesBySlug(seriesSlug(post.series))
  if (!series) return null
  const index = series.posts.findIndex((p) => p.slug === postSlug)
  if (index === -1) return null
  return {
    series,
    index,
    prev: index > 0 ? series.posts[index - 1] : null,
    next: index < series.posts.length - 1 ? series.posts[index + 1] : null,
  }
}

/**
 * Lightweight list used for the /blog index page render. No body content —
 * the search corpus lives in `public/search-index.json` and is fetched
 * client-side only when the user actually opens search.
 */
export interface PostListItem {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  date: string
}

export function getPostList(): PostListItem[] {
  return getPublishedPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tags: p.tags,
    date: p.date,
  }))
}
