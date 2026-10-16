"use client";

import * as React from "react";

import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import type { OptionListItem } from "@/components/common/general/option-list/option-list";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type CallOptionsModalProps = {
  open?: boolean;
  name?: string;
  items: OptionListItem[];
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (value: string) => void;
};

function getCallTitle(name: string) {
  const firstName = name.trim().split(/\s+/)[0];
  return `Call ${firstName || "contact"}`;
}

function CallOptionIcon({ item }: { item: OptionListItem }) {
  if (item.leftIcon) {
    return <>{item.leftIcon}</>;
  }

  if (React.isValidElement(item.leftIconSrc)) {
    return item.leftIconSrc;
  }

  return null;
}

export function CallOptionsModal({
  open = false,
  name = "Cassy",
  items,
  onOpenChange,
  onItemClick,
}: CallOptionsModalProps) {
  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={getCallTitle(name)}
      titleIconSrc="/assets/phone-green.svg"
      showIcon
      showMobileHandle
      closeLabel="Close call options"
      overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
      className="z-99!"
    >
      <div data-slot="call-options-modal" className="flex flex-col gap-2">
        <DialogDescription className="sr-only">Choose audio or video call.</DialogDescription>
        {items.map((item) => (
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
            <CallOptionIcon item={item} />
            <span className="flex">{item.label}</span>
          </button>
        ))}
      </div>
    </ModalLayout>
  );
}
