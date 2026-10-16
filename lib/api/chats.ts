import { apiFetch } from "./client";
import type { MediaFailureReason } from "./types";

/**
 * Chat API (BACK-318 phase 1).
 *
 * Wire shapes match `omnipink-backend/src/modules/chat/views.ts`. Response
 * schemas are not in the OpenAPI document, so this file is the frontend copy
 * of that module. Camel case, unlike the older character routes.
 */

export type ChatMode = "texting" | "storytelling";

export type ChatMessageRole = "user" | "character";

export type ChatMessageStatus = "complete" | "moderated" | "pending" | "failed";

export type ChatMessagePartType = "text" | "quote" | "narration";

export type ChatMessagePart = {
  type: ChatMessagePartType;
  text: string;
};

export type ChatAttachmentKind = "image" | "audio";

/** `generating` is the in-flight step between `queued` and `completed`. */
export type ChatAttachmentStatus = "queued" | "generating" | "completed" | "failed";

export type ChatAttachment = {
  id: string;
  kind: ChatAttachmentKind;
  status: ChatAttachmentStatus;
  /** Presigned, and null until completed. Blurred viewers get a blurred image. */
  url: string | null;
  nsfw: boolean | null;
  blurred: boolean;
  failureReason: MediaFailureReason | null;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  role: ChatMessageRole;
  characterId: string | null;
  parts: ChatMessagePart[];
  status: ChatMessageStatus;
  /** The user message a character reply answers. */
  replyToId: string | null;
  feedback: number | null;
  attachments: ChatAttachment[];
  createdAt: string;
  editedAt: string | null;
};

export type ChatSettings = {
  mode: ChatMode;
  responseLength: number;
  reasoning: boolean;
  language: string;
  autoPlayAudio: boolean;
  longTermMemory: boolean;
};

export type ChatParticipant = {
  characterId: string;
  name: string;
  avatarUrl: string | null;
  voiceId: string | null;
};

export type Chat = {
  id: string;
  /** Always resolved: the chat's own name, or one derived from its members. */
  name: string;
  /** Whether the user renamed it (`name` is then not derived). */
  hasCustomName: boolean;
  isGroup: boolean;
  participants: ChatParticipant[];
  pinned: boolean;
  unread: boolean;
  lastMessage: {
    role: ChatMessageRole;
    characterId: string | null;
    preview: string;
    createdAt: string;
  } | null;
  settings: ChatSettings;
  lastMessageAt: string;
  createdAt: string;
};

export type ChatListResponse = {
  /** Every pinned chat, most recent first. Empty on pages after the first. */
  pinned: Chat[];
  /** Unpinned chats, most recent activity first. */
  items: Chat[];
  nextCursor: string | null;
};

export type ChatPageResponse = {
  items: Chat[];
  nextCursor: string | null;
};

export type ChatMessagePage = {
  /** Newest first. */
  items: ChatMessage[];
  nextCursor: string | null;
};

export type SendChatMessageBody = {
  text: string;
  /** Group chats: the member that should reply. Omitted, the quietest member replies. */
  respondAs?: string;
  /** The client's clock, given to the character as the current time. */
  clientTimestamp?: string;
};

export type SendChatMessageResponse = {
  userMessage: ChatMessage;
  reply: ChatMessage;
};

export type ChatSettingsPatch = Partial<ChatSettings>;

export type PatchChatBody = {
  /** A custom name; null (or empty) goes back to the derived one. */
  name?: string | null;
  pinned?: boolean;
  settings?: ChatSettingsPatch;
};

function queryString(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

/** `GET /api/v1/chats` — pinned chats plus one page of the rest. */
export function fetchChats(
  query: {
    search?: string;
    cursor?: string;
    limit?: number;
  } = {},
): Promise<ChatListResponse> {
  return apiFetch<ChatListResponse>(
    `/api/v1/chats${queryString({
      search: query.search,
      cursor: query.cursor,
      limit: query.limit,
    })}`,
  );
}

/** `POST /api/v1/chats` — always a new chat. One id is 1:1, several a group. */
export function createChat(characterIds: string[]): Promise<Chat> {
  return apiFetch<Chat>("/api/v1/chats", {
    method: "POST",
    body: JSON.stringify({ characterIds }),
  });
}

/** `GET /api/v1/chats/:chatId` */
export function fetchChat(chatId: string): Promise<Chat> {
  return apiFetch<Chat>(`/api/v1/chats/${encodeURIComponent(chatId)}`);
}

/** `PATCH /api/v1/chats/:chatId` — rename, pin, or settings. */
export function patchChat(chatId: string, body: PatchChatBody): Promise<Chat> {
  return apiFetch<Chat>(`/api/v1/chats/${encodeURIComponent(chatId)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

/** `DELETE /api/v1/chats/:chatId` — permanent. */
export function deleteChat(chatId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/chats/${encodeURIComponent(chatId)}`, {
    method: "DELETE",
  });
}

/** `POST /api/v1/chats/:chatId/read` */
export function markChatRead(chatId: string): Promise<void> {
  return apiFetch<void>(`/api/v1/chats/${encodeURIComponent(chatId)}/read`, {
    method: "POST",
  });
}

/** `POST /api/v1/chats/:chatId/participants` */
export function addChatParticipant(chatId: string, characterId: string): Promise<Chat> {
  return apiFetch<Chat>(`/api/v1/chats/${encodeURIComponent(chatId)}/participants`, {
    method: "POST",
    body: JSON.stringify({ characterId }),
  });
}

/** `PATCH /api/v1/chats/:chatId/participants/:characterId` — null uses the character's own voice. */
export function patchChatParticipantVoice(
  chatId: string,
  characterId: string,
  voiceId: string | null,
): Promise<Chat> {
  return apiFetch<Chat>(
    `/api/v1/chats/${encodeURIComponent(chatId)}/participants/${encodeURIComponent(characterId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ voiceId }),
    },
  );
}

/** `DELETE /api/v1/chats/:chatId/participants/:characterId` — never the last member. */
export function removeChatParticipant(chatId: string, characterId: string): Promise<Chat> {
  return apiFetch<Chat>(
    `/api/v1/chats/${encodeURIComponent(chatId)}/participants/${encodeURIComponent(characterId)}`,
    { method: "DELETE" },
  );
}

/** `GET /api/v1/characters/:characterId/chats` — Chat history with one character. */
export function fetchCharacterChats(
  characterId: string,
  query: { cursor?: string; limit?: number } = {},
): Promise<ChatPageResponse> {
  return apiFetch<ChatPageResponse>(
    `/api/v1/characters/${encodeURIComponent(characterId)}/chats${queryString({
      cursor: query.cursor,
      limit: query.limit,
    })}`,
  );
}

/** `GET /api/v1/chats/:chatId/messages` — newest first. */
export function fetchChatMessages(
  chatId: string,
  query: { cursor?: string; limit?: number } = {},
): Promise<ChatMessagePage> {
  return apiFetch<ChatMessagePage>(
    `/api/v1/chats/${encodeURIComponent(chatId)}/messages${queryString({
      cursor: query.cursor,
      limit: query.limit,
    })}`,
  );
}

/** `GET /api/v1/chats/:chatId/messages/:messageId` — refetch after `attachment.updated`. */
export function fetchChatMessage(chatId: string, messageId: string): Promise<ChatMessage> {
  return apiFetch<ChatMessage>(
    `/api/v1/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`,
  );
}

/** `POST /api/v1/chats/:chatId/messages` — 201 `{ userMessage, reply }`. */
export function sendChatMessage(
  chatId: string,
  body: SendChatMessageBody,
): Promise<SendChatMessageResponse> {
  return apiFetch<SendChatMessageResponse>(`/api/v1/chats/${encodeURIComponent(chatId)}/messages`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/** `PATCH` a user message (`{ text }`) — replaces the text and regenerates the reply. */
export function editUserChatMessage(
  chatId: string,
  messageId: string,
  text: string,
): Promise<SendChatMessageResponse> {
  return apiFetch<SendChatMessageResponse>(
    `/api/v1/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ text }),
    },
  );
}

/** `PATCH` a character message (`{ parts }`). */
export function editCharacterChatMessage(
  chatId: string,
  messageId: string,
  parts: ChatMessagePart[],
): Promise<{ message: ChatMessage }> {
  return apiFetch<{ message: ChatMessage }>(
    `/api/v1/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ parts }),
    },
  );
}

/** `DELETE /api/v1/chats/:chatId/messages/:messageId` — soft delete. */
export function deleteChatMessage(chatId: string, messageId: string): Promise<void> {
  return apiFetch<void>(
    `/api/v1/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`,
    { method: "DELETE" },
  );
}

/** `POST …/regenerate` — a new reply to the same user message. */
export function regenerateChatReply(
  chatId: string,
  messageId: string,
): Promise<SendChatMessageResponse> {
  return apiFetch<SendChatMessageResponse>(
    `/api/v1/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}/regenerate`,
    { method: "POST" },
  );
}

/** `POST …/feedback` — `-1` dislikes the reply; `null` clears it. */
export function rateChatReply(
  chatId: string,
  messageId: string,
  rating: -1 | null,
): Promise<ChatMessage> {
  return apiFetch<ChatMessage>(
    `/api/v1/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}/feedback`,
    {
      method: "POST",
      body: JSON.stringify({ rating }),
    },
  );
}
