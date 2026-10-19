"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { BulkSelectImage } from "@/components/common/chat/bulk-select-image/bulk-select-image";
import { ChooseTemplate } from "@/components/common/chat/choose-template";
import { SelectFileV2 } from "@/components/common/general/select-file-v2";
import { GetPremium } from "@/components/common/pricing-modals/get-premium-popup/get-premium";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useMe } from "@/hooks/use-me";
import { GENERATE_TUTORIAL_ENABLED } from "@/lib/feature-flags";
import { releaseModalHistoryForNavigation } from "@/lib/modal-history";
import { buildPremiumHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { GenerateTemplatesCatalog } from "../../_components/generate-templates-catalog";
import { StudioChatPanel } from "../../_components/studio-chat-panel";
import { StudioCoverBanner } from "../../_components/studio-cover-banner";
import { StudioNav, type StudioTabId } from "../../_components/studio-nav";
import { characterMediaIdFromGalleryItem } from "../../_lib/generate-media";
import {
  useGenerateComposer,
  useGenerateDockSlide,
  useGenerateGallery,
  useGenerateProcessing,
  useGeneratePromptCompact,
} from "../_hooks";
import {
  GENERATE_BULK_SELECT_DOCK_CLASS,
  GENERATE_CHOOSE_TEMPLATE_SEARCH_PLACEHOLDER,
  GENERATE_DEFAULT_SECTION_TAB_ID,
  GENERATE_DESKTOP_BREAKPOINT,
  GENERATE_GALLERY_SCROLL_CLASS,
  GENERATE_IMAGES_SECTION_INDEX,
  GENERATE_ROUTE_SECTION_INDEX,
  GENERATE_SECTION_TABS,
  GENERATE_TAB_ROUTES,
  GENERATE_VIEW_SHELL_CLASS,
  GENERATE_VIEW_SHELL_MOBILE_TEMPLATES_CLASS,
  isGenerateTabAvailable,
} from "../_lib/constants";
import { editImagePickerItems } from "../_lib/edit-image-picker";
import { editVideoPickerItems } from "../_lib/edit-video-picker";
import { imageToVideoPickerItems } from "../_lib/image-to-video-picker";
import {
  type GeneratePreviewAction,
  getGeneratePreviewComposerTarget,
} from "../_lib/preview-actions";
import { TEXT_IMAGE_PICKER_TITLE, textImageCategoryForTarget } from "../_lib/text-image-picker";
import { TEXT_VIDEO_PICKER_TITLE, textVideoCategoryForTarget } from "../_lib/text-video-picker";
import type { GenerateGalleryItem, GenerateSectionTabId } from "../_lib/types";
import { GenerateAddAudioModal } from "./generate-add-audio-modal";
import { GenerateAdvancedSettingsModal } from "./generate-advanced-settings-modal";
import { GenerateDeleteModal } from "./generate-delete-modal";
import { GenerateGallery } from "./generate-gallery";
import { GenerateInfoModal } from "./generate-info-modal";
import { GeneratePreviewDialog } from "./generate-preview-dialog";
import { GeneratePromptDock } from "./generate-prompt-dock";
import { GenerateQuickActionsModal } from "./generate-quick-actions-modal";
import { GenerateToolbar } from "./generate-toolbar";
import { ImageJobStatus } from "./image-job-status";

export type GenerateViewProps = {
  /** `Character.id` from the `?character=` entry point (My AIs → Generate). */
  initialCharacterId?: string;
  /**
   * Gallery the workspace opens on. `/generate-image` and `/generate-video`
   * are this same workspace addressed straight at one tab; `/generate` leaves
   * it unset and keeps the Templates default.
   */
  initialSectionTabId?: GenerateSectionTabId;
  /**
   * False while video generation is closed for this viewer (FRONT-900): the
   * Templates and Videos tabs and the preview's video actions are not offered,
   * and the workspace opens on Images.
   */
  videoEnabled?: boolean;
  /**
   * False while the Templates tab is closed for this viewer, even with video
   * open: the workspace opens on Images instead.
   */
  templatesEnabled?: boolean;
};

export function GenerateView({
  initialCharacterId,
  initialSectionTabId,
  videoEnabled = true,
  templatesEnabled = true,
}: GenerateViewProps = {}) {
  const promptDockRef = React.useRef<HTMLDivElement>(null);
  const [studioTab, setStudioTab] = React.useState<StudioTabId>("explore");
  const [quickActionsOpen, setQuickActionsOpen] = React.useState(false);
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = React.useState(false);
  const [premiumOpen, setPremiumOpen] = React.useState(false);
  const isDesktop = useIsDesktop(GENERATE_DESKTOP_BREAKPOINT);
  const router = useRouter();
  const { isPremium, isPremiumResolved } = useMe();
  // Images and Videos stay visible but cannot be opened.
  const requestedSectionTabId =
    initialSectionTabId && initialSectionTabId !== "images" && initialSectionTabId !== "videos"
      ? initialSectionTabId
      : GENERATE_DEFAULT_SECTION_TAB_ID;
  const gallery = useGenerateGallery({
    initialSectionTabId: isGenerateTabAvailable(
      requestedSectionTabId,
      videoEnabled,
      templatesEnabled,
    )
      ? requestedSectionTabId
      : "images",
  });
  const handleUpgrade = React.useCallback(() => {
    setPremiumOpen(true);
  }, []);
  const handleUnlockPrompt = React.useCallback(() => {
    releaseModalHistoryForNavigation();
    router.push(buildPremiumHref());
  }, [router]);
  const processing = useGenerateProcessing({
    sectionTabId: gallery.sectionTabId,
    onComplete: gallery.addGeneratedItems,
    onPremiumRequired: handleUpgrade,
  });

  const handlePremiumContinue = React.useCallback(
    (selection?: { plan?: string }) => {
      // Modal close would history.back() over this push — drop the trap first.
      releaseModalHistoryForNavigation();
      setPremiumOpen(false);
      router.push(buildPremiumHref(selection?.plan));
    },
    [router],
  );

  const galleryScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollGalleryToTop = React.useCallback(() => {
    const node = galleryScrollRef.current;
    if (node && typeof node.scrollTo === "function") {
      node.scrollTo({ top: 0, behavior: "smooth" });
    } else if (node) {
      node.scrollTop = 0;
    }
    // Mobile document-scrolls (Safari HUD); the gallery node itself does not.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const collapsePromptRef = React.useRef<() => void>(() => {});
  const handleAfterGenerate = React.useCallback(() => {
    scrollGalleryToTop();
    collapsePromptRef.current();
  }, [scrollGalleryToTop]);

  const composer = useGenerateComposer({
    sectionTabId: gallery.sectionTabId,
    onGenerate: processing.startGenerateProcessing,
    onAfterGenerate: handleAfterGenerate,
    onUpgrade: handleUpgrade,
    initialCharacterId,
    reservedTokenCost: processing.reservedTokenCost,
  });
  const dockSlide = useGenerateDockSlide(gallery.selectMode);
  const showTemplateCatalog =
    studioTab === "explore" || studioTab === "mini-movie" || studioTab === "cum-shorts";
  const templateLane =
    studioTab === "mini-movie" || studioTab === "cum-shorts" ? studioTab : undefined;
  const isPromptInteractive = composer.isInteractive;
  const promptScrollCompact = useGeneratePromptCompact(!isDesktop && isPromptInteractive);
  React.useEffect(() => {
    collapsePromptRef.current = promptScrollCompact.collapse;
  }, [promptScrollCompact.collapse]);
  const editImagePickerOpen =
    isPromptInteractive &&
    composer.pickerOpen &&
    composer.media === "image-edit" &&
    composer.pickerTarget === "image";
  const userVideoPickerOpen =
    isPromptInteractive &&
    composer.pickerOpen &&
    (composer.media === "video-edit" || composer.media === "video-extend") &&
    composer.pickerTarget === "video";
  const imageToVideoPickerOpen =
    isPromptInteractive &&
    composer.pickerOpen &&
    composer.media === "video-image2vid" &&
    composer.pickerTarget === "image";
  const textImagePickerOpen =
    isPromptInteractive && composer.pickerOpen && composer.media === "image-presets";
  const textVideoPickerOpen =
    isPromptInteractive && composer.pickerOpen && composer.media === "video-presets";
  const editImageItems = React.useMemo(
    () =>
      editImagePickerItems(
        gallery.sectionTabId === "images" ? gallery.sectionItems : gallery.items,
      ),
    [gallery.items, gallery.sectionItems, gallery.sectionTabId],
  );
  const editVideoItems = React.useMemo(
    () =>
      editVideoPickerItems(
        gallery.sectionTabId === "videos" ? gallery.sectionItems : gallery.items,
      ),
    [gallery.items, gallery.sectionItems, gallery.sectionTabId],
  );
  const imageToVideoItems = React.useMemo(
    () => imageToVideoPickerItems(gallery.items),
    [gallery.items],
  );
  const { hasNextPage, isFetchingNextPage, isFetchNextPageError, handleLoadMore } = gallery;
  const libraryPickerOpen = editImagePickerOpen || userVideoPickerOpen || imageToVideoPickerOpen;

  React.useEffect(() => {
    if (!libraryPickerOpen || !hasNextPage || isFetchingNextPage || isFetchNextPageError) return;
    handleLoadMore();
  }, [libraryPickerOpen, handleLoadMore, hasNextPage, isFetchingNextPage, isFetchNextPageError]);

  if (!isPromptInteractive && advancedSettingsOpen) {
    setAdvancedSettingsOpen(false);
  }

  const handleSectionTabChange = React.useCallback(
    (index: number) => {
      const nextTab = GENERATE_SECTION_TABS[index];
      if (!nextTab || nextTab.id === "images" || nextTab.id === "videos") return;
      const href = nextTab ? GENERATE_TAB_ROUTES[nextTab.id] : undefined;

      // Update the address without remounting, so this session's gallery stays
      // in React state. Compared against the whole address: arriving at
      // `/generate?character=<id>` opens Images, and switching back to Templates
      // has the same pathname but must still push.
      const currentUrl = `${window.location.pathname}${window.location.search}`;
      if (href && currentUrl !== href) {
        window.history.pushState(null, "", href);
      }
      gallery.handleSectionTabChange(index);
    },
    [gallery],
  );

  /**
   * Follow the URL when it CHANGES under the gallery.
   *
   * The click handler above pushes a history entry without navigating, so Back
   * and Forward move between those entries and change the pathname with
   * nothing else running — without this, the address could read
   * `/generate-image` while the Videos gallery stayed on screen.
   *
   * Deliberately not applied to the pathname's INITIAL value: `/generate` may
   * legitimately open on Images (arriving with `?character=<id>`), and reading
   * the URL on mount would overrule the tab the page asked for. Only a change
   * after mount is a navigation, and only a navigation moves the tab.
   */
  const pathname = usePathname();
  const selectedSectionIndex = gallery.selectedSectionIndex;
  const changeSectionTab = gallery.handleSectionTabChange;
  const syncedPathnameRef = React.useRef(pathname);
  React.useEffect(() => {
    if (syncedPathnameRef.current === pathname) return;
    syncedPathnameRef.current = pathname;

    const routeIndex = GENERATE_ROUTE_SECTION_INDEX.get(pathname);
    if (routeIndex === undefined) return;
    const routeTab = GENERATE_SECTION_TABS[routeIndex];
    if (!routeTab || routeTab.id === "images" || routeTab.id === "videos") return;
    // A URL whose tab is closed opens Images, as it does on a fresh load:
    // Back to `/generate` with Templates closed must leave Videos.
    const index = isGenerateTabAvailable(
      GENERATE_SECTION_TABS[routeIndex].id,
      videoEnabled,
      templatesEnabled,
    )
      ? routeIndex
      : GENERATE_IMAGES_SECTION_INDEX;
    if (index === selectedSectionIndex) return;
    changeSectionTab(index);
  }, [changeSectionTab, pathname, selectedSectionIndex, videoEnabled, templatesEnabled]);

  // Signing in on a landing that had a closed tab open leaves it on screen
  // with nothing offering it any more, so it settles on Images.
  const sectionTabId = gallery.sectionTabId;
  React.useEffect(() => {
    if (isGenerateTabAvailable(sectionTabId, videoEnabled, templatesEnabled)) return;
    changeSectionTab(GENERATE_IMAGES_SECTION_INDEX);
  }, [changeSectionTab, sectionTabId, videoEnabled, templatesEnabled]);

  const handlePreviewAction = (action: GeneratePreviewAction, item: GenerateGalleryItem) => {
    const target = getGeneratePreviewComposerTarget(action, item);
    gallery.handleClosePreview();
    handleSectionTabChange(target.sectionIndex);
    void composer.loadFromPreview(action, item);
    promptDockRef.current?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
  };

  return (
    <section
      data-slot="generate-view"
      data-version="v2"
      className={cn(
        GENERATE_VIEW_SHELL_CLASS,
        showTemplateCatalog &&
          "min-[768px]:overflow-y-auto min-[768px]:overscroll-y-contain",
        showTemplateCatalog && GENERATE_VIEW_SHELL_MOBILE_TEMPLATES_CLASS,
      )}
    >
      {showTemplateCatalog ? (
        <StudioCoverBanner
          onGenerateClick={() => {
            document
              .querySelector("[data-slot=generate-templates]")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      ) : null}

      <StudioNav value={studioTab} onChange={setStudioTab} />

      {studioTab === "collection" ? (
        <GenerateToolbar
          selectedSectionIndex={gallery.selectedSectionIndex}
          onSectionTabChange={handleSectionTabChange}
          searchValue={gallery.searchValue}
          onSearchValueChange={gallery.setSearchValue}
          blurNsfw={gallery.blurNsfw}
          onBlurNsfwChange={gallery.handleBlurNsfwChange}
          selectMode={gallery.selectMode}
          onSelectModeToggle={gallery.handleToggleSelectMode}
          onQuickActionsClick={() => setQuickActionsOpen(true)}
          galleryActionsDisabled={false}
          showSearchRow
          showSectionTabs={false}
          videoEnabled={videoEnabled}
          templatesEnabled={templatesEnabled}
        />
      ) : null}

      {showTemplateCatalog ? (
        <GenerateTemplatesCatalog
          lane={templateLane}
          growWithContent
          onGoToGallery={() => setStudioTab("collection")}
        />
      ) : studioTab === "chat" ? (
        <StudioChatPanel />
      ) : (
        <>
          <div
            data-slot="generate-workspace"
            className="scrollbar-hidden @container/gallery relative flex min-w-0 flex-col min-[768px]:min-h-0 min-[768px]:flex-1 min-[768px]:overflow-hidden"
          >
            <div
              data-slot="generate-gallery-scroll"
              ref={galleryScrollRef}
              className={GENERATE_GALLERY_SCROLL_CLASS}
            >
              <ImageJobStatus
                onCompleted={gallery.refreshPersistedMedia}
                watching={processing.processingItems.some(
                  (item) => item.kind === "image" && item.state !== "moderation-issue",
                )}
              />
              <GenerateGallery
                items={gallery.visibleItems}
                libraryItemCount={gallery.items.length}
                sectionItemCount={gallery.sectionItems.length}
                searchValue={gallery.searchValue}
                selectMode={gallery.selectMode}
                selectedIds={gallery.selectedIds}
                blurNsfw={gallery.blurNsfw}
                isLoading={gallery.isLibraryPending}
                showEmptyCta={false}
                processingItems={processing.sectionProcessingItems}
                onSelectItem={gallery.handleSelectItem}
                onOpenItem={gallery.handleOpenItem}
                onClearSearch={() => gallery.setSearchValue("")}
                onEmptyCtaClick={() => {}}
                onCancelProcessing={processing.handleCancelProcessing}
                onSkipQueuedProcessing={processing.handleSkipQueuedProcessing}
                onRetryProcessing={(item) =>
                  processing.handleRetryProcessing(item, { skipQueue: !composer.skipQueueDisabled })
                }
                onCopyProcessingPrompt={processing.handleCopyProcessingPrompt}
                hasNextPage={gallery.hasNextPage}
                isFetchingNextPage={gallery.isFetchingNextPage}
                onLoadMore={gallery.handleLoadMore}
                onAddToEditImage={
                  composer.media === "image-edit" ? composer.loadEditImageFromGallery : undefined
                }
              />
            </div>

            {dockSlide.kind === "bulk" ? (
              <div
                data-slot="generate-bulk-select"
                data-dock-motion={dockSlide.motion}
                inert={dockSlide.motion === "exit" ? true : undefined}
                className={cn(GENERATE_BULK_SELECT_DOCK_CLASS, dockSlide.className)}
              >
                <BulkSelectImage
                  desktopResolution={GENERATE_DESKTOP_BREAKPOINT}
                  selectedCount={gallery.selectedIds.size}
                  downloadDisabled={gallery.selectedIds.size === 0}
                  isDownloading={gallery.isDownloading}
                  onDownload={gallery.handleDownloadSelected}
                  onDelete={gallery.handleDeleteClick}
                  onExit={gallery.handleExitSelectMode}
                  className="pointer-events-auto w-full max-w-[600px]"
                />
              </div>
            ) : null}
          </div>
          {dockSlide.kind === "prompt" && isPromptInteractive ? (
            <GeneratePromptDock
              dockRef={promptDockRef}
              dockClassName={cn(
                dockSlide.className,
                // PromptBox keeps a locked prompt expanded, so keep its padding.
                promptScrollCompact.compact && !composer.promptLocked && "max-[767px]:!pt-0",
              )}
              dockMotion={dockSlide.motion}
              interactive={isPromptInteractive}
              compact={promptScrollCompact.compact}
              onExpand={promptScrollCompact.expand}
              media={composer.media}
              placeholders={composer.placeholders}
              promptValue={composer.promptValue}
              promptLocked={composer.promptLocked}
              onPromptValueChange={composer.setPromptValue}
              controlButtons={composer.controlButtons}
              tokenCost={composer.tokenCost}
              generateLabel={composer.generateLabel}
              generateDisabled={composer.generateDisabled}
              generateActionVariant={composer.generateActionVariant}
              checkpointValue={composer.checkpointValue}
              onCheckpointValueChange={composer.setCheckpointValue}
              skipQueueDisabled={composer.skipQueueDisabled}
              onSkipQueueDisabledChange={composer.handleSkipQueueDisabledChange}
              showSkipQueue={composer.canEnableSkipQueue}
              onSettingsClick={() => setAdvancedSettingsOpen(true)}
              onInfoButtonClick={composer.handleInfoButtonClick}
              infoButtonStatus={composer.infoButtonStatus}
              showInfoButton={GENERATE_TUTORIAL_ENABLED}
              imageModeValue={composer.media}
              onImageModeValueChange={composer.handleImageModeValueChange}
              showSeeAll={composer.showSeeAll}
              onSeeAllClick={composer.handleSeeAll}
              onActionClick={composer.handleActionClick}
              actions={composer.actions}
              onGenerate={composer.handleGenerate}
              onUpgrade={handleUpgrade}
              onUnlockPrompt={handleUnlockPrompt}
            />
          ) : null}
        </>
      )}

      {!isDesktop && studioTab === "collection" ? (
        <GenerateQuickActionsModal
          open={quickActionsOpen}
          onOpenChange={setQuickActionsOpen}
          blurNsfw={gallery.blurNsfw}
          onBlurNsfwChange={gallery.handleBlurNsfwChange}
          selectMode={gallery.selectMode}
          onSelectModeToggle={gallery.handleToggleSelectMode}
          galleryActionsDisabled={false}
        />
      ) : null}

      <GenerateInfoModal
        open={isPromptInteractive && composer.infoOpen && !advancedSettingsOpen}
        onOpenChange={composer.handleInfoOpenChange}
      />

      <GenerateAdvancedSettingsModal
        open={isPromptInteractive && advancedSettingsOpen}
        onOpenChange={setAdvancedSettingsOpen}
        media={composer.media}
        modelValue={composer.checkpointValue}
        onModelValueChange={composer.setCheckpointValue}
        aspectRatio={composer.aspectRatio}
        onAspectRatioChange={composer.setAspectRatio}
        generations={composer.generationCount}
        onGenerationsChange={composer.setGenerationCount}
        maxGenerationCount={composer.maxGenerationCount}
        resolution={composer.resolution}
        onResolutionChange={composer.setResolution}
        duration={composer.duration}
        onDurationChange={composer.setDuration}
        autoSkipQueue={composer.skipQueueDisabled ? "no" : "yes"}
        onAutoSkipQueueChange={(value) => {
          composer.handleSkipQueueDisabledChange(value === "no");
        }}
        showAutoSkipQueue={composer.canEnableSkipQueue}
        showTutorial={GENERATE_TUTORIAL_ENABLED}
        onTutorialOpenChange={composer.handleInfoOpenChange}
      />

      <GenerateDeleteModal
        open={gallery.deleteOpen}
        onOpenChange={gallery.handleDeleteOpenChange}
        selectedCount={gallery.selectedIds.size}
        singleItem={gallery.isPreviewDelete}
        isDeleting={gallery.isDeleting}
        onConfirm={gallery.handleDeleteConfirm}
      />

      <GeneratePreviewDialog
        open={gallery.isPreviewOpen}
        items={gallery.visibleItems}
        selectedIndex={gallery.selectedPreviewIndex}
        selectedItem={gallery.selectedPreviewItem}
        onOpenChange={gallery.handlePreviewOpenChange}
        onSelectedIndexChange={gallery.handlePreviewIndexChange}
        onClose={gallery.handleClosePreview}
        onPreviewAction={handlePreviewAction}
        onPreviewDelete={(item) => gallery.handlePreviewDelete(item.id)}
        onPreviewDownload={gallery.handlePreviewDownload}
        promptLocked={isPremiumResolved && !isPremium}
        onUnlockPrompt={handleUnlockPrompt}
        videoEnabled={videoEnabled}
      />

      {composer.media === "image-edit" ? (
        <SelectFileV2
          key={
            editImagePickerOpen
              ? `edit-image-open-${composer.editImageFileId ?? "empty"}`
              : "edit-image-closed"
          }
          open={editImagePickerOpen}
          onOpenChange={composer.setPickerOpen}
          arrangement="images"
          showFilters={false}
          title={composer.pickerTitle}
          items={editImageItems}
          defaultSelectedFileId={composer.editImageFileId}
          onConfirm={composer.handleEditImageConfirm}
          closeLabel="Close image picker"
        />
      ) : composer.media === "video-edit" || composer.media === "video-extend" ? (
        <SelectFileV2
          key={
            userVideoPickerOpen
              ? `${composer.media}-open-${composer.editVideoFileId ?? "empty"}`
              : "user-video-closed"
          }
          open={userVideoPickerOpen}
          onOpenChange={composer.setPickerOpen}
          arrangement="images"
          showFilters={false}
          title={composer.pickerTitle}
          items={editVideoItems}
          defaultSelectedFileId={composer.editVideoFileId}
          onConfirm={composer.handleEditVideoConfirm}
          closeLabel="Close video picker"
        />
      ) : composer.media === "video-image2vid" ? (
        <SelectFileV2
          key={
            imageToVideoPickerOpen
              ? `image-to-video-open-${composer.editImageFileId ?? "empty"}`
              : "image-to-video-closed"
          }
          open={imageToVideoPickerOpen}
          onOpenChange={composer.setPickerOpen}
          arrangement="images"
          showFilters={false}
          title={composer.pickerTitle}
          items={imageToVideoItems}
          defaultSelectedFileId={composer.editImageFileId}
          onConfirm={(file) => {
            const source = gallery.items.find(
              (entry) => characterMediaIdFromGalleryItem(entry) === file.id,
            );
            composer.handleImageToVideoConfirm({
              id: file.id,
              name: file.name,
              imageSrc: file.imageSrc,
              characterId: source?.characterId,
              characterName: source?.characterName,
            });
          }}
          closeLabel="Close image picker"
        />
      ) : composer.media === "image-presets" ? (
        <SelectFileV2
          key={
            textImagePickerOpen ? `text-image-open-${composer.pickerTarget}` : "text-image-closed"
          }
          open={textImagePickerOpen}
          onOpenChange={composer.setPickerOpen}
          actionSelection="single"
          showFilters={false}
          title={TEXT_IMAGE_PICKER_TITLE}
          items={composer.textImageItems}
          defaultSelectedCategory={textImageCategoryForTarget(composer.pickerTarget)}
          defaultSelection={composer.textImageSelection}
          onSelectionConfirm={composer.handleTextImageConfirm}
          closeLabel="Close file picker"
        />
      ) : composer.media === "video-presets" ? (
        <SelectFileV2
          key={
            textVideoPickerOpen ? `text-video-open-${composer.pickerTarget}` : "text-video-closed"
          }
          open={textVideoPickerOpen}
          onOpenChange={composer.setPickerOpen}
          showFilters={false}
          title={TEXT_VIDEO_PICKER_TITLE}
          items={composer.textVideoItems}
          defaultSelectedCategory={textVideoCategoryForTarget(composer.pickerTarget)}
          defaultSelection={composer.textVideoSelection}
          defaultActionIds={composer.textVideoActionIds}
          onSelectionConfirm={composer.handleTextVideoConfirm}
          closeLabel="Close file picker"
        />
      ) : (
        <ChooseTemplate
          key={`${composer.pickerTitle}-${composer.pickerTypeTab}`}
          open={isPromptInteractive && composer.pickerOpen}
          onOpenChange={composer.setPickerOpen}
          title={composer.pickerTitle}
          showFilterTabs={false}
          showTemplateTypeTabs={composer.showPickerTypeTabs}
          filterByTypeVariant={composer.showPickerTypeTabs}
          defaultSelectedTypeTab={composer.pickerTypeTab}
          templates={composer.templatePickerItems}
          searchPlaceholder={GENERATE_CHOOSE_TEMPLATE_SEARCH_PLACEHOLDER}
          onTemplateSelect={composer.handleTemplateSelect}
          getTemplateProps={(template) =>
            template.variant === "characters" ? { showLive: false, showVerified: false } : {}
          }
          contentClassName="h-[min(960px,calc(100vh-4rem))] max-h-[calc(100vh-4rem)] z-999"
          closeLabel="Close template picker"
        />
      )}

      <GenerateAddAudioModal
        open={isPromptInteractive && composer.addAudioOpen}
        onOpenChange={composer.handleAddAudioOpenChange}
        selectedAudioId={composer.selectedAddAudioId}
        onGenerate={composer.handleAddAudioGenerate}
      />

      <GetPremium
        open={premiumOpen}
        onOpenChange={setPremiumOpen}
        onContinue={handlePremiumContinue}
      />
    </section>
  );
}
