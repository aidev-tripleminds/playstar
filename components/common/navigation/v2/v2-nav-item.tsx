import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { cn } from "@/lib/utils";

import { V2NavExternalIcon, type V2NavItem, v2NavItemLabel } from "./v2-nav.constants";

type V2NavItemButtonProps = {
  item: V2NavItem;
  expanded: boolean;
  active?: boolean;
  badgeCount?: number;
  ariaExpanded?: boolean;
  /** More-menu rows are #D4D4D4. The rail stays #A3A3A3. */
  menu?: boolean;
  onClick?: () => void;
};

export function V2NavItemButton({
  item,
  expanded,
  active = false,
  badgeCount,
  ariaExpanded,
  menu = false,
  onClick,
}: V2NavItemButtonProps) {
  const label = v2NavItemLabel(item, expanded);
  const isTokens = item.tone === "tokens";
  const isPremium = item.tone === "premium";
  const showBadge = typeof badgeCount === "number" && badgeCount > 0;

  const className = cn(
    "group relative flex w-full cursor-pointer transition-colors",
    menu ? "text-modal-text" : "text-divider-label",
    "focus-visible:ring-border-focus focus-visible:ring-2 focus-visible:outline-none",
    expanded
      ? "flex-row items-center gap-2 rounded-[28px] px-3 py-3 text-sm leading-5 font-medium"
      : "flex-col items-center overflow-visible rounded-[20px] px-2 py-3 text-xs leading-4 font-medium",
    // Active matches the collapsed rail: light text, no fill, including while hovered.
    active && "bg-transparent text-white hover:bg-transparent",
    !active && !isTokens && !isPremium && "hover:bg-surface-strong hover:text-cookie-bg",
    isTokens && "bg-btn-bg hover:bg-btn-bg",
    isPremium &&
      "bg-[image:var(--gradient-premium-20)] text-cookie-bg hover:bg-[image:var(--gradient-premium-20)] hover:text-cookie-bg",
  );

  const inner = (
    <>
      <span className="relative size-6 shrink-0">
        {item.renderIcon()}
        {showBadge ? (
          <span
            data-slot="v2-nav-badge"
            className="bg-brand-primary absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-medium text-white"
          >
            {badgeCount}
          </span>
        ) : null}
      </span>
      <span
        className={cn(
          expanded ? "min-w-0 flex-1 truncate text-left" : "pt-1.5 text-center",
          isTokens && "text-tokens-gradient",
          isPremium && "text-premium-gold",
        )}
      >
        {label}
      </span>
      {item.badgeText ? (
        <Badge
          type="rose"
          size={expanded ? "medium" : "small"}
          text={item.badgeText}
          showIcon={false}
          aria-hidden
          data-slot="v2-nav-static-badge"
          className={cn(!expanded && "absolute -top-2 left-6")}
        />
      ) : null}
      {expanded && item.showExternalIcon ? <V2NavExternalIcon /> : null}
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        data-slot="v2-nav-item"
        data-item-id={item.id}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={className}
        aria-current={active ? "page" : undefined}
        aria-expanded={ariaExpanded}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      data-slot="v2-nav-item"
      data-item-id={item.id}
      className={className}
      aria-current={active ? "page" : undefined}
      aria-expanded={ariaExpanded}
      onClick={onClick}
    >
      {inner}
    </button>
  );
}
