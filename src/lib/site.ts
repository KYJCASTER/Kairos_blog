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
