"use client"

import { useEffect, useRef } from "react"
import { ComicCard } from "./ui/comic-card"

interface GiscusCommentsProps {
  slug: string
}

export function GiscusComments({ slug }: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Clear previous content
    ref.current.innerHTML = ""

    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.setAttribute("data-repo", "KYJCASTER/Kairos_blog")
    script.setAttribute("data-repo-id", "R_kgDOI_example")
    script.setAttribute("data-category", "Comments")
    script.setAttribute("data-category-id", "DIC_kwDOI_example")
    script.setAttribute("data-mapping", "specific")
    script.setAttribute("data-term", slug)
    script.setAttribute("data-strict", "0")
    script.setAttribute("data-reactions-enabled", "1")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-input-position", "bottom")
    script.setAttribute("data-theme", "light")
    script.setAttribute("data-lang", "zh-CN")
    script.setAttribute("crossorigin", "anonymous")
    script.async = true

    ref.current.appendChild(script)
  }, [slug])

  return (
    <section className="mt-12">
      <h2 className="font-comic text-2xl mb-6 tracking-wider">
        <span className="bg-[#4361EE] text-white px-4 py-2 border-4 border-black comic-shadow inline-block transform -rotate-1">
          评论
        </span>
      </h2>
      <ComicCard variant="default" color="white">
        <div ref={ref} className="giscus" />
      </ComicCard>
    </section>
  )
}
