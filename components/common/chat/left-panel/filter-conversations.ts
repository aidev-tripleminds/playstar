import type { LeftPanelConversation } from "./types";

export function isConversationPinned(conversation: LeftPanelConversation) {
  return Boolean(conversation.pinned) || conversation.status === "pinned";
}

/** Stable split so pinned rows keep their relative order within each bucket. */
export function partitionConversationsByPinned(conversations: readonly LeftPanelConversation[]): {
  pinned: LeftPanelConversation[];
  unpinned: LeftPanelConversation[];
} {
  const pinned: LeftPanelConversation[] = [];
  const unpinned: LeftPanelConversation[] = [];

  for (const conversation of conversations) {
    if (isConversationPinned(conversation)) {
      pinned.push(conversation);
    } else {
      unpinned.push(conversation);
    }
  }

  return { pinned, unpinned };
}

export function normalizeSearchQuery(query: string) {
  return query.trim().toLowerCase();
}

export function conversationMatchesQuery(
  conversation: LeftPanelConversation,
  normalizedQuery: string,
) {
  if (!normalizedQuery) return true;

  return (
    conversation.name.toLowerCase().includes(normalizedQuery) ||
    conversation.preview.toLowerCase().includes(normalizedQuery)
  );
}

export function filterConversationsByQuery(
  conversations: readonly LeftPanelConversation[],
  query: string,
) {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) return [...conversations];

  return conversations.filter((conversation) =>
    conversationMatchesQuery(conversation, normalizedQuery),
  );
}
