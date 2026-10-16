"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";
import { ClockIcon, GalleryIcon } from "@/public/assets/icons";

import { RIGHT_PANEL_HISTORY_TAB_LABEL, RIGHT_PANEL_MEDIA_TAB_LABEL } from "../constants";
import type { RightPanelTab } from "../types";

const TABS: readonly {
  id: RightPanelTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "media", label: RIGHT_PANEL_MEDIA_TAB_LABEL, icon: GalleryIcon },
  { id: "history", label: RIGHT_PANEL_HISTORY_TAB_LABEL, icon: ClockIcon },
];

export function RightPanelSectionTabs({
  selected,
  onSelect,
}: {
  selected: RightPanelTab;
  onSelect: (tab: RightPanelTab) => void;
}) {
  return (
    <div role="tablist" aria-label="Character panel" className="flex w-full">
      {TABS.map((tab) => {
        const isSelected = selected === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`right-panel-tab-${tab.id}`}
            aria-selected={isSelected}
            aria-controls={`right-panel-tabpanel-${tab.id}`}
            onClick={() => onSelect(tab.id)}
            className={cn(
              "flex min-w-0 flex-1 cursor-pointer flex-col items-center gap-2.5 pt-3 text-sm leading-5 font-medium whitespace-nowrap",
              isSelected
                ? "text-tooltip-text"
                : "border-surface-strong text-divider-label border-b",
            )}
          >
            <span className="inline-flex items-center justify-center gap-2 px-3">
              <span aria-hidden className="inline-flex">
                <Icon className="size-5 shrink-0" />
              </span>
              {tab.label}
            </span>
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
  );
}
