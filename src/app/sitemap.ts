import type { MetadataRoute } from "next"
import { getPublishedPosts, getAllTags, getAllSeries } from "@/lib/posts"
import { absUrl } from "@/lib/site"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublishedPosts()
  const tags = getAllTags()
  const seriesList = getAllSeries()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: absUrl("/"),             lastModified: new Date(), changeFrequency: "weekly",  priority: 1 },
    { url: absUrl("/frontispiece"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: absUrl("/blog"),         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: absUrl("/archive"),      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: absUrl("/series"),       lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: absUrl("/tags"),         lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: absUrl("/curriculum"),   lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: absUrl("/about"),        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.4 },
    { url: absUrl("/tribute/mac-miller"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: absUrl("/tribute/swimming"),   lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ]

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const tagEntries: MetadataRoute.Sitemap = tags.map((t) => ({
    url: absUrl(`/tags/${t.slug}`),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }))

  const seriesEntries: MetadataRoute.Sitemap = seriesList.map((s) => ({
    url: absUrl(`/series/${s.slug}`),
    lastModified: new Date(s.endDate),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticEntries, ...postEntries, ...tagEntries, ...seriesEntries]
}
