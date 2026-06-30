"use client"

// Layout-level error boundary. Triggered by any uncaught error during render
// in the routes below `app/`. Styled to match `not-found.tsx` so the parchment
// aesthetic survives crashes.

import { useEffect } from "react"
import Link from "next/link"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Surface to console — in static export there's no server log to ship to.
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-5 sm:px-6 pt-28 pb-20">
      <div className="text-center max-w-md">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
          Something went wrong
        </p>
        <h1 className="serif text-5xl sm:text-6xl font-semibold text-foreground tracking-tight mb-6 italic">
          这一页出了点状况。
        </h1>
        <p className="text-muted leading-relaxed mb-10">
          页面在渲染时遇到一个错误。可以试试重新加载，或者先回首页喝口水再回来。
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            重试
          </button>
          <Link href="/" className="btn-secondary">
            回首页
          </Link>
        </div>

        {error.digest && (
          <p className="mt-12 pt-8 border-t hairline font-mono text-[11px] text-muted-light tracking-wider">
            digest · {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
