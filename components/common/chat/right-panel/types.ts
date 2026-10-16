import type * as React from "react";

import type { ForwardProps } from "@/components/common/general/forward/forward";

export const RIGHT_PANEL_VARIANTS = ["default", "group"] as const;

export type RightPanelVariant = (typeof RIGHT_PANEL_VARIANTS)[number];

export type RightPanelForwardItem = {
  id: string;
  label: string;
  leftIconSrc: string | React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: ForwardProps["onClick"];
};

/** One generated image from the open conversation, shown as a 1:1 tile. */
export type RightPanelMediaItem = {
  id: string;
  src: string;
  alt?: string;
};

/** A previous conversation with the character shown in the right panel. */
export type RightPanelHistoryItem = {
  id: string;
  name: string;
  preview: string;
};

export const RIGHT_PANEL_TABS = ["media", "history"] as const;

export type RightPanelTab = (typeof RIGHT_PANEL_TABS)[number];

export type RightPanelProps = Omit<React.ComponentProps<"aside">, "children"> & {
  variant?: RightPanelVariant;
  characterName?: string;
  characterAge?: string | number;
  characterBio?: string;
  characterImageSrc?: string;
  /** Character carousel slides (default variant). Falls back to `characterImageSrc` when omitted. */
  characterImages?: readonly string[];
  memberAvatars?: readonly string[];
  memberCountLabel?: string;
  /** 1-based active carousel slide. */
  carouselIndex?: number;
  /** @deprecated Prefer `characterImages.length`. Kept for Storybook controls. */
  carouselTotal?: number;
  onCarouselIndexChange?: (index: number) => void;
  /** @deprecated Settings moved to the chat bar. Kept for advanced-settings callers. */
  forwardItems?: RightPanelForwardItem[];
  /** Media generated in the current conversation. */
  mediaItems?: readonly RightPanelMediaItem[];
  /** Previous conversations with this character. */
  historyItems?: readonly RightPanelHistoryItem[];
  /** Open conversation, marked in the Chat History list. */
  activeHistoryId?: string | null;
  onHistorySelect?: (id: string) => void;
  /** Hidden on group chats. Pass false to hide the profile action. */
  showProfileButton?: boolean;
  showCarousel?: boolean;
  profileLabel?: string;
  collapseLabel?: string;
  onProfileClick?: () => void;
  onCollapseClick?: () => void;
  onCarouselPrevious?: () => void;
  onCarouselNext?: () => void;
  /** @deprecated Settings moved to the chat bar. */
  onForwardItemClick?: (id: string) => void;
  onMediaSelect?: (index: number) => void;
};
