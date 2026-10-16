"use client";

import "@/components/common/image-preview/embla-carousel/embla-carousel.css";

import { useRouter } from "next/navigation";
import * as React from "react";

import { UnblurOverlay } from "@/components/common/general/unblur-overlay";
import {
  EmblaCarouselMain,
  EmblaCarouselThumbsView,
  useEmblaCarouselSync,
} from "@/components/common/image-preview/embla-carousel/embla-carousel";
import type { EmblaCarouselSlide } from "@/components/common/image-preview/embla-carousel/types";
import {
  getQuickActionItems,
  QuickActions,
} from "@/components/common/image-preview/quick-actions/quick-actions";
import type { QuickActionsModelStatus } from "@/components/common/image-preview/quick-actions/types";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useMediaSaved } from "@/hooks/use-media-saved";
import { resolveAsset } from "@/lib/assets/asset-store";
import { buildCreateAiCharacterIntroHref } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { InfoIcon } from "@/public/assets/icons";

import { MediaPreviewAnimateOptionsModal } from "./components/media-preview-animate-options-modal";
import { MediaPreviewBlurredBackdrop } from "./components/media-preview-blurred-backdrop";
import { MediaPreviewDetailsPanel } from "./components/media-preview-details-panel";
import { MediaPreviewExtendOptionsModal } from "./components/media-preview-extend-options-modal";
import { MediaPreviewImageDetailsModal } from "./components/media-preview-image-details-modal";
import { MediaPreviewLockedPromptOverlay } from "./components/media-preview-locked-prompt-overlay";
import { MediaPreviewMoreOptionsModal } from "./components/media-preview-more-options-modal";
import { MediaPreviewNavButton } from "./components/media-preview-nav-button";
import { MediaPreviewTemplatePicker } from "./components/media-preview-template-picker";
import {
  MediaPreviewActionBar,
  MediaPreviewImageControls,
} from "./components/media-preview-toolbar";
import {
  defaultMediaPreviewItems,
  defaultMediaPreviewMetadata,
  defaultMediaPreviewMetaVideodata,
  defaultMediaPreviewPrompt,
  defaultMediaPreviewPromptPlaceholder,
  getMediaPreviewMenuItems,
} from "./constants";
import type { MediaPreviewItem, MediaPreviewProps } from "./types";

export {
  defaultMediaPreviewItems,
  defaultMediaPreviewMetadata,
  defaultMediaPreviewMetaVideodata,
  defaultMediaPreviewPrompt,
} from "./constants";
export type {
  MediaPreviewItem,
  MediaPreviewLockMode,
  MediaPreviewProps,
  MediaPreviewVariant,
} from "./types";

function toEmblaSlides(items: MediaPreviewItem[]): EmblaCarouselSlide[] {
  return items.map((item) => ({
    id: item.id,
    // The main view is full-screen: the HD rendition when there is one.
    src: !item.videoSrc && item.fullSrc ? item.fullSrc : item.src,
    alt: item.alt,
    label: item.alt,
    videoSrc: item.videoSrc ? (item.fullSrc ?? item.videoSrc) : undefined,
    // A video's card is an MP4, so its thumbnail is the poster; an image's is the card.
    thumbSrc: item.videoSrc ? item.posterSrc : item.cardSrc,
  }));
}

export function MediaPreview({
  items = defaultMediaPreviewItems,
  selectedIndex: selectedIndexProp,
  defaultSelectedIndex = 0,
  onSelectedIndexChange,
  variant = "default",
  modelStatus = "ai-model",
  modelTitle = "Eva Marina Petranova",
  modelImageSrc = resolveAsset("demo_pics_model4").image ?? "",
  onCreateModelClick,
  postedAt = "23 days ago",
  prompt = defaultMediaPreviewPrompt,
  metadata,
  content = "image",
  unlockCost = 1,
  onUnlockPrompt,
  onClose,
  onExpand,
  onDownload,
  onMore,
  onMoreItemClick,
  showSetProfilePicture = false,
  onEdit,
  onRemix,
  onCreateVideo,
  onExtendVideo,
  onUseInTemplate,
  onQuickAction,
  createVideoLabel = "Create video",
  editDisabled = false,
  remixDisabled = false,
  createVideoDisabled = false,
  extendVideoDisabled = false,
  canGenerateFrom = true,
  showVideoActions = true,
  showActions = true,
  className,
  ...props
}: MediaPreviewProps) {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const handleCreateModelClick = React.useCallback(() => {
    if (onCreateModelClick) {
      onCreateModelClick();
      return;
    }
    router.push(buildCreateAiCharacterIntroHref());
  }, [onCreateModelClick, router]);
  const [imageDetailsOpen, setImageDetailsOpen] = React.useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = React.useState(false);
  const [extendOptionsOpen, setExtendOptionsOpen] = React.useState(false);
  const [animateOptionsOpen, setAnimateOptionsOpen] = React.useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = React.useState(false);
  const [isImageExpanded, setIsImageExpanded] = React.useState(false);
  const [wasDesktop, setWasDesktop] = React.useState(isDesktop);
  const slides = React.useMemo(() => toEmblaSlides(items), [items]);

  // Mobile-only modals leave a portal overlay blur if left open across the breakpoint.
  if (isDesktop !== wasDesktop) {
    setWasDesktop(isDesktop);
    if (isDesktop) {
      setImageDetailsOpen(false);
      setMoreOptionsOpen(false);
      setExtendOptionsOpen(false);
      setAnimateOptionsOpen(false);
    }
  }

  const openTemplatePicker = React.useCallback(() => {
    setImageDetailsOpen(false);
    setExtendOptionsOpen(false);
    setAnimateOptionsOpen(false);
    setTemplatePickerOpen(true);
  }, []);

  const handleUseInTemplate = React.useCallback(() => {
    openTemplatePicker();
    onUseInTemplate?.();
  }, [onUseInTemplate, openTemplatePicker]);

  const handleExtendVideo = React.useCallback(() => {
    setImageDetailsOpen(false);
    setExtendOptionsOpen(false);
    onExtendVideo?.();
  }, [onExtendVideo]);

  const handleMobileExtend = React.useCallback(() => {
    setImageDetailsOpen(false);
    setExtendOptionsOpen(true);
  }, []);

  const handleCreateVideo = React.useCallback(() => {
    setImageDetailsOpen(false);
    setAnimateOptionsOpen(false);
    onCreateVideo?.();
  }, [onCreateVideo]);

  const handleMobileAnimate = React.useCallback(() => {
    setImageDetailsOpen(false);
    setAnimateOptionsOpen(true);
  }, []);

  const handleQuickAction = React.useCallback(
    (value: string) => {
      if (value === "create-ai") {
        handleCreateModelClick();
        return;
      }
      if (value === "extend") {
        if (!isDesktop) {
          setExtendOptionsOpen(true);
          return;
        }
        handleExtendVideo();
        return;
      }
      if (value === "animate") {
        if (!isDesktop) {
          setAnimateOptionsOpen(true);
          return;
        }
        handleCreateVideo();
        return;
      }
      onQuickAction?.(value);
    },
    [handleCreateModelClick, handleCreateVideo, handleExtendVideo, isDesktop, onQuickAction],
  );

  const handleTemplateSelect = React.useCallback(() => {
    setTemplatePickerOpen(false);
  }, []);

  const handleExpand = React.useCallback(() => {
    setIsImageExpanded((prev) => !prev);
    onExpand?.();
  }, [onExpand]);

  const handleMore = React.useCallback(() => {
    onMore?.();
    if (!isDesktop) {
      setMoreOptionsOpen(true);
    }
  }, [isDesktop, onMore]);

  const sync = useEmblaCarouselSync({
    slides,
    mainOptions: { align: "start", containScroll: "trimSnaps" },
    selectedIndex: selectedIndexProp,
    defaultSelectedIndex,
    onSelectedIndexChange,
  });

  // Escape exits expanded image view without closing the parent dialog/drawer.
  React.useEffect(() => {
    if (!isImageExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setIsImageExpanded(false);
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isImageExpanded]);

  // Recalculate Embla after expand/collapse changes the viewport size.
  React.useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      sync.mainApi?.reInit();
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [isImageExpanded, sync.mainApi]);

  const quickActionsModelStatus: QuickActionsModelStatus =
    modelStatus === "no-ai-model" ? "no-ai-model" : "ai-model";

  const currentItem = items[sync.selectedIndex];
  const save = useMediaSaved(currentItem?.mediaId);
  const handleSave = currentItem?.mediaId ? save.toggle : undefined;
  const currentDescription = currentItem?.description;
  const resolvedPrompt = currentDescription ?? prompt;
  const displayPrompt = resolvedPrompt?.trim() || defaultMediaPreviewPromptPlaceholder;
  const hasVideo = Boolean(currentItem?.videoSrc) || currentItem?.kind === "video";
  const imageActionDisabled: Record<string, boolean> = {
    edit: editDisabled,
    remix: remixDisabled,
    animate: createVideoDisabled,
  };
  const quickActionItems = getQuickActionItems(
    hasVideo ? "video" : "image",
    quickActionsModelStatus,
  ).flatMap((item) => {
    if (!showVideoActions && (item.value === "animate" || item.value === "extend")) return [];
    if (hasVideo) return [item];
    if (!canGenerateFrom && (item.value === "edit" || item.value === "animate")) return [];
    return [imageActionDisabled[item.value] ? { ...item, disabled: true } : item];
  });
  const moreMenuItems = getMediaPreviewMenuItems({
    hasVideo,
    showSetProfilePicture,
  });
  const resolvedMetadata =
    metadata ?? (hasVideo ? defaultMediaPreviewMetaVideodata : defaultMediaPreviewMetadata);
  const isLocked = variant === "locked" || variant === "premium";
  const lockMode = variant === "premium" ? "premium" : "coins";

  const thumbsCarousel =
    items.length > 1 ? (
      <EmblaCarouselThumbsView
        slides={slides}
        thumbsRef={sync.thumbsRef}
        selectedIndex={sync.selectedIndex}
        onThumbClick={sync.onThumbClick}
        variant="media-preview"
      />
    ) : null;

  if (items.length === 0) {
    return null;
  }
  const canScrollPrev = sync.selectedIndex > 0;
  const canScrollNext = sync.selectedIndex < items.length - 1;

  return (
    <div
      data-slot="media-preview-shell"
      data-variant={variant}
      data-image-expanded={isImageExpanded ? "true" : "false"}
      className={cn(
        "relative flex w-full flex-col items-center",
        isImageExpanded ? "md:gap-0" : "md:gap-4",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "relative flex w-full items-center justify-center",
          isImageExpanded ? "md:gap-4" : "md:gap-6",
        )}
      >
        {items.length > 1 ? (
          canScrollPrev ? (
            <MediaPreviewNavButton
              direction="previous"
              onClick={sync.scrollPrev}
              className="hidden md:inline-flex"
            />
          ) : (
            <div aria-hidden className="hidden size-[33px] shrink-0 md:block" />
          )
        ) : null}

        <div
          data-slot="media-preview"
          className={cn(
            "text-tooltip-text relative isolate flex min-h-0 w-full flex-1 flex-col overflow-hidden font-[Onest]",
            "text-modal-text",
            isImageExpanded
              ? "h-dvh min-h-dvh md:h-[calc(100dvh-3rem)] md:max-h-[calc(100dvh-3rem)] md:min-h-[calc(100dvh-3rem)] md:rounded-[24px]"
              : "min-h-dvh md:h-[min(720px,calc(100dvh-8rem))] md:max-h-[min(720px,calc(100dvh-8rem))] md:min-h-0 md:flex-row md:rounded-[24px]",
          )}
        >
          <section
            data-slot="media-preview-image-section"
            className={cn(
              "relative isolate flex min-h-0 flex-1 flex-col overflow-hidden",
              isImageExpanded
                ? "h-full min-h-0 md:rounded-[24px]"
                : "min-h-dvh md:min-h-[520px] md:rounded-l-[24px]",
            )}
          >
            {currentItem ? (
              // Heavily blurred, so the small still the thumbnail already loaded is enough.
              <MediaPreviewBlurredBackdrop
                src={
                  (currentItem.videoSrc ? currentItem.posterSrc : currentItem.cardSrc) ??
                  currentItem.src
                }
                className="z-0"
              />
            ) : null}

            <div
              aria-hidden
              className={cn(
                "absolute inset-0 z-[1] md:hidden",
                isImageExpanded
                  ? "bg-black/40"
                  : "bg-gradient-to-b from-black/10 from-0% via-black/75 via-[75%] to-black/55 to-[90%]",
              )}
            />

            <div
              data-slot="media-preview-photo-area"
              className={cn(
                "relative z-[2] flex min-h-0 flex-1 flex-col overflow-hidden",
                isImageExpanded ? "h-full pb-0" : "pb-[120px] md:min-h-[520px] md:pb-0",
              )}
            >
              <div
                className={cn(
                  "embla-carousel embla-carousel--media-preview relative min-h-0 min-w-0 flex-1 overflow-hidden",
                  isImageExpanded && "h-full",
                )}
              >
                <EmblaCarouselMain
                  slides={slides}
                  mainRef={sync.mainRef}
                  selectedIndex={sync.selectedIndex}
                  isSettled={sync.isSettled}
                  variant="media-preview"
                  className={cn(
                    "h-full min-w-0",
                    isImageExpanded ? "min-h-full" : "min-h-[390px] md:min-h-[520px]",
                  )}
                />
                {currentItem?.blurred ? <UnblurOverlay className="z-20" /> : null}
              </div>

              {items.length > 1 ? (
                <>
                  {canScrollPrev ? (
                    <MediaPreviewNavButton
                      direction="previous"
                      onClick={sync.scrollPrev}
                      className={cn(
                        "absolute left-3 z-30 md:hidden",
                        isImageExpanded ? "top-1/2 -translate-y-1/2" : "top-[calc(50%-86px)]",
                      )}
                    />
                  ) : null}
                  {canScrollNext ? (
                    <MediaPreviewNavButton
                      direction="next"
                      onClick={sync.scrollNext}
                      className={cn(
                        "absolute right-3 z-30 md:hidden",
                        isImageExpanded ? "top-1/2 -translate-y-1/2" : "top-[calc(50%-86px)]",
                      )}
                    />
                  ) : null}
                </>
              ) : null}

              {!isDesktop && !isImageExpanded && items.length > 1 ? (
                <div
                  data-slot="media-preview-mobile-thumbs"
                  className="absolute inset-x-0 bottom-[130px] z-20 shrink-0 px-4"
                >
                  {thumbsCarousel}
                </div>
              ) : null}
            </div>

            <div
              className={cn(
                "absolute inset-x-0 top-0 z-10 flex items-center px-6 pt-6 md:hidden",
                isImageExpanded || !showActions ? "justify-end" : "justify-between",
              )}
            >
              {!isImageExpanded && showActions ? (
                <MediaPreviewActionBar
                  hasVideo={hasVideo}
                  menuItems={moreMenuItems}
                  saved={save.on}
                  onSave={handleSave}
                  onDownload={onDownload}
                  onMore={handleMore}
                />
              ) : null}
              <MediaPreviewImageControls
                isExpanded={isImageExpanded}
                onExpand={handleExpand}
                onClose={onClose}
              />
            </div>

            <div className="absolute top-0 right-0 z-10 hidden p-6 md:flex">
              <MediaPreviewImageControls
                isExpanded={isImageExpanded}
                onExpand={handleExpand}
                onClose={onClose}
              />
            </div>

            <div
              data-slot="media-preview-mobile-footer"
              className={cn(
                "absolute inset-x-0 bottom-0 z-20 flex flex-col gap-4 px-4 pb-4 md:hidden",
                isImageExpanded && "hidden",
              )}
            >
              <div className="relative overflow-visible">
                <div
                  className={cn(
                    "flex items-center gap-2 py-2",
                    isLocked && resolvedPrompt?.trim()
                      ? "pointer-events-none -mx-3 overflow-visible px-3 blur-[10px]"
                      : "blur-0",
                  )}
                  onClick={() => setImageDetailsOpen(true)}
                >
                  <p
                    className={cn(
                      "text-modal-text flex-1 text-xs leading-4",
                      !(isLocked && resolvedPrompt?.trim()) && "line-clamp-2",
                    )}
                  >
                    {displayPrompt}
                  </p>
                  <button
                    type="button"
                    aria-label="Image details"
                    onClick={() => setImageDetailsOpen(true)}
                    className="shrink-0 opacity-70 transition-opacity hover:opacity-100"
                  >
                    <InfoIcon className="size-5" />
                  </button>
                </div>
                {isLocked && (
                  <>
                    <MediaPreviewLockedPromptOverlay
                      mode={lockMode}
                      unlockCost={unlockCost}
                      onUnlockPrompt={onUnlockPrompt}
                      className="w-fit pt-2"
                    />
                    <button
                      type="button"
                      aria-label="Image details"
                      onClick={() => setImageDetailsOpen(true)}
                      className="absolute top-5 right-0 shrink-0 opacity-70 transition-opacity hover:opacity-100"
                    >
                      <InfoIcon className="size-5" />
                    </button>
                  </>
                )}
              </div>
              {showActions ? (
                <QuickActions
                  content={hasVideo ? "video" : "image"}
                  modelStatus={quickActionsModelStatus}
                  items={quickActionItems}
                  onActionClick={handleQuickAction}
                  className="mx-auto w-full max-w-[358px]"
                />
              ) : null}
            </div>

            <MediaPreviewImageDetailsModal
              open={imageDetailsOpen}
              onOpenChange={setImageDetailsOpen}
              modelTitle={modelStatus === "ai-model" ? modelTitle : undefined}
              modelImageSrc={modelStatus === "ai-model" ? modelImageSrc : undefined}
              onCreateModelClick={handleCreateModelClick}
              prompt={resolvedPrompt}
              locked={isLocked}
              lockMode={lockMode}
              unlockCost={unlockCost}
              onUnlockPrompt={onUnlockPrompt}
              metadata={resolvedMetadata}
              onEdit={onEdit}
              onRemix={onRemix}
              onCreateVideo={handleMobileAnimate}
              onUseInTemplate={handleUseInTemplate}
              onExtendVideo={handleMobileExtend}
              createVideoLabel={createVideoLabel}
              hasVideo={hasVideo}
              editDisabled={editDisabled}
              remixDisabled={remixDisabled}
              createVideoDisabled={createVideoDisabled}
              extendVideoDisabled={extendVideoDisabled}
              canGenerateFrom={canGenerateFrom}
              showVideoActions={showVideoActions}
              showActions={showActions}
            />

            <MediaPreviewExtendOptionsModal
              open={extendOptionsOpen}
              onOpenChange={setExtendOptionsOpen}
              onCustomPrompt={handleExtendVideo}
              onUseTemplate={openTemplatePicker}
            />

            <MediaPreviewAnimateOptionsModal
              open={animateOptionsOpen}
              onOpenChange={setAnimateOptionsOpen}
              onCustomPrompt={handleCreateVideo}
              onUseTemplate={openTemplatePicker}
            />

            <MediaPreviewTemplatePicker
              open={templatePickerOpen}
              onOpenChange={setTemplatePickerOpen}
              onTemplateSelect={handleTemplateSelect}
            />

            {showActions ? (
              <MediaPreviewMoreOptionsModal
                open={moreOptionsOpen}
                hasVideo={hasVideo}
                menuItems={moreMenuItems}
                onOpenChange={setMoreOptionsOpen}
                onItemClick={onMoreItemClick}
              />
            ) : null}
          </section>

          {!isImageExpanded ? (
            <MediaPreviewDetailsPanel
              className="hidden md:flex"
              postedAt={postedAt}
              modelTitle={modelStatus === "ai-model" ? modelTitle : undefined}
              modelImageSrc={modelStatus === "ai-model" ? modelImageSrc : undefined}
              onCreateModelClick={handleCreateModelClick}
              prompt={resolvedPrompt}
              locked={isLocked}
              lockMode={lockMode}
              unlockCost={unlockCost}
              onUnlockPrompt={onUnlockPrompt}
              metadata={resolvedMetadata}
              hasVideo={hasVideo}
              menuItems={moreMenuItems}
              saved={save.on}
              onSave={handleSave}
              onDownload={onDownload}
              onMore={onMore}
              onMoreItemClick={onMoreItemClick}
              onEdit={onEdit}
              onRemix={onRemix}
              onCreateVideo={handleCreateVideo}
              onUseInTemplate={handleUseInTemplate}
              onExtendVideo={handleExtendVideo}
              createVideoLabel={createVideoLabel}
              editDisabled={editDisabled}
              remixDisabled={remixDisabled}
              createVideoDisabled={createVideoDisabled}
              extendVideoDisabled={extendVideoDisabled}
              canGenerateFrom={canGenerateFrom}
              showVideoActions={showVideoActions}
              showActions={showActions}
            />
          ) : null}
        </div>

        {items.length > 1 ? (
          canScrollNext ? (
            <MediaPreviewNavButton
              direction="next"
              onClick={sync.scrollNext}
              className="hidden md:inline-flex"
            />
          ) : (
            <div aria-hidden className="hidden size-[33px] shrink-0 md:block" />
          )
        ) : null}
      </div>

      {isDesktop && !isImageExpanded && items.length > 1 ? (
        <div
          data-slot="media-preview-desktop-thumbs"
          className="hidden w-full md:block md:max-w-[calc(100%-6rem)] md:px-2"
        >
          <EmblaCarouselThumbsView
            slides={slides}
            thumbsRef={sync.thumbsRef}
            selectedIndex={sync.selectedIndex}
            onThumbClick={sync.onThumbClick}
            variant="media-preview"
            className="embla-carousel-thumbs--desktop-outside"
          />
        </div>
      ) : null}
    </div>
  );
}
