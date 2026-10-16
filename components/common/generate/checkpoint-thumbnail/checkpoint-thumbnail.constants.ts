export const CHECKPOINT_THUMBNAIL_VARIANTS = [
  "pony",
  "klams-ai",
  "byte-dance",
  "gpt-open-ai",
  "alibaba",
  "mistral-ai",
  "moonshot-ai",
  "unknown",
  "krea",
  "oh-ai",
  "minimax",
  "deepseek",
  "illustrious",
  "z-ai",
  "meta-ai",
  "google-ai",
  "ltx",
  "stability",
  "variant",
  "rec-ai",
] as const;

export type CheckpointThumbnailVariant = (typeof CHECKPOINT_THUMBNAIL_VARIANTS)[number];

export const CHECKPOINT_THUMBNAIL_DEFAULT_VARIANT: CheckpointThumbnailVariant = "pony";

export const CHECKPOINT_THUMBNAIL_DEFAULT_SIZE = 40;

export const CHECKPOINT_THUMBNAIL_LABELS: Record<CheckpointThumbnailVariant, string> = {
  pony: "Pony",
  "klams-ai": "Klams AI",
  "byte-dance": "Bytedance",
  "gpt-open-ai": "Open AI",
  alibaba: "Qwen",
  "mistral-ai": "Mistral AI",
  "moonshot-ai": "Moonshot AI",
  unknown: "Unknown",
  krea: "Krea",
  "oh-ai": "OhAI",
  minimax: "Minimax",
  deepseek: "Deepseek",
  illustrious: "Illustrious",
  "z-ai": "Z.AI",
  "meta-ai": "Meta AI",
  "google-ai": "Google AI",
  ltx: "LTX",
  stability: "Stability",
  variant: "Variant",
  "rec-ai": "Rec AI",
};

export const CHECKPOINT_THUMBNAIL_SRC: Record<CheckpointThumbnailVariant, string> = {
  pony: "/assets/ai-thumbnails/pony.svg",
  "klams-ai": "/assets/ai-thumbnails/klams-ai.svg",
  "byte-dance": "/assets/ai-thumbnails/byte-dance.svg",
  "gpt-open-ai": "/assets/ai-thumbnails/gpt-open-ai.svg",
  alibaba: "/assets/ai-thumbnails/alibaba.svg",
  "mistral-ai": "/assets/ai-thumbnails/mistral-ai.svg",
  "moonshot-ai": "/assets/ai-thumbnails/moonshot-ai.svg",
  unknown: "/assets/ai-thumbnails/unknown.svg",
  krea: "/assets/ai-thumbnails/krea.svg",
  "oh-ai": "/assets/ai-thumbnails/oh-ai.png",
  minimax: "/assets/ai-thumbnails/minimax.png",
  deepseek: "/assets/ai-thumbnails/deepseek.svg",
  illustrious: "/assets/ai-thumbnails/illustrious.svg",
  "z-ai": "/assets/ai-thumbnails/z-ai.png",
  "meta-ai": "/assets/ai-thumbnails/meta-ai.svg",
  "google-ai": "/assets/ai-thumbnails/google-ai.svg",
  ltx: "/assets/ai-thumbnails/ltx.png",
  stability: "/assets/ai-thumbnails/stability.svg",
  variant: "/assets/ai-thumbnails/variant.svg",
  "rec-ai": "/assets/ai-thumbnails/rec-ai.svg",
};
