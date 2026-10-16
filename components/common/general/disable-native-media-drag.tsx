"use client";

import { useEffect } from "react";

const ALLOW_DRAG_SELECTOR = '[data-allow-drag="true"], [draggable="true"]';
const MEDIA_SELECTOR = "img, picture, svg, video";

/**
 * Blocks the browser's native media drag ghost (image/svg/video preview)
 * across the app. Opt back in with `data-allow-drag="true"` or `draggable="true"`.
 */
export function DisableNativeMediaDrag() {
  useEffect(() => {
    const onDragStart = (event: DragEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(ALLOW_DRAG_SELECTOR)) return;
      if (target.matches(MEDIA_SELECTOR) || target.closest(MEDIA_SELECTOR)) {
        event.preventDefault();
      }
    };

    document.addEventListener("dragstart", onDragStart, { capture: true });
    return () => {
      document.removeEventListener("dragstart", onDragStart, { capture: true });
    };
  }, []);

  return null;
}
