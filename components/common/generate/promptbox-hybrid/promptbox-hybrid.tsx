"use client";

import Image from "next/image";
import * as React from "react";

import {
  ButtonSelect,
  type ButtonSelectOption,
} from "@/components/common/general/button-select/button-select";
import Tabs from "@/components/common/general/tabs/tabs";
import { TextArea } from "@/components/common/general/text-area/text-area";
import { GenerateGroup } from "@/components/common/generate/generate-group";
import { InfoButton } from "@/components/common/generate/info-button";
import { PlaceholdersHybrid } from "@/components/common/generate/placeholders-hybrid";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useMe } from "@/hooks/use-me";
import { capUserPrompt, PROMPT_MAX_LENGTH } from "@/lib/prompt-limits";
import { cn } from "@/lib/utils";

import {
  clampPromptboxHybridGuestUsageCount,
  formatPromptboxHybridGuestUsageLabel,
  getPromptboxHybridDefaultPlaceholders,
  getPromptboxHybridDefaultTabIndex,
  getPromptboxHybridDefaultTabs,
  getPromptboxHybridMediaForTab,
  isPromptboxHybridGuestUsageAtLimit,
  PROMPTBOX_HYBRID_BODY_CLASS,
  PROMPTBOX_HYBRID_CROWN_ICON_SRC,
  PROMPTBOX_HYBRID_CUSTOM_PROMPT_LABEL,
  PROMPTBOX_HYBRID_DEFAULT_GUEST_USAGE_COUNT,
  PROMPTBOX_HYBRID_DEFAULT_MEDIA,
  PROMPTBOX_HYBRID_DEFAULT_PROMPT_PLACEHOLDER,
  PROMPTBOX_HYBRID_FOOTER_CLASS,
  PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT,
  PROMPTBOX_HYBRID_LOCKED_PROMPT_PLACEHOLDER,
  PROMPTBOX_HYBRID_MOBILE_CLASS,
  PROMPTBOX_HYBRID_PLACEHOLDERS_DESKTOP_CLASS,
  PROMPTBOX_HYBRID_PLACEHOLDERS_DESKTOP_MULTI_CLASS,
  PROMPTBOX_HYBRID_PLACEHOLDERS_MOBILE_CLASS,
  PROMPTBOX_HYBRID_PLACEHOLDERS_MOBILE_PAIR_CLASS,
  PROMPTBOX_HYBRID_PLACEHOLDERS_MOBILE_PAIR_SLOT_CLASS,
  PROMPTBOX_HYBRID_SETTINGS_ICON_SRC,
  PROMPTBOX_HYBRID_SETTINGS_LABEL,
  PROMPTBOX_HYBRID_SHELL_CLASS,
  PROMPTBOX_HYBRID_TEXTAREA_CLASS,
} from "./promptbox-hybrid.constants";
import type {
  PromptboxHybridMedia,
  PromptboxHybridPlaceholderSlot,
  PromptboxHybridTab,
} from "./promptbox-hybrid.types";

export type PromptboxHybridProps = Omit<React.ComponentProps<"div">, "children"> & {
  media?: PromptboxHybridMedia;
  tabs?: PromptboxHybridTab[];
  selectedTab?: number;
  defaultSelectedTab?: number;
  onTabChange?: (index: number) => void;
  placeholders?: PromptboxHybridPlaceholderSlot[];
  showCustomPrompt?: boolean;
  customPromptLabel?: string;
  promptLocked?: boolean;
  promptValue?: string;
  defaultPromptValue?: string;
  onPromptValueChange?: (value: string) => void;
  promptPlaceholder?: string;
  showInfoButton?: boolean;
  onInfoButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  showSettingsButton?: boolean;
  settingsLabel?: string;
  settingsIconSrc?: string;
  settingsOptions?: ButtonSelectOption[];
  settingsValue?: string;
  defaultSettingsValue?: string;
  onSettingsValueChange?: (value: string) => void;
  settingsShowTooltip?: boolean;
  /** Opens advanced settings (or any parent handler) when the settings trigger is clicked. */
  onSettingsClick?: React.MouseEventHandler<HTMLButtonElement>;
  settingsSlot?: React.ReactNode;
  tokenCost?: React.ReactNode;
  showTokenIcon?: boolean;
  /**
   * When false (logged out), Generate group shows remaining guest gens `5/5`…`1/5`,
   * then a crown at `0`. Defaults to the session from `useMe`.
   */
  isLoggedIn?: boolean;
  /** Controlled remaining guest free generations (`0`–`5`). Ignored while logged in. */
  guestUsageCount?: number;
  /** Uncontrolled initial remaining guest gens. Defaults to `5`. */
  defaultGuestUsageCount?: number;
  guestUsageLimit?: number;
  onGuestUsageCountChange?: (count: number) => void;
  generateLabel?: string;
  generateDisabled?: boolean;
  onGenerate?: React.MouseEventHandler<HTMLButtonElement>;
  showSkipQueue?: boolean;
  skipQueueDisabled?: boolean;
  defaultSkipQueueDisabled?: boolean;
  onSkipQueueClick?: React.MouseEventHandler<HTMLButtonElement>;
  onSkipQueueDisabledChange?: (disabled: boolean) => void;
  footerSlot?: React.ReactNode;
  /** Viewport width (px) at which desktop promptbox layout engages. Defaults to 768. */
  desktopBreakpoint?: number;
};

function GuestLimitCrownIcon() {
  return (
    <Image
      src={PROMPTBOX_HYBRID_CROWN_ICON_SRC}
      alt=""
      aria-hidden
      width={18}
      height={18}
      className="size-[18px] shrink-0 object-contain"
    />
  );
}

export function PromptboxHybrid({
  media = PROMPTBOX_HYBRID_DEFAULT_MEDIA,
  tabs,
  selectedTab,
  defaultSelectedTab,
  onTabChange,
  placeholders,
  showCustomPrompt = true,
  customPromptLabel = PROMPTBOX_HYBRID_CUSTOM_PROMPT_LABEL,
  promptLocked = true,
  promptValue,
  defaultPromptValue = "",
  onPromptValueChange,
  promptPlaceholder,
  showInfoButton = true,
  onInfoButtonClick,
  showSettingsButton = true,
  settingsLabel = PROMPTBOX_HYBRID_SETTINGS_LABEL,
  settingsIconSrc = PROMPTBOX_HYBRID_SETTINGS_ICON_SRC,
  settingsOptions,
  settingsValue,
  defaultSettingsValue,
  onSettingsValueChange,
  settingsShowTooltip = true,
  onSettingsClick,
  settingsSlot,
  tokenCost,
  showTokenIcon,
  isLoggedIn: isLoggedInProp,
  guestUsageCount,
  defaultGuestUsageCount = PROMPTBOX_HYBRID_DEFAULT_GUEST_USAGE_COUNT,
  guestUsageLimit = PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT,
  onGuestUsageCountChange,
  generateLabel,
  generateDisabled,
  onGenerate,
  showSkipQueue = true,
  skipQueueDisabled,
  defaultSkipQueueDisabled = true,
  onSkipQueueClick,
  onSkipQueueDisabledChange,
  footerSlot,
  desktopBreakpoint = 768,
  className,
  ...props
}: PromptboxHybridProps) {
  const isDesktop = useIsDesktop(desktopBreakpoint);
  const { isLoggedIn: meIsLoggedIn } = useMe();
  const isLoggedIn = isLoggedInProp ?? meIsLoggedIn;
  const [internalPromptValue, setInternalPromptValue] = React.useState(defaultPromptValue);
  const resolvedPromptValue = promptValue ?? internalPromptValue;
  const [internalGuestUsageCount, setInternalGuestUsageCount] = React.useState(() =>
    clampPromptboxHybridGuestUsageCount(defaultGuestUsageCount, guestUsageLimit),
  );

  const resolvedDefaultTab = defaultSelectedTab ?? getPromptboxHybridDefaultTabIndex(media);
  const [internalSelectedTab, setInternalSelectedTab] = React.useState(resolvedDefaultTab);
  const [previousMedia, setPreviousMedia] = React.useState(media);
  let syncedInternalSelectedTab = internalSelectedTab;

  if (previousMedia !== media) {
    setPreviousMedia(media);
    if (selectedTab === undefined) {
      syncedInternalSelectedTab = resolvedDefaultTab;
      setInternalSelectedTab(resolvedDefaultTab);
    }
  }

  const activeTab = selectedTab ?? syncedInternalSelectedTab;
  const activeMedia = getPromptboxHybridMediaForTab(media, activeTab);
  const resolvedTabs = tabs ?? getPromptboxHybridDefaultTabs(media);
  const resolvedPlaceholders = placeholders ?? getPromptboxHybridDefaultPlaceholders(activeMedia);
  const resolvedPromptPlaceholder = promptLocked
    ? PROMPTBOX_HYBRID_LOCKED_PROMPT_PLACEHOLDER
    : (promptPlaceholder ?? PROMPTBOX_HYBRID_DEFAULT_PROMPT_PLACEHOLDER);

  const resolvedGuestUsageCount = clampPromptboxHybridGuestUsageCount(
    guestUsageCount ?? internalGuestUsageCount,
    guestUsageLimit,
  );
  const isGuestTokenMode = !isLoggedIn && tokenCost === undefined;
  const guestUsageAtLimit = isPromptboxHybridGuestUsageAtLimit(
    resolvedGuestUsageCount,
    guestUsageLimit,
  );
  const resolvedTokenCost = isGuestTokenMode ? (
    guestUsageAtLimit ? (
      <GuestLimitCrownIcon />
    ) : (
      formatPromptboxHybridGuestUsageLabel(resolvedGuestUsageCount, guestUsageLimit)
    )
  ) : (
    tokenCost
  );
  const resolvedShowTokenIcon = showTokenIcon ?? !isGuestTokenMode;

  const handleTabChange = (index: number) => {
    if (selectedTab === undefined) {
      setInternalSelectedTab(index);
    }

    onTabChange?.(index);
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (promptLocked) {
      return;
    }

    const nextValue = capUserPrompt(event.target.value);

    if (promptValue === undefined) {
      setInternalPromptValue(nextValue);
    }

    onPromptValueChange?.(nextValue);
  };

  const handleGenerate: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    // Always notify the parent first so guest-limit clicks can open upsell flows.
    onGenerate?.(event);

    if (!isGuestTokenMode || guestUsageAtLimit) {
      return;
    }

    const nextCount = clampPromptboxHybridGuestUsageCount(
      resolvedGuestUsageCount - 1,
      guestUsageLimit,
    );

    if (guestUsageCount === undefined) {
      setInternalGuestUsageCount(nextCount);
    }

    onGuestUsageCountChange?.(nextCount);
  };

  const placeholderCount = resolvedPlaceholders.length;
  const placeholdersCentered = placeholderCount === 1;
  const placeholdersFitMobile = !isDesktop && placeholderCount === 2;
  const placeholderSize = isDesktop ? "desktop" : placeholdersFitMobile ? "fluid" : "mobile";

  return (
    <div
      data-slot="promptbox-hybrid"
      data-layout={isDesktop ? "desktop" : "mobile"}
      data-media={activeMedia}
      className={cn(
        isDesktop ? PROMPTBOX_HYBRID_SHELL_CLASS : PROMPTBOX_HYBRID_MOBILE_CLASS,
        className,
      )}
      {...props}
    >
      <div
        data-slot="promptbox-hybrid-body"
        className={isDesktop ? PROMPTBOX_HYBRID_BODY_CLASS : "flex w-full flex-col gap-4"}
      >
        <Tabs
          variant="compact"
          compactLayout="scroll"
          unstyled
          showTabIcon={false}
          scrollArrows={isDesktop && resolvedTabs.length > 3 ? "desktop" : false}
          tabs={resolvedTabs}
          selected={activeTab}
          defaultSelected={resolvedDefaultTab}
          onChange={handleTabChange}
          className="[&_[data-slot=scroll-arrow-gradient]]:from-tooltip-default-bg w-full overflow-visible p-0! [&_[data-slot=scroll-arrow-button]]:rounded-full"
        />

        <div
          data-slot="promptbox-hybrid-placeholders"
          className={cn(
            isDesktop
              ? PROMPTBOX_HYBRID_PLACEHOLDERS_DESKTOP_CLASS
              : placeholdersFitMobile
                ? PROMPTBOX_HYBRID_PLACEHOLDERS_MOBILE_PAIR_CLASS
                : PROMPTBOX_HYBRID_PLACEHOLDERS_MOBILE_CLASS,
            isDesktop && !placeholdersCentered && PROMPTBOX_HYBRID_PLACEHOLDERS_DESKTOP_MULTI_CLASS,
            placeholdersCentered ? "justify-center" : !placeholdersFitMobile && "justify-start",
          )}
        >
          {resolvedPlaceholders.map((slot, index) => (
            <PlaceholdersHybrid
              key={`${slot.title ?? "placeholder"}-${index}`}
              size={placeholderSize}
              className={
                placeholdersFitMobile
                  ? PROMPTBOX_HYBRID_PLACEHOLDERS_MOBILE_PAIR_SLOT_CLASS
                  : undefined
              }
              title={slot.title}
              subtitle={slot.subtitle}
              status={slot.status}
              defaultStatus={slot.defaultStatus}
              imageSrc={slot.imageSrc}
              imageAlt={slot.imageAlt}
              audioLabel={slot.audioLabel}
              onStatusChange={slot.onStatusChange}
              onClear={slot.onClear}
              onClick={slot.onClick}
              onPlay={slot.onPlay}
            />
          ))}
        </div>

        {showCustomPrompt ? (
          <div data-slot="promptbox-hybrid-prompt" className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-tooltip-text text-sm leading-5 font-medium">
                {customPromptLabel}
              </span>
              {promptLocked ? (
                <Image
                  src={PROMPTBOX_HYBRID_CROWN_ICON_SRC}
                  alt=""
                  aria-hidden
                  width={16}
                  height={16}
                  className="size-4 shrink-0 object-contain"
                />
              ) : null}
            </div>

            <TextArea
              data-slot="promptbox-hybrid-textarea"
              value={capUserPrompt(resolvedPromptValue)}
              placeholder={resolvedPromptPlaceholder}
              aria-label={customPromptLabel}
              maxLength={PROMPT_MAX_LENGTH}
              showLeftIcon={false}
              disabled={promptLocked}
              onChange={handlePromptChange}
              className={PROMPTBOX_HYBRID_TEXTAREA_CLASS}
            />
          </div>
        ) : null}
      </div>

      {isDesktop ? (
        <div data-slot="promptbox-hybrid-footer" className={PROMPTBOX_HYBRID_FOOTER_CLASS}>
          <div
            data-slot="promptbox-hybrid-controls"
            className="flex w-full items-center justify-between gap-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              {showInfoButton ? <InfoButton size="desktop" onClick={onInfoButtonClick} /> : null}
              {settingsSlot}
            </div>

            {showSettingsButton ? (
              <div data-slot="promptbox-hybrid-settings" className="shrink-0">
                <ButtonSelect
                  showWide={false}
                  disableMenu
                  showTooltip={settingsShowTooltip}
                  options={settingsOptions ?? [{ value: "settings", label: settingsLabel }]}
                  value={settingsValue}
                  defaultValue={defaultSettingsValue ?? "settings"}
                  imgIcon={settingsIconSrc}
                  menuLabel={settingsLabel}
                  showButtonIcon
                  widthMode="content"
                  className="h-auto shrink-0 border-[#262626]! bg-[#171717] px-3! py-3!"
                  onValueChange={onSettingsValueChange}
                  onTriggerClick={onSettingsClick}
                />
              </div>
            ) : null}
          </div>

          {footerSlot ?? (
            <GenerateGroup
              tokenCost={resolvedTokenCost}
              showTokenIcon={resolvedShowTokenIcon}
              generateLabel={generateLabel}
              generateDisabled={generateDisabled}
              onGenerate={handleGenerate}
              showSkipQueue={showSkipQueue}
              skipQueueDisabled={skipQueueDisabled}
              defaultSkipQueueDisabled={defaultSkipQueueDisabled}
              onSkipQueueClick={onSkipQueueClick}
              onSkipQueueDisabledChange={onSkipQueueDisabledChange}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

export {
  clampPromptboxHybridGuestUsageCount,
  formatPromptboxHybridGuestUsageLabel,
  getPromptboxHybridDefaultPlaceholders,
  getPromptboxHybridDefaultTabIndex,
  getPromptboxHybridDefaultTabs,
  getPromptboxHybridMediaForTab,
  isPromptboxHybridGuestUsageAtLimit,
  PROMPTBOX_HYBRID_BODY_CLASS,
  PROMPTBOX_HYBRID_CROWN_ICON_SRC,
  PROMPTBOX_HYBRID_CUSTOM_PROMPT_LABEL,
  PROMPTBOX_HYBRID_DEFAULT_GUEST_USAGE_COUNT,
  PROMPTBOX_HYBRID_DEFAULT_IMAGE_EDIT_PLACEHOLDERS,
  PROMPTBOX_HYBRID_DEFAULT_IMAGE_PRESET_PLACEHOLDERS,
  PROMPTBOX_HYBRID_DEFAULT_MEDIA,
  PROMPTBOX_HYBRID_DEFAULT_PROMPT_PLACEHOLDER,
  PROMPTBOX_HYBRID_DEFAULT_SPEECH2VID_PLACEHOLDERS,
  PROMPTBOX_HYBRID_FOOTER_CLASS,
  PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT,
  PROMPTBOX_HYBRID_IMAGE_TABS,
  PROMPTBOX_HYBRID_LOCKED_PROMPT_PLACEHOLDER,
  PROMPTBOX_HYBRID_SETTINGS_ICON_SRC,
  PROMPTBOX_HYBRID_SETTINGS_LABEL,
  PROMPTBOX_HYBRID_SHELL_CLASS,
  PROMPTBOX_HYBRID_VIDEO_TABS,
} from "./promptbox-hybrid.constants";
export type {
  PromptboxHybridMedia,
  PromptboxHybridPlaceholderSlot,
  PromptboxHybridTab,
} from "./promptbox-hybrid.types";
