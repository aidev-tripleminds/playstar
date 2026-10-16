"use client";

import * as React from "react";

import { VideoPromptText } from "@/components/common/chat/video-prompt-text/video-prompt-text";
import { ActionContentCard } from "@/components/common/general/action-content-card";
import type { ActionContentCardVariant } from "@/components/common/general/action-content-card/action-content-card.constants";
import { Buttons } from "@/components/common/general/button/buttons";
import { Action } from "@/components/common/generate/action";
import { Placeholder } from "@/components/common/generate/placeholder";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { capUserPrompt, PROMPT_MAX_LENGTH } from "@/lib/prompt-limits";
import { cn } from "@/lib/utils";
import { CharacterOutlineIcon } from "@/public/assets/icons/character-outline";
import { CoatHangerIcon } from "@/public/assets/icons/coat-hanger";
import { MaximizeIcon } from "@/public/assets/icons/maximize";
import { SofaIcon } from "@/public/assets/icons/sofa";
import { VideoHorizontal } from "@/public/assets/icons/video-horizontal";

import { AudioMsg } from "../../chat/audio-msg/audio-msg";
import { InfoButton, type InfoButtonStatus } from "../info-button";
import { SkipQueueBtn } from "../skip-queue-btn";
import { PromptBoxCheckpointPicker } from "./components/prompt-box-checkpoint-picker";
import { PromptBoxControlButton } from "./components/prompt-box-control-button";
import { PromptBoxDurationPicker } from "./components/prompt-box-duration-picker";
import {
  PromptBoxGenerateAction,
  type PromptBoxGenerateActionVariant,
} from "./components/prompt-box-generate-action";
import { PromptBoxImageModePicker } from "./components/prompt-box-image-mode-picker";
import { PromptBoxResolutionPicker } from "./components/prompt-box-resolution-picker";
import { PromptBoxSettingsButton } from "./components/prompt-box-settings-button";
import {
  getPromptBoxCheckpointDefaultValue,
  getPromptBoxCheckpointOptions,
  getPromptBoxDefaultActions,
  getPromptBoxDefaultControlButtons,
  getPromptBoxDefaultPlaceholders,
  getPromptBoxModePickerConfig,
  isPromptBoxAudioPlaceholder,
  PROMPT_BOX_ACTIONS_CLASS,
  PROMPT_BOX_AUDIO_COMPACT_WRAP_CLASS,
  PROMPT_BOX_CHECKPOINT_ICON_SRC,
  PROMPT_BOX_COMPACT_MAX_WIDTH_CLASS,
  PROMPT_BOX_CONTAINER_CLASS,
  PROMPT_BOX_CUSTOM_PROMPT_ACTION_ID,
  PROMPT_BOX_CUSTOM_PROMPT_LABEL,
  PROMPT_BOX_DEFAULT_CHECKPOINT_LABEL,
  PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTION,
  PROMPT_BOX_DEFAULT_DURATION,
  PROMPT_BOX_DEFAULT_PLACEHOLDER_TEXT,
  PROMPT_BOX_DEFAULT_RESOLUTION,
  PROMPT_BOX_DESKTOP_MAX_WIDTH_CLASS,
  PROMPT_BOX_DURATION_MENU_LABEL,
  PROMPT_BOX_EXPAND_BUTTON_CLASS,
  PROMPT_BOX_EXPAND_LABEL,
  PROMPT_BOX_LOCKED_PROMPT_ROW_CLASS,
  PROMPT_BOX_LOCKED_PROMPT_TEXT_CLASS,
  PROMPT_BOX_LOCKED_PROMPT_TEXT_INNER_CLASS,
  PROMPT_BOX_PROMPT_FIELD_CLASS,
  PROMPT_BOX_RESOLUTION_MENU_LABEL,
  PROMPT_BOX_SCROLL_COMPACT_PILL_CLASS,
  PROMPT_BOX_SCROLL_COMPACT_PROMPT_CLASS,
  PROMPT_BOX_SCROLL_COMPACT_PROMPT_TEXT_CLASS,
  PROMPT_BOX_SCROLL_COMPACT_SHELL_CLASS,
  PROMPT_BOX_SCROLL_COMPACT_SOURCES_CLASS,
  PROMPT_BOX_SEE_ALL_LABEL,
  PROMPT_BOX_SHELL_CLASS,
  PROMPT_BOX_SHOW_FROM_DESKTOP_BLOCK_CLASS,
  PROMPT_BOX_SHOW_FROM_DESKTOP_FLEX_CLASS,
  PROMPT_BOX_SHOW_UNTIL_DESKTOP_CLASS,
  PROMPT_BOX_SOURCES_ABSOLUTE_CLASS,
  PROMPT_BOX_SOURCES_SPACER_CLASS,
  PROMPT_BOX_TEXTAREA_CLASS,
  PROMPT_BOX_UNLOCK_PROMPT_BUTTON_CLASS,
  PROMPT_BOX_UNLOCK_PROMPT_LABEL,
} from "./prompt-box.constants";
import type {
  PromptBoxActionItem,
  PromptBoxCheckpointOption,
  PromptBoxControlButton as PromptBoxControlButtonConfig,
  PromptBoxMedia,
  PromptBoxPlaceholderSlot,
  PromptBoxPromptTag,
} from "./prompt-box.types";

export type PromptBoxProps = Omit<React.ComponentProps<"div">, "children"> & {
  media?: PromptBoxMedia;
  placeholders?: PromptBoxPlaceholderSlot[];
  showSources?: boolean;
  showCheckpointButton?: boolean;
  checkpointLabel?: string;
  checkpointIconSrc?: string;
  checkpointOptions?: readonly PromptBoxCheckpointOption[];
  checkpointValue?: string;
  defaultCheckpointValue?: string;
  onCheckpointValueChange?: (value: string) => void;
  promptValue?: string;
  defaultPromptValue?: string;
  onPromptValueChange?: (value: string) => void;
  promptPlaceholder?: string;
  promptTags?: PromptBoxPromptTag[];
  /**
   * Regen / remix for non-premium users: show the prefilled prompt as a locked
   * Figma `Media=Locked` field. Generate stays enabled; only editing is blocked.
   */
  promptLocked?: boolean;
  showPromptField?: boolean;
  actions?: PromptBoxActionItem[];
  showActions?: boolean;
  seeAllLabel?: string;
  showSeeAll?: boolean;
  onSeeAllClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Call `event.preventDefault()` to keep Custom prompt on the action chips
   * instead of switching to the textarea.
   */
  onActionClick?: (action: PromptBoxActionItem, event: React.MouseEvent<HTMLButtonElement>) => void;
  showAudioCompact?: boolean;
  audioSrc?: string;
  controlButtons?: PromptBoxControlButtonConfig[];
  showControlButtons?: boolean;
  tokenCost?: React.ReactNode;
  generateLabel?: string;
  generateActionVariant?: PromptBoxGenerateActionVariant;
  generateDisabled?: boolean;
  /** When false, the box stays visible but nothing opens, generates, or changes. */
  interactive?: boolean;
  /**
   * Mobile scroll-collapsed presentation of the current media. The expanded
   * box stays this media's default layout; tapping a compact control calls
   * `onExpand` instead of activating that control.
   */
  compact?: boolean;
  onExpand?: () => void;
  onGenerate?: React.MouseEventHandler<HTMLButtonElement>;
  onUpgrade?: React.MouseEventHandler<HTMLButtonElement>;
  onUnlockPrompt?: React.MouseEventHandler<HTMLButtonElement>;
  settingsSlot?: React.ReactNode;
  showSettingsButton?: boolean;
  onSettingsClick?: React.MouseEventHandler<HTMLButtonElement>;
  settingsLabel?: string;
  onInfoButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  infoButtonStatus?: InfoButtonStatus;
  showInfoButton?: boolean;
  skipQueueDisabled?: boolean;
  onSkipQueueDisabledChange?: (disabled: boolean) => void;
  showSkipQueue?: boolean;
  imageModeValue?: string;
  defaultImageModeValue?: string;
  onImageModeValueChange?: (value: string) => void;
  footerSlot?: React.ReactNode;
};

function resolveShowSources(media: PromptBoxMedia, showSources?: boolean) {
  if (showSources !== undefined) return showSources;
  return media !== "compact";
}

function resolveShowActions(
  media: PromptBoxMedia,
  showActions: boolean | undefined,
  hasPromptContent: boolean,
  isCustomPromptMode: boolean,
  promptLocked: boolean,
) {
  if (media === "compact" || promptLocked) return false;
  if (showActions !== undefined) return showActions;
  return !hasPromptContent && !isCustomPromptMode;
}

function resolveShowPromptField(
  media: PromptBoxMedia,
  showPromptField: boolean | undefined,
  shouldShowActions: boolean,
  promptLocked: boolean,
) {
  if (media === "compact") return false;
  if (promptLocked) return true;
  if (showPromptField !== undefined) return showPromptField;
  return !shouldShowActions;
}

function resolveShowAudioInSources(showAudioCompact?: boolean) {
  return Boolean(showAudioCompact);
}

function resolveShowControlButtons(media: PromptBoxMedia, showControlButtons?: boolean) {
  if (showControlButtons !== undefined) return showControlButtons;
  return media !== "compact";
}

function resolveShowSettingsButton(media: PromptBoxMedia, showSettingsButton?: boolean) {
  if (showSettingsButton !== undefined) return showSettingsButton;
  return media !== "compact";
}

function compactPromptLabel(value: string, tags: PromptBoxPromptTag[]) {
  const trimmed = value.trim();
  if (trimmed) return trimmed;

  return tags
    .map((tag) => [tag.prefix, tag.prompt].filter(Boolean).join(" "))
    .filter(Boolean)
    .join(" ");
}

function compactSourceImages(slot: PromptBoxPlaceholderSlot) {
  const extra = slot.imageSrcs?.filter(Boolean) ?? [];
  if (extra.length > 0) return extra;
  return slot.imageSrc ? [slot.imageSrc] : [];
}

function compactContentCardVariant(slot: PromptBoxPlaceholderSlot): ActionContentCardVariant {
  if (!slot.selected) return "default";

  const images = compactSourceImages(slot);
  if (images.length === 0) return "default";
  if (slot.overflowCount != null && slot.overflowCount > 0) return "overflow";
  if (images.length >= 4) return "overflow";
  if (images.length === 3) return "three";
  if (images.length === 2) return "two";
  return "loaded";
}

function compactSourceIcon(title?: string) {
  if (title === "Character") {
    return <CharacterOutlineIcon aria-hidden className="size-4" />;
  }
  if (title === "Action") {
    return <VideoHorizontal aria-hidden className="size-4" />;
  }
  if (title === "Location") {
    return <SofaIcon aria-hidden className="size-4" />;
  }
  if (title === "Clothing") {
    return <CoatHangerIcon aria-hidden className="size-4" />;
  }
  return undefined;
}

const COMPACT_PROMPT_ELLIPSIS = "…";

/** iOS clips a button's overflow and does not draw the CSS ellipsis. */
export function fitCompactPromptText(text: string, maxWidth: number, font: string) {
  if (maxWidth <= 0) return text;
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return text;
  context.font = font;
  const widthOf = (value: string) => context.measureText(value).width;
  if (widthOf(text) <= maxWidth) return text;

  let low = 0;
  let high = text.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    const sample = `${text.slice(0, mid).trimEnd()}${COMPACT_PROMPT_ELLIPSIS}`;
    if (widthOf(sample) <= maxWidth) low = mid;
    else high = mid - 1;
  }

  if (low <= 0) return COMPACT_PROMPT_ELLIPSIS;
  return `${text.slice(0, low).trimEnd()}${COMPACT_PROMPT_ELLIPSIS}`;
}

function CompactPromptText({ text }: { text: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [fitted, setFitted] = React.useState(text);

  React.useLayoutEffect(() => {
    const node = ref.current;
    const box = node?.parentElement;
    if (!node || !box) return;

    const fit = () => {
      const style = getComputedStyle(node);
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      setFitted(fitCompactPromptText(text, Math.max(0, box.clientWidth - 2), font));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [text]);

  return (
    <span ref={ref} className={PROMPT_BOX_SCROLL_COMPACT_PROMPT_TEXT_CLASS}>
      {fitted}
    </span>
  );
}

export function PromptBox({
  media = "image-presets",
  placeholders: placeholdersProp,
  showSources,
  showCheckpointButton = true,
  checkpointLabel = PROMPT_BOX_DEFAULT_CHECKPOINT_LABEL,
  checkpointIconSrc = PROMPT_BOX_CHECKPOINT_ICON_SRC,
  checkpointOptions,
  checkpointValue,
  defaultCheckpointValue,
  onCheckpointValueChange,
  promptValue,
  defaultPromptValue = "",
  onPromptValueChange,
  promptPlaceholder = PROMPT_BOX_DEFAULT_PLACEHOLDER_TEXT,
  promptTags = [],
  promptLocked = false,
  showPromptField,
  actions,
  showActions,
  seeAllLabel = PROMPT_BOX_SEE_ALL_LABEL,
  showSeeAll = true,
  onSeeAllClick,
  onActionClick,
  showAudioCompact,
  audioSrc,
  controlButtons,
  showControlButtons,
  tokenCost,
  generateLabel,
  generateActionVariant = "tokens",
  generateDisabled,
  interactive = true,
  compact = false,
  onExpand,
  onGenerate,
  onUpgrade,
  onUnlockPrompt,
  settingsSlot,
  showSettingsButton,
  onSettingsClick,
  settingsLabel = "Settings",
  onInfoButtonClick,
  infoButtonStatus,
  showInfoButton = true,
  skipQueueDisabled,
  onSkipQueueDisabledChange,
  showSkipQueue = true,
  imageModeValue,
  defaultImageModeValue,
  onImageModeValueChange,
  footerSlot,
  className,
  ...props
}: PromptBoxProps) {
  const [internalPromptValue, setInternalPromptValue] = React.useState(defaultPromptValue);
  const [isCustomPromptMode, setIsCustomPromptMode] = React.useState(false);
  const [checkpointOpen, setCheckpointOpen] = React.useState(false);
  const resolvedCheckpointOptions = checkpointOptions ?? getPromptBoxCheckpointOptions(media);
  const resolvedDefaultCheckpointValue =
    defaultCheckpointValue ?? getPromptBoxCheckpointDefaultValue(media);
  const [internalCheckpointValue, setInternalCheckpointValue] = React.useState(
    resolvedDefaultCheckpointValue,
  );
  const resolvedPromptValue = promptValue ?? internalPromptValue;
  const rawCheckpointValue = checkpointValue ?? internalCheckpointValue;
  const resolvedCheckpointValue = resolvedCheckpointOptions.some(
    (option) => option.value === rawCheckpointValue,
  )
    ? rawCheckpointValue
    : resolvedDefaultCheckpointValue;
  const placeholders = placeholdersProp ?? getPromptBoxDefaultPlaceholders(media);
  const resolvedActions = actions ?? getPromptBoxDefaultActions(media);
  const resolvedControlButtons = controlButtons ?? getPromptBoxDefaultControlButtons(media);
  const modePicker = getPromptBoxModePickerConfig(media);
  const hasPromptContent = resolvedPromptValue.trim().length > 0 || promptTags.length > 0;
  const shouldShowSources = resolveShowSources(media, showSources);
  const shouldShowActions = resolveShowActions(
    media,
    showActions,
    hasPromptContent,
    isCustomPromptMode,
    promptLocked,
  );
  const shouldShowPromptField = resolveShowPromptField(
    media,
    showPromptField,
    shouldShowActions,
    promptLocked,
  );
  const shouldShowAudioCompact = resolveShowAudioInSources(showAudioCompact);
  const isCompact = media === "compact";
  // Scroll compact keeps the current media's content and only changes density.
  // `media="compact"` stays the standalone storybook layout. A locked prompt
  // stays expanded so the blur and unlock control are not replaced by the text.
  const isScrollCompact = compact && !isCompact && interactive && !promptLocked;
  const shouldShowControlButtons =
    !isScrollCompact && resolveShowControlButtons(media, showControlButtons);
  const shouldShowSettingsButton =
    !isScrollCompact && resolveShowSettingsButton(media, showSettingsButton);
  const hasPromptTags = promptTags.length > 0;
  const isCustomPromptOnly =
    resolvedActions.length === 1 && resolvedActions[0]?.id === PROMPT_BOX_CUSTOM_PROMPT_ACTION_ID;
  const shouldShowSeeAll = showSeeAll && !isCustomPromptOnly;
  const visibleControlButtons = shouldShowControlButtons ? resolvedControlButtons : [];
  const hasImageModeControlButton = visibleControlButtons.some(
    (button) => button.kind === "image-mode",
  );
  const promptFieldRef = React.useRef<HTMLTextAreaElement>(null);
  const focusPromptWhenExpandedRef = React.useRef(false);
  const previousPromptValueRef = React.useRef(resolvedPromptValue);

  const exitCustomPromptIfEmpty = React.useCallback(() => {
    if (resolvedPromptValue.trim().length > 0 || promptTags.length > 0) return;
    setIsCustomPromptMode(false);
  }, [promptTags.length, resolvedPromptValue]);

  React.useEffect(() => {
    const previous = previousPromptValueRef.current;
    previousPromptValueRef.current = resolvedPromptValue;
    if (previous.trim().length > 0 && resolvedPromptValue.trim().length === 0) {
      setIsCustomPromptMode(false);
    }
  }, [resolvedPromptValue]);

  React.useEffect(() => {
    if (promptLocked || !isCustomPromptMode || hasPromptContent) return;
    promptFieldRef.current?.focus({ preventScroll: true });
  }, [hasPromptContent, isCustomPromptMode, promptLocked]);

  React.useLayoutEffect(() => {
    if (!focusPromptWhenExpandedRef.current || isScrollCompact || promptLocked) return;
    const field = promptFieldRef.current;
    if (!field) return;
    focusPromptWhenExpandedRef.current = false;
    field.focus({ preventScroll: true });
  }, [isCustomPromptMode, isScrollCompact, promptLocked]);

  if (!interactive) {
    if (checkpointOpen) setCheckpointOpen(false);
    if (isCustomPromptMode) setIsCustomPromptMode(false);
  }

  const shouldShowCheckpointPicker = showCheckpointButton && !isCompact && !isScrollCompact;
  const checkpointPickerProps = {
    media,
    open: interactive ? checkpointOpen : false,
    onOpenChange: interactive ? setCheckpointOpen : () => {},
    label: checkpointLabel,
    iconSrc: checkpointIconSrc,
    options: resolvedCheckpointOptions,
    value: resolvedCheckpointValue,
    onValueChange: (nextValue: string) => {
      if (checkpointValue === undefined) {
        setInternalCheckpointValue(nextValue);
      }
      onCheckpointValueChange?.(nextValue);
    },
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!interactive || promptLocked) return;
    const nextValue = capUserPrompt(event.target.value);

    if (promptValue === undefined) {
      setInternalPromptValue(nextValue);
    }

    onPromptValueChange?.(nextValue);

    if (nextValue.trim().length === 0 && promptTags.length === 0) {
      setIsCustomPromptMode(false);
    }
  };

  const handlePromptKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    exitCustomPromptIfEmpty();
  };

  const promptField = (
    <Textarea
      ref={promptFieldRef}
      data-slot="prompt-box-textarea"
      rows={1}
      value={capUserPrompt(resolvedPromptValue)}
      placeholder={promptPlaceholder}
      aria-label={promptPlaceholder}
      maxLength={PROMPT_MAX_LENGTH}
      readOnly={!interactive || promptLocked}
      onChange={handlePromptChange}
      onBlur={exitCustomPromptIfEmpty}
      onKeyDown={handlePromptKeyDown}
      onPointerDown={(event) => {
        if (!interactive || promptLocked || event.button !== 0) return;
        const field = promptFieldRef.current;
        if (!field || document.activeElement === field) return;
        // The browser scrolls the focused field into view. On a phone that
        // pan is large enough to collapse the prompt and dismiss the keyboard.
        event.preventDefault();
        field.focus({ preventScroll: true });
      }}
      className={cn(
        PROMPT_BOX_TEXTAREA_CLASS,
        resolvedPromptValue.trim().length > 0 && "max-[767px]:min-h-10",
      )}
    />
  );

  const lockedPrompt = (
    <div data-slot="prompt-box-locked-prompt" className={PROMPT_BOX_LOCKED_PROMPT_ROW_CLASS}>
      <span className="sr-only">Prompt is locked. Get premium to unlock editing.</span>
      <p
        data-slot="prompt-box-locked-prompt-text"
        aria-hidden
        className={PROMPT_BOX_LOCKED_PROMPT_TEXT_CLASS}
      >
        <span className={PROMPT_BOX_LOCKED_PROMPT_TEXT_INNER_CLASS}>
          {resolvedPromptValue || promptPlaceholder}
        </span>
      </p>
      <Buttons
        type="button"
        variant="premium-full"
        size="btn-s"
        leftIcon={false}
        rightIcon={false}
        label={PROMPT_BOX_UNLOCK_PROMPT_LABEL}
        data-slot="prompt-box-unlock-prompt"
        aria-label={PROMPT_BOX_UNLOCK_PROMPT_LABEL}
        onClick={interactive ? (onUnlockPrompt ?? onUpgrade) : undefined}
        className={PROMPT_BOX_UNLOCK_PROMPT_BUTTON_CLASS}
      />
    </div>
  );

  if (isScrollCompact) {
    const compactText = compactPromptLabel(resolvedPromptValue, promptTags);
    const showCompactText = compactText.length > 0;
    const customPromptAction =
      resolvedActions.find((action) => action.id === PROMPT_BOX_CUSTOM_PROMPT_ACTION_ID) ??
      PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTION;
    const expand = () => onExpand?.();

    return (
      <div
        data-slot="prompt-box"
        data-layout="responsive"
        data-media={media}
        data-compact="true"
        data-prompt-locked={promptLocked ? "true" : "false"}
        data-interactive={interactive ? "true" : "false"}
        className={cn(
          PROMPT_BOX_SCROLL_COMPACT_SHELL_CLASS,
          PROMPT_BOX_DESKTOP_MAX_WIDTH_CLASS,
          className,
        )}
        {...props}
      >
        {shouldShowSources && placeholders.length > 0 ? (
          <div data-slot="prompt-box-sources" className={PROMPT_BOX_SCROLL_COMPACT_SOURCES_CLASS}>
            {placeholders.map((slot, index) => {
              if (isPromptBoxAudioPlaceholder(slot) && slot.selected) {
                return (
                  <div
                    key={`${slot.title ?? "audio"}-${index}`}
                    data-slot="prompt-box-audio-compact-wrap"
                    className="relative flex w-auto min-w-0 items-end"
                    onClickCapture={(event) => {
                      event.preventDefault();
                      slot.onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
                      expand();
                    }}
                  >
                    <AudioMsg
                      variant="compact"
                      src={slot.audioSrc ?? audioSrc}
                      label={slot.audioLabel ?? slot.title ?? "Audio"}
                      className="w-full max-w-none min-w-0"
                    />
                  </div>
                );
              }

              const variant = compactContentCardVariant(slot);
              const images = compactSourceImages(slot);

              return (
                <ActionContentCard
                  key={`${slot.title ?? "placeholder"}-${index}`}
                  variant={variant}
                  className="h-11 min-h-0"
                  imageSrc={images[0]}
                  imageSrcs={images.length > 1 ? images : undefined}
                  overflowCount={slot.overflowCount}
                  icon={variant === "overflow" ? undefined : compactSourceIcon(slot.title)}
                  addLabel={slot.title ? `Add ${slot.title}` : undefined}
                  onClick={(event) => {
                    slot.onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
                    expand();
                  }}
                  onAddClick={(event) => {
                    event.stopPropagation();
                    slot.onClick?.(event);
                    expand();
                  }}
                />
              );
            })}

            {shouldShowAudioCompact ? (
              <div data-slot="prompt-box-audio-compact-wrap" className="relative flex w-auto">
                <AudioMsg variant="compact" src={audioSrc} className="w-full max-w-none min-w-0" />
              </div>
            ) : null}
          </div>
        ) : null}

        <div data-slot="prompt-box-container" className={PROMPT_BOX_SCROLL_COMPACT_PILL_CLASS}>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              data-slot="prompt-box-expand"
              aria-label={PROMPT_BOX_EXPAND_LABEL}
              onClick={expand}
              className={PROMPT_BOX_EXPAND_BUTTON_CLASS}
            >
              <MaximizeIcon aria-hidden className="size-4" />
            </button>

            {showCompactText ? (
              <button
                type="button"
                data-slot="prompt-box-compact-prompt"
                aria-label={compactText}
                onClick={expand}
                className={PROMPT_BOX_SCROLL_COMPACT_PROMPT_CLASS}
              >
                <CompactPromptText text={compactText} />
              </button>
            ) : (
              <Action
                variant={customPromptAction.variant}
                focused={customPromptAction.focused}
                label={customPromptAction.label || PROMPT_BOX_CUSTOM_PROMPT_LABEL}
                assetKey={customPromptAction.assetKey}
                imageSrc={customPromptAction.imageSrc}
                imageAlt={customPromptAction.imageAlt}
                onClick={(event) => {
                  if (!interactive) {
                    event.preventDefault();
                    return;
                  }
                  customPromptAction.onClick?.(event);
                  if (event.defaultPrevented) return;
                  onActionClick?.(customPromptAction, event);
                  if (event.defaultPrevented) return;
                  setIsCustomPromptMode(true);
                  focusPromptWhenExpandedRef.current = true;
                  expand();
                }}
              />
            )}
          </div>

          <PromptBoxGenerateAction
            compact
            variant={generateActionVariant}
            tokenCost={tokenCost}
            generateLabel={generateLabel}
            disabled={generateDisabled}
            className="shrink-0"
            onClick={generateActionVariant === "upgrade" ? (onUpgrade ?? onGenerate) : onGenerate}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      data-slot="prompt-box"
      data-layout="responsive"
      data-media={media}
      data-compact="false"
      data-prompt-locked={promptLocked ? "true" : "false"}
      data-interactive={interactive ? "true" : "false"}
      className={cn(
        PROMPT_BOX_SHELL_CLASS,
        isCompact ? PROMPT_BOX_COMPACT_MAX_WIDTH_CLASS : PROMPT_BOX_DESKTOP_MAX_WIDTH_CLASS,
        className,
      )}
      {...props}
    >
      <div data-slot="prompt-box-container" className={PROMPT_BOX_CONTAINER_CLASS}>
        {shouldShowSources ? (
          <div data-slot="prompt-box-sources-row" className="relative w-full min-w-0 shrink-0">
            <div data-slot="prompt-box-sources" className={PROMPT_BOX_SOURCES_ABSOLUTE_CLASS}>
              {placeholders.map((slot, index) => {
                if (isPromptBoxAudioPlaceholder(slot) && slot.selected) {
                  return (
                    <div
                      key={`${slot.title ?? "audio"}-${index}`}
                      data-slot="prompt-box-audio-compact-wrap"
                      className={PROMPT_BOX_AUDIO_COMPACT_WRAP_CLASS}
                    >
                      <AudioMsg
                        variant="compact"
                        src={slot.audioSrc ?? audioSrc}
                        label={slot.audioLabel ?? slot.title ?? "Audio"}
                        className="absolute -top-6 w-full max-w-none min-w-0 min-[699px]:-top-5 md:-top-9"
                        onDismiss={interactive ? () => slot.onClear?.() : undefined}
                      />
                    </div>
                  );
                }

                return (
                  <Placeholder
                    key={`${slot.title ?? "placeholder"}-${index}`}
                    title={slot.title}
                    subtitle={slot.subtitle}
                    selected={slot.selected}
                    defaultSelected={slot.defaultSelected}
                    imageSrc={slot.imageSrc}
                    imageAlt={slot.imageAlt}
                    caption={slot.caption}
                    onClick={interactive ? slot.onClick : undefined}
                    onSelectedChange={interactive ? slot.onSelectedChange : undefined}
                    onClear={interactive ? slot.onClear : undefined}
                  />
                );
              })}

              {shouldShowAudioCompact ? (
                <div
                  data-slot="prompt-box-audio-compact-wrap"
                  className={PROMPT_BOX_AUDIO_COMPACT_WRAP_CLASS}
                >
                  <AudioMsg
                    variant="compact"
                    src={audioSrc}
                    className="w-full max-w-none min-w-0"
                  />
                </div>
              ) : null}
            </div>

            <div data-slot="prompt-box-sources-toolbar" className={PROMPT_BOX_SOURCES_SPACER_CLASS}>
              {shouldShowCheckpointPicker ? (
                <PromptBoxCheckpointPicker
                  className={PROMPT_BOX_SHOW_FROM_DESKTOP_BLOCK_CLASS}
                  {...checkpointPickerProps}
                />
              ) : null}
            </div>
          </div>
        ) : null}

        {shouldShowActions ? (
          <div data-slot="prompt-box-actions" className={PROMPT_BOX_ACTIONS_CLASS}>
            {resolvedActions.map((action, index) => (
              <Action
                key={action.id ?? `${action.label}-${index}`}
                variant={action.variant}
                focused={action.focused}
                label={action.label}
                assetKey={action.assetKey}
                imageSrc={action.imageSrc}
                imageAlt={action.imageAlt}
                onClick={(event) => {
                  if (!interactive) {
                    event.preventDefault();
                    return;
                  }
                  action.onClick?.(event);
                  if (event.defaultPrevented) return;
                  onActionClick?.(action, event);
                  if (event.defaultPrevented) return;
                  if (action.id === PROMPT_BOX_CUSTOM_PROMPT_ACTION_ID) {
                    setIsCustomPromptMode(true);
                  } else {
                    setIsCustomPromptMode(false);
                  }
                }}
              />
            ))}

            {shouldShowSeeAll ? (
              <Button
                type="button"
                variant="ghost"
                disableActiveEffect
                data-slot="prompt-box-see-all"
                aria-label={seeAllLabel}
                onClick={interactive ? onSeeAllClick : undefined}
                className={cn(
                  "text-tooltip-text size-auto min-h-0 shrink-0 rounded-none p-0",
                  "text-sm leading-5 font-normal",
                  "hover:text-tooltip-text hover:bg-transparent dark:hover:bg-transparent",
                  "focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:outline-none",
                )}
              >
                {seeAllLabel}
              </Button>
            ) : null}
          </div>
        ) : null}

        {shouldShowPromptField ? (
          <div
            data-slot="prompt-box-prompt-field"
            className={cn(
              PROMPT_BOX_PROMPT_FIELD_CLASS,
              promptLocked && "overflow-visible",
              hasPromptTags && !promptLocked && "gap-x-2 gap-y-1.5",
            )}
          >
            {promptLocked ? (
              lockedPrompt
            ) : (
              <>
                {promptTags.map((tag, index) => (
                  <div
                    key={`${tag.prefix ?? "tag"}-${tag.prompt}-${index}`}
                    data-slot="prompt-box-prompt-tag"
                    className="inline-flex max-w-full min-w-0 items-center gap-1.5"
                  >
                    {tag.prefix ? (
                      <span className="text-sm leading-5 font-normal text-[#a3a3a3]">
                        {tag.prefix}
                      </span>
                    ) : null}
                    <VideoPromptText
                      prompt={tag.prompt}
                      clapperIconSrc={tag.clapperIconSrc}
                      dismissLabel={tag.dismissLabel}
                      onDismiss={interactive ? tag.onDismiss : undefined}
                      className="w-fit max-w-full"
                    />
                  </div>
                ))}

                {promptField}
              </>
            )}
          </div>
        ) : null}

        <div data-slot="prompt-box-controls" className="flex min-w-0 shrink-0 items-center gap-2">
          <div
            data-slot="prompt-box-settings"
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2",
              isCompact ? "min-h-11" : "flex-wrap",
            )}
          >
            {isCompact ? (promptLocked ? lockedPrompt : promptField) : null}
            {!isCompact && showInfoButton ? (
              <InfoButton
                status={infoButtonStatus}
                onClick={interactive ? onInfoButtonClick : undefined}
                className={PROMPT_BOX_SHOW_FROM_DESKTOP_FLEX_CLASS}
              />
            ) : null}
            {settingsSlot}

            {visibleControlButtons.map((button, index) => {
              const { kind, ...controlButton } = button;
              const isImageModeButton = kind === "image-mode";
              const isDurationButton = kind === "duration";
              const isResolutionButton = kind === "resolution";
              const showOnMobile = isImageModeButton || (!hasImageModeControlButton && index === 0);
              const desktopOnlyClassName = cn(
                !showOnMobile && PROMPT_BOX_SHOW_FROM_DESKTOP_BLOCK_CLASS,
              );

              if (isImageModeButton) {
                return (
                  <PromptBoxImageModePicker
                    key={button.menuLabel ?? button.label}
                    open={interactive ? undefined : false}
                    onOpenChange={interactive ? undefined : () => {}}
                    options={modePicker.options}
                    value={imageModeValue}
                    defaultValue={
                      defaultImageModeValue ||
                      (modePicker.options.some((option) => option.value === media)
                        ? media
                        : modePicker.defaultValue)
                    }
                    onValueChange={interactive ? onImageModeValueChange : undefined}
                    dropdownTitle={modePicker.dropdownTitle}
                    modalTitle={modePicker.modalTitle}
                    modalIconSrc={modePicker.modalIconSrc}
                    modalDescription={modePicker.modalDescription}
                    className={desktopOnlyClassName}
                  />
                );
              }

              if (isDurationButton) {
                return (
                  <PromptBoxDurationPicker
                    key={button.menuLabel ?? "duration"}
                    open={interactive ? undefined : false}
                    onOpenChange={interactive ? undefined : () => {}}
                    value={controlButton.value}
                    defaultValue={controlButton.defaultValue ?? PROMPT_BOX_DEFAULT_DURATION}
                    onValueChange={interactive ? controlButton.onValueChange : undefined}
                    leftIconSrc={controlButton.leftIconSrc}
                    menuLabel={controlButton.menuLabel ?? PROMPT_BOX_DURATION_MENU_LABEL}
                    className={desktopOnlyClassName}
                  />
                );
              }

              if (isResolutionButton) {
                return (
                  <PromptBoxResolutionPicker
                    key={button.menuLabel ?? "resolution"}
                    open={interactive ? undefined : false}
                    onOpenChange={interactive ? undefined : () => {}}
                    value={controlButton.value}
                    defaultValue={controlButton.defaultValue ?? PROMPT_BOX_DEFAULT_RESOLUTION}
                    onValueChange={interactive ? controlButton.onValueChange : undefined}
                    leftIconSrc={controlButton.leftIconSrc}
                    menuLabel={controlButton.menuLabel ?? PROMPT_BOX_RESOLUTION_MENU_LABEL}
                    className={desktopOnlyClassName}
                  />
                );
              }

              return (
                <PromptBoxControlButton
                  key={button.menuLabel ?? button.label}
                  {...controlButton}
                  disableMenu={!interactive}
                  onValueChange={interactive ? controlButton.onValueChange : undefined}
                  dropdownVerticalDirection="up"
                  menuLabel={button.menuLabel ?? button["aria-label"] ?? button.label}
                  wrapperClassName={desktopOnlyClassName}
                />
              );
            })}

            {!isCompact && shouldShowSettingsButton ? (
              <PromptBoxSettingsButton
                aria-label={settingsLabel}
                onClick={interactive ? onSettingsClick : undefined}
                className={PROMPT_BOX_SHOW_UNTIL_DESKTOP_CLASS}
              />
            ) : null}
          </div>
          {!isCompact && showSkipQueue ? (
            <SkipQueueBtn
              disabled={skipQueueDisabled}
              onDisabledChange={interactive ? onSkipQueueDisabledChange : undefined}
              className={PROMPT_BOX_SHOW_FROM_DESKTOP_FLEX_CLASS}
            />
          ) : null}
          {footerSlot ?? (
            <PromptBoxGenerateAction
              variant={generateActionVariant}
              tokenCost={tokenCost}
              generateLabel={generateLabel}
              disabled={generateDisabled}
              onClick={
                interactive
                  ? generateActionVariant === "upgrade"
                    ? (onUpgrade ?? onGenerate)
                    : onGenerate
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

export { PromptBoxCheckpointPicker } from "./components/prompt-box-checkpoint-picker";
export { PromptBoxControlButton } from "./components/prompt-box-control-button";
export { PromptBoxDurationPicker } from "./components/prompt-box-duration-picker";
export {
  PromptBoxGenerateAction,
  type PromptBoxGenerateActionVariant,
} from "./components/prompt-box-generate-action";
export { PromptBoxImageModePicker } from "./components/prompt-box-image-mode-picker";
export { PromptBoxResolutionPicker } from "./components/prompt-box-resolution-picker";
export { PromptBoxSettingsButton } from "./components/prompt-box-settings-button";
export {
  formatPromptBoxDuration,
  getPromptBoxCheckpointDefaultValue,
  getPromptBoxCheckpointDropdownTitle,
  getPromptBoxCheckpointModalTitle,
  getPromptBoxCheckpointOptions,
  getPromptBoxCheckpointTriggerLabel,
  getPromptBoxDefaultActions,
  getPromptBoxDefaultControlButtons,
  getPromptBoxDefaultPlaceholders,
  getPromptBoxModePickerConfig,
  isPromptBoxAudioPlaceholder,
  isPromptBoxCheckpointPremium,
  isPromptBoxVideoMedia,
  parsePromptBoxDurationSeconds,
  PROMPT_BOX_ACTIONS_CLASS,
  PROMPT_BOX_AUDIO_COMPACT_WRAP_CLASS,
  PROMPT_BOX_CHECKPOINT_DEFAULT_VALUE,
  PROMPT_BOX_CHECKPOINT_ICON_SRC,
  PROMPT_BOX_CHECKPOINT_IMAGE_DEFAULT_VALUE,
  PROMPT_BOX_CHECKPOINT_IMAGE_DROPDOWN_TITLE,
  PROMPT_BOX_CHECKPOINT_IMAGE_MODAL_TITLE,
  PROMPT_BOX_CHECKPOINT_IMAGE_OPTIONS,
  PROMPT_BOX_CHECKPOINT_OPTIONS,
  PROMPT_BOX_CHECKPOINT_VIDEO_DEFAULT_VALUE,
  PROMPT_BOX_CHECKPOINT_VIDEO_DROPDOWN_TITLE,
  PROMPT_BOX_CHECKPOINT_VIDEO_MODAL_TITLE,
  PROMPT_BOX_CHECKPOINT_VIDEO_OPTIONS,
  PROMPT_BOX_COMPACT_MAX_WIDTH_CLASS,
  PROMPT_BOX_CONTAINER_CLASS,
  PROMPT_BOX_CROWN_ICON_SRC,
  PROMPT_BOX_CUSTOM_PROMPT_ACTION_ID,
  PROMPT_BOX_CUSTOM_PROMPT_LABEL,
  PROMPT_BOX_DEFAULT_CHECKPOINT_LABEL,
  PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTION,
  PROMPT_BOX_DEFAULT_CUSTOM_PROMPT_ACTIONS,
  PROMPT_BOX_DEFAULT_DURATION,
  PROMPT_BOX_DEFAULT_IMAGE_CONTROL_BUTTONS,
  PROMPT_BOX_DEFAULT_IMAGE_EDIT_PLACEHOLDERS,
  PROMPT_BOX_DEFAULT_IMAGE_PRESET_PLACEHOLDERS,
  PROMPT_BOX_DEFAULT_MOBILE_CONTROL_BUTTONS,
  PROMPT_BOX_DEFAULT_PLACEHOLDER_TEXT,
  PROMPT_BOX_DEFAULT_PRESET_ACTIONS,
  PROMPT_BOX_DEFAULT_RESOLUTION,
  PROMPT_BOX_DEFAULT_SPEECH2VID_PLACEHOLDERS,
  PROMPT_BOX_DEFAULT_TOKEN_COST,
  PROMPT_BOX_DEFAULT_VIDEO_CONTROL_BUTTONS,
  PROMPT_BOX_DEFAULT_VIDEO_EDIT_PLACEHOLDERS,
  PROMPT_BOX_DESKTOP_MAX_WIDTH_CLASS,
  PROMPT_BOX_DESKTOP_MIN_WIDTH,
  PROMPT_BOX_DURATION_ICON_SRC,
  PROMPT_BOX_DURATION_MAX_SECONDS,
  PROMPT_BOX_DURATION_MENU_LABEL,
  PROMPT_BOX_DURATION_MIN_SECONDS,
  PROMPT_BOX_DURATION_OPTIONS,
  PROMPT_BOX_EDIT_IMAGE_CONTROL_LABEL,
  PROMPT_BOX_EDIT_VIDEO_CONTROL_LABEL,
  PROMPT_BOX_FREE_LABEL,
  PROMPT_BOX_IMAGE_MODE_DEFAULT_VALUE,
  PROMPT_BOX_IMAGE_MODE_DROPDOWN_TITLE,
  PROMPT_BOX_IMAGE_MODE_EDIT_ICON_SRC,
  PROMPT_BOX_IMAGE_MODE_MODAL_DESCRIPTION,
  PROMPT_BOX_IMAGE_MODE_MODAL_ICON_SRC,
  PROMPT_BOX_IMAGE_MODE_MODAL_TITLE,
  PROMPT_BOX_IMAGE_MODE_OPTIONS,
  PROMPT_BOX_IMAGE_MODE_PRESETS_ICON_SRC,
  PROMPT_BOX_LOCKED_PROMPT_ROW_CLASS,
  PROMPT_BOX_LOCKED_PROMPT_TEXT_CLASS,
  PROMPT_BOX_LOCKED_PROMPT_TEXT_INNER_CLASS,
  PROMPT_BOX_PRESETS_CONTROL_LABEL,
  PROMPT_BOX_PROMPT_FIELD_CLASS,
  PROMPT_BOX_RESOLUTION_ICON_SRC,
  PROMPT_BOX_RESOLUTION_MENU_LABEL,
  PROMPT_BOX_RESOLUTION_OPTIONS,
  PROMPT_BOX_SEE_ALL_LABEL,
  PROMPT_BOX_SETTINGS_ICON_SRC,
  PROMPT_BOX_SHELL_CLASS,
  PROMPT_BOX_SHOW_FROM_DESKTOP_BLOCK_CLASS,
  PROMPT_BOX_SHOW_FROM_DESKTOP_FLEX_CLASS,
  PROMPT_BOX_SHOW_UNTIL_DESKTOP_CLASS,
  PROMPT_BOX_SOURCES_ABSOLUTE_CLASS,
  PROMPT_BOX_SOURCES_SPACER_CLASS,
  PROMPT_BOX_TEXT_TO_IMAGE_CONTROL_LABEL,
  PROMPT_BOX_TEXT_TO_VIDEO_CONTROL_LABEL,
  PROMPT_BOX_TEXTAREA_CLASS,
  PROMPT_BOX_TEXTAREA_MAX_LINES_DESKTOP,
  PROMPT_BOX_TOKEN_ICON_SRC,
  PROMPT_BOX_UNLOCK_PROMPT_BUTTON_CLASS,
  PROMPT_BOX_UNLOCK_PROMPT_LABEL,
  PROMPT_BOX_UPGRADE_LABEL,
  PROMPT_BOX_VIDEO_MODE_AUDIO_TO_VIDEO_ICON_SRC,
  PROMPT_BOX_VIDEO_MODE_AUDIO_TO_VIDEO_LABEL,
  PROMPT_BOX_VIDEO_MODE_DEFAULT_VALUE,
  PROMPT_BOX_VIDEO_MODE_DROPDOWN_TITLE,
  PROMPT_BOX_VIDEO_MODE_EDIT_ICON_SRC,
  PROMPT_BOX_VIDEO_MODE_EXTEND_ICON_SRC,
  PROMPT_BOX_VIDEO_MODE_EXTEND_LABEL,
  PROMPT_BOX_VIDEO_MODE_IMAGE_TO_VIDEO_ICON_SRC,
  PROMPT_BOX_VIDEO_MODE_IMAGE_TO_VIDEO_LABEL,
  PROMPT_BOX_VIDEO_MODE_MODAL_DESCRIPTION,
  PROMPT_BOX_VIDEO_MODE_MODAL_ICON_SRC,
  PROMPT_BOX_VIDEO_MODE_MODAL_TITLE,
  PROMPT_BOX_VIDEO_MODE_OPTIONS,
} from "./prompt-box.constants";
export type {
  PromptBoxActionItem,
  PromptBoxCheckpointOption,
  PromptBoxControlButton as PromptBoxControlButtonConfig,
  PromptBoxControlButtonKind,
  PromptBoxImageModeOption,
  PromptBoxMedia,
  PromptBoxPlaceholderKind,
  PromptBoxPlaceholderSlot,
  PromptBoxPromptTag,
  PromptBoxResolutionOption,
} from "./prompt-box.types";
