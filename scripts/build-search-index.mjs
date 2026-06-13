// Build-time search corpus generator.
//
// Reads every published post in `content/posts/`, strips code fences and
// markdown noise, and writes a small JSON file to `public/search-index.json`.
// At runtime, BlogIndex lazy-fetches this file the first time the user
// focuses the search input — keeping it out of the page HTML means the
// initial /blog payload only ships the lightweight post list.

import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const root = process.cwd()
const postsDir = path.join(root, "content/posts")
const outFile = path.join(root, "public/search-index.json")

// Body-extraction tuned for fuzzy matching: kill code blocks, strip markdown
// punctuation, collapse whitespace, then take the first BODY_CHARS chars.
// 600 chars of CJK is plenty of fuzzy-match surface area for one post.
const BODY_CHARS = 600

function deriveExcerpt(body, max = 120) {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[`#*_>~|]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > max ? text.slice(0, max) + "…" : text
}

function bodySnippet(content) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[`#*_>~|]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, BODY_CHARS)
}

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, "[]\n")
  console.log("[search-index] no posts dir, wrote empty index")
  process.exit(0)
}

// Allowed frontmatter keys — must match src/lib/posts.ts. Throwing here on
// `prebuild` surfaces typo'd keys (e.g. `tag:` vs `tags:`) before next build.
const ALLOWED_FRONTMATTER_KEYS = new Set([
  "title", "slug", "excerpt", "date", "updated", "tags", "cover", "series", "published",
])
const ISO_DATE = /^\d{4}-\d{2}-\d{2}/

function validateFrontmatter(fileName, data) {
  for (const key of Object.keys(data)) {
    if (!ALLOWED_FRONTMATTER_KEYS.has(key)) {
      throw new Error(
        `[posts] ${fileName}: unknown frontmatter key "${key}". ` +
          `Allowed: ${Array.from(ALLOWED_FRONTMATTER_KEYS).join(", ")}.`,
      )
    }
  }
  for (const k of ["date", "updated"]) {
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

const fileNames = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))

const entries = fileNames
  .map((fileName) => {
    const id = fileName.replace(/\.mdx?$/, "")
    const full = path.join(postsDir, fileName)
    const { data, content } = matter(fs.readFileSync(full, "utf8"))
    validateFrontmatter(fileName, data)
    if (data.published === false) return null

    return {
      slug: data.slug || id,
      title: data.title || "Untitled",
      excerpt: data.excerpt || deriveExcerpt(content),
      tags: Array.isArray(data.tags) ? data.tags : [],
      date: data.date || new Date().toISOString().split("T")[0],
      body: bodySnippet(content),
    }
  })
  .filter(Boolean)
  .sort((a, b) => (a.date < b.date ? 1 : -1))

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, JSON.stringify(entries))

const sizeKb = (fs.statSync(outFile).size / 1024).toFixed(1)
console.log(
  `[search-index] wrote ${entries.length} entries → public/search-index.json (${sizeKb} KB)`,
)
