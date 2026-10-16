import * as React from "react";

import type { TabSelectionOptions } from "../tabs.types";

export function useTabSelection({ selected, defaultSelected = 0, onChange }: TabSelectionOptions) {
  const [internalSelected, setInternalSelected] = React.useState(defaultSelected);
  const resolvedSelected = selected ?? internalSelected;

  const selectTab = (index: number) => {
    if (selected === undefined) {
      setInternalSelected(index);
    }
    onChange?.(index);
  };

  return { resolvedSelected, selectTab };
}
