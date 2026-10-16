import { authClient } from "@/lib/auth/auth-client";

import type { ChatAttachmentKind, ChatAttachmentStatus } from "./chats";
import { CLIENT_API_ORIGIN } from "./config";
import type { MediaFailureReason } from "./types";

/**
 * `GET /api/v1/chats/subscribe?token=`.
 *
 * Frames are unnamed `data:` lines (not `event:` names). Each payload is a
 * `ChatEvent` plus an initial `{ type: "connected" }`. Events carry ids and
 * status, never a media URL — refetch the message or chat to render it.
 *
 * The route requires the session cookie and `?token=`. EventSource sends the
 * cookie because the call is same-origin (`CLIENT_API_ORIGIN`).
 */

export type ChatStreamEvent =
  | { type: "connected" }
  | { type: "message.created"; chatId: string; messageId: string }
  | { type: "message.updated"; chatId: string; messageId: string }
  | { type: "message.deleted"; chatId: string; messageId: string }
  | {
      type: "attachment.updated";
      chatId: string;
      messageId: string;
      attachmentId: string;
      kind: ChatAttachmentKind;
      status: ChatAttachmentStatus;
      failureReason: MediaFailureReason | null;
    }
  | { type: "chat.updated"; chatId: string }
  | { type: "chat.deleted"; chatId: string };

const CHAT_EVENT_TYPES = new Set<ChatStreamEvent["type"]>([
  "connected",
  "message.created",
  "message.updated",
  "message.deleted",
  "attachment.updated",
  "chat.updated",
  "chat.deleted",
]);

export function parseChatStreamEvent(raw: string): ChatStreamEvent | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const data = parsed as Record<string, unknown>;
  if (
    typeof data.type !== "string" ||
    !CHAT_EVENT_TYPES.has(data.type as ChatStreamEvent["type"])
  ) {
    return null;
  }
  const type = data.type as ChatStreamEvent["type"];
  if (type === "connected") return { type: "connected" };
  if (typeof data.chatId !== "string") return null;
  if (type === "message.created" || type === "message.updated" || type === "message.deleted") {
    if (typeof data.messageId !== "string") return null;
    return { type, chatId: data.chatId, messageId: data.messageId };
  }
  if (type === "attachment.updated") {
    if (
      typeof data.messageId !== "string" ||
      typeof data.attachmentId !== "string" ||
      (data.kind !== "image" && data.kind !== "audio") ||
      (data.status !== "queued" &&
        data.status !== "generating" &&
        data.status !== "completed" &&
        data.status !== "failed")
    ) {
      return null;
    }
    return {
      type: "attachment.updated",
      chatId: data.chatId,
      messageId: data.messageId,
      attachmentId: data.attachmentId,
      kind: data.kind,
      status: data.status,
      failureReason:
        typeof data.failureReason === "string" ? (data.failureReason as MediaFailureReason) : null,
    };
  }
  return type === "chat.updated" || type === "chat.deleted" ? { type, chatId: data.chatId } : null;
}

export type ChatEventsSubscription = {
  ready: Promise<boolean>;
  unsubscribe: () => void;
};

export function subscribeToChatEvents(
  onEvent: (event: ChatStreamEvent) => void,
): ChatEventsSubscription {
  let source: EventSource | null = null;
  let cancelled = false;
  let settleReady: (ready: boolean) => void = () => {};
  const ready = new Promise<boolean>((resolve) => {
    settleReady = resolve;
  });

  void (async () => {
    let token: string | undefined;
    try {
      const { data } = await authClient.getSession();
      token = data?.session.token;
    } catch {
      settleReady(false);
      return;
    }

    if (cancelled || !token) {
      settleReady(false);
      return;
    }

    try {
      source = new EventSource(
        `${CLIENT_API_ORIGIN}/api/v1/chats/subscribe?token=${encodeURIComponent(token)}`,
      );
    } catch {
      settleReady(false);
      return;
    }

    source.addEventListener("open", () => settleReady(true), { once: true });
    source.addEventListener("error", () => settleReady(false), { once: true });
    source.onmessage = (event) => {
      const parsed = parseChatStreamEvent(event.data);
      if (parsed && parsed.type !== "connected") onEvent(parsed);
    };
  })();

  return {
    ready,
    unsubscribe: () => {
      cancelled = true;
      settleReady(false);
      source?.close();
      source = null;
    },
  };
}
