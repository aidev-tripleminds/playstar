"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";
import * as React from "react";

import { DotOption } from "@/components/common/ai-model-pages/dot-option/dot-option";
import type { OptionListItem } from "@/components/common/general/option-list/option-list";
import { showToast } from "@/components/common/general/toast/toast";
import { ImagePreviewModel } from "@/components/common/image-preview/image-preview-model/image-preview-model";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BookmarkIcon, DownloadIcon } from "@/public/assets/icons";

import {
  defaultMediaPreviewMetadata,
  defaultMediaPreviewMetaVideodata,
  defaultMediaPreviewPromptPlaceholder,
  getMediaPreviewMenuItems,
} from "../constants";
import type { MediaPreviewLockMode } from "../types";
import { MediaPreviewActions } from "./media-preview-actions";
import { MediaPreviewLockedPromptOverlay } from "./media-preview-locked-prompt-overlay";

const COPIED_PROMPT_TOAST = "Copied prompt";

type MediaPreviewMetadataProps = {
  items: string[];
  className?: string;
};

export function MediaPreviewMetadata({ items, className }: MediaPreviewMetadataProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="media-preview-metadata"
      className={cn(
        "text-divider-label flex flex-wrap items-center justify-center gap-x-2 text-[14px] leading-5",
        className,
      )}
    >
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="inline-flex items-center gap-x-2">
          {index > 0 ? (
            <span aria-hidden className="text-divider-label/80">
              •
            </span>
          ) : null}
          <span>{item}</span>
        </span>
      ))}
    </div>
  );
}

type MediaPreviewPromptSectionProps = {
  prompt?: string;
  locked?: boolean;
  lockMode?: MediaPreviewLockMode;
  unlockCost?: number;
  onUnlockPrompt?: () => void;
  /** When false, renders the full prompt without a constrained scroll area. */
  scrollable?: boolean;
  className?: string;
};

export function MediaPreviewPromptSection({
  prompt,
  locked = false,
  lockMode = "coins",
  unlockCost = 1,
  onUnlockPrompt,
  scrollable = true,
  className,
}: MediaPreviewPromptSectionProps) {
  const displayPrompt = prompt?.trim() || defaultMediaPreviewPromptPlaceholder;
  const isPlaceholder = !prompt?.trim();
  const isLocked = locked && !isPlaceholder;
  const [copied, setCopied] = React.useState(false);
  const copiedResetTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (copiedResetTimerRef.current !== null) {
        window.clearTimeout(copiedResetTimerRef.current);
      }
    };
  }, []);

  const handleCopyPrompt = React.useCallback(async () => {
    if (isPlaceholder || isLocked || !displayPrompt || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(displayPrompt);
      showToast({ type: "success", text: COPIED_PROMPT_TOAST });
      setCopied(true);
      if (copiedResetTimerRef.current !== null) {
        window.clearTimeout(copiedResetTimerRef.current);
      }
      copiedResetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        copiedResetTimerRef.current = null;
      }, 1500);
    } catch {
      // Clipboard can fail without permission; leave the button idle.
    }
  }, [displayPrompt, isLocked, isPlaceholder]);

  const promptText = <p className="text-tooltip-text text-sm leading-5">{displayPrompt}</p>;

  return (
    <div
      data-slot="media-preview-prompt-section"
      data-locked={isLocked ? "true" : undefined}
      data-lock-mode={isLocked ? lockMode : undefined}
      data-placeholder={isPlaceholder ? "true" : undefined}
      className={cn("flex min-h-0 flex-col gap-2", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-divider-label text-sm leading-5">Prompt</span>
        <button
          type="button"
          aria-label={copied ? "Prompt copied" : "Copy prompt"}
          disabled={isLocked || isPlaceholder}
          onClick={() => {
            void handleCopyPrompt();
          }}
          className="text-tooltip-text flex size-4 cursor-pointer items-center justify-center transition-opacity hover:opacity-80 disabled:pointer-events-none disabled:opacity-40"
        >
          <Image src="/assets/sm-copy.svg" alt="" width={16} height={16} className="size-4" />
        </button>
      </div>
      <div className="relative min-h-0 flex-1 overflow-visible [overflow-wrap:anywhere]">
        {isLocked ? (
          // Skip ScrollArea when locked — overflow:hidden clips filter:blur into a hard rectangle.
          // Extra inset lets the 10px blur bleed so the smear fades instead of looking cut.
          <p
            data-slot="media-preview-locked-prompt-text"
            aria-hidden
            className="text-tooltip-text pointer-events-none -m-3 overflow-visible p-3 text-sm leading-5 blur-[10px] select-none"
          >
            {displayPrompt}
          </p>
        ) : scrollable ? (
          <ScrollArea
            type="always"
            className="h-full min-h-0 pr-1 [&_[data-slot=scroll-area-scrollbar]]:w-1 [&_[data-slot=scroll-area-scrollbar]]:border-l-0 [&_[data-slot=scroll-area-thumb]]:rounded-full [&_[data-slot=scroll-area-thumb]]:bg-white/30"
          >
            {promptText}
          </ScrollArea>
        ) : (
          promptText
        )}
        {isLocked ? (
          <MediaPreviewLockedPromptOverlay
            mode={lockMode}
            unlockCost={unlockCost}
            onUnlockPrompt={onUnlockPrompt}
          />
        ) : null}
      </div>
    </div>
  );
}

type MediaPreviewModelSlotProps = {
  modelTitle?: string;
  modelImageSrc?: string | StaticImageData;
  onCreateModelClick?: () => void;
};

export function MediaPreviewModelSlot({
  modelTitle,
  modelImageSrc,
  onCreateModelClick,
}: MediaPreviewModelSlotProps) {
  if (modelTitle || modelImageSrc) {
    return <ImagePreviewModel imageSrc={modelImageSrc ?? ""} title={modelTitle} status="filled" />;
  }

  return (
    <ImagePreviewModel
      className="w-full cursor-pointer"
      status="empty"
      onEmptyClick={onCreateModelClick}
    />
  );
}

type MediaPreviewDetailsPanelProps = {
  postedAt?: string;
  modelTitle?: string;
  modelImageSrc?: string | StaticImageData;
  onCreateModelClick?: () => void;
  prompt?: string;
  locked?: boolean;
  lockMode?: MediaPreviewLockMode;
  unlockCost?: number;
  onUnlockPrompt?: () => void;
  metadata?: string[];
  hasVideo?: boolean;
  menuItems?: OptionListItem[];
  /** Whether the viewer saved this media. */
  saved?: boolean;
  /** Save switch. Absent: no save button (the slide is not a stored media row). */
  onSave?: () => void;
  onDownload?: () => void;
  onMore?: () => void;
  onMoreItemClick?: (value: string) => void;
  onEdit?: () => void;
  onRemix?: () => void;
  onCreateVideo?: () => void;
  onUseInTemplate?: () => void;
  onExtendVideo?: () => void;
  createVideoLabel?: string;
  editDisabled?: boolean;
  remixDisabled?: boolean;
  createVideoDisabled?: boolean;
  extendVideoDisabled?: boolean;
  canGenerateFrom?: boolean;
  showVideoActions?: boolean;
  showActions?: boolean;
  className?: string;
};

export function MediaPreviewDetailsPanel({
  hasVideo = false,
  menuItems: menuItemsProp,
  postedAt,
  modelTitle,
  modelImageSrc,
  onCreateModelClick,
  prompt,
  locked = false,
  lockMode = "coins",
  unlockCost = 1,
  onUnlockPrompt,
  metadata,
  saved = false,
  onSave,
  onDownload,
  onMore,
  onMoreItemClick,
  onEdit,
  onRemix,
  onCreateVideo,
  onUseInTemplate,
  onExtendVideo,
  createVideoLabel,
  editDisabled = false,
  remixDisabled = false,
  createVideoDisabled = false,
  extendVideoDisabled = false,
  canGenerateFrom = true,
  showVideoActions = true,
  showActions = true,
  className,
}: MediaPreviewDetailsPanelProps) {
  const resolvedMetadata =
    metadata ?? (hasVideo ? defaultMediaPreviewMetaVideodata : defaultMediaPreviewMetadata);
  const menuItems = menuItemsProp ?? getMediaPreviewMenuItems({ hasVideo });

  return (
    <aside
      data-slot="media-preview-details-panel"
      className={cn(
        "bg-dialog-bg text-tooltip-text flex w-full shrink-0 flex-col gap-4 overflow-hidden p-4",
        "md:w-[300px] md:rounded-r-[24px]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-divider-label min-w-0 flex-1 text-sm leading-5">{postedAt}</span>
        {showActions ? (
          <>
            {onSave ? (
              <button
                type="button"
                aria-label={saved ? "Unsave" : "Save"}
                aria-pressed={saved}
                onClick={onSave}
                className="cursor-pointer opacity-90 hover:opacity-100"
              >
                <BookmarkIcon
                  filled={saved}
                  className={cn(
                    "size-6",
                    saved ? "text-amber-col" : "text-tooltip-text md:text-neutral-300",
                  )}
                />
              </button>
            ) : null}
            <button
              type="button"
              aria-label="Download"
              onClick={onDownload}
              className="cursor-pointer opacity-90 hover:opacity-100"
            >
              <DownloadIcon className="siz-6 text-tooltip-text md:text-neutral-300" />
            </button>
            <DotOption items={menuItems} onTriggerClick={onMore} onItemClick={onMoreItemClick} />
          </>
        ) : null}
      </div>
      <div className="flex justify-center">
        <MediaPreviewModelSlot
          modelTitle={modelTitle}
          modelImageSrc={modelImageSrc}
          onCreateModelClick={onCreateModelClick}
        />
      </div>

      <MediaPreviewPromptSection
        prompt={prompt}
        locked={locked}
        lockMode={lockMode}
        unlockCost={unlockCost}
        onUnlockPrompt={onUnlockPrompt}
        className="flex-1"
      />
      <div className="mt-auto flex w-full flex-col gap-4">
        <MediaPreviewMetadata items={resolvedMetadata} />

        {showActions ? (
          <MediaPreviewActions
            hasVideo={hasVideo}
            onEdit={onEdit}
            onRemix={onRemix}
            onCreateVideo={onCreateVideo}
            onUseInTemplate={onUseInTemplate}
            onExtendVideo={onExtendVideo}
            createVideoLabel={createVideoLabel}
            editDisabled={editDisabled}
            remixDisabled={remixDisabled}
            createVideoDisabled={createVideoDisabled}
            extendVideoDisabled={extendVideoDisabled}
            canGenerateFrom={canGenerateFrom}
            showVideoActions={showVideoActions}
          />
        ) : null}
      </div>
    </aside>
  );
}
