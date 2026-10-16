import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { SkeletonPrimitiveProps } from "./skeleton.types";

export type SkeletonIconProps = SkeletonPrimitiveProps;

export function SkeletonIcon({ className, ...props }: SkeletonIconProps) {
  return (
    <Skeleton
      data-slot="skeleton-icon"
      className={cn("size-5 shrink-0 rounded-md", className)}
      {...props}
    />
  );
}
