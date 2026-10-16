"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

import { LogoTopBar, type LogoTopBarGenderOption } from "./logo-top-bar";
import {
  SIDE_NAV_LOGO_TRANSITION_CLASS,
  SIDE_NAV_TOGGLE_ICON_OPEN_CLASS,
  SIDE_NAV_TOGGLE_ICON_SRC,
} from "./side-nav/side-nav.constants";

const logoExpandVariants = cva(
  "inline-flex w-full items-center justify-between gap-5  border-surface-strong bg-dialog-bg px-0 pt-[6px] pb-[18px]",
  {
    variants: {
      status: {
        default: "",
      },
      mode: {
        desktop: "",
        mobile: "",
        responsive: "",
      },
    },
    defaultVariants: {
      status: "default",
      mode: "responsive",
    },
  },
);

export type LogoExpandProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof logoExpandVariants> & {
    label?: string;
    expanded?: boolean;
    defaultExpanded?: boolean;
    onMobileMenuClick?: React.MouseEventHandler<HTMLButtonElement>;
    onExpandedChange?: (expanded: boolean) => void;
    onToggleClick?: React.MouseEventHandler<HTMLButtonElement>;
    selectedOption?: LogoTopBarGenderOption;
    onOptionChange?: (value: LogoTopBarGenderOption) => void;
  };

export function LogoExpand({
  status = "default",
  mode = "responsive",
  className,
  label = "Logo expand",
  expanded: expandedControlled,
  defaultExpanded = true,
  onExpandedChange,
  onToggleClick,
  onMobileMenuClick,
  selectedOption,
  onOptionChange,
  ...props
}: LogoExpandProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded);
  const isExpandedControlled = expandedControlled !== undefined;
  const expanded = isExpandedControlled ? expandedControlled : internalExpanded;

  const showDesktop = mode !== "mobile";
  const showMobile = mode !== "desktop";

  const desktopClass = mode === "responsive" ? "hidden md:flex items-center" : "flex items-center";

  const mobileClass = mode === "responsive" ? "flex md:hidden items-center" : "flex items-center";

  const handleToggleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const nextExpanded = !expanded;

    if (!isExpandedControlled) {
      setInternalExpanded(nextExpanded);
    }

    onExpandedChange?.(nextExpanded);
    onToggleClick?.(event);
  };

  return (
    <div
      className={cn(
        logoExpandVariants({ status, mode }),
        "text-[1rem]",
        SIDE_NAV_LOGO_TRANSITION_CLASS,
        expanded ? "gap-5" : "justify-end gap-0",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-flex min-w-0 items-center gap-2 overflow-hidden",
          SIDE_NAV_LOGO_TRANSITION_CLASS,
          expanded
            ? "max-w-[220px] flex-1 overflow-visible opacity-100"
            : "pointer-events-none max-w-0 flex-none overflow-hidden opacity-0",
        )}
      >
        {expanded ? (
          <LogoTopBar
            mode={mode}
            selectedOption={selectedOption}
            onOptionChange={onOptionChange}
            onMobileMenuClick={onMobileMenuClick}
          />
        ) : null}
      </span>

      {showDesktop ? (
        <button
          type="button"
          aria-label={label}
          aria-expanded={expanded}
          className={cn(
            desktopClass,
            "text-tooltip-text shrink-0 cursor-pointer rounded-full transition-colors",
            "focus-visible:ring-border-focus focus-visible:ring-2 focus-visible:outline-none",
          )}
          onClick={handleToggleClick}
        >
          <Image
            src={SIDE_NAV_TOGGLE_ICON_SRC}
            alt=""
            aria-hidden
            width={24}
            height={24}
            className={cn(
              "h-[1.5em] w-[1.5em] object-contain",
              expanded && SIDE_NAV_TOGGLE_ICON_OPEN_CLASS,
            )}
          />
        </button>
      ) : null}

      {showMobile ? <div className={mobileClass} /> : null}
    </div>
  );
}
