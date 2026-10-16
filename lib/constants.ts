import type { Point } from "react-easy-crop";

/** Matches profile banner (`816×240` desktop crop). */
export const AI_ADJUST_BANNER_ASPECT = 816 / 240;

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;
export const MIN_ROTATION = 0;
export const MAX_ROTATION = 360;

export const INITIAL_SLIDER_VALUE = 0;
export const INITIAL_CROP: Point = { x: 0, y: 0 };
