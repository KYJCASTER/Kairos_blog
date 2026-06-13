// RSS feed served as a Route Handler. `output: 'export'` snapshots this to
// /Kairos_blog/rss.xml/index.html at build time, which Cloudflare-style
// readers accept as the feed body.
//
// Bodies are rendered to HTML via remark/rehype (NOT the article-page
// pipeline — Next 16 forbids `react-dom/server` inside route handlers, and
// we don't need Shiki tokenization for RSS readers anyway). The result is
// embedded inside <content:encoded> CDATA so feed readers (Feedly,
// NetNewsWire, …) can show full-article content offline.

import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"

import { getPublishedPosts } from "@/lib/posts"
import { site } from "@/lib/site"

export const dynamic = "force-static"

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&apos;")

// CDATA cannot contain the `]]>` sequence — split it across two CDATA
// sections if it ever occurs in a post body.
const cdata = (s: string) => `<![CDATA[${s.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`

// Single shared processor — instantiation isn't free, and these all run
// sequentially during build.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })

async function markdownToHtml(md: string): Promise<string> {
  const file = await processor.process(md)
  return String(file)
}

export async function GET() {
  const posts = getPublishedPosts()
  const buildDate = new Date().toUTCString()

  const items = (
    await Promise.all(
      posts.map(async (post) => {
        const url = `${site.url}/blog/${post.slug}`
        const pubDate = new Date(post.date).toUTCString()
        const html = await markdownToHtml(post.content)
        return `
    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${xmlEscape(site.author)}</dc:creator>
      <description>${xmlEscape(post.excerpt)}</description>
      <content:encoded>${cdata(html)}</content:encoded>
      ${post.tags.map((t) => `<category>${xmlEscape(t)}</category>`).join("")}
    </item>`
      }),
    )
  ).join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
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
