"use client";

import * as React from "react";

import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";

import Tabs from "../../general/tabs/tabs";
import {
  CHOOSE_TEMPLATE_DEFAULT_ITEMS,
  CHOOSE_TEMPLATE_DEFAULT_SEARCH_PLACEHOLDER,
  CHOOSE_TEMPLATE_DEFAULT_SORT_VALUE,
  CHOOSE_TEMPLATE_DEFAULT_TITLE,
  CHOOSE_TEMPLATE_MOBILE_DRAWER_SIZE_CLASS,
  CHOOSE_TEMPLATE_TITLE_ICON_SRC,
  CHOOSE_TEMPLATE_TYPE_TABS,
  type ChooseTemplateItem,
  type ChooseTemplateSortValue,
} from "./choose-template.constants";
import { ChooseTemplateGrid } from "./components/choose-template-grid";
import { ChooseTemplateToolbar } from "./components/toolbar";
import type { ChooseTemplateProps } from "./components/types";
import { useVisibleTemplates } from "./components/use-visible-templates";

export {
  CHOOSE_TEMPLATE_DEFAULT_CANCEL_LABEL,
  CHOOSE_TEMPLATE_DEFAULT_ITEMS,
  CHOOSE_TEMPLATE_DEFAULT_SEARCH_PLACEHOLDER,
  CHOOSE_TEMPLATE_DEFAULT_SELECT_LABEL,
  CHOOSE_TEMPLATE_DEFAULT_SORT_VALUE,
  CHOOSE_TEMPLATE_DEFAULT_TITLE,
  CHOOSE_TEMPLATE_FILTER_TABS,
  CHOOSE_TEMPLATE_MOBILE_DRAWER_SIZE_CLASS,
  CHOOSE_TEMPLATE_SORT_OPTIONS,
  CHOOSE_TEMPLATE_TITLE_ICON_SRC,
  CHOOSE_TEMPLATE_TYPE_TABS,
  CHOOSE_TEMPLATE_TYPE_VARIANTS,
  type ChooseTemplateItem,
  type ChooseTemplateSortValue,
  type ChooseTemplateTypeVariant,
} from "./choose-template.constants";
export type { ChooseTemplateProps } from "./components/types";

export function ChooseTemplate({
  showFilterTabs,
  showTemplateTypeTabs,
  filterByTypeVariant = true,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  contentClassName,
  overlayClassName,
  closeLabel = "Close template picker",
  title = CHOOSE_TEMPLATE_DEFAULT_TITLE,
  titleIconSrc = CHOOSE_TEMPLATE_TITLE_ICON_SRC,
  showMobileHandle = true,
  showSortButton = true,
  templates = CHOOSE_TEMPLATE_DEFAULT_ITEMS,
  selectedTemplateId,
  defaultSelectedTemplateId,
  onTemplateSelect,
  searchValue,
  defaultSearchValue,
  onSearchChange,
  onSearchClear,
  searchPlaceholder = CHOOSE_TEMPLATE_DEFAULT_SEARCH_PLACEHOLDER,
  selectedTypeTab,
  defaultSelectedTypeTab = 0,
  onTypeTabChange,
  selectedFilterTab,
  defaultSelectedFilterTab = 0,
  onFilterTabChange,
  selectedSortValue,
  defaultSelectedSortValue = CHOOSE_TEMPLATE_DEFAULT_SORT_VALUE,
  onSortChange,
  onClose,
  onSortClick,
  getTemplateProps,
  className,
  ...props
}: ChooseTemplateProps) {
  const [internalSelectedTemplateId, setInternalSelectedTemplateId] = React.useState<
    string | undefined
  >(defaultSelectedTemplateId);
  const [internalTypeTab, setInternalTypeTab] = React.useState(defaultSelectedTypeTab);
  const [internalFilterTab, setInternalFilterTab] = React.useState(defaultSelectedFilterTab);
  const [internalSearchValue, setInternalSearchValue] = React.useState(defaultSearchValue ?? "");
  const [internalSortValue, setInternalSortValue] =
    React.useState<ChooseTemplateSortValue>(defaultSelectedSortValue);
  const isDesktop = useIsDesktop();

  const resolvedSelectedTemplateId = selectedTemplateId ?? internalSelectedTemplateId;
  const resolvedTypeTab = selectedTypeTab ?? internalTypeTab;
  const resolvedFilterTab = selectedFilterTab ?? internalFilterTab;
  const resolvedSearchValue = searchValue ?? internalSearchValue;
  const resolvedSortValue = selectedSortValue ?? internalSortValue;

  const visibleTemplates = useVisibleTemplates({
    templates,
    typeTabIndex: resolvedTypeTab,
    filterTabIndex: resolvedFilterTab,
    searchValue: resolvedSearchValue,
    sortValue: resolvedSortValue,
    filterByTypeVariant,
  });

  const handleClose = React.useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleTemplateSelect = (templateId: string, template: ChooseTemplateItem) => {
    if (selectedTemplateId === undefined) setInternalSelectedTemplateId(templateId);
    onTemplateSelect?.(templateId, template);
  };

  const handleSearchChange = (value: string) => {
    if (searchValue === undefined) setInternalSearchValue(value);
    onSearchChange?.(value);
  };

  const handleSearchClear = () => {
    if (searchValue === undefined) setInternalSearchValue("");
    onSearchClear?.();
  };

  const handleTypeTabChange = (index: number) => {
    if (selectedTypeTab === undefined) setInternalTypeTab(index);
    onTypeTabChange?.(index);
  };

  const handleFilterTabChange = (index: number) => {
    if (selectedFilterTab === undefined) setInternalFilterTab(index);
    onFilterTabChange?.(index);
  };

  const handleSortChange = (value: ChooseTemplateSortValue) => {
    if (selectedSortValue === undefined) setInternalSortValue(value);
    onSortChange?.(value);
  };

  return (
    <ModalLayout
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      overlayClassName={overlayClassName}
      title={title}
      titleIconSrc={titleIconSrc}
      showIcon
      showMobileHandle={showMobileHandle}
      closeLabel={closeLabel}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      headerClassName="shrink-0"
      className={cn(
        "border-surface-strong bg-dialog-bg flex h-[min(960px,calc(100vh-1rem))] max-h-[calc(100vh-1rem)] flex-col gap-4 overflow-hidden md:max-w-[min(100%,1240px)] md:rounded-[48px] md:p-8",
        contentClassName,
        CHOOSE_TEMPLATE_MOBILE_DRAWER_SIZE_CLASS,
      )}
    >
      <section
        data-slot="choose-template"
        aria-label={title}
        className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-hidden md:gap-4", className)}
        {...props}
      >
        {showTemplateTypeTabs && !isDesktop && (
          <div
            data-slot="choose-template-type-tabs"
            className="w-full min-w-0 md:w-auto md:max-w-[420px] md:shrink-0"
          >
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
              selected={resolvedTypeTab}
              defaultSelected={defaultSelectedTypeTab}
              onChange={handleTypeTabChange}
            />
          </div>
        )}

        <div
          data-slot="choose-template-scroll"
          className="scrollbar-hidden flex min-h-0 flex-1 flex-col gap-4 overflow-hidden overflow-x-hidden overflow-y-auto rounded-b-[12px] md:gap-4 md:rounded-b-[24px] md:px-0 md:pt-0"
        >
          <ChooseTemplateToolbar
            showFilterTabs={showFilterTabs}
            showTemplateTypeTabs={showTemplateTypeTabs}
            showSortButton={showSortButton}
            searchValue={resolvedSearchValue}
            searchPlaceholder={searchPlaceholder}
            onSearchChange={handleSearchChange}
            onSearchClear={handleSearchClear}
            selectedTypeTab={resolvedTypeTab}
            defaultSelectedTypeTab={defaultSelectedTypeTab}
            onTypeTabChange={handleTypeTabChange}
            selectedFilterTab={selectedFilterTab}
            defaultSelectedFilterTab={defaultSelectedFilterTab}
            onFilterTabChange={handleFilterTabChange}
            selectedSortValue={resolvedSortValue}
            onSortChange={handleSortChange}
            onSortClick={onSortClick}
          />
          <div className="scrollbar-hidden rounded-b-[12px] md:min-h-0 md:flex-1 md:overflow-x-hidden md:overflow-y-auto md:rounded-b-[24px]">
            <ChooseTemplateGrid
              showVideo={true}
              templates={visibleTemplates}
              selectedTemplateId={resolvedSelectedTemplateId}
              getTemplateProps={getTemplateProps}
              onTemplateSelect={handleTemplateSelect}
            />
          </div>
        </div>
      </section>
    </ModalLayout>
  );
}
