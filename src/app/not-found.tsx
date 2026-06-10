import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Home, Search } from "lucide-react"

export const metadata: Metadata = {
  title: "走丢了 · 404",
  description: "找不到这个页面。",
}

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-5 sm:px-6 pt-28 pb-20">
      <div className="text-center max-w-md">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
          404 · Not Found
        </p>
        <h1 className="serif text-6xl sm:text-7xl font-semibold text-foreground tracking-tight mb-6 italic">
          走丢了。
        </h1>
        <p className="text-muted leading-relaxed mb-10">
          这个 URL 没指向任何文章 — 可能是写错了，
          也可能这篇文章被改了名字。
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" />
            回首页
          </Link>
          <Link href="/blog" className="btn-secondary">
            <Search className="w-4 h-4" />
            找一篇文章
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t hairline text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-muted hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            返回起点
          </Link>
        </div>
      </div>
    </main>
  )
}
