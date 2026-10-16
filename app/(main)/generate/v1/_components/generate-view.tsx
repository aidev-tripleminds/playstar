"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { BulkSelectImage } from "@/components/common/chat/bulk-select-image/bulk-select-image";
import { ChooseTemplate } from "@/components/common/chat/choose-template";
import { GetPremium } from "@/components/common/pricing-modals/get-premium-popup/get-premium";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { releaseModalHistoryForNavigation } from "@/lib/modal-history";
import { buildPremiumHref } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { GenerateTemplatesCatalog } from "../../_components/generate-templates-catalog";
import { useGenerateComposer, useGenerateGallery, useGenerateProcessing } from "../_hooks";
import {
  GENERATE_DESKTOP_BREAKPOINT,
  GENERATE_WORKSPACE_CLASS,
  type GenerateGalleryItem,
} from "../_lib/constants";
import {
  type GeneratePreviewAction,
  getGeneratePreviewComposerTarget,
} from "../_lib/preview-actions";
import { GenerateAddAudioModal } from "./generate-add-audio-modal";
import { GenerateAdvancedSettingsModal } from "./generate-advanced-settings-modal";
import { GenerateDeleteConfirmModal } from "./generate-delete-confirm-modal";
import { GenerateGallery } from "./generate-gallery";
import { GenerateGalleryToolbar } from "./generate-gallery-toolbar";
import { GenerateHeader } from "./generate-header";
import { GenerateInfoModal } from "./generate-info-modal";
import { GenerateMobileActions } from "./generate-mobile-actions";
import { GeneratePreviewDialog } from "./generate-preview-dialog";
import { GeneratePromptColumn } from "./generate-prompt-column";
import { GenerateQuickActionsModal } from "./generate-quick-actions-modal";

export type GenerateViewProps = {
  /** Empty gallery so the Figma "No media generated yet" state is visible. */
  emptyLibrary?: boolean;
  /** Character selected by the `?character=<Character.id>` entry point. */
  initialCharacterId?: string;
};

export function GenerateView({
  emptyLibrary = false,
  initialCharacterId,
}: GenerateViewProps = {}) {
  const router = useRouter();
  const promptboxRef = React.useRef<HTMLDivElement>(null);
  const [quickActionsOpen, setQuickActionsOpen] = React.useState(false);
  const [infoModalOpen, setInfoModalOpen] = React.useState(false);
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = React.useState(false);
  const isDesktop = useIsDesktop(GENERATE_DESKTOP_BREAKPOINT);

  const gallery = useGenerateGallery({
    initialItems: emptyLibrary ? [] : undefined,
  });
  const isTemplatesTab = gallery.sectionTabId === "templates";
  const processing = useGenerateProcessing({
    sectionTabId: gallery.sectionTabId,
    onComplete: gallery.addGeneratedItem,
  });
  const composer = useGenerateComposer({
    sectionTabId: gallery.sectionTabId,
    onGenerate: processing.startGenerateProcessing,
    initialCharacterId,
  });

  const hasLibraryMedia = gallery.items.length > 0 || processing.processingItems.length > 0;
  const showGalleryToolbar =
    !isTemplatesTab &&
    hasLibraryMedia &&
    (gallery.sectionItems.length > 0 || processing.sectionProcessingItems.length > 0);

  const handleSectionTabChange = (index: number) => {
    gallery.handleSectionTabChange(index);
    composer.handleSectionTabChange(index);
  };

  const handlePreviewAction = (action: GeneratePreviewAction, item: GenerateGalleryItem) => {
    const target = getGeneratePreviewComposerTarget(action, item);
    gallery.handleClosePreview();
    handleSectionTabChange(target.sectionIndex);
    void composer.loadFromPreview(action, item);
    promptboxRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const handleEmptyStateCtaClick = () => {
    promptboxRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const handleOpenAdvancedSettings = () => setAdvancedSettingsOpen(true);

  const galleryToolbar = showGalleryToolbar ? (
    <GenerateGalleryToolbar
      searchValue={gallery.searchValue}
      onSearchValueChange={gallery.setSearchValue}
      blurNsfw={gallery.blurNsfw}
      onBlurNsfwChange={gallery.setBlurNsfw}
      selectMode={gallery.selectMode}
      onEnterSelectMode={gallery.handleEnterSelectMode}
      onExitSelectMode={gallery.handleExitSelectMode}
      onQuickActionsClick={() => setQuickActionsOpen(true)}
      isDesktop={isDesktop}
    />
  ) : null;

  return (
    <section
      data-slot="generate-view"
      className={cn(
        "mx-auto flex w-full flex-col gap-4 p-4",
        "min-h-[calc(100dvh-62px)] max-[767px]:pb-10",
        "scrollbar-hidden min-[768px]:h-[calc(100dvh-62px)] min-[768px]:min-h-0 min-[768px]:overflow-hidden",
      )}
    >
      <GenerateHeader
        selectedSectionIndex={gallery.selectedSectionIndex}
        onSectionTabChange={handleSectionTabChange}
        toolbar={isDesktop ? galleryToolbar : null}
      />

      <div
        data-slot="generate-workspace"
        className={cn(
          isTemplatesTab
            ? "relative flex min-h-0 w-full flex-1 flex-col"
            : GENERATE_WORKSPACE_CLASS,
        )}
      >
        {isTemplatesTab ? (
          <GenerateTemplatesCatalog />
        ) : (
          <>
            <GeneratePromptColumn
              promptboxRef={promptboxRef}
              media={composer.activeSection.media}
              selectedTab={composer.promptTab}
              onTabChange={composer.setPromptTab}
              placeholders={composer.placeholders}
              isLoggedIn={composer.isLoggedIn}
              guestUsageCount={composer.guestUsageCount}
              onGuestUsageCountChange={composer.setGuestUsageCount}
              onInfoButtonClick={() => setInfoModalOpen(true)}
              onSettingsClick={handleOpenAdvancedSettings}
              promptValue={composer.promptValue}
              onPromptValueChange={composer.setPromptValue}
              promptLocked={composer.promptLocked}
              onGenerate={composer.handlePromptboxGenerate}
              skipQueueDisabled={composer.skipQueueDisabled}
              onSkipQueueDisabledChange={composer.setSkipQueueDisabled}
            />

            <div
              data-slot="generate-gallery"
              className="@container/gallery relative flex min-h-0 min-w-0 flex-1 flex-col gap-4 scrollbar-hidden min-[768px]:overflow-hidden"
            >
              {!isDesktop ? galleryToolbar : null}

              <div
                data-slot="generate-gallery-scroll"
                className={cn(
                  "flex min-h-0 w-full flex-1 flex-col gap-20 scrollbar-hidden",
                  "min-[768px]:overflow-y-auto min-[768px]:overscroll-y-contain",
                  gallery.selectMode && isDesktop && "min-[768px]:pb-24",
                )}
              >
                <GenerateGallery
                  items={gallery.visibleItems}
                  libraryItemCount={gallery.items.length}
                  processingItemCount={processing.processingItems.length}
                  sectionItemCount={gallery.sectionItems.length}
                  searchValue={gallery.searchValue}
                  selectMode={gallery.selectMode}
                  selectedIds={gallery.selectedIds}
                  blurNsfw={gallery.blurNsfw}
                  showEmptyCta={emptyLibrary || !composer.isLoggedIn}
                  processingItems={processing.sectionProcessingItems}
                  onSelectItem={gallery.handleSelectItem}
                  onOpenItem={gallery.handleOpenItem}
                  onClearSearch={() => gallery.setSearchValue("")}
                  onEmptyCtaClick={handleEmptyStateCtaClick}
                  onCancelProcessing={processing.handleCancelProcessing}
                  onSkipQueuedProcessing={processing.handleSkipQueuedProcessing}
                  onRetryProcessing={(item) =>
                    processing.handleRetryProcessing(item, {
                      skipQueue: !composer.skipQueueDisabled,
                    })
                  }
                  onCopyProcessingPrompt={processing.handleCopyProcessingPrompt}
                />
              </div>

              {gallery.selectMode && isDesktop && showGalleryToolbar ? (
                <div
                  data-slot="generate-bulk-select"
                  className="from-dialog-bg pointer-events-none absolute inset-x-0 bottom-0 z-20 flex w-full justify-center bg-linear-to-t from-10% to-transparent pt-10 pb-6"
                >
                  <BulkSelectImage
                    desktopResolution={GENERATE_DESKTOP_BREAKPOINT}
                    selectedCount={gallery.selectedIds.size}
                    onDelete={gallery.handleDeleteClick}
                    onExit={gallery.handleExitSelectMode}
                    className="pointer-events-auto w-full max-w-[600px]"
                  />
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>

      {!isDesktop && !isTemplatesTab ? (
        <GenerateMobileActions
          selectMode={gallery.selectMode}
          selectedCount={gallery.selectedIds.size}
          onDelete={gallery.handleDeleteClick}
          onExitSelectMode={gallery.handleExitSelectMode}
          isLoggedIn={composer.isLoggedIn}
          guestUsageCount={composer.guestUsageCount}
          guestUsageAtLimit={composer.guestUsageAtLimit}
          onGenerate={composer.handleMobileGenerate}
          onInfoButtonClick={() => setInfoModalOpen(true)}
          onSettingsClick={handleOpenAdvancedSettings}
        />
      ) : null}

      {!isDesktop ? (
        <GenerateQuickActionsModal
          open={quickActionsOpen}
          onOpenChange={setQuickActionsOpen}
          blurNsfw={gallery.blurNsfw}
          onBlurNsfwChange={gallery.setBlurNsfw}
          selectMode={gallery.selectMode}
          onSelectModeToggle={gallery.handleToggleSelectMode}
        />
      ) : null}

      <GenerateInfoModal open={infoModalOpen} onOpenChange={setInfoModalOpen} />

      <GenerateAdvancedSettingsModal
        open={advancedSettingsOpen}
        onOpenChange={setAdvancedSettingsOpen}
        visibleFields={composer.advancedSettingsFields}
        styleMode={composer.styleMode}
        values={{
          ...composer.advancedSettings,
          autoSkipQueue: composer.skipQueueDisabled ? "no" : "yes",
        }}
        onApply={composer.handleAdvancedSettingsApply}
      />

      <GenerateDeleteConfirmModal
        open={gallery.deleteOpen}
        onOpenChange={gallery.setDeleteOpen}
        selectedCount={gallery.selectedIds.size}
        onConfirm={gallery.handleDeleteConfirm}
      />

      <GenerateAddAudioModal
        open={composer.addAudioOpen}
        onOpenChange={composer.handleAddAudioOpenChange}
        selectedAudioId={composer.selectedAddAudioId}
        onGenerate={composer.handleAddAudioGenerate}
      />

      <ChooseTemplate
        open={composer.chooseTemplateOpen}
        onOpenChange={composer.handleChooseTemplateOpenChange}
        title={composer.chooseTemplateTitle}
        showFilterTabs={false}
        showTemplateTypeTabs
        selectedTypeTab={composer.chooseTemplateTypeTab}
        onTypeTabChange={composer.setChooseTemplateTypeTab}
        onTemplateSelect={composer.handleTemplateSelect}
        templates={composer.templatePickerItems}
        contentClassName={cn(
          "h-[min(960px,calc(100vh-4rem))] max-h-[calc(100vh-4rem)] z-999",
          !isDesktop && "z-100",
        )}
        closeLabel="Close template picker"
      />

      <GetPremium
        open={composer.premiumOpen}
        onOpenChange={composer.setPremiumOpen}
        onContinue={(selection) => {
          releaseModalHistoryForNavigation();
          composer.setPremiumOpen(false);
          router.push(buildPremiumHref(selection.plan));
        }}
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
      />
    </section>
  );
}
