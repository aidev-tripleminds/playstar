"use client";

import { Badge } from "../../../badge/badge";
import { useTabSelection } from "../../hooks/use-tab-selection";
import type { CompactTabsProps } from "../../tabs.types";
import { TabIcon } from "../tab-icon";

export function CompactStackTabs({ tabs, selected, defaultSelected, onChange }: CompactTabsProps) {
  const { resolvedSelected, selectTab } = useTabSelection({
    selected,
    defaultSelected,
    onChange,
  });

  return (
    <div className="flex flex-col items-center gap-5">
      {tabs.map((tab, index) => {
        const isSelected = resolvedSelected === index;
        const showBadge = tab.showBadge ?? true;

        return (
          <div
            key={index}
            onClick={() => selectTab(index)}
            className={`relative isolate flex min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-[1000px] px-3 py-2 transition-all duration-200 ${isSelected ? "bg-surface-strong text-tooltip-text shadow-[var(--toggle-thumb-shadow)]" : "bg-tooltip-default-bg text-select-muted-text"}`}
          >
            {showBadge ? (
              <span className="absolute -top-4 left-1/2 z-2 flex -translate-x-1/2 items-center justify-center rounded-[20px] px-1.5 py-1">
                <Badge showIcon={false} size={"small"} />
              </span>
            ) : null}
            <TabIcon tab={tab} />
            <span className="relative z-1 shrink-0 leading-5 font-medium">{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}
