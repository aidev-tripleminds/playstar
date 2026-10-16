"use client";

import * as React from "react";

import { AnchoredMenuPortal } from "@/components/common/general/anchored-menu-portal";
import { Badge } from "@/components/common/general/badge/badge";
import { OPTION_LIST_SURFACE_CLASSNAME } from "@/components/common/general/option-list/option-list";
import { RadioIndicator } from "@/components/common/general/radio-indicator/radio-indicator";
import { cn } from "@/lib/utils";

import { usePromptBoxAnchoredPicker } from "../hooks/use-prompt-box-anchored-picker";
import {
  PROMPT_BOX_DEFAULT_RESOLUTION,
  PROMPT_BOX_RESOLUTION_ICON_SRC,
  PROMPT_BOX_RESOLUTION_MENU_LABEL,
  PROMPT_BOX_RESOLUTION_OPTIONS,
} from "../prompt-box.constants";
import type { PromptBoxResolutionOption } from "../prompt-box.types";
import { PromptBoxControlButton } from "./prompt-box-control-button";
import { PromptBoxPickerRadioGroup } from "./prompt-box-picker-radio-group";

export type PromptBoxResolutionPickerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options?: readonly PromptBoxResolutionOption[];
  leftIconSrc?: string;
  menuLabel?: string;
  className?: string;
};

function PromptBoxResolutionOptionRow({
  option,
  selected,
  onSelect,
}: {
  option: PromptBoxResolutionOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={option.label}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-xl p-3 text-left transition-colors",
        "hover:bg-surface-strong",
        selected ? "bg-surface-strong text-tooltip-text" : "text-divider-label",
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-sm leading-5 font-medium">{option.label}</span>
        {option.tokenCost ? (
          <Badge
            type="neutral"
            size="small"
            text={option.tokenCost}
            showIcon
            className="border-border-focus shrink-0 items-end"
          />
        ) : null}
      </span>
      {selected ? (
        <RadioIndicator checked className="shrink-0 bg-[image:var(--check-button)]" />
      ) : null}
    </button>
  );
}

function PromptBoxResolutionOptionList({
  label,
  options,
  value,
  onValueChange,
}: {
  label: string;
  options: readonly PromptBoxResolutionOption[];
  value: string;
  onValueChange: React.ComponentProps<typeof PromptBoxPickerRadioGroup>["onValueChange"];
}) {
  return (
    <div data-slot="prompt-box-resolution-options" className="flex w-full flex-col gap-0.5">
      <PromptBoxPickerRadioGroup
        label={label}
        values={options.map((option) => option.value)}
        value={value}
        onValueChange={onValueChange}
      >
        {options.map((option) => (
          <PromptBoxResolutionOptionRow
            key={option.value}
            option={option}
            selected={value === option.value}
            onSelect={() => onValueChange(option.value)}
          />
        ))}
      </PromptBoxPickerRadioGroup>
    </div>
  );
}

export function PromptBoxResolutionPicker({
  open,
  onOpenChange,
  value,
  defaultValue = PROMPT_BOX_DEFAULT_RESOLUTION,
  onValueChange,
  options = PROMPT_BOX_RESOLUTION_OPTIONS,
  leftIconSrc = PROMPT_BOX_RESOLUTION_ICON_SRC,
  menuLabel = PROMPT_BOX_RESOLUTION_MENU_LABEL,
  className,
}: PromptBoxResolutionPickerProps) {
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
  const selectedOption = options.find((option) => option.value === resolvedValue) ??
    options[0] ?? {
      value: resolvedValue,
      label: resolvedValue,
    };

  return (
    <div
      ref={containerRef}
      data-slot="prompt-box-resolution-picker"
      className={cn("relative shrink-0", className)}
    >
      <PromptBoxControlButton
        label={selectedOption.label}
        leftIconSrc={leftIconSrc}
        menuLabel={menuLabel}
        value={selectedOption.value}
        defaultValue={selectedOption.value}
        options={options.map(({ value: optionValue, label }) => ({
          value: optionValue,
          label,
        }))}
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
        slot="prompt-box-resolution-dropdown"
      >
        <section
          className={cn(
            OPTION_LIST_SURFACE_CLASSNAME,
            "w-[min(calc(100vw-1.5rem),250px)] shadow-[0px_6px_20px_rgba(0,0,0,0.35)]",
          )}
        >
          <PromptBoxResolutionOptionList
            label={menuLabel}
            options={options}
            value={resolvedValue}
            onValueChange={commitValue}
          />
        </section>
      </AnchoredMenuPortal>
    </div>
  );
}
