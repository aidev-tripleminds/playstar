"use client";

import * as React from "react";

/** Downward travel from the expanded position before the prompt collapses. */
export const GENERATE_PROMPT_COMPACT_SCROLL_THRESHOLD_PX = 100;

/**
 * Keyboard dismissal scrolls the page after blur. Ignore that window so
 * leaving the field does not immediately collapse it.
 */
const PROMPT_BLUR_SCROLL_IGNORE_MS = 400;

/** Ignore taps. A real swipe moves further than this before the page scrolls. */
const DRAG_SLOP_PX = 10;

/**
 * Phones often emit the scroll event after the finger has already lifted.
 * Keep a drag armed long enough for that late event, then extend it while
 * momentum scrolls are still arriving.
 */
const DRAG_ARM_MS = 800;
const DRAG_CHAIN_MS = 300;

function isPromptFieldTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest("textarea, input")) &&
    Boolean(target.closest("[data-slot='prompt-box']"))
  );
}

/**
 * Live check, not a sticky flag. Clearing the prompt unmounts the textarea,
 * and iOS often skips blur, which used to leave compact disabled for good.
 */
function isPromptFieldFocused() {
  const active = document.activeElement;
  return active instanceof Element && active.isConnected && isPromptFieldTarget(active);
}

/**
 * Mobile generator prompt: about 100px of downward scrolling, or a successful
 * Generate, collapses the prompt box. Scrolling up does not count and does not
 * restore it. Only an explicit expand (a tap on a compact control) restores
 * the default prompt box, and the next scroll collapse waits for another
 * 100px downward.
 *
 * Scroll distance is taken from the page itself. Phones often report that
 * scroll only after the finger has lifted, so a drag stays armed briefly
 * after touchend. A page scroll with no drag still counts, which is how
 * phones collapse when they omit touch events. The exception is an open
 * prompt field: the keyboard pans the page without a drag, and that pan
 * must not collapse the field. A finger or wheel drag still collapses it,
 * typed text included.
 */
export function useGeneratePromptCompact(enabled: boolean) {
  const [compact, setCompact] = React.useState(false);
  const compactRef = React.useRef(false);
  const lastScrollYRef = React.useRef(0);
  const traveledRef = React.useRef(0);
  const blurTimerRef = React.useRef(0);
  const blurIgnoreUntilRef = React.useRef(0);
  const armUntilRef = React.useRef(0);
  const touchRef = React.useRef<{ y: number; moved: number } | null>(null);
  const [trackedEnabled, setTrackedEnabled] = React.useState(enabled);

  if (enabled !== trackedEnabled) {
    setTrackedEnabled(enabled);
    if (!enabled) setCompact(false);
  }

  React.useEffect(() => {
    if (!enabled) {
      compactRef.current = false;
      armUntilRef.current = 0;
      touchRef.current = null;
      return;
    }

    lastScrollYRef.current = window.scrollY;
    traveledRef.current = 0;

    const rebase = () => {
      lastScrollYRef.current = window.scrollY;
      traveledRef.current = 0;
    };

    const armDrag = () => {
      armUntilRef.current = Date.now() + DRAG_ARM_MS;
    };

    const handleScroll = () => {
      const nextY = window.scrollY;
      const delta = nextY - lastScrollYRef.current;
      lastScrollYRef.current = nextY;
      const dragged = Date.now() < armUntilRef.current;
      if (dragged) {
        armUntilRef.current = Math.max(armUntilRef.current, Date.now() + DRAG_CHAIN_MS);
      }
      if (!dragged && (isPromptFieldFocused() || Date.now() < blurIgnoreUntilRef.current)) return;
      if (compactRef.current || delta <= 0) return;
      traveledRef.current += delta;
      if (traveledRef.current < GENERATE_PROMPT_COMPACT_SCROLL_THRESHOLD_PX) return;
      compactRef.current = true;
      setCompact(true);
    };

    const onTouchStart = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY;
      if (y == null) return;
      touchRef.current = { y, moved: 0 };
    };

    const onTouchMove = (event: TouchEvent) => {
      const point = touchRef.current;
      const y = event.touches[0]?.clientY;
      if (!point || y == null) return;
      point.moved += Math.abs(y - point.y);
      point.y = y;
      if (point.moved >= DRAG_SLOP_PX) armDrag();
    };

    const onTouchEnd = () => {
      if ((touchRef.current?.moved ?? 0) >= DRAG_SLOP_PX) armDrag();
      touchRef.current = null;
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY === 0) return;
      armDrag();
    };

    const onFocusIn = (event: FocusEvent) => {
      if (!isPromptFieldTarget(event.target)) return;
      window.clearTimeout(blurTimerRef.current);
      // The keyboard pan follows focus and is not a drag.
      armUntilRef.current = 0;
      touchRef.current = null;
      rebase();
    };

    const onFocusOut = (event: FocusEvent) => {
      if (!isPromptFieldTarget(event.target)) return;
      window.clearTimeout(blurTimerRef.current);
      blurIgnoreUntilRef.current = Date.now() + PROMPT_BLUR_SCROLL_IGNORE_MS;
      blurTimerRef.current = window.setTimeout(() => {
        if (isPromptFieldFocused()) return;
        rebase();
      }, PROMPT_BLUR_SCROLL_IGNORE_MS);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("focusin", onFocusIn);
    window.addEventListener("focusout", onFocusOut);
    return () => {
      window.clearTimeout(blurTimerRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("focusout", onFocusOut);
    };
  }, [enabled]);

  const expand = React.useCallback(() => {
    compactRef.current = false;
    lastScrollYRef.current = window.scrollY;
    traveledRef.current = 0;
    setCompact(false);
  }, []);

  const collapse = React.useCallback(() => {
    if (!enabled) return;
    compactRef.current = true;
    lastScrollYRef.current = window.scrollY;
    traveledRef.current = 0;
    setCompact(true);
  }, [enabled]);

  return { compact: enabled && compact, expand, collapse };
}
