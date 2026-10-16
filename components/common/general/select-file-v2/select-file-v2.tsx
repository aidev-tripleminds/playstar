"use client";

import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpAZ, ArrowUpWideNarrow } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { ActionContentCard } from "@/components/common/general/action-content-card";
import {
  ACTION_CONTENT_CARD_SCRIM,
  type ActionContentCardVariant,
} from "@/components/common/general/action-content-card/action-content-card.constants";
import { Badge } from "@/components/common/general/badge/badge";
import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { Number } from "@/components/common/general/number";
import {
  OptionList,
  type OptionListItem,
} from "@/components/common/general/option-list/option-list";
import { Scene, SCENE_HEIGHT_PX, SCENE_WIDTH_PX } from "@/components/common/general/scene";
import { ScrollArrowButton } from "@/components/common/general/scroll-arrow/scroll-arrow-button";
import { SearchInput } from "@/components/common/general/search-input/search-input";
import Tabs from "@/components/common/general/tabs";
import { isRemoteImageSrc } from "@/components/common/image-preview/components/helpers";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";
import { FolderIcon } from "@/public/assets/icons/folder";

import {
  SELECT_FILE_V2_CARD_ASPECT_CLASS,
  SELECT_FILE_V2_CARD_BORDER_STYLE,
  SELECT_FILE_V2_CARD_SCRIM,
  SELECT_FILE_V2_CATEGORIES,
  SELECT_FILE_V2_CATEGORY_COLUMN_CLASS,
  SELECT_FILE_V2_DEFAULT_CATEGORY,
  SELECT_FILE_V2_DEFAULT_FILTER,
  SELECT_FILE_V2_DEFAULT_ITEMS,
  SELECT_FILE_V2_DEFAULT_SORT_VALUE,
  SELECT_FILE_V2_DEFAULT_TITLE,
  SELECT_FILE_V2_DESKTOP_CARD_NAME_CLASS,
  SELECT_FILE_V2_DESKTOP_CARD_RADIUS_CLASS,
  SELECT_FILE_V2_DESKTOP_GRID_CLASS,
  SELECT_FILE_V2_DIALOG_CLASS,
  SELECT_FILE_V2_EMPTY_LABEL,
  SELECT_FILE_V2_FILTER_TABS,
  SELECT_FILE_V2_IMAGE_SRC,
  SELECT_FILE_V2_MAX_ACTIONS,
  SELECT_FILE_V2_MOBILE_CARD_CLASS,
  SELECT_FILE_V2_MOBILE_CARD_RADIUS_CLASS,
  SELECT_FILE_V2_MOBILE_DIALOG_CLASS,
  SELECT_FILE_V2_NEW_LABEL,
  SELECT_FILE_V2_SAVE_LABEL,
  SELECT_FILE_V2_SEARCH_PLACEHOLDER,
  SELECT_FILE_V2_SLOT_COUNT,
  SELECT_FILE_V2_SLOT_ICONS,
  SELECT_FILE_V2_SLOT_INDEX,
  SELECT_FILE_V2_SLOT_LABELS,
  SELECT_FILE_V2_SORT_OPTIONS,
  SELECT_FILE_V2_TIMELINE_ARROW_MIN,
  SELECT_FILE_V2_TIMELINE_CONNECTOR_ADD_CLASS,
  SELECT_FILE_V2_TIMELINE_CONNECTOR_HEIGHT_PX,
  SELECT_FILE_V2_TIMELINE_CONNECTOR_WIDTH_PX,
  SELECT_FILE_V2_TIMELINE_EMOJI_SRC,
  SELECT_FILE_V2_TIMELINE_LABEL,
  type SelectFileCategory,
  type SelectFileItem,
  type SelectFileSortValue,
} from "./select-file-v2.constants";

export type {
  SelectFileCategory,
  SelectFileItem,
  SelectFileSortValue,
} from "./select-file-v2.constants";

export type SelectFileArrangement = "catalog" | "images";

export type SelectFileActionSelection = "timeline" | "single";

/**
 * One chosen file per category. Text to Image saves this into the four placeholders.
 * Text to Video also sends `actionClips` in timeline order.
 */
export type SelectFileSelection = Partial<Record<SelectFileCategory, SelectFileItem>> & {
  actionClips?: readonly SelectFileItem[];
};

type SelectFileSelectionIds = Partial<Record<SelectFileCategory, string>>;

export type SelectFileV2Props = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  closeLabel?: string;
  /**
   * `catalog` is the four-category picker. `images` is the Edit Image
   * arrangement: no categories, no tag filters, every passed image, one
   * selection, then Save. The footer slot mirrors the generator image
   * placeholder: filled when one is chosen, empty add card when it is not.
   */
  arrangement?: SelectFileArrangement;
  /**
   * `timeline` stacks actions for video. `single` is Text to Image: one action,
   * chosen the same way as Character, Clothing, and Location.
   */
  actionSelection?: SelectFileActionSelection;
  /** Demo filter chips. Omit them when the catalog has no tags. */
  showFilters?: boolean;
  items?: readonly SelectFileItem[];
  /** Image already chosen, shown in the footer when the images arrangement opens. */
  defaultSelectedFileId?: string;
  /** Category ids already chosen, restored into the footer when the picker opens. */
  defaultSelection?: SelectFileSelectionIds;
  /** Timeline clip ids, in order. Restored when the video catalog opens. */
  defaultActionIds?: readonly string[];
  selectedCategory?: SelectFileCategory;
  defaultSelectedCategory?: SelectFileCategory;
  onCategoryChange?: (category: SelectFileCategory) => void;
  selectedFilter?: string;
  defaultSelectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  selectedSortValue?: SelectFileSortValue;
  defaultSelectedSortValue?: SelectFileSortValue;
  onSortChange?: (value: SelectFileSortValue) => void;
  onFileSelect?: (item: SelectFileItem) => void;
  /** Fires when Save confirms the single image in the images arrangement. */
  onConfirm?: (item: SelectFileItem) => void;
  /**
   * Fires when Save confirms the catalog. Text to Image sends one file per
   * category. Text to Video sends those plus `actionClips` in timeline order.
   */
  onSelectionConfirm?: (selection: SelectFileSelection) => void;
  onSave?: () => void;
  onClose?: () => void;
  /** Forces a layout in Storybook. Omit it to follow the viewport. */
  layout?: "desktop" | "mobile";
  className?: string;
};

const SORT_OPTION_ICONS: Record<SelectFileSortValue, React.ReactNode> = {
  newest: <ArrowDownWideNarrow className="size-5 shrink-0" aria-hidden />,
  oldest: <ArrowUpWideNarrow className="size-5 shrink-0" aria-hidden />,
  "name-asc": <ArrowDownAZ className="size-5 shrink-0" aria-hidden />,
  "name-desc": <ArrowUpAZ className="size-5 shrink-0" aria-hidden />,
};

const SORT_OPTION_ITEMS: OptionListItem[] = SELECT_FILE_V2_SORT_OPTIONS.map(({ value, label }) => ({
  value,
  label,
  leftIconSrc: SORT_OPTION_ICONS[value],
}));

function filterIndex(filter: string) {
  const index = SELECT_FILE_V2_FILTER_TABS.indexOf(
    filter as (typeof SELECT_FILE_V2_FILTER_TABS)[number],
  );
  return index === -1 ? 0 : index;
}

function matchesFilter(item: SelectFileItem, filter: string) {
  if (filter === SELECT_FILE_V2_DEFAULT_FILTER) return true;

  return item.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase());
}

type SelectedFileSlot = {
  id: string;
  imageSrc: string;
};

type SelectedAction = {
  /** One timeline place. The same catalog action can occupy several places. */
  key: string;
  id: string;
  name: string;
  imageSrc: string;
};

type ReorderDrag = {
  pointerId: number;
  id: string;
  index: number;
  originIndex: number;
  originX: number;
  step: number;
  length: number;
};

function slotIndexFor(category: SelectFileCategory | undefined, singleActions: boolean) {
  switch (category) {
    case "characters":
    case "clothings":
    case "location":
      return SELECT_FILE_V2_SLOT_INDEX[category];
    case "actions":
      return singleActions ? SELECT_FILE_V2_SLOT_INDEX.actions : undefined;
    default:
      return undefined;
  }
}

function slotCategoryFor(index: number): SelectFileCategory | undefined {
  if (index === SELECT_FILE_V2_SLOT_INDEX.characters) return "characters";
  if (index === SELECT_FILE_V2_SLOT_INDEX.actions) return "actions";
  if (index === SELECT_FILE_V2_SLOT_INDEX.clothings) return "clothings";
  if (index === SELECT_FILE_V2_SLOT_INDEX.location) return "location";
  return undefined;
}

/** Next category after `from` whose footer slot is still empty. Wraps the tab order. */
function nextEmptyCategory(
  from: SelectFileCategory,
  nextSlots: readonly (SelectedFileSlot | null)[],
): SelectFileCategory | undefined {
  const start = SELECT_FILE_V2_CATEGORIES.findIndex((category) => category.id === from);
  if (start < 0) return undefined;

  for (let step = 1; step < SELECT_FILE_V2_CATEGORIES.length; step += 1) {
    const category = SELECT_FILE_V2_CATEGORIES[(start + step) % SELECT_FILE_V2_CATEGORIES.length];
    if (!category) continue;
    if (nextSlots[SELECT_FILE_V2_SLOT_INDEX[category.id]] == null) return category.id;
  }

  return undefined;
}

function initialSlots(
  items: readonly SelectFileItem[],
  selection: SelectFileSelectionIds | undefined,
): (SelectedFileSlot | null)[] {
  const slots: (SelectedFileSlot | null)[] = Array.from(
    { length: SELECT_FILE_V2_SLOT_COUNT },
    () => null,
  );
  if (!selection) return slots;

  for (const category of Object.keys(SELECT_FILE_V2_SLOT_INDEX) as SelectFileCategory[]) {
    const id = selection[category];
    if (!id) continue;
    const item = items.find((entry) => entry.id === id && entry.category === category);
    if (!item) continue;
    slots[SELECT_FILE_V2_SLOT_INDEX[category]] = {
      id: item.id,
      imageSrc: item.imageSrc || SELECT_FILE_V2_IMAGE_SRC,
    };
  }

  return slots;
}

function initialActions(
  items: readonly SelectFileItem[],
  ids: readonly string[] | undefined,
): SelectedAction[] {
  if (!ids?.length) return [];

  const selected: SelectedAction[] = [];

  for (const id of ids) {
    if (selected.length >= SELECT_FILE_V2_MAX_ACTIONS) break;
    const item = items.find((entry) => entry.id === id && entry.category === "actions");
    if (!item) continue;
    selected.push({
      key: `restored-${selected.length}`,
      id: item.id,
      name: item.name,
      imageSrc: item.imageSrc || SELECT_FILE_V2_IMAGE_SRC,
    });
  }

  return selected;
}

function timelineSelection(
  slots: readonly (SelectedFileSlot | null)[],
  actions: readonly SelectedAction[],
  items: readonly SelectFileItem[],
): SelectFileSelection {
  const selection = selectionFromSlots(slots, items);
  const clips = actions.flatMap((action) => {
    const item = items.find((entry) => entry.id === action.id && entry.category === "actions");
    return item ? [item] : [];
  });

  if (clips[0]) selection.actions = clips[0];
  if (clips.length > 0) selection.actionClips = clips;
  return selection;
}

function selectionFromSlots(
  slots: readonly (SelectedFileSlot | null)[],
  items: readonly SelectFileItem[],
): SelectFileSelection {
  const selection: SelectFileSelection = {};

  slots.forEach((slot, index) => {
    if (!slot) return;
    const category = slotCategoryFor(index);
    if (!category) return;
    const item = items.find((entry) => entry.id === slot.id && entry.category === category);
    if (item) selection[category] = item;
  });

  return selection;
}

function actionIndicatorVariant(count: number): ActionContentCardVariant {
  if (count <= 1) return "loaded";
  if (count === 2) return "two";
  if (count === 3) return "three";
  return "overflow";
}

function reorderList<T>(list: readonly T[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length)
    return [...list];

  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Figma `Rectangle 666*` — 12×2 line, vertically centered on the scene card. */
function TimelineConnector({ tone }: { tone: "solid" | "add" }) {
  return (
    <span
      data-slot="select-file-timeline-connector"
      data-tone={tone}
      aria-hidden
      className={cn(
        "shrink-0",
        tone === "add" ? SELECT_FILE_V2_TIMELINE_CONNECTOR_ADD_CLASS : "bg-border-control",
      )}
      style={{
        width: SELECT_FILE_V2_TIMELINE_CONNECTOR_WIDTH_PX,
        height: SELECT_FILE_V2_TIMELINE_CONNECTOR_HEIGHT_PX,
        marginTop: (SCENE_HEIGHT_PX - SELECT_FILE_V2_TIMELINE_CONNECTOR_HEIGHT_PX) / 2,
      }}
    />
  );
}

/**
 * A card's preview video. Only the active card plays, so a grid of cards never
 * loads every video. A card with no still keeps the element mounted and shows
 * its first frame.
 */
function CardPreviewVideo({ src, playing }: { src: string; playing: boolean }) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      // A refused play (autoplay policy, element removed) leaves the still.
      video.play()?.catch(() => {});
      return;
    }
    video.pause();
  }, [playing]);

  return (
    <video
      ref={videoRef}
      data-slot="select-file-card-video"
      data-playing={playing ? "true" : "false"}
      src={src}
      muted
      loop
      playsInline
      preload={playing ? "auto" : "metadata"}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full object-cover"
    />
  );
}

function compareItems(left: SelectFileItem, right: SelectFileItem, sortValue: SelectFileSortValue) {
  if (sortValue === "name-asc" || sortValue === "name-desc") {
    const byName = left.name.localeCompare(right.name);
    if (byName !== 0) return sortValue === "name-asc" ? byName : -byName;
  }

  if (left.sortKey && right.sortKey) {
    const byKey = left.sortKey.localeCompare(right.sortKey);
    return sortValue === "oldest" ? byKey : -byKey;
  }

  const byId = left.id.localeCompare(right.id);
  return sortValue === "oldest" ? -byId : byId;
}

export function SelectFileV2({
  open,
  defaultOpen,
  onOpenChange,
  title = SELECT_FILE_V2_DEFAULT_TITLE,
  closeLabel = "Close file picker",
  arrangement = "catalog",
  actionSelection = "timeline",
  showFilters = true,
  items = SELECT_FILE_V2_DEFAULT_ITEMS,
  defaultSelectedFileId,
  defaultSelection,
  defaultActionIds,
  selectedCategory,
  defaultSelectedCategory = SELECT_FILE_V2_DEFAULT_CATEGORY,
  onCategoryChange,
  selectedFilter,
  defaultSelectedFilter = SELECT_FILE_V2_DEFAULT_FILTER,
  onFilterChange,
  searchValue,
  defaultSearchValue = "",
  onSearchChange,
  onSearchClear,
  selectedSortValue,
  defaultSelectedSortValue = SELECT_FILE_V2_DEFAULT_SORT_VALUE,
  onSortChange,
  onFileSelect,
  onConfirm,
  onSelectionConfirm,
  onSave,
  onClose,
  layout,
  className,
}: SelectFileV2Props) {
  const isDesktopViewport = useIsDesktop();
  const isMobile = layout === "mobile" || (layout !== "desktop" && !isDesktopViewport);
  const sortMenuRef = React.useRef<HTMLDivElement>(null);
  const reorderDragRef = React.useRef<ReorderDrag | null>(null);
  const timelineTrackRef = React.useRef<HTMLDivElement>(null);
  const categoryButtonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const contentScrollRef = React.useRef<HTMLDivElement>(null);
  const dragListenersRef = React.useRef<{
    move: (event: PointerEvent) => void;
    end: (event: PointerEvent) => void;
  } | null>(null);
  const [internalCategory, setInternalCategory] =
    React.useState<SelectFileCategory>(defaultSelectedCategory);
  const [internalFilterIndex, setInternalFilterIndex] = React.useState(() =>
    filterIndex(defaultSelectedFilter),
  );
  const [internalSearchValue, setInternalSearchValue] = React.useState(defaultSearchValue);
  const [internalSortValue, setInternalSortValue] =
    React.useState<SelectFileSortValue>(defaultSelectedSortValue);
  const [sortMenuOpen, setSortMenuOpen] = React.useState(false);
  const singleActions = actionSelection === "single";
  const [slots, setSlots] = React.useState<(SelectedFileSlot | null)[]>(() =>
    initialSlots(items, defaultSelection),
  );
  const [pickedId, setPickedId] = React.useState<string | null>(defaultSelectedFileId ?? null);
  /** The one card whose preview video plays: hovered on desktop, last tapped on mobile. */
  const [previewId, setPreviewId] = React.useState<string | null>(null);
  const isImages = arrangement === "images";
  const imageSelection =
    isImages && pickedId ? (items.find((item) => item.id === pickedId) ?? null) : null;
  const [actions, setActions] = React.useState<SelectedAction[]>(() =>
    initialActions(items, singleActions ? undefined : defaultActionIds),
  );
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const actionInstanceRef = React.useRef(0);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [canScrollTimelinePrev, setCanScrollTimelinePrev] = React.useState(false);
  const [canScrollTimelineNext, setCanScrollTimelineNext] = React.useState(false);

  const resolvedCategory = selectedCategory ?? internalCategory;
  const resolvedFilterIndex =
    selectedFilter === undefined ? internalFilterIndex : filterIndex(selectedFilter);
  const resolvedFilter =
    SELECT_FILE_V2_FILTER_TABS[resolvedFilterIndex] ?? SELECT_FILE_V2_DEFAULT_FILTER;
  const resolvedSearchValue = searchValue ?? internalSearchValue;
  const resolvedSortValue = selectedSortValue ?? internalSortValue;

  React.useEffect(() => {
    if (!sortMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!sortMenuRef.current?.contains(event.target as Node)) {
        setSortMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [sortMenuOpen]);

  const visibleItems = React.useMemo(() => {
    const query = resolvedSearchValue.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (!isImages && item.category !== resolvedCategory) return false;
      // Edit Image is a flat gallery. Demo tag chips would hide every still.
      if (!isImages && !matchesFilter(item, resolvedFilter)) return false;
      if (query && !item.name.toLowerCase().includes(query)) return false;
      return true;
    });

    return [...filtered].sort((left, right) => compareItems(left, right, resolvedSortValue));
  }, [isImages, items, resolvedCategory, resolvedFilter, resolvedSearchValue, resolvedSortValue]);

  const selectCategory = (index: number) => {
    const category = SELECT_FILE_V2_CATEGORIES[index]?.id;
    if (!category) return;

    if (selectedCategory === undefined) setInternalCategory(category);
    if (selectedFilter === undefined) setInternalFilterIndex(0);
    onCategoryChange?.(category);
    if (resolvedFilterIndex !== 0) onFilterChange?.(SELECT_FILE_V2_DEFAULT_FILTER);

    if (isMobile) {
      const tab = categoryButtonRefs.current[index];
      const row = tab?.parentElement;
      if (tab && row) {
        const left = tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2;
        row.scrollTo?.({ left: Math.max(0, left), behavior: "smooth" });
      }
    }
  };

  const openCategory = (category: SelectFileCategory) => {
    const index = SELECT_FILE_V2_CATEGORIES.findIndex((item) => item.id === category);
    if (index < 0) return;

    selectCategory(index);
    if (!isMobile || !contentScrollRef.current) return;

    contentScrollRef.current.scrollTo?.({ top: 0, behavior: "smooth" });
  };

  const selectFilter = (index: number) => {
    const filter = SELECT_FILE_V2_FILTER_TABS[index] ?? SELECT_FILE_V2_DEFAULT_FILTER;
    if (selectedFilter === undefined) setInternalFilterIndex(index);
    onFilterChange?.(filter);
  };

  const handleSearchChange = (value: string) => {
    if (searchValue === undefined) setInternalSearchValue(value);
    onSearchChange?.(value);
  };

  const handleSearchClear = () => {
    if (searchValue === undefined) setInternalSearchValue("");
    onSearchClear?.();
  };

  const handleSortChange = (value: SelectFileSortValue) => {
    if (selectedSortValue === undefined) setInternalSortValue(value);
    onSortChange?.(value);
    setSortMenuOpen(false);
  };

  const selectFile = (item: SelectFileItem) => {
    if (isImages) {
      setPickedId(item.id);
      onFileSelect?.(item);
      return;
    }

    if (item.category === "actions" && !singleActions) {
      const imageSrc = item.imageSrc || SELECT_FILE_V2_IMAGE_SRC;

      setActions((current) => {
        if (current.length >= SELECT_FILE_V2_MAX_ACTIONS) return current;

        actionInstanceRef.current += 1;
        return [
          ...current,
          {
            key: `picked-${actionInstanceRef.current}`,
            id: item.id,
            name: item.name,
            imageSrc,
          },
        ];
      });
    } else {
      const slotIndex = slotIndexFor(item.category, singleActions);

      if (slotIndex !== undefined) {
        const imageSrc = item.imageSrc || SELECT_FILE_V2_IMAGE_SRC;
        const nextSlots = slots.slice();
        nextSlots[slotIndex] = { id: item.id, imageSrc };
        setSlots(nextSlots);

        // Text to Image: move to the next empty footer slot. Stay once every slot is filled.
        if (singleActions && item.category) {
          const nextCategory = nextEmptyCategory(item.category, nextSlots);
          if (nextCategory) openCategory(nextCategory);
        }
      }
    }

    onFileSelect?.(item);
  };

  const removeAction = (key: string) => {
    setActions((current) => current.filter((action) => action.key !== key));
  };

  const stopDragListeners = () => {
    const listeners = dragListenersRef.current;
    if (!listeners) return;

    document.removeEventListener("pointermove", listeners.move);
    document.removeEventListener("pointerup", listeners.end);
    document.removeEventListener("pointercancel", listeners.end);
    dragListenersRef.current = null;
  };

  React.useEffect(() => stopDragListeners, []);

  const startReorder = (
    event: React.PointerEvent<HTMLButtonElement>,
    action: SelectedAction,
    index: number,
  ) => {
    const track = event.currentTarget.closest('[data-slot="select-file-timeline-track"]');
    const items = track?.querySelectorAll('[data-slot="select-file-timeline-item"]');
    if (!items?.length) return;

    const handle = event.currentTarget;
    const centers = Array.from(items).map((item) => {
      const rect = item.getBoundingClientRect();
      return rect.left + rect.width / 2;
    });
    const step = centers.length > 1 ? Math.abs(centers[1] - centers[0]) : 100;

    stopDragListeners();
    reorderDragRef.current = {
      pointerId: event.pointerId,
      id: action.key,
      index,
      originIndex: index,
      originX: event.clientX,
      step: step || 1,
      length: centers.length,
    };
    setDraggingId(action.key);
    setDragOffset(0);
    handle.setPointerCapture(event.pointerId);

    const move = (pointerEvent: PointerEvent) => {
      const drag = reorderDragRef.current;
      if (!drag || drag.pointerId !== pointerEvent.pointerId) return;

      const delta = pointerEvent.clientX - drag.originX;
      const shift = Math.round(delta / drag.step);
      const target = Math.min(drag.length - 1, Math.max(0, drag.originIndex + shift));

      setDragOffset(delta - (target - drag.originIndex) * drag.step);

      if (target === drag.index) return;

      const from = drag.index;
      drag.index = target;
      setActions((current) => reorderList(current, from, target));
    };

    const end = (pointerEvent: PointerEvent) => {
      if (reorderDragRef.current?.pointerId !== pointerEvent.pointerId) return;
      reorderDragRef.current = null;
      setDraggingId(null);
      setDragOffset(0);
      stopDragListeners();

      if (handle.hasPointerCapture(pointerEvent.pointerId)) {
        handle.releasePointerCapture(pointerEvent.pointerId);
      }
    };

    dragListenersRef.current = { move, end };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", end);
    document.addEventListener("pointercancel", end);
  };

  const showAddAction = actions.length > 0 && actions.length < SELECT_FILE_V2_MAX_ACTIONS;
  const showTimelineArrows = actions.length >= SELECT_FILE_V2_TIMELINE_ARROW_MIN;
  const actionsCategoryIndex = SELECT_FILE_V2_CATEGORIES.findIndex(
    (category) => category.id === "actions",
  );

  const updateTimelineScroll = React.useCallback(() => {
    const track = timelineTrackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    setCanScrollTimelinePrev(scrollLeft > 1);
    setCanScrollTimelineNext(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  React.useEffect(() => {
    if (!showTimelineArrows) return;

    updateTimelineScroll();
    const track = timelineTrackRef.current;
    if (!track) return;

    track.addEventListener("scroll", updateTimelineScroll, { passive: true });
    const resizeObserver = new ResizeObserver(updateTimelineScroll);
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener("scroll", updateTimelineScroll);
      resizeObserver.disconnect();
    };
  }, [showTimelineArrows, actions.length, draggingId, updateTimelineScroll]);

  const scrollTimeline = (direction: "prev" | "next") => {
    const track = timelineTrackRef.current;
    if (!track) return;

    const item = track.querySelector<HTMLElement>('[data-slot="select-file-timeline-item"]');
    const step = (item?.offsetWidth || SCENE_WIDTH_PX) + SELECT_FILE_V2_TIMELINE_CONNECTOR_WIDTH_PX;

    track.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  };

  const catalogSelection = singleActions ? selectionFromSlots(slots, items) : {};
  const hasCatalogSelection = singleActions
    ? Object.keys(catalogSelection).length > 0
    : actions.length > 0 ||
      slots.some((slot, index) => slot != null && index !== SELECT_FILE_V2_SLOT_INDEX.actions);

  const timeline =
    !singleActions && actions.length > 0 ? (
      <section
        data-slot="select-file-timeline"
        aria-label={SELECT_FILE_V2_TIMELINE_LABEL}
        className="flex shrink-0 flex-col gap-2"
      >
        <div className="flex items-center gap-1.5">
          <img
            src={SELECT_FILE_V2_TIMELINE_EMOJI_SRC}
            alt=""
            width={16}
            height={16}
            data-slot="select-file-timeline-emoji"
            className="size-4 shrink-0"
          />
          <h3 className="text-tooltip-text text-base leading-6 font-medium">
            {SELECT_FILE_V2_TIMELINE_LABEL}
          </h3>
        </div>
        <div className="relative">
          {showTimelineArrows && canScrollTimelinePrev ? (
            <ScrollArrowButton
              direction="prev"
              desktopOnly={false}
              className="z-50 size-[33px]"
              style={{ top: SCENE_HEIGHT_PX / 2 }}
              aria-label="Scroll timeline left"
              onClick={() => scrollTimeline("prev")}
            />
          ) : null}
          <div
            ref={timelineTrackRef}
            data-slot="select-file-timeline-track"
            className={cn(
              "scrollbar-hidden flex items-start",
              draggingId ? "touch-none overflow-x-hidden" : "overflow-x-auto",
            )}
          >
            {actions.map((action, index) => (
              <React.Fragment key={action.key}>
                {index > 0 ? <TimelineConnector tone="solid" /> : null}
                <div
                  data-slot="select-file-timeline-item"
                  data-index={index}
                  data-file-id={action.id}
                  data-dragging={draggingId === action.key ? "true" : "false"}
                  className={cn(
                    "relative flex shrink-0 flex-col items-center gap-2",
                    draggingId === action.key && "z-30",
                  )}
                  style={
                    draggingId === action.key
                      ? { transform: `translateX(${dragOffset}px)` }
                      : undefined
                  }
                >
                  <Scene
                    name={action.name}
                    imageSrc={action.imageSrc}
                    onClose={() => removeAction(action.key)}
                  />
                  <button
                    type="button"
                    data-slot="select-file-timeline-handle"
                    aria-label={`Reorder ${action.name}`}
                    className="absolute inset-x-0 top-0 z-40 h-6 cursor-grab touch-none border-0 bg-transparent p-0 active:cursor-grabbing"
                    onPointerDown={(event) => startReorder(event, action, index)}
                  />
                  <Number value={String(index + 1)} />
                </div>
              </React.Fragment>
            ))}
            {showAddAction ? (
              <>
                <TimelineConnector tone="add" />
                <div
                  data-slot="select-file-timeline-add"
                  className="flex shrink-0 flex-col items-center gap-2"
                >
                  <Scene variant="add" onClick={() => selectCategory(actionsCategoryIndex)} />
                  <Number variant="hollow" value={String(actions.length + 1)} />
                </div>
              </>
            ) : null}
          </div>
          {showTimelineArrows && canScrollTimelineNext ? (
            <ScrollArrowButton
              direction="next"
              desktopOnly={false}
              className="z-50 size-[33px]"
              style={{ top: SCENE_HEIGHT_PX / 2 }}
              aria-label="Scroll timeline right"
              onClick={() => scrollTimeline("next")}
            />
          ) : null}
        </div>
      </section>
    ) : null;

  return (
    <ModalLayout
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={title}
      titleIcon={<FolderIcon className="text-tooltip-text size-5" />}
      showIcon
      showMobileHandle={isMobile && !isDesktopViewport}
      showHandle={isMobile && isDesktopViewport}
      closeLabel={closeLabel}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={onClose}
      headerClassName="shrink-0"
      className={isMobile ? SELECT_FILE_V2_MOBILE_DIALOG_CLASS : SELECT_FILE_V2_DIALOG_CLASS}
    >
      <section
        data-slot="select-file-v2"
        data-layout={isMobile ? "mobile" : "desktop"}
        data-arrangement={arrangement}
        data-action-selection={isImages ? undefined : actionSelection}
        aria-label={title}
        className={cn(
          "flex min-h-0 flex-1 gap-4 overflow-hidden",
          isMobile ? "flex-col" : "flex-row",
          className,
        )}
      >
        {!isMobile && !isImages ? (
          <div
            data-slot="select-file-categories"
            role="group"
            aria-label="File categories"
            className={cn("flex shrink-0 flex-col gap-2", SELECT_FILE_V2_CATEGORY_COLUMN_CLASS)}
          >
            {SELECT_FILE_V2_CATEGORIES.map((category, index) => {
              const isSelected = category.id === resolvedCategory;

              return (
                <button
                  key={category.id}
                  ref={(node) => {
                    categoryButtonRefs.current[index] = node;
                  }}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => selectCategory(index)}
                  className={cn(
                    "inline-flex h-11 w-full cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm leading-5 font-medium transition-colors",
                    isSelected
                      ? "bg-surface-strong text-tooltip-text shadow-[var(--toggle-thumb-shadow)]"
                      : "bg-tooltip-default-bg text-divider-label",
                  )}
                >
                  <span
                    aria-hidden
                    className="inline-flex size-5 shrink-0 items-center justify-center"
                  >
                    {category.icon}
                  </span>
                  {category.label}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
          {!isMobile && !isImages ? timeline : null}

          <div
            ref={contentScrollRef}
            data-slot="select-file-scroll"
            className="scrollbar-hidden flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto"
          >
            {isMobile && !isImages ? (
              <div
                data-slot="select-file-categories"
                role="group"
                aria-label="File categories"
                className="flex w-full min-w-0 shrink-0"
              >
                {SELECT_FILE_V2_CATEGORIES.map((category, index) => {
                  const isSelected = category.id === resolvedCategory;

                  return (
                    <button
                      key={category.id}
                      ref={(node) => {
                        categoryButtonRefs.current[index] = node;
                      }}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => selectCategory(index)}
                      className={cn(
                        "flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-2.5 pt-3 text-center text-sm leading-5 font-medium whitespace-nowrap",
                        isSelected
                          ? "text-tooltip-text"
                          : "border-surface-strong text-divider-label border-b",
                      )}
                    >
                      <span className="px-2">{category.label}</span>
                      <span
                        className={cn(
                          "h-0.5 w-full rounded-t-full",
                          isSelected ? "bg-tooltip-text" : "bg-transparent",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
            {isMobile && !isImages ? timeline : null}

            <div className="flex w-full min-w-0 items-center gap-2">
              <SearchInput
                value={resolvedSearchValue}
                onChange={(event) => handleSearchChange(event.target.value)}
                onClear={handleSearchClear}
                placeholder={SELECT_FILE_V2_SEARCH_PLACEHOLDER}
                disableAutoFocus
                aria-label={SELECT_FILE_V2_SEARCH_PLACEHOLDER}
                wrapperClassName="min-w-0 flex-1 [&>div]:w-full"
                className="w-full min-w-0"
              />
              <div ref={sortMenuRef} className="relative z-20 shrink-0">
                <Buttons
                  type="button"
                  variant="neutral-border"
                  size="btn-m"
                  label=""
                  leftIcon={false}
                  rightIconSrc="/assets/descending.svg"
                  className="w-11 gap-0 px-0!"
                  aria-expanded={sortMenuOpen}
                  aria-haspopup="listbox"
                  aria-label="Sort files"
                  onClick={() => setSortMenuOpen((previous) => !previous)}
                />
                {sortMenuOpen ? (
                  <div
                    data-slot="select-file-sort-menu"
                    className="absolute top-full right-0 z-50 mt-2"
                  >
                    <OptionList
                      title="Sort by"
                      items={SORT_OPTION_ITEMS}
                      value={resolvedSortValue}
                      onValueChange={(value) => handleSortChange(value as SelectFileSortValue)}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            {showFilters && !isImages ? (
              <Tabs
                variant="compact"
                compactLayout="scroll"
                scrollArrows={isMobile ? false : "desktop"}
                unstyled
                showTabIcon={false}
                listLabel="File filters"
                className="w-full overflow-visible"
                tabs={SELECT_FILE_V2_FILTER_TABS.map((label) => ({
                  label,
                  showBadge: false,
                }))}
                selected={resolvedFilterIndex}
                onChange={selectFilter}
              />
            ) : null}

            <div data-slot="select-file-grid">
              {visibleItems.length === 0 ? (
                <p className="text-divider-label px-1 py-6 text-center text-sm leading-5">
                  {SELECT_FILE_V2_EMPTY_LABEL}
                </p>
              ) : (
                <div
                  className={cn(
                    "grid gap-2",
                    isMobile
                      ? "grid-cols-2 min-[556px]:grid-cols-3"
                      : SELECT_FILE_V2_DESKTOP_GRID_CLASS,
                  )}
                >
                  {visibleItems.map((item) => {
                    // A video with no still shows its own first frame, not the demo image.
                    const imageSrc =
                      item.imageSrc || (item.videoSrc ? undefined : SELECT_FILE_V2_IMAGE_SRC);
                    const isPreviewing = Boolean(item.videoSrc) && previewId === item.id;
                    const selectedSlotIndex = slotIndexFor(item.category, singleActions);
                    const slotSelected =
                      selectedSlotIndex !== undefined && slots[selectedSlotIndex]?.id === item.id;
                    const isSelected = isImages
                      ? imageSelection?.id === item.id
                      : item.category === "actions" && !singleActions
                        ? actions.some((action) => action.id === item.id)
                        : slotSelected;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-slot="select-file-card"
                        data-selected={isSelected ? "true" : "false"}
                        className={cn(
                          "relative w-full cursor-pointer overflow-hidden",
                          isMobile
                            ? SELECT_FILE_V2_MOBILE_CARD_CLASS
                            : SELECT_FILE_V2_CARD_ASPECT_CLASS,
                        )}
                        aria-label={isImages ? item.name : undefined}
                        onMouseEnter={() => setPreviewId(item.id)}
                        onMouseLeave={() =>
                          setPreviewId((current) => (current === item.id ? null : current))
                        }
                        onClick={() => {
                          // A tap has no hover: it plays the preview as it selects.
                          setPreviewId(item.id);
                          selectFile(item);
                        }}
                      >
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt=""
                            fill
                            sizes="220px"
                            unoptimized={isRemoteImageSrc(imageSrc)}
                            className="object-cover"
                          />
                        ) : null}
                        {item.videoSrc && (isPreviewing || !imageSrc) ? (
                          <CardPreviewVideo src={item.videoSrc} playing={isPreviewing} />
                        ) : null}
                        <span
                          aria-hidden
                          className={cn(
                            "pointer-events-none absolute inset-0",
                            isMobile
                              ? SELECT_FILE_V2_MOBILE_CARD_RADIUS_CLASS
                              : SELECT_FILE_V2_DESKTOP_CARD_RADIUS_CLASS,
                          )}
                          style={SELECT_FILE_V2_CARD_BORDER_STYLE}
                        />
                        {isImages ? null : (
                          <span
                            className={cn(
                              "pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center",
                              isMobile ? "h-20 px-2 py-2.5" : "h-[100px] p-4",
                            )}
                            style={{ background: SELECT_FILE_V2_CARD_SCRIM }}
                          >
                            <span
                              className={cn(
                                "text-tooltip-text text-center font-semibold",
                                isMobile
                                  ? "text-sm leading-4"
                                  : SELECT_FILE_V2_DESKTOP_CARD_NAME_CLASS,
                              )}
                            >
                              {item.name}
                            </span>
                          </span>
                        )}
                        {item.isNew ? (
                          <Badge
                            data-slot="select-file-card-new"
                            text={SELECT_FILE_V2_NEW_LABEL}
                            showIcon={false}
                            size={isMobile ? "small" : "medium"}
                            className="pointer-events-none absolute top-2 left-2 z-10"
                          />
                        ) : null}
                        {isSelected ? (
                          <span
                            aria-hidden
                            data-slot="select-file-card-selected"
                            className={cn(
                              "ring-brand-primary pointer-events-none absolute inset-0 z-10 ring-2 ring-inset",
                              isMobile
                                ? SELECT_FILE_V2_MOBILE_CARD_RADIUS_CLASS
                                : SELECT_FILE_V2_DESKTOP_CARD_RADIUS_CLASS,
                            )}
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {isImages ? (
            <div data-slot="select-file-footer" className="flex shrink-0 items-center gap-2.5">
              <div className="flex min-w-0 flex-1 items-center">
                {imageSelection ? (
                  <div
                    data-slot="select-file-slot"
                    data-filled="true"
                    data-file-id={imageSelection.id}
                    role="img"
                    aria-label="Selected image"
                    className="border-cookie-bg relative box-border h-[44px] w-[35px] shrink-0 overflow-hidden rounded-[6px] border"
                  >
                    <Image
                      src={imageSelection.imageSrc || SELECT_FILE_V2_IMAGE_SRC}
                      alt=""
                      fill
                      sizes="35px"
                      unoptimized={isRemoteImageSrc(
                        imageSelection.imageSrc || SELECT_FILE_V2_IMAGE_SRC,
                      )}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    data-slot="select-file-slot"
                    data-filled="false"
                    className="flex shrink-0 self-center"
                  >
                    <ActionContentCard variant="default" />
                  </div>
                )}
              </div>
              <Buttons
                type="button"
                variant="rose"
                size="btn-m"
                label={SELECT_FILE_V2_SAVE_LABEL}
                leftIcon={false}
                rightIcon={false}
                disabled={!imageSelection}
                className="w-fit"
                onClick={() => {
                  if (!imageSelection) return;
                  onConfirm?.(imageSelection);
                  onSave?.();
                }}
              />
            </div>
          ) : (
            <div data-slot="select-file-footer" className="flex shrink-0 items-center gap-2.5">
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                {Array.from({ length: SELECT_FILE_V2_SLOT_COUNT }, (_, index) => {
                  if (!singleActions && index === SELECT_FILE_V2_SLOT_INDEX.actions) {
                    if (actions.length === 0) {
                      return (
                        <div
                          key="actions"
                          data-slot="select-file-slot"
                          data-index={index}
                          data-filled="false"
                          data-category="actions"
                          data-action-count="0"
                          className="flex shrink-0 self-center"
                        >
                          <ActionContentCard
                            variant="default"
                            onAddClick={() => openCategory("actions")}
                          />
                        </div>
                      );
                    }

                    return (
                      <div
                        key="actions"
                        data-slot="select-file-slot"
                        data-index={index}
                        data-filled="true"
                        data-category="actions"
                        data-action-count={actions.length}
                        data-file-id={actions.map((action) => action.id).join(" ")}
                        aria-label={`${actions.length} selected actions`}
                        className="flex shrink-0 self-center"
                      >
                        <ActionContentCard
                          variant={actionIndicatorVariant(actions.length)}
                          imageSrcs={actions.map((action) => action.imageSrc)}
                          overflowCount={Math.max(actions.length - 3, 0)}
                          onAddClick={() => openCategory("actions")}
                        />
                      </div>
                    );
                  }

                  const selection = slots[index];
                  const category = slotCategoryFor(index);

                  if (!selection || !category) {
                    return (
                      <div
                        key={index}
                        data-slot="select-file-slot"
                        data-index={index}
                        data-filled="false"
                        data-category={category}
                        className="flex shrink-0 self-center"
                      >
                        <ActionContentCard
                          variant="default"
                          onAddClick={category ? () => openCategory(category) : undefined}
                        />
                      </div>
                    );
                  }

                  return (
                    <button
                      key={`${category}-${selection.id}`}
                      type="button"
                      data-slot="select-file-slot"
                      data-index={index}
                      data-filled="true"
                      data-category={category}
                      data-file-id={selection.id}
                      aria-label={SELECT_FILE_V2_SLOT_LABELS[category]}
                      className="border-cookie-bg relative box-border h-[44px] w-[35px] shrink-0 cursor-pointer self-center overflow-hidden rounded-[6px] border"
                      onClick={() => openCategory(category)}
                    >
                      <Image
                        src={selection.imageSrc}
                        alt=""
                        fill
                        sizes="35px"
                        unoptimized={isRemoteImageSrc(selection.imageSrc)}
                        className="object-cover"
                      />
                      <span
                        data-slot="select-file-slot-icon"
                        aria-hidden
                        className="text-tooltip-text pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-6 items-center justify-center"
                        style={{ background: ACTION_CONTENT_CARD_SCRIM }}
                      >
                        {SELECT_FILE_V2_SLOT_ICONS[category]}
                      </span>
                    </button>
                  );
                })}
              </div>
              <Buttons
                type="button"
                variant="rose"
                size="btn-m"
                label={SELECT_FILE_V2_SAVE_LABEL}
                leftIcon={false}
                rightIcon={false}
                disabled={!hasCatalogSelection}
                className="w-fit"
                onClick={() => {
                  if (!hasCatalogSelection) return;
                  onSelectionConfirm?.(
                    singleActions ? catalogSelection : timelineSelection(slots, actions, items),
                  );
                  onSave?.();
                }}
              />
            </div>
          )}
        </div>
      </section>
    </ModalLayout>
  );
}
