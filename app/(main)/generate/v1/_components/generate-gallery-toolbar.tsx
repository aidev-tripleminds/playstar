"use client";

import * as React from "react";

import { DotOption } from "@/components/common/ai-model-pages/dot-option/dot-option";
import { CheckboxMark } from "@/components/common/general/checkbox/checkbox-mark";
import { SearchInput } from "@/components/common/general/search-input/search-input";
import { cn } from "@/lib/utils";
import { BlurIcon } from "@/public/assets/icons";

import {
  GENERATE_BLUR_NSFW_LABEL_OFF,
  GENERATE_BLUR_NSFW_LABEL_ON,
  GENERATE_SEARCH_PLACEHOLDER,
  GENERATE_SELECT_LABEL,
  GENERATE_TOOLBAR_TOGGLE_CLASS,
} from "../_lib/constants";

type GenerateGalleryToolbarProps = {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  blurNsfw: boolean;
  onBlurNsfwChange: (value: boolean) => void;
  selectMode: boolean;
  onEnterSelectMode: () => void;
  onExitSelectMode: () => void;
  onQuickActionsClick: () => void;
  isDesktop: boolean;
};

export function GenerateGalleryToolbar({
  searchValue,
  onSearchValueChange,
  blurNsfw,
  onBlurNsfwChange,
  selectMode,
  onEnterSelectMode,
  onExitSelectMode,
  onQuickActionsClick,
  isDesktop,
}: GenerateGalleryToolbarProps) {
  return (
    <div
      data-slot="generate-gallery-toolbar"
      className="flex w-full min-w-0 flex-1 items-center gap-2"
    >
      <SearchInput
        value={searchValue}
        onChange={(event) => onSearchValueChange(event.target.value)}
        onClear={() => onSearchValueChange("")}
        placeholder={GENERATE_SEARCH_PLACEHOLDER}
        disableAutoFocus
        showClose={searchValue.length > 0}
        wrapperClassName="min-w-0 flex-1 [&>div]:w-full"
      />
      {!isDesktop ? (
        <DotOption onTriggerClick={onQuickActionsClick} />
      ) : (
        <div
          data-slot="generate-gallery-toggles"
          className="flex w-auto shrink-0 items-center gap-2 max-[969px]:[&_[data-slot=toolbar-toggle-label]]:hidden"
        >
          <ToolbarToggle
            pressed={blurNsfw}
            ariaLabel={blurNsfw ? GENERATE_BLUR_NSFW_LABEL_ON : GENERATE_BLUR_NSFW_LABEL_OFF}
            label={blurNsfw ? GENERATE_BLUR_NSFW_LABEL_ON : GENERATE_BLUR_NSFW_LABEL_OFF}
            icon={<BlurIcon className="size-5 shrink-0" />}
            onPressedChange={onBlurNsfwChange}
          />
          <ToolbarToggle
            pressed={selectMode}
            ariaLabel={GENERATE_SELECT_LABEL}
            label={GENERATE_SELECT_LABEL}
            icon={<CheckboxMark checked={selectMode} />}
            onPressedChange={(nextPressed) => {
              if (nextPressed) {
                onEnterSelectMode();
                return;
              }
              onExitSelectMode();
            }}
          />
        </div>
      )}
    </div>
  );
}

type ToolbarToggleProps = {
  pressed: boolean;
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  onPressedChange: (pressed: boolean) => void;
};

function ToolbarToggle({ pressed, label, ariaLabel, icon, onPressedChange }: ToolbarToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={ariaLabel}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        GENERATE_TOOLBAR_TOGGLE_CLASS,
        pressed
          ? "bg-surface-strong text-tooltip-text shadow-[var(--toggle-thumb-shadow)]"
          : "bg-tooltip-default-bg text-divider-label",
      )}
    >
      {icon}
      <span data-slot="toolbar-toggle-label">{label}</span>
    </button>
  );
}
