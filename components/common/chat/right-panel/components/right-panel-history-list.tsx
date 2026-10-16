"use client";

import { ConversationStatus } from "@/components/common/chat/conversation-status/conversation-status";

import { RIGHT_PANEL_HISTORY_EMPTY_LABEL } from "../constants";
import type { RightPanelHistoryItem } from "../types";

export function RightPanelHistoryList({
  items,
  activeId,
  onSelect,
}: {
  items: readonly RightPanelHistoryItem[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <p className="text-divider-label px-1 py-3 text-sm leading-5">
        {RIGHT_PANEL_HISTORY_EMPTY_LABEL}
      </p>
    );
  }

  return (
    <ul data-slot="right-panel-history" className="flex w-full flex-col gap-2">
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <ConversationStatus
            key={item.id}
            as="li"
            status={isActive ? "radio" : "memory"}
            showAvatar={false}
            showDotMenu={false}
            name={item.name}
            preview={item.preview}
            className="w-full"
            aria-label={
              isActive ? `${item.name} chat history, selected` : `${item.name} chat history`
            }
            onClick={() => onSelect?.(item.id)}
          />
        );
      })}
    </ul>
  );
}
