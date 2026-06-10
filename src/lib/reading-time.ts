// Reading stats that work for Chinese-heavy content.
// `marked` + `split(/\s+/)` would count an entire CJK article as a single word —
// here we count CJK glyphs separately from latin words.

export interface ReadingStats {
  chineseChars: number
  englishWords: number
  totalWords: number
  minutes: number
}

const CJK_RE = /[一-龥㐀-䶿]/g

export function computeReadingStats(markdown: string): ReadingStats {
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, " ")            // fenced code blocks
    .replace(/`[^`\n]*`/g, " ")                  // inline code
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")   // links / images
    .replace(/[#*_>~`|\-]/g, " ")
    .replace(/<[^>]+>/g, " ")                    // raw HTML

  const chineseChars = (stripped.match(CJK_RE) || []).length
  const englishWords = stripped
    .replace(CJK_RE, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length

  // 400 cn-chars/min ≈ 200 en-words/min, both calibrated for tech reading
  const minutes = Math.max(1, Math.ceil(chineseChars / 400 + englishWords / 200))

  return { chineseChars, englishWords, totalWords: chineseChars + englishWords, minutes }
}
