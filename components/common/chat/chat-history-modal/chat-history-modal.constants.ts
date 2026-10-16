export const CHAT_HISTORY_MODAL_TITLE = "Chat history";

export const CHAT_HISTORY_MODAL_EMPTY_MESSAGE = "No previous chats for this character yet.";

export const CHAT_HISTORY_DEFAULT_PREVIEW =
  "Hey, this is what we talked last time we talked together in the living room...";

export type ChatHistoryItem = {
  id: string;
  name: string;
  preview: string;
  /** When true, shows the rose radio indicator (unread) on the selected radio row. */
  unread?: boolean;
};

export const CHAT_HISTORY_SAMPLE_ITEMS: ChatHistoryItem[] = [
  {
    id: "history-1",
    name: "Joan Doe",
    preview: CHAT_HISTORY_DEFAULT_PREVIEW,
    unread: true,
  },
  {
    id: "history-2",
    name: "Joan Doe",
    preview: CHAT_HISTORY_DEFAULT_PREVIEW,
  },
  {
    id: "history-3",
    name: "Joan Doe",
    preview: CHAT_HISTORY_DEFAULT_PREVIEW,
    unread: true,
  },
  {
    id: "history-4",
    name: "Joan Doe",
    preview: CHAT_HISTORY_DEFAULT_PREVIEW,
  },
  {
    id: "history-5",
    name: "Joan Doe",
    preview: CHAT_HISTORY_DEFAULT_PREVIEW,
  },
  {
    id: "history-6",
    name: "Joan Doe",
    preview: CHAT_HISTORY_DEFAULT_PREVIEW,
  },
  {
    id: "history-7",
    name: "Joan Doe",
    preview: CHAT_HISTORY_DEFAULT_PREVIEW,
  },
  {
    id: "history-8",
    name: "Joan Doe",
    preview: CHAT_HISTORY_DEFAULT_PREVIEW,
  },
];
