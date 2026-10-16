import { useId } from "react";

import { cn } from "@/lib/utils";

type V2MenuMorphIconProps = {
  open: boolean;
  className?: string;
};

/** Figma widgets (24737:151416): three squares, top-right square rotated into a diamond. */
const WIDGETS_MASK_PATH =
  "M15.4951 9.31648C14.6917 10.1199 13.3891 10.1199 12.5858 9.31647L9.68348 6.4142C8.88009 5.61081 8.88009 4.30826 9.68348 3.50488L12.5858 0.6026C13.3891 -0.200788 14.6917 -0.200787 15.4951 0.602601L18.3974 3.50488C19.2007 4.30826 19.2007 5.61081 18.3974 6.4142L15.4951 9.31648ZM2.0572 8.71393C0.921041 8.71393 0 7.79289 0 6.65673V2.54232C0 1.40616 0.921041 0.48512 2.0572 0.48512H6.17161C7.30777 0.48512 8.22881 1.40616 8.22881 2.54232V6.65673C8.22881 7.79289 7.30777 8.71393 6.17161 8.71393H2.0572ZM12.3432 19C11.2071 19 10.286 18.0789 10.286 16.9427V12.8283C10.286 11.6922 11.2071 10.7711 12.3432 10.7711H16.4576C17.5938 10.7711 18.5148 11.6922 18.5148 12.8283V16.9427C18.5148 18.0789 17.5938 19 16.4576 19H12.3432ZM2.0572 19C0.921041 19 0 18.0789 0 16.9427V12.8283C0 11.6922 0.921041 10.7711 2.0572 10.7711H6.17161C7.30777 10.7711 8.22881 11.6922 8.22881 12.8283V16.9427C8.22881 18.0789 7.30777 19 6.17161 19H2.0572Z";

const WIDGETS_STROKE_PATH =
  "M8.22881 16.9427V12.8283C8.22881 11.6922 7.30777 10.7711 6.17161 10.7711H2.0572C0.921041 10.7711 0 11.6922 0 12.8283V16.9427C0 18.0789 0.921041 19 2.0572 19H6.17161C7.30777 19 8.22881 18.0789 8.22881 16.9427ZM18.5148 16.9427V12.8283C18.5148 11.6922 17.5938 10.7711 16.4576 10.7711H12.3432C11.2071 10.7711 10.286 11.6922 10.286 12.8283V16.9427C10.286 18.0789 11.2071 19 12.3432 19H16.4576C17.5938 19 18.5148 18.0789 18.5148 16.9427ZM8.22881 6.65673V2.54232C8.22881 1.40616 7.30777 0.48512 6.17161 0.48512H2.0572C0.921041 0.48512 0 1.40616 0 2.54232V6.65673C0 7.79289 0.921041 8.71393 2.0572 8.71393H6.17161C7.30777 8.71393 8.22881 7.79289 8.22881 6.65673ZM18.3974 3.50488L15.4951 0.602601C14.6917 -0.200787 13.3891 -0.200788 12.5858 0.6026L9.68348 3.50488C8.88009 4.30826 8.88009 5.61081 9.68348 6.4142L12.5858 9.31648C13.3891 10.1199 14.6917 10.1199 15.4951 9.31648L18.3974 6.4142C19.2007 5.61081 19.2007 4.30826 18.3974 3.50488Z";

/**
 * Bottom-nav Menu control: Figma widgets glyph morphs into the rose close glyph.
 */
export function V2MenuMorphIcon({ open, className }: V2MenuMorphIconProps) {
  const maskId = `v2-menu-widgets-${useId().replaceAll(":", "")}`;

  return (
    <span className={cn("relative size-6 shrink-0", className)} aria-hidden>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn(
          "text-divider-label absolute inset-0 size-6 transition-all duration-300 ease-out",
          open ? "scale-75 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
        )}
      >
        <g transform="translate(3 1.7)">
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <path d={WIDGETS_MASK_PATH} fill="white" />
          </mask>
          <path
            d={WIDGETS_STROKE_PATH}
            stroke="currentColor"
            strokeWidth="3.0858"
            mask={`url(#${maskId})`}
          />
        </g>
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn(
          "text-rose-text absolute inset-0 size-6 transition-all duration-300 ease-out",
          open ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-90 opacity-0",
        )}
      >
        <path
          d="M18.36 19.78L12 13.41L5.64 19.78L4.22 18.36L10.59 12L4.22 5.64L5.64 4.22L12 10.59L18.36 4.23L19.77 5.64L13.41 12L19.77 18.36L18.36 19.78Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
