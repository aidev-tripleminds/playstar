"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export const ANCHORED_MENU_Z_CLASSNAME = "z-100";

export const ANCHORED_MENU_VIEWPORT_PADDING = 16;

export type AnchoredMenuPortalProps = {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  menuRef?: React.Ref<HTMLDivElement>;
  verticalDirection?: "up" | "down";
  horizontalAlign?: "left" | "right";
  offset?: number;
  matchAnchorWidth?: boolean;
  className?: string;
  slot?: string;
  children: React.ReactNode;
};

function getAnchoredMenuStyle(
  anchor: HTMLElement,
  verticalDirection: "up" | "down",
  horizontalAlign: "left" | "right",
  offset: number,
  matchAnchorWidth: boolean,
): React.CSSProperties {
  const rect = anchor.getBoundingClientRect();
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  const style: React.CSSProperties = {};

  if (verticalDirection === "up") {
    style.bottom = `${viewportHeight - rect.top + offset}px`;
    const available = rect.top - offset - ANCHORED_MENU_VIEWPORT_PADDING;
    if (available > 0) {
      style.maxHeight = `${available}px`;
    }
  } else {
    style.top = `${rect.bottom + offset}px`;
    const available = viewportHeight - rect.bottom - offset - ANCHORED_MENU_VIEWPORT_PADDING;
    if (available > 0) {
      style.maxHeight = `${available}px`;
    }
  }

  if (horizontalAlign === "right") {
    style.right = `${document.documentElement.clientWidth - rect.right}px`;
  } else {
    style.left = `${rect.left}px`;
  }

  if (matchAnchorWidth) {
    style.width = `${rect.width}px`;
  } else {
    style.minWidth = `${rect.width}px`;
  }

  return style;
}

export function AnchoredMenuPortal({
  open,
  anchorRef,
  menuRef,
  verticalDirection = "up",
  horizontalAlign = "left",
  offset = 8,
  matchAnchorWidth = false,
  className,
  slot,
  children,
}: AnchoredMenuPortalProps) {
  const [style, setStyle] = React.useState<React.CSSProperties | null>(null);

  React.useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      setStyle(
        getAnchoredMenuStyle(anchor, verticalDirection, horizontalAlign, offset, matchAnchorWidth),
      );
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    window.visualViewport?.addEventListener("resize", updatePosition);
    window.visualViewport?.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("scroll", updatePosition);
    };
  }, [open, anchorRef, verticalDirection, horizontalAlign, offset, matchAnchorWidth]);

  if (!open || !style || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={menuRef}
      data-slot={slot}
      className={cn(
        "pointer-events-auto fixed flex min-h-0 flex-col overflow-hidden",
        ANCHORED_MENU_Z_CLASSNAME,
        verticalDirection === "up" ? "bottom-full" : "top-full",
        horizontalAlign === "right" ? "right-0" : "left-0",
        className,
      )}
      style={style}
    >
      {children}
    </div>,
    document.body,
  );
}
