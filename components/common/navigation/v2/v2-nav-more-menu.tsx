import * as React from "react";
import { createPortal } from "react-dom";

import type { SideNavItem } from "@/components/common/navigation/side-nav";
import { cn } from "@/lib/utils";

import {
  V2_NAV_MORE_ITEMS,
  V2_NAV_MORE_MENU_WIDTH_CLASS,
  type V2NavItem,
} from "./v2-nav.constants";
import { V2NavItemButton } from "./v2-nav-item";

type V2NavMoreMenuProps = {
  socialItems?: SideNavItem[];
  onItemClick?: (item: V2NavItem) => void;
  className?: string;
};

export function V2NavMoreMenu({ socialItems = [], onItemClick, className }: V2NavMoreMenuProps) {
  return (
    <div
      data-slot="v2-nav-more-menu"
      className={cn(
        "border-surface-strong bg-tooltip-default-bg flex flex-col rounded-2xl border p-1 shadow-[0_0_5px_rgba(0,0,0,0.25)]",
        V2_NAV_MORE_MENU_WIDTH_CLASS,
        className,
      )}
    >
      {V2_NAV_MORE_ITEMS.map((item) => (
        <V2NavItemButton
          key={item.id}
          item={item}
          expanded
          menu
          onClick={() => onItemClick?.(item)}
        />
      ))}
      {socialItems.length > 0 ? (
        <div
          data-slot="v2-nav-more-socials"
          className="text-modal-text mt-2.5 flex items-center justify-between px-3 py-3"
        >
          {socialItems.map((item) => {
            const className =
              "hover:text-cookie-bg focus-visible:ring-border-focus inline-flex size-6 shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none";
            if (item.href) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-label={item.label}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={className}
                >
                  {item.leftIcon}
                </a>
              );
            }
            return (
              <button key={item.id} type="button" aria-label={item.label} className={className}>
                {item.leftIcon}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

type V2NavMorePopoverProps = V2NavMoreMenuProps & {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
};

export function V2NavMorePopover({ open, anchorRef, ...menuProps }: V2NavMorePopoverProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);

  React.useLayoutEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    if (!anchor) return;

    const update = () => {
      const rect = anchor.getBoundingClientRect();
      const rail = anchor.closest("[data-slot='v2-nav']")?.getBoundingClientRect();
      const width = 273;
      const anchorRight = rail?.right ?? rect.right;
      const left = Math.min(anchorRight - 8, window.innerWidth - width - 8);
      setPosition({ top: rect.bottom, left: Math.max(8, left) });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchorRef, open]);

  if (!open || !position || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        transform: "translateY(-100%)",
      }}
      className="z-[90]"
    >
      <V2NavMoreMenu {...menuProps} />
    </div>,
    document.body,
  );
}
