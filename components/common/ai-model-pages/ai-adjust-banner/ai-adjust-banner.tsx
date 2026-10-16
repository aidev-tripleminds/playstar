"use client";

import * as React from "react";

import { AiAdjustBannerPanel } from "@/components/common/ai-model-pages/ai-adjust-banner/components";
import { Handle } from "@/components/common/general/handle/handle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AiAdjustBannerCropResult, AiAdjustBannerProps } from "@/types";

export { AiAdjustBannerPanel } from "./components";
export { AI_ADJUST_BANNER_ASPECT } from "@/lib/constants";
export type {
  AiAdjustBannerCropResult,
  AiAdjustBannerPanelProps,
  AiAdjustBannerProps,
} from "@/types";

export function AiAdjustBanner({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  showMobileHandle = true,
  contentClassName,
  title = "Adjust cover image",
  onCancel,
  onSave,
  ...panelProps
}: AiAdjustBannerProps) {
  const handleCancel = React.useCallback(() => {
    onCancel?.();
    onOpenChange?.(false);
  }, [onCancel, onOpenChange]);

  const handleSave = React.useCallback(
    async (result: AiAdjustBannerCropResult) => {
      await onSave?.(result);
      onOpenChange?.(false);
    },
    [onSave, onOpenChange],
  );

  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        data-slot="ai-adjust-banner"
        className={cn(
          "border-surface-strong bg-dialog-bg w-full max-w-[calc(100%-1rem)] gap-0 rounded-[48px] border p-0 shadow-none ring-0 outline-none",
          "top-auto bottom-2 translate-y-0 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2",
          "data-open:slide-in-from-bottom-10 data-closed:slide-out-to-bottom-10 sm:data-open:zoom-in-95 sm:data-closed:zoom-out-95",
          "sm:max-w-[min(100%,816px)]",
          contentClassName,
        )}
      >
        {showMobileHandle ? (
          <div className="flex justify-center pt-3 sm:hidden">
            <Handle />
          </div>
        ) : null}

        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Crop and adjust your profile cover image
        </DialogDescription>

        <AiAdjustBannerPanel
          {...panelProps}
          title={title}
          onSave={handleSave}
          onCancel={handleCancel}
          className="border-0 bg-transparent p-4 sm:p-8"
        />
      </DialogContent>
    </Dialog>
  );
}
