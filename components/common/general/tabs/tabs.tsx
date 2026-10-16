"use client";

import { cn } from "@/lib/utils";

import { CompactTabs } from "./components/compact/compact-tabs";
import { LinesTabs } from "./components/lines-tabs";
import { LinkTabs } from "./components/link-tabs";
import { UnderlinedTabs } from "./components/underlined-tabs";
import { DEFAULT_TABS } from "./tabs.constants";
import type { TabsProps } from "./tabs.types";

export type { Tab } from "./tabs.types";

export default function Tabs({
  variant = "underlined",
  tabs,
  compactLayout = "stack",
  selected,
  defaultSelected = 0,
  onChange,
  onNavigate,
  unstyled = false,
  className,
  scrollArrows = false,
  showTabIcon = true,
  listLabel,
}: TabsProps) {
  const resolvedTabs = tabs ?? DEFAULT_TABS;

  return (
    <div
      className={cn(
        "text-tooltip-text relative w-full overflow-hidden font-[Onest] text-sm",
        !unstyled && "rounded-[5px] p-4",
        className,
      )}
    >
      {variant === "underlined" && <UnderlinedTabs tabs={resolvedTabs} />}
      {variant === "compact" && (
        <CompactTabs
          showTabIcon={showTabIcon}
          tabs={resolvedTabs}
          layout={compactLayout}
          selected={selected}
          defaultSelected={defaultSelected}
          onChange={onChange}
          onNavigate={onNavigate}
          scrollArrows={scrollArrows}
        />
      )}
      {variant === "lines" && <LinesTabs tabs={resolvedTabs} />}
      {variant === "link" && (
        <LinkTabs
          tabs={resolvedTabs}
          selected={selected}
          defaultSelected={defaultSelected}
          onChange={onChange}
          onNavigate={onNavigate}
          showTabIcon={showTabIcon}
          listLabel={listLabel}
        />
      )}
    </div>
  );
}
