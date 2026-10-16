"use client";

import * as React from "react";

import { HOVER_CAPABLE_MEDIA_QUERY } from "./constants";

/**
 * `null` until mounted (avoids SSR/client mismatch).
 * `true` = mouse/trackpad — actions revealed on hover.
 * `false` = touch — actions always visible.
 */
export function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(HOVER_CAPABLE_MEDIA_QUERY);
    const update = () => setHoverCapable(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return hoverCapable;
}
