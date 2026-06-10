// Server-rendered JSON-LD for individual blog posts. Improves the rich-result
// surface in Google / Bing and gives social cards a structured fallback.

import { site } from "@/lib/site"
import type { Post } from "@/lib/posts"

export function ArticleJsonLd({ post }: { post: Post }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
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
