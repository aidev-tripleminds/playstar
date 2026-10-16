"use client";

import * as React from "react";

import { useAuthGate } from "@/components/common/auth/auth-gate";
import { Alert } from "@/components/common/general/alert/alert";
import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { useInvalidateMe } from "@/hooks/use-me";
import { GoCamVerificationError, redirectAgeWithGoCam } from "@/lib/age-verification/go-cam";
import { apiFetch } from "@/lib/api/client";
import type { MeResponse } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export const VERIFY_AGE_MIN_AGE = 18;
export const VERIFY_AGE_ERROR_MESSAGE = "Age verification failed, please try again.";

export type VerifyAgeProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  titleIconSrc?: string;
  description?: string;
  alertText?: string;
  disclaimer?: React.ReactNode;
  ctaLabel?: string;
  /** User age to check against `minAge`. When below `minAge`, verification fails. */
  age?: number;
  minAge?: number;
  errorMessage?: string;
  /**
   * Called when the user clicks verify.
   * An explicit `true` reports UI success; any other result shows failure.
   * Without an override, redirects to Go.cam.
   */
  onVerify?: () => boolean | void | Promise<boolean | void>;
  /** Called after this attempt is confirmed by the backend; does not grant content access. */
  onVerified?: () => void;
  onClose?: () => void;
  className?: string;
};

export function VerifyAge({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = "Age verification required (18+)",
  titleIconSrc = "/assets/id-card.svg",
  description = "In accordance with the latest regulations, we are required to verify that all users are 18 years or older to access NSFW content.",
  alertText = "Age verification is handled by Go.cam, an independent provider.",
  disclaimer = (
    <>
      Review{" "}
      <a
        href="https://go.cam/privacy/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand-primary underline"
      >
        Go.cam’s privacy policy
      </a>{" "}
      before continuing.
    </>
  ),
  ctaLabel = "Verify on Go.cam",
  age,
  minAge = VERIFY_AGE_MIN_AGE,
  errorMessage = VERIFY_AGE_ERROR_MESSAGE,
  onVerify,
  onVerified,
  onClose,
  className,
}: VerifyAgeProps) {
  const invalidateMe = useInvalidateMe();
  const { isLoggedIn, isSessionPending, requireAuth } = useAuthGate();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const [repeatMode, setRepeatMode] = React.useState<"redirect" | null>(null);
  const operation = React.useRef<AbortController | null>(null);
  const isOpen = open ?? internalOpen;

  React.useEffect(() => () => operation.current?.abort(), []);
  React.useEffect(() => {
    if (!isOpen || !isLoggedIn) operation.current?.abort();
  }, [isOpen, isLoggedIn]);

  const [error, setError] = React.useState("");
  const [isVerifying, setIsVerifying] = React.useState(false);

  const resetVerificationState = React.useCallback(() => {
    operation.current?.abort();
    operation.current = null;
    setRepeatMode(null);
    setError("");
    setIsVerifying(false);
  }, []);

  const handleClose = React.useCallback(() => {
    resetVerificationState();
    setInternalOpen(false);
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange, resetVerificationState]);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        resetVerificationState();
      }
      setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, resetVerificationState],
  );

  const handleVerify = async (repeatConfirmed = false) => {
    if (operation.current || isSessionPending) return;
    if (!isLoggedIn) {
      handleOpenChange(false);
      requireAuth({ onSuccess: () => handleOpenChange(true) });
      return;
    }
    const controller = new AbortController();
    operation.current = controller;
    setError("");
    setIsVerifying(true);

    try {
      if (age !== undefined && age < minAge) {
        setError(errorMessage);
        return;
      }
      if (!onVerify && !repeatConfirmed) {
        const me = await apiFetch<MeResponse>("/api/v1/me", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (controller.signal.aborted) return;
        if (me.age_verified) {
          setRepeatMode("redirect");
          return;
        }
      }
      setRepeatMode(null);
      const result = onVerify
        ? (await onVerify()) === true
          ? "verified"
          : "failed"
        : await redirectAgeWithGoCam(controller.signal);
      if (controller.signal.aborted) return;
      if (result === "cancelled" || result === "redirecting") return;
      if (result !== "verified") {
        setError(errorMessage);
        return;
      }
      await invalidateMe();
      if (controller.signal.aborted) return;
      onVerified?.();
      handleOpenChange(false);
    } catch (error) {
      if (!controller.signal.aborted) {
        setError(error instanceof GoCamVerificationError ? error.message : errorMessage);
      }
    } finally {
      if (operation.current === controller) {
        operation.current = null;
        setIsVerifying(false);
      }
    }
  };

  return (
    <ModalLayout
      trigger={trigger}
      open={isOpen}
      onOpenChange={handleOpenChange}
      title={repeatMode ? "Verify again (TEST)" : title}
      titleIconSrc={titleIconSrc}
      showIcon
      showMobileHandle
      closeLabel="Close"
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      className={cn("border-surface-strong bg-dialog-bg z-71 md:max-w-[475px]", className)}
    >
      {repeatMode ? (
        <div className="flex flex-col gap-4">
          <p>Already verified, are you sure you want to verify again (TEST)?</p>
          <Buttons
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label="Yes"
            disabled={isVerifying || isSessionPending}
            onClick={() => handleVerify(true)}
          />
          <Buttons
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label="No"
            disabled={isVerifying}
            onClick={() => {
              setRepeatMode(null);
              handleOpenChange(false);
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4 text-center">
          <p className="text-modal-text text-sm leading-5 font-normal">{description}</p>

          <Alert showIcon={false} text={alertText} className="[&_p]:w-full [&_p]:text-center" />

          <p className="text-modal-text text-sm leading-5 font-normal">{disclaimer}</p>

          <Buttons
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={isLoggedIn ? ctaLabel : "Sign in to verify age"}
            onClick={() => handleVerify()}
            disabled={isVerifying || isSessionPending}
            className="w-full cursor-pointer"
          />

          {error ? (
            <p className="h-5 text-center text-[14px] leading-5 font-medium text-[var(--state-error-border)]">
              {error}
            </p>
          ) : null}
        </div>
      )}
    </ModalLayout>
  );
}
