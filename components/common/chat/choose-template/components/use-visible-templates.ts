import * as React from "react";

import {
  CHOOSE_TEMPLATE_FILTER_TABS,
  CHOOSE_TEMPLATE_TYPE_VARIANTS,
  type ChooseTemplateItem,
  type ChooseTemplateSortValue,
  type ChooseTemplateTypeVariant,
} from "../choose-template.constants";

function resolveTypeVariant(typeTabIndex: number): ChooseTemplateTypeVariant {
  return CHOOSE_TEMPLATE_TYPE_VARIANTS[typeTabIndex] ?? "characters";
}

function sortTemplates(
  templates: ChooseTemplateItem[],
  sortValue: ChooseTemplateSortValue,
  originalOrder: Map<string, number>,
) {
  const sorted = [...templates];

  switch (sortValue) {
    case "newest":
      return sorted.sort((a, b) => (originalOrder.get(b.id) ?? 0) - (originalOrder.get(a.id) ?? 0));
    case "oldest":
      return sorted.sort((a, b) => (originalOrder.get(a.id) ?? 0) - (originalOrder.get(b.id) ?? 0));
    case "name-asc":
      return sorted.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    case "name-desc":
      return sorted.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
    default:
      return sorted;
  }
}

export function useVisibleTemplates({
  templates,
  typeTabIndex,
  filterTabIndex,
  searchValue,
  sortValue = "newest",
  filterByTypeVariant = true,
}: {
  templates: ChooseTemplateItem[];
  typeTabIndex: number;
  filterTabIndex: number;
  searchValue: string;
  sortValue?: ChooseTemplateSortValue;
  filterByTypeVariant?: boolean;
}) {
  const activeTypeVariant = resolveTypeVariant(typeTabIndex);
  const activeFilterLabel = CHOOSE_TEMPLATE_FILTER_TABS[filterTabIndex];

  const originalOrder = React.useMemo(
    () => new Map(templates.map((template, index) => [template.id, index])),
    [templates],
  );

  return React.useMemo(() => {
    const filtered = templates.filter((template) => {
      const variant = template.variant ?? "characters";
      if (filterByTypeVariant && variant !== activeTypeVariant) return false;

      if (
        activeFilterLabel !== "All" &&
        template.filterTag &&
        template.filterTag !== activeFilterLabel
      ) {
        return false;
      }

      if (!searchValue.trim()) return true;

      const query = searchValue.trim().toLowerCase();
      const haystack = [template.name, template.description, template.badgeLabel]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    return sortTemplates(filtered, sortValue, originalOrder);
  }, [
    activeFilterLabel,
    activeTypeVariant,
    filterByTypeVariant,
    originalOrder,
    searchValue,
    sortValue,
    templates,
  ]);
}
