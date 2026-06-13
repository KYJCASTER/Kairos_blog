"use client"

// Giscus-powered comments, lazy-mounted on first scroll into view.
//
// Why client-only + lazy:
//   - giscus injects an <iframe> via its loader script. SSR'ing nothing keeps
//     the article HTML cacheable and the initial payload small.
//   - The iframe pulls ~50KB from giscus.app. We don't pay that cost until
//     the reader actually scrolls near the bottom of the post.
//
// Theme handoff:
//   - On mount we resolve next-themes' resolved theme into a giscus theme
//     name and pass it as a `data-theme` attr on the loader script.
//   - On theme change we postMessage the new theme to the iframe so it
//     re-skins without re-mounting (avoids losing the comment input draft).

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

import { giscus } from "@/lib/site"

const GISCUS_ORIGIN = "https://giscus.app"
const GISCUS_SCRIPT = "https://giscus.app/client.js"

function giscusThemeFor(resolved: string | undefined): "light" | "dark_dimmed" {
  return resolved === "dark" ? "dark_dimmed" : "light"
}

export function Comments() {
  // Don't render anything until a fork has filled in the IDs — keeps a fresh
  // clone from showing a broken iframe.
  if (!giscus.repoId || !giscus.categoryId) return null

  return <CommentsInner />
}

function CommentsInner() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  // Lazy mount once the container is within ~300px of the viewport.
  useEffect(() => {
    if (mounted) return
    const el = containerRef.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true)
          io.disconnect()
        }
      },
      { rootMargin: "300px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mounted])

  // Inject loader script once `mounted` flips to true.
  useEffect(() => {
    if (!mounted) return
    const el = containerRef.current
    if (!el) return
    // Avoid double-mount in React strict mode.
    if (el.querySelector("script[data-giscus]")) return

    const script = document.createElement("script")
    script.src = GISCUS_SCRIPT
    script.async = true
    script.crossOrigin = "anonymous"
    script.setAttribute("data-giscus", "true")
    script.setAttribute("data-repo", giscus.repo)
    script.setAttribute("data-repo-id", giscus.repoId)
    script.setAttribute("data-category", giscus.category)
    script.setAttribute("data-category-id", giscus.categoryId)
    script.setAttribute("data-mapping", giscus.mapping)
    script.setAttribute("data-strict", "0")
    script.setAttribute("data-reactions-enabled", giscus.reactionsEnabled)
    script.setAttribute("data-emit-metadata", giscus.emitMetadata)
    script.setAttribute("data-input-position", giscus.inputPosition)
    script.setAttribute("data-theme", giscusThemeFor(resolvedTheme))
    script.setAttribute("data-lang", giscus.lang)
    script.setAttribute("data-loading", "lazy")
    el.appendChild(script)
    // theme intentionally not in deps — first mount uses current value;
    // later changes are pushed via postMessage in the next effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  // On theme change, talk to the iframe instead of re-mounting it.
  useEffect(() => {
    if (!mounted) return
    const iframe = document.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
    if (!iframe?.contentWindow) return
    iframe.contentWindow.postMessage(
      { giscus: { setConfig: { theme: giscusThemeFor(resolvedTheme) } } },
      GISCUS_ORIGIN,
    )
  }, [resolvedTheme, mounted])

  return (
    <section
      aria-labelledby="comments-heading"
      className="max-w-3xl mx-auto mt-20 pt-10 border-t hairline"
    >
      <h2
        id="comments-heading"
        className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-light mb-6"
      >
        留言 · 来聊聊
      </h2>
      <div ref={containerRef} className="min-h-[200px]">
        {!mounted && (
          <p className="text-sm text-muted-light italic">滚动到这里时再加载评论…</p>
        )}
      </div>
    </section>
  )
}
