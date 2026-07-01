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
import { deriveExcerpt, validateFrontmatter } from "../src/lib/post-utils.mjs"

const root = process.cwd()
const postsDir = path.join(root, "content/posts")
const outFile = path.join(root, "public/search-index.json")

// Body-extraction tuned for fuzzy matching: kill code blocks, strip markdown
// punctuation, collapse whitespace, then take the first BODY_CHARS chars.
// 600 chars of CJK is plenty of fuzzy-match surface area for one post.
const BODY_CHARS = 600

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
