import { cva, type VariantProps } from "class-variance-authority";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { SkeletonPrimitiveProps } from "./skeleton.types";

const skeletonTextVariants = cva("rounded-full", {
  variants: {
    size: {
      display: "h-8 md:h-9",
      heading: "h-7 md:h-8",
      body: "h-4",
      caption: "h-3",
    },
  },
  defaultVariants: {
    size: "body",
  },
});

export type SkeletonTextProps = SkeletonPrimitiveProps &
  VariantProps<typeof skeletonTextVariants> & {
    lines?: number;
  };

export function SkeletonText({ className, size = "body", lines = 1, ...props }: SkeletonTextProps) {
  const lineClassName = cn(skeletonTextVariants({ size }), className);

  if (lines <= 1) {
    return (
      <Skeleton data-slot="skeleton-text" className={cn("w-full", lineClassName)} {...props} />
    );
  }

  return (
    <div data-slot="skeleton-text-group" className="flex w-full flex-col gap-2" aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          data-slot="skeleton-text"
          className={cn("w-full", index === lines - 1 && "w-4/5", lineClassName)}
          {...props}
        />
      ))}
    </div>
  );
}
