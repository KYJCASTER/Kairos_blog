// Server-rendered JSON-LD for individual blog posts. Improves the rich-result
// surface in Google / Bing and gives social cards a structured fallback.

import { site } from "@/lib/site"
import type { Post } from "@/lib/posts"

interface ArticleJsonLdProps {
  post: Post
  /** Word count from computeReadingStats — passed in to avoid recomputing. */
  wordCount?: number
}

/** Resolve a cover or default OG image to an absolute URL. */
function resolveImage(cover?: string): string {
  if (!cover) return `${site.url}/og-default.png`
  if (/^https?:\/\//i.test(cover)) return cover
  // basePath-prefixed paths and bare /paths both work — site.url already
  // includes the basePath, so strip a leading basePath if duplicated.
  const stripped = cover.startsWith(site.basePath)
    ? cover.slice(site.basePath.length)
    : cover
  return `${site.url}${stripped.startsWith("/") ? stripped : `/${stripped}`}`
}

export function ArticleJsonLd({ post, wordCount }: ArticleJsonLdProps) {
  const image = resolveImage(post.cover)
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [image],
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      "@type": "Person",
      name: site.author,
      url: site.github,
    },
    publisher: {
      "@type": "Person",
      name: site.author,
      url: site.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    inLanguage: site.language,
    ...(typeof wordCount === "number" ? { wordCount } : {}),
  }

  return (
    <script
      type="application/ld+json"
      // JSON.stringify with replacer avoids XSS via </script> in content.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

/** Breadcrumb JSON-LD: Home → Blog → {post}. Helps SERP rich results. */
export function BreadcrumbJsonLd({ post }: { post: Post }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首页",
        item: `${site.url}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "文章",
        item: `${site.url}/blog/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${site.url}/blog/${post.slug}`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: site.language,
    author: {
      "@type": "Person",
      name: site.author,
      url: site.github,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
