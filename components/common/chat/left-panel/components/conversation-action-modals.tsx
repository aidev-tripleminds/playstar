"use client";

import { MoreVertical } from "lucide-react";
import * as React from "react";

import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import type { OptionListItem } from "@/components/common/general/option-list/option-list";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PinIcon } from "@/public/assets/icons/pin-icon";
import { TrashIcon } from "@/public/assets/icons/trash-icon";

export function getConversationDotMenuItems(isPinned: boolean): OptionListItem[] {
  return [
    {
      value: "pin",
      label: isPinned ? "Unpin" : "Pin",
      leftIcon: <PinIcon className="size-5" />,
    },
    {
      value: "delete",
      label: "Delete",
      leftIcon: <TrashIcon className="size-5" />,
    },
  ];
}

type ConversationOptionsModalProps = {
  open?: boolean;
  isPinned?: boolean;
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (value: string) => void;
};

export function ConversationOptionsModal({
  open = false,
  isPinned = false,
  onOpenChange,
  onItemClick,
}: ConversationOptionsModalProps) {
  const menuItems = React.useMemo(() => getConversationDotMenuItems(isPinned), [isPinned]);

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Options"
      titleIcon={<MoreVertical className="text-tooltip-text size-5" aria-hidden />}
      showIcon
      showMobileHandle
      closeLabel="Close conversation options"
      overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
      className="z-99! max-h-[90vh] overflow-y-auto md:hidden"
    >
      <div data-slot="conversation-options-modal" className="flex flex-col gap-2">
        <DialogDescription className="sr-only">
          Choose a quick action for this conversation.
        </DialogDescription>
        {menuItems.map((item) => (
          <button
            key={item.value}
            type="button"
            disabled={item.disabled}
            onClick={() => onItemClick?.(item.value)}
            className={cn(
              "bg-tooltip-default-bg text-tooltip-text flex w-full cursor-pointer items-center justify-start! gap-2 rounded-xl p-3 text-left text-sm leading-5 font-medium",
              "transition-opacity hover:opacity-90",
              item.disabled && "cursor-not-allowed opacity-70 hover:opacity-70",
            )}
          >
            {item.leftIcon}
            <span className="flex">{item.label}</span>
          </button>
        ))}
      </div>
    </ModalLayout>
  );
}

type DeleteConversationModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
};

export function DeleteConversationModal({
  open = false,
  onOpenChange,
  onConfirm,
}: DeleteConversationModalProps) {
  return (
    <ModalLayout
      className="z-99!"
      open={open}
      onOpenChange={onOpenChange}
      title="Are you sure?"
      titleIconSrc="/assets/alert-icon.svg"
      showIcon
      showMobileHandle
      description="You’re about to delete a conversation. If you proceed, you won’t be able to restore it."
      generateLabel="Delete"
      cancelLabel="Cancel"
      closeLabel="Close delete confirmation"
      onGenerate={() => {
        onConfirm?.();
        onOpenChange?.(false);
      }}
      onCancel={() => onOpenChange?.(false)}
      overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
    />
  );
}
