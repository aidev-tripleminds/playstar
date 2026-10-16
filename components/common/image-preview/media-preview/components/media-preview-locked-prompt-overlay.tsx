"use client";

import { Buttons } from "@/components/common/general/button/buttons";
import { cn } from "@/lib/utils";

import { MEDIA_PREVIEW_PREMIUM_UNLOCK_LABEL } from "../constants";
import type { MediaPreviewLockMode } from "../types";

type MediaPreviewLockedPromptOverlayProps = {
  mode?: MediaPreviewLockMode;
  unlockCost?: number;
  onUnlockPrompt?: () => void;
  className?: string;
};

export function MediaPreviewLockedPromptOverlay({
  mode = "coins",
  unlockCost = 1,
  onUnlockPrompt,
  className,
}: MediaPreviewLockedPromptOverlayProps) {
  const isMobile = window.innerWidth < 768;
  const isPremium = mode === "premium";

  return (
    <div
      data-slot="media-preview-locked-prompt-overlay"
      data-mode={mode}
      className={cn(
        "absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1.5 md:gap-2",
        className,
      )}
    >
      {isPremium ? (
        <Buttons
          type="button"
          variant="premium-full"
          size={isMobile ? "btn-xs" : "btn-s"}
          label={MEDIA_PREVIEW_PREMIUM_UNLOCK_LABEL}
          leftIcon={false}
          rightIcon={false}
          onClick={onUnlockPrompt}
          aria-label={MEDIA_PREVIEW_PREMIUM_UNLOCK_LABEL}
          className="w-fit bg-[#0A0A0A]"
        />
      ) : (
        <>
          <Buttons
            type="button"
            variant="light-grey"
            size={isMobile ? "btn-xs" : "btn-s"}
            label={`Unlock prompt for    ${unlockCost}`}
            leftIcon={false}
            rightIconSrc="/assets/spice-coin.png"
            rightIconSizeClassName={
              isMobile ? "h-[12px] w-[12px] left-0.5" : "h-[14px] w-[14px] left-0.5"
            }
            onClick={onUnlockPrompt}
            aria-label={`Unlock prompt for ${unlockCost}`}
            className="w-fit gap-0"
          />
          <p className="text-tooltip-text text-[10px] leading-3 md:text-[12px]">
            The creator will get a share.
          </p>
        </>
      )}
    </div>
  );
}
