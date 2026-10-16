import type { CheckpointThumbnailVariant } from "@/components/common/generate/checkpoint-thumbnail";

export const ANIMATE_IMAGE_MODAL_TITLE = "Animate image";

export const ANIMATE_IMAGE_MODAL_TITLE_ICON_SRC = "/assets/play-outline.svg";

export const ANIMATE_IMAGE_MODAL_GENERATE_LABEL = "Generate";

export const ANIMATE_IMAGE_MODEL_HELPER_TEXT =
  "Different AI models can create very different results. Choosing the right AI for your needs will greatly improve the output.";

export const ANIMATE_IMAGE_SCENE_LABEL = "Scene:";

export const ANIMATE_IMAGE_PROMPT_LABEL = "Custom prompt";

export const ANIMATE_IMAGE_PROMPT_PLACEHOLDER =
  "Add instructions here. e.g. always call me by my last name “Smith”.";

export const ANIMATE_IMAGE_SCENE_OPTIONS = ["None", "Close-up", "Full body", "Custom"] as const;

export type AnimateImageScene = (typeof ANIMATE_IMAGE_SCENE_OPTIONS)[number] | (string & {});

export const ANIMATE_IMAGE_DEFAULT_SCENE: AnimateImageScene = "None";

export const ANIMATE_IMAGE_RESOLUTIONS = ["720p", "1080p"] as const;

export type AnimateImageResolution = (typeof ANIMATE_IMAGE_RESOLUTIONS)[number];

export const ANIMATE_IMAGE_DEFAULT_RESOLUTION: AnimateImageResolution = "1080p";

export const ANIMATE_IMAGE_DURATION_MIN = 5;

export const ANIMATE_IMAGE_DURATION_MAX = 300;

export const ANIMATE_IMAGE_DEFAULT_DURATION = 10;

export type AnimateImageModelId = "wan-2-2" | "seedance-1-5-pro" | "klams-ai";

export type AnimateImageModelOption = {
  id: AnimateImageModelId;
  name: string;
  description: string;
  tokenCost: string;
  checkpointVariant: CheckpointThumbnailVariant;
  showUnlimitedBadge?: boolean;
};

export const ANIMATE_IMAGE_MODELS: AnimateImageModelOption[] = [
  {
    id: "klams-ai",
    name: "Klams AI",
    description: "Audio-driven talking videos.",
    tokenCost: "60",
    checkpointVariant: "klams-ai",
    showUnlimitedBadge: false,
  },
  {
    id: "wan-2-2",
    name: "WAN 2.2",
    description: "Best for realistic female-male porn.",
    tokenCost: "12",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: true,
  },
  {
    id: "seedance-1-5-pro",
    name: "Seedance 1.5 pro",
    description: "Audio-led videos with perfect sync.",
    tokenCost: "20",
    checkpointVariant: "byte-dance",
    showUnlimitedBadge: false,
  },
];

export const ANIMATE_IMAGE_DEFAULT_MODEL_ID: AnimateImageModelId = "wan-2-2";

export function clampAnimateImageDuration(duration: number): number {
  if (!Number.isFinite(duration)) return ANIMATE_IMAGE_DEFAULT_DURATION;

  return Math.min(
    ANIMATE_IMAGE_DURATION_MAX,
    Math.max(ANIMATE_IMAGE_DURATION_MIN, Math.round(duration)),
  );
}

export function getAnimateImageModelTokenCost(modelId: AnimateImageModelId): string {
  return ANIMATE_IMAGE_MODELS.find((model) => model.id === modelId)?.tokenCost ?? "0";
}
