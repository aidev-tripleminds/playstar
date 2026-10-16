"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { useAuthGate } from "@/components/common/auth/auth-gate";
import type { BottomNavigationTab } from "@/components/common/navigation/bottom-navigation";
import type { LogoTopBarGenderOption } from "@/components/common/navigation/logo-top-bar";
import type { SideNavItem } from "@/components/common/navigation/side-nav";
import { usePreLaunchGate } from "@/components/common/pre-launch";
import { useLeaveRetention } from "@/components/common/pricing-modals/use-leave-retention";
import { useExploreAwareHref } from "@/hooks/use-explore-nav-route";
import { recordInAppRoute } from "@/lib/in-app-route-history";
import { isPreLaunchLockedRoute } from "@/lib/pre-launch";
import {
  isCreateRoute,
  isExploreContentRoute,
  resolveActiveBottomNavTab,
  resolveActiveSideNavItemId,
  resolveBottomNavItemRoute,
  resolveSideNavItemRoute,
  ROUTES,
} from "@/lib/routes";

export function useMainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { requireAuth } = useAuthGate();
  const { requestLeave } = useLeaveRetention();
  // "Explore" means `/` for a logged-out visitor, who would otherwise be
  // redirected there anyway (BACK-222).
  const resolveExploreAware = useExploreAwareHref();
  const { isLocked, showNotice } = usePreLaunchGate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [sidebarExpanded, setSidebarExpanded] = React.useState(() =>
    isExploreContentRoute(pathname),
  );
  const [bottomNavVisible, setBottomNavVisible] = React.useState(true);
  const [topNavVisible, setTopNavVisible] = React.useState(true);
  const [genderOption, setGenderOption] = React.useState<LogoTopBarGenderOption>("woman");

  // FRONT-605: first landing on Homepage / Explore starts expanded. Leaving for
  // an in-app page (Chat, Generate, My AIs, …) collapses the rail. Skip the
  // initial path so a CMS page hero can still expand on first paint.
  const previousPathnameRef = React.useRef(pathname);
  React.useLayoutEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return;
    }
    previousPathnameRef.current = pathname;
    setSidebarExpanded(isExploreContentRoute(pathname));
  }, [pathname]);

  // Where "back to where you were" goes, independent of modal history entries.
  React.useEffect(() => {
    recordInAppRoute(pathname);
  }, [pathname]);

  const activeItemId = resolveActiveSideNavItemId(pathname);
  const activeBottomNavTab = resolveActiveBottomNavTab(pathname);
  const isCreateActive = isCreateRoute(pathname);

  const navigateTo = React.useCallback(
    (href: string) => {
      // Always close the mobile drawer so the retention modal is visible.
      setMobileSidebarOpen(false);
      // Pre-launch: answer the click where it happened. The gate's route guard
      // would bounce this back anyway, but navigating first would flash the
      // locked page and land the user somewhere they did not click.
      if (isLocked && isPreLaunchLockedRoute(href)) {
        showNotice();
        return;
      }
      if (href === ROUTES.settings || href === ROUTES.profile) {
        const allowed = requireAuth({
          preferModal: "signup",
          onSuccess: () => {
            if (!requestLeave(href)) return;
            router.push(href);
          },
        });
        if (!allowed) return;
      }
      if (!requestLeave(href)) {
        return;
      }
      router.push(href);
    },
    [isLocked, requestLeave, requireAuth, router, showNotice],
  );

  const handleItemClick = React.useCallback(
    (item: SideNavItem) => {
      const href = resolveExploreAware(resolveSideNavItemRoute(item.id));
      if (href) {
        navigateTo(href);
      }
    },
    [navigateTo, resolveExploreAware],
  );

  const handleCreateClick = React.useCallback(() => {
    navigateTo(ROUTES.createAiGirlfriend);
  }, [navigateTo]);

  const handleBottomTabClick = React.useCallback(
    (tab: BottomNavigationTab) => {
      const href = resolveExploreAware(resolveBottomNavItemRoute(tab));
      if (href) {
        navigateTo(href);
      }
    },
    [navigateTo, resolveExploreAware],
  );

  const handleMobileMenuToggle = React.useCallback(() => {
    setMobileSidebarOpen((open) => !open);
  }, []);

  const closeMobileSidebar = React.useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const handleSidebarExpandedChange = React.useCallback((expanded: boolean) => {
    setSidebarExpanded(expanded);
  }, []);

  const handleGenderOptionChange = React.useCallback((value: LogoTopBarGenderOption) => {
    setGenderOption(value);
  }, []);

  return {
    pathname,
    activeItemId,
    activeBottomNavTab,
    isCreateActive,
    mobileSidebarOpen,
    sidebarExpanded,
    setSidebarExpanded: handleSidebarExpandedChange,
    bottomNavVisible,
    setBottomNavVisible,
    topNavVisible,
    setTopNavVisible,
    genderOption,
    navigateTo,
    handleItemClick,
    handleCreateClick,
    handleBottomTabClick,
    handleMobileMenuToggle,
    closeMobileSidebar,
    handleSidebarExpandedChange,
    handleGenderOptionChange,
  };
}
