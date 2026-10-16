"use client";

import * as React from "react";

import { CheckpointSelector } from "@/components/common/generate/checkpoint-selector";
import { cn } from "@/lib/utils";

import { usePromptBoxAnchoredPicker } from "../hooks/use-prompt-box-anchored-picker";
import {
  getPromptBoxCheckpointDropdownTitle,
  getPromptBoxCheckpointModalTitle,
  getPromptBoxCheckpointTriggerLabel,
  PROMPT_BOX_CHECKPOINT_DEFAULT_VALUE,
  PROMPT_BOX_CHECKPOINT_ICON_SRC,
  PROMPT_BOX_CHECKPOINT_OPTIONS,
  PROMPT_BOX_DEFAULT_CHECKPOINT_LABEL,
} from "../prompt-box.constants";
import type { PromptBoxCheckpointOption, PromptBoxMedia } from "../prompt-box.types";
import { PromptBoxAnchoredPicker } from "./prompt-box-anchored-picker";
import { PromptBoxControlButton } from "./prompt-box-control-button";
import { PromptBoxPickerRadioGroup } from "./prompt-box-picker-radio-group";

export type PromptBoxCheckpointPickerProps = {
  media?: PromptBoxMedia;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  iconSrc?: string;
  options?: readonly PromptBoxCheckpointOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  dropdownTitle?: string;
  modalTitle?: string;
  className?: string;
};

function PromptBoxCheckpointOptionList({
  title,
  showTitle,
  options,
  value,
  onValueChange,
  scrollList = false,
}: {
  title: string;
  showTitle: boolean;
  options: readonly PromptBoxCheckpointOption[];
  value: string;
  onValueChange: React.ComponentProps<typeof PromptBoxPickerRadioGroup>["onValueChange"];
  scrollList?: boolean;
}) {
  return (
    <div
      data-slot="prompt-box-checkpoint-options"
      className="flex min-h-0 w-full flex-1 flex-col gap-0.5 overflow-hidden"
    >
      {showTitle ? (
        <p className="text-gray-text shrink-0 px-3 py-1.5 text-sm leading-5 font-normal">{title}</p>
      ) : null}
      <div
        data-slot="prompt-box-checkpoint-options-scroll"
        className={cn(
          "min-h-0",
          scrollList && "custom-scrollbar flex-1 overflow-y-auto overscroll-contain",
        )}
      >
        <PromptBoxPickerRadioGroup
          label={title}
          values={options.map((option) => option.value)}
          value={value}
          onValueChange={onValueChange}
        >
          {options.map((option) => {
            const isSelected = value === option.value;

            return (
              <CheckpointSelector
                key={option.value}
                role="radio"
                aria-checked={isSelected}
                aria-pressed={undefined}
                tabIndex={isSelected ? 0 : -1}
                name={option.label}
                description={option.description}
                tokenCost={option.tokenCost}
                checkpointVariant={option.checkpointVariant}
                selected={isSelected}
                showPremiumBadge={option.premium === true}
                showUnlimitedBadge={option.showUnlimitedBadge}
                onSelectedChange={() => {
                  onValueChange(option.value);
                }}
                className="w-full max-w-none"
              />
            );
          })}
        </PromptBoxPickerRadioGroup>
      </div>
    </div>
  );
}

export function PromptBoxCheckpointPicker({
  media = "image-presets",
  open,
  onOpenChange,
  label = PROMPT_BOX_DEFAULT_CHECKPOINT_LABEL,
  iconSrc = PROMPT_BOX_CHECKPOINT_ICON_SRC,
  options = PROMPT_BOX_CHECKPOINT_OPTIONS,
  value,
  defaultValue = PROMPT_BOX_CHECKPOINT_DEFAULT_VALUE,
  onValueChange,
  dropdownTitle,
  modalTitle,
  className,
}: PromptBoxCheckpointPickerProps) {
  const picker = usePromptBoxAnchoredPicker({
    open,
    onOpenChange,
    value,
    defaultValue: defaultValue || options[0]?.value || PROMPT_BOX_CHECKPOINT_DEFAULT_VALUE,
    onValueChange,
  });
  const selectedOption =
    options.find((option) => option.value === picker.resolvedValue) ?? options[0];
  const triggerLabel = getPromptBoxCheckpointTriggerLabel(picker.resolvedValue, options, label);
  const resolvedDropdownTitle = dropdownTitle ?? getPromptBoxCheckpointDropdownTitle(media);
  const resolvedModalTitle = modalTitle ?? getPromptBoxCheckpointModalTitle(media);

  return (
    <PromptBoxAnchoredPicker
      containerRef={picker.containerRef}
      menuRef={picker.menuRef}
      isMenuOpen={picker.isMenuOpen}
      isModalOpen={picker.isModalOpen}
      onOpenChange={picker.setOpen}
      pickerSlot="prompt-box-checkpoint-picker"
      dropdownSlot="prompt-box-checkpoint-dropdown"
      modalSlot="prompt-box-checkpoint-modal"
      dropdownClassName="w-[min(calc(100vw-1.5rem),358px)] shadow-[0px_6px_20px_rgba(0,0,0,0.35)]"
      horizontalAlign="right"
      modalTitle={resolvedModalTitle}
      modalIconSrc={iconSrc}
      modalDescription="Choose an AI model for generation."
      className={className}
      trigger={
        <PromptBoxControlButton
          label={triggerLabel}
          leftIconSrc={iconSrc}
          highlighted
          menuLabel={triggerLabel}
          defaultValue={selectedOption?.value ?? "checkpoint"}
          options={[{ value: selectedOption?.value ?? "checkpoint", label: triggerLabel }]}
          disableMenu
          showTooltip={!picker.resolvedOpen}
          onTriggerClick={picker.toggleOpen}
          className={picker.resolvedOpen ? "bg-surface-strong border-tooltip-left-bg!" : undefined}
        />
      }
      dropdown={
        <PromptBoxCheckpointOptionList
          title={resolvedDropdownTitle}
          showTitle
          scrollList
          options={options}
          value={picker.resolvedValue}
          onValueChange={picker.commitValue}
        />
      }
      modal={
        <PromptBoxCheckpointOptionList
          title={resolvedModalTitle}
          showTitle={false}
          options={options}
          value={picker.resolvedValue}
          onValueChange={picker.commitValue}
        />
      }
    />
  );
}
