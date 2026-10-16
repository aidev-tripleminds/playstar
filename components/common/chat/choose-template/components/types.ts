import type * as React from "react";

import type { AiModelProps } from "@/components/common/Prismic/ai-model";

import type { ChooseTemplateItem, ChooseTemplateSortValue } from "../choose-template.constants";

export type ChooseTemplateProps = Omit<React.ComponentProps<"section">, "children"> & {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  showTemplateTypeTabs?: boolean;
  /**
   * When false, templates are not filtered by the characters/images/videos type tab.
   * Useful when type tabs are hidden and the caller supplies a curated list.
   * @default true
   */
  filterByTypeVariant?: boolean;
  showFilterTabs?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
  overlayClassName?: string;
  closeLabel?: string;
  title?: string;
  titleIconSrc?: string;
  showMobileHandle?: boolean;
  showClose?: boolean;
  showSortButton?: boolean;
  templates?: ChooseTemplateItem[];
  selectedTemplateId?: string;
  defaultSelectedTemplateId?: string;
  onTemplateSelect?: (templateId: string, template: ChooseTemplateItem) => void;
  searchValue?: string;
  defaultSearchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  searchPlaceholder?: string;
  selectedTypeTab?: number;
  defaultSelectedTypeTab?: number;
  onTypeTabChange?: (index: number) => void;
  selectedFilterTab?: number;
  defaultSelectedFilterTab?: number;
  onFilterTabChange?: (index: number) => void;
  selectedSortValue?: ChooseTemplateSortValue;
  defaultSelectedSortValue?: ChooseTemplateSortValue;
  onSortChange?: (value: ChooseTemplateSortValue) => void;
  // cancelLabel?: string;
  // selectLabel?: string;
  // onCancel?: () => void;
  // onSelect?: () => void;
  onClose?: () => void;
  onSortClick?: () => void;
  getTemplateProps?: (template: ChooseTemplateItem, index: number) => Partial<AiModelProps>;
};
