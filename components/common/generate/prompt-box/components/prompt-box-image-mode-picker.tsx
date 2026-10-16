"use client";

import Image from "next/image";
import * as React from "react";

import { RadioIndicator } from "@/components/common/general/radio-indicator/radio-indicator";
import { cn } from "@/lib/utils";

import { usePromptBoxAnchoredPicker } from "../hooks/use-prompt-box-anchored-picker";
import {
  PROMPT_BOX_IMAGE_MODE_DEFAULT_VALUE,
  PROMPT_BOX_IMAGE_MODE_DROPDOWN_TITLE,
  PROMPT_BOX_IMAGE_MODE_MODAL_DESCRIPTION,
  PROMPT_BOX_IMAGE_MODE_MODAL_ICON_SRC,
  PROMPT_BOX_IMAGE_MODE_MODAL_TITLE,
  PROMPT_BOX_IMAGE_MODE_OPTIONS,
} from "../prompt-box.constants";
import type { PromptBoxImageModeOption } from "../prompt-box.types";
import { PromptBoxAnchoredPicker } from "./prompt-box-anchored-picker";
import { PromptBoxControlButton } from "./prompt-box-control-button";
import { PromptBoxPickerRadioGroup } from "./prompt-box-picker-radio-group";

export type PromptBoxImageModePickerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  options?: readonly PromptBoxImageModeOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  dropdownTitle?: string;
  modalTitle?: string;
  modalIconSrc?: string;
  modalDescription?: string;
  className?: string;
};

function PromptBoxImageModeOptionRow({
  option,
  selected,
  onSelect,
}: {
  option: PromptBoxImageModeOption;
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
        "flex w-full cursor-pointer items-center gap-2 rounded-xl p-2 text-left transition-colors",
        "hover:bg-surface-strong",
        selected && "bg-surface-strong pr-3",
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_100%)]">
        <span className="relative size-5 shrink-0">
          <Image src={option.iconSrc} alt="" fill className="object-contain" />
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
        <span className="text-tooltip-text text-start text-sm leading-5 font-medium">
          {option.label}
        </span>
        <span className="text-start text-xs leading-4 font-normal text-[#a3a3a3]">
          {option.description}
        </span>
      </span>
      {selected ? (
        <RadioIndicator checked className="shrink-0 bg-[image:var(--check-button)]" />
      ) : null}
    </button>
  );
}

function PromptBoxImageModeOptionList({
  title,
  showTitle,
  options,
  value,
  onValueChange,
}: {
  title: string;
  showTitle: boolean;
  options: readonly PromptBoxImageModeOption[];
  value: string;
  onValueChange: React.ComponentProps<typeof PromptBoxPickerRadioGroup>["onValueChange"];
}) {
  return (
    <div data-slot="prompt-box-image-mode-options" className="flex w-full flex-col gap-0.5">
      {showTitle ? (
        <p className="text-gray-text px-3 py-1.5 text-sm leading-5 font-normal">{title}</p>
      ) : null}
      <PromptBoxPickerRadioGroup
        label={title}
        values={options.map((option) => option.value)}
        value={value}
        onValueChange={onValueChange}
      >
        {options.map((option) => (
          <PromptBoxImageModeOptionRow
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

export function PromptBoxImageModePicker({
  open,
  onOpenChange,
  options = PROMPT_BOX_IMAGE_MODE_OPTIONS,
  value,
  defaultValue = PROMPT_BOX_IMAGE_MODE_DEFAULT_VALUE,
  onValueChange,
  dropdownTitle = PROMPT_BOX_IMAGE_MODE_DROPDOWN_TITLE,
  modalTitle = PROMPT_BOX_IMAGE_MODE_MODAL_TITLE,
  modalIconSrc = PROMPT_BOX_IMAGE_MODE_MODAL_ICON_SRC,
  modalDescription = PROMPT_BOX_IMAGE_MODE_MODAL_DESCRIPTION,
  className,
}: PromptBoxImageModePickerProps) {
  const picker = usePromptBoxAnchoredPicker({
    open,
    onOpenChange,
    value,
    defaultValue: defaultValue || options[0]?.value || PROMPT_BOX_IMAGE_MODE_DEFAULT_VALUE,
    onValueChange,
  });
  const selectedOption =
    options.find((option) => option.value === picker.resolvedValue) ??
    options[0] ??
    PROMPT_BOX_IMAGE_MODE_OPTIONS[0];

  return (
    <PromptBoxAnchoredPicker
      containerRef={picker.containerRef}
      menuRef={picker.menuRef}
      isMenuOpen={picker.isMenuOpen}
      isModalOpen={picker.isModalOpen}
      onOpenChange={picker.setOpen}
      pickerSlot="prompt-box-image-mode-picker"
      dropdownSlot="prompt-box-image-mode-dropdown"
      modalSlot="prompt-box-image-mode-modal"
      dropdownClassName="w-[min(calc(100vw-1.5rem),320px)] shadow-[0px_6px_20px_rgba(0,0,0,0.35)]"
      modalTitle={modalTitle}
      modalIconSrc={modalIconSrc}
      modalDescription={modalDescription}
      className={className}
      trigger={
        <PromptBoxControlButton
          label={selectedOption.label}
          leftIconSrc={selectedOption.iconSrc}
          menuLabel={dropdownTitle}
          defaultValue={selectedOption.value}
          options={[{ value: selectedOption.value, label: selectedOption.label }]}
          disableMenu
          showTooltip={!picker.resolvedOpen}
          onTriggerClick={picker.toggleOpen}
          className={picker.resolvedOpen ? "bg-surface-strong border-tooltip-left-bg!" : undefined}
        />
      }
      dropdown={
        <PromptBoxImageModeOptionList
          title={dropdownTitle}
          showTitle
          options={options}
          value={picker.resolvedValue}
          onValueChange={picker.commitValue}
        />
      }
      modal={
        <PromptBoxImageModeOptionList
          title={modalTitle}
          showTitle={false}
          options={options}
          value={picker.resolvedValue}
          onValueChange={picker.commitValue}
        />
      }
    />
  );
}
