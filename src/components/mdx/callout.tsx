import { Info, Lightbulb, AlertTriangle, AlertOctagon } from "lucide-react"
import type { ReactNode } from "react"

type CalloutType = "info" | "tip" | "warning" | "danger"

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
}

const META: Record<
  CalloutType,
  { icon: typeof Info; label: string }
> = {
  info: { icon: Info, label: "提示" },
  tip: { icon: Lightbulb, label: "心得" },
  warning: { icon: AlertTriangle, label: "注意" },
  danger: { icon: AlertOctagon, label: "警告" },
}

/**
 * Editorial callout for use inside MDX articles. Inherits its colour from
 * the `data-callout=<type>` attribute, with palette wired in globals.css
 * so dark mode flips automatically.
 */
export function Callout({ type = "info", title, children }: CalloutProps) {
  const { icon: Icon, label } = META[type]
  return (
    <aside className="callout" data-callout={type} role="note">
      <div className="callout-icon" aria-hidden="true">
        <Icon className="w-4 h-4" />
      </div>
      <div className="callout-body">
        <p className="callout-label">{title ?? label}</p>
        <div className="callout-content">{children}</div>
      </div>
    </aside>
  )
}
