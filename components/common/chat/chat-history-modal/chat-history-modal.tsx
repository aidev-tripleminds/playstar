"use client";

import * as React from "react";

import { ConversationStatus } from "@/components/common/chat/conversation-status/conversation-status";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ClockIcon } from "@/public/assets/icons";

import {
  CHAT_HISTORY_MODAL_EMPTY_MESSAGE,
  CHAT_HISTORY_MODAL_TITLE,
  CHAT_HISTORY_SAMPLE_ITEMS,
  type ChatHistoryItem,
} from "./chat-history-modal.constants";
import { CHAT_HISTORY_DOT_MENU_ITEMS } from "./chat-history-modal.menu";
import { EditConversationNameModal } from "./edit-conversation-name-modal";

export type ChatHistoryModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showMobileHandle?: boolean;
  contentClassName?: string;
  title?: string;
  closeLabel?: string;
  emptyMessage?: string;
  items?: ChatHistoryItem[];
  activeItemId?: string | null;
  onItemSelect?: (item: ChatHistoryItem) => void;
  onItemRename?: (item: ChatHistoryItem, name: string) => void;
  onItemDelete?: (item: ChatHistoryItem) => void;
  onClose?: () => void;
  className?: string;
};

export function ChatHistoryModal({
  open,
  defaultOpen,
  onOpenChange,
  showMobileHandle = true,
  contentClassName,
  title = CHAT_HISTORY_MODAL_TITLE,
  closeLabel = "Close chat history",
  emptyMessage = CHAT_HISTORY_MODAL_EMPTY_MESSAGE,
  items,
  activeItemId,
  onItemSelect,
  onItemRename,
  onItemDelete,
  onClose,
  className,
}: ChatHistoryModalProps) {
  const isItemsControlled = items !== undefined;
  const isActiveItemControlled = activeItemId !== undefined;
  const [internalItems, setInternalItems] = React.useState<ChatHistoryItem[]>(
    items ?? CHAT_HISTORY_SAMPLE_ITEMS,
  );
  const [openMenuItemId, setOpenMenuItemId] = React.useState<string | null>(null);
  const [editingItem, setEditingItem] = React.useState<ChatHistoryItem | null>(null);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(activeItemId ?? null);
  const [openSessionKey, setOpenSessionKey] = React.useState<boolean | null>(null);
  const sessionKey = open ? true : null;

  const resolvedItems = items ?? internalItems;

  if (sessionKey !== openSessionKey) {
    setOpenSessionKey(sessionKey);
    if (sessionKey) {
      if (!isItemsControlled) {
        setInternalItems(CHAT_HISTORY_SAMPLE_ITEMS);
      }
      setOpenMenuItemId(null);
      setEditingItem(null);
      // Restore from parent when controlled; otherwise keep the last local selection.
      if (isActiveItemControlled) {
        setSelectedItemId(activeItemId);
      }
    }
  }

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setOpenMenuItemId(null);
        setEditingItem(null);
      }
      onOpenChange?.(nextOpen);
    },
    [onOpenChange],
  );

  const handleClose = React.useCallback(() => {
    setOpenMenuItemId(null);
    setEditingItem(null);
    onClose?.();
  }, [onClose]);

  const handleItemClick = React.useCallback(
    (item: ChatHistoryItem) => {
      setSelectedItemId(item.id);
      onItemSelect?.(item);
    },
    [onItemSelect],
  );

  const handleDotItemClick = React.useCallback(
    (item: ChatHistoryItem, value: string) => {
      setOpenMenuItemId(null);
      if (value === "edit") {
        setEditingItem(item);
        return;
      }
      if (value === "delete") {
        if (!isItemsControlled) {
          setInternalItems((prev) => prev.filter((entry) => entry.id !== item.id));
        }
        onItemDelete?.(item);
      }
    },
    [isItemsControlled, onItemDelete],
  );

  const handleEditOpenChange = React.useCallback((nextOpen: boolean) => {
    if (!nextOpen) {
      setEditingItem(null);
    }
  }, []);

  const handleRenameSave = React.useCallback(
    (nextName: string) => {
      if (!editingItem) {
        return;
      }

      if (!isItemsControlled) {
        setInternalItems((prev) =>
          prev.map((entry) => (entry.id === editingItem.id ? { ...entry, name: nextName } : entry)),
        );
      }

      onItemRename?.(editingItem, nextName);
      setEditingItem(null);
    },
    [editingItem, isItemsControlled, onItemRename],
  );

  return (
    <>
      <ModalLayout
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={handleOpenChange}
        title={title}
        titleIcon={<ClockIcon className="text-tooltip-text size-5" />}
        showIcon
        showMobileHandle={showMobileHandle}
        closeLabel={closeLabel}
        closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
        onClose={handleClose}
        dismissOnOutsideClick={!editingItem}
        overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
        className={cn(
          "border-surface-strong bg-dialog-bg z-100 flex max-h-[90vh] flex-col overflow-hidden p-1.5",
          "data-[vaul-drawer-direction=bottom]:max-h-[90vh]",
          contentClassName,
        )}
        innerClassName="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      >
        <div
          data-slot="chat-history-modal"
          className={cn(
            "scrollbar-hidden flex max-h-[min(380px,70vh)] min-h-0 flex-1 flex-col gap-2 overflow-y-auto",
            className,
          )}
        >
          <DialogDescription className="sr-only">
            Select a previous chat conversation to continue.
          </DialogDescription>

          {resolvedItems.length > 0 ? (
            resolvedItems.map((item) => {
              const isActive = item.id === selectedItemId;
              return (
                <ConversationStatus
                  key={item.id}
                  status={isActive ? "radio" : "memory"}
                  radioChecked={Boolean(item.unread)}
                  showAvatar={false}
                  name={item.name}
                  preview={item.preview}
                  className="w-full"
                  dotMenuItems={CHAT_HISTORY_DOT_MENU_ITEMS}
                  enableMobileMenu
                  menuOpen={openMenuItemId === item.id}
                  onMenuOpenChange={(nextOpen) => {
                    setOpenMenuItemId(nextOpen ? item.id : null);
                  }}
                  onDotItemClick={(value) => handleDotItemClick(item, value)}
                  dotAriaLabel={`${item.name} chat history options`}
                  aria-label={
                    isActive ? `${item.name} chat history, selected` : `${item.name} chat history`
                  }
                  onClick={() => handleItemClick(item)}
                />
              );
            })
          ) : (
            <p className="text-divider-label px-1 py-3 text-sm leading-5">{emptyMessage}</p>
          )}
        </div>
      </ModalLayout>

      <EditConversationNameModal
        open={Boolean(editingItem)}
        onOpenChange={handleEditOpenChange}
        defaultName={editingItem?.name ?? ""}
        onSave={handleRenameSave}
      />
    </>
  );
}
