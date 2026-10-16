/**
 * Canonical ModalLayout overlay: soft dim + blur when backdrop-filter is supported.
 * Applied by default; pass `overlayClassName` to extend or override via `cn` / tailwind-merge.
 */
export const MODAL_LAYOUT_OVERLAY_CLASSNAME =
  "bg-black/20 supports-backdrop-filter:backdrop-blur-lg";
export const INNER_MODAL_LAYOUT_OVERLAY_CLASSNAME =
  "bg-black/20 supports-backdrop-filter:backdrop-blur-xl";

/** Centered dialog chrome — no drag handle, even padding. */
export const MODAL_LAYOUT_DESKTOP_CLASSNAME = "p-4 md:max-w-[475px]";

/** Figma 23216:187472 desktop fade + scale. Mobile keeps the Vaul sheet. */
export const MODAL_LAYOUT_DESKTOP_MOTION_CLASSNAME = "modal-layout-desktop";
export const MODAL_LAYOUT_DESKTOP_OVERLAY_MOTION_CLASSNAME = "modal-layout-desktop-overlay";

/** Bottom-sheet chrome — top padding leaves room for the drag handle. */
export const MODAL_LAYOUT_MOBILE_CLASSNAME =
  "max-w-[calc(100%-1rem)] px-4 pt-2 pb-4 sm:max-w-[calc(100%-1rem)]";
