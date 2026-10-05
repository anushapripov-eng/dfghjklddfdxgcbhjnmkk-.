import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 font-display font-bold transition-[transform,box-shadow,background-color] duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-45 active:translate-y-1",
  {
    variants: {
      variant: {
        primary:
          "rounded-[1.5rem] rounded-tr-lg bg-primary text-primary-foreground shadow-[0_8px_0_var(--coral-deep)] active:shadow-[0_3px_0_var(--coral-deep)]",
        soft: "rounded-full bg-secondary text-secondary-foreground ring-1 ring-border active:scale-95",
        ghost: "rounded-full bg-transparent text-foreground active:scale-95",
        default: "rounded-full bg-primary text-primary-foreground",
        outline: "rounded-full bg-background text-foreground ring-1 ring-border active:scale-95",
        secondary: "rounded-full bg-secondary text-secondary-foreground",
        destructive: "rounded-full bg-destructive text-destructive-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        danger: "rounded-[1.25rem] bg-destructive/10 text-destructive ring-1 ring-destructive/20 active:scale-[0.98]",
      },
      size: {
        icon: "size-11 p-0",
        sm: "h-10 px-4 text-sm",
        default: "h-10 px-4 text-sm",
        lg: "h-16 px-6 text-lg",
      },
    },
    defaultVariants: { variant: "soft", size: "sm" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };