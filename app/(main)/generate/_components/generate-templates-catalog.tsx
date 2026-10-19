"use client";

import * as React from "react";

import { ModelEmptyStateSection } from "@/components/common/ai-model-pages/empty-state-section/empty-state-section";
import { Buttons } from "@/components/common/general/button/buttons";
import { SearchInput } from "@/components/common/general/search-input/search-input";
import Tabs from "@/components/common/general/tabs/tabs";
import { AiModel } from "@/components/common/Prismic/ai-model";
import { HomepageFilterButton } from "@/components/pages/homepage/_components/homepage-filter-button";
import { HOMEPAGE_MODEL_GRID_CLASS } from "@/components/pages/homepage/_lib/layout.constants";
import { cn } from "@/lib/utils";

import {
  filterGenerateTemplates,
  GENERATE_TEMPLATE_ITEMS,
  GENERATE_TEMPLATES_BOTTOM_FADE_CLASS,
  GENERATE_TEMPLATES_GRID_CLASS,
  GENERATE_TEMPLATES_NICHE_FILTER,
  GENERATE_TEMPLATES_SCROLL_CLASS,
  GENERATE_TEMPLATES_SEARCH_PLACEHOLDER,
  GENERATE_TEMPLATES_SEARCH_WRAPPER_COLLAPSED_CLASS,
  GENERATE_TEMPLATES_SEARCH_WRAPPER_EXPANDED_CLASS,
  GENERATE_TEMPLATES_SORT_TABS,
  GENERATE_TEMPLATES_SORT_TABS_CLASS,
  GENERATE_TEMPLATES_TOOLBAR_CLASS,
  type GenerateTemplateItem,
  type GenerateTemplateLane,
} from "../_lib/generate-templates";
import { GenerateTemplateModal } from "./generate-template-modal";

export type GenerateTemplatesCatalogProps = {
  items?: readonly GenerateTemplateItem[];
  className?: string;
  /** Limits the grid to one studio lane. Search and niche filters still apply. */
  lane?: GenerateTemplateLane;
  /**
   * Let the grid grow with the page instead of owning a nested scroller.
   * Used when the cover banner sits above the catalog.
   */
  growWithContent?: boolean;
  onGenerate?: (item: GenerateTemplateItem) => void;
  onGoToGallery?: () => void;
};

export function GenerateTemplatesCatalog({
  items = GENERATE_TEMPLATE_ITEMS,
  className,
  lane,
  growWithContent = false,
  onGenerate,
  onGoToGallery,
}: GenerateTemplatesCatalogProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const [searchExpanded, setSearchExpanded] = React.useState(false);
  const [niche, setNiche] = React.useState(GENERATE_TEMPLATES_NICHE_FILTER.value);
  const [sortIndex, setSortIndex] = React.useState(-1);
  const [selectedTemplate, setSelectedTemplate] = React.useState<GenerateTemplateItem | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = React.useState(false);

  const openTemplateModal = (item: GenerateTemplateItem) => {
    setSelectedTemplate(item);
    setTemplateModalOpen(true);
  };

  const handleTemplateModalOpenChange = (open: boolean) => {
    setTemplateModalOpen(open);
  };

  const visibleItems = React.useMemo(() => {
    const laneItems = lane ? items.filter((item) => item.lane === lane) : items;
    return filterGenerateTemplates(laneItems, { query: searchValue, niche });
  }, [items, lane, niche, searchValue]);

  const isSearchExpanded = searchExpanded || searchValue.length > 0;

  const resetFilters = () => {
    setSearchValue("");
    setSearchExpanded(false);
    setNiche(GENERATE_TEMPLATES_NICHE_FILTER.value);
    setSortIndex(-1);
  };

  return (
    <div
      data-slot="generate-templates"
      className={cn(
        "flex min-w-0 flex-col gap-4",
        growWithContent ? "h-auto" : "min-[768px]:min-h-0 min-[768px]:flex-1",
        className,
      )}
    >
      <div data-slot="generate-templates-toolbar" className={GENERATE_TEMPLATES_TOOLBAR_CLASS}>
        <SearchInput
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          onClear={() => {
            setSearchValue("");
            setSearchExpanded(false);
          }}
          onExpand={() => setSearchExpanded(true)}
          onFocus={() => setSearchExpanded(true)}
          placeholder={GENERATE_TEMPLATES_SEARCH_PLACEHOLDER}
          collapsed
          showClose={searchValue.length > 0 || isSearchExpanded}
          aria-label={GENERATE_TEMPLATES_SEARCH_PLACEHOLDER}
          wrapperClassName={
            isSearchExpanded
              ? GENERATE_TEMPLATES_SEARCH_WRAPPER_EXPANDED_CLASS
              : GENERATE_TEMPLATES_SEARCH_WRAPPER_COLLAPSED_CLASS
          }
        />

        <HomepageFilterButton
          filter={GENERATE_TEMPLATES_NICHE_FILTER}
          value={niche}
          onValueChange={setNiche}
        />

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
        className={cn(
          "relative flex min-w-0 flex-col",
          !growWithContent && "min-[768px]:min-h-0 min-[768px]:flex-1",
        )}
      >
        <div
          data-slot="generate-templates-scroll"
          className={cn(
            GENERATE_TEMPLATES_SCROLL_CLASS,
            growWithContent &&
              "min-[768px]:h-auto min-[768px]:flex-none min-[768px]:overflow-visible",
          )}
        >
          {visibleItems.length === 0 ? (
            <div
              data-slot="generate-templates-empty"
              className="flex min-h-0 w-full flex-1 items-center justify-center"
            >
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
            <div data-slot="generate-templates-grid" className={GENERATE_TEMPLATES_GRID_CLASS}>
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
                  className={cn(HOMEPAGE_MODEL_GRID_CLASS, "h-full")}
                  onClick={() => openTemplateModal(item)}
                  onActionClick={() => openTemplateModal(item)}
                />
              ))}
            </div>
          )}
        </div>
        <div
          aria-hidden
          data-slot="generate-templates-bottom-fade"
          className={GENERATE_TEMPLATES_BOTTOM_FADE_CLASS}
        />
      </div>

      <GenerateTemplateModal
        open={templateModalOpen}
        item={selectedTemplate}
        onOpenChange={handleTemplateModalOpenChange}
        onGenerate={onGenerate}
        onGoToGallery={onGoToGallery}
      />
    </div>
  );
}
