import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { SkeletonPrimitiveProps } from "./skeleton.types";

export type SkeletonImageProps = SkeletonPrimitiveProps;

export function SkeletonImage({ className, ...props }: SkeletonImageProps) {
  return (
    <Skeleton
      data-slot="skeleton-image"
      className={cn("aspect-square w-full rounded-xl", className)}
      {...props}
    />
  );
}
