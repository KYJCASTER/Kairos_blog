"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/**
 * Pointer parallax — children drift a few px toward the cursor, like a
 * print plate shifting under your hand. The component only writes the
 * `--px` / `--py` CSS vars (px units); `.parallax-frame` in globals.css
 * owns the transform + smoothing transition, so re-renders never happen.
 *
 * Inert on coarse pointers (touch) and for reduced-motion users — in
 * both cases the frame just sits still at its rest transform.
 */
export function PointerParallax({
  children,
  className,
  /** Max drift in px at the frame's edge. */
  strength = 8,
}: {
  children: React.ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    let raf = 0
    const onMove = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      // Skip work when the frame is far outside the viewport.
      if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return
      const px = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const py = ((e.clientY - rect.top) / rect.height) * 2 - 1
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        node.style.setProperty("--px", (px * strength).toFixed(2))
        node.style.setProperty("--py", (py * strength).toFixed(2))
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        node.style.setProperty("--px", "0")
        node.style.setProperty("--py", "0")
      })
    }

    node.addEventListener("pointermove", onMove)
    node.addEventListener("pointerleave", onLeave)
    return () => {
      cancelAnimationFrame(raf)
      node.removeEventListener("pointermove", onMove)
      node.removeEventListener("pointerleave", onLeave)
    }
  }, [strength])

  return (
    <div ref={ref} className={cn("parallax-frame", className)}>
      {children}
    </div>
  )
}
