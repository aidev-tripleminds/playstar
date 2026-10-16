"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { OptionList } from "@/components/common/general/option-list/option-list";
import { cn } from "@/lib/utils";
import { MoreVerticalIcon } from "@/public/assets/icons";

import { dotOptionMenuItems } from "./constants";
import type { DotOptionProps } from "./types";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 768px)").matches;
  });

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

export { dotOptionMenuItems } from "./constants";
export type { DotOptionProps } from "./types";

type MenuPosition = {
  top: number;
  left?: number;
  right?: number;
};

function getMenuPosition(trigger: HTMLElement, align: "left" | "right"): MenuPosition {
  const rect = trigger.getBoundingClientRect();
  const top = rect.bottom + 8;

  if (align === "right") {
    return {
      top,
      right: document.documentElement.clientWidth - rect.right,
    };
  }

  return {
    top,
    left: rect.left,
  };
}

export function DotOption({
  items = dotOptionMenuItems,
  menuOpen: menuOpenProp,
  defaultMenuOpen = false,
  onMenuOpenChange,
  onItemClick,
  onTriggerClick,
  ariaLabel = "More options",
  align = "right",
  className,
  btnClassName,
  menuClassName,
  enableMobileMenu = false,
}: DotOptionProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const canShowInlineMenu = isDesktop || enableMobileMenu;

  const [internalMenuOpen, setInternalMenuOpen] = React.useState(defaultMenuOpen);
  const [menuPosition, setMenuPosition] = React.useState<MenuPosition | null>(null);

  const menuOpen = canShowInlineMenu && (menuOpenProp ?? internalMenuOpen);

  const updatePosition = React.useCallback(() => {
    const trigger = containerRef.current;
    if (!trigger) return;
    setMenuPosition(getMenuPosition(trigger, align));
  }, [align]);

  const setMenuOpen = React.useCallback(
    (open: boolean) => {
      if (open && canShowInlineMenu) {
        updatePosition();
      }

      if (menuOpenProp === undefined) {
        setInternalMenuOpen(open);
      }

      onMenuOpenChange?.(open);
    },
    [canShowInlineMenu, menuOpenProp, onMenuOpenChange, updatePosition],
  );

  const handleTriggerClick = React.useCallback(() => {
    onTriggerClick?.();

    if (!canShowInlineMenu) {
      setMenuOpen(false);
      return;
    }

    setMenuOpen(!menuOpen);
  }, [canShowInlineMenu, menuOpen, onTriggerClick, setMenuOpen]);

  React.useEffect(() => {
    if (!menuOpen || !canShowInlineMenu) {
      return;
    }

    // Defer measurement for controlled/default-open mounts (ref is ready after paint).
    const frameId = window.requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [canShowInlineMenu, menuOpen, updatePosition]);

  React.useEffect(() => {
    if (!menuOpen || !canShowInlineMenu) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [canShowInlineMenu, menuOpen, setMenuOpen]);

  return (
    <div ref={containerRef} data-slot="dot-option" className={cn("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        onClick={handleTriggerClick}
        className={cn(
          "text-cookie-bg flex cursor-pointer items-center justify-center rounded-full p-1 transition-colors",
          "hover:bg-tooltip-default-bg hover:text-cookie-bg",
          menuOpen && "bg-surface-strong text-cookie-bg",
          btnClassName,
        )}
      >
        <MoreVerticalIcon className="rotate-90" />
      </button>

      {menuOpen && menuPosition && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={menuRef}
              data-slot="dot-option-menu"
              className="pointer-events-auto fixed z-100 w-max"
              style={{
                top: menuPosition.top,
                left: menuPosition.left,
                right: menuPosition.right,
              }}
            >
              <OptionList
                variant="menu"
                items={items}
                className={cn("min-w-[144px]", menuClassName)}
                onItemClick={(value) => {
                  onItemClick?.(value);
                  setMenuOpen(false);
                }}
              />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
