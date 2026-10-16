"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { TextInput } from "@/components/common/general/text-input/text-input";
import { cn } from "@/lib/utils";
import { isValidEmail } from "@/lib/validation/email";

import { InstructionsSent } from "../instructions-sent/instructions-sent";

const MAX_INVALID_ATTEMPTS = 3;

export type ResetPasswordProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  titleIconSrc?: string;
  description?: string;
  /**
   * Request the reset email for real. Resolve to an error message to show
   * inline, or null on success (the modal then hands off to "instructions
   * sent"). The backend answers identically for unknown addresses, so a
   * success here says nothing about whether the account exists.
   */
  onSendResetLink?: (email: string) => Promise<string | null> | void;
  onGoBack?: () => void;
  onClose?: () => void;
  className?: string;
};

export function ResetPassword({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = "Reset your password",
  titleIconSrc = "/assets/password-check.svg",
  description = "Enter your email and we'll send you instructions to reset your password.",
  onSendResetLink,
  onGoBack,
  onClose,
  className,
}: ResetPasswordProps) {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [invalidAttempts, setInvalidAttempts] = React.useState(0);
  const [instructionsSentOpen, setInstructionsSentOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isBlocked = invalidAttempts >= MAX_INVALID_ATTEMPTS;

  /**
   * Bumped on every dismissal. A submit captures the current value and drops
   * its result if the number moved while the request was in flight — otherwise
   * a slow reset request that resolves after the user closed the dialog would
   * pop "Instructions have been sent" back over whatever they moved on to.
   */
  const dismissGenerationRef = React.useRef(0);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        dismissGenerationRef.current += 1;
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  const handleClose = React.useCallback(() => {
    onClose?.();
    handleOpenChange(false);
  }, [handleOpenChange, onClose]);

  const handleSendResetLink = async () => {
    if (isBlocked) {
      setError("Too many invalid attempts. Please try again later.");
      return;
    }

    setError("");

    if (!email.trim() || !isValidEmail(email)) {
      const nextAttempts = invalidAttempts + 1;
      setInvalidAttempts(nextAttempts);

      if (nextAttempts >= MAX_INVALID_ATTEMPTS) {
        setError("Too many invalid attempts. Please try again later.");
      } else {
        setError("Please enter a valid email address.");
      }
      return;
    }

    setInvalidAttempts(0);

    const generation = dismissGenerationRef.current;
    setIsSubmitting(true);
    try {
      const errorMessage = await onSendResetLink?.(email.trim());
      // Dismissed while the request was in flight — the user is somewhere else
      // now, so neither the error nor the handoff belongs on their screen.
      if (generation !== dismissGenerationRef.current) return;

      if (errorMessage) {
        setError(errorMessage);
        return;
      }
    } catch {
      if (generation !== dismissGenerationRef.current) return;
      // A rejection (network down, unexpected 5xx) must still say something —
      // otherwise the button flips back and the modal sits there silent.
      setError("Error, please contact support");
      return;
    } finally {
      setIsSubmitting(false);
    }

    handleOpenChange(false);
    setInstructionsSentOpen(true);
  };

  return (
    <>
      <ModalLayout
        trigger={trigger}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
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
          <div className="flex flex-col gap-1">
            <TextInput
              type="email"
              value={email}
              status={error ? "error" : "default"}
              leftIconSrc="/assets/message-icon.svg"
              placeholder="you@email.com"
              className="w-full"
              disabled={isBlocked}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error && !isBlocked) setError("");
              }}
            />

            {error ? (
              <p className="text-[14px] leading-[20px] font-medium text-[var(--state-error-border)]">
                {error}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Buttons
              variant="rose"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label={isSubmitting ? "Sending..." : "Send reset link"}
              onClick={handleSendResetLink}
              disabled={isBlocked || isSubmitting}
              className="w-full cursor-pointer"
            />
            <Buttons
              variant="neutral"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label="Go back"
              onClick={onGoBack}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </ModalLayout>

      <InstructionsSent
        open={instructionsSentOpen}
        onOpenChange={setInstructionsSentOpen}
        showResendButton={false}
        showOkayButton
      />
    </>
  );
}
