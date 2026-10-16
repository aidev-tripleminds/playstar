"use client";

import Image from "next/image";
import type { MouseEventHandler } from "react";

import { BulkSelectImage } from "@/components/common/chat/bulk-select-image/bulk-select-image";
import { GenerateGroup } from "@/components/common/generate/generate-group";
import { InfoButton } from "@/components/common/generate/info-button";
import { PromptBoxSettingsButton } from "@/components/common/generate/prompt-box";
import {
  formatPromptboxHybridGuestUsageLabel,
  PROMPTBOX_HYBRID_CROWN_ICON_SRC,
  PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT,
} from "@/components/common/generate/promptbox-hybrid";

import { GENERATE_DESKTOP_BREAKPOINT } from "../_lib/constants";

type GenerateMobileActionsProps = {
  selectMode: boolean;
  selectedCount: number;
  onDelete: () => void;
  onExitSelectMode: () => void;
  isLoggedIn: boolean;
  guestUsageCount: number;
  guestUsageAtLimit: boolean;
  onGenerate: MouseEventHandler<HTMLButtonElement>;
  onInfoButtonClick: () => void;
  onSettingsClick: () => void;
};

export function GenerateMobileActions({
  selectMode,
  selectedCount,
  onDelete,
  onExitSelectMode,
  isLoggedIn,
  guestUsageCount,
  guestUsageAtLimit,
  onGenerate,
  onInfoButtonClick,
  onSettingsClick,
}: GenerateMobileActionsProps) {
  const guestTokenCost = guestUsageAtLimit ? (
    <Image
      src={PROMPTBOX_HYBRID_CROWN_ICON_SRC}
      alt=""
      aria-hidden
      width={18}
      height={18}
      className="size-[18px] shrink-0 object-contain"
    />
  ) : (
    formatPromptboxHybridGuestUsageLabel(guestUsageCount, PROMPTBOX_HYBRID_GUEST_USAGE_LIMIT)
  );

  return (
    <div
      data-slot="generate-mobile-actions"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30"
    >
      <div className="bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,#000_74.52%)] px-4 pt-8 pb-4">
        {selectMode ? (
          <BulkSelectImage
            desktopResolution={GENERATE_DESKTOP_BREAKPOINT}
            selectedCount={selectedCount}
            onDelete={onDelete}
            onExit={onExitSelectMode}
            className="pointer-events-auto"
          />
        ) : (
          <div
            data-slot="generate-mobile-generate-bar"
            className="pointer-events-auto flex w-full items-center gap-2"
          >
            <InfoButton size="mobile" onClick={onInfoButtonClick} />
            <GenerateGroup
              className="w-auto min-w-0 flex-1"
              showSkipQueue={false}
              tokenCost={isLoggedIn ? undefined : guestTokenCost}
              showTokenIcon={isLoggedIn}
              onGenerate={onGenerate}
            />
            <PromptBoxSettingsButton onClick={onSettingsClick} />
          </div>
        )}
      </div>
      <div aria-hidden className="h-18 bg-black" />
    </div>
  );
}
