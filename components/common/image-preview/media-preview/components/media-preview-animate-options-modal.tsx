"use client";

import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { MagicPenIcon, RecoveryIcon, VideoSquareIcon } from "@/public/assets/icons";

type MediaPreviewAnimateOptionsModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCustomPrompt?: () => void;
  onUseTemplate?: () => void;
};

const optionClassName = cn(
  "bg-tooltip-default-bg text-tooltip-text flex w-full cursor-pointer items-center justify-start gap-2 rounded-xl p-3 text-left text-sm leading-5 font-medium",
  "transition-opacity hover:opacity-90",
);

export function MediaPreviewAnimateOptionsModal({
  open = false,
  onOpenChange,
  onCustomPrompt,
  onUseTemplate,
}: MediaPreviewAnimateOptionsModalProps) {
  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Animate image"
      titleIcon={<VideoSquareIcon className="size-5" />}
      showIcon
      showMobileHandle
      closeLabel="Close animate image"
      overlayClassName="bg-black/40 supports-backdrop-filter:backdrop-blur-sm"
      className="z-99 max-h-[90vh] overflow-y-auto md:hidden"
    >
      <div data-slot="media-preview-animate-options-modal" className="flex flex-col gap-2">
        <DialogDescription className="sr-only">
          Animate this image with a custom prompt or a template.
        </DialogDescription>
        <button type="button" className={optionClassName} onClick={onCustomPrompt}>
          <MagicPenIcon className="size-5 shrink-0" />
          <span>Custom prompt</span>
        </button>
        <button type="button" className={optionClassName} onClick={onUseTemplate}>
          <RecoveryIcon className="size-5 shrink-0" />
          <span>With a template</span>
        </button>
      </div>
    </ModalLayout>
  );
}
