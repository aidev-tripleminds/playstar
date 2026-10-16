import "ldrs/react/Hourglass.css";

import { Hourglass } from "ldrs/react";
import Image from "next/image";
import type { ReactNode } from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { Buttons } from "@/components/common/general/button/buttons";
import { Close } from "@/components/common/general/close/close";
import { cn } from "@/lib/utils";

import { GeneratingV2Dotfield } from "./generating-v2-dotfield";
import {
  GENERATING_V2_LABEL_CLASS,
  GENERATING_V2_LABEL_WRAP_CLASS,
} from "./generating-v2-dotfield.constants";

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
  title = "Queued…",
  subtitle = "Starting soon.",
  generatingLabel = "Generating...",
  moderationTitle,
  moderationDescription,
  secondaryActionLabel = "Copy prompt",
  primaryActionLabel = "Retry",
  cancelActionLabel = "Cancel queue",
  skipQueueActionLabel = "Skip queue",
  skipQueueTokenCost = "1",
  showSkipQueueAction = true,
  onCancel,
  onSkipQueue,
  onPrimaryAction,
  onSecondaryAction,
  onDismiss,
  className,
}: PlaceholderProcessingProps) {
  const isDotfield = state === "processing" || state === "generating";
  const dotfieldLabel = state === "processing" ? label : generatingLabel;

  return (
    <section
      data-slot="placeholder-processing"
      data-state={state}
      data-variant={variant}
      className={cn(
        "bg-tooltip-default-bg relative overflow-hidden rounded-[24px]",
        isDotfield
          ? "aspect-[280/340] h-[340px] w-[280px]"
          : "flex h-[340px] w-[280px] flex-col justify-center gap-3 p-4",
        className,
      )}
    >
      {state === "queuing" ? (
        <Close
          data-slot="placeholder-processing-cancel-queue"
          size="medium"
          aria-label={cancelActionLabel}
          onClick={onCancel}
          className="absolute top-4 right-4 z-10"
        />
      ) : null}
      {isDotfield ? (
        <>
          <GeneratingV2Dotfield />
          <div
            data-slot="placeholder-processing-generating-v2-label-wrap"
            className={GENERATING_V2_LABEL_WRAP_CLASS}
          >
            <p
              data-slot="placeholder-processing-generating-v2-label"
              className={GENERATING_V2_LABEL_CLASS}
            >
              {dotfieldLabel}
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {state === "queuing" ? (
            <>
              <Hourglass size="40" bgOpacity="0.1" speed="1.75" color="var(--tooltip-text)" />
              <div className="flex flex-col gap-1">
                <p className="text-tooltip-text text-center text-xs leading-4 font-medium">
                  {title}
                </p>
                <p className="text-modal-text text-center text-[12px]! leading-4 font-medium">
                  {subtitle}
                </p>
              </div>
              {showSkipQueueAction ? (
                <div className="flex w-full flex-col items-center gap-2">
                  <Buttons
                    type="button"
                    variant="rose"
                    size="btn-s"
                    leftIcon={false}
                    rightIcon={false}
                    label={skipQueueActionLabel}
                    rightIconNode={
                      <Badge
                        type="empty"
                        size="large"
                        text={skipQueueTokenCost}
                        showIcon
                        className="px-0!"
                      />
                    }
                    onClick={onSkipQueue}
                    className="w-full max-w-[127px]"
                  />
                </div>
              ) : null}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </section>
  );
}
