"use client"

import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ComicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "warning"
  size?: "sm" | "md" | "lg"
  skew?: boolean
}

const ComicButton = forwardRef<HTMLButtonElement, ComicButtonProps>(
  ({ className, variant = "primary", size = "md", skew = true, children, ...props }, ref) => {
    const variants = {
      primary: "bg-[#FFD60A] hover:bg-yellow-400",
      secondary: "bg-[#4361EE] text-white hover:bg-blue-600",
      danger: "bg-[#E63946] text-white hover:bg-red-600",
      warning: "bg-[#F39C12] text-white hover:bg-orange-600",
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "relative font-comic tracking-wider",
          "border-4 border-black",
          "transition-all duration-150",
          "hover:scale-105 active:scale-95",
          "comic-shadow hover:comic-shadow-sm active:shadow-none",
          "active:translate-x-1 active:translate-y-1",
          skew && "-skew-x-12",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <span className={cn(skew && "skew-x-12 inline-block")}>{children}</span>
      </button>
    )
  }
)

ComicButton.displayName = "ComicButton"

export { ComicButton }
