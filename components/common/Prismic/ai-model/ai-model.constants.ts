import { dummyImage } from "@/lib/dummy-images";
/** Figma AI Model cards — Characters, Images, Videos, Templates. */
export const AI_MODEL_TINY_WIDTH_PX = 175;
export const AI_MODEL_TINY_HEIGHT_PX = 255;
export const AI_MODEL_MOBILE_WIDTH_PX = 175;
export const AI_MODEL_MOBILE_HEIGHT_PX = 255;
export const AI_MODEL_OVERLAY_HEIGHT_PX = 156;
export const AI_MODEL_TINY_OVERLAY_HEIGHT_PX = 121;
export const AI_MODEL_MOBILE_OVERLAY_HEIGHT_PX = 121;

export type AiModelSize = "default" | "tiny" | "mobile";

export type AiModelVariant = "characters" | "images" | "videos" | "templates";

export const AI_MODEL_VARIANTS = [
  "characters",
  "images",
  "videos",
  "templates",
] as const satisfies readonly AiModelVariant[];

export const AI_MODEL_MEDIA_OVERLAY_HEIGHT_PX = 88;
export const AI_MODEL_MEDIA_TINY_OVERLAY_HEIGHT_PX = 72;

export const AI_MODEL_DEFAULT_NAME = "Lorem Ipsum 22";
export const AI_MODEL_MEDIA_DEFAULT_NAME = "Kylae";
export const AI_MODEL_ANIMATE_LABEL = "Animate";
export const AI_MODEL_ANIMATE_ICON_SRC = "/assets/video-square.svg";
export const AI_MODEL_GENERATE_LABEL = "Generate";
export const AI_MODEL_TEMPLATES_DEFAULT_NAME = "Lorem Ipsum";
export const AI_MODEL_TEMPLATES_DEFAULT_BADGE = "New";
export const AI_MODEL_TEMPLATES_INSET_IMAGE_SRC = dummyImage(162);

export function resolveTemplateStatusBadgeSize(size: AiModelSize) {
  if (size === "default") return "large" as const;
  if (size === "tiny") return "small" as const;
  return "medium" as const;
}

export const AI_MODEL_DEFAULT_DESCRIPTION =
  "Your girlfriend's younger sister. The one you were always warned about…";
export const AI_MODEL_DEFAULT_IMAGE_SRC = dummyImage(163);
export const AI_MODEL_DEFAULT_STAT_VALUE = "12.8K";
export const AI_MODEL_VERIFIED_ICON_SRC = "/assets/verified-badge.svg";

export const AI_MODEL_STAT_ICONS = {
  media: "/assets/ai-chat-outline.svg",
  likes: "/assets/video-square.svg",
  messages: "/assets/gallery.svg",
} as const;

export type AiModelStatKey = keyof typeof AI_MODEL_STAT_ICONS;

export type AiModelStat = {
  key: AiModelStatKey;
  value: string;
  iconSrc?: string;
  ariaLabel?: string;
};

export const AI_MODEL_DEFAULT_STATS: AiModelStat[] = [
  { key: "media", value: AI_MODEL_DEFAULT_STAT_VALUE, ariaLabel: "Media count" },
  { key: "likes", value: AI_MODEL_DEFAULT_STAT_VALUE, ariaLabel: "Likes" },
  { key: "messages", value: AI_MODEL_DEFAULT_STAT_VALUE, ariaLabel: "Messages" },
];

const AI_MODEL_STAT_ARIA_LABELS: Record<AiModelStatKey, string> = {
  media: "Media count",
  likes: "Likes",
  messages: "Messages",
};

/** Deterministic pseudo-random generator, so server and client render the same value. */
function mulberry32(seed: number) {
  let state = seed | 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formatStatValue(count: number): string {
  return `${(count / 1000).toFixed(1)}K`;
}

/**
 * Builds a set of demo stats that vary per card instead of repeating the
 * same placeholder number on every icon, so a grid of cards looks natural.
 */
export function buildRandomizedStats(seed: number): AiModelStat[] {
  const random = mulberry32(seed);

  return (Object.keys(AI_MODEL_STAT_ICONS) as AiModelStatKey[]).map((key) => ({
    key,
    value: formatStatValue(8000 + Math.floor(random() * 9000)),
    ariaLabel: AI_MODEL_STAT_ARIA_LABELS[key],
  }));
}
