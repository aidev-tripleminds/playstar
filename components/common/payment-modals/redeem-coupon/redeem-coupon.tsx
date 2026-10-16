"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { TextInput } from "@/components/common/general/text-input/text-input";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon, DiscordIcon, TicketIcon } from "@/public/assets/icons";

import {
  REDEEM_COUPON_CLOSE_LABEL,
  REDEEM_COUPON_DISCORD_LABEL,
  REDEEM_COUPON_ERROR_MESSAGE,
  REDEEM_COUPON_INPUT_LABEL,
  REDEEM_COUPON_PLACEHOLDER,
  REDEEM_COUPON_SUBMIT_LABEL,
  REDEEM_COUPON_SUCCESS_MESSAGE,
  REDEEM_COUPON_TITLE,
} from "./redeem-coupon.constants";

export type RedeemCouponFeedback = "error" | "success";

export type RedeemCouponProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  placeholder?: string;
  submitLabel?: string;
  discordLabel?: string;
  errorMessage?: string;
  successMessage?: string;
  /**
   * Initial inline feedback when the modal mounts (Storybook / demos).
   * Cleared when the user edits the coupon or submits again.
   */
  initialFeedback?: RedeemCouponFeedback | null;
  /** Coupon value when controlled from the parent. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Called when Redeem now is pressed. Resolve to an error message to show
   * inline, or null/void on success (shows the success helper; modal stays open).
   */
  onRedeem?: (code: string) => Promise<string | null> | string | null | void;
  onDiscordClick?: () => void;
  /** Opens in a new tab when provided (in addition to `onDiscordClick`). */
  discordHref?: string;
  onClose?: () => void;
  className?: string;
};

export function RedeemCoupon({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = REDEEM_COUPON_TITLE,
  placeholder = REDEEM_COUPON_PLACEHOLDER,
  submitLabel = REDEEM_COUPON_SUBMIT_LABEL,
  discordLabel = REDEEM_COUPON_DISCORD_LABEL,
  errorMessage = REDEEM_COUPON_ERROR_MESSAGE,
  successMessage = REDEEM_COUPON_SUCCESS_MESSAGE,
  initialFeedback = null,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onRedeem,
  onDiscordClick,
  discordHref,
  onClose,
  className,
}: RedeemCouponProps) {
  const isControlled = open !== undefined;
  const isValueControlled = valueProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [feedback, setFeedback] = React.useState<RedeemCouponFeedback | null>(
    initialFeedback ?? null,
  );
  const [feedbackText, setFeedbackText] = React.useState(() => {
    if (initialFeedback === "success") return successMessage;
    if (initialFeedback === "error") return errorMessage;
    return "";
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resolvedOpen = isControlled ? Boolean(open) : uncontrolledOpen;
  const coupon = isValueControlled ? valueProp : uncontrolledValue;

  const setModalOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const setCoupon = React.useCallback(
    (nextValue: string) => {
      if (!isValueControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isValueControlled, onValueChange],
  );

  const clearFeedback = React.useCallback(() => {
    setFeedback(null);
    setFeedbackText("");
  }, []);

  const handleClose = React.useCallback(() => {
    onClose?.();
    setModalOpen(false);
  }, [onClose, setModalOpen]);

  const handleRedeem = async () => {
    const code = coupon.trim();
    clearFeedback();

    if (!code) {
      setFeedback("error");
      setFeedbackText(errorMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      const apiError = await onRedeem?.(code);
      if (apiError) {
        setFeedback("error");
        setFeedbackText(apiError);
        return;
      }
    } catch {
      setFeedback("error");
      setFeedbackText(errorMessage);
      return;
    } finally {
      setIsSubmitting(false);
    }

    setFeedback("success");
    setFeedbackText(successMessage);
  };

  const handleDiscordClick = () => {
    onDiscordClick?.();
    if (discordHref) {
      window.open(discordHref, "_blank", "noopener,noreferrer");
    }
  };

  const inputStatus =
    feedback === "success" ? "success" : feedback === "error" ? "error" : "default";

  return (
    <ModalLayout
      trigger={trigger}
      open={resolvedOpen}
      onOpenChange={setModalOpen}
      title={title}
      titleIcon={<TicketIcon className="text-select-text size-5" aria-hidden />}
      showIcon
      showMobileHandle
      closeLabel={REDEEM_COUPON_CLOSE_LABEL}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      className={cn("border-surface-strong bg-dialog-bg z-71", className)}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <TextInput
            showLeftIcon={false}
            placeholder={placeholder}
            value={coupon}
            status={inputStatus}
            aria-label={REDEEM_COUPON_INPUT_LABEL}
            className="w-full max-w-none"
            wrapperClassName="w-full"
            onChange={(event) => {
              setCoupon(event.target.value);
              if (feedback) clearFeedback();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleRedeem();
              }
            }}
          />
          {feedback && feedbackText ? (
            <p
              className={cn(
                "text-left text-xs leading-3 font-normal",
                feedback === "success" ? "text-feedback-success" : "text-feedback-error",
              )}
            >
              {feedbackText}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Buttons
            type="button"
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={isSubmitting ? "Redeeming..." : submitLabel}
            disabled={isSubmitting}
            onClick={() => void handleRedeem()}
            className="w-full"
          />
          <Buttons
            type="button"
            variant="neutral"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            leftIconNode={<DiscordIcon className="size-5" aria-hidden />}
            rightIconNode={<ArrowUpRightIcon className="size-5" aria-hidden />}
            label={discordLabel}
            onClick={handleDiscordClick}
            className="w-full justify-between font-normal"
          />
        </div>
      </div>
    </ModalLayout>
  );
}
