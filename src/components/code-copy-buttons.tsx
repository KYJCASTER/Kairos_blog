"use client"

import { useEffect, useState } from "react"
import { createRoot, type Root } from "react-dom/client"
import { CheckIcon, CopyIcon } from "@/components/icons"

/**
 * Find every `.code-block` in the rendered article and inject a copy button
 * into its top-right corner. Runs once on mount; idempotent if the same node
 * already has a button (e.g. after Fast Refresh).
 *
 * Doing this here — rather than emitting a button per code block in the
 * markdown renderer — keeps the HTML pristine and avoids hydration mismatch
 * (the button is mounted only on the client).
 */
export function CodeCopyButtons() {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLDivElement>(".code-block")
    const roots: Root[] = []

    blocks.forEach((block) => {
      if (block.querySelector(".copy-mount")) return
      const mount = document.createElement("div")
      mount.className = "copy-mount"
      block.appendChild(mount)
      const root = createRoot(mount)
      root.render(<CopyButton getText={() => block.querySelector("pre")?.innerText ?? ""} />)
      roots.push(root)
    })

    return () => {
      roots.forEach((r) => r.unmount())
      document.querySelectorAll(".copy-mount").forEach((n) => n.remove())
    }
  }, [])

  return null
}

function CopyButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText())
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Some browsers refuse without HTTPS / focus — fall back silently.
    }
  }

  return (
    <button
      onClick={onCopy}
      aria-label={copied ? "已复制" : "复制代码"}
      className="copy-btn"
    >
      {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
    </button>
  )
}
