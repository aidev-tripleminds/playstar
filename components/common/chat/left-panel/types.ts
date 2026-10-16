import type * as React from "react";

import type { ConversationStatusState } from "@/components/common/chat/conversation-status/components/constants";

export const LEFT_PANEL_STATUSES = ["default", "search", "mobile"] as const;

export type LeftPanelStatus = (typeof LEFT_PANEL_STATUSES)[number];

export type LeftPanelConversation = {
  id: string;
  name: string;
  preview: string;
  avatarSrc?: string;
  status?: ConversationStatusState;
  /** Persists across focus changes; drives pin icon + Unpin label. */
  pinned?: boolean;
  memberAvatars?: readonly string[];
};
export type aiSuggestion = {
  id: string;
  name: string;
  preview: string;
  avatarSrc?: string;
  status?: ConversationStatusState;
  memberAvatars?: readonly string[];
};

export type LeftPanelProps = Omit<React.ComponentProps<"aside">, "children"> & {
  status?: LeftPanelStatus;
  title?: string;
  searchValue?: string;
  defaultSearchValue?: string;
  searchPlaceholder?: string;
  spiceBot?: LeftPanelConversation;
  aiSuggestion?: aiSuggestion;
  conversations?: LeftPanelConversation[];
  suggestedConversations?: LeftPanelConversation[];
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchClear?: () => void;
  onNewChatClick?: () => void;
  onCollapseClick?: () => void;
  onConversationClick?: (id: string) => void;
  onConversationPin?: (id: string) => void;
  onConversationDelete?: (id: string) => void;
  /** Recent characters for the Characters tab. Greeting is `preview`. */
  characters?: LeftPanelConversation[];
  onCharacterClick?: (id: string) => void;
  onCharacterPin?: (id: string) => void;
  onCharacterDelete?: (id: string) => void;
  /**
   * When the parent already filtered `conversations` with `GET /chats?search=`,
   * skip the name/preview filter. A message-text hit would otherwise disappear.
   */
  serverSearch?: boolean;
  newChatLabel?: string;
  pinnedChatsLabel?: string;
  yourChatsLabel?: string;
  suggestedChatsLabel?: string;
  collapseLabel?: string;
};
