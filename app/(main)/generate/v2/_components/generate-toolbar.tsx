"use client";

import * as React from "react";

import { DotOption } from "@/components/common/ai-model-pages/dot-option/dot-option";
import { CheckboxMark } from "@/components/common/general/checkbox/checkbox-mark";
import { SearchInput } from "@/components/common/general/search-input/search-input";
import Tabs from "@/components/common/general/tabs/tabs";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";
import { BlurIcon } from "@/public/assets/icons";

import {
  GENERATE_BLUR_NSFW_LABEL_OFF,
  GENERATE_BLUR_NSFW_LABEL_ON,
  GENERATE_DESKTOP_BREAKPOINT,
  GENERATE_SEARCH_PLACEHOLDER,
  GENERATE_SECTION_TABS,
  GENERATE_SELECT_LABEL,
  GENERATE_TAB_ROUTES,
  GENERATE_TOOLBAR_TOGGLE_CLASS,
  isGenerateTabAvailable,
} from "../_lib/constants";

type GenerateToolbarProps = {
  selectedSectionIndex: number;
  onSectionTabChange: (index: number) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  blurNsfw: boolean;
  onBlurNsfwChange: (value: boolean) => void;
  selectMode: boolean;
  onSelectModeToggle: () => void;
  onQuickActionsClick: () => void;
  galleryActionsDisabled?: boolean;
  /** Templates tab owns its own search + filters; hide the gallery search row. */
  showSearchRow?: boolean;
  /** Templates, Images, and Videos are retired in favor of the studio nav. */
  showSectionTabs?: boolean;
  /** False while video generation is closed: drops the tabs that only make videos. */
  videoEnabled?: boolean;
  /** False while the Templates tab is closed, even with video open. */
  templatesEnabled?: boolean;
};

export function GenerateToolbar({
  selectedSectionIndex,
  onSectionTabChange,
  searchValue,
  onSearchValueChange,
  blurNsfw,
  onBlurNsfwChange,
  selectMode,
  onSelectModeToggle,
  onQuickActionsClick,
  galleryActionsDisabled = false,
  showSearchRow = true,
  showSectionTabs = false,
  videoEnabled = true,
  templatesEnabled = true,
}: GenerateToolbarProps) {
  const isDesktop = useIsDesktop(GENERATE_DESKTOP_BREAKPOINT);
  // Callers speak in indexes into GENERATE_SECTION_TABS, so each offered tab
  // keeps its own; only the strip's positions shift when some are dropped.
  const tabs = GENERATE_SECTION_TABS.map((tab, sectionIndex) => ({ ...tab, sectionIndex })).filter(
    (tab) => isGenerateTabAvailable(tab.id, videoEnabled, templatesEnabled),
  );

  return (
    <div data-slot="generate-toolbar" className="flex w-full shrink-0 flex-col gap-4">
      {/* A strip with a single tab is not a choice, so it is not drawn. */}
      {showSectionTabs && tabs.length > 1 ? (
        <Tabs
          variant="link"
          unstyled
          showTabIcon
          listLabel="Generate content"
          className="w-auto min-w-0 shrink-0 p-0!"
          // `href` makes each tab a real anchor, so a crawler can follow
          // /generate → /generate-image → /generate-video instead of those two
          // landings being reachable only from /sitemap (BACK-222). A plain click
          // is still handled by `onChange`; nothing navigates on its own.
          tabs={tabs.map(({ id, label, leftIconSrc }) => {
            const disabled = id === "images" || id === "videos";
            return {
              label,
              leftIconSrc,
              showBadge: false,
              disabled,
              href: disabled ? undefined : GENERATE_TAB_ROUTES[id],
            };
          })}
          selected={tabs.findIndex((tab) => tab.sectionIndex === selectedSectionIndex)}
          onChange={(index) => onSectionTabChange(tabs[index].sectionIndex)}
        />
      ) : null}

      {showSearchRow ? (
        <div className="flex w-full min-w-0 items-center gap-2">
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
            <div className="flex shrink-0 items-center gap-2">
              <ToolbarToggle
                pressed={blurNsfw}
                disabled={galleryActionsDisabled}
                label={blurNsfw ? GENERATE_BLUR_NSFW_LABEL_ON : GENERATE_BLUR_NSFW_LABEL_OFF}
                ariaLabel={blurNsfw ? GENERATE_BLUR_NSFW_LABEL_ON : GENERATE_BLUR_NSFW_LABEL_OFF}
                icon={<BlurIcon className="size-5 shrink-0" aria-hidden />}
                onPressedChange={onBlurNsfwChange}
              />
              <ToolbarToggle
                pressed={selectMode}
                disabled={galleryActionsDisabled}
                label={GENERATE_SELECT_LABEL}
                ariaLabel={GENERATE_SELECT_LABEL}
                icon={<CheckboxMark checked={selectMode} />}
                onPressedChange={() => onSelectModeToggle()}
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

type ToolbarToggleProps = {
  pressed: boolean;
  disabled?: boolean;
  label: string;
  ariaLabel: string;
  icon: React.ReactNode;
  onPressedChange: (pressed: boolean) => void;
};

function ToolbarToggle({
  pressed,
  disabled = false,
  label,
  ariaLabel,
  icon,
  onPressedChange,
}: ToolbarToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      onClick={() => {
        if (disabled) return;
        onPressedChange(!pressed);
      }}
      className={cn(
        GENERATE_TOOLBAR_TOGGLE_CLASS,
        disabled && "cursor-not-allowed opacity-50",
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
