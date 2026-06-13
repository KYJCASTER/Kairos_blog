import Link from "next/link"
import { site } from "@/lib/site"
import { GitHubIcon, RssIcon } from "./icons"

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t hairline">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-12">
        {/* Centred bookplate-style colophon */}
        <div className="flex flex-col items-center text-center gap-4">
          <span aria-hidden className="block w-12 h-px bg-border-strong/60" />
          <p className="serif italic text-muted text-sm tracking-wide">
            手写 · 慢读 · 不打扰
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light">
            © {year} &nbsp;·&nbsp; {site.name} &nbsp;·&nbsp; 河南 · 开封
          </p>

          <div className="flex items-center gap-1 mt-2">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon className="w-[18px] h-[18px]" />
            </a>
            <Link
              href="/rss.xml"
              className="p-2 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
              aria-label="RSS"
            >
              <RssIcon className="w-[18px] h-[18px]" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
