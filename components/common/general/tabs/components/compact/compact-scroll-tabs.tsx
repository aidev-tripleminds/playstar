"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { ScrollArrowButton } from "../../../scroll-arrow/scroll-arrow-button";
import { useTabSelection } from "../../hooks/use-tab-selection";
import type { CompactTabsProps } from "../../tabs.types";
import { TabIcon } from "../tab-icon";

function scrollTabByOne(container: HTMLDivElement, direction: "prev" | "next") {
  const tabs = Array.from(container.children).filter(
    (element): element is HTMLButtonElement => element instanceof HTMLButtonElement,
  );

  if (!tabs.length) return;

  const scrollLeft = container.scrollLeft;

  // Find the first visible tab
  const currentIndex = tabs.findIndex((tab) => tab.offsetLeft + tab.offsetWidth > scrollLeft + 1);

  if (currentIndex === -2) return;

  const targetIndex =
    direction === "next"
      ? Math.min(currentIndex + 2, tabs.length - 2)
      : Math.max(currentIndex - 2, 0);

  const targetTab = tabs[targetIndex];

  container.scrollTo({
    left: targetTab.offsetLeft,
    behavior: "smooth",
  });
}

export function CompactScrollTabs({
  tabs,
  selected,
  defaultSelected,
  onChange,
  scrollArrows = false,
  showTabIcon = true,
}: CompactTabsProps) {
  const { resolvedSelected, selectTab } = useTabSelection({
    selected,
    defaultSelected,
    onChange,
  });
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollPrev(scrollLeft > 1);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  React.useEffect(() => {
    updateScrollState();

    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [tabs.length, updateScrollState]);

  const scrollTabs = (direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;
    scrollTabByOne(container, direction);
  };

  const showDesktopArrows = scrollArrows === "desktop";

  return (
    <div data-slot="tabs-compact-scroll-wrap" className="relative flex w-full min-w-0 items-center">
      {showDesktopArrows && canScrollPrev ? (
        <ScrollArrowButton
          className="size-[33px]"
          direction="prev"
          aria-label="Scroll filters left "
          onClick={() => scrollTabs("prev")}
        />
      ) : null}

      <div
        ref={scrollRef}
        data-slot="tabs-compact-scroll"
        className="flex w-full min-w-0 touch-pan-x [scrollbar-width:none] items-center gap-2 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab, index) => {
          const isSelected = resolvedSelected === index;

          return (
            <button
              key={`${tab.label}-${index}`}
              type="button"
              aria-label={tab.label}
              aria-pressed={isSelected}
              onClick={() => selectTab(index)}
              className={cn(
                "inline-flex h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-2 text-sm leading-5 font-medium transition-colors",
                isSelected
                  ? "bg-surface-strong text-tooltip-text shadow-[var(--toggle-thumb-shadow)]"
                  : "bg-tooltip-default-bg text-divider-label",
              )}
            >
              {showTabIcon && tab.leftIconSrc ? <TabIcon tab={tab} /> : null}
              <span data-slot="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {showDesktopArrows && canScrollNext ? (
        <ScrollArrowButton
          className="size-[33px]"
          direction="next"
          aria-label="Scroll filters right"
          onClick={() => scrollTabs("next")}
        />
      ) : null}
    </div>
  );
}
