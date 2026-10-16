import type { CheckpointThumbnailVariant } from "@/components/common/generate/checkpoint-thumbnail";

export const WRITING_STYLE_MODAL_TITLE = "Writing style";

export const WRITING_STYLE_MODAL_TITLE_ICON_SRC = "/assets/edit.svg";

export const WRITING_STYLE_MODAL_APPLY_LABEL = "Save";

export const WRITING_STYLE_CHAT_MODE_LABEL = "Chat mode";

export const WRITING_STYLE_RESPONSE_LENGTH_LABEL = "Response length";

export const WRITING_STYLE_AI_MODEL_LABEL = "AI Model";

export const WRITING_STYLE_RESPONSE_LENGTH_MIN = 0;

export const WRITING_STYLE_RESPONSE_LENGTH_MAX = 100;

export const WRITING_STYLE_DEFAULT_RESPONSE_LENGTH = 50;

/** Maps to chat display: `chat` = Texting, `storytelling` = Storytelling. */
export type WritingStyleChatMode = "chat" | "storytelling";

export const WRITING_STYLE_CHAT_MODES: {
  id: WritingStyleChatMode;
  label: string;
  description: string;
}[] = [
  {
    id: "chat",
    label: "Texting",
    description: "Simple, short and casual texting style.",
  },
  {
    id: "storytelling",
    label: "Storytelling",
    description: "Immersive narrative with dialogue and scene details.",
  },
];

export type WritingStyleModelId = "klams-one" | "gpt-oss" | "qwen-3-5" | "deepseek-v3";

export type WritingStyleModelOption = {
  id: WritingStyleModelId;
  name: string;
  description: string;
  tokenCost: string;
  checkpointVariant: CheckpointThumbnailVariant;
  showUnlimitedBadge?: boolean;
  showTokenBadge?: boolean;
  showPremiumBadge?: boolean;
};

export const WRITING_STYLE_MODELS: WritingStyleModelOption[] = [
  {
    id: "klams-one",
    name: "Klams One",
    description: "Best for realistic female-male porn.",
    tokenCost: "0",
    checkpointVariant: "klams-ai",
    showUnlimitedBadge: true,
    showTokenBadge: false,
    showPremiumBadge: false,
  },
  {
    id: "gpt-oss",
    name: "GPT OSS",
    description: "Audio-led videos with perfect sync.",
    tokenCost: "0.1",
    checkpointVariant: "gpt-open-ai",
    showUnlimitedBadge: false,
    showTokenBadge: true,
    showPremiumBadge: true,
  },
  {
    id: "qwen-3-5",
    name: "Qwen 3.5",
    description: "Audio-driven talking videos.",
    tokenCost: "0.15",
    checkpointVariant: "alibaba",
    showUnlimitedBadge: false,
    showTokenBadge: true,
    showPremiumBadge: true,
  },
  {
    id: "deepseek-v3",
    name: "Deepseek V3",
    description: "Audio-driven talking videos.",
    tokenCost: "0.1",
    checkpointVariant: "deepseek",
    showUnlimitedBadge: false,
    showTokenBadge: true,
    showPremiumBadge: true,
  },
];

export const WRITING_STYLE_DEFAULT_MODEL_ID: WritingStyleModelId = "klams-one";

export function getWritingStyleChatModeDescription(mode: WritingStyleChatMode): string {
  return (
    WRITING_STYLE_CHAT_MODES.find((option) => option.id === mode)?.description ??
    WRITING_STYLE_CHAT_MODES[0]?.description ??
    ""
  );
}
