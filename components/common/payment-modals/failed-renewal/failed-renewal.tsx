"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  FAILED_RENEWAL_CARD_ICON_SRC,
  FAILED_RENEWAL_CLOSE_LABEL,
  FAILED_RENEWAL_DESCRIPTION,
  FAILED_RENEWAL_PRIMARY_LABEL,
  FAILED_RENEWAL_SECONDARY_LABEL,
  FAILED_RENEWAL_TITLE,
  FAILED_RENEWAL_TITLE_ICON_SRC,
  UPCOMING_CHANGE_CLOSE_LABEL,
  UPCOMING_CHANGE_DESCRIPTION,
  UPCOMING_CHANGE_PRIMARY_LABEL,
  UPCOMING_CHANGE_SECONDARY_LABEL,
  UPCOMING_CHANGE_TITLE,
  UPCOMING_CHANGE_TITLE_ICON_SRC,
} from "./failed-renewal.constants";

export type FailedRenewalStep = "failed-renewal" | "upcoming-change";

export type FailedRenewalProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Controlled step. When omitted, starts on failed-renewal and advances on update payment. */
  step?: FailedRenewalStep;
  defaultStep?: FailedRenewalStep;
  onStepChange?: (step: FailedRenewalStep) => void;
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  upcomingTitle?: string;
  upcomingDescription?: string;
  upcomingPrimaryLabel?: string;
  upcomingSecondaryLabel?: string;
  onUpdatePayment?: () => void;
  onContactSupport?: () => void;
  onContinue?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  className?: string;
};

export function FailedRenewal({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  step: stepProp,
  defaultStep = "failed-renewal",
  onStepChange,
  title = FAILED_RENEWAL_TITLE,
  description = FAILED_RENEWAL_DESCRIPTION,
  primaryLabel = FAILED_RENEWAL_PRIMARY_LABEL,
  secondaryLabel = FAILED_RENEWAL_SECONDARY_LABEL,
  upcomingTitle = UPCOMING_CHANGE_TITLE,
  upcomingDescription = UPCOMING_CHANGE_DESCRIPTION,
  upcomingPrimaryLabel = UPCOMING_CHANGE_PRIMARY_LABEL,
  upcomingSecondaryLabel = UPCOMING_CHANGE_SECONDARY_LABEL,
  onUpdatePayment,
  onContactSupport,
  onContinue,
  onCancel,
  onClose,
  className,
}: FailedRenewalProps) {
  const isOpenControlled = open !== undefined;
  const isStepControlled = stepProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const [uncontrolledStep, setUncontrolledStep] = React.useState<FailedRenewalStep>(defaultStep);

  const resolvedOpen = isOpenControlled ? Boolean(open) : uncontrolledOpen;
  const step = isStepControlled ? stepProp : uncontrolledStep;
  const isFailedStep = step === "failed-renewal";

  const setModalOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
      if (!nextOpen && !isStepControlled) {
        setUncontrolledStep("failed-renewal");
      }
    },
    [isOpenControlled, isStepControlled, onOpenChange],
  );

  const setStep = React.useCallback(
    (nextStep: FailedRenewalStep) => {
      if (!isStepControlled) {
        setUncontrolledStep(nextStep);
      }
      onStepChange?.(nextStep);
    },
    [isStepControlled, onStepChange],
  );

  const handleClose = React.useCallback(() => {
    onClose?.();
    setModalOpen(false);
  }, [onClose, setModalOpen]);

  const handleUpdatePayment = React.useCallback(() => {
    onUpdatePayment?.();
    setStep("upcoming-change");
  }, [onUpdatePayment, setStep]);

  const handleContactSupport = React.useCallback(() => {
    onContactSupport?.();
  }, [onContactSupport]);

  const handleContinue = React.useCallback(() => {
    onContinue?.();
    setModalOpen(false);
  }, [onContinue, setModalOpen]);

  const handleCancel = React.useCallback(() => {
    onCancel?.();
    setModalOpen(false);
  }, [onCancel, setModalOpen]);

  const bodyDescription = isFailedStep ? description : upcomingDescription;
  const bodyPrimaryLabel = isFailedStep ? primaryLabel : upcomingPrimaryLabel;
  const bodySecondaryLabel = isFailedStep ? secondaryLabel : upcomingSecondaryLabel;

  return (
    <ModalLayout
      trigger={trigger}
      open={resolvedOpen}
      onOpenChange={setModalOpen}
      title={isFailedStep ? title : upcomingTitle}
      titleIconSrc={isFailedStep ? FAILED_RENEWAL_TITLE_ICON_SRC : UPCOMING_CHANGE_TITLE_ICON_SRC}
      showIcon
      showMobileHandle
      closeLabel={isFailedStep ? FAILED_RENEWAL_CLOSE_LABEL : UPCOMING_CHANGE_CLOSE_LABEL}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      description={bodyDescription}
      className={cn("border-surface-strong bg-dialog-bg z-71", className)}
    >
      <div className="flex flex-col gap-4">
        <DialogDescription className="text-modal-text text-left text-[14px]! leading-5 font-normal">
          {bodyDescription}
        </DialogDescription>

        <div className="flex flex-col gap-2">
          <Buttons
            type="button"
            variant="rose"
            size="btn-m"
            leftIcon={isFailedStep}
            rightIcon={false}
            leftIconSrc={isFailedStep ? FAILED_RENEWAL_CARD_ICON_SRC : undefined}
            label={bodyPrimaryLabel}
            onClick={isFailedStep ? handleUpdatePayment : handleContinue}
            className="w-full"
          />
          <Buttons
            type="button"
            variant="neutral"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={bodySecondaryLabel}
            onClick={isFailedStep ? handleContactSupport : handleCancel}
            className="w-full"
          />
        </div>
      </div>
    </ModalLayout>
  );
}
