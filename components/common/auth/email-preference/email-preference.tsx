"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { Toggle } from "@/components/common/general/toggle/toggle";
import { cn } from "@/lib/utils";

import {
  EMAIL_PREFERENCE_ALLOW_LABEL,
  EMAIL_PREFERENCE_CLOSE_LABEL,
  EMAIL_PREFERENCE_DEFAULT_VALUES,
  EMAIL_PREFERENCE_DESCRIPTION,
  EMAIL_PREFERENCE_LATER_LABEL,
  EMAIL_PREFERENCE_OPTIONS,
  EMAIL_PREFERENCE_SAVE_LABEL,
  EMAIL_PREFERENCE_TITLE,
  EMAIL_PREFERENCE_TITLE_ICON_SRC,
  emailPreferenceCountLabel,
  type EmailPreferenceOptionId,
  type EmailPreferenceValues,
  selectedEmailPreferenceCount,
} from "./email-preference.constants";

export type EmailPreferenceSavePayload = EmailPreferenceValues;

export type EmailPreferenceProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  titleIconSrc?: string;
  description?: string;
  saveLabel?: string;
  laterLabel?: string;
  /**
   * Starting toggle values. Defaults to both categories on ("2 of 2 selected")
   * — Figma 21592:147406. Pass all-false for the master-off / dimmed children
   * state (Figma 21867:139596).
   */
  defaultValues?: EmailPreferenceValues;
  /**
   * Persist the chosen categories. Resolve to an error message to show
   * inline, or null on success — the popup only closes on null.
   */
  onSave?: (data: EmailPreferenceSavePayload) => Promise<string | null> | void;
  /** Persist non-consent for Later or any other dismissal. */
  onLater?: () => Promise<string | null> | void;
  onClose?: () => void;
  className?: string;
};

function allEmailPreferenceValues(enabled: boolean): EmailPreferenceValues {
  return { marketing: enabled, product: enabled };
}

export function EmailPreference({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = EMAIL_PREFERENCE_TITLE,
  titleIconSrc = EMAIL_PREFERENCE_TITLE_ICON_SRC,
  description = EMAIL_PREFERENCE_DESCRIPTION,
  saveLabel = EMAIL_PREFERENCE_SAVE_LABEL,
  laterLabel = EMAIL_PREFERENCE_LATER_LABEL,
  defaultValues = EMAIL_PREFERENCE_DEFAULT_VALUES,
  onSave,
  onLater,
  onClose,
  className,
}: EmailPreferenceProps) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [values, setValues] = React.useState<EmailPreferenceValues>(defaultValues);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const submittingRef = React.useRef(false);

  const selectedCount = selectedEmailPreferenceCount(values);
  const allowEmails = selectedCount > 0;
  const optionsDisabled = !allowEmails;
  const resolvedOpen = isControlled ? Boolean(open) : uncontrolledOpen;

  const closePopup = React.useCallback(() => {
    if (!isControlled) setUncontrolledOpen(false);
    onOpenChange?.(false);
  }, [isControlled, onOpenChange]);

  const handleClose = React.useCallback(() => {
    onClose?.();
  }, [onClose]);

  const setOption = (id: EmailPreferenceOptionId, checked: boolean) => {
    if (optionsDisabled && !checked) return;
    setValues((current) => ({ ...current, [id]: checked }));
    if (error) setError(null);
  };

  const handleAllowEmailsChange = (checked: boolean) => {
    setValues(allEmailPreferenceValues(checked));
    if (error) setError(null);
  };

  const handleSave = async () => {
    if (submittingRef.current) return;

    setError(null);

    if (!onSave) {
      closePopup();
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const message = await onSave(values);
      if (message) {
        setError(message);
        return;
      }
      closePopup();
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleLater = React.useCallback(async () => {
    if (submittingRef.current) return;

    setError(null);
    if (!onLater) {
      closePopup();
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      const message = await onLater();
      if (message) {
        setError(message);
        return;
      }
      closePopup();
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [closePopup, onLater]);

  return (
    <ModalLayout
      trigger={trigger}
      open={resolvedOpen}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          if (!isControlled) setUncontrolledOpen(true);
          onOpenChange?.(true);
          return;
        }
        void handleLater();
      }}
      title={title}
      titleIconSrc={titleIconSrc}
      showIcon
      showClose
      closeLabel={EMAIL_PREFERENCE_CLOSE_LABEL}
      showMobileHandle
      onClose={handleClose}
      onHistoryBack={() => {
        void handleLater();
        return false;
      }}
      className={cn("border-surface-strong bg-dialog-bg z-71", className)}
    >
      <div className="flex flex-col gap-4">
        <p className="text-modal-text text-sm leading-5 font-normal">{description}</p>

        <div className="flex items-center">
          <div className="flex min-w-0 flex-1 flex-col justify-center pr-3">
            <p className="text-tooltip-text text-sm leading-5 font-medium">
              {EMAIL_PREFERENCE_ALLOW_LABEL}
            </p>
            <p className="text-select-muted-text text-sm leading-5 font-normal">
              {emailPreferenceCountLabel(selectedCount)}
            </p>
          </div>
          <Toggle
            checked={allowEmails}
            onCheckedChange={handleAllowEmailsChange}
            aria-label={EMAIL_PREFERENCE_ALLOW_LABEL}
          />
        </div>

        <div className="border-border-muted flex flex-col gap-4 rounded-2xl border p-4">
          {EMAIL_PREFERENCE_OPTIONS.map((option) => (
            <div
              key={option.id}
              className={cn("flex items-center", optionsDisabled && "opacity-50")}
            >
              <div className="flex min-w-0 flex-1 flex-col justify-center pr-3">
                <p className="text-tooltip-text text-sm leading-5 font-medium">{option.title}</p>
                <p className="text-select-muted-text text-sm leading-5 font-normal">
                  {option.description}
                </p>
              </div>
              <Toggle
                checked={values[option.id]}
                onCheckedChange={(checked) => setOption(option.id, checked)}
                disabled={optionsDisabled}
                aria-label={option.title}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Buttons
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={isSubmitting ? "Saving..." : saveLabel}
            disabled={isSubmitting}
            onClick={handleSave}
            className="w-full cursor-pointer"
          />
          <Buttons
            variant="neutral"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={laterLabel}
            disabled={isSubmitting}
            onClick={() => void handleLater()}
            className="w-full cursor-pointer"
          />
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
