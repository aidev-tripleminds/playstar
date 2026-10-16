"use client";

import {
  RATIO_ICON_RATIOS,
  RatioIcon,
  type RatioIconRatio,
} from "@/components/common/generate/ratio-icon";

import {
  GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_ICON_SRC,
  GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_OPTIONS,
  GENERATE_ASPECT_RATIO_MODAL_TITLE,
} from "../_lib/constants";
import {
  GenerateSettingsPickerModal,
  type GenerateSettingsPickerModalProps,
  type GenerateSettingsPickerOption,
} from "./generate-settings-picker-modal";

export type GenerateAspectRatioModalProps = Omit<
  GenerateSettingsPickerModalProps,
  "title" | "titleIconSrc" | "closeLabel" | "description" | "options"
> & {
  options?: readonly GenerateSettingsPickerOption[];
};

function toRatioIconRatio(value: string): RatioIconRatio {
  return RATIO_ICON_RATIOS.includes(value as RatioIconRatio)
    ? (value as RatioIconRatio)
    : RATIO_ICON_RATIOS[0];
}

const ASPECT_RATIO_PICKER_OPTIONS: GenerateSettingsPickerOption[] =
  GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
    leftIcon: <RatioIcon ratio={toRatioIconRatio(option.value)} className="text-current" />,
  }));

export function GenerateAspectRatioModal({
  value = GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_OPTIONS[0].value,
  options = ASPECT_RATIO_PICKER_OPTIONS,
  ...props
}: GenerateAspectRatioModalProps) {
  return (
    <GenerateSettingsPickerModal
      title={GENERATE_ASPECT_RATIO_MODAL_TITLE}
      titleIconSrc={GENERATE_ADVANCED_SETTINGS_ASPECT_RATIO_ICON_SRC}
      closeLabel="Close aspect ratio"
      description="Choose an aspect ratio."
      value={value}
      options={options}
      {...props}
    />
  );
}
