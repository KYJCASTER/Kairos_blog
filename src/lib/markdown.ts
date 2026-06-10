// Markdown rendering with build-time Shiki syntax highlighting.
// Single Marked instance + single Highlighter, both memoized.
// All renders happen at build time (server components), so the cost is paid once.

import { Marked } from "marked"
import { createHighlighter, type Highlighter } from "shiki"

const SHIKI_LANGS = [
  "javascript", "typescript", "tsx", "jsx",
  "json", "html", "css", "scss", "markdown",
  "java", "go", "python", "rust", "c", "cpp",
  "csharp", "shell", "bash", "powershell",
  "yaml", "toml", "sql", "dockerfile", "ini",
  "diff", "vue", "svelte", "kotlin", "swift",
] as const

type Lang = (typeof SHIKI_LANGS)[number] | "text"
const SHIKI_LANG_SET: ReadonlySet<string> = new Set(SHIKI_LANGS)
const resolveLang = (lang: string | undefined): Lang =>
  lang && SHIKI_LANG_SET.has(lang) ? (lang as Lang) : "text"

let markedPromise: Promise<Marked> | null = null
let highlighter: Highlighter | null = null

async function getMarked(): Promise<Marked> {
  if (!markedPromise) {
    markedPromise = (async () => {
      highlighter = await createHighlighter({
        themes: ["github-light", "github-dark"],
        langs: SHIKI_LANGS as unknown as string[],
      })
      const m = new Marked({ gfm: true, breaks: false })
      m.use({
        renderer: {
          code({ text, lang }: { text: string; lang?: string }) {
            const resolved = resolveLang(lang)
            const html = highlighter!.codeToHtml(text, {
              lang: resolved,
              themes: { light: "github-light", dark: "github-dark" },
              defaultColor: false,
            })
            const label = lang || "text"
            return `<div class="code-block" data-lang="${label}">${html}</div>`
          },
        },
      })
      return m
    })()
  }
  return markedPromise
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w一-龥-]/g, "")

/** Render markdown to HTML with shiki-highlighted code blocks and heading IDs. */
export async function renderMarkdown(md: string): Promise<string> {
  const m = await getMarked()
  let html = (await m.parse(md)) as string
  // Inject id="..." on h2/h3/h4 for the TOC + in-page anchor links.
  html = html.replace(
    /<h([2-4])>([\s\S]+?)<\/h\1>/g,
    (_, level, inner) => `<h${level} id="${slugify(inner)}">${inner}</h${level}>`
  )
  return html
}

export interface Heading {
  level: 2 | 3 | 4
  text: string
  id: string
}

/** Extract h2/h3/h4 from raw markdown (used by the in-page TOC). */
export function extractHeadings(md: string): Heading[] {
  const out: Heading[] = []
  let inFence = false
  for (const raw of md.split("\n")) {
    const line = raw.trimEnd()
    if (line.startsWith("```")) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = /^(#{2,4})\s+(.+?)\s*#*\s*$/.exec(line)
    if (!m) continue
    const text = m[2].replace(/`/g, "").trim()
    out.push({
      level: m[1].length as 2 | 3 | 4,
      text,
      id: slugify(text),
    })
  }
  return out
}
