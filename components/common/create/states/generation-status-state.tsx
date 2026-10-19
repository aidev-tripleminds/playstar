"use client";

import "./generation-loading-bar.css";

import Image from "next/image";
import { type ReactNode } from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { Buttons } from "@/components/common/general/button/buttons";
import { AiLoading } from "@/components/common/general/ai-loading/ai-loading";

import { CardShell } from "./shared";

/**
 * Portrait-generation statuses for the summary card (FRONT-808).
 *
 * They share the funnel card shell with the older `loading` progress state.
 * The active phases, including queued, use the loading animation;
 * only the pill label changes. A fake bar along the bottom fills
 * over one minute (FRONT-895). The three failures share one layout.
 * Copy and whether Retry is offered are the only differences.
 */
const ANIMATED_LABEL = {
  extracting: "Extracting informations…",
  "first-moderation": "Thinking...",
  generating: "Generating...",
  "second-moderation": "Adding final touches…",
} as const;

/**
 * Sample sentences from the failure frames. Live calls pass the backend's
 * own message; these exist so Storybook matches the design with no extra args.
 */
const FAILURE_MESSAGE = {
  "moderation-text":
    "Your prompt was blocked — it may violate our guidelines. Content involving minors isn't allowed. Flagged term: “child”.",
  "moderation-image":
    "The generated image was blocked — it may violate our guidelines. Content involving minors isn’t allowed. Detected: “child”.",
  "something-went-wrong":
    "Something went wrong during generation. Please try again, or restart the creation flow.",
} as const;

type FailureStatus = keyof typeof FAILURE_MESSAGE;

export const SUMMARY_CARD_GENERATION_STATUSES = [
  "extracting",
  "queued",
  "first-moderation",
  "generating",
  "second-moderation",
  "moderation-text",
  "moderation-image",
  "something-went-wrong",
] as const;

export type SummaryCardGenerationStatus = (typeof SUMMARY_CARD_GENERATION_STATUSES)[number];

/** Text moderation is a dead end for Retry; the other two failures offer it. */
const FAILURE_RETRIES: Record<FailureStatus, boolean> = {
  "moderation-text": false,
  "moderation-image": true,
  "something-went-wrong": true,
};

const GENERATION_STATUS_REFUNDED_NOTE = "Your tokens have been refunded.";
const GENERATION_STATUS_START_OVER_LABEL = "Start over";
const GENERATION_STATUS_RETRY_LABEL = "Retry";

/** Figma pill: 16/24, radius 80, padding 6×12. Fill matches the Generate pill. */
const GENERATION_PILL_CLASS =
  "text-select-text rounded-[80px] bg-white/15 px-3 py-1.5 text-base leading-6 font-normal backdrop-blur-[4px]";

/** Image duration is unknown, so the bar is a one-minute fake fill (FRONT-895). */
const GENERATION_LOADING_BAR_MS = 60_000;

const FAILURE_BUTTON_CLASS = "w-auto!";

export type GenerationStatusStateProps = {
  status: SummaryCardGenerationStatus;
  /** Animated phases only. Replaces the pill label. */
  label?: string;
  /** Failure phases only. Replaces the sample sentence. */
  message?: string;
  /**
   * Failure phases only. The green refund line is a claim about money, so it
   * renders only when the caller (the backend's `refunded` flag) says so.
   */
  refunded?: boolean;
  /**
   * Coin cost on Retry. Defaults to the Figma sample (`2`). Pass `null` to
   * keep the button and hide the badge when the price is unknown.
   */
  retryCost?: ReactNode;
  /** Overrides the phase default. Ignored on queued and animated phases. */
  showRetry?: boolean;
  onRetry?: () => void;
  onStartOver?: () => void;
};

export function isSummaryCardGenerationStatus(
  status: string,
): status is SummaryCardGenerationStatus {
  return (SUMMARY_CARD_GENERATION_STATUSES as readonly string[]).includes(status);
}

export function GenerationStatusState({
  status,
  label,
  message,
  refunded = false,
  retryCost = "2",
  showRetry,
  onRetry,
  onStartOver,
}: GenerationStatusStateProps) {
  return (
    <CardShell>
      <div
        data-slot="summary-card-generation"
        data-status={status}
        className="relative flex min-h-0 flex-1 flex-col"
      >
        {renderGenerationStatus({
          status,
          label,
          message,
          refunded,
          retryCost,
          showRetry,
          onRetry,
          onStartOver,
        })}
      </div>
    </CardShell>
  );
}

function renderGenerationStatus({
  status,
  label,
  message,
  refunded,
  retryCost,
  showRetry,
  onRetry,
  onStartOver,
}: GenerationStatusStateProps & { refunded: boolean; retryCost: ReactNode }) {
  switch (status) {
    case "queued":
    case "extracting":
    case "first-moderation":
    case "generating":
    case "second-moderation":
      return <AnimatedBody label={label ?? (status === "queued" ? "Generating..." : ANIMATED_LABEL[status])} />;
    case "moderation-text":
    case "moderation-image":
    case "something-went-wrong":
      return (
        <FailureBody
          message={message ?? FAILURE_MESSAGE[status]}
          refunded={refunded}
          retryCost={retryCost}
          showRetry={showRetry ?? FAILURE_RETRIES[status]}
          onRetry={onRetry}
          onStartOver={onStartOver}
        />
      );
    default: {
      const unreachable: never = status;
      return unreachable;
    }
  }
}

function AnimatedBody({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" className="relative min-h-0 flex-1">
      <AiLoading />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center p-6">
        <p data-slot="summary-card-generation-label" className={GENERATION_PILL_CLASS}>
          {label}
        </p>
      </div>
      <GenerationLoadingBar />
    </div>
  );
}

function GenerationLoadingBar() {
  return (
    <div
      data-slot="summary-card-generation-bar"
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
    >
      <div
        data-slot="summary-card-generation-bar-fill"
        className="summary-card-generation-bar-fill"
        style={{ animationDuration: `${GENERATION_LOADING_BAR_MS}ms` }}
      />
    </div>
  );
}

function FailureBody({
  message,
  refunded,
  retryCost,
  showRetry,
  onRetry,
  onStartOver,
}: {
  message: string;
  refunded: boolean;
  retryCost: ReactNode;
  showRetry: boolean;
  onRetry?: () => void;
  onStartOver?: () => void;
}) {
  const showCost = retryCost != null && retryCost !== "";

  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto p-4 text-center"
    >
      <div className="flex w-full flex-col items-center gap-2">
        <span className="relative block size-10 shrink-0" aria-hidden>
          <Image src="/assets/danger.svg" alt="" fill className="object-contain" />
        </span>
        {refunded ? (
          <p className="text-xs leading-4 font-medium text-[#42BF74]">
            {GENERATION_STATUS_REFUNDED_NOTE}
          </p>
        ) : null}
        <p className="text-tooltip-text text-xs leading-4 font-medium">{message}</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {onStartOver ? (
          <Buttons
            type="button"
            variant="neutral-border"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={GENERATION_STATUS_START_OVER_LABEL}
            onClick={onStartOver}
            className={FAILURE_BUTTON_CLASS}
          />
        ) : null}
        {showRetry ? (
          <Buttons
            type="button"
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={GENERATION_STATUS_RETRY_LABEL}
            onClick={onRetry}
            className={FAILURE_BUTTON_CLASS}
            rightIconNode={
              showCost ? (
                <Badge type="empty" size="large" text={retryCost} showIcon className="px-0!" />
              ) : null
            }
          />
        ) : null}
      </div>
    </div>
  );
}
