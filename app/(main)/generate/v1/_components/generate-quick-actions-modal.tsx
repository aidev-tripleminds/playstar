"use client";

import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { Toggle } from "@/components/common/general/toggle/toggle";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BlurIcon, CursorPointerIcon } from "@/public/assets/icons";

import {
  GENERATE_BLUR_NSFW_LABEL,
  GENERATE_BULK_SELECT_LABEL,
  GENERATE_QUICK_ACTIONS_TITLE,
} from "../_lib/constants";

type GenerateQuickActionsModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  blurNsfw: boolean;
  onBlurNsfwChange: (blurNsfw: boolean) => void;
  selectMode: boolean;
  onSelectModeToggle: () => void;
};

export function GenerateQuickActionsModal({
  open = false,
  onOpenChange,
  blurNsfw,
  onBlurNsfwChange,
  selectMode,
  onSelectModeToggle,
}: GenerateQuickActionsModalProps) {
  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={GENERATE_QUICK_ACTIONS_TITLE}
      titleIconSrc="/assets/flash.svg"
      showIcon
      showMobileHandle
      closeLabel="Close quick actions"
      className="z-999 md:hidden"
    >
      <div data-slot="generate-quick-actions-modal" className="flex flex-col gap-2">
        <DialogDescription className="sr-only">
          Toggle blur NSFW and bulk select for the gallery.
        </DialogDescription>

        <div
          className={cn(
            "bg-tooltip-default-bg text-tooltip-text flex w-full items-center gap-2 rounded-xl p-3",
          )}
        >
          <BlurIcon className={cn("text-tooltip-text size-5 shrink-0")} aria-hidden />
          <span className={cn("text-tooltip-text min-w-0 flex-1 text-sm leading-5 font-medium")}>
            {GENERATE_BLUR_NSFW_LABEL}
          </span>
          <Toggle
            checked={blurNsfw}
            onCheckedChange={onBlurNsfwChange}
            aria-label={GENERATE_BLUR_NSFW_LABEL}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            onSelectModeToggle();
            onOpenChange?.(false);
          }}
          aria-pressed={selectMode}
          className={cn(
            "bg-tooltip-default-bg text-tooltip-text flex w-full cursor-pointer items-center gap-2 rounded-xl p-3 text-left transition-colors",
          )}
        >
          <CursorPointerIcon className="size-5 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1 text-sm leading-5 font-medium">
            {GENERATE_BULK_SELECT_LABEL}
          </span>
        </button>
      </div>
    </ModalLayout>
  );
}
