import Image from "next/image";
import type { ReactNode } from "react";

import {
  AI_LOADING_LABEL_CLASS,
  AI_LOADING_LABEL_WRAP_CLASS,
  AiLoading,
} from "@/components/common/general/ai-loading/ai-loading";
import { Buttons } from "@/components/common/general/button/buttons";
import { Close } from "@/components/common/general/close/close";
import { cn } from "@/lib/utils";

export type PlaceholderProcessingVariant = "default" | "variant2";
export type PlaceholderProcessingState =
  | "processing"
  | "queuing"
  | "generating"
  | "moderation-issue";

export type PlaceholderProcessingProps = {
  state?: PlaceholderProcessingState;
  variant?: PlaceholderProcessingVariant;
  label?: string;
  title?: string;
  subtitle?: string;
  progressLabel?: string;
  generatingLabel?: string;
  moderationTitle?: string;
  moderationDescription?: string;
  secondaryActionLabel?: string;
  primaryActionLabel?: string;
  /** Accessible name for the top-right cancel control on a queued card. */
  cancelActionLabel?: string;
  /** Queuing CTA label (Figma `21730:52525`). */
  skipQueueActionLabel?: string;
  /** Token cost shown on the Skip queue badge. Defaults to `1`. */
  skipQueueTokenCost?: ReactNode;
  /** When false, hides the Skip queue CTA on the queuing card. */
  showSkipQueueAction?: boolean;
  onCancel?: () => void;
  onSkipQueue?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  /** Removes a failed card. Shown only for `moderation-issue`. */
  onDismiss?: () => void;
  className?: string;
};

export function PlaceholderProcessing({
  state = "processing",
  variant = "default",
  label = "Processing…",
  title: _title = "Queued…",
  subtitle: _subtitle = "Starting soon.",
  generatingLabel = "Generating...",
  moderationTitle,
  moderationDescription,
  secondaryActionLabel = "Copy prompt",
  primaryActionLabel = "Retry",
  cancelActionLabel: _cancelActionLabel = "Cancel queue",
  skipQueueActionLabel: _skipQueueActionLabel = "Skip queue",
  skipQueueTokenCost: _skipQueueTokenCost = "1",
  showSkipQueueAction: _showSkipQueueAction = true,
  onCancel: _onCancel,
  onSkipQueue: _onSkipQueue,
  onPrimaryAction,
  onSecondaryAction,
  onDismiss,
  className,
}: PlaceholderProcessingProps) {
  const isLoading = state === "processing" || state === "generating" || state === "queuing";
  const loadingLabel = state === "processing" ? label : generatingLabel;

  return (
    <section
      data-slot="placeholder-processing"
      data-state={state}
      data-variant={variant}
      className={cn(
        "bg-tooltip-default-bg relative overflow-hidden rounded-[24px]",
        isLoading
          ? "aspect-[280/340] h-[340px] w-[280px]"
          : "flex h-[340px] w-[280px] flex-col justify-center gap-3 p-4",
        className,
      )}
    >
      {isLoading ? (
        <>
          <AiLoading />
          <div
            data-slot="placeholder-processing-loading-label-wrap"
            className={AI_LOADING_LABEL_WRAP_CLASS}
          >
            <p
              data-slot="placeholder-processing-loading-label"
              className={AI_LOADING_LABEL_CLASS}
            >
              {loadingLabel}
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {onDismiss ? (
            <Close
              aria-label="Delete"
              data-slot="placeholder-processing-dismiss"
              onClick={onDismiss}
              className="absolute top-4 right-4 z-10"
            />
          ) : null}
          <div className="flex w-full flex-col items-center gap-4">
            <div className="relative z-10 flex w-full flex-col items-center gap-3">
              <div className="relative inline-block h-[2.5em] w-[2.5em]">
                <Image
                  src="/assets/danger.svg"
                  fill
                  alt="Moderation warning"
                  className="object-contain"
                />
              </div>
              <div className="flex w-full flex-col gap-1">
                {moderationTitle ? (
                  <p className="text-modal-text text-center text-[12px]! leading-4! font-medium">
                    {moderationTitle}
                  </p>
                ) : null}
                {moderationDescription ? (
                  <p className="text-tooltip-text text-center text-[10px]! leading-[14px]! font-medium">
                    {moderationDescription}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-1.5">
              <Buttons
                type="button"
                variant="light-grey"
                size="btn-s"
                leftIcon={false}
                rightIcon={false}
                label={primaryActionLabel}
                onClick={onPrimaryAction}
                className="w-full max-w-[111px]"
              />
              <Buttons
                type="button"
                variant="neutral-border"
                size="btn-s"
                leftIcon={false}
                rightIcon={false}
                label={secondaryActionLabel}
                onClick={onSecondaryAction}
                className="w-full max-w-[111px]"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
