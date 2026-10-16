"use client";

import * as React from "react";

import { DEFAULT_RIGHT_PANEL_FORWARD_ITEMS } from "@/components/common/chat/right-panel/constants";
import { Forward } from "@/components/common/general/forward/forward";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { Toggle } from "@/components/common/general/toggle/toggle";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BrainIcon } from "@/public/assets/icons";

export const CHAT_ADVANCED_SETTINGS_TITLE = "Advanced settings";
export const CHAT_ADVANCED_SETTINGS_TITLE_ICON_SRC = "/assets/settings-outline.svg";
export const CHAT_ADVANCED_SETTINGS_REASONING_LABEL = "Reasoning mode";

const CHAT_ADVANCED_SETTINGS_ITEMS = DEFAULT_RIGHT_PANEL_FORWARD_ITEMS;

export type ChatAdvancedSettingsModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  reasoningMode?: boolean;
  onReasoningModeChange?: (enabled: boolean) => void;
  onItemClick?: (id: string) => void;
  className?: string;
};

export function ChatAdvancedSettingsModal({
  open = false,
  onOpenChange,
  reasoningMode = true,
  onReasoningModeChange,
  onItemClick,
  className,
}: ChatAdvancedSettingsModalProps) {
  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={CHAT_ADVANCED_SETTINGS_TITLE}
      titleIconSrc={CHAT_ADVANCED_SETTINGS_TITLE_ICON_SRC}
      showIcon
      showMobileHandle
      overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
      closeLabel="Close advanced settings"
      className={cn(
        "z-999 flex! h-fit! max-h-[min(496px,calc(100dvh-1rem))]! flex-col overflow-visible",
        "data-[vaul-drawer-direction=bottom]:h-fit! data-[vaul-drawer-direction=bottom]:max-h-[min(496px,calc(100dvh-1rem))]!",
        className,
      )}
      innerClassName="flex min-h-0 flex-col gap-4"
    >
      <div data-slot="chat-advanced-settings-modal" className="flex w-full flex-col gap-4">
        <DialogDescription className="sr-only">
          Toggle reasoning mode and open writing style, group members, voice, persona, memory, or
          chat history.
        </DialogDescription>

        <div
          data-slot="chat-advanced-settings-reasoning"
          className="bg-tooltip-default-bg flex w-full items-center gap-2 rounded-xl p-3"
        >
          <BrainIcon className="text-tooltip-text size-5 shrink-0" aria-hidden />
          <span className="text-tooltip-text flex-1 text-sm leading-5 font-medium">
            {CHAT_ADVANCED_SETTINGS_REASONING_LABEL}
          </span>
          <Toggle
            checked={reasoningMode}
            onCheckedChange={onReasoningModeChange}
            aria-label={CHAT_ADVANCED_SETTINGS_REASONING_LABEL}
          />
        </div>

        <div
          data-slot="chat-advanced-settings-items"
          className="divide-border-strong bg-tooltip-default-bg flex w-full flex-col divide-y overflow-hidden rounded-2xl"
        >
          {CHAT_ADVANCED_SETTINGS_ITEMS.map((item) => (
            <Forward
              key={item.id}
              type="button"
              status="panel"
              label={item.label}
              leftIcon={typeof item.leftIconSrc === "string" ? undefined : item.leftIconSrc}
              leftIconSrc={typeof item.leftIconSrc === "string" ? item.leftIconSrc : undefined}
              showLeftIcon
              showRightIcon
              className="text-tooltip-text! rounded-none"
              onClick={() => onItemClick?.(item.id)}
            />
          ))}
        </div>
      </div>
    </ModalLayout>
  );
}
