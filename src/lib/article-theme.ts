/**
 * Per-topic reading themes.
 *
 * Each published post gets one of five reading themes, resolved at build
 * time from its frontmatter. The theme lands as a `data-theme` attribute
 * on the article page wrapper; globals.css swaps the accent custom
 * properties (and a few typographic details — drop cap, section-break
 * glyph, blockquote voice) under that attribute, so the whole reading
 * surface — links, blockquotes, TOC rail, progress bar, tag chips —
 * re-tints without any component knowing about themes.
 *
 * "essay" is the site default (warm terracotta) and emits no attribute
 * overrides, so untagged/personal posts read exactly as before.
 */

export type ArticleTheme =
  | "engineering" // 编程 / Go / Java / 工具 — steel ink-blue, no drop cap
  | "security"    // 网络安全 / DNS — pine green, no drop cap
  | "market"      // 金融 / 区块链研报 — ledger bronze, tabular emphasis
  | "music"       // 音乐 / 专辑解析 — plum, pull-quote voice
  | "essay"       // 随笔 / 默认 — site terracotta, unchanged

/** Tag → theme. First tag wins, so the author's tag order expresses
 *  primacy (e.g. 「随笔, Go」 reads as an essay about Go, not Go docs). */
const TAG_THEMES: Record<string, ArticleTheme> = {
  "网络安全": "security",
  "dns": "security",
  "编程": "engineering",
  "编程工具": "engineering",
  "go": "engineering",
  "java": "engineering",
  "ai": "engineering",
  "金融": "market",
  "区块链": "market",
  "音乐": "music",
  "专辑解析": "music",
  "随笔": "essay",
  "大学": "essay",
}

/** Series → theme, consulted only when no tag matched. */
const SERIES_THEMES: Record<string, ArticleTheme> = {
  "加密研报 2026": "market",
  "java 学习笔记": "engineering",
  "go 学习笔记": "engineering",
}

export function articleThemeFor(post: {
  tags: string[]
  series?: string
}): ArticleTheme {
  for (const tag of post.tags) {
    const theme = TAG_THEMES[tag.toLowerCase()]
    if (theme) return theme
  }
  if (post.series) {
    const theme = SERIES_THEMES[post.series.toLowerCase()]
    if (theme) return theme
  }
  return "essay"
}
