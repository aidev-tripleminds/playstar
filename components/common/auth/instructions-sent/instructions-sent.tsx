"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { formatCountdownClock, useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";

const RESEND_COOLDOWN_MS = 75_000;

/** `{time}` is replaced with the mm:ss (or hh:mm:ss) clock. */
const DEFAULT_COUNTDOWN_LABEL = "You can resend instructions in {time}";

export type InstructionsSentProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  titleIconSrc?: string;
  description?: string;
  /**
   * Render the resend CTA at all. On by default; turn off for a caller that
   * only wants the Okay acknowledgement (e.g. Settings > Account's
   * change-email confirmation — resend is available from the settings page
   * itself by re-submitting the change, so a second resend path here is
   * redundant).
   */
  showResendButton?: boolean;
  /** Label for the resend CTA. Defaults to the password-reset wording. */
  resendLabel?: string;
  /**
   * How long the resend button stays disabled after a successful resend.
   * `0` (or negative) disables that gating entirely — the button stays
   * active after every resend. Also the default disabled state on open, when
   * {@link startsGated} is left unset — see there for the case where opening
   * the dialog does not itself send anything.
   */
  resendCooldownMs?: number;
  /**
   * Whether the button starts disabled the moment the dialog opens, before
   * any resend. Defaults to whatever `resendCooldownMs` implies (gated
   * whenever a real cooldown is configured) — the assumption is that opening
   * the dialog just triggered a send of its own. Set to `false` for a caller
   * where opening the dialog does NOT itself send anything (e.g. an
   * unverified-login check, which only inspects credentials) so the first
   * click is available immediately, while `resendCooldownMs` still gates
   * every resend AFTER that click.
   */
  startsGated?: boolean;
  /**
   * Show the ticking "you can resend in mm:ss" row. Off by default: the
   * cooldown above still gates the button, just silently — flip this on for
   * a caller that wants the visible countdown back.
   */
  showCountdown?: boolean;
  /** Only used when `showCountdown` is true. `{time}` is replaced with the clock. */
  countdownLabel?: string;
  /**
   * Re-request the email. Resolve to an error message to show inline, or null
   * on success. On failure the cooldown is left expired so the user can retry
   * straight away rather than waiting out a timer for an email never sent.
   */
  onResend?: () => Promise<string | null> | void;
  onClose?: () => void;
  className?: string;
  /**
   * Render a primary "Okay" acknowledgement CTA above the resend button. Off
   * by default (e.g. the reset-password flow has no use for it) — turn on
   * for a caller that wants an explicit dismiss action.
   */
  showOkayButton?: boolean;
  okayLabel?: string;
  /**
   * Extra action to run when Okay is clicked, in addition to the normal
   * close (`onClose`/`onOpenChange(false)`, fired either way). Omit to make
   * Okay behave exactly like closing the dialog any other way.
   */
  onOkay?: () => void;
};

function InstructionsSentCooldown({
  cooldownMs,
  showCountdown,
  countdownLabel,
  onCompleteChange,
}: {
  cooldownMs: number;
  showCountdown: boolean;
  countdownLabel: string;
  onCompleteChange: (isComplete: boolean) => void;
}) {
  const { totalSeconds, isComplete } = useCountdown({ initialMs: cooldownMs });

  React.useEffect(() => {
    onCompleteChange(isComplete);
  }, [isComplete, onCompleteChange]);

  if (!showCountdown) return null;

  return (
    <div className="flex items-center justify-center gap-1">
      <Image
        src="/assets/clock-resend.svg"
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
      />
      <p className="text-select-muted-text text-sm leading-5 font-normal">
        {countdownLabel.replace("{time}", formatCountdownClock(totalSeconds))}
      </p>
    </div>
  );
}

export function InstructionsSent({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = "Instructions have been sent",
  titleIconSrc = "/assets/send-icon.svg",
  description = "If this email address is registered with us, you'll receive password reset instructions in just a few moments. Please check your inbox.",
  showResendButton = true,
  resendLabel = "Resend email",
  resendCooldownMs = RESEND_COOLDOWN_MS,
  startsGated,
  showCountdown = false,
  countdownLabel = DEFAULT_COUNTDOWN_LABEL,
  onResend,
  onClose,
  className,
  showOkayButton = false,
  okayLabel = "Okay",
  onOkay,
}: InstructionsSentProps) {
  const isGated = resendCooldownMs > 0;
  const resolvedStartsGated = startsGated ?? isGated;
  const [resendCount, setResendCount] = React.useState(0);
  const [canResend, setCanResend] = React.useState(!resolvedStartsGated);
  const [isResending, setIsResending] = React.useState(false);
  const [error, setError] = React.useState("");
  const isOpen = open ?? Boolean(defaultOpen);

  const handleClose = React.useCallback(() => {
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);

  const handleOkay = React.useCallback(() => {
    handleClose();
    onOkay?.();
  }, [handleClose, onOkay]);

  const handleCompleteChange = React.useCallback((isComplete: boolean) => {
    setCanResend(isComplete);
  }, []);

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setError("");
    setIsResending(true);
    try {
      const errorMessage = await onResend?.();
      if (errorMessage) {
        // Leave `canResend` true — nothing was sent, so restarting the
        // cooldown would only make the failure look like a success.
        setError(errorMessage);
        return;
      }
    } catch {
      setError("Error, please contact support");
      return;
    } finally {
      setIsResending(false);
    }

    // No cooldown configured: stay active rather than getting stuck disabled
    // with nothing left to flip it back (the cooldown component below is
    // never mounted in that case).
    setCanResend(!isGated);
    setResendCount((count) => count + 1);
  };

  return (
    <ModalLayout
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={title}
      titleIconSrc={titleIconSrc}
      showIcon
      showMobileHandle
      closeLabel="Close"
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      className={cn("border-surface-strong bg-dialog-bg z-71", className)}
    >
      <div className="flex flex-col gap-4">
        <p className="text-modal-text text-sm leading-5 font-normal">{description}</p>

        {/*
          Mounting this always whenever isGated is true would clobber a
          startsGated={false} caller: its useCountdown effect reports
          "not complete yet" on its very first render regardless of why it
          mounted, which would immediately re-disable a button we just chose
          to start enabled. Withhold the mount until either the button
          started gated for real, or a resend has actually happened (which
          is exactly when the post-resend cooldown needs to begin).
        */}
        {isOpen && isGated && showResendButton && (resolvedStartsGated || resendCount > 0) ? (
          <InstructionsSentCooldown
            key={`${isOpen}-${resendCount}`}
            cooldownMs={resendCooldownMs}
            showCountdown={showCountdown}
            countdownLabel={countdownLabel}
            onCompleteChange={handleCompleteChange}
          />
        ) : null}

        <div className="flex flex-col gap-1">
          {showOkayButton ? (
            <Buttons
              variant="rose"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label={okayLabel}
              onClick={handleOkay}
              className="w-full cursor-pointer"
            />
          ) : null}
          {showResendButton ? (
            <Buttons
              variant={showOkayButton ? "neutral-border" : "rose"}
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label={isResending ? "Sending..." : resendLabel}
              onClick={handleResend}
              disabled={!canResend || isResending}
              className="w-full cursor-pointer"
            />
          ) : null}
          {error ? (
            <p className="text-[14px] leading-[20px] font-medium text-[var(--state-error-border)]">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </ModalLayout>
  );
}
