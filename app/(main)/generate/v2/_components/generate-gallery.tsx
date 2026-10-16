"use client";

import Image from "next/image";
import * as React from "react";

import { ModelEmptyStateSection } from "@/components/common/ai-model-pages/empty-state-section/empty-state-section";
import { Add } from "@/components/common/general/add";
import { Buttons } from "@/components/common/general/button/buttons";
import { PlaceholderProcessing } from "@/components/common/general/placeholder-processing/placeholder-processing";
import { Spinner } from "@/components/common/general/spinner";
import { UnblurOverlay } from "@/components/common/general/unblur-overlay";
import { isRemoteImageSrc } from "@/components/common/image-preview/components/helpers";
import { SKIP_QUEUE_FEATURE_ENABLED } from "@/lib/feature-flags";
import { cn } from "@/lib/utils";
import { TickOnlyIcon } from "@/public/assets/icons/tick-only";

import {
  GENERATE_EMPTY_STATE_CTA_BADGE,
  GENERATE_EMPTY_STATE_CTA_LABEL,
  GENERATE_EMPTY_STATE_DESCRIPTION,
  GENERATE_EMPTY_STATE_TITLE,
  GENERATE_GALLERY_DOCK_OFFSET_CLASS,
  GENERATE_GALLERY_EMPTY_CLASS,
  GENERATE_GALLERY_GRID_CLASS,
  GENERATE_NO_RESULTS_DESCRIPTION,
  GENERATE_NO_RESULTS_TITLE,
  GENERATE_PROCESSING_CARD_CLASS,
  GENERATE_SECTION_EMPTY_DESCRIPTION,
  GENERATE_SECTION_EMPTY_TITLE,
} from "../_lib/constants";
import { editImageLoadTarget } from "../_lib/edit-image-picker";
import { orderGenerateGalleryEntries } from "../_lib/generate-gallery-order";
import type { GenerateGalleryItem, GenerateProcessingItem } from "../_lib/types";

type GenerateGalleryProps = {
  items: GenerateGalleryItem[];
  libraryItemCount: number;
  sectionItemCount: number;
  searchValue: string;
  selectMode: boolean;
  selectedIds: Set<string>;
  blurNsfw: boolean;
  /** True while the persisted gallery list is in flight. */
  isLoading?: boolean;
  /** Guest-only "Create for Free" CTA. Hidden when the user is logged in. */
  showEmptyCta?: boolean;
  processingItems?: GenerateProcessingItem[];
  onSelectItem: (itemId: string) => void;
  onOpenItem: (itemId: string) => void;
  onClearSearch: () => void;
  onEmptyCtaClick: () => void;
  onCancelProcessing?: (itemId: string) => void;
  onSkipQueuedProcessing?: (item: GenerateProcessingItem) => void;
  onRetryProcessing?: (item: GenerateProcessingItem) => void;
  onCopyProcessingPrompt?: (item: GenerateProcessingItem) => void;
  /** When false, hides Skip queue on queued cards. */
  showSkipQueueAction?: boolean;
  /** True when get-users-character-media has another page of 60. */
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  /**
   * Edit Image only. When set, each still the provider can seed shows a plus
   * that loads it into the prompt placeholder.
   */
  onAddToEditImage?: (item: GenerateGalleryItem) => void;
};

export function GenerateGallery({
  items,
  libraryItemCount,
  sectionItemCount,
  searchValue,
  selectMode,
  selectedIds,
  blurNsfw,
  isLoading = false,
  showEmptyCta = false,
  processingItems = [],
  onSelectItem,
  onOpenItem,
  onClearSearch,
  onEmptyCtaClick,
  onCancelProcessing,
  onSkipQueuedProcessing,
  onRetryProcessing,
  onCopyProcessingPrompt,
  showSkipQueueAction = SKIP_QUEUE_FEATURE_ENABLED,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  onAddToEditImage,
}: GenerateGalleryProps) {
  const showProcessingInGrid = processingItems.length > 0 && searchValue.trim().length === 0;

  if (
    isLoading &&
    sectionItemCount === 0 &&
    !showProcessingInGrid &&
    searchValue.trim().length === 0
  ) {
    return <div data-slot="generate-gallery-loading" className={GENERATE_GALLERY_EMPTY_CLASS} />;
  }

  if (sectionItemCount === 0 && !showProcessingInGrid && searchValue.trim().length === 0) {
    const isLibraryEmpty = libraryItemCount === 0;
    const showCta = isLibraryEmpty && showEmptyCta;

    return (
      <div data-slot="generate-gallery-empty" className={GENERATE_GALLERY_EMPTY_CLASS}>
        <ModelEmptyStateSection
          title={isLibraryEmpty ? GENERATE_EMPTY_STATE_TITLE : GENERATE_SECTION_EMPTY_TITLE}
          description={
            isLibraryEmpty ? GENERATE_EMPTY_STATE_DESCRIPTION : GENERATE_SECTION_EMPTY_DESCRIPTION
          }
          ctaSlot={
            showCta ? (
              <Buttons
                type="button"
                variant="rose"
                size="btn-m"
                leftIcon={false}
                rightIcon
                rightIconSrc="/assets/spice-coin.png"
                rightIconSizeClassName="h-[16px] w-[16px]"
                label={`${GENERATE_EMPTY_STATE_CTA_LABEL} ${GENERATE_EMPTY_STATE_CTA_BADGE}`.trim()}
                aria-label={`${GENERATE_EMPTY_STATE_CTA_LABEL} ${GENERATE_EMPTY_STATE_CTA_BADGE}`}
                onClick={onEmptyCtaClick}
                className="w-fit gap-1.5"
              />
            ) : null
          }
          className="max-[767px]:max-w-none"
        />
      </div>
    );
  }

  if (items.length === 0 && !showProcessingInGrid) {
    return (
      <div data-slot="generate-gallery-no-results" className={GENERATE_GALLERY_EMPTY_CLASS}>
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

  const gridEntries = showProcessingInGrid
    ? orderGenerateGalleryEntries(processingItems, items)
    : items.map((item) => ({ type: "media" as const, item }));

  return (
    <ul
      data-slot="generate-gallery-grid"
      className={cn(GENERATE_GALLERY_GRID_CLASS, GENERATE_GALLERY_DOCK_OFFSET_CLASS)}
    >
      {gridEntries.map((entry) =>
        entry.type === "processing" ? (
          <li
            key={`processing-${entry.item.id}`}
            className="block leading-0"
            data-slot="generate-processing-item"
          >
            <PlaceholderProcessing
              state={entry.item.state}
              variant={entry.item.state === "generating" ? "variant2" : "default"}
              progressLabel={`${entry.item.progressPercent ?? 0}%`}
              className={GENERATE_PROCESSING_CARD_CLASS}
              onCancel={() => onCancelProcessing?.(entry.item.id)}
              showSkipQueueAction={showSkipQueueAction}
              onSkipQueue={() => onSkipQueuedProcessing?.(entry.item)}
              onPrimaryAction={() => onRetryProcessing?.(entry.item)}
              onSecondaryAction={() => {
                void onCopyProcessingPrompt?.(entry.item);
              }}
              moderationTitle={entry.item.failure}
              onDismiss={
                entry.item.state === "moderation-issue"
                  ? () => onCancelProcessing?.(entry.item.id)
                  : undefined
              }
            />
          </li>
        ) : (
          <GenerateMediaTile
            key={entry.item.id}
            item={entry.item}
            selectMode={selectMode}
            selected={selectedIds.has(entry.item.id)}
            blurred={Boolean(blurNsfw && entry.item.isNsfw)}
            onSelect={() => onSelectItem(entry.item.id)}
            onOpen={() => onOpenItem(entry.item.id)}
            onAddToEditImage={
              onAddToEditImage && !selectMode && editImageLoadTarget(entry.item)
                ? () => onAddToEditImage(entry.item)
                : undefined
            }
          />
        ),
      )}
      {hasNextPage || isFetchingNextPage ? (
        <GenerateGalleryLoadMore
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={onLoadMore}
        />
      ) : null}
    </ul>
  );
}

type GenerateGalleryLoadMoreProps = {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore?: () => void;
};

function GenerateGalleryLoadMore({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: GenerateGalleryLoadMoreProps) {
  const sentinelRef = React.useRef<HTMLLIElement>(null);

  React.useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore?.();
        }
      },
      {
        // Viewport root works for both document-scroll (mobile, Safari HUD)
        // and nested gallery overflow (desktop clips the intersection).
        root: null,
        rootMargin: "320px 0px",
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <li
      ref={sentinelRef}
      data-slot="generate-gallery-load-more"
      className="col-span-full flex min-h-10 items-center justify-center py-4"
    >
      {isFetchingNextPage ? <Spinner aria-label="Loading more" /> : null}
    </li>
  );
}

type GenerateMediaTileProps = {
  item: GenerateGalleryItem;
  selectMode: boolean;
  selected: boolean;
  blurred: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onAddToEditImage?: () => void;
};

function GenerateMediaTile({
  item,
  selectMode,
  selected,
  blurred,
  onSelect,
  onOpen,
  onAddToEditImage,
}: GenerateMediaTileProps) {
  const mediaLabel = item.alt ?? "Generated media";
  const tileImageSrc = item.cardSrc ?? item.src;

  return (
    <li className="relative block leading-0">
      <button
        type="button"
        onClick={selectMode ? onSelect : onOpen}
        aria-pressed={selectMode ? selected : undefined}
        aria-label={
          selectMode
            ? `${selected ? "Deselect" : "Select"} ${mediaLabel}`
            : `Open ${mediaLabel} preview`
        }
        data-blurred={blurred ? "true" : "false"}
        className={cn(
          "group bg-surface-subtle relative aspect-3/4 w-full overflow-hidden rounded-[12px] md:rounded-[16px]!",
          "focus-visible:ring-brand-primary cursor-pointer outline-none focus-visible:ring-2",
          "transition-[transform,opacity] duration-150 hover:opacity-95 active:scale-[0.98]",
        )}
      >
        {/* A backend-`blurred` video plays only its blurred `videoSrc`; its `src` is a still. */}
        {item.videoSrc || (!item.blurred && item.kind === "video") ? (
          <video
            src={
              item.cardSrc ?? item.videoSrc ?? (typeof item.src === "string" ? item.src : undefined)
            }
            poster={item.posterSrc}
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
            src={tileImageSrc}
            alt={item.alt ?? ""}
            fill
            unoptimized={isRemoteImageSrc(tileImageSrc)}
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
      {/* A sibling, not a child: the tile is itself a button. */}
      {onAddToEditImage ? (
        <Add
          aria-label={`Add ${mediaLabel} to Edit image`}
          onClick={onAddToEditImage}
          className="absolute top-3 right-3 z-20 size-6 md:top-4 md:right-[15.5px] md:size-7 [&_svg]:size-4 md:[&_svg]:size-5"
        />
      ) : null}
      {item.blurred && !selectMode ? (
        <UnblurOverlay className="rounded-[16px] md:rounded-[24px]" />
      ) : null}
    </li>
  );
}
