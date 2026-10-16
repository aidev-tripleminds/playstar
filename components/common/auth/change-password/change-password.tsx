"use client";

import * as React from "react";

import {
  isPasswordLongEnough,
  isPasswordShortEnough,
  PASSWORD_ERROR_MESSAGES,
  PASSWORD_RULE_LABELS,
  validatePassword,
} from "@/lib/auth/password-policy";
import { cn } from "@/lib/utils";
import { TickCircleIcon } from "@/public/assets/icons/tick-circle";

import { Buttons } from "../../general/button/buttons";
import { ModalLayout } from "../../general/modal-layout/modal-layout";
import { TextInput } from "../../general/text-input/text-input";
import { PasswordChanged } from "../password-changed/password-changed";

/**
 * Length is the whole policy — see `lib/auth/password-policy`. The checklist
 * mirrors it rather than restating any numbers of its own.
 */
const PASSWORD_RULES = [
  {
    id: "minLength",
    label: PASSWORD_RULE_LABELS.minLength,
    test: isPasswordLongEnough,
  },
  {
    id: "maxLength",
    label: PASSWORD_RULE_LABELS.maxLength,
    test: isPasswordShortEnough,
  },
] as const;

export type ChangePasswordProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  titleIconSrc?: string;
  /**
   * Persist the new password. Resolve to an error message to show inline, or
   * null on success (the modal then closes and the success dialog opens).
   * Anything thrown is reported as a generic failure.
   */
  onSave?: (password: string) => Promise<string | null> | void;
  onGoToExplore?: () => void;
  onClose?: () => void;
  className?: string;
};

export function ChangePassword({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = "Change your password",
  titleIconSrc = "/assets/password-check.svg",
  onSave,
  onGoToExplore,
  onClose,
  className,
}: ChangePasswordProps) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resolvedOpen = isControlled ? Boolean(open) : uncontrolledOpen;

  const setChangePasswordOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  // An untouched field shows no ticks at all — a green "128 characters max" on
  // an empty form would read as progress the user has not made.
  const ruleStatus = PASSWORD_RULES.map((rule) => ({
    ...rule,
    met: password.length > 0 && rule.test(password),
  }));

  const handleClose = React.useCallback(() => {
    onClose?.();
    setChangePasswordOpen(false);
  }, [onClose, setChangePasswordOpen]);

  const handleSave = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError(PASSWORD_ERROR_MESSAGES.required);
      return;
    }

    const policyError = validatePassword(password);
    if (policyError) {
      setError(policyError);
      return;
    }

    if (password !== confirmPassword) {
      setError(PASSWORD_ERROR_MESSAGES.mismatch);
      return;
    }

    setIsSubmitting(true);
    try {
      const errorMessage = await onSave?.(password);
      if (errorMessage) {
        setError(errorMessage);
        return;
      }
    } catch {
      // A rejection (network down, unexpected 5xx) must still say something —
      // otherwise the button flips back and the modal sits there silent.
      setError("Error, please contact support");
      return;
    } finally {
      setIsSubmitting(false);
    }

    setPassword("");
    setConfirmPassword("");
    setChangePasswordOpen(false);
    setSuccessOpen(true);
  };

  return (
    <>
      <ModalLayout
        trigger={trigger}
        open={resolvedOpen}
        onOpenChange={setChangePasswordOpen}
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
          <div className="flex flex-col gap-2">
            <label className="text-select-text text-sm leading-5 font-medium">New Password</label>
            <TextInput
              type="password"
              value={password}
              showLeftIcon={false}
              status={error ? "error" : "default"}
              placeholder="Enter new password"
              className="w-full"
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            {ruleStatus.map((rule) => (
              <div key={rule.id} className="flex items-start gap-1.5">
                <TickCircleIcon
                  className={cn(
                    "size-4 shrink-0",
                    rule.met ? "text-[var(--state-success-border)]" : "text-[#525252]",
                  )}
                />
                <span
                  className={cn(
                    "text-xs leading-4 font-normal",
                    rule.met ? "text-select-text" : "text-select-muted-text",
                  )}
                >
                  {rule.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-select-text text-sm leading-5 font-medium">
              Confirm password
            </label>
            <div className="flex flex-col gap-1">
              <TextInput
                type="password"
                value={confirmPassword}
                showLeftIcon={false}
                status={error ? "error" : "default"}
                placeholder="Confirm new password"
                className="w-full"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
              />
              {error ? (
                <p className="text-[14px] leading-[20px] font-medium text-[var(--state-error-border)]">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <Buttons
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={isSubmitting ? "Saving..." : "Save password"}
            disabled={isSubmitting}
            onClick={handleSave}
            className="w-full cursor-pointer"
          />
        </div>
      </ModalLayout>

      <PasswordChanged
        open={successOpen}
        onOpenChange={setSuccessOpen}
        onGoToExplore={onGoToExplore}
      />
    </>
  );
}
