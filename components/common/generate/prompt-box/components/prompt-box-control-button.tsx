"use client";

import * as React from "react";

import {
  ButtonSelect,
  type ButtonSelectOption,
  type ButtonSelectProps,
} from "@/components/common/general/button-select/button-select";
import { cn } from "@/lib/utils";

import type { PromptBoxControlButton } from "../prompt-box.types";

function toOptionValue(label: string) {
  return (
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "option"
  );
}

export type PromptBoxControlButtonProps = Omit<PromptBoxControlButton, "kind"> &
  Omit<ButtonSelectProps, "imgIcon" | "menuLabel"> & {
    menuLabel?: string;
    wrapperClassName?: string;
  };

export function PromptBoxControlButton({
  label,
  leftIconSrc,
  highlighted = false,
  options,
  menuLabel,
  showButtonIcon = true,
  widthMode = "content",
  dropdownVerticalDirection = "up",
  className,
  wrapperClassName,
  defaultValue,
  ...buttonSelectProps
}: PromptBoxControlButtonProps) {
  const resolvedOptions = React.useMemo<ButtonSelectOption[]>(() => {
    if (options?.length) return options;

    return [{ value: toOptionValue(label), label }];
  }, [label, options]);

  const resolvedDefaultValue = defaultValue ?? resolvedOptions[0]?.value;

  return (
    <div
      data-slot="prompt-box-control-button"
      data-highlighted={highlighted ? "true" : "false"}
      className={cn("shrink-0", wrapperClassName)}
    >
      <ButtonSelect
        showWide={false}
        options={resolvedOptions}
        defaultValue={resolvedDefaultValue}
        imgIcon={leftIconSrc ?? "/assets/circle_help.svg"}
        menuLabel={menuLabel ?? label}
        showButtonIcon={(showButtonIcon && Boolean(leftIconSrc)) || widthMode === "wider-options"}
        widthMode={widthMode}
        dropdownVerticalDirection={dropdownVerticalDirection}
        className={cn(
          "h-auto shrink-0 px-3! py-3!",
          highlighted
            ? "border-border-focus! bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_100%)]"
            : "border-surface-strong! bg-tooltip-default-bg",
          className,
        )}
        {...buttonSelectProps}
      />
    </div>
  );
}
