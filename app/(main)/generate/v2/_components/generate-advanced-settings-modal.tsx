"use client";

import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { Dropdown } from "@/components/common/general/dropdown/dropdown";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { CheckpointSelector } from "@/components/common/generate/checkpoint-selector";
import {
  getPromptBoxCheckpointDefaultValue,
  getPromptBoxCheckpointModalTitle,
  getPromptBoxCheckpointOptions,
  getPromptBoxCheckpointTriggerLabel,
  isPromptBoxVideoMedia,
  type PromptBoxCheckpointOption,
  type PromptBoxMedia,
} from "@/components/common/generate/prompt-box";
import {
  RATIO_ICON_RATIOS,
  RatioIcon,
  type RatioIconRatio,
} from "@/components/common/generate/ratio-icon";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  AspectRatioIcon,
  ClockIcon,
  FlashIcon,
  InfoIcon,
  LayersIcon,
  ModelTvIcon,
  VideoHorizontal,
} from "@/public/assets/icons";

import {
  GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_LABEL,
  GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_LABEL,
  GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_OPTIONS,
  GENERATE_ADVANCED_SETTINGS_DURATION_LABEL,
  GENERATE_ADVANCED_SETTINGS_GENERATIONS_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_GENERATIONS_LABEL,
  GENERATE_ADVANCED_SETTINGS_MODEL_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_MODEL_LABEL,
  GENERATE_ADVANCED_SETTINGS_RESOLUTION_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_RESOLUTION_LABEL,
  GENERATE_ADVANCED_SETTINGS_TITLE,
  GENERATE_ADVANCED_SETTINGS_TITLE_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_TUTORIAL_LABEL,
  GENERATE_ASPECT_RATIO_MODAL_TITLE,
  GENERATE_ASPECT_RATIO_OPTIONS,
  GENERATE_AUTO_SKIP_MODAL_TITLE,
  GENERATE_DEFAULT_ASPECT_RATIO,
  GENERATE_DEFAULT_DURATION,
  GENERATE_DEFAULT_GENERATION_COUNT,
  GENERATE_DEFAULT_RESOLUTION,
  GENERATE_GENERATIONS_MODAL_TITLE,
  GENERATE_MOBILE_DRAWER_FIT_CLASS,
  GENERATE_RESOLUTION_MODAL_TITLE,
  GENERATE_RESOLUTION_OPTIONS,
  type GenerateAutoSkipQueue,
  getGenerateGenerationCountOptions,
} from "../_lib/constants";
import { GenerateDurationModal } from "./generate-duration-modal";
import { GenerateInfoModal } from "./generate-info-modal";
import {
  GenerateSettingsPickerModal,
  type GenerateSettingsPickerOption,
} from "./generate-settings-picker-modal";

export type GenerateAdvancedSettingsModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  media?: PromptBoxMedia;
  modelValue?: string;
  modelOptions?: readonly PromptBoxCheckpointOption[];
  onModelValueChange?: (value: string) => void;
  aspectRatio?: string;
  onAspectRatioChange?: (value: string) => void;
  generations?: string;
  onGenerationsChange?: (value: string) => void;
  maxGenerationCount?: number;
  resolution?: string;
  onResolutionChange?: (value: string) => void;
  duration?: string;
  onDurationChange?: (value: string) => void;
  autoSkipQueue?: GenerateAutoSkipQueue;
  onAutoSkipQueueChange?: (value: GenerateAutoSkipQueue) => void;
  showAutoSkipQueue?: boolean;
  showTutorial?: boolean;
  onTutorialClick?: () => void;
  onTutorialOpenChange?: (open: boolean) => void;
  className?: string;
};

type AdvancedSettingsPickerId =
  | "tutorial"
  | "model"
  | "aspectRatio"
  | "generations"
  | "duration"
  | "resolution"
  | "autoSkipQueue";

const SETTING_NAMES_FORMAT = new Intl.ListFormat("en", { type: "conjunction" });

function toRatioIconRatio(value: string): RatioIconRatio {
  return RATIO_ICON_RATIOS.includes(value as RatioIconRatio)
    ? (value as RatioIconRatio)
    : RATIO_ICON_RATIOS[0];
}

export function GenerateAdvancedSettingsModal({
  open = false,
  onOpenChange,
  media = "image-presets",
  modelValue,
  modelOptions,
  onModelValueChange,
  aspectRatio = GENERATE_DEFAULT_ASPECT_RATIO,
  onAspectRatioChange,
  generations = GENERATE_DEFAULT_GENERATION_COUNT,
  onGenerationsChange,
  maxGenerationCount,
  resolution = GENERATE_DEFAULT_RESOLUTION,
  onResolutionChange,
  duration = GENERATE_DEFAULT_DURATION,
  onDurationChange,
  autoSkipQueue = "no",
  onAutoSkipQueueChange,
  showAutoSkipQueue = true,
  showTutorial = true,
  onTutorialClick,
  onTutorialOpenChange,
  className,
}: GenerateAdvancedSettingsModalProps) {
  const [activePicker, setActivePicker] = React.useState<AdvancedSettingsPickerId | null>(null);
  const [prevOpen, setPrevOpen] = React.useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    setActivePicker(null);
  }

  const modelPickerTitle = getPromptBoxCheckpointModalTitle(media);
  const resolvedModelOptions = modelOptions ?? getPromptBoxCheckpointOptions(media);
  const resolvedModelValue = modelValue ?? getPromptBoxCheckpointDefaultValue(media);
  const isVideoMedia = isPromptBoxVideoMedia(media);
  const shouldShowAutoSkipQueue = showAutoSkipQueue;
  // An edit keeps its source image's ratio, so there is nothing to pick.
  const showAspectRatio = media !== "image-edit";
  const settingNames = [
    ...(showTutorial ? ["tutorial"] : []),
    "model",
    ...(showAspectRatio ? ["aspect ratio"] : []),
    ...(isVideoMedia ? ["duration", "resolution"] : ["number of generations"]),
    ...(shouldShowAutoSkipQueue ? ["auto skip queue"] : []),
  ];
  const aspectRatioOptions = React.useMemo(
    (): GenerateSettingsPickerOption[] =>
      GENERATE_ASPECT_RATIO_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
        leftIcon: <RatioIcon ratio={toRatioIconRatio(option.value)} className="text-current" />,
      })),
    [],
  );
  const resolutionOptions = React.useMemo(
    (): GenerateSettingsPickerOption[] =>
      GENERATE_RESOLUTION_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
        badge:
          "tokenCost" in option && option.tokenCost ? (
            <Badge
              type="neutral"
              size="small"
              text={option.tokenCost}
              showIcon
              className="border-border-focus shrink-0 items-end"
            />
          ) : undefined,
      })),
    [],
  );

  const generationCountOptions = React.useMemo(
    () => getGenerateGenerationCountOptions(maxGenerationCount),
    [maxGenerationCount],
  );

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen && activePicker !== null) {
        setActivePicker(null);
        if (activePicker === "tutorial") {
          onTutorialOpenChange?.(false);
        }
        return;
      }

      onOpenChange?.(nextOpen);
    },
    [activePicker, onOpenChange, onTutorialOpenChange],
  );

  const handlePickerOpenChange = React.useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      setActivePicker(null);
    }
  }, []);

  const handleTutorialOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      handlePickerOpenChange(nextOpen);
      onTutorialOpenChange?.(nextOpen);
    },
    [handlePickerOpenChange, onTutorialOpenChange],
  );

  const handleTutorialClick = React.useCallback(() => {
    onTutorialClick?.();
    setActivePicker("tutorial");
    onTutorialOpenChange?.(true);
  }, [onTutorialClick, onTutorialOpenChange]);

  const togglePicker = React.useCallback((pickerId: AdvancedSettingsPickerId) => {
    setActivePicker((prev) => (prev === pickerId ? null : pickerId));
  }, []);

  return (
    <>
      <ModalLayout
        open={open}
        onOpenChange={handleOpenChange}
        title={GENERATE_ADVANCED_SETTINGS_TITLE}
        titleIconSrc={GENERATE_ADVANCED_SETTINGS_TITLE_ICON_SRC}
        showIcon
        showMobileHandle
        overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
        dismissOnOutsideClick={activePicker === null}
        closeLabel="Close advanced settings"
        className={cn(
          "z-999 flex! max-h-[496px]! flex-col overflow-visible pb-8",
          GENERATE_MOBILE_DRAWER_FIT_CLASS,
          className,
        )}
        innerClassName="flex min-h-0 flex-col overflow-visible gap-4"
      >
        <div data-slot="generate-advanced-settings-modal" className="flex min-h-0 flex-col gap-4">
          <DialogDescription className="sr-only">
            {`Choose ${SETTING_NAMES_FORMAT.format(settingNames)}.`}
          </DialogDescription>

          <div
            data-slot="generate-advanced-settings-scroll"
            className="flex min-h-0 w-full flex-col gap-2 overflow-visible"
          >
            {showTutorial ? (
              <Dropdown
                label={GENERATE_ADVANCED_SETTINGS_TUTORIAL_LABEL}
                value="tutorial"
                options={[{ value: "tutorial", label: "" }]}
                leftIcon={<InfoIcon className="text-text-muted-strong size-5" />}
                widthMode="trigger"
                disableMenu
                expanded={activePicker === "tutorial"}
                onTriggerClick={handleTutorialClick}
              />
            ) : null}

            <Dropdown
              label={GENERATE_ADVANCED_SETTINGS_MODEL_LABEL}
              value={resolvedModelValue}
              options={resolvedModelOptions.map((option) => ({
                value: option.value,
                label: getPromptBoxCheckpointTriggerLabel(option.value, resolvedModelOptions),
              }))}
              leftIcon={<ModelTvIcon className="text-text-muted-strong size-5" />}
              widthMode="trigger"
              disableMenu
              expanded={activePicker === "model"}
              onTriggerClick={() => togglePicker("model")}
            />

            {showAspectRatio ? (
              <Dropdown
                label={GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_LABEL}
                value={aspectRatio}
                options={aspectRatioOptions}
                leftIcon={<AspectRatioIcon className="text-text-muted-strong size-5" />}
                widthMode="trigger"
                disableMenu
                expanded={activePicker === "aspectRatio"}
                onTriggerClick={() => togglePicker("aspectRatio")}
              />
            ) : null}

            {isVideoMedia ? (
              <>
                <Dropdown
                  label={GENERATE_ADVANCED_SETTINGS_DURATION_LABEL}
                  value={duration}
                  options={[{ value: duration, label: duration }]}
                  leftIcon={<ClockIcon className="text-text-muted-strong size-5" />}
                  widthMode="trigger"
                  disableMenu
                  expanded={activePicker === "duration"}
                  onTriggerClick={() => togglePicker("duration")}
                />

                <Dropdown
                  label={GENERATE_ADVANCED_SETTINGS_RESOLUTION_LABEL}
                  value={resolution}
                  options={resolutionOptions}
                  leftIcon={<VideoHorizontal className="text-text-muted-strong size-5" />}
                  widthMode="trigger"
                  disableMenu
                  expanded={activePicker === "resolution"}
                  onTriggerClick={() => togglePicker("resolution")}
                />
              </>
            ) : (
              <Dropdown
                label={GENERATE_ADVANCED_SETTINGS_GENERATIONS_LABEL}
                value={generations}
                options={generationCountOptions}
                leftIcon={<LayersIcon className="text-text-muted-strong size-5" />}
                widthMode="trigger"
                disableMenu
                expanded={activePicker === "generations"}
                onTriggerClick={() => togglePicker("generations")}
              />
            )}

            {shouldShowAutoSkipQueue ? (
              <Dropdown
                label={GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_LABEL}
                value={autoSkipQueue}
                options={[...GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_OPTIONS]}
                leftIcon={<FlashIcon className="text-text-muted-strong size-5" />}
                widthMode="trigger"
                disableMenu
                expanded={activePicker === "autoSkipQueue"}
                onTriggerClick={() => togglePicker("autoSkipQueue")}
              />
            ) : null}
          </div>
        </div>
      </ModalLayout>

      <ModalLayout
        open={open && activePicker === "model"}
        onOpenChange={handlePickerOpenChange}
        title={modelPickerTitle}
        titleIconSrc={GENERATE_ADVANCED_SETTINGS_MODEL_ICON_SRC}
        showIcon
        showMobileHandle
        overlayClassName={cn(MODAL_LAYOUT_OVERLAY_CLASSNAME, "z-1000")}
        closeLabel={`Close ${modelPickerTitle}`}
        className={cn(
          "scrollbar-hidden! z-1000 flex! max-h-[496px]! flex-col overflow-hidden",
          GENERATE_MOBILE_DRAWER_FIT_CLASS,
        )}
        innerClassName="flex min-h-0 flex-col gap-4 overflow-hidden scrollbar-hidden"
      >
        <div
          data-slot="generate-advanced-settings-model-picker"
          className="flex min-h-0 w-full flex-col overflow-hidden"
        >
          <DialogDescription className="sr-only">
            Choose an AI model for generation.
          </DialogDescription>
          <div
            data-slot="generate-advanced-settings-model-scroll"
            className="custom-scrollbar min-h-0 overflow-y-auto overscroll-contain"
          >
            <div
              role="radiogroup"
              aria-label={modelPickerTitle}
              className="flex w-full flex-col gap-0.5"
            >
              {resolvedModelOptions.map((option) => {
                const isSelected = option.value === resolvedModelValue;

                return (
                  <CheckpointSelector
                    key={option.value}
                    role="radio"
                    aria-checked={isSelected}
                    aria-pressed={undefined}
                    name={option.label}
                    description={option.description}
                    tokenCost={option.tokenCost}
                    checkpointVariant={option.checkpointVariant}
                    selected={isSelected}
                    showPremiumBadge={option.premium === true}
                    showUnlimitedBadge={option.showUnlimitedBadge}
                    onSelectedChange={() => {
                      onModelValueChange?.(option.value);
                      setActivePicker(null);
                    }}
                    className="w-full max-w-none"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </ModalLayout>

      <GenerateInfoModal
        open={open && activePicker === "tutorial"}
        onOpenChange={handleTutorialOpenChange}
      />

      <GenerateSettingsPickerModal
        open={open && activePicker === "aspectRatio"}
        title={GENERATE_ASPECT_RATIO_MODAL_TITLE}
        titleIconSrc={GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_ICON_SRC}
        closeLabel="Close aspect ratio"
        description="Choose an aspect ratio."
        value={aspectRatio}
        options={aspectRatioOptions}
        onOpenChange={handlePickerOpenChange}
        onValueChange={(nextValue) => onAspectRatioChange?.(nextValue)}
      />

      <GenerateSettingsPickerModal
        open={open && activePicker === "generations"}
        title={GENERATE_GENERATIONS_MODAL_TITLE}
        titleIconSrc={GENERATE_ADVANCED_SETTINGS_GENERATIONS_ICON_SRC}
        closeLabel="Close number of generations"
        description="Choose how many images to generate."
        value={generations}
        options={generationCountOptions}
        onOpenChange={handlePickerOpenChange}
        onValueChange={(nextValue) => onGenerationsChange?.(nextValue)}
      />

      <GenerateDurationModal
        open={open && activePicker === "duration"}
        value={duration}
        onOpenChange={handlePickerOpenChange}
        onValueChange={(nextValue) => onDurationChange?.(nextValue)}
      />

      <GenerateSettingsPickerModal
        open={open && activePicker === "resolution"}
        title={GENERATE_RESOLUTION_MODAL_TITLE}
        titleIconSrc={GENERATE_ADVANCED_SETTINGS_RESOLUTION_ICON_SRC}
        closeLabel="Close resolution"
        description="Choose a video resolution."
        value={resolution}
        options={resolutionOptions}
        onOpenChange={handlePickerOpenChange}
        onValueChange={(nextValue) => onResolutionChange?.(nextValue)}
      />

      {shouldShowAutoSkipQueue ? (
        <GenerateSettingsPickerModal
          open={open && activePicker === "autoSkipQueue"}
          title={GENERATE_AUTO_SKIP_MODAL_TITLE}
          titleIconSrc={GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_ICON_SRC}
          closeLabel="Close auto skip queue"
          description="Choose whether to auto skip the queue."
          value={autoSkipQueue}
          options={[...GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_OPTIONS]}
          onOpenChange={handlePickerOpenChange}
          onValueChange={(nextValue) => onAutoSkipQueueChange?.(nextValue === "yes" ? "yes" : "no")}
        />
      ) : null}
    </>
  );
}
