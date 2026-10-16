"use client";

import * as React from "react";

import { Badge } from "../../badge/badge";
import { useTabSelection } from "../hooks/use-tab-selection";
import type { LinkTabsProps } from "../tabs.types";
import { TabIcon } from "./tab-icon";

export function LinkTabs({
  tabs,
  selected,
  defaultSelected,
  onChange,
  onNavigate,
  showTabIcon = true,
  listLabel,
}: LinkTabsProps) {
  const { resolvedSelected, selectTab } = useTabSelection({
    selected,
    defaultSelected,
    onChange,
  });

  return (
    <div role="tablist" aria-label={listLabel} className="flex flex-wrap items-center gap-4">
      {tabs.map((tab, index) => {
        const isSelected = resolvedSelected === index;
        const className = `flex cursor-pointer items-center gap-2 rounded-xl transition-colors duration-200 ${
          isSelected && !tab.disabled ? "text-tooltip-text" : "text-divider-label"
        }`;
        const content = (
          <>
            {showTabIcon ? <TabIcon tab={tab} /> : null}
            <span className="text-base leading-6 font-medium sm:text-[18px] sm:leading-7">
              {tab.label}
            </span>
            {tab.showBadge ? <Badge showIcon={false} size="medium" /> : null}
          </>
        );

        // A tab that has its own URL renders as a real anchor: crawlers follow
        // it, and middle-click / cmd-click / "copy link address" behave as a
        // visitor expects. A PLAIN left click is still a tab switch, not a
        // navigation — `onChange` owns that, so the default is prevented.
        // Modified clicks fall through untouched so the browser can open them.
        if (tab.disabled) {
          return (
            <button
              key={`${tab.label}-${index}`}
              type="button"
              role="tab"
              aria-selected={false}
              onClick={(event) => {
                event.preventDefault();
              }}
              className={className}
            >
              {content}
            </button>
          );
        }

        if (tab.href) {
          return (
            <a
              key={`${tab.label}-${index}`}
              href={tab.href}
              role="tab"
              aria-selected={isSelected}
              onClick={(event) => {
                if (
                  event.defaultPrevented ||
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                ) {
                  // The browser is taking this click and opening another
                  // document. Last word before it does.
                  onNavigate?.(index);
                  return;
                }
                event.preventDefault();
                selectTab(index);
              }}
              // A middle click never reaches `onClick` — browsers dispatch
              // `auxclick` for it — and it is one of the ways a tab is opened.
              onAuxClick={(event) => {
                if (event.button === 1) onNavigate?.(index);
              }}
              className={className}
            >
              {content}
            </a>
          );
        }

        return (
          <button
            key={`${tab.label}-${index}`}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => selectTab(index)}
            className={className}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
