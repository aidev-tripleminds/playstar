"use client";

import * as React from "react";

import {
  CHAT_NEAR_BOTTOM_THRESHOLD_PX,
  type ChatScrollRoot,
  isNearChatBottom,
  resolveChatScrollRoot,
  scrollChatToBottom,
} from "@/lib/chat/message-stream-scroll";

export type UseChatMessageStreamScrollOptions = {
  /** Stable thread identity — changing this force-pins to the latest message. */
  conversationId: string;
  /** False while the stream is replaced by a loading state. */
  isReady: boolean;
  /** Used to detect newly appended messages without depending on array identity. */
  lastMessageId: string | undefined;
  messageCount: number;
  /** The message list element. The open chat does not scroll the document. */
  scrollMode: "element" | "window";
  scrollerRef: React.RefObject<HTMLElement | null>;
  /** Observed for media/layout growth while pinned to bottom. */
  contentRef: React.RefObject<HTMLElement | null>;
  nearBottomThresholdPx?: number;
};

/**
 * Production chat scroll behavior:
 * 1. Force-pin to latest when a conversation opens or finishes loading
 * 2. Stick-to-bottom for new messages / content growth only if the user is near the end
 * 3. Never yank the viewport if the user has scrolled up to read history
 */
export function useChatMessageStreamScroll({
  conversationId,
  isReady,
  lastMessageId,
  messageCount,
  scrollMode,
  scrollerRef,
  contentRef,
  nearBottomThresholdPx = CHAT_NEAR_BOTTOM_THRESHOLD_PX,
}: UseChatMessageStreamScrollOptions) {
  const pinnedToBottomRef = React.useRef(true);
  const previousConversationIdRef = React.useRef<string | null>(null);
  const previousReadyRef = React.useRef(false);
  const forcePinRef = React.useRef(true);

  const getRoot = React.useCallback((): ChatScrollRoot | null => {
    return resolveChatScrollRoot(scrollMode, scrollerRef.current);
  }, [scrollMode, scrollerRef]);

  const pinToBottom = React.useCallback(() => {
    const root = getRoot();
    if (!root) {
      return;
    }
    scrollChatToBottom(root);
    pinnedToBottomRef.current = true;
  }, [getRoot]);

  const syncPinnedFromUserScroll = React.useCallback(() => {
    const root = getRoot();
    if (!root) {
      return;
    }
    pinnedToBottomRef.current = isNearChatBottom(root, nearBottomThresholdPx);
  }, [getRoot, nearBottomThresholdPx]);

  // Track user intent: near-bottom stays sticky; scrolled-up history stays put.
  React.useEffect(() => {
    if (!isReady) {
      return;
    }

    const root = getRoot();
    if (!root) {
      return;
    }

    const target: Window | HTMLElement = root.type === "window" ? window : root.element;
    const onScroll = () => {
      syncPinnedFromUserScroll();
    };

    target.addEventListener("scroll", onScroll, { passive: true });
    syncPinnedFromUserScroll();

    return () => {
      target.removeEventListener("scroll", onScroll);
    };
  }, [getRoot, isReady, syncPinnedFromUserScroll]);

  // Mark force-pin when the thread changes or loading finishes for the active thread.
  React.useLayoutEffect(() => {
    const conversationChanged = previousConversationIdRef.current !== conversationId;
    const becameReady = isReady && !previousReadyRef.current;

    if (conversationChanged) {
      previousConversationIdRef.current = conversationId;
      pinnedToBottomRef.current = true;
      forcePinRef.current = true;
    }

    if (becameReady) {
      forcePinRef.current = true;
    }

    previousReadyRef.current = isReady;
  }, [conversationId, isReady]);

  // Apply pin / stick-to-bottom before paint so users never flash the oldest messages.
  React.useLayoutEffect(() => {
    if (!isReady || messageCount === 0) {
      return;
    }

    if (forcePinRef.current || pinnedToBottomRef.current) {
      pinToBottom();
      forcePinRef.current = false;
    }
  }, [conversationId, isReady, lastMessageId, messageCount, pinToBottom]);

  // Media and async layout can grow the stream after the initial pin.
  React.useEffect(() => {
    if (!isReady) {
      return;
    }

    const content = contentRef.current;
    if (!content || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (forcePinRef.current || pinnedToBottomRef.current) {
        pinToBottom();
        forcePinRef.current = false;
      }
    });

    observer.observe(content);
    return () => {
      observer.disconnect();
    };
  }, [contentRef, isReady, pinToBottom]);
}
