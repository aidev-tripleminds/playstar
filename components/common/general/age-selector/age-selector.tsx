"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { AgeArrowIcon } from "@/public/assets/icons";

import {
  AGE_SELECTOR_AGES,
  AGE_SELECTOR_DEFAULT_VALUE,
  AGE_SELECTOR_ITEM_WIDTH_PX,
} from "./age-selector.constants";

/** Same gradient as `.ageSelectorChild`: 270deg, transparent to `#0E0E0E`. */
const ageSelectorFadeClass =
  "bg-[linear-gradient(270deg,rgba(14,14,14,0),#0e0e0e)] pointer-events-none absolute top-1 h-[52px] w-20";

/** Half a cell, so the first and last ages can sit in the center of the row. */
const ageSelectorSpacerStyle = {
  width: `calc(50% - ${AGE_SELECTOR_ITEM_WIDTH_PX / 2}px)`,
} as const;

/** How long a drag or wheel gesture can pause before the centered age is chosen. */
const AGE_SELECTOR_SCROLL_SETTLE_MS = 160;

/** Desktop click / keyboard selection. Matches the number scale and color transition. */
const AGE_SELECTOR_SLIDE_MS = 300;
const AGE_SELECTOR_DESKTOP_QUERY = "(min-width: 768px)";

const ageSelectorItemMotionClass =
  "transition-[opacity,background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

type AgeSelectorScrollBehavior = ScrollBehavior | "instant" | "slide";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function prefersReducedScroll(): AgeSelectorScrollBehavior {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "smooth";
  }

  return prefersReducedMotion() ? "instant" : "smooth";
}

/** Clicking an age slides the row on desktop. Narrow screens and reduced motion jump. */
function selectionScrollBehavior(): AgeSelectorScrollBehavior {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "instant";
  }

  if (prefersReducedMotion() || !window.matchMedia(AGE_SELECTOR_DESKTOP_QUERY).matches) {
    return "instant";
  }

  return "slide";
}

function ageSelectorSlideEase(progress: number) {
  const t = Math.min(1, Math.max(0, progress));
  return 1 - Math.pow(1 - t, 3);
}

function ageSelectorDistance(ages: readonly number[], age: number, highlightedAge: number) {
  const highlightedIndex = ages.indexOf(highlightedAge);
  const ageIndex = ages.indexOf(age);
  if (highlightedIndex < 0 || ageIndex < 0) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.abs(ageIndex - highlightedIndex);
}

function readCenteredAge(
  scroller: HTMLDivElement,
  itemRefs: Map<number, HTMLButtonElement>,
  ages: readonly number[],
) {
  const center = scroller.scrollLeft + scroller.clientWidth / 2;
  let closestAge: number | undefined;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const age of ages) {
    const item = itemRefs.get(age);
    if (!item) {
      continue;
    }

    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    const distance = Math.abs(itemCenter - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestAge = age;
    }
  }

  return closestAge;
}

export type AgeSelectorProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  /** Ages rendered left to right. Defaults to 18–99. */
  ages?: readonly number[];
  /** Controlled selected age. */
  value?: number;
  /** Initial age when uncontrolled. Defaults to 22. */
  defaultValue?: number;
  onValueChange?: (age: number) => void;
  /** Accessible name for the radio group. */
  label?: string;
};

export function AgeSelector({
  ages = AGE_SELECTOR_AGES,
  value,
  defaultValue = AGE_SELECTOR_DEFAULT_VALUE,
  onValueChange,
  label = "Age",
  className,
  onKeyDown,
  ...props
}: AgeSelectorProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selectedValue = isControlled ? value : internalValue;
  /** Age sitting in the center while the user is scrolling. Falls back to the committed age. */
  const [centeredAge, setCenteredAge] = React.useState<number | null>(null);
  const [centeredSelection, setCenteredSelection] = React.useState(selectedValue);
  if (centeredSelection !== selectedValue) {
    setCenteredSelection(selectedValue);
    setCenteredAge(null);
  }
  const highlightedAge = centeredAge ?? selectedValue;
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef(new Map<number, HTMLButtonElement>());
  const programmaticScrollRef = React.useRef(false);
  const programmaticTimerRef = React.useRef<number | undefined>(undefined);
  const slideFrameRef = React.useRef(0);
  /** Inline `scroll-behavior` captured while a desktop selection slide is running. */
  const slideScrollBehaviorRef = React.useRef<string | null>(null);
  /** Age already centered without animation. Later changes still slide into place. */
  const placedAgeRef = React.useRef<number | null>(null);

  const selectAge = React.useCallback(
    (age: number) => {
      if (!isControlled) {
        setInternalValue(age);
      }
      onValueChange?.(age);
    },
    [isControlled, onValueChange],
  );

  const stopSlide = React.useCallback(() => {
    cancelAnimationFrame(slideFrameRef.current);
    slideFrameRef.current = 0;
    const scroller = scrollerRef.current;
    if (!scroller || slideScrollBehaviorRef.current === null) {
      return;
    }

    scroller.style.scrollBehavior = slideScrollBehaviorRef.current;
    slideScrollBehaviorRef.current = null;
  }, []);

  const releaseProgrammaticScroll = React.useCallback(() => {
    programmaticScrollRef.current = false;
    window.clearTimeout(programmaticTimerRef.current);
    stopSlide();
  }, [stopSlide]);

  const scrollToAge = React.useCallback(
    (age: number, behavior: AgeSelectorScrollBehavior) => {
      const scroller = scrollerRef.current;
      const item = itemRefs.current.get(age);
      if (!scroller || !item) {
        return;
      }

      const left = Math.max(0, item.offsetLeft - (scroller.clientWidth - item.offsetWidth) / 2);
      const distance = Math.abs(scroller.scrollLeft - left);
      if (distance > 1) {
        programmaticScrollRef.current = true;
        window.clearTimeout(programmaticTimerRef.current);
        const holdMs =
          behavior === "slide" ? AGE_SELECTOR_SLIDE_MS + 80 : behavior === "smooth" ? 1000 : 50;
        programmaticTimerRef.current = window.setTimeout(() => {
          programmaticScrollRef.current = false;
        }, holdMs);
      }

      if (behavior === "slide" && distance > 1) {
        stopSlide();
        slideScrollBehaviorRef.current = scroller.style.scrollBehavior;
        scroller.style.scrollBehavior = "auto";
        const from = scroller.scrollLeft;
        const delta = left - from;
        const startedAt = performance.now();

        const step = (now: number) => {
          const progress = Math.min(1, (now - startedAt) / AGE_SELECTOR_SLIDE_MS);
          scroller.scrollLeft = from + delta * ageSelectorSlideEase(progress);
          if (progress < 1) {
            slideFrameRef.current = requestAnimationFrame(step);
            return;
          }

          slideFrameRef.current = 0;
          scroller.style.scrollBehavior = slideScrollBehaviorRef.current ?? "";
          slideScrollBehaviorRef.current = null;
        };

        slideFrameRef.current = requestAnimationFrame(step);
        return;
      }

      stopSlide();

      // `scroll-smooth` turns `behavior: "auto"` into an animation. Assigning
      // scrollLeft while that style is forced off jumps before the modal paints.
      if (behavior === "instant" || behavior === "slide") {
        const previous = scroller.style.scrollBehavior;
        scroller.style.scrollBehavior = "auto";
        scroller.scrollLeft = left;
        scroller.style.scrollBehavior = previous;
        return;
      }

      scroller.scrollTo?.({ left, behavior });
    },
    [stopSlide],
  );

  React.useLayoutEffect(() => {
    if (placedAgeRef.current !== null && placedAgeRef.current !== selectedValue) {
      return;
    }

    scrollToAge(selectedValue, "instant");
    placedAgeRef.current = selectedValue;
  }, [scrollToAge, selectedValue]);

  React.useEffect(() => {
    if (placedAgeRef.current !== selectedValue) {
      scrollToAge(selectedValue, selectionScrollBehavior());
      placedAgeRef.current = selectedValue;
    } else {
      scrollToAge(selectedValue, "instant");
    }

    const scroller = scrollerRef.current;
    if (!scroller || typeof ResizeObserver === "undefined") {
      return () => stopSlide();
    }

    // The first observation is the current size. Recenter only when the width
    // actually changes, so that notice does not cancel a selection slide.
    let lastWidth: number | null = null;
    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? scroller.clientWidth;
      if (lastWidth === null || Math.abs(nextWidth - lastWidth) < 1) {
        lastWidth = nextWidth;
        return;
      }

      lastWidth = nextWidth;
      scrollToAge(selectedValue, "instant");
    });
    observer.observe(scroller);
    return () => {
      observer.disconnect();
      stopSlide();
    };
  }, [scrollToAge, selectedValue, stopSlide]);

  React.useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    let settleTimer: number | undefined;
    let rollbackFrame = 0;
    let didSettle = false;

    const settle = () => {
      if (programmaticScrollRef.current || slideFrameRef.current !== 0 || didSettle) {
        return;
      }

      didSettle = true;
      window.clearTimeout(settleTimer);
      const next = readCenteredAge(scroller, itemRefs.current, ages);
      if (next === undefined) {
        return;
      }

      const behavior = prefersReducedScroll();
      scrollToAge(next, behavior);

      if (next === selectedValue) {
        setCenteredAge(null);
        return;
      }

      selectAge(next);
      if (!isControlled) {
        return;
      }

      setCenteredAge(next);
      rollbackFrame = requestAnimationFrame(() => {
        if (selectedValue === next) {
          return;
        }

        setCenteredAge(null);
        scrollToAge(selectedValue, behavior);
      });
    };

    const onScroll = () => {
      if (slideFrameRef.current !== 0) {
        return;
      }

      if (programmaticScrollRef.current) {
        window.clearTimeout(programmaticTimerRef.current);
        programmaticTimerRef.current = window.setTimeout(() => {
          programmaticScrollRef.current = false;
        }, AGE_SELECTOR_SCROLL_SETTLE_MS);
        return;
      }

      didSettle = false;

      const next = readCenteredAge(scroller, itemRefs.current, ages);
      if (next !== undefined) {
        setCenteredAge((current) => (current === next ? current : next));
      }

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, AGE_SELECTOR_SCROLL_SETTLE_MS);
    };

    const onScrollEnd = () => {
      if (slideFrameRef.current !== 0) {
        return;
      }

      window.clearTimeout(settleTimer);
      if (programmaticScrollRef.current) {
        programmaticScrollRef.current = false;
        window.clearTimeout(programmaticTimerRef.current);
        return;
      }

      settle();
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    scroller.addEventListener("scrollend", onScrollEnd);
    scroller.addEventListener("pointerdown", releaseProgrammaticScroll);
    scroller.addEventListener("wheel", releaseProgrammaticScroll, { passive: true });

    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(programmaticTimerRef.current);
      cancelAnimationFrame(rollbackFrame);
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("scrollend", onScrollEnd);
      scroller.removeEventListener("pointerdown", releaseProgrammaticScroll);
      scroller.removeEventListener("wheel", releaseProgrammaticScroll);
    };
  }, [ages, isControlled, releaseProgrammaticScroll, scrollToAge, selectAge, selectedValue]);

  const moveSelection = (direction: 1 | -1) => {
    const index = ages.indexOf(selectedValue);
    if (index < 0) {
      return;
    }

    const nextAge = ages[index + direction];
    if (nextAge === undefined) {
      return;
    }

    selectAge(nextAge);
    itemRefs.current.get(nextAge)?.focus();
  };

  return (
    <div
      data-slot="age-selector"
      data-value={selectedValue}
      role="radiogroup"
      aria-label={label}
      aria-orientation="horizontal"
      className={cn(
        "relative isolate flex w-full max-w-full min-w-0 items-center overflow-hidden text-center font-sans text-2xl leading-7 text-[#fafafa]",
        className,
      )}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) {
          return;
        }

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          event.preventDefault();
          moveSelection(1);
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          event.preventDefault();
          moveSelection(-1);
        }
      }}
      {...props}
    >
      <div
        aria-hidden
        data-slot="age-selector-indicator"
        className="pointer-events-none absolute top-1 left-1/2 z-0 w-20 -translate-x-1/2 rounded-[80px] bg-[#3A1026] px-2.5 py-3"
      >
        <span className="invisible text-2xl leading-7 font-bold">0</span>
      </div>
      <AgeArrowIcon
        data-slot="age-selector-pointer"
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 z-[2] -translate-x-1/2"
      />
      <div
        ref={scrollerRef}
        data-slot="age-selector-scroller"
        className="scrollbar-hidden relative z-[1] flex w-full min-w-0 touch-pan-x items-center overflow-x-auto scroll-smooth pt-1 motion-reduce:scroll-auto"
      >
        <div
          aria-hidden
          data-slot="age-selector-spacer"
          className="shrink-0"
          style={ageSelectorSpacerStyle}
        />
        {ages.map((age) => {
          const selected = age === selectedValue;
          const highlighted = age === highlightedAge;
          const distance = ageSelectorDistance(ages, age, highlightedAge);
          return (
            <button
              key={age}
              ref={(node) => {
                if (node) {
                  itemRefs.current.set(age, node);
                  return;
                }
                itemRefs.current.delete(age);
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={String(age)}
              tabIndex={selected ? 0 : -1}
              data-selected={selected ? "true" : "false"}
              onClick={() => selectAge(age)}
              className={cn(
                "relative box-border flex w-20 shrink-0 cursor-pointer items-center justify-center bg-transparent px-2.5 py-3",
                "text-2xl leading-7 font-bold text-[#fafafa]",
                "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none",
                ageSelectorItemMotionClass,
                highlighted
                  ? "scale-100"
                  : distance <= 1
                    ? "scale-95 opacity-80"
                    : "scale-[0.92] opacity-30",
              )}
            >
              <span
                className={cn(
                  "relative shrink-0 leading-7 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  highlighted ? "text-[#f6339a]" : "text-[#fafafa]",
                )}
              >
                {age}
              </span>
            </button>
          );
        })}
        <div
          aria-hidden
          data-slot="age-selector-spacer"
          className="shrink-0"
          style={ageSelectorSpacerStyle}
        />
      </div>

      <div
        aria-hidden
        data-slot="age-selector-fade"
        data-side="start"
        className={cn(ageSelectorFadeClass, "left-0 z-[9]")}
      />
      <div
        aria-hidden
        data-slot="age-selector-fade"
        data-side="end"
        className={cn(ageSelectorFadeClass, "right-0 z-10 rotate-180")}
      />
    </div>
  );
}
