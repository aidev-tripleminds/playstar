import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type SkeletonCardProps = React.ComponentProps<"div">;

export function SkeletonCard({ className, children, ...props }: SkeletonCardProps) {
  if (children) {
    return (
      <div
        data-slot="skeleton-card"
        className={cn("overflow-hidden rounded-xl", className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  return <Skeleton data-slot="skeleton-card" className={cn("rounded-xl", className)} {...props} />;
}
