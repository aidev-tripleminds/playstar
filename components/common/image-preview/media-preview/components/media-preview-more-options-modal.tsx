"use client";

import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import type { OptionListItem } from "@/components/common/general/option-list/option-list";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { getMediaPreviewMenuItems } from "../constants";

type MediaPreviewMoreOptionsModalProps = {
  open?: boolean;
  hasVideo?: boolean;
  menuItems?: OptionListItem[];
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (value: string) => void;
};

export function MediaPreviewMoreOptionsModal({
  open = false,
  hasVideo = false,
  menuItems: menuItemsProp,
  onOpenChange,
  onItemClick,
}: MediaPreviewMoreOptionsModalProps) {
  const menuItems = menuItemsProp ?? getMediaPreviewMenuItems({ hasVideo });

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Quick actions"
      titleIconSrc="/assets/flash.svg"
      showIcon
      showMobileHandle
      closeLabel="Close quick actions"
      overlayClassName="bg-black/40 supports-backdrop-filter:backdrop-blur-sm"
      className="z-99 max-h-[90vh] overflow-y-auto md:hidden"
    >
      <div data-slot="media-preview-more-options-modal" className="flex flex-col gap-2">
        <DialogDescription className="sr-only">
          Choose a quick action for this media.
        </DialogDescription>
        {menuItems.map((item) => (
          <button
            key={item.value}
            type="button"
            disabled={item.disabled}
            onClick={() => {
              onItemClick?.(item.value);
              onOpenChange?.(false);
            }}
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
