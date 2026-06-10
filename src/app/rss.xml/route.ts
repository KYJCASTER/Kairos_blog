// RSS feed served as a Route Handler. `output: 'export'` snapshots this to
// /Kairos_blog/rss.xml/index.html at build time, which Cloudflare-style
// readers accept as the feed body.

import { getPublishedPosts } from "@/lib/posts"
import { site } from "@/lib/site"

export const dynamic = "force-static"

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&apos;")

export function GET() {
  const posts = getPublishedPosts()
  const buildDate = new Date().toUTCString()

  const items = posts
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`
      const pubDate = new Date(post.date).toUTCString()
      return `
    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${xmlEscape(post.excerpt)}</description>
      ${post.tags.map((t) => `<category>${xmlEscape(t)}</category>`).join("")}
    </item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(site.title)}</title>
    <link>${site.url}</link>
    <description>${xmlEscape(site.description)}</description>
    <language>${site.language}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
