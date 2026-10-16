"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { LogoTopBar } from "@/components/common/navigation/logo-top-bar";
import {
  SideNav,
  SIDE_NAV_CREATE_ITEM_ID,
  SIDE_NAV_DEFAULT_SECTIONS,
  SIDE_NAV_GET_APP_ITEM_ID,
  SIDE_NAV_OVERLAY_TRANSITION_CLASS,
  SIDE_NAV_OVERLAY_WIDTH_CLASS,
  SIDE_NAV_TRANSITION_CLASS,
} from "@/components/common/navigation/side-nav";
import { resolveActiveSideNavItemId, resolveSideNavItemRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";

const HIDDEN_SIDE_NAV_ITEM_IDS = new Set([SIDE_NAV_CREATE_ITEM_ID, SIDE_NAV_GET_APP_ITEM_ID]);
const ENABLED_SIDE_NAV_ITEM_IDS = ["generate"];

const PLAYSTAR_SIDE_NAV_SECTIONS = SIDE_NAV_DEFAULT_SECTIONS.map((section) => ({
  ...section,
  items: section.items.filter((item) => !HIDDEN_SIDE_NAV_ITEM_IDS.has(item.id)),
})).filter((section) => section.items.length > 0);

export function PlaystarShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const activeItemId = resolveActiveSideNavItemId(pathname) ?? "generate";

  const openItem = (itemId: string) => {
    if (!ENABLED_SIDE_NAV_ITEM_IDS.includes(itemId)) return;
    const href = resolveSideNavItemRoute(itemId);
    setMobileOpen(false);
    if (href) router.push(href);
  };

  return (
    <div
      data-slot="playstar-shell"
      className="bg-dialog-bg text-foreground flex min-h-[100lvh] md:h-dvh md:overflow-hidden"
    >
      <div className="border-surface-strong hidden h-full shrink-0 border-r md:block">
        <SideNav
          variant="expanded"
          expanded={expanded}
          onExpandedChange={setExpanded}
          activeItemId={activeItemId}
          sections={PLAYSTAR_SIDE_NAV_SECTIONS}
          enabledItemIds={ENABLED_SIDE_NAV_ITEM_IDS}
          socialItems={[]}
          showInstallBanner={false}
          hasCreatedCharacter
          onItemClick={(item) => openItem(item.id)}
        />
      </div>

      <button
        type="button"
        aria-label="Close sidebar"
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        className={cn(
          "fixed inset-0 z-[75] md:hidden",
          "transition-opacity",
          SIDE_NAV_TRANSITION_CLASS,
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
      />
      <div
        data-slot="playstar-sidebar-mobile"
        data-open={mobileOpen}
        aria-hidden={!mobileOpen}
        inert={mobileOpen ? undefined : true}
        className={cn(
          "fixed top-[62px] bottom-0 left-0 z-[80] md:hidden",
          SIDE_NAV_OVERLAY_WIDTH_CLASS,
          "max-w-full",
          SIDE_NAV_OVERLAY_TRANSITION_CLASS,
          mobileOpen ? "translate-x-0" : "pointer-events-none -translate-x-full",
        )}
      >
        <SideNav
          variant="overlay"
          overlayPosition="embedded"
          activeItemId={activeItemId}
          sections={PLAYSTAR_SIDE_NAV_SECTIONS}
          enabledItemIds={ENABLED_SIDE_NAV_ITEM_IDS}
          socialItems={[]}
          showInstallBanner={false}
          hasCreatedCharacter
          onItemClick={(item) => openItem(item.id)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col md:min-h-0">
        <header
          data-slot="playstar-header"
          className="border-surface-strong bg-dialog-bg sticky top-0 z-[85] flex h-[62px] shrink-0 items-center border-b px-4"
        >
          <LogoTopBar
            className={cn(expanded && "md:hidden")}
            mobileMenuOpen={mobileOpen}
            onMobileMenuClick={() => setMobileOpen((open) => !open)}
          />
        </header>
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
