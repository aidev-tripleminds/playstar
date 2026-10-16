"use client";

import * as React from "react";

import type { SideNavItem } from "@/components/common/navigation/side-nav";
import { SIDE_NAV_GET_APP_ITEM_ID } from "@/components/common/navigation/side-nav";
import { cn } from "@/lib/utils";

import { toSideNavItem } from "./v2-nav";
import {
  V2_NAV_FREE_LANGUAGE_ITEMS,
  V2_NAV_FREE_PRIMARY_ITEMS,
  V2_NAV_FREE_TOKEN_ITEMS,
  V2_NAV_MORE_ITEMS,
  V2_NAV_PRIMARY_ITEMS,
  type V2NavItem,
} from "./v2-nav.constants";
import { V2NavItemButton } from "./v2-nav-item";
import { V2NavPlanButton } from "./v2-nav-plan-button";

export type V2MobileOverlayProps = {
  activeItemId?: string;
  socialItems?: SideNavItem[];
  /** Same decision as the install banner. False in an installed PWA. */
  showInstallBanner?: boolean;
  onItemClick?: (item: SideNavItem) => void;
  onPlanClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

function OverlayDivider() {
  return (
    <div aria-hidden data-slot="v2-nav-divider" data-full="true" className="-mx-4 py-4">
      <div className="bg-surface-strong h-px w-full" />
    </div>
  );
}

function socialToNavItem(item: SideNavItem): V2NavItem {
  return {
    id: item.id,
    label: item.label,
    href: item.href,
    external: item.external,
    renderIcon: () => item.leftIcon ?? <span className="size-6 shrink-0" />,
  };
}

/**
 * Full-height menu for someone who is not premium (24748:170318).
 * Upgrade, the free rail, Get App, then Settings through the social rows.
 */
export function V2MobileOverlay({
  activeItemId,
  socialItems = [],
  showInstallBanner = true,
  onItemClick,
  onPlanClick,
  className,
}: V2MobileOverlayProps) {
  const appItem = V2_NAV_PRIMARY_ITEMS.find((item) => item.id === SIDE_NAV_GET_APP_ITEM_ID);
  const primaryItems =
    showInstallBanner && appItem
      ? [...V2_NAV_FREE_PRIMARY_ITEMS, appItem]
      : V2_NAV_FREE_PRIMARY_ITEMS;
  const footerItems = [
    ...V2_NAV_FREE_LANGUAGE_ITEMS,
    ...V2_NAV_MORE_ITEMS,
    ...socialItems.map(socialToNavItem),
  ];

  const renderItems = (items: V2NavItem[]) =>
    items.map((item) => (
      <V2NavItemButton
        key={item.id}
        item={item}
        expanded
        active={item.id === activeItemId}
        onClick={() => onItemClick?.(toSideNavItem(item))}
      />
    ));

  return (
    <nav
      data-slot="v2-mobile-overlay"
      aria-label="Menu"
      className={cn(
        "bg-dialog-bg flex h-full min-h-0 flex-col overflow-y-auto overscroll-y-contain px-4 py-3",
        className,
      )}
    >
      <V2NavPlanButton premium="free" onClick={onPlanClick} />
      <div className="mt-4 flex flex-col gap-2">{renderItems(primaryItems)}</div>
      <OverlayDivider />
      <div className="flex flex-col gap-2">{renderItems(V2_NAV_FREE_TOKEN_ITEMS)}</div>
      <OverlayDivider />
      <div className="flex flex-col gap-2">{renderItems(footerItems)}</div>
    </nav>
  );
}
