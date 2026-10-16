import { cva, type VariantProps } from "class-variance-authority";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { SkeletonPrimitiveProps } from "./skeleton.types";

const skeletonFieldVariants = cva("w-full", {
  variants: {
    shape: {
      input: "h-12 rounded-full",
      textarea: "h-24 rounded-xl",
      select: "h-14 rounded-2xl",
    },
  },
  defaultVariants: {
    shape: "input",
  },
});

export type SkeletonFieldProps = SkeletonPrimitiveProps &
  VariantProps<typeof skeletonFieldVariants>;

export function SkeletonField({ className, shape = "input", ...props }: SkeletonFieldProps) {
  return (
    <Skeleton
      data-slot="skeleton-field"
      className={cn(skeletonFieldVariants({ shape }), className)}
      {...props}
    />
  );
}
