"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { Checkbox } from "@/components/common/general/checkbox/checkbox";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { cn } from "@/lib/utils";

import {
  HEAR_ABOUT_US_CLOSE_LABEL,
  HEAR_ABOUT_US_SKIP_LABEL,
  HEAR_ABOUT_US_SUBMIT_ERROR,
  HEAR_ABOUT_US_SUBMIT_LABEL,
  HEAR_ABOUT_US_TITLE_ICON_SRC,
} from "./hear-about-us.constants";

export type HearAboutUsOption = { code: string; label: string };

export type HearAboutUsProps = {
  title: string;
  options: readonly HearAboutUsOption[];
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  submitLabel?: string;
  skipLabel?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void | Promise<void>;
  onSkip?: () => void;
  onClose?: () => void;
  className?: string;
};

export function HearAboutUs({
  title,
  options,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  submitLabel = HEAR_ABOUT_US_SUBMIT_LABEL,
  skipLabel = HEAR_ABOUT_US_SKIP_LABEL,
  value: valueProp,
  defaultValue = options[0]?.code ?? "",
  onValueChange,
  onSubmit,
  onSkip,
  onClose,
  className,
}: HearAboutUsProps) {
  const isOpenControlled = open !== undefined;
  const isValueControlled = valueProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const resolvedOpen = isOpenControlled ? Boolean(open) : uncontrolledOpen;
  const selected = isValueControlled ? valueProp : uncontrolledValue;

  const setModalOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange],
  );

  const setSelected = React.useCallback(
    (nextValue: string) => {
      if (!isValueControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isValueControlled, onValueChange],
  );

  const handleClose = React.useCallback(() => {
    onClose?.();
    setModalOpen(false);
  }, [onClose, setModalOpen]);

  const handleSubmit = React.useCallback(async () => {
    if (!selected || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit?.(selected);
      setModalOpen(false);
    } catch {
      setSubmitError(HEAR_ABOUT_US_SUBMIT_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, onSubmit, selected, setModalOpen]);

  const handleSkip = React.useCallback(() => {
    onSkip?.();
    setModalOpen(false);
  }, [onSkip, setModalOpen]);

  return (
    <ModalLayout
      trigger={trigger}
      open={resolvedOpen}
      onOpenChange={setModalOpen}
      title={title}
      titleIconSrc={HEAR_ABOUT_US_TITLE_ICON_SRC}
      showIcon
      showMobileHandle
      closeLabel={HEAR_ABOUT_US_CLOSE_LABEL}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      className={cn("border-surface-strong bg-dialog-bg z-70 md:max-w-[360px]!", className)}
    >
      <div className="flex flex-col gap-4">
        <div role="group" aria-label={title} className="flex flex-col gap-4">
          {options.map((option) => {
            const isSelected = selected === option.code;

            return (
              <label key={option.code} className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  checked={isSelected}
                  disabled={isSubmitting}
                  onCheckedChange={() => setSelected(option.code)}
                  className="rounded-full"
                />
                <span className="text-sm leading-5 font-normal text-white">{option.label}</span>
              </label>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          {submitError ? (
            <p role="alert" className="text-sm leading-5 text-red-300">
              {submitError}
            </p>
          ) : null}
          <Buttons
            type="button"
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={submitLabel}
            disabled={!selected || isSubmitting}
            onClick={handleSubmit}
            className="h-11! w-full max-w-none"
          />
          <Buttons
            type="button"
            variant="neutral"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={skipLabel}
            disabled={isSubmitting}
            onClick={handleSkip}
            className="h-11! w-full max-w-none"
          />
        </div>
      </div>
    </ModalLayout>
  );
}
