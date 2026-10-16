import { cva, type VariantProps } from "class-variance-authority";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { SkeletonPrimitiveProps } from "./skeleton.types";

const skeletonButtonVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "h-6 w-16 rounded-[min(var(--radius-md),10px)]",
      sm: "h-7 w-20 rounded-[min(var(--radius-md),12px)]",
      default: "h-8 w-24 rounded-lg",
      lg: "h-9 w-28 rounded-lg",
      icon: "size-8 rounded-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type SkeletonButtonProps = SkeletonPrimitiveProps &
  VariantProps<typeof skeletonButtonVariants>;

export function SkeletonButton({ className, size = "default", ...props }: SkeletonButtonProps) {
  return (
    <Skeleton
      data-slot="skeleton-button"
      className={cn(skeletonButtonVariants({ size }), className)}
      {...props}
    />
  );
}
