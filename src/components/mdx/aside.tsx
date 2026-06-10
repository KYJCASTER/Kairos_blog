import type { ReactNode } from "react"

interface AsideProps {
  label?: string
  children: ReactNode
}

/**
 * Marginal-note style aside. At wide viewports it floats into the right
 * gutter inside the prose column; at narrow viewports it collapses to a
 * full-width quote-like block. The label renders as a small caps tag.
 */
export function Aside({ label = "旁注", children }: AsideProps) {
  return (
    <aside className="aside-note">
      <p className="aside-label">{label}</p>
      <div className="aside-content">{children}</div>
    </aside>
  )
}
