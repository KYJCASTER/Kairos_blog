// Shared post frontmatter helpers used by src/lib/posts.ts (Next.js / TypeScript)
// and scripts/build-search-index.mjs (plain Node prebuild).
// Kept as plain ESM so the prebuild script can import it without ts-node/tsx.

/** @type {Set<string>} */
const ALLOWED_FRONTMATTER_KEYS = new Set([
  "title", "slug", "excerpt", "date", "updated", "tags", "cover", "series", "published",
])

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/

/**
 * Generate a short excerpt from the body when frontmatter omits it.
 * @param {string} body
 * @param {number} [max=120]
 * @returns {string}
 */
export function deriveExcerpt(body, max = 120) {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!?\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/[`#*_>~|]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length > max ? text.slice(0, max) + "…" : text
}

/**
 * Validate raw gray-matter frontmatter. Throws at build time on typo'd or
 * malformed keys so errors surface early.
 * @param {string} fileName
 * @param {Record<string, unknown>} data
 * @returns {void}
 */
export function validateFrontmatter(fileName, data) {
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
