import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

interface SpeechBubbleProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "left" | "right" | "bottom"
  color?: "white" | "yellow" | "blue"
}

const SpeechBubble = forwardRef<HTMLDivElement, SpeechBubbleProps>(
  ({ className, direction = "bottom", color = "white", children, ...props }, ref) => {
    const colors = {
      white: "bg-white",
      yellow: "bg-[#FFD60A]",
      blue: "bg-[#4361EE] text-white",
    }

    const tailStyles = {
      left: "before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[15px] before:border-t-transparent before:border-r-[20px] before:border-r-black before:border-b-[15px] before:border-b-transparent after:absolute after:-left-[11px] after:top-1/2 after:-translate-y-1/2 after:w-0 after:h-0 after:border-t-[12px] after:border-t-transparent after:border-r-[16px] after:border-r-white after:border-b-[12px] after:border-b-transparent",
      right: "before:absolute before:-right-4 before:top-1/2 before:-translate-y-1/2 before:w-0 before:h-0 before:border-t-[15px] before:border-t-transparent before:border-l-[20px] before:border-l-black before:border-b-[15px] before:border-b-transparent after:absolute after:-right-[11px] after:top-1/2 after:-translate-y-1/2 after:w-0 after:h-0 after:border-t-[12px] after:border-t-transparent after:border-l-[16px] after:border-l-white after:border-b-[12px] after:border-b-transparent",
      bottom: "before:absolute before:-bottom-4 before:left-1/4 before:w-0 before:h-0 before:border-l-[15px] before:border-l-transparent before:border-t-[20px] before:border-t-black before:border-r-[15px] before:border-r-transparent after:absolute after:-bottom-[11px] after:left-[calc(25%+3px)] after:w-0 after:h-0 after:border-l-[12px] after:border-l-transparent after:border-t-[16px] after:border-t-white after:border-r-[12px] after:border-r-transparent",
    }

    const colorTailOverrides = {
      white: "",
      yellow: "after:border-t-[#FFD60A] after:border-r-[#FFD60A]",
      blue: "after:border-t-[#4361EE] after:border-r-[#4361EE]",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-[30px] border-4 border-black p-6",
          colors[color],
          tailStyles[direction],
          colorTailOverrides[color],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

SpeechBubble.displayName = "SpeechBubble"

export { SpeechBubble }
