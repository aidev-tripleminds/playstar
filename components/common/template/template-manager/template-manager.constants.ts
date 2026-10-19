import { dummyImage } from "@/lib/dummy-images";
/** Figma Template Manager (node 11979-88085). */
export type TemplateManagerVariant =
  | "select-video"
  | "select-image-char"
  | "loaded"
  | "queue"
  | "processing"
  | "generating"
  | "duo";
export type TemplateManagerSize = "desktop" | "mobile";
export type TemplateManagerFrame = "default" | "duo-source" | "duo-preview";

export const TEMPLATE_MANAGER_VARIANTS = [
  "select-video",
  "select-image-char",
  "loaded",
  "queue",
  "processing",
  "generating",
  "duo",
] as const satisfies readonly TemplateManagerVariant[];

export const TEMPLATE_MANAGER_SIZES = [
  "desktop",
  "mobile",
] as const satisfies readonly TemplateManagerSize[];

export const TEMPLATE_MANAGER_DEFAULT_IMAGE_SRC = dummyImage(176);

export const TEMPLATE_MANAGER_VIDEO_ICON_SRC = "/assets/video-square.svg";
export const TEMPLATE_MANAGER_DELETE_ICON_SRC = "/assets/trash.svg";

export const TEMPLATE_MANAGER_COPY = {
  "select-video": {
    title: "Select video",
    description: "The last frame of the video you upload will be used as first image.",
  },
  "select-image-char": {
    title: "Select Content",
    description: "The content you select will be used as start image for the video.",
  },
} as const;

export const TEMPLATE_MANAGER_PROCESSING_LABEL = "Processing…";
export const TEMPLATE_MANAGER_GENERATING_LABEL = "Generating...";
export const TEMPLATE_MANAGER_CHANGE_LABEL = "Change content";
export const TEMPLATE_MANAGER_DELETE_LABEL = "Delete content";

export const TEMPLATE_MANAGER_DUO_STACK_CLASS = {
  desktop: "h-[344px] w-[214px] shrink-0",
  mobile: "h-auto min-h-0 w-auto min-w-0 flex-1",
} as const;

export type TemplateManagerPairSlots = {
  left: TemplateManagerVariant;
  right: TemplateManagerVariant;
};

export function resolveTemplateManagerPairSlots(
  variant: TemplateManagerVariant,
): TemplateManagerPairSlots {
  if (variant === "select-video") {
    return { left: "select-video", right: "loaded" };
  }

  if (variant === "select-image-char") {
    return { left: "select-image-char", right: "loaded" };
  }

  if (variant === "loaded" || variant === "duo") {
    return { left: "loaded", right: "loaded" };
  }

  if (variant === "processing" || variant === "generating") {
    return { left: "loaded", right: variant };
  }

  return { left: "loaded", right: "queue" };
}

export function isTemplateManagerStatusVariant(variant: TemplateManagerVariant) {
  return variant === "queue" || variant === "processing" || variant === "generating";
}

export function resolveTemplateManagerCopy(variant: TemplateManagerVariant) {
  if (variant === "select-video") return TEMPLATE_MANAGER_COPY["select-video"];
  if (variant === "select-image-char") return TEMPLATE_MANAGER_COPY["select-image-char"];
  return null;
}

export function isTemplateManagerEmptyVariant(variant: TemplateManagerVariant) {
  return variant === "select-video" || variant === "select-image-char";
}

export function isTemplateManagerLoadedInteractive(
  pairVariant: TemplateManagerVariant,
  slot: "primary" | "secondary",
  cardVariant: TemplateManagerVariant,
): boolean {
  if (cardVariant !== "loaded") return false;
  if (pairVariant === "duo") return slot === "primary";
  return slot === "primary";
}

export function isTemplateManagerLoadedDeleteVisible(
  pairVariant: TemplateManagerVariant,
  slot: "primary" | "secondary",
  cardVariant: TemplateManagerVariant,
): boolean {
  if (!isTemplateManagerLoadedInteractive(pairVariant, slot, cardVariant)) return false;
  return !isTemplateManagerStatusVariant(pairVariant);
}

export function resolveTemplateManagerFrameClass(
  size: TemplateManagerSize,
  frame: TemplateManagerFrame = "default",
): string {
  if (frame === "duo-source") {
    return size === "mobile"
      ? "h-auto min-h-[132px] w-full min-w-0 flex-none rounded-[16px]"
      : "h-auto min-h-0 w-full flex-1 rounded-[16px]";
  }

  if (frame === "duo-preview") {
    return size === "mobile"
      ? "min-h-0 w-full min-w-0 flex-1 self-stretch rounded-[16px]"
      : "h-[344px] w-[214px] shrink-0 rounded-[24px]";
  }

  return size === "mobile"
    ? "h-[225px] w-[151px] rounded-[16px]"
    : "h-[300px] w-[214px] rounded-[24px]";
}
