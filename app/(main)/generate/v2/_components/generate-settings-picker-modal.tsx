"use client";

import * as React from "react";

import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { MODAL_LAYOUT_OVERLAY_CLASSNAME } from "@/components/common/general/modal-layout/modal-layout.constants";
import {
  RadioButton,
  RadioButtonGroup,
} from "@/components/common/general/radio-button/radio-button";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { GENERATE_MOBILE_DRAWER_FIT_CLASS } from "../_lib/constants";

export type GenerateSettingsPickerOption = {
  value: string;
  label: string;
  leftIcon?: React.ReactNode;
  leftIconSrc?: string;
  badge?: React.ReactNode;
  disabled?: boolean;
};

export type GenerateSettingsPickerModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  titleIconSrc: string;
  closeLabel: string;
  description: string;
  value?: string;
  options?: readonly GenerateSettingsPickerOption[];
  onValueChange?: (value: string) => void;
  className?: string;
};

export function GenerateSettingsPickerModal({
  open = false,
  onOpenChange,
  title,
  titleIconSrc,
  closeLabel,
  description,
  value,
  options = [],
  onValueChange,
  className,
}: GenerateSettingsPickerModalProps) {
  const selectedValue = value ?? options[0]?.value ?? "";

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      onValueChange?.(nextValue);
      onOpenChange?.(false);
    },
    [onOpenChange, onValueChange],
  );

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      titleIconSrc={titleIconSrc}
      showIcon
      showMobileHandle
      overlayClassName={cn(MODAL_LAYOUT_OVERLAY_CLASSNAME, "z-1000")}
      closeLabel={closeLabel}
      className={cn(
        "scrollbar-hidden! z-1000 flex! max-h-[496px]! flex-col overflow-hidden",
        GENERATE_MOBILE_DRAWER_FIT_CLASS,
        className,
      )}
      innerClassName="flex min-h-0 flex-col gap-4 overflow-hidden scrollbar-hidden"
    >
      <div
        data-slot="generate-settings-picker-modal"
        className="scrollbar-hidden flex min-h-0 w-full flex-col overflow-hidden"
      >
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <div
          data-slot="generate-settings-picker-scroll"
          className="custom-scrollbar min-h-0 overflow-y-auto overscroll-contain"
        >
          <RadioButtonGroup
            value={selectedValue}
            onValueChange={handleValueChange}
            aria-label={title}
            className="w-full gap-0.5"
          >
            {options.map((option) => (
              <RadioButton
                key={option.value}
                value={option.value}
                label={option.label}
                aria-label={option.label}
                disabled={option.disabled}
                showLeftIcon={Boolean(option.leftIcon || option.leftIconSrc)}
                leftIcon={option.leftIcon}
                leftIconSrc={option.leftIconSrc}
                badge={option.badge}
                onDisabledClick={() => handleValueChange(option.value)}
                className={cn(
                  "text-divider-label w-full rounded-xl border-0 bg-transparent p-3",
                  "has-[button[data-state=checked]]:bg-tooltip-default-bg has-[button[data-state=checked]]:text-select-text",
                )}
              />
            ))}
          </RadioButtonGroup>
        </div>
      </div>
    </ModalLayout>
  );
}
