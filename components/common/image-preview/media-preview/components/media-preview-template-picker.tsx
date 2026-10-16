"use client";

import { ArrowDownAZ, ArrowUpAZ, ArrowUpDown } from "lucide-react";
import * as React from "react";

import {
  filterGenerateTemplates,
  GENERATE_TEMPLATE_ITEMS,
  GENERATE_TEMPLATES_NICHE_FILTER,
  GENERATE_TEMPLATES_SORT_TABS,
  GENERATE_TEMPLATES_SORT_TABS_CLASS,
  type GenerateTemplateItem,
} from "@/app/(main)/generate/_lib/generate-templates";
import { ModelEmptyStateSection } from "@/components/common/ai-model-pages/empty-state-section/empty-state-section";
import { CHOOSE_TEMPLATE_MOBILE_DRAWER_SIZE_CLASS } from "@/components/common/chat/choose-template/choose-template.constants";
import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import {
  OptionList,
  type OptionListItem,
} from "@/components/common/general/option-list/option-list";
import { SearchInput } from "@/components/common/general/search-input/search-input";
import Tabs from "@/components/common/general/tabs/tabs";
import { AiModel } from "@/components/common/Prismic/ai-model";
import { HomepageFilterButton } from "@/components/pages/homepage/_components/homepage-filter-button";
import { HOMEPAGE_MODEL_GRID_CLASS } from "@/components/pages/homepage/_lib/layout.constants";
import type { HomepageFilter } from "@/components/pages/homepage/_lib/types";
import { cn } from "@/lib/utils";

const SEARCH_PLACEHOLDER = "Search by prompt...";

/** Preview picker stays at 5 columns on wide desktops; the create page still steps to 6. */
const TEMPLATE_PICKER_GRID_CLASS =
  "grid grid-cols-2 gap-2 min-[768px]:grid-cols-3 min-[768px]:gap-3 min-[1280px]:grid-cols-4 min-[1440px]:grid-cols-5";

const AUDIO_FILTER: HomepageFilter = {
  id: "audio",
  label: "Audio",
  value: "All",
  options: ["All", "With audio", "No audio"],
  showLeftIcon: false,
};

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
] as const;

type TemplateSortValue = (typeof SORT_OPTIONS)[number]["value"];

const SORT_OPTION_ICONS: Record<TemplateSortValue, React.ReactNode> = {
  default: <ArrowUpDown className="size-5 shrink-0" aria-hidden />,
  "name-asc": <ArrowDownAZ className="size-5 shrink-0" aria-hidden />,
  "name-desc": <ArrowUpAZ className="size-5 shrink-0" aria-hidden />,
};

const SORT_OPTION_ITEMS: OptionListItem[] = SORT_OPTIONS.map(({ value, label }) => ({
  value,
  label,
  leftIconSrc: SORT_OPTION_ICONS[value],
}));

type MediaPreviewTemplatePickerProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onTemplateSelect?: (template: GenerateTemplateItem) => void;
  items?: readonly GenerateTemplateItem[];
};

export function MediaPreviewTemplatePicker({
  open = false,
  onOpenChange,
  onTemplateSelect,
  items = GENERATE_TEMPLATE_ITEMS,
}: MediaPreviewTemplatePickerProps) {
  const sortMenuRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [niche, setNiche] = React.useState(GENERATE_TEMPLATES_NICHE_FILTER.value);
  const [audio, setAudio] = React.useState(AUDIO_FILTER.value);
  const [sortIndex, setSortIndex] = React.useState(-1);
  const [sortValue, setSortValue] = React.useState<TemplateSortValue>("default");
  const [sortMenuOpen, setSortMenuOpen] = React.useState(false);

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
    const filtered = filterGenerateTemplates(items, { query: searchValue, niche });
    const audioFiltered = audio === "With audio" ? [] : filtered;
    if (sortValue === "default") return audioFiltered;

    return [...audioFiltered].sort((left, right) =>
      sortValue === "name-asc"
        ? left.name.localeCompare(right.name)
        : right.name.localeCompare(left.name),
    );
  }, [audio, items, niche, searchValue, sortValue]);

  const resetFilters = () => {
    setSearchValue("");
    setNiche(GENERATE_TEMPLATES_NICHE_FILTER.value);
    setAudio(AUDIO_FILTER.value);
    setSortIndex(-1);
    setSortValue("default");
  };

  const selectTemplate = (item: GenerateTemplateItem) => {
    onTemplateSelect?.(item);
  };

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Select a template"
      titleIconSrc="/assets/folder.svg"
      showIcon
      showMobileHandle
      closeLabel="Close template picker"
      overlayClassName="z-100 bg-black/40 supports-backdrop-filter:backdrop-blur-sm"
      className={cn(
        "border-surface-strong bg-dialog-bg z-100 flex h-[min(960px,calc(100vh-1rem))] max-h-[calc(100vh-1rem)] flex-col gap-4 overflow-hidden md:max-w-[min(100%,1240px)] md:rounded-[48px] md:p-8",
        CHOOSE_TEMPLATE_MOBILE_DRAWER_SIZE_CLASS,
      )}
    >
      <section
        data-slot="media-preview-template-picker"
        aria-label="Select a template"
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      >
        <div className="flex w-full min-w-0 shrink-0 flex-col gap-2 md:flex-row md:items-center">
          <div className="max-md:scrollbar-hidden order-2 flex min-w-0 shrink-0 items-center gap-2 max-md:overflow-x-auto md:order-1 md:flex-wrap">
            <HomepageFilterButton
              filter={GENERATE_TEMPLATES_NICHE_FILTER}
              value={niche}
              onValueChange={setNiche}
            />
            <HomepageFilterButton filter={AUDIO_FILTER} value={audio} onValueChange={setAudio} />
            <Tabs
              variant="compact"
              compactLayout="scroll"
              unstyled
              showTabIcon
              listLabel="Template filters"
              selected={sortIndex}
              onChange={setSortIndex}
              tabs={[...GENERATE_TEMPLATES_SORT_TABS]}
              className={GENERATE_TEMPLATES_SORT_TABS_CLASS}
            />
          </div>

          <div
            data-slot="media-preview-template-search"
            className="order-1 flex w-full min-w-0 items-center gap-2 md:order-2 md:w-auto md:flex-1"
          >
            <SearchInput
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onClear={() => setSearchValue("")}
              placeholder={SEARCH_PLACEHOLDER}
              showClose={searchValue.length > 0}
              aria-label={SEARCH_PLACEHOLDER}
              wrapperClassName="min-w-0 flex-1 [&>div]:w-full"
              className="w-full min-w-0"
            />
            <div ref={sortMenuRef} className="relative shrink-0">
              <Buttons
                type="button"
                variant="neutral-border"
                size="btn-m"
                label="Sort"
                leftIconSrc="/assets/descending.svg"
                rightIcon={false}
                className="w-fit"
                aria-expanded={sortMenuOpen}
                aria-haspopup="listbox"
                aria-label="Sort templates"
                onClick={() => setSortMenuOpen((previous) => !previous)}
              />
              {sortMenuOpen ? (
                <div className="absolute top-full right-0 z-50 mt-2">
                  <OptionList
                    title="Sort by"
                    items={SORT_OPTION_ITEMS}
                    value={sortValue}
                    onValueChange={(value) => {
                      setSortValue(value as TemplateSortValue);
                      setSortMenuOpen(false);
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto">
          {visibleItems.length === 0 ? (
            <div className="flex min-h-full w-full items-center justify-center">
              <ModelEmptyStateSection
                title="No templates found"
                description="Try a different search or clear the filters to see all templates."
                ctaSlot={
                  <Buttons
                    type="button"
                    variant="neutral"
                    size="btn-m"
                    leftIcon={false}
                    rightIcon={false}
                    label="Clear filters"
                    onClick={resetFilters}
                    className="w-fit"
                  />
                }
              />
            </div>
          ) : (
            <div data-slot="media-preview-template-grid" className={TEMPLATE_PICKER_GRID_CLASS}>
              {visibleItems.map((item) => (
                <AiModel
                  key={item.id}
                  variant="templates"
                  name={item.name}
                  assetKey={item.assetKey}
                  imageSrc={item.imageSrc}
                  insetImageSrc={item.insetImageSrc}
                  badgeLabel={item.badgeLabel}
                  showActionButton
                  className={HOMEPAGE_MODEL_GRID_CLASS}
                  onClick={() => selectTemplate(item)}
                  onActionClick={() => selectTemplate(item)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </ModalLayout>
  );
}
