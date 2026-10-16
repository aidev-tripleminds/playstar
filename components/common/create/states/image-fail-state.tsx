"use client";

import { Buttons } from "@/components/common/general/button/buttons";

import { GradientGrid } from "../../general/gradient-grid/gradient-grid";
import { CardShell } from "./shared";

export const IMAGE_FAIL_STATE_TITLE = "Image generation failed";
/**
 * Only used when no backend message is supplied (a Storybook/demo render).
 * Live failures always carry their own sentence — the copy per failure reason
 * is owned by the backend so the two repos cannot drift (BACK-90).
 */
export const IMAGE_FAIL_STATE_DEFAULT_MESSAGE = "Please try again, it's free.";
export const IMAGE_FAIL_STATE_RETRY_LABEL = "Retry now";
export const IMAGE_FAIL_STATE_START_OVER_LABEL = "Start over";
/**
 * Shown only when the backend reports that the charge was actually reversed.
 * The failure message says what broke; this says what it cost — the two are
 * separate facts, and merging them into one sentence would mean asserting a
 * refund the copy cannot verify.
 */
export const IMAGE_FAIL_STATE_REFUNDED_NOTE = "No coins were deducted.";

export type ImageFailStateProps = {
  title?: string;
  /** The backend's sentence for this failure reason. */
  message?: string;
  /**
   * False for every moderation grade: the refusal is deterministic, so a retry
   * spends the user's time (and coins) reaching the same block. The user is
   * told to change the character instead, which the summary panels beside this
   * card let them do.
   */
  showRetry?: boolean;
  onRetry?: () => void;
  /**
   * Throws the character away and returns to the first step. Hidden when
   * omitted. Offered even where Retry is not, so a moderation block is never
   * a dead end (FRONT-775).
   */
  onStartOver?: () => void;
  /** The charge was reversed — only ever passed on the backend's say-so. */
  refunded?: boolean;
};

export function ImageFailState({
  title = IMAGE_FAIL_STATE_TITLE,
  message = IMAGE_FAIL_STATE_DEFAULT_MESSAGE,
  showRetry = true,
  onRetry,
  onStartOver,
  refunded = false,
}: ImageFailStateProps = {}) {
  return (
    <CardShell isSignUp={true} className="relative justify-center gap-6 p-6">
      <div className="pointer-events-none absolute -top-[250px] left-1/2 h-[420px] w-[820px] -translate-x-1/2 opacity-25">
        <GradientGrid className="h-full w-full" showGrid={false} />
      </div>

      <div className="relative z-10 flex flex-col gap-1 text-center" role="alert">
        <p className="text-gradient-pink text-2xl font-bold">{title}</p>
        <p className="text-cookie-bg text-base">{message}</p>
        {refunded ? (
          <p className="text-cookie-bg/70 text-sm">{IMAGE_FAIL_STATE_REFUNDED_NOTE}</p>
        ) : null}
      </div>

      <div className="relative z-10 flex w-full gap-2">
        {onStartOver ? (
          <Buttons
            type="button"
            variant="neutral-border"
            leftIcon={false}
            rightIcon={false}
            label={IMAGE_FAIL_STATE_START_OVER_LABEL}
            onClick={onStartOver}
            className="min-w-0 flex-1"
          />
        ) : null}
        {showRetry ? (
          <Buttons
            type="button"
            variant="rose"
            leftIcon={false}
            rightIcon={false}
            label={IMAGE_FAIL_STATE_RETRY_LABEL}
            onClick={onRetry}
            className="min-w-0 flex-1"
          />
        ) : null}
      </div>
    </CardShell>
  );
}
