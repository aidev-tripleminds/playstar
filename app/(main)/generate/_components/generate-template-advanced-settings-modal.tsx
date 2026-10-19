"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { Dropdown } from "@/components/common/general/dropdown/dropdown";
import {
  INNER_MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { Slider } from "@/components/common/general/slider/slider";
import {
  RATIO_ICON_RATIOS,
  RatioIcon,
  type RatioIconRatio,
} from "@/components/common/generate/ratio-icon";
import { DialogDescription } from "@/components/ui/dialog";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";
import { Clock, Mic, Proportions, RectangleHorizontal, Settings } from "lucide-react";

import {
  formatGenerateTemplateDuration,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_APPLY_LABEL,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_ASPECT_RATIO_DROPDOWN_LABEL,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_ASPECT_RATIO_LABEL,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_AUDIO_LABEL,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_CANCEL_LABEL,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_CLASS,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_CLOSE_LABEL,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_DEFAULTS,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_DURATION_DROPDOWN_LABEL,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_DURATION_LABEL,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_OVERLAY_CLASS,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_RESOLUTION_DROPDOWN_LABEL,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_RESOLUTION_LABEL,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_TITLE,
  GENERATE_TEMPLATE_ASPECT_RATIO_MODAL_TITLE,
  GENERATE_TEMPLATE_ASPECT_RATIO_OPTIONS,
  GENERATE_TEMPLATE_AUDIO_MODAL_TITLE,
  GENERATE_TEMPLATE_AUDIO_OPTIONS,
  GENERATE_TEMPLATE_DURATION_MAX_SECONDS,
  GENERATE_TEMPLATE_DURATION_MIN_SECONDS,
  GENERATE_TEMPLATE_RESOLUTION_MODAL_TITLE,
  GENERATE_TEMPLATE_RESOLUTION_OPTIONS,
  type GenerateTemplateAdvancedSettingsValues,
  parseGenerateTemplateDurationSeconds,
} from "../_lib/generate-templates";
import { GenerateTemplateDurationModal } from "./generate-template-duration-modal";
import {
  GenerateTemplateSettingsPickerModal,
  type GenerateTemplateSettingsPickerOption,
} from "./generate-template-settings-picker-modal";

export type GenerateTemplateAdvancedSettingsModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  values?: GenerateTemplateAdvancedSettingsValues;
  onApply?: (values: GenerateTemplateAdvancedSettingsValues) => void;
  className?: string;
};

function toRatioIconRatio(value: string): RatioIconRatio {
  return RATIO_ICON_RATIOS.includes(value as RatioIconRatio)
    ? (value as RatioIconRatio)
    : RATIO_ICON_RATIOS[0];
}

type SettingsChipOption = {
  value: string;
  label: string;
};

type AdvancedSettingsPickerId = "aspectRatio" | "resolution" | "duration" | "audio";

function SettingsChipRow({
  label,
  value,
  options,
  grow = false,
  showRatioIcon = false,
  onValueChange,
}: {
  label: string;
  value: string;
  options: readonly SettingsChipOption[];
  grow?: boolean;
  showRatioIcon?: boolean;
  onValueChange: (value: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-tooltip-text text-sm leading-5 font-medium">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        className={cn(
          "flex w-full items-center gap-2",
          grow ? "min-w-0" : "scrollbar-hidden overflow-x-auto",
        )}
      >
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onValueChange(option.value)}
              className={cn(
                "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 text-sm leading-5 font-medium transition-colors",
                grow ? "min-w-0 flex-1" : "shrink-0",
                isSelected
                  ? "bg-surface-strong text-tooltip-text shadow-[var(--toggle-thumb-shadow)]"
                  : "bg-tooltip-default-bg text-divider-label",
              )}
            >
              {showRatioIcon ? (
                <RatioIcon ratio={toRatioIconRatio(option.value)} className="text-current" />
              ) : null}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function GenerateTemplateAdvancedSettingsModal({
  open = false,
  onOpenChange,
  values = GENERATE_TEMPLATE_ADVANCED_SETTINGS_DEFAULTS,
  onApply,
  className,
}: GenerateTemplateAdvancedSettingsModalProps) {
  const isDesktop = useIsDesktop();
  const [draft, setDraft] = React.useState<GenerateTemplateAdvancedSettingsValues>(values);
  const [activePicker, setActivePicker] = React.useState<AdvancedSettingsPickerId | null>(null);
  const [prevOpen, setPrevOpen] = React.useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    setActivePicker(null);
    if (open) {
      setDraft(values);
    }
  }

  const durationSeconds = parseGenerateTemplateDurationSeconds(draft.duration);

  const aspectRatioOptions = React.useMemo(
    (): GenerateTemplateSettingsPickerOption[] =>
      GENERATE_TEMPLATE_ASPECT_RATIO_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
        leftIcon: <RatioIcon ratio={toRatioIconRatio(option.value)} className="text-current" />,
      })),
    [],
  );

  const handleApply = () => {
    onApply?.(draft);
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onOpenChange?.(false);
  };

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setActivePicker(null);
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  const togglePicker = React.useCallback((pickerId: AdvancedSettingsPickerId) => {
    setActivePicker((current) => (current === pickerId ? null : pickerId));
  }, []);

  const handlePickerOpenChange = React.useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      setActivePicker(null);
    }
  }, []);

  return (
    <>
      <ModalLayout
        open={open}
        onOpenChange={handleOpenChange}
        title={GENERATE_TEMPLATE_ADVANCED_SETTINGS_TITLE}
        titleIcon={<Settings className="size-5" aria-hidden />}
        showIcon
        showMobileHandle
        overlayClassName={cn(
          INNER_MODAL_LAYOUT_OVERLAY_CLASSNAME,
          GENERATE_TEMPLATE_ADVANCED_SETTINGS_OVERLAY_CLASS,
        )}
        closeLabel={GENERATE_TEMPLATE_ADVANCED_SETTINGS_CLOSE_LABEL}
        className={cn(GENERATE_TEMPLATE_ADVANCED_SETTINGS_CLASS, className)}
      >
        <div data-slot="generate-template-advanced-settings-modal" className="flex flex-col gap-4">
          <DialogDescription className="sr-only">
            {isDesktop
              ? "Choose aspect ratio, resolution, and duration for this template."
              : "Choose aspect ratio, resolution, duration, and audio for this template."}
          </DialogDescription>

          {isDesktop ? (
            <>
              <SettingsChipRow
                label={GENERATE_TEMPLATE_ADVANCED_SETTINGS_ASPECT_RATIO_LABEL}
                value={draft.aspectRatio}
                options={GENERATE_TEMPLATE_ASPECT_RATIO_OPTIONS}
                showRatioIcon
                onValueChange={(nextValue) =>
                  setDraft((current) => ({
                    ...current,
                    aspectRatio: nextValue as GenerateTemplateAdvancedSettingsValues["aspectRatio"],
                  }))
                }
              />

              <SettingsChipRow
                label={GENERATE_TEMPLATE_ADVANCED_SETTINGS_RESOLUTION_LABEL}
                value={draft.resolution}
                options={GENERATE_TEMPLATE_RESOLUTION_OPTIONS}
                grow
                onValueChange={(nextValue) =>
                  setDraft((current) => ({
                    ...current,
                    resolution: nextValue as GenerateTemplateAdvancedSettingsValues["resolution"],
                  }))
                }
              />

              <div className="flex w-full flex-col">
                <div className="text-tooltip-text flex w-full items-center justify-between pb-3 text-sm leading-5 font-medium">
                  <p>{GENERATE_TEMPLATE_ADVANCED_SETTINGS_DURATION_LABEL}</p>
                  <span>{formatGenerateTemplateDuration(durationSeconds)}</span>
                </div>
                <Slider
                  min={GENERATE_TEMPLATE_DURATION_MIN_SECONDS}
                  max={GENERATE_TEMPLATE_DURATION_MAX_SECONDS}
                  step={1}
                  value={durationSeconds}
                  onValueChange={(nextSeconds) =>
                    setDraft((current) => ({
                      ...current,
                      duration: formatGenerateTemplateDuration(nextSeconds),
                    }))
                  }
                  minLabel={`${GENERATE_TEMPLATE_DURATION_MIN_SECONDS}s`}
                  maxLabel={`${GENERATE_TEMPLATE_DURATION_MAX_SECONDS}s`}
                  minLabelSuffix=""
                  showSliderValue={false}
                  formatValueLabel={formatGenerateTemplateDuration}
                  aria-label={GENERATE_TEMPLATE_ADVANCED_SETTINGS_DURATION_LABEL}
                  className="flex-col-reverse gap-2 px-0 pt-0 pb-0"
                />
              </div>
            </>
          ) : (
            <div className="flex w-full flex-col gap-2">
              <Dropdown
                label={GENERATE_TEMPLATE_ADVANCED_SETTINGS_ASPECT_RATIO_DROPDOWN_LABEL}
                value={draft.aspectRatio}
                options={aspectRatioOptions}
                leftIcon={<Proportions className="text-text-muted-strong size-5" />}
                widthMode="trigger"
                disableMenu
                expanded={activePicker === "aspectRatio"}
                onTriggerClick={() => togglePicker("aspectRatio")}
              />

              <Dropdown
                label={GENERATE_TEMPLATE_ADVANCED_SETTINGS_RESOLUTION_DROPDOWN_LABEL}
                value={draft.resolution}
                options={[...GENERATE_TEMPLATE_RESOLUTION_OPTIONS]}
                leftIcon={<RectangleHorizontal className="text-text-muted-strong size-5" />}
                widthMode="trigger"
                disableMenu
                expanded={activePicker === "resolution"}
                onTriggerClick={() => togglePicker("resolution")}
              />

              <Dropdown
                label={GENERATE_TEMPLATE_ADVANCED_SETTINGS_DURATION_DROPDOWN_LABEL}
                value={draft.duration}
                options={[{ value: draft.duration, label: draft.duration }]}
                leftIcon={<Clock className="text-text-muted-strong size-5" />}
                widthMode="trigger"
                disableMenu
                expanded={activePicker === "duration"}
                onTriggerClick={() => togglePicker("duration")}
              />

              <Dropdown
                label={GENERATE_TEMPLATE_ADVANCED_SETTINGS_AUDIO_LABEL}
                value={draft.audio}
                options={[...GENERATE_TEMPLATE_AUDIO_OPTIONS]}
                leftIcon={<Mic className="text-text-muted-strong size-5" />}
                widthMode="trigger"
                disableMenu
                expanded={activePicker === "audio"}
                onTriggerClick={() => togglePicker("audio")}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Buttons
              type="button"
              variant="rose"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label={GENERATE_TEMPLATE_ADVANCED_SETTINGS_APPLY_LABEL}
              onClick={handleApply}
              className="w-full"
            />
            <Buttons
              type="button"
              variant="neutral"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label={GENERATE_TEMPLATE_ADVANCED_SETTINGS_CANCEL_LABEL}
              onClick={handleCancel}
              className="w-full"
            />
          </div>
        </div>
      </ModalLayout>

      {isDesktop ? null : (
        <>
          <GenerateTemplateSettingsPickerModal
            open={open && activePicker === "aspectRatio"}
            title={GENERATE_TEMPLATE_ASPECT_RATIO_MODAL_TITLE}
            titleIcon={<Proportions className="size-5" aria-hidden />}
            closeLabel="Close aspect ratio"
            description="Choose an aspect ratio."
            value={draft.aspectRatio}
            options={aspectRatioOptions}
            onOpenChange={handlePickerOpenChange}
            onValueChange={(nextValue) =>
              setDraft((current) => ({
                ...current,
                aspectRatio: nextValue as GenerateTemplateAdvancedSettingsValues["aspectRatio"],
              }))
            }
          />

          <GenerateTemplateSettingsPickerModal
            open={open && activePicker === "resolution"}
            title={GENERATE_TEMPLATE_RESOLUTION_MODAL_TITLE}
            titleIcon={<RectangleHorizontal className="size-5" aria-hidden />}
            closeLabel="Close resolution"
            description="Choose a video resolution."
            value={draft.resolution}
            options={[...GENERATE_TEMPLATE_RESOLUTION_OPTIONS]}
            onOpenChange={handlePickerOpenChange}
            onValueChange={(nextValue) =>
              setDraft((current) => ({
                ...current,
                resolution: nextValue as GenerateTemplateAdvancedSettingsValues["resolution"],
              }))
            }
          />

          <GenerateTemplateDurationModal
            open={open && activePicker === "duration"}
            value={draft.duration}
            onOpenChange={handlePickerOpenChange}
            onValueChange={(nextValue) =>
              setDraft((current) => ({
                ...current,
                duration: nextValue,
              }))
            }
          />

          <GenerateTemplateSettingsPickerModal
            open={open && activePicker === "audio"}
            title={GENERATE_TEMPLATE_AUDIO_MODAL_TITLE}
            titleIcon={<Mic className="size-5" aria-hidden />}
            closeLabel="Close audio"
            description="Choose whether this template includes audio."
            value={draft.audio}
            options={[...GENERATE_TEMPLATE_AUDIO_OPTIONS]}
            onOpenChange={handlePickerOpenChange}
            onValueChange={(nextValue) =>
              setDraft((current) => ({
                ...current,
                audio: nextValue as GenerateTemplateAdvancedSettingsValues["audio"],
              }))
            }
          />
        </>
      )}
    </>
  );
}
