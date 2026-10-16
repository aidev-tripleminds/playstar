"use client";

import * as React from "react";

import type { SideNavItem } from "@/components/common/navigation/side-nav";
import { cn } from "@/lib/utils";

import { LogoExpand } from "../logo-expand";
import type { LogoTopBarGenderOption } from "../logo-top-bar";
import {
  resolveV2Navigation,
  V2_NAV_COLLAPSED_WIDTH_CLASS,
  V2_NAV_DEFAULT_SESSION,
  V2_NAV_EXPANDED_WIDTH_CLASS,
  V2_NAV_MORE_ITEMS,
  V2_NAV_MORE_LABEL,
  V2_NAV_RAIL_TRANSITION_CLASS,
  V2_NAV_REWARDS_LABEL,
  type V2NavBadgeCounts,
  type V2NavItem,
  v2NavLanguageItems,
  v2NavPrimaryItems,
  type V2NavSession,
  v2NavShowsUpgrade,
  v2NavTokenItems,
} from "./v2-nav.constants";
import { V2NavItemButton } from "./v2-nav-item";
import { V2NavMorePopover } from "./v2-nav-more-menu";
import { V2NavPlanButton } from "./v2-nav-plan-button";

export type V2NavProps = Omit<React.ComponentProps<"aside">, "children" | "onToggle"> & {
  /** Frontend session. The rail variation is `resolveV2Navigation(session)`. */
  session?: V2NavSession;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  moreOpen?: boolean;
  defaultMoreOpen?: boolean;
  onMoreOpenChange?: (open: boolean) => void;
  activeItemId?: string;
  badges?: V2NavBadgeCounts;
  socialItems?: SideNavItem[];
  onItemClick?: (item: SideNavItem) => void;
  onPlanClick?: React.MouseEventHandler<HTMLButtonElement>;
  onToggleClick?: React.MouseEventHandler<HTMLButtonElement>;
  genderOption?: LogoTopBarGenderOption;
  onGenderOptionChange?: (value: LogoTopBarGenderOption) => void;
};

function V2NavDivider({
  expanded,
  full = false,
  className,
}: {
  expanded: boolean;
  full?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      data-slot="v2-nav-divider"
      data-full={full ? "true" : undefined}
      className={cn(
        "flex shrink-0 justify-center py-4",
        full && (expanded ? "-mx-4 w-[calc(100%+2rem)]" : "-mx-3 w-[calc(100%+1.5rem)]"),
        className,
      )}
    >
      <div className={cn("bg-surface-strong h-px", full || expanded ? "w-full" : "w-6")} />
    </div>
  );
}

function V2NavMoreDots() {
  return (
    <span
      aria-hidden
      data-slot="v2-nav-more-dots"
      className="flex size-6 shrink-0 items-center justify-center gap-1"
    >
      <span className="size-1 rounded-full bg-current" />
      <span className="size-1 rounded-full bg-current" />
      <span className="size-1 rounded-full bg-current" />
    </span>
  );
}

export function toSideNavItem(item: V2NavItem): SideNavItem {
  return {
    id: item.id,
    label: item.label,
    leftIcon: null,
    href: item.href,
    external: item.external,
    showExternalIcon: item.showExternalIcon,
    type: item.tone === "tokens" ? "tokens" : undefined,
  };
}

export function V2Nav({
  session = V2_NAV_DEFAULT_SESSION,
  expanded: expandedControlled,
  defaultExpanded = false,
  onExpandedChange,
  moreOpen: moreOpenControlled,
  defaultMoreOpen = false,
  onMoreOpenChange,
  activeItemId,
  badges,
  socialItems = [],
  onItemClick,
  onPlanClick,
  onToggleClick,
  genderOption,
  onGenderOptionChange,
  className,
  ...props
}: V2NavProps) {
  const premium = resolveV2Navigation(session);
  const [expandedState, setExpandedState] = React.useState(defaultExpanded);
  const [moreOpenState, setMoreOpenState] = React.useState(defaultMoreOpen);
  const moreAnchorRef = React.useRef<HTMLDivElement>(null);
  const expanded = expandedControlled ?? expandedState;
  const moreOpen = moreOpenControlled ?? moreOpenState;

  const setExpanded = (next: boolean) => {
    if (expandedControlled === undefined) setExpandedState(next);
    onExpandedChange?.(next);
  };

  const setMoreOpen = React.useCallback(
    (next: boolean) => {
      if (moreOpenControlled === undefined) setMoreOpenState(next);
      onMoreOpenChange?.(next);
    },
    [moreOpenControlled, onMoreOpenChange],
  );

  React.useEffect(() => {
    if (!moreOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (moreAnchorRef.current?.contains(target)) return;
      if (document.querySelector("[data-slot='v2-nav-more-menu']")?.contains(target)) return;
      setMoreOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [moreOpen, setMoreOpen]);

  const handleItemClick = (item: V2NavItem) => {
    setMoreOpen(false);
    onItemClick?.(toSideNavItem(item));
  };

  const renderItems = (items: V2NavItem[]) =>
    items.map((item) => {
      const displayItem =
        item.id === "rewards" &&
        premium !== null &&
        premium !== "free" &&
        premium !== "premium" &&
        v2NavShowsUpgrade(premium) &&
        expanded
          ? { ...item, label: V2_NAV_REWARDS_LABEL }
          : item;
      return (
        <V2NavItemButton
          key={item.id}
          item={displayItem}
          expanded={expanded}
          active={item.id === activeItemId}
          badgeCount={badges?.[item.id as keyof V2NavBadgeCounts]}
          onClick={() => handleItemClick(item)}
        />
      );
    });

  const moreItem: V2NavItem = {
    id: "more",
    label: V2_NAV_MORE_LABEL,
    renderIcon: () => <V2NavMoreDots />,
  };
  const settingsItem = V2_NAV_MORE_ITEMS.find((item) => item.id === "settings");

  if (!premium) return null;

  const primaryItems = v2NavPrimaryItems(premium);
  const tokenItems = v2NavTokenItems(premium);
  const languageItems = v2NavLanguageItems(premium);

  return (
    <aside
      data-slot="v2-nav"
      data-variant={expanded ? "expanded" : "collapsed"}
      data-premium={premium}
      aria-label="Side navigation"
      className={cn(
        "bg-dialog-bg flex h-full min-h-0 shrink-0 flex-col",
        V2_NAV_RAIL_TRANSITION_CLASS,
        expanded
          ? cn(V2_NAV_EXPANDED_WIDTH_CLASS, "px-4 py-3")
          : cn(V2_NAV_COLLAPSED_WIDTH_CLASS, "p-3"),
        className,
      )}
      {...props}
    >
      <LogoExpand
        mode="desktop"
        className={cn(
          "border-surface-strong shrink-0 border-b",
          expanded ? "-mx-4 w-[calc(100%+2rem)] px-4" : "-mx-3 w-[calc(100%+1.5rem)] px-3",
          !expanded && "justify-center",
        )}
        expanded={expanded}
        onExpandedChange={setExpanded}
        onToggleClick={onToggleClick}
        selectedOption={genderOption}
        onOptionChange={onGenderOptionChange}
        label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      />
      <div
        data-slot="v2-nav-scroller"
        className="scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain pb-2"
      >
        {/* Solid plate, not just the pill. The pill's corners are transparent, so a
            scrolling link was sliced there instead of passing behind My Plan. */}
        <div
          data-slot="v2-nav-plan-frame"
          className="bg-dialog-bg sticky top-0 z-20 w-full shrink-0 pt-4"
        >
          <V2NavPlanButton premium={premium} onClick={onPlanClick} />
        </div>
        <div className={cn("flex flex-col pt-4", expanded ? "gap-2" : "gap-1")}>
          {renderItems(primaryItems)}
        </div>
        <V2NavDivider expanded={expanded} />
        <div className={cn("flex flex-col", expanded ? "gap-2" : "gap-1")}>
          {renderItems(tokenItems)}
        </div>
      </div>
      <div className="flex shrink-0 flex-col">
        <V2NavDivider expanded={expanded} full className="pt-0 pb-2" />
        {languageItems.length > 0 ? (
          <div className={cn("flex flex-col", expanded ? "gap-2" : "gap-1")}>
            {renderItems(languageItems)}
          </div>
        ) : null}
        <div ref={moreAnchorRef} className={cn("flex flex-col", expanded ? "mt-2 gap-2" : "mt-1")}>
          {expanded && (premium === "free" || premium === "premium") && settingsItem ? (
            <V2NavItemButton
              item={settingsItem}
              expanded
              onClick={() => handleItemClick(settingsItem)}
            />
          ) : null}
          <V2NavItemButton
            item={moreItem}
            expanded={expanded}
            active={moreOpen}
            ariaExpanded={moreOpen}
            onClick={() => setMoreOpen(!moreOpen)}
          />
        </div>
      </div>
      <V2NavMorePopover
        open={moreOpen}
        anchorRef={moreAnchorRef}
        socialItems={socialItems}
        onItemClick={handleItemClick}
      />
    </aside>
  );
}
