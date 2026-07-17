import Link from "next/link"

export interface ArchiveLedgerItem {
  slug: string
  title: string
  date: string
  tags: string[]
}

interface ArchiveLedgerProps {
  posts: ArchiveLedgerItem[]
}

/**
 * Compact "ledger" rendering of posts. Single line per entry:
 *
 *     06-13   Title goes here…                              #tag1 #tag2
 *
 * Distinct from <PostArchiveList> on purpose — that one carries excerpts and
 * card-style hover affordances. This one's the bookkeeper's view: tightest
 * possible scan, most posts visible per screen.
 */
export function ArchiveLedger({ posts }: ArchiveLedgerProps) {
  return (
    <ul className="divide-y hairline">
      {posts.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/blog/${p.slug}`}
            className="group grid sm:grid-cols-[5.5rem_1fr_auto] gap-x-4 gap-y-1.5 items-baseline py-3 sm:py-3.5"
          >
            <time
              dateTime={p.date}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-light tabular-nums"
            >
              {p.date.slice(5)}
            </time>
            <h3 className="serif text-base sm:text-lg text-foreground group-hover:text-primary transition-colors leading-snug min-w-0">
              <span className="link-draw">{p.title}</span>
            </h3>
            {p.tags.length > 0 && (
              <span className="flex flex-wrap gap-1 sm:gap-1.5 sm:justify-end">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-light"
                  >
                    #{t}
                  </span>
                ))}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
