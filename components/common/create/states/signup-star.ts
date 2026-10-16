"use client";

import { preload } from "react-dom";

/** Public URL of the signup-card star. The card image is `unoptimized` so this path matches. */
export const SIGNUP_CARD_STAR_SRC = "/assets/action-cards/static-star.png";

/**
 * Warm the star before the signup card mounts. A guest only sees that card
 * after closing the auth modal, and the image is large enough to pop in late.
 */
export function preloadSignupCardStar() {
  preload(SIGNUP_CARD_STAR_SRC, { as: "image", fetchPriority: "high" });
}
