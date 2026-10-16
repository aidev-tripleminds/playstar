import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { cn } from "@/lib/utils";

import { ModelEmptyState, type ModelEmptyStateProps } from "../empty-state/empty-state";

export type ModelEmptyStateSectionProps = React.ComponentProps<"section"> & {
  title?: string;
  description?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  /** Forwarded to the inner `ModelEmptyState` (e.g. custom `cards`). */
  emptyStateProps?: Omit<ModelEmptyStateProps, "className">;
  /** Replace the default CTA button (e.g. link or router `Button`). Pass `null` to hide it. */
  ctaSlot?: React.ReactNode | null;
};

export function ModelEmptyStateSection({
  title = "No media generated yet",
  description = "Your AI hasn't created any images or videos yet.",
  ctaLabel = "Create Your First Content",
  onCtaClick,
  emptyStateProps,
  ctaSlot,
  className,
  ...props
}: ModelEmptyStateSectionProps) {
  return (
    <section
      data-slot="model-empty-state-section"
      className={cn("flex w-full max-w-md flex-col items-center gap-6 py-10 md:pb-10", className)}
      {...props}
    >
      <ModelEmptyState {...emptyStateProps} />

      <div className="flex w-full flex-col gap-2 text-center">
        <h2 className="text-tooltip-text text-center text-[18px] leading-7 font-medium">{title}</h2>
        <p className="text-select-muted-text text-[14px] leading-5 font-medium">{description}</p>
      </div>

      {ctaSlot !== undefined ? (
        ctaSlot
      ) : (
        <Buttons
          type="button"
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={ctaLabel}
          onClick={onCtaClick}
          className="w-fit"
        />
      )}
    </section>
  );
}
