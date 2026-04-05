import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

interface ComicCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "explosion" | "jagged"
  color?: "white" | "cream" | "blue" | "yellow" | "red"
}

const ComicCard = forwardRef<HTMLDivElement, ComicCardProps>(
  ({ className, variant = "default", color = "white", children, ...props }, ref) => {
    const colors = {
      white: "bg-white",
      cream: "bg-[#FEFAE0]",
      blue: "bg-[#4361EE] text-white",
      yellow: "bg-[#FFD60A]",
      red: "bg-[#E63946] text-white",
    }

    const clipPaths = {
      default: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      explosion: "polygon(5% 0%, 95% 0%, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0% 85%, 0% 15%)",
      jagged: "polygon(0% 5%, 5% 0%, 10% 5%, 15% 0%, 20% 5%, 25% 0%, 30% 5%, 35% 0%, 40% 5%, 45% 0%, 50% 5%, 55% 0%, 60% 5%, 65% 0%, 70% 5%, 75% 0%, 80% 5%, 85% 0%, 90% 5%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%)",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative border-4 border-black comic-shadow",
          colors[color],
          className
        )}
        style={{ clipPath: clipPaths[variant] }}
        {...props}
      >
        <div className="halftone absolute inset-0 opacity-5 pointer-events-none" />
        <div className="relative p-6">{children}</div>
      </div>
    )
  }
)

ComicCard.displayName = "ComicCard"

export { ComicCard }
