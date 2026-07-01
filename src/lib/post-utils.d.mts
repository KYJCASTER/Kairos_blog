/**
 * Generate a short excerpt from the body when frontmatter omits it.
 */
export function deriveExcerpt(body: string, max?: number): string

/**
 * Validate raw gray-matter frontmatter. Throws at build time on typo'd or
 * malformed keys so errors surface early.
 */
export function validateFrontmatter(fileName: string, data: Record<string, unknown>): void
