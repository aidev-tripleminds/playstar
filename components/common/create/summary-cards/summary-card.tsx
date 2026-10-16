"use client";

import type { ReactNode } from "react";

import {
  DefaultState,
  GenerationStatusState,
  ImageFailState,
  LoadingState,
  SignupState,
  SliderState,
  type SummaryCardGenerationStatus,
} from "../states";

export type { SummaryCardGenerationStatus } from "../states";

export type SummaryCardStatus =
  | "loading"
  | "default"
  | "edit-char"
  | "image-fail"
  | "signup"
  | "slider"
  | "signup-slider"
  | SummaryCardGenerationStatus;

export type SummaryCardProps = {
  status?: SummaryCardStatus;
  className?: string;
  progress?: number;
  loadingTitle?: string;
  loadingSubtitle?: string;
  loadingProgressLabel?: string;
  /** "default"/"edit-char" only — falls back to the built-in demo character when omitted. */
  name?: string;
  bio?: string;
  imageSrc?: string;
  /** "default" only — `imageSrc` arrived blurred for this viewer; adds the unblur CTA. */
  blurred?: boolean;
  /** "default"/"edit-char" only — omit to fall back to the card's own local edit state. */
  onNameChange?: (value: string) => void;
  onBioChange?: (value: string) => void;
  /**
   * FRONT-890: pink Retry on the finished portrait. Shown whenever the
   * character image is on screen, including while Undo or Apply is offered.
   */
  onRegenerate?: () => void;
  /** Keeps the portrait Retry visible but inert (Undo or Apply still saving). */
  regenerateDisabled?: boolean;
  /** "image-fail" only — the backend's sentence for the failure reason (BACK-90). */
  failureMessage?: string;
  /** "image-fail" only — false hides Retry (every moderation grade). */
  canRetryImage?: boolean;
  /** "image-fail" only. */
  onRetryImage?: () => void;
  /** "image-fail" only — omit to hide "Start over". */
  onStartOver?: () => void;
  /** "image-fail" only — the backend reported the charge as reversed. */
  imageFailureRefunded?: boolean;
  /** "signup" only — the card's "Sign up to bring her to life" CTA. */
  onSignUpClick?: () => void;
  /** Animated generation statuses only — replaces the pill label. */
  generationLabel?: string;
  /** Failure generation statuses only — replaces the sample sentence. */
  generationMessage?: string;
  /**
   * Failure generation statuses only. Shows "Your tokens have been refunded."
   * when the backend reports the charge was reversed.
   */
  generationRefunded?: boolean;
  /**
   * Coin cost drawn on Retry. Defaults to the Figma sample (`2`).
   * Pass `null` to hide the badge when the price is unknown.
   */
  generationRetryCost?: ReactNode;
  /** Overrides which failure statuses offer Retry. */
  generationShowRetry?: boolean;
  /** Failure generation statuses that offer Retry. */
  onGenerationRetry?: () => void;
  /** Failure generation statuses. The button stays visible either way. */
  onGenerationStartOver?: () => void;
};

export function SummaryCard({
  status = "default",
  className,
  progress = 40,
  loadingTitle,
  loadingSubtitle,
  loadingProgressLabel,
  name,
  bio,
  imageSrc,
  blurred = false,
  onNameChange,
  onBioChange,
  onRegenerate,
  regenerateDisabled = false,
  failureMessage,
  canRetryImage = true,
  onRetryImage,
  onStartOver,
  imageFailureRefunded = false,
  onSignUpClick,
  generationLabel,
  generationMessage,
  generationRefunded = false,
  generationRetryCost,
  generationShowRetry,
  onGenerationRetry,
  onGenerationStartOver,
}: SummaryCardProps) {
  switch (status) {
    case "extracting":
    case "queued":
    case "first-moderation":
    case "generating":
    case "second-moderation":
    case "moderation-text":
    case "moderation-image":
    case "something-went-wrong":
      return (
        <div className={className}>
          <GenerationStatusState
            status={status}
            label={generationLabel}
            message={generationMessage}
            refunded={generationRefunded}
            retryCost={generationRetryCost}
            showRetry={generationShowRetry}
            onRetry={onGenerationRetry}
            onStartOver={onGenerationStartOver}
          />
        </div>
      );
    case "loading":
      return (
        <div className={className}>
          <LoadingState
            progress={progress}
            title={loadingTitle}
            subtitle={loadingSubtitle}
            progressLabel={loadingProgressLabel}
          />
        </div>
      );
    case "image-fail":
      return (
        <div className={className}>
          <ImageFailState
            message={failureMessage}
            showRetry={canRetryImage}
            onRetry={onRetryImage}
            onStartOver={onStartOver}
            refunded={imageFailureRefunded}
          />
        </div>
      );
    case "signup":
      return (
        <div className={className}>
          <SignupState onSignUpClick={onSignUpClick} />
        </div>
      );
    case "slider":
      return (
        <div className={className}>
          <SliderState />
        </div>
      );
    case "default":
    default:
      return (
        <div className={className}>
          <DefaultState
            name={name}
            bio={bio}
            imageSrc={imageSrc}
            blurred={blurred}
            onNameChange={onNameChange}
            onBioChange={onBioChange}
            onRegenerate={onRegenerate}
            regenerateDisabled={regenerateDisabled}
          />
        </div>
      );
  }
}
