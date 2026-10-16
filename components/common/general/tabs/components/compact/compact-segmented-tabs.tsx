"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { useTabSelection } from "../../hooks/use-tab-selection";
import type { CompactTabsProps } from "../../tabs.types";
import { TabIcon } from "../tab-icon";

export function CompactSegmentedTabs({
  tabs,
  selected,
  defaultSelected,
  onChange,
  onNavigate,
  showTabIcon = true,
}: CompactTabsProps) {
  const { resolvedSelected, selectTab } = useTabSelection({
    selected,
    defaultSelected,
    onChange,
  });
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tabRefs = React.useRef<(HTMLElement | null)[]>([]);
  const [gliderStyle, setGliderStyle] = React.useState<React.CSSProperties>({});

  React.useLayoutEffect(() => {
    const container = containerRef.current;

    const updateGlider = () => {
      const activeTab = tabRefs.current[resolvedSelected];
      if (!container || !activeTab) return;

      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      setGliderStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    };

    updateGlider();

    if (!container) return;

    const resizeObserver = new ResizeObserver(updateGlider);
    resizeObserver.observe(container);

    tabRefs.current.forEach((tab) => {
      if (tab) resizeObserver.observe(tab);
    });

    window.addEventListener("resize", updateGlider);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateGlider);
    };
  }, [resolvedSelected, tabs]);

  return (
    <div
      ref={containerRef}
      className="bg-tooltip-default-bg text-divider-label relative flex w-full items-center rounded-full p-1 text-sm shadow-[var(--select-content-shadow)]"
    >
      <span
        aria-hidden
        className="bg-surface-strong pointer-events-none absolute top-1 bottom-1 z-0 rounded-full shadow-[var(--toggle-thumb-shadow)] transition-[left,width] duration-250 ease-in-out"
        style={gliderStyle}
      />

      {tabs.map((tab, index) => {
        const isSelected = resolvedSelected === index;
        const className = cn(
          "relative z-1 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 transition-colors duration-200",
          isSelected ? "text-tooltip-text" : "text-divider-label",
        );
        const content = (
          <>
            {showTabIcon && <TabIcon tab={tab} />}
            <span className="relative z-1 shrink-0 text-sm leading-5 font-medium">{tab.label}</span>
          </>
        );

        // A tab that names a page is a real anchor, so a crawler can follow it
        // and cmd/middle-click opens it — see the same treatment in
        // `link-tabs.tsx`. A plain click stays the app's own `onChange`.
        if (tab.href) {
          return (
            <a
              key={`${tab.label}-${index}`}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              href={tab.href}
              aria-pressed={isSelected}
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
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            aria-pressed={isSelected}
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
