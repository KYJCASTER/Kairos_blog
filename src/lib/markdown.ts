// MDX rendering with build-time Shiki syntax highlighting.
// Single Highlighter, memoized. Renders run inside server components, so the
// shiki tokenizer cost is paid once at build time.

import { compileMDX } from "next-mdx-remote/rsc"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import { createHighlighter, type Highlighter } from "shiki"
import { visit } from "unist-util-visit"
import remarkGfm from "remark-gfm"
import rehypeExternalLinks from "rehype-external-links"
import type { Root, Element, Text, ElementContent } from "hast"
import type { ReactElement } from "react"

import { mdxComponents } from "@/components/mdx"

/**
 * Slugs that should bypass the MDX pipeline and be rendered as plain markdown.
 * Use this only when the post body legitimately contains literal `<` / `{`
 * sequences (e.g. archived raw C++/C source, math-y prose) that MDX would
 * otherwise try to parse as JSX/expressions. The visual output and TOC
 * behaviour are otherwise identical to renderMDX().
 */
export const PLAIN_MARKDOWN_SLUGS: ReadonlySet<string> = new Set([
  "gin-framework-notes",
])

// Languages registered with Shiki at build time. Audit of content/posts
// shows we only currently fence bash / java / yaml, but registering the
// common-author set below keeps new posts working without touching this
// file. Anything outside this list falls back to plain "text".
const SHIKI_LANGS = [
  "javascript", "typescript", "tsx", "jsx",
  "json", "html", "css", "markdown",
  "java", "go", "python", "rust", "c", "cpp",
  "shell", "bash",
  "yaml", "sql", "dockerfile",
  "diff",
] as const

type Lang = (typeof SHIKI_LANGS)[number] | "text"
const SHIKI_LANG_SET: ReadonlySet<string> = new Set(SHIKI_LANGS)
const resolveLang = (lang: string | undefined): Lang =>
  lang && SHIKI_LANG_SET.has(lang) ? (lang as Lang) : "text"

let highlighterPromise: Promise<Highlighter> | null = null
async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-light", "github-dark"],
      langs: SHIKI_LANGS as unknown as string[],
    })
  }
  return highlighterPromise
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w一-龥-]/g, "")

/** Read the plain-text content of a hast node (used for heading slugs). */
function getText(node: Element): string {
  let out = ""
  for (const child of node.children) {
    if (child.type === "text") out += (child as Text).value
    else if (child.type === "element") out += getText(child as Element)
  }
  return out
}

/**
 * Rehype plugin: turn `<pre><code class="language-xx">` into a Shiki-highlighted
 * `<div class="code-block" data-lang="xx">…</div>`, matching the existing CSS
 * (.code-block + .code-block::after language pill).
 */
function rehypeShiki(highlighter: Highlighter) {
  return async (tree: Root) => {
    const jobs: Array<() => void> = []

    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "pre") return
      const code = node.children.find(
        (c): c is Element => c.type === "element" && (c as Element).tagName === "code"
      )
      if (!code) return

      // Extract language from `class="language-xx"` (MDX/remark-rehype convention).
      const classes = (code.properties?.className as string[] | undefined) ?? []
      const langClass = classes.find((c) => c.startsWith("language-"))
      const rawLang = langClass?.replace("language-", "")
      const resolved = resolveLang(rawLang)
      const label = rawLang || "text"

      // Concatenate text children to get the source.
      let source = ""
      for (const c of code.children) {
        if (c.type === "text") source += (c as Text).value
      }
      // remark-rehype always appends a trailing newline; shiki handles it fine.
      source = source.replace(/\n$/, "")

      jobs.push(() => {
        const hast = highlighter.codeToHast(source, {
          lang: resolved,
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
        }) as Root

        // codeToHast returns a single <pre> root child — wrap it in our .code-block div.
        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["code-block"],
            "data-lang": label,
          },
          children: hast.children as ElementContent[],
        }

        if (parent && typeof index === "number") {
          parent.children[index] = wrapper
        }
      })
    })

    jobs.forEach((j) => j())
  }
}

/**
 * Rehype plugin: inject id="…" on h2/h3/h4 using the same slug algorithm as
 * extractHeadings() so TOC anchors line up. Also demote any body-level h1 to
 * h2 — the page header already renders the title.
 */
function rehypeHeadings() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "h1") node.tagName = "h2"
      if (!/^h[2-4]$/.test(node.tagName)) return
      const text = getText(node)
      if (!text) return
      node.properties = { ...(node.properties ?? {}), id: slugify(text) }
    })
  }
}

/**
 * Rehype plugin: ensure every <img> in the rendered article has lazy-loading
 * and async-decoding hints. Author-supplied attributes win.
 */
function rehypeImgAttrs() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return
      const props = node.properties ?? {}
      if (props.loading === undefined) props.loading = "lazy"
      if (props.decoding === undefined) props.decoding = "async"
      node.properties = props
    })
  }
}

/**
 * Compile an MDX source string into a React element ready to render.
 * Accepts both `.md` and `.mdx` content — plain markdown is a valid subset
 * of MDX, and 99% of existing `.md` posts will compile unchanged.
 */
export async function renderMDX(source: string, postTitle?: string): Promise<ReactElement> {
  const highlighter = await getHighlighter()

  // If the article starts with an H1 that just repeats the page title, strip it.
  let body = source
  if (postTitle) {
    body = body.replace(/^#\s+(.+?)\s*$/m, (full, t: string) => {
      const norm = (s: string) => s.replace(/\s+/g, "").trim()
      return norm(t) === norm(postTitle) ? "" : full
    })
  }

  const { content } = await compileMDX({
    source: body,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeHeadings,
          rehypeImgAttrs,
          [rehypeShiki, highlighter],
          // External links open in new tabs with rel=noopener noreferrer.
          [
            rehypeExternalLinks,
            { target: "_blank", rel: ["noopener", "noreferrer"] },
          ],
        ],
      },
      // We do our own frontmatter parsing in lib/posts.ts — but the post body
      // never includes the YAML block at this point, so this is moot.
      parseFrontmatter: false,
    },
  })

  return content
}

/**
 * Plain-markdown rendering path. Used for posts whose body contains literal
 * `<` / `{` sequences that MDX (correctly) refuses to parse as text — see
 * PLAIN_MARKDOWN_SLUGS above. Output is a sanitised-by-construction HTML
 * string that the page renders via `dangerouslySetInnerHTML`. Keep the rehype
 * plugin set in lockstep with renderMDX() so TOC anchors, image hints, code
 * highlighting, and external-link safety are identical.
 */
export async function renderPlainMarkdown(source: string, postTitle?: string): Promise<string> {
  const highlighter = await getHighlighter()

  let body = source
  if (postTitle) {
    body = body.replace(/^#\s+(.+?)\s*$/m, (full, t: string) => {
      const norm = (s: string) => s.replace(/\s+/g, "").trim()
      return norm(t) === norm(postTitle) ? "" : full
    })
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeHeadings)
    .use(rehypeImgAttrs)
    .use(rehypeShiki, highlighter)
    .use(rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] })
    .use(rehypeStringify, { allowDangerousHtml: false })
    .process(body)

  return String(file)
}

export interface Heading {
  level: 2 | 3 | 4
  text: string
  id: string
}

/** Extract h2/h3/h4 from raw markdown/MDX source (used by the in-page TOC). */
export function extractHeadings(md: string, postTitle?: string): Heading[] {
  const out: Heading[] = []
  let inFence = false
  const normalize = (s: string) => s.replace(/\s+/g, "").trim()
  const titleNorm = postTitle ? normalize(postTitle) : null

  for (const raw of md.split("\n")) {
    const line = raw.trimEnd()
    if (line.startsWith("```")) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    // Promote a single body-level h1 to h2 (matches renderMDX's behaviour).
    const m = /^(#{1,4})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!m) continue
    let level = m[1].length
    const text = m[2].replace(/`/g, "").trim()
    // Skip the body-h1 that duplicates the page title — header already shows it.
    if (level === 1 && titleNorm && normalize(text) === titleNorm) continue
    if (level === 1) level = 2
    if (level < 2 || level > 4) continue
    out.push({
      level: level as 2 | 3 | 4,
      text,
      id: slugify(text),
    })
  }
  return out
}
