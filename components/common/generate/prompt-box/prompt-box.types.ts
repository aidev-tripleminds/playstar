import type * as React from "react";

import type { ButtonSelectProps } from "@/components/common/general/button-select/button-select";
import type { ActionVariant } from "@/components/common/generate/action";
import type { CheckpointThumbnailVariant } from "@/components/common/generate/checkpoint-thumbnail";

export type PromptBoxMedia =
  | "image-presets"
  | "image-edit"
  | "video-presets"
  | "video-image2vid"
  | "video-extend"
  | "video-edit"
  | "video-speech2vid"
  | "compact";

export type PromptBoxPlaceholderKind = "image" | "audio";

export type PromptBoxPlaceholderSlot = {
  title?: string;
  subtitle?: string;
  kind?: PromptBoxPlaceholderKind;
  selected?: boolean;
  defaultSelected?: boolean;
  imageSrc?: string;
  imageAlt?: string;
  /** Selected asset name, shown on the thumbnail. */
  caption?: string;
  /** Extra thumbnails for the compact fan. The slot image is included separately. */
  imageSrcs?: string[];
  /** When set on a selected slot, the compact card becomes the `+N` fan. */
  overflowCount?: number;
  audioSrc?: string;
  audioLabel?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onSelectedChange?: (selected: boolean) => void;
  onClear?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
};

export type PromptBoxActionItem = {
  id?: string;
  variant?: ActionVariant;
  focused?: boolean;
  label: string;
  /** Logical asset key, re-resolved live via `useAsset` on the chip. */
  assetKey?: string;
  imageSrc?: string;
  imageAlt?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export type PromptBoxPromptTag = {
  prefix?: string;
  prompt: string;
  clapperIconSrc?: string;
  dismissLabel?: string;
  onDismiss?: () => void;
};

export type PromptBoxControlButtonKind = "select" | "image-mode" | "duration" | "resolution";

export type PromptBoxResolutionOption = {
  value: string;
  label: string;
  tokenCost?: string;
};

export type PromptBoxControlButton = {
  label: string;
  kind?: PromptBoxControlButtonKind;
  leftIconSrc?: string;
  highlighted?: boolean;
  menuLabel?: string;
  "aria-label"?: string;
} & Pick<
  ButtonSelectProps,
  | "options"
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "widthMode"
  | "showButtonIcon"
  | "showOptionIcons"
  | "dropdownVerticalDirection"
>;

export type PromptBoxImageModeOption = {
  value: string;
  label: string;
  description: string;
  iconSrc: string;
};

export type PromptBoxCheckpointOption = {
  value: string;
  label: string;
  description: string;
  tokenCost: string;
  checkpointVariant: CheckpointThumbnailVariant;
  showUnlimitedBadge?: boolean;
  /** When true, free users open Get Premium instead of selecting this model. */
  premium?: boolean;
};
