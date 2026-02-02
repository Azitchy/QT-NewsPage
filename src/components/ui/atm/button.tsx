import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-[30px] body-text2-500 transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline:
          "border border-destructive border-2 text-destructive shadow-xs",
        success: "border border-primary text-primary border-2 shadow-xs",
        soft: " text-primary bg-[#E9F6F7] shadow-xs",
        secondary: "bg-[#B5B5B5] text-primary-foreground",
        ghost: "",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-[linear-gradient(315deg,#41CD8B_0%,#C2E043_100%)] text-primary-foreground",
      },
      size: {
        default: "px-6 py-3",
        sm: "rounded-[30px] gap-1.5 p-[15px]",
        lg: "rounded-[30px] px-[20px] py-[16px]",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
