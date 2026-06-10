import { site } from "@/lib/site"
import { GitHubIcon, RssIcon } from "./icons"

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 py-10 px-5 sm:px-6 border-t hairline">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted text-center sm:text-left">
          <p className="serif">
            © {year} {site.name} ·{" "}
            <span className="text-muted-light">写于河南 · 开封</span>
          </p>
          <p className="text-xs mt-1 text-muted-light">
            Built with Next.js & ❤
          </p>
        </div>
        <div className="flex items-center gap-1">
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
            aria-label="GitHub"
          >
            <GitHubIcon className="w-[18px] h-[18px]" />
          </a>
          <a
            href="/rss.xml"
            className="p-2 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
            aria-label="RSS"
          >
            <RssIcon className="w-[18px] h-[18px]" />
          </a>
        </div>
      </div>
    </footer>
  )
}
