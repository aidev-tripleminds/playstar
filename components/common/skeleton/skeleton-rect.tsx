import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { SkeletonPrimitiveProps } from "./skeleton.types";

export type SkeletonRectProps = SkeletonPrimitiveProps;

export function SkeletonRect({ className, ...props }: SkeletonRectProps) {
  return <Skeleton data-slot="skeleton-rect" className={cn("rounded-md", className)} {...props} />;
}
