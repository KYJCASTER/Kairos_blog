// New-post scaffolder.
//
//   npm run new-post -- "我的新文章标题"
//   npm run new-post -- "我的新文章标题" --slug=my-post --tag=Java --tag=笔记
//
// Writes a Markdown file under content/posts/ with sane frontmatter so you
// don't have to remember the field names (and the build won't fail because
// of a typo'd `tag:` vs `tags:`).

import fs from "node:fs"
import path from "node:path"

const args = process.argv.slice(2)
if (args.length === 0 || args[0].startsWith("--")) {
  console.error('Usage: npm run new-post -- "文章标题" [--slug=…] [--tag=…]…')
  process.exit(1)
}

const title = args[0]
const flags = Object.fromEntries(
  args
    .slice(1)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const eq = a.indexOf("=")
      return eq === -1 ? [a.slice(2), true] : [a.slice(2, eq), a.slice(eq + 1)]
    }),
)

// Multi-value: --tag can repeat.
const tags = args
  .slice(1)
  .filter((a) => a.startsWith("--tag="))
  .map((a) => a.slice("--tag=".length))

// Slug: ASCII-friendly kebab from the title, or explicit --slug=.
function autoSlug(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w一-龥]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "untitled"
}
const slug = typeof flags.slug === "string" ? flags.slug : autoSlug(title)

// YYYY-MM-DD in local time.
const today = new Date()
const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

const root = process.cwd()
const file = path.join(root, "content/posts", `${slug}.md`)

if (fs.existsSync(file)) {
  console.error(`refusing to overwrite existing file: ${path.relative(root, file)}`)
  process.exit(1)
}

const body = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${date}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
excerpt: ""
# series: 系列名（可选；同名值会被聚合到 /series/<slug>，从早到晚顺序排列）
published: false
---

# ${title}

`

fs.mkdirSync(path.dirname(file), { recursive: true })
fs.writeFileSync(file, body, "utf8")

console.log(`✓ wrote ${path.relative(root, file)}`)
console.log(`  → 写完后把 published 改为 true 再 push`)
