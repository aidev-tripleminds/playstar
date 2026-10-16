import { cva, type VariantProps } from "class-variance-authority";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { SkeletonPrimitiveProps } from "./skeleton.types";

const skeletonCircleVariants = cva("shrink-0 rounded-full", {
  variants: {
    size: {
      sm: "size-5",
      md: "size-8",
      lg: "size-10",
      xl: "size-12",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type SkeletonCircleProps = SkeletonPrimitiveProps &
  VariantProps<typeof skeletonCircleVariants>;

export function SkeletonCircle({ className, size = "md", ...props }: SkeletonCircleProps) {
  return (
    <Skeleton
      data-slot="skeleton-circle"
      className={cn(skeletonCircleVariants({ size }), className)}
      {...props}
    />
  );
}
