import type * as React from "react";

export const PROMPT_CHATBAR_VARIANTS = [
  "default",
  "ai-filled",
  "group-chat",
  "request-picture",
  "request-video",
] as const;

export type PromptChatbarVariant = (typeof PROMPT_CHATBAR_VARIANTS)[number];

export type PromptChatbarPose = {
  id: string;
  label: string;
  imageSrc: string;
  selected?: boolean;
  /** Copy shown in VideoPromptText when this pose is selected in video mode. */
  videoPrompt?: string;
  /** Copy prefilled in the prompt when this pose is selected in make-image mode. */
  imagePrompt?: string;
};

export type PromptChatbarProps = Omit<React.ComponentProps<"div">, "children"> & {
  variant?: PromptChatbarVariant;
  characterName?: string;
  placeholder?: string;
  promptText?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  showPremiumCrown?: boolean;
  groupMemberAvatars?: readonly string[];
  poses?: PromptChatbarPose[];
  videoPrompt?: string;
  imageMediaSelected?: boolean;
  videoMediaSelected?: boolean;
  showAiAssistActions?: boolean;
  showAiSection?: boolean;
  sendLabel?: string;
  settingsLabel?: string;
  tokenCost?: string;
  showTokenCost?: boolean;
  onSendClick?: (text: string) => void | boolean | Promise<void | boolean>;
  onSettingsClick?: () => void;
  onFillWithAiClick?: () => void;
  onContinueClick?: () => void;
  onDiscardClick?: () => void;
  onVideoPromptDismiss?: () => void;
  onPoseSelectedChange?: (poseId: string, selected: boolean) => void;
  onImageMediaSelectedChange?: (selected: boolean) => void;
  onVideoMediaSelectedChange?: (selected: boolean) => void;
};
