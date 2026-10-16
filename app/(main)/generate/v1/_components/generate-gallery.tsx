"use client";

import Image from "next/image";

import { ModelEmptyStateSection } from "@/components/common/ai-model-pages/empty-state-section/empty-state-section";
import { Badge } from "@/components/common/general/badge/badge";
import { Buttons } from "@/components/common/general/button/buttons";
import { PlaceholderProcessing } from "@/components/common/general/placeholder-processing/placeholder-processing";
import { isRemoteImageSrc } from "@/components/common/image-preview/components/helpers";
import { cn } from "@/lib/utils";
import { TickOnlyIcon } from "@/public/assets/icons/tick-only";

import {
  GENERATE_EMPTY_STATE_CTA_BADGE,
  GENERATE_EMPTY_STATE_CTA_LABEL,
  GENERATE_EMPTY_STATE_DESCRIPTION,
  GENERATE_EMPTY_STATE_TITLE,
  GENERATE_GALLERY_EMPTY_CLASS,
  GENERATE_GALLERY_GRID_CLASS,
  GENERATE_NO_RESULTS_DESCRIPTION,
  GENERATE_NO_RESULTS_TITLE,
  GENERATE_PROCESSING_CARD_CLASS,
  GENERATE_SECTION_EMPTY_DESCRIPTION,
  GENERATE_SECTION_EMPTY_TITLE,
  type GenerateGalleryItem,
  type GenerateProcessingItem,
} from "../_lib/constants";

type GenerateGalleryProps = {
  items: GenerateGalleryItem[];
  libraryItemCount: number;
  processingItemCount: number;
  sectionItemCount: number;
  searchValue: string;
  selectMode: boolean;
  selectedIds: Set<string>;
  blurNsfw: boolean;
  showEmptyCta?: boolean;
  processingItems?: GenerateProcessingItem[];
  onSelectItem: (itemId: string) => void;
  onOpenItem: (itemId: string) => void;
  onClearSearch: () => void;
  onEmptyCtaClick: () => void;
  emptyClassName?: string;
  emptySectionClassName?: string;
  onCancelProcessing?: (itemId: string) => void;
  onSkipQueuedProcessing?: (item: GenerateProcessingItem) => void;
  onRetryProcessing?: (item: GenerateProcessingItem) => void;
  onCopyProcessingPrompt?: (item: GenerateProcessingItem) => void;
};

export function GenerateGallery({
  items,
  libraryItemCount,
  processingItemCount,
  sectionItemCount,
  searchValue,
  selectMode,
  selectedIds,
  blurNsfw,
  showEmptyCta = false,
  processingItems = [],
  onSelectItem,
  onOpenItem,
  onClearSearch,
  onEmptyCtaClick,
  emptyClassName,
  emptySectionClassName,
  onCancelProcessing,
  onSkipQueuedProcessing,
  onRetryProcessing,
  onCopyProcessingPrompt,
}: GenerateGalleryProps) {
  const hasLibraryMedia = libraryItemCount > 0 || processingItemCount > 0;

  if (!hasLibraryMedia) {
    return (
      <div
        data-slot="generate-gallery-empty"
        className={emptyClassName ?? GENERATE_GALLERY_EMPTY_CLASS}
      >
        <ModelEmptyStateSection
          title={GENERATE_EMPTY_STATE_TITLE}
          description={GENERATE_EMPTY_STATE_DESCRIPTION}
          className={emptySectionClassName}
          ctaSlot={
            showEmptyCta ? (
              <Buttons
                type="button"
                variant="rose"
                size="btn-m"
                leftIcon={false}
                rightIcon={false}
                label={GENERATE_EMPTY_STATE_CTA_LABEL}
                rightIconNode={
                  <Badge
                    type="empty"
                    size="medium"
                    text={GENERATE_EMPTY_STATE_CTA_BADGE}
                    showIcon
                  />
                }
                onClick={onEmptyCtaClick}
                className="w-fit"
              />
            ) : null
          }
        />
      </div>
    );
  }

  if (sectionItemCount === 0 && processingItems.length === 0) {
    return (
      <div
        data-slot="generate-gallery-section-empty"
        className="flex w-full flex-1 items-center justify-center"
      >
        <ModelEmptyStateSection
          title={GENERATE_SECTION_EMPTY_TITLE}
          description={GENERATE_SECTION_EMPTY_DESCRIPTION}
          ctaSlot={null}
        />
      </div>
    );
  }

  const showProcessingInGrid = processingItems.length > 0 && searchValue.trim().length === 0;
  const hasGridItems = items.length > 0 || showProcessingInGrid;

  if (!hasGridItems) {
    return (
      <div
        data-slot="generate-gallery-no-results"
        className="flex w-full flex-1 items-center justify-center"
      >
        <ModelEmptyStateSection
          title={GENERATE_NO_RESULTS_TITLE}
          description={GENERATE_NO_RESULTS_DESCRIPTION}
          ctaSlot={
            <Buttons
              type="button"
              variant="neutral"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label="Clear search"
              onClick={onClearSearch}
              className="w-fit"
            />
          }
        />
      </div>
    );
  }

  return (
    <ul data-slot="generate-gallery-grid" className={GENERATE_GALLERY_GRID_CLASS}>
      {showProcessingInGrid
        ? processingItems.map((item) => (
            <li key={item.id} className="block leading-0">
              <PlaceholderProcessing
                state={item.state}
                variant={item.state === "generating" ? "variant2" : "default"}
                progressLabel={`${item.progressPercent ?? 0}%`}
                className={GENERATE_PROCESSING_CARD_CLASS}
                onCancel={() => onCancelProcessing?.(item.id)}
                onSkipQueue={() => onSkipQueuedProcessing?.(item)}
                onPrimaryAction={() => onRetryProcessing?.(item)}
                onSecondaryAction={() => {
                  void onCopyProcessingPrompt?.(item);
                }}
              />
            </li>
          ))
        : null}
      {items.map((item) => (
        <GenerateMediaTile
          key={item.id}
          item={item}
          selectMode={selectMode}
          selected={selectedIds.has(item.id)}
          blurred={Boolean(blurNsfw && item.isNsfw)}
          onSelect={() => onSelectItem(item.id)}
          onOpen={() => onOpenItem(item.id)}
        />
      ))}
    </ul>
  );
}

type GenerateMediaTileProps = {
  item: GenerateGalleryItem;
  selectMode: boolean;
  selected: boolean;
  blurred: boolean;
  onSelect: () => void;
  onOpen: () => void;
};

function GenerateMediaTile({
  item,
  selectMode,
  selected,
  blurred,
  onSelect,
  onOpen,
}: GenerateMediaTileProps) {
  const mediaLabel = item.alt ?? "Generated media";
  const frameClassName = cn(
    "group relative aspect-3/4 w-full overflow-hidden scrollbar-hidden rounded-[16px] md:rounded-[24px]!",
    "bg-surface-subtle",
  );

  return (
    <li className="block leading-0">
      <button
        type="button"
        onClick={selectMode ? onSelect : onOpen}
        aria-pressed={selectMode ? selected : undefined}
        aria-label={
          selectMode
            ? `${selected ? "Deselect" : "Select"} ${mediaLabel}`
            : `Open ${mediaLabel} preview`
        }
        className={cn(
          frameClassName,
          "focus-visible:ring-brand-primary cursor-pointer outline-none focus-visible:ring-2",
          "transition-[transform,opacity] duration-150 hover:opacity-95 active:scale-[0.98]",
        )}
      >
        {item.kind === "video" || item.videoSrc ? (
          <video
            src={item.videoSrc ?? (typeof item.src === "string" ? item.src : undefined)}
            muted
            playsInline
            preload="metadata"
            className={cn(
              "absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105",
              blurred && "scale-105 blur-xl",
            )}
          />
        ) : (
          <Image
            src={item.src}
            alt={item.alt ?? ""}
            fill
            unoptimized={isRemoteImageSrc(item.src)}
            sizes="(max-width: 1099px) 50vw, (max-width: 1400px) 33vw, (max-width: 1600px) 25vw, 20vw"
            className={cn(
              "object-cover transition-transform duration-300 group-hover:scale-105",
              blurred && "scale-105 blur-xl",
            )}
          />
        )}

        {selected ? (
          <>
            <span
              aria-hidden
              className="border-brand-primary pointer-events-none absolute inset-0 z-10 rounded-[inherit] border-4"
            />
            <span className="bg-brand-primary absolute top-1/2 left-1/2 z-20 inline-flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-1.5">
              <TickOnlyIcon className="text-tooltip-text size-6" />
            </span>
          </>
        ) : null}
      </button>
    </li>
  );
}
