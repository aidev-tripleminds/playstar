import type * as React from "react";

import type { PlaceholdersHybridStatus } from "@/components/common/generate/placeholders-hybrid";

export type PromptboxHybridMedia =
  | "image-presets"
  | "image-edit"
  | "video-presets"
  | "video-image2vid"
  | "video-extend"
  | "video-edit"
  | "video-speech2vid";

export type PromptboxHybridTab = {
  label: string;
};

export type PromptboxHybridPlaceholderSlot = {
  title?: string;
  subtitle?: string;
  status?: PlaceholdersHybridStatus;
  defaultStatus?: PlaceholdersHybridStatus;
  imageSrc?: string;
  imageAlt?: string;
  audioLabel?: string;
  onStatusChange?: (status: PlaceholdersHybridStatus) => void;
  onClear?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onPlay?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};
