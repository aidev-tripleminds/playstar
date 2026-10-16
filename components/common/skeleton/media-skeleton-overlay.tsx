import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type MediaSkeletonOverlayProps = {
  isLoaded: boolean;
  className?: string;
  skeletonClassName?: string;
};

/** Same-size pulse overlay. Sits above the media so empty frames never show. */
export function MediaSkeletonOverlay({
  isLoaded,
  className,
  skeletonClassName,
}: MediaSkeletonOverlayProps) {
  return (
    <span
      data-slot="skeleton-image-overlay"
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-[inherit] transition-opacity duration-300 motion-reduce:transition-none",
        isLoaded ? "opacity-0" : "opacity-100",
        className,
      )}
    >
      <Skeleton className={cn("size-full rounded-[inherit] bg-white/10", skeletonClassName)} />
    </span>
  );
}
