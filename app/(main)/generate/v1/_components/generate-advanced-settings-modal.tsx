"use client";

import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { Buttons } from "@/components/common/general/button/buttons";
import { Dropdown } from "@/components/common/general/dropdown/dropdown";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { OPTION_LIST_SURFACE_CLASSNAME } from "@/components/common/general/option-list/option-list";
import {
  RATIO_ICON_RATIOS,
  RatioIcon,
  type RatioIconRatio,
} from "@/components/common/generate/ratio-icon";
import { DialogDescription } from "@/components/ui/dialog";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";

import {
  clampGenerateStyle,
  GENERATE_ADVANCED_SETTINGS_APPLY_LABEL,
  GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_LABEL,
  GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_OPTIONS,
  GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_LABEL,
  GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_OPTIONS,
  GENERATE_ADVANCED_SETTINGS_CANCEL_LABEL,
  GENERATE_ADVANCED_SETTINGS_DEFAULTS,
  GENERATE_ADVANCED_SETTINGS_FIELDS,
  GENERATE_ADVANCED_SETTINGS_GENERATIONS_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_GENERATIONS_LABEL,
  GENERATE_ADVANCED_SETTINGS_GENERATIONS_OPTIONS,
  GENERATE_ADVANCED_SETTINGS_RESOLUTION_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_RESOLUTION_LABEL,
  GENERATE_ADVANCED_SETTINGS_RESOLUTION_OPTIONS,
  GENERATE_ADVANCED_SETTINGS_STYLE_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_TITLE,
  GENERATE_ADVANCED_SETTINGS_TITLE_ICON_SRC,
  GENERATE_ASPECT_RATIO_MODAL_TITLE,
  GENERATE_AUTO_SKIP_MODAL_TITLE,
  GENERATE_DESKTOP_BREAKPOINT,
  GENERATE_GENERATIONS_MODAL_TITLE,
  GENERATE_RESOLUTION_MODAL_TITLE,
  type GenerateAdvancedSettingsField,
  type GenerateAdvancedSettingsValues,
  type GenerateStyleMode,
  getGenerateAdvancedSettingsStyleLabel,
  getGenerateStyleDropdownOptions,
} from "../_lib/constants";
import { GenerateDurationSlider } from "./generate-duration-slider";
import {
  GenerateSettingsPickerModal,
  type GenerateSettingsPickerOption,
} from "./generate-settings-picker-modal";
import { GenerateStyleModal } from "./generate-style-modal";

export type GenerateAdvancedSettingsModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  values?: GenerateAdvancedSettingsValues;
  onApply?: (values: GenerateAdvancedSettingsValues) => void;
  onCancel?: () => void;
  visibleFields?: readonly GenerateAdvancedSettingsField[];
  styleMode?: GenerateStyleMode;
  className?: string;
};

type AdvancedSettingsPickerId = keyof GenerateAdvancedSettingsValues;
type GenericSettingsPickerId = Exclude<AdvancedSettingsPickerId, "style" | "duration">;

function valuesEqual(
  a: GenerateAdvancedSettingsValues,
  b: GenerateAdvancedSettingsValues,
  fields: readonly GenerateAdvancedSettingsField[] = GENERATE_ADVANCED_SETTINGS_FIELDS,
) {
  return fields.every((field) => a[field] === b[field]);
}

function toRatioIconRatio(value: string): RatioIconRatio {
  return RATIO_ICON_RATIOS.includes(value as RatioIconRatio)
    ? (value as RatioIconRatio)
    : RATIO_ICON_RATIOS[0];
}

function getPickerConfig(picker: GenericSettingsPickerId): {
  title: string;
  titleIconSrc: string;
  closeLabel: string;
  description: string;
  options: GenerateSettingsPickerOption[];
} {
  switch (picker) {
    case "aspectRatio":
      return {
        title: GENERATE_ASPECT_RATIO_MODAL_TITLE,
        titleIconSrc: GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_ICON_SRC,
        closeLabel: "Close aspect ratio",
        description: "Choose an aspect ratio.",
        options: GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
          leftIcon: <RatioIcon ratio={toRatioIconRatio(option.value)} className="text-current" />,
        })),
      };
    case "generations":
      return {
        title: GENERATE_GENERATIONS_MODAL_TITLE,
        titleIconSrc: GENERATE_ADVANCED_SETTINGS_GENERATIONS_ICON_SRC,
        closeLabel: "Close number of generations",
        description: "Choose how many images to generate.",
        options: GENERATE_ADVANCED_SETTINGS_GENERATIONS_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      };
    case "autoSkipQueue":
      return {
        title: GENERATE_AUTO_SKIP_MODAL_TITLE,
        titleIconSrc: GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_ICON_SRC,
        closeLabel: "Close auto skip queue",
        description: "Choose whether to auto skip the queue.",
        options: GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_OPTIONS.map((option) => ({
          value: option.value,
          label: option.label,
        })),
      };
    case "resolution":
      return {
        title: GENERATE_RESOLUTION_MODAL_TITLE,
        titleIconSrc: GENERATE_ADVANCED_SETTINGS_RESOLUTION_ICON_SRC,
        closeLabel: "Close resolution",
        description: "Choose a video resolution.",
        options: GENERATE_ADVANCED_SETTINGS_RESOLUTION_OPTIONS.map((option) => ({
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
      };
  }
}

function isFieldVisible(
  fields: readonly GenerateAdvancedSettingsField[],
  field: GenerateAdvancedSettingsField,
) {
  return fields.includes(field);
}

export function GenerateAdvancedSettingsModal({
  open = false,
  onOpenChange,
  values = GENERATE_ADVANCED_SETTINGS_DEFAULTS,
  onApply,
  onCancel,
  visibleFields = GENERATE_ADVANCED_SETTINGS_FIELDS,
  styleMode = "create",
  className,
}: GenerateAdvancedSettingsModalProps) {
  const isDesktop = useIsDesktop(GENERATE_DESKTOP_BREAKPOINT);
  const styleOptions = getGenerateStyleDropdownOptions(styleMode);
  const [draft, setDraft] = React.useState<GenerateAdvancedSettingsValues>(() => ({
    ...values,
    style: clampGenerateStyle(values.style, styleMode),
  }));
  const [activePicker, setActivePicker] = React.useState<AdvancedSettingsPickerId | null>(null);
  const [prevOpen, setPrevOpen] = React.useState(open);

  // Reset draft/picker while rendering when the controlled `open` prop changes.
  // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (open !== prevOpen) {
    setPrevOpen(open);
    setActivePicker(null);
    if (open) {
      setDraft({
        ...values,
        style: clampGenerateStyle(values.style, styleMode),
      });
    }
  }

  const hasChanges = !valuesEqual(draft, values, visibleFields);
  const showStyle = isFieldVisible(visibleFields, "style");
  const showAspectRatio = isFieldVisible(visibleFields, "aspectRatio");
  const showGenerations = isFieldVisible(visibleFields, "generations");
  const showDuration = isFieldVisible(visibleFields, "duration");
  const showResolution = isFieldVisible(visibleFields, "resolution");
  const showAutoSkipQueue = isFieldVisible(visibleFields, "autoSkipQueue");
  const styleFieldLabel = getGenerateAdvancedSettingsStyleLabel(styleMode);
  const picker =
    activePicker && activePicker !== "style" && activePicker !== "duration"
      ? activePicker
      : "aspectRatio";
  const pickerConfig = getPickerConfig(picker);
  const description =
    showStyle && visibleFields.length === 1
      ? "Choose a style."
      : showDuration
        ? "Choose model, aspect ratio, duration, resolution, and auto skip queue."
        : "Choose style, aspect ratio, number of generations, and auto skip queue.";

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setActivePicker(null);
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange, setActivePicker],
  );

  const handleClose = React.useCallback(() => {
    setActivePicker(null);
    onCancel?.();
    onOpenChange?.(false);
  }, [onCancel, onOpenChange, setActivePicker]);

  const handleApply = React.useCallback(() => {
    onApply?.(draft);
    onOpenChange?.(false);
  }, [draft, onApply, onOpenChange]);

  const updateDraft = React.useCallback(
    <K extends keyof GenerateAdvancedSettingsValues>(
      key: K,
      value: GenerateAdvancedSettingsValues[K],
    ) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
    },
    [setDraft],
  );

  const handlePickerValueChange = React.useCallback(
    (value: string) => {
      if (!activePicker) {
        return;
      }

      if (activePicker === "autoSkipQueue") {
        updateDraft("autoSkipQueue", value === "yes" ? "yes" : "no");
        return;
      }

      updateDraft(activePicker, value);
    },
    [activePicker, updateDraft],
  );

  const togglePicker = React.useCallback(
    (pickerId: AdvancedSettingsPickerId) => {
      setActivePicker((prev) => (prev === pickerId ? null : pickerId));
    },
    [setActivePicker],
  );

  const handlePickerOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setActivePicker(null);
      }
    },
    [setActivePicker],
  );

  const aspectRatioOptions = React.useMemo(
    () =>
      GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
        leftIcon: <RatioIcon ratio={toRatioIconRatio(option.value)} className="text-current" />,
      })),
    [],
  );
  const styleOverlayMenu = (
    <div
      data-slot="dropdown-menu-surface"
      className={cn(
        OPTION_LIST_SURFACE_CLASSNAME,
        "flex max-h-[378px] min-h-0 w-full flex-1 flex-col overflow-hidden shadow-none",
      )}
    >
      <GenerateStyleModal
        inline
        open
        mode={styleMode}
        value={draft.style}
        onOpenChange={handlePickerOpenChange}
        onValueChange={(nextStyle) => updateDraft("style", nextStyle)}
      />
    </div>
  );

  const resolutionOverlayMenu = (
    <div
      data-slot="dropdown-menu-surface"
      className={cn(
        OPTION_LIST_SURFACE_CLASSNAME,
        "flex min-h-0 w-full flex-1 flex-col overflow-hidden shadow-none",
      )}
    >
      <GenerateSettingsPickerModal
        inline
        open
        groupLabel=""
        title={GENERATE_RESOLUTION_MODAL_TITLE}
        titleIconSrc={GENERATE_ADVANCED_SETTINGS_RESOLUTION_ICON_SRC}
        closeLabel="Close resolution"
        description="Choose a video resolution."
        value={draft.resolution}
        options={getPickerConfig("resolution").options}
        onOpenChange={handlePickerOpenChange}
        onValueChange={(nextResolution) => updateDraft("resolution", nextResolution)}
      />
    </div>
  );

  const stylePicker = (
    <GenerateStyleModal
      open={showStyle && activePicker === "style"}
      mode={styleMode}
      value={draft.style}
      onOpenChange={handlePickerOpenChange}
      onValueChange={(nextStyle) => updateDraft("style", nextStyle)}
    />
  );

  const genericPicker = (
    <GenerateSettingsPickerModal
      open={
        activePicker !== null &&
        activePicker !== "style" &&
        activePicker !== "duration" &&
        isFieldVisible(visibleFields, activePicker)
      }
      title={pickerConfig.title}
      titleIconSrc={pickerConfig.titleIconSrc}
      closeLabel={pickerConfig.closeLabel}
      description={pickerConfig.description}
      value={draft[picker]}
      options={pickerConfig.options}
      onOpenChange={handlePickerOpenChange}
      onValueChange={handlePickerValueChange}
    />
  );

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
        closeLabel="Close advanced settings"
        onClose={onCancel}
        className={cn(
          "z-999 flex! flex-col overflow-visible",
          showDuration ? "max-h-[580px]!" : "max-h-[496px]!",
          className,
        )}
        innerClassName="flex min-h-0 flex-1 flex-col overflow-visible gap-4"
      >
        <div
          data-slot="generate-advanced-settings-modal"
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <DialogDescription className="sr-only">{description}</DialogDescription>

          <div
            data-slot="generate-advanced-settings-scroll"
            className="flex min-h-0 w-full flex-1 flex-col gap-2 overflow-visible"
          >
            {showStyle ? (
              <Dropdown
                label={styleFieldLabel}
                value={draft.style}
                options={[...styleOptions]}
                leftIconSrc={GENERATE_ADVANCED_SETTINGS_STYLE_ICON_SRC}
                widthMode="trigger"
                {...(isDesktop
                  ? {
                      open: activePicker === "style",
                      onOpenChange: (nextOpen: boolean) => {
                        setActivePicker(nextOpen ? "style" : null);
                      },
                      menu: styleOverlayMenu,
                      menuMaxHeight: 378,
                    }
                  : {
                      disableMenu: true,
                      expanded: activePicker === "style",
                      onTriggerClick: () => togglePicker("style"),
                    })}
              />
            ) : null}

            {showAspectRatio ? (
              <Dropdown
                label={GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_LABEL}
                value={draft.aspectRatio}
                options={aspectRatioOptions}
                leftIconSrc={GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_ICON_SRC}
                widthMode="trigger"
                {...(isDesktop
                  ? {
                      onValueChange: (nextValue: string) => updateDraft("aspectRatio", nextValue),
                    }
                  : {
                      disableMenu: true,
                      expanded: activePicker === "aspectRatio",
                      onTriggerClick: () => togglePicker("aspectRatio"),
                    })}
              />
            ) : null}

            {showGenerations ? (
              <Dropdown
                label={GENERATE_ADVANCED_SETTINGS_GENERATIONS_LABEL}
                value={draft.generations}
                options={[...GENERATE_ADVANCED_SETTINGS_GENERATIONS_OPTIONS]}
                leftIconSrc={GENERATE_ADVANCED_SETTINGS_GENERATIONS_ICON_SRC}
                widthMode="trigger"
                {...(isDesktop
                  ? {
                      onValueChange: (nextValue: string) => updateDraft("generations", nextValue),
                    }
                  : {
                      disableMenu: true,
                      expanded: activePicker === "generations",
                      onTriggerClick: () => togglePicker("generations"),
                    })}
              />
            ) : null}

            {showResolution ? (
              <Dropdown
                label={GENERATE_ADVANCED_SETTINGS_RESOLUTION_LABEL}
                value={draft.resolution}
                options={GENERATE_ADVANCED_SETTINGS_RESOLUTION_OPTIONS.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                leftIconSrc={GENERATE_ADVANCED_SETTINGS_RESOLUTION_ICON_SRC}
                widthMode="trigger"
                {...(isDesktop
                  ? {
                      open: activePicker === "resolution",
                      onOpenChange: (nextOpen: boolean) => {
                        setActivePicker(nextOpen ? "resolution" : null);
                      },
                      menu: resolutionOverlayMenu,
                    }
                  : {
                      disableMenu: true,
                      expanded: activePicker === "resolution",
                      onTriggerClick: () => togglePicker("resolution"),
                    })}
              />
            ) : null}

            {showAutoSkipQueue ? (
              <Dropdown
                label={GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_LABEL}
                value={draft.autoSkipQueue}
                options={[...GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_OPTIONS]}
                leftIconSrc={GENERATE_ADVANCED_SETTINGS_AUTO_SKIP_ICON_SRC}
                widthMode="trigger"
                {...(isDesktop
                  ? {
                      onValueChange: (nextValue: string) =>
                        updateDraft("autoSkipQueue", nextValue === "yes" ? "yes" : "no"),
                    }
                  : {
                      disableMenu: true,
                      expanded: activePicker === "autoSkipQueue",
                      onTriggerClick: () => togglePicker("autoSkipQueue"),
                    })}
              />
            ) : null}

            {showDuration ? (
              <GenerateDurationSlider
                value={draft.duration}
                onValueChange={(nextDuration) => updateDraft("duration", nextDuration)}
              />
            ) : null}
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2">
            <Buttons
              type="button"
              variant="rose"
              size="btn-m"
              label={GENERATE_ADVANCED_SETTINGS_APPLY_LABEL}
              leftIcon={false}
              rightIcon={false}
              disabled={!hasChanges}
              onClick={handleApply}
              className="w-full"
            />
            <Buttons
              type="button"
              variant="neutral"
              size="btn-m"
              label={GENERATE_ADVANCED_SETTINGS_CANCEL_LABEL}
              leftIcon={false}
              rightIcon={false}
              onClick={handleClose}
              className="w-full"
            />
          </div>
        </div>
      </ModalLayout>

      {isDesktop ? null : (
        <>
          {stylePicker}
          {genericPicker}
        </>
      )}
    </>
  );
}
