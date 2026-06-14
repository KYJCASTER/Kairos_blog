"use client"

import { useEffect } from "react"

/**
 * Walk every h2/h3/h4 inside `#article-body` after mount and append a small
 * `#` button that copies a permalink to the heading. Same DOM-injection
 * strategy as <CodeCopyButtons /> — keeps the SSR HTML pristine and avoids
 * hydration mismatch.
 *
 * Why not render the buttons during MDX compile? The button is interactive
 * (clipboard write + transient "copied" feedback) and would force the entire
 * heading subtree into a client island. Mounting from a tiny client wrapper
 * is cheaper and lets the heading itself stay pure SSR'd HTML.
 */
export function HeadingAnchors() {
  useEffect(() => {
    const root = document.getElementById("article-body")
    if (!root) return

    const headings = root.querySelectorAll<HTMLElement>("h2[id], h3[id], h4[id]")
    const cleanups: Array<() => void> = []

    headings.forEach((h) => {
      if (h.querySelector(".heading-anchor")) return
      const btn = document.createElement("button")
      btn.type = "button"
      btn.className = "heading-anchor"
      btn.setAttribute("aria-label", `复制本节锚链接：${h.textContent ?? ""}`)
      btn.textContent = "#"
      const onClick = async (ev: MouseEvent) => {
        ev.preventDefault()
        const url = `${window.location.origin}${window.location.pathname}#${h.id}`
        const flashCopied = () => {
          btn.dataset.copied = "true"
          btn.textContent = "✓"
          window.setTimeout(() => {
            btn.dataset.copied = "false"
            btn.textContent = "#"
          }, 1400)
        }
        try {
          await navigator.clipboard.writeText(url)
          flashCopied()
        } catch {
          // Some browsers refuse without HTTPS / focus — fall back to
          // updating the URL hash so the reader can copy from the address
          // bar manually. Still flash the indicator so they get *some*
          // feedback that the click was received.
          window.history.replaceState(null, "", `#${h.id}`)
          flashCopied()
        }
      }
      btn.addEventListener("click", onClick)
      h.appendChild(btn)
      cleanups.push(() => {
        btn.removeEventListener("click", onClick)
        btn.remove()
      })
    })

    return () => {
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return null
}
