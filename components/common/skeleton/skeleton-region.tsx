export type SkeletonRegionProps = React.ComponentProps<"div"> & {
  label?: string;
};

export function SkeletonRegion({
  label = "Loading",
  className,
  children,
  ...props
}: SkeletonRegionProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      data-slot="skeleton-region"
      className={className}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
