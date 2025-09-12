import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-transparent",
        outline:
          "border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border",
        ghost: "hover:bg-accent hover:text-accent-foreground border-border",
  link: "text-primary underline-offset-4 hover:underline border-border",
        code: "h-9 px-4 rounded-[10px] text-sm font-medium items-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 bg-foreground text-background hover:bg-foreground/90 disabled:bg-foreground/60 disabled:hover:bg-foreground/60 hover:translate-y-[1px] hover:scale-[0.98] active:translate-y-[2px] active:scale-[0.97] disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:scale-100 border-transparent",
        orange: "h-9 px-4 rounded-[10px] text-sm font-medium items-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90 hover:translate-y-[1px] hover:scale-[0.98] active:translate-y-[2px] active:scale-[0.97] disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:scale-100 border-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
