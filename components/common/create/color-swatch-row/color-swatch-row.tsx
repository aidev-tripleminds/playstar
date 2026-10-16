"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  colorRowRevealDelta,
  colorRowScrollDelta,
  CREATE_AI_GF_COLOR_SWATCH_FADE_CLASS,
  CREATE_AI_GF_COLOR_SWATCH_ROW_CLASS,
  CREATE_AI_GF_COLOR_SWATCH_TRACK_CLASS,
} from "./color-row-scroll";

const SETTLE_MS = 140;

function scrollBehavior(): ScrollBehavior {
  if (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return "auto";
  }
  return "smooth";
}

function swatchButtons(row: HTMLElement): HTMLElement[] {
  return [...row.querySelectorAll<HTMLElement>("button")];
}

export function ColorSwatchRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const [edges, setEdges] = React.useState({ start: false, end: false });
  const directionRef = React.useRef<1 | -1>(1);
  const lastLeftRef = React.useRef(0);
  const adjustingRef = React.useRef(false);
  const interactedRef = React.useRef(false);

  const syncEdges = React.useCallback(() => {
    const row = scrollerRef.current;
    if (!row) {
      return;
    }

    const max = row.scrollWidth - row.clientWidth;
    const start = row.scrollLeft > 1;
    const end = max - row.scrollLeft > 1;
    setEdges((current) =>
      current.start === start && current.end === end ? current : { start, end },
    );
  }, []);

  const reveal = React.useCallback((child: HTMLElement, behavior: ScrollBehavior) => {
    const row = scrollerRef.current;
    if (!row) {
      return;
    }

    const rowRect = row.getBoundingClientRect();
    const rect = child.getBoundingClientRect();
    const delta = colorRowRevealDelta({
      scrollLeft: row.scrollLeft,
      clientWidth: row.clientWidth,
      scrollWidth: row.scrollWidth,
      rowLeft: rowRect.left,
      rowRight: rowRect.right,
      child: { left: rect.left, right: rect.right },
    });
    if (delta === 0) {
      return;
    }

    adjustingRef.current = true;
    row.scrollTo({ left: row.scrollLeft + delta, behavior });
    window.setTimeout(() => {
      adjustingRef.current = false;
    }, 500);
  }, []);

  const alignToTravelEdge = React.useCallback((behavior: ScrollBehavior) => {
    const row = scrollerRef.current;
    if (!row || adjustingRef.current) {
      return;
    }

    const rowRect = row.getBoundingClientRect();
    const delta = colorRowScrollDelta({
      scrollLeft: row.scrollLeft,
      clientWidth: row.clientWidth,
      scrollWidth: row.scrollWidth,
      direction: directionRef.current,
      rowLeft: rowRect.left,
      rowRight: rowRect.right,
      children: swatchButtons(row).map((button) => {
        const rect = button.getBoundingClientRect();
        return { left: rect.left, right: rect.right };
      }),
    });
    if (delta === 0) {
      return;
    }

    adjustingRef.current = true;
    row.scrollTo({ left: row.scrollLeft + delta, behavior });
    window.setTimeout(() => {
      adjustingRef.current = false;
    }, 500);
  }, []);

  React.useLayoutEffect(() => {
    const row = scrollerRef.current;
    const selected = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (selected) {
      reveal(selected, "auto");
    }
    syncEdges();
  }, [reveal, syncEdges]);

  React.useEffect(() => {
    const row = scrollerRef.current;
    if (!row || typeof ResizeObserver === "undefined") {
      return;
    }

    let timer = 0;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        syncEdges();
        const selected = row.querySelector<HTMLElement>('[aria-pressed="true"]');
        if (!selected) {
          return;
        }
        reveal(selected, interactedRef.current ? scrollBehavior() : "auto");
      }, 80);
    });

    observer.observe(row);
    swatchButtons(row).forEach((button) => observer.observe(button));
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [reveal, syncEdges]);

  React.useEffect(() => {
    const row = scrollerRef.current;
    if (!row) {
      return;
    }

    let settleTimer = 0;

    const settle = () => {
      alignToTravelEdge(scrollBehavior());
    };

    const onScroll = () => {
      const delta = row.scrollLeft - lastLeftRef.current;
      if (Math.abs(delta) > 0.5) {
        directionRef.current = delta > 0 ? 1 : -1;
      }
      lastLeftRef.current = row.scrollLeft;
      syncEdges();

      if (adjustingRef.current) {
        return;
      }

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, SETTLE_MS);
    };

    const onScrollEnd = () => {
      adjustingRef.current = false;
    };

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "width" || !interactedRef.current) {
        return;
      }
      const button = (event.target as HTMLElement | null)?.closest("button");
      if (!button || button.getAttribute("aria-pressed") !== "true" || !row.contains(button)) {
        return;
      }
      reveal(button, scrollBehavior());
    };

    row.addEventListener("scroll", onScroll, { passive: true });
    row.addEventListener("scrollend", onScrollEnd);
    row.addEventListener("transitionend", onTransitionEnd);
    return () => {
      window.clearTimeout(settleTimer);
      row.removeEventListener("scroll", onScroll);
      row.removeEventListener("scrollend", onScrollEnd);
      row.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [alignToTravelEdge, reveal, syncEdges]);

  const revealFromEvent = (target: EventTarget | null) => {
    const row = scrollerRef.current;
    const button = target instanceof Element ? target.closest("button") : null;
    if (!row || !button || !row.contains(button)) {
      return;
    }
    interactedRef.current = true;
    reveal(button, scrollBehavior());
  };

  return (
    <div className="relative w-full min-w-0">
      <div
        ref={scrollerRef}
        data-slot="color-swatch-row"
        className={cn(CREATE_AI_GF_COLOR_SWATCH_ROW_CLASS, className)}
        onClick={(event) => revealFromEvent(event.target)}
        onFocus={(event) => revealFromEvent(event.target)}
      >
        <div className={CREATE_AI_GF_COLOR_SWATCH_TRACK_CLASS}>{children}</div>
      </div>
      <div
        aria-hidden
        data-slot="color-swatch-row-fade"
        data-side="start"
        className={cn(CREATE_AI_GF_COLOR_SWATCH_FADE_CLASS, "left-0", !edges.start && "hidden")}
      />
      <div
        aria-hidden
        data-slot="color-swatch-row-fade"
        data-side="end"
        className={cn(
          CREATE_AI_GF_COLOR_SWATCH_FADE_CLASS,
          "right-0 rotate-180",
          !edges.end && "hidden",
        )}
      />
    </div>
  );
}
