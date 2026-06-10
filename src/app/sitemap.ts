import type { MetadataRoute } from "next"
import { getPublishedPosts, getAllTags } from "@/lib/posts"
import { site } from "@/lib/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts()
  const tags = getAllTags()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${site.url}/`,      lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/blog`,  lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/tags`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/about`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.4 },
  ]

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const tagEntries: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${site.url}/blog?tag=${encodeURIComponent(t.name)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  return [...staticEntries, ...postEntries, ...tagEntries]
}
