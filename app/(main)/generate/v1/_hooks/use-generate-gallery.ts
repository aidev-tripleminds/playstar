import * as React from "react";

import {
  filterGenerateGalleryByQuery,
  filterGenerateGalleryBySection,
  GENERATE_DEFAULT_SECTION_TAB_ID,
  GENERATE_SECTION_TABS,
  type GenerateGalleryItem,
  type GenerateSectionTabId,
  MEDIA_ITEMS,
} from "../_lib/constants";

export function useGenerateGallery(options?: { initialItems?: GenerateGalleryItem[] }) {
  const [sectionTabId, setSectionTabId] = React.useState<GenerateSectionTabId>(
    GENERATE_DEFAULT_SECTION_TAB_ID,
  );
  const [searchValue, setSearchValue] = React.useState("");
  const [blurNsfw, setBlurNsfw] = React.useState(false);
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(() => new Set());
  const [items, setItems] = React.useState<GenerateGalleryItem[]>(
    () => options?.initialItems ?? MEDIA_ITEMS,
  );
  const [selectedPreviewId, setSelectedPreviewId] = React.useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const selectedSectionIndex = Math.max(
    0,
    GENERATE_SECTION_TABS.findIndex((tab) => tab.id === sectionTabId),
  );

  const sectionItems = React.useMemo(
    () => filterGenerateGalleryBySection(items, sectionTabId),
    [items, sectionTabId],
  );

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

  const handleSectionTabChange = React.useCallback((index: number) => {
    const nextTab = GENERATE_SECTION_TABS[index];
    if (!nextTab) return;
    setSectionTabId(nextTab.id);
  }, []);

  const handleEnterSelectMode = React.useCallback(() => {
    setSelectMode(true);
  }, []);

  const handleExitSelectMode = React.useCallback(() => {
    setSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  const handleToggleSelectMode = React.useCallback(() => {
    setSelectMode((current) => {
      if (current) {
        setSelectedIds(new Set());
        return false;
      }
      return true;
    });
  }, []);

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
    if (selectedIds.size === 0) return;
    setDeleteOpen(true);
  }, [selectedIds.size]);

  const handleDeleteConfirm = React.useCallback(() => {
    setItems((previous) => previous.filter((item) => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
    setSelectMode(false);
    setDeleteOpen(false);
  }, [selectedIds]);

  const addGeneratedItem = React.useCallback((item: GenerateGalleryItem) => {
    setItems((previous) => [item, ...previous]);
  }, []);

  return {
    sectionTabId,
    selectedSectionIndex,
    searchValue,
    setSearchValue,
    blurNsfw,
    setBlurNsfw,
    selectMode,
    selectedIds,
    items,
    sectionItems,
    visibleItems,
    selectedPreviewIndex,
    selectedPreviewItem,
    isPreviewOpen: selectedPreviewIndex !== null,
    deleteOpen,
    setDeleteOpen,
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
    handleDeleteConfirm,
    addGeneratedItem,
  };
}
