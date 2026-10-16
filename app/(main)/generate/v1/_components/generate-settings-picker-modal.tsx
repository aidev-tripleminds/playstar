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

import { GENERATE_MOBILE_DRAWER_496_CLASS } from "../_lib/constants";

export type GenerateSettingsPickerOption = {
  value: string;
  label: string;
  leftIcon?: React.ReactNode;
  leftIconSrc?: string;
  badge?: React.ReactNode;
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
  /** When false, selecting an option updates the value without dismissing the picker. */
  closeOnSelect?: boolean;
  /** Render the picker in-place instead of a nested modal. */
  inline?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  /** Desktop group caption above the list. Empty string hides it. Defaults to "Image model". */
  groupLabel?: string;
  className?: string;
  /** Classes for the scrollable option list. Defaults to filling remaining modal height. */
  listClassName?: string;
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
  closeOnSelect = true,
  inline = false,
  header,
  footer,
  children,
  groupLabel = "Image model",
  className,
  listClassName,
}: GenerateSettingsPickerModalProps) {
  const selectedValue = value ?? options[0]?.value ?? "";

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      onValueChange?.(nextValue);
      if (closeOnSelect) {
        onOpenChange?.(false);
      }
    },
    [closeOnSelect, onOpenChange, onValueChange],
  );

  const pickerBody = (
    <div
      data-slot={inline ? "generate-settings-picker-inline" : "generate-settings-picker-modal"}
      className={cn(
        "flex w-full flex-col overflow-hidden",
        inline ? "min-h-0 flex-1" : "scrollbar-hidden min-h-0 flex-1",
        inline ? className : undefined,
      )}
    >
      {inline ? (
        <p className="sr-only">{description}</p>
      ) : (
        <DialogDescription className="sr-only">{description}</DialogDescription>
      )}
      {groupLabel ? (
        <p className="text-gray-text hidden px-4 py-1 text-[14px] md:block">{groupLabel}</p>
      ) : null}
      {header ? <div className="shrink-0 pb-4">{header}</div> : null}

      <div
        data-slot="generate-settings-picker-scroll"
        className={cn(
          "custom-scrollbar overflow-y-auto overscroll-contain",
          listClassName ?? "min-h-0 flex-1",
        )}
      >
        {children ?? (
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
                showLeftIcon={Boolean(option.leftIcon || option.leftIconSrc)}
                leftIcon={option.leftIcon}
                leftIconSrc={option.leftIconSrc}
                badge={option.badge}
                className={cn(
                  "text-divider-label w-full rounded-xl border-0 bg-transparent p-3",
                  "has-[button[data-state=checked]]:bg-tooltip-default-bg has-[button[data-state=checked]]:text-select-text",
                )}
              />
            ))}
          </RadioButtonGroup>
        )}
      </div>

      {footer}
    </div>
  );

  if (inline) {
    if (!open) {
      return null;
    }

    return pickerBody;
  }

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
        GENERATE_MOBILE_DRAWER_496_CLASS,
        className,
      )}
      innerClassName="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden scrollbar-hidden"
    >
      {pickerBody}
    </ModalLayout>
  );
}
