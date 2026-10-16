"use client";

import { ArrowDownAZ, ArrowDownWideNarrow, ArrowUpAZ, ArrowUpWideNarrow } from "lucide-react";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import {
  OptionList,
  type OptionListItem,
} from "@/components/common/general/option-list/option-list";
import { SearchInput } from "@/components/common/general/search-input/search-input";
import Tabs from "@/components/common/general/tabs";
import { useIsDesktop } from "@/hooks/use-is-desktop";

import {
  CHOOSE_TEMPLATE_DEFAULT_SORT_VALUE,
  CHOOSE_TEMPLATE_FILTER_TABS,
  CHOOSE_TEMPLATE_SORT_OPTIONS,
  CHOOSE_TEMPLATE_TYPE_TABS,
  type ChooseTemplateSortValue,
} from "../choose-template.constants";

const SORT_OPTION_ICONS: Record<ChooseTemplateSortValue, React.ReactNode> = {
  newest: <ArrowDownWideNarrow className="size-5 shrink-0" aria-hidden />,
  oldest: <ArrowUpWideNarrow className="size-5 shrink-0" aria-hidden />,
  "name-asc": <ArrowDownAZ className="size-5 shrink-0" aria-hidden />,
  "name-desc": <ArrowUpAZ className="size-5 shrink-0" aria-hidden />,
};

function toSortOptionItems(): OptionListItem[] {
  return CHOOSE_TEMPLATE_SORT_OPTIONS.map(({ value, label }) => ({
    value,
    label,
    leftIconSrc: SORT_OPTION_ICONS[value],
  }));
}

export type ChooseTemplateToolbarProps = {
  showSortButton?: boolean;
  showTemplateTypeTabs?: boolean;
  showFilterTabs?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  selectedTypeTab?: number;
  defaultSelectedTypeTab?: number;
  onTypeTabChange?: (index: number) => void;
  selectedFilterTab?: number;
  defaultSelectedFilterTab?: number;
  onFilterTabChange?: (index: number) => void;
  selectedSortValue?: ChooseTemplateSortValue;
  onSortChange?: (value: ChooseTemplateSortValue) => void;
  onSortClick?: () => void;
};

export function ChooseTemplateToolbar({
  showSortButton = true,
  showTemplateTypeTabs = true,
  showFilterTabs = true,
  searchValue,
  searchPlaceholder = "Search...",
  onSearchChange,
  onSearchClear,
  selectedTypeTab,
  defaultSelectedTypeTab = 0,
  onTypeTabChange,
  selectedFilterTab,
  defaultSelectedFilterTab = 0,
  onFilterTabChange,
  selectedSortValue = CHOOSE_TEMPLATE_DEFAULT_SORT_VALUE,
  onSortChange,
  onSortClick,
}: ChooseTemplateToolbarProps) {
  const sortMenuRef = React.useRef<HTMLDivElement>(null);
  const [isSortMenuOpen, setIsSortMenuOpen] = React.useState(false);
  const isDesktop = useIsDesktop();

  React.useEffect(() => {
    if (!isSortMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!sortMenuRef.current?.contains(event.target as Node)) {
        setIsSortMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSortMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSortMenuOpen]);

  const handleSortSelect = (value: string) => {
    onSortChange?.(value as ChooseTemplateSortValue);
    setIsSortMenuOpen(false);
  };

  const handleSortButtonClick = () => {
    setIsSortMenuOpen((previous) => !previous);
    onSortClick?.();
  };

  return (
    <>
      <div className="flex w-full min-w-0 shrink-0 flex-col md:flex-row md:items-center md:gap-2">
        {showTemplateTypeTabs && (
          <div
            data-slot="choose-template-type-tabs"
            className="w-full min-w-0 md:w-auto md:max-w-[420px] md:shrink-0"
          >
            {isDesktop && (
              <Tabs
                showTabIcon={isDesktop ? true : false}
                variant="compact"
                compactLayout="segmented"
                unstyled
                className="w-full"
                tabs={CHOOSE_TEMPLATE_TYPE_TABS.map(({ label, leftIconSrc }) => ({
                  label,
                  leftIconSrc,
                  showBadge: false,
                }))}
                selected={selectedTypeTab}
                defaultSelected={defaultSelectedTypeTab}
                onChange={onTypeTabChange}
              />
            )}
          </div>
        )}

        <div className="flex w-full min-w-0 items-center justify-between gap-2 md:flex-1">
          <SearchInput
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            onClear={onSearchClear}
            placeholder={searchPlaceholder}
            wrapperClassName="w-full [&>div]:w-full"
            className="w-full min-w-0"
          />
          {showSortButton ? (
            <div ref={sortMenuRef} className="relative shrink-0">
              <Buttons
                type="button"
                onClick={handleSortButtonClick}
                variant="neutral-border"
                className="w-fit gap-0 px-3!"
                size="btn-m"
                leftIcon={false}
                label=""
                rightIconSrc="/assets/descending.svg"
                aria-expanded={isSortMenuOpen}
                aria-haspopup="listbox"
                aria-label="Sort templates"
              />
              {isSortMenuOpen ? (
                <div
                  data-slot="choose-template-sort-menu"
                  className="absolute top-full right-0 z-50 mt-2"
                >
                  <OptionList
                    title="Sort by"
                    items={toSortOptionItems()}
                    value={selectedSortValue}
                    onValueChange={handleSortSelect}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {showFilterTabs && (
        <div data-slot="choose-template-filter-tabs" className="w-full min-w-0 shrink-0">
          <Tabs
            variant="compact"
            compactLayout="scroll"
            scrollArrows="desktop"
            unstyled
            className="w-full overflow-visible"
            tabs={CHOOSE_TEMPLATE_FILTER_TABS.map((label) => ({
              label,
              showBadge: false,
            }))}
            selected={selectedFilterTab}
            defaultSelected={defaultSelectedFilterTab}
            onChange={onFilterTabChange}
          />
        </div>
      )}
    </>
  );
}
