// Single source of truth for site-wide metadata.
// Update here when domain / author / paths change.

export const site = {
  name: "Kairos",
  title: "Kairos · 开发者成长日记",
  description:
    "河南大学 2024 级网络工程学生的技术博客，记录后端、前端、网络与安全的学习与思考。",
  author: "Kairos",
  email: "2016559265w@gmail.com",
  github: "https://github.com/KYJCASTER",
  githubHandle: "KYJCASTER",
  language: "zh-CN",
  location: "河南 · 开封",
  // GitHub Pages deploy
  basePath: "/Kairos_blog",
  url: "https://kyjcaster.github.io/Kairos_blog",
  // Default social-share image (lives in public/, served under basePath).
  ogImage: "/og-default.png",
} as const

/**
 * Absolute, canonical URL for a site path. The site deploys with
 * `trailingSlash: true`, so every canonical page URL ends in a slash.
 * `site.url` already contains the basePath, so callers pass a bare path like
 * `/blog/foo` and get `https://…/Kairos_blog/blog/foo/`. Centralised so sitemap
 * entries, JSON-LD ids and breadcrumb items never drift out of sync with the
 * trailing-slash policy.
 */
export function absUrl(p = "/"): string {
  if (/^https?:\/\//i.test(p)) return p
  let out = p.startsWith("/") ? p : `/${p}`
  if (!out.endsWith("/")) out += "/"
  return `${site.url}${out}`
}

/**
 * Resolve a post `cover` to an absolute image URL, falling back to the default
 * OG image when absent. Handles absolute http(s), basePath-prefixed (de-duped)
 * and bare-rooted covers. Image URLs are NOT forced to a trailing slash.
 */
export function resolveImage(cover?: string): string {
  if (!cover) return `${site.url}${site.ogImage}`
  if (/^https?:\/\//i.test(cover)) return cover
  const stripped = cover.startsWith(site.basePath)
    ? cover.slice(site.basePath.length)
    : cover
  return `${site.url}${stripped.startsWith("/") ? stripped : `/${stripped}`}`
}

/** RSS feed-discovery alternates, reused so article pages never drop it. */
export const rssAlternates = {
  "application/rss+xml": `${site.url}/rss.xml`,
} as const

/**
 * Giscus (GitHub Discussions-backed comments) configuration.
 *
 * Setup steps (run once, manually):
 *   1. In `KYJCASTER/Kairos_blog` → Settings → General → Features → enable
 *      Discussions.
 *   2. In Discussions → Categories → create or pick a category (the default
 *      "Announcements" works — only the owner can open new threads, replies
 *      are open to anyone).
 *   3. Visit https://giscus.app/zh-CN, fill in the repo + category, and
 *      copy the generated `data-repo-id` and `data-category-id` values into
 *      the `repoId` / `categoryId` fields below.
 *
 * The `<Comments />` component renders nothing while `repoId === ""` so a
 * fresh fork doesn't break — only after the two IDs are filled in does the
 * comment box actually appear.
 */
export const giscus = {
  repo: "KYJCASTER/Kairos_blog",
  repoId: "R_kgDOPtLdiQ",
  category: "Announcements",
  categoryId: "DIC_kwDOPtLdic4C_EVG",
  mapping: "pathname",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "zh-CN",
} as const
