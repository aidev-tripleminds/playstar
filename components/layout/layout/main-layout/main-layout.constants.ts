export const MAIN_LAYOUT_HEADER_HEIGHT_CLASS = "h-[60px]";

/**
 * Above the mobile nav scrim (z-75) and overlay drawer (z-80) so header CTAs
 * stay clickable while the sidebar overlay is open (FRONT-696).
 *
 * Keep this below shared Dialog / Drawer / AlertDialog portals (z-50) by
 * isolating the layout stacking context — do not raise this above the modal layer.
 */
export const MAIN_LAYOUT_HEADER_Z_CLASS = "z-[85]";

/** Contains header/sidebar z-indexes so they do not paint above portaled modals. */
export const MAIN_LAYOUT_STACKING_CLASS = "isolate";

export const MAIN_LAYOUT_SIDEBAR_DESKTOP_BREAKPOINT = 768;

export const MAIN_LAYOUT_MAIN_PADDING_CLASS = "";
