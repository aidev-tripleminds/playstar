import type { InfiniteData } from "@tanstack/react-query";
import * as React from "react";

import { showToast } from "@/components/common/general/toast/toast";
import { useMe } from "@/hooks/use-me";
import { useDeleteCharacterMedia, useUsersCharacterMedia } from "@/hooks/use-users-character-media";
import type { UsersCharacterMediaResponse } from "@/lib/api/types";
import { downloadGeneratedMedia } from "@/lib/media-download";

import {
  characterMediaIdFromGalleryItem,
  generatedItemsFromStoredMedia,
  type GeneratedMediaItem,
  isUnresolvedPersistedGalleryItem,
  mergeGeneratedGalleryItems,
} from "../../_lib/generate-media";
import {
  createGeneratedGalleryItems,
  filterGenerateGalleryByQuery,
  filterGenerateGalleryBySection,
  GENERATE_DEFAULT_SECTION_TAB_ID,
  GENERATE_PREVIEW_SAMPLE_VIDEO_ID,
  GENERATE_SECTION_TABS,
  getGeneratePreviewSampleVideo,
  isGeneratePromptInteractive,
} from "../_lib/constants";
import type {
  GenerateCreatePayload,
  GenerateGalleryItem,
  GenerateSectionTabId,
} from "../_lib/types";

const GENERATE_DELETE_ERROR_TOAST = "Couldn't delete this media. Please try again.";
const GENERATE_DOWNLOAD_ERROR_TOAST = "Couldn't download this media. Please try again.";
const GENERATE_DOWNLOAD_PARTIAL_TOAST = "Some files couldn't be downloaded.";
const GENERATE_DOWNLOAD_STARTED_TOAST = "Download started.";

function mediaFromUsersCharacterMediaData(
  data: InfiniteData<UsersCharacterMediaResponse> | UsersCharacterMediaResponse | undefined,
) {
  if (!data) return [];
  if ("pages" in data) {
    return data.pages.flatMap((page) => page.media);
  }
  return data.media;
}

type UseGenerateGalleryOptions = {
  /**
   * Tab the workspace opens on. The `?character=` entry point (My AIs →
   * Generate) opens on Images, where the prompt is interactive and the
   * preselected character is ready to generate — Templates is a catalog.
   */
  initialSectionTabId?: GenerateSectionTabId;
};

export function useGenerateGallery({ initialSectionTabId }: UseGenerateGalleryOptions = {}) {
  const { isLoggedIn } = useMe();
  const mediaQuery = useUsersCharacterMedia();
  const deleteCharacterMedia = useDeleteCharacterMedia();
  const [sectionTabId, setSectionTabId] = React.useState<GenerateSectionTabId>(
    initialSectionTabId ?? GENERATE_DEFAULT_SECTION_TAB_ID,
  );
  const [searchValue, setSearchValue] = React.useState("");
  const [blurNsfw, setBlurNsfw] = React.useState(false);
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set());
  // Session rows (create-image / create-video) sit in front of the persisted list.
  const [sessionItems, setSessionItems] = React.useState<GenerateGalleryItem[]>([]);
  const [removedIds, setRemovedIds] = React.useState<Set<string>>(() => new Set());
  const [selectedPreviewId, setSelectedPreviewId] = React.useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isPreviewDelete, setIsPreviewDelete] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const isDownloadingRef = React.useRef(false);
  const downloadAbortRef = React.useRef<AbortController | null>(null);

  const fetchedItems = React.useMemo(
    () => generatedItemsFromStoredMedia(mediaFromUsersCharacterMediaData(mediaQuery.data)),
    [mediaQuery.data],
  );

  const items = React.useMemo(
    () => mergeGeneratedGalleryItems(sessionItems, fetchedItems, removedIds),
    [sessionItems, fetchedItems, removedIds],
  );

  const isLibraryPending = isLoggedIn && mediaQuery.isPending;
  const hasNextPage = Boolean(mediaQuery.hasNextPage);
  const isFetchingNextPage = Boolean(mediaQuery.isFetchingNextPage);
  const isFetchNextPageError = Boolean(mediaQuery.isFetchNextPageError);
  const fetchNextPage = mediaQuery.fetchNextPage;
  const refetchMedia = mediaQuery.refetch;

  // Rejects when the refresh failed, so a caller can retry it rather than
  // assume the gallery is up to date.
  const refreshPersistedMedia = React.useCallback(
    () => refetchMedia({ throwOnError: true }),
    [refetchMedia],
  );

  const handleLoadMore = React.useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const selectedSectionIndex = React.useMemo(
    () =>
      Math.max(
        0,
        GENERATE_SECTION_TABS.findIndex((tab) => tab.id === sectionTabId),
      ),
    [sectionTabId],
  );

  const sectionItems = React.useMemo(() => {
    const filtered = filterGenerateGalleryBySection(items, sectionTabId);
    if (sectionTabId !== "videos" || removedIds.has(GENERATE_PREVIEW_SAMPLE_VIDEO_ID)) {
      return filtered;
    }
    return [getGeneratePreviewSampleVideo(), ...filtered];
  }, [items, removedIds, sectionTabId]);

  const visibleItems = React.useMemo(
    () => filterGenerateGalleryByQuery(sectionItems, searchValue),
    [sectionItems, searchValue],
  );

  const selectedPreviewIndex = React.useMemo(() => {
    if (selectedPreviewId === null) return null;
    const index = visibleItems.findIndex((item) => item.id === selectedPreviewId);
    return index === -1 ? null : index;
  }, [selectedPreviewId, visibleItems]);

  const selectedPreviewItem =
    selectedPreviewIndex !== null ? (visibleItems[selectedPreviewIndex] ?? null) : null;

  if (selectedPreviewId !== null && selectedPreviewIndex === null) {
    setSelectedPreviewId(null);
  }

  const abortDownload = React.useCallback(() => {
    downloadAbortRef.current?.abort();
  }, []);

  const handleSectionTabChange = React.useCallback(
    (index: number) => {
      const nextTab = GENERATE_SECTION_TABS[index];
      if (!nextTab) return;
      abortDownload();
      setSectionTabId(nextTab.id);
      setSelectedPreviewId(null);
      setSelectMode(false);
      setSelectedIds(new Set());
    },
    [abortDownload],
  );

  const handleBlurNsfwChange = React.useCallback(
    (value: boolean) => {
      if (!isGeneratePromptInteractive(sectionTabId)) return;
      setBlurNsfw(value);
    },
    [sectionTabId],
  );

  const handleEnterSelectMode = React.useCallback(() => {
    if (!isGeneratePromptInteractive(sectionTabId)) return;
    setSelectMode(true);
    setSelectedPreviewId(null);
  }, [sectionTabId]);

  const handleExitSelectMode = React.useCallback(() => {
    abortDownload();
    setSelectMode(false);
    setSelectedIds(new Set());
  }, [abortDownload]);

  const handleToggleSelectMode = React.useCallback(() => {
    if (!isGeneratePromptInteractive(sectionTabId)) return;
    setSelectMode((current) => {
      if (current) {
        abortDownload();
        setSelectedIds(new Set());
        return false;
      }
      setSelectedPreviewId(null);
      return true;
    });
  }, [abortDownload, sectionTabId]);

  const handleSelectItem = React.useCallback((itemId: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleOpenItem = React.useCallback((itemId: string) => {
    setSelectedPreviewId(itemId);
  }, []);

  const handleClosePreview = React.useCallback(() => {
    setSelectedPreviewId(null);
  }, []);

  const handlePreviewOpenChange = React.useCallback((open: boolean) => {
    if (!open) setSelectedPreviewId(null);
  }, []);

  const handlePreviewIndexChange = React.useCallback(
    (index: number) => {
      const item = visibleItems[index];
      if (item) setSelectedPreviewId(item.id);
    },
    [visibleItems],
  );

  const handleDeleteClick = React.useCallback(() => {
    if (selectedIds.size === 0 || isDeleting) return;
    setIsPreviewDelete(false);
    setDeleteOpen(true);
  }, [isDeleting, selectedIds.size]);

  const handleDeleteOpenChange = React.useCallback(
    (open: boolean) => {
      if (isDeleting && !open) return;
      setDeleteOpen(open);
      if (!open) {
        setIsPreviewDelete(false);
        if (!selectMode) {
          setSelectedIds(new Set());
        }
      }
    },
    [isDeleting, selectMode],
  );

  const handlePreviewDelete = React.useCallback(
    (itemId: string) => {
      if (isDeleting) return;
      setSelectedIds(new Set([itemId]));
      setSelectedPreviewId(null);
      setIsPreviewDelete(true);
      setDeleteOpen(true);
    },
    [isDeleting],
  );

  const handleDownloadItems = React.useCallback(async (media: GenerateGalleryItem[]) => {
    if (isDownloadingRef.current) return;
    isDownloadingRef.current = true;
    const controller = new AbortController();
    downloadAbortRef.current = controller;
    setIsDownloading(true);

    try {
      const result = await downloadGeneratedMedia(media, { signal: controller.signal });
      if (result.status === "aborted") return;
      if (result.status === "empty") {
        showToast({ type: "error", text: GENERATE_DOWNLOAD_ERROR_TOAST });
        return;
      }
      const failed = result.status === "zip" || result.status === "single" ? result.failed : 0;
      if (failed > 0) {
        showToast({ type: "error", text: GENERATE_DOWNLOAD_PARTIAL_TOAST });
        return;
      }
      showToast({ type: "success", text: GENERATE_DOWNLOAD_STARTED_TOAST });
    } catch {
      if (controller.signal.aborted) return;
      showToast({ type: "error", text: GENERATE_DOWNLOAD_ERROR_TOAST });
    } finally {
      if (downloadAbortRef.current === controller) {
        downloadAbortRef.current = null;
      }
      isDownloadingRef.current = false;
      setIsDownloading(false);
    }
  }, []);

  const handleDownloadSelected = React.useCallback(() => {
    if (selectedIds.size === 0 || isDownloadingRef.current) return;
    const selected = items.filter((item) => selectedIds.has(item.id));
    void handleDownloadItems(selected);
  }, [handleDownloadItems, items, selectedIds]);

  const handlePreviewDownload = React.useCallback(
    (item: GenerateGalleryItem) => {
      void handleDownloadItems([item]);
    },
    [handleDownloadItems],
  );

  const deleteCharacterMediaAsync = deleteCharacterMedia.mutateAsync;

  const handleDeleteConfirm = React.useCallback(async () => {
    if (isDeleting) return;
    const ids = new Set(selectedIds);
    if (ids.size === 0) return;

    const selectedItems = items.filter((item) => ids.has(item.id));
    const unresolvedServerItems = selectedItems.filter(isUnresolvedPersistedGalleryItem);
    const characterMediaIds = [
      ...new Set(
        selectedItems
          .map((item) => characterMediaIdFromGalleryItem(item))
          .filter((id): id is string => Boolean(id)),
      ),
    ];

    setIsDeleting(true);
    try {
      if (unresolvedServerItems.length > 0) {
        throw new Error("MISSING_MEDIA_ID");
      }
      if (characterMediaIds.length > 0) {
        await deleteCharacterMediaAsync({ characterMediaIds });
      }
    } catch (error) {
      setIsDeleting(false);
      setIsPreviewDelete(false);
      setDeleteOpen(false);
      showToast({ type: "error", text: GENERATE_DELETE_ERROR_TOAST, error });
      return;
    }

    setRemovedIds((previous) => {
      const next = new Set(previous);
      for (const id of ids) next.add(id);
      for (const mediaId of characterMediaIds) next.add(mediaId);
      return next;
    });
    setSessionItems((previous) => previous.filter((item) => !ids.has(item.id)));
    setSelectedIds(new Set());
    setSelectMode(false);
    setIsPreviewDelete(false);
    setDeleteOpen(false);
    setIsDeleting(false);
  }, [deleteCharacterMediaAsync, isDeleting, items, selectedIds]);

  const addGeneratedItems = React.useCallback(
    (payload: GenerateCreatePayload, results?: GeneratedMediaItem[]) => {
      if (results && results.length > 0) {
        setSessionItems((previous) => [...results, ...previous]);
        void refetchMedia?.();
        return;
      }

      const created = createGeneratedGalleryItems(payload);
      setSessionItems((previous) => [...created, ...previous]);
    },
    [refetchMedia],
  );

  return {
    sectionTabId,
    selectedSectionIndex,
    searchValue,
    setSearchValue,
    blurNsfw,
    setBlurNsfw,
    handleBlurNsfwChange,
    selectMode,
    selectedIds,
    items,
    sectionItems,
    visibleItems,
    selectedPreviewIndex,
    selectedPreviewItem,
    isPreviewOpen: selectedPreviewIndex !== null,
    isLibraryPending,
    refreshPersistedMedia,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    handleLoadMore,
    deleteOpen,
    setDeleteOpen,
    isPreviewDelete,
    isDeleting,
    isDownloading,
    handleSectionTabChange,
    handleEnterSelectMode,
    handleExitSelectMode,
    handleToggleSelectMode,
    handleSelectItem,
    handleOpenItem,
    handleClosePreview,
    handlePreviewOpenChange,
    handlePreviewIndexChange,
    handleDeleteClick,
    handleDeleteOpenChange,
    handlePreviewDelete,
    handlePreviewDownload,
    handleDownloadSelected,
    handleDeleteConfirm,
    addGeneratedItems,
  };
}
