"use client";

import * as React from "react";

import {
  SIDE_NAV_DEFAULT_SECTIONS,
  SideNav,
  type SideNavProps,
} from "@/components/common/navigation/side-nav";
import { cn } from "@/lib/utils";

export type AppSidebarProps = SideNavProps;

/**
 * `socialItems` defaults to NONE here, unlike the design-system `SideNav`,
 * whose default is a Storybook fixture of hrefless rows. In the running app the
 * SOCIALS rail is authored in Prismic and arrives from `MainLayout`; showing
 * the fixture instead would put six buttons on screen that go nowhere.
 */

export function AppSidebar({
  className,
  sections = SIDE_NAV_DEFAULT_SECTIONS,
  socialItems = [],
  showInstallBanner = false,
  ...props
}: AppSidebarProps) {
  return (
    <SideNav
      aria-label="Application sidebar"
      sections={sections}
      socialItems={socialItems}
      showInstallBanner={showInstallBanner}
      className={cn("h-full min-h-0", className)}
      {...props}
    />
  );
}
