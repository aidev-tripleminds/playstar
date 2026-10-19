import { dotOptionMenuItems } from "@/components/common/ai-model-pages/dot-option/dot-option";
import { DEFAULT_AVATAR_GROUP_SOURCES } from "@/components/common/chat/avatar-group/constants";
import { dummyImage } from "@/lib/dummy-images";

export type ConversationStatusState =
  | "default"
  | "focus"
  | "unread"
  | "pinned"
  | "group"
  | "radio"
  | "memory";

export const CONVERSATION_STATUS_STATES = [
  "default",
  "focus",
  "unread",
  "pinned",
  "group",
  "radio",
  "memory",
] as const satisfies readonly ConversationStatusState[];

export const DEFAULT_CONVERSATION_NAME = "Joan Doe";

export const DEFAULT_CONVERSATION_PREVIEW =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export const DEFAULT_CONVERSATION_AVATAR = dummyImage(51);

export const DEFAULT_CONVERSATION_MEMBER_AVATARS = [...DEFAULT_AVATAR_GROUP_SOURCES];

export const DEFAULT_CONVERSATION_DOT_MENU_ITEMS = dotOptionMenuItems;

export const HOVER_CAPABLE_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

/**
 * Statuses that keep a static surface and skip hover background /
 * transparent-on-actions clears. Three-dot menus still show on hover.
 */
export const STATUSES_WITH_STATIC_SURFACE = [
  "radio",
] as const satisfies readonly ConversationStatusState[];
