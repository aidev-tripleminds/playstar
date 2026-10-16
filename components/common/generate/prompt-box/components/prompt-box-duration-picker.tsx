"use client";

import * as React from "react";

import { AnchoredMenuPortal } from "@/components/common/general/anchored-menu-portal";
import { OPTION_LIST_SURFACE_CLASSNAME } from "@/components/common/general/option-list/option-list";
import { Slider } from "@/components/common/general/slider/slider";
import { cn } from "@/lib/utils";

import { usePromptBoxAnchoredPicker } from "../hooks/use-prompt-box-anchored-picker";
import {
  formatPromptBoxDuration,
  parsePromptBoxDurationSeconds,
  PROMPT_BOX_DEFAULT_DURATION,
  PROMPT_BOX_DURATION_ICON_SRC,
  PROMPT_BOX_DURATION_MAX_SECONDS,
  PROMPT_BOX_DURATION_MENU_LABEL,
  PROMPT_BOX_DURATION_MIN_SECONDS,
} from "../prompt-box.constants";
import { PromptBoxControlButton } from "./prompt-box-control-button";

export type PromptBoxDurationPickerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  leftIconSrc?: string;
  menuLabel?: string;
  className?: string;
};

function PromptBoxDurationSlider({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const seconds = parsePromptBoxDurationSeconds(value);
  const valueLabel = formatPromptBoxDuration(seconds);

  return (
    <div
      data-slot="prompt-box-duration-slider"
      className="flex w-full flex-col items-center px-3 pt-2 pb-3"
    >
      <div className="text-tooltip-text flex w-full items-center justify-between pb-3 text-[14px] leading-5 font-medium">
        <span>{PROMPT_BOX_DURATION_MENU_LABEL}</span>
        <span>{valueLabel}</span>
      </div>
      <Slider
        min={PROMPT_BOX_DURATION_MIN_SECONDS}
        max={PROMPT_BOX_DURATION_MAX_SECONDS}
        step={1}
        value={seconds}
        onValueChange={(nextSeconds) => onValueChange(formatPromptBoxDuration(nextSeconds))}
        minLabel={`${PROMPT_BOX_DURATION_MIN_SECONDS}s`}
        maxLabel={`${PROMPT_BOX_DURATION_MAX_SECONDS}s`}
        minLabelSuffix=""
        showSliderValue={false}
        formatValueLabel={formatPromptBoxDuration}
        aria-label={PROMPT_BOX_DURATION_MENU_LABEL}
        className="flex-col-reverse gap-2 px-0 pt-0 pb-0"
      />
    </div>
  );
}

export function PromptBoxDurationPicker({
  open,
  onOpenChange,
  value,
  defaultValue = PROMPT_BOX_DEFAULT_DURATION,
  onValueChange,
  leftIconSrc = PROMPT_BOX_DURATION_ICON_SRC,
  menuLabel = PROMPT_BOX_DURATION_MENU_LABEL,
  className,
}: PromptBoxDurationPickerProps) {
  const {
    containerRef,
    menuRef,
    resolvedOpen,
    resolvedValue,
    isMenuOpen,
    commitValue,
    toggleOpen,
  } = usePromptBoxAnchoredPicker({
    open,
    onOpenChange,
    value,
    defaultValue,
    onValueChange,
    menuOnly: true,
  });
  const maxDurationLabel = formatPromptBoxDuration(PROMPT_BOX_DURATION_MAX_SECONDS);

  return (
    <div
      ref={containerRef}
      data-slot="prompt-box-duration-picker"
      className={cn("relative shrink-0", className)}
    >
      <PromptBoxControlButton
        label={resolvedValue}
        leftIconSrc={leftIconSrc}
        menuLabel={menuLabel}
        defaultValue={resolvedValue}
        options={[
          { value: resolvedValue, label: resolvedValue },
          { value: maxDurationLabel, label: maxDurationLabel },
        ]}
        disableMenu
        showOptionIcons={false}
        showTooltip={!resolvedOpen}
        onTriggerClick={toggleOpen}
        className={resolvedOpen ? "bg-surface-strong border-tooltip-left-bg!" : undefined}
      />

      <AnchoredMenuPortal
        open={isMenuOpen}
        anchorRef={containerRef}
        menuRef={menuRef}
        slot="prompt-box-duration-dropdown"
      >
        <section
          className={cn(
            OPTION_LIST_SURFACE_CLASSNAME,
            "w-[min(calc(100vw-1.5rem),320px)] shadow-[0px_6px_20px_rgba(0,0,0,0.35)]",
          )}
        >
          <PromptBoxDurationSlider
            value={resolvedValue}
            onValueChange={(nextValue) => commitValue(nextValue, { close: false })}
          />
        </section>
      </AnchoredMenuPortal>
    </div>
  );
}
