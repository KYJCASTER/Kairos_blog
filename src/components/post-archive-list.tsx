"use client"

import Link from "next/link"

import { ArrowUpRightIcon } from "@/components/icons"
import { Reveal } from "@/components/reveal"

export interface ArchivePostItem {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  date: string
}

interface PostArchiveListProps {
  posts: ArchivePostItem[]
  /**
   * "archive" (default) — left rail shows YYYY / MM-DD (used by /tags/[slug]).
   * "series"            — left rail shows 01 / 0N reading order, full date
   *                       moved underneath in mono small caps. Used by
   *                       /series/[slug] where order matters more than calendar.
   */
  variant?: "archive" | "series"
}

export function PostArchiveList({ posts, variant = "archive" }: PostArchiveListProps) {
  const total = posts.length
  return (
    <ul className="space-y-3">
      {posts.map((post, i) => (
        <li key={post.slug}>
          <Reveal delay={Math.min(i, 6) * 70}>
            <Link href={`/blog/${post.slug}`} className="archive-row group">
              {variant === "series" ? (
                <span className="archive-rail" aria-label={`第 ${i + 1} 篇 / 共 ${total} 篇`}>
                  <span>{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
                  <strong>
                    <time dateTime={post.date}>{post.date}</time>
                  </strong>
                </span>
              ) : (
                <time className="archive-rail" dateTime={post.date}>
                  <span>{post.date.slice(0, 4)}</span>
                  <strong>{post.date.slice(5).replace("-", " / ")}</strong>
                </time>
              )}
              <div className="min-w-0">
                <h3 className="serif text-xl sm:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-700 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-muted mt-2 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {post.tags.map((t) => (
                      <span key={t} className="tag-chip tag-chip-static">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ArrowUpRightIcon className="hidden sm:block w-5 h-5 text-muted-light group-hover:text-primary transition-colors duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]" />
            </Link>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
