"use client";

import * as React from "react";

import {
  TopNavigation,
  type TopNavigationProps,
} from "@/components/common/navigation/top-navigation";
import { MAIN_LAYOUT_HEADER_Z_CLASS } from "@/components/layout/main-layout/main-layout.constants";
import { cn } from "@/lib/utils";

export type AppHeaderProps = TopNavigationProps;

export function AppHeader({ className, variant, ...props }: AppHeaderProps) {
  return (
    <TopNavigation
      aria-label="Application header"
      variant={variant}
      // className={cn("border-surface-strong bg-dialog-bg z-30 shrink-0 border-b", className)}
      className={cn(MAIN_LAYOUT_HEADER_Z_CLASS, "shrink-0", className)}
      {...props}
    />
  );
}
