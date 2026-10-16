"use client";

import Image from "next/image";
import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { LogoExpand } from "../logo-expand";
import type { LogoTopBarGenderOption } from "../logo-top-bar";
import { NavigationLink } from "../navigation-link";
import {
  findSideNavCreateItem,
  omitSideNavCreateItem,
  omitSideNavDesktopOnlyItems,
  resolveSideNavItemIcon,
  resolveSideNavLinkType,
  SIDE_NAV_COLLAPSED_LINK_HOVER_CLASS,
  SIDE_NAV_COLLAPSED_SECTIONS,
  SIDE_NAV_CREATE_CTA_LABEL,
  SIDE_NAV_CREATE_ICON_SRC,
  SIDE_NAV_CREATE_ITEM_ID,
  SIDE_NAV_DEFAULT_ACTIVE_ITEM_ID,
  SIDE_NAV_DEFAULT_INSTALL_APP_BADGE,
  SIDE_NAV_DEFAULT_INSTALL_APP_LABEL,
  SIDE_NAV_DEFAULT_SECTIONS,
  SIDE_NAV_DEFAULT_SOCIAL_ITEMS,
  SIDE_NAV_EXTERNAL_LINK_ICON_SRC,
  SIDE_NAV_INSTALL_APP_ICON_SRC,
  SIDE_NAV_WIDTH_CLASS_BY_VARIANT,
  type SideNavItem,
  type SideNavSection,
  type SideNavVariant,
} from "./side-nav.constants";

type SideNavInstallBannerProps = {
  label?: string;
  badgeText?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function SideNavInstallBanner({
  label = SIDE_NAV_DEFAULT_INSTALL_APP_LABEL,
  badgeText = SIDE_NAV_DEFAULT_INSTALL_APP_BADGE,
  onClick,
}: SideNavInstallBannerProps) {
  return (
    <button
      type="button"
      data-slot="side-nav-install-banner"
      className="bg-tooltip-default-bg hover:bg-surface-strong flex w-full items-center justify-between gap-2 rounded-2xl p-3 text-left transition-colors"
      onClick={onClick}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Image
          src={SIDE_NAV_INSTALL_APP_ICON_SRC}
          alt=""
          width={20}
          height={20}
          aria-hidden
          className="size-5 shrink-0 object-contain"
        />
        <span className="text-divider-label truncate text-sm leading-5 font-medium">{label}</span>
      </span>
      <Badge
        type="neutral"
        size="medium"
        text={badgeText}
        showIcon={false}
        className="text-bank-foreground bg-[linear-gradient(180deg,var(--color-bank-gradient-start),var(--color-bank-gradient-mid),var(--color-bank-gradient-end))] text-[12px]"
      />
    </button>
  );
}

type SideNavLinkRowProps = {
  item: SideNavItem;
  variant: SideNavVariant;
  showLabels: boolean;
  isActive: boolean;
  onClick?: () => void;
};

function SideNavLinkRow({
  item,
  variant,
  showLabels,
  isActive,
  disabled = false,
  onClick,
}: SideNavLinkRowProps & { disabled?: boolean }) {
  const isCollapsed = variant === "collapsed";
  const isIconOnly = isCollapsed || !showLabels;
  const hasBadge = Boolean(item.badgeText);
  const linkType = resolveSideNavLinkType(item, isActive);
  const leftIcon = resolveSideNavItemIcon(item, isActive);

  return (
    <NavigationLink
      data-slot={item.id === SIDE_NAV_CREATE_ITEM_ID ? "side-nav-create" : undefined}
      type={linkType}
      status={hasBadge && !isIconOnly ? "badge" : isIconOnly ? "collapsed" : "expanded"}
      label={item.label}
      badgeText={item.badgeText}
      tooltipText={item.tooltipText ?? item.label}
      target={!disabled && item.href && item.external ? "_blank" : undefined}
      leftIcon={leftIcon}
      showLeftIcon={item.showLeftIcon}
      rightIcon={item.showExternalIcon ? SIDE_NAV_EXTERNAL_LINK_ICON_SRC : undefined}
      showRightIcon={!isIconOnly && Boolean(item.showExternalIcon)}
      borderRadiusClassName="rounded-[28px]"
      href={disabled ? undefined : item.href}
      className={cn(
        isCollapsed ? "w-full" : "w-full",
        isCollapsed && SIDE_NAV_COLLAPSED_LINK_HOVER_CLASS,
        !isCollapsed && "justify-start",
      )}
      aria-current={isActive ? "page" : undefined}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.();
      }}
    />
  );
}

export type SideNavOverlayPosition = "fixed" | "embedded";

export type SideNavProps = Omit<React.ComponentProps<"aside">, "children"> & {
  variant?: SideNavVariant;
  /** Overlay only: `fixed` for standalone drawer, `embedded` when parent handles slide-in. */
  overlayPosition?: SideNavOverlayPosition;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  sections?: SideNavSection[];
  socialItems?: SideNavItem[];
  activeItemId?: string;
  defaultActiveItemId?: string;
  showInstallBanner?: boolean;
  installAppLabel?: string;
  installAppBadgeText?: string;
  /**
   * When false (default), the rose "Create my AI" CTA sits above APP and on the collapsed rail.
   * When true, that CTA is hidden: expanded/overlay use the default "Create my AI" APP item,
   * and collapsed uses the same default link on the rail (Figma `10394:407779`).
   */
  hasCreatedCharacter?: boolean;
  onItemClick?: (item: SideNavItem) => void;
  onCreateClick?: React.MouseEventHandler<HTMLButtonElement>;
  onToggleClick?: React.MouseEventHandler<HTMLButtonElement>;
  onInstallAppClick?: React.MouseEventHandler<HTMLButtonElement>;
  genderOption?: LogoTopBarGenderOption;
  onGenderOptionChange?: (value: LogoTopBarGenderOption) => void;
  /** When set, every other row stays full color and a click does nothing. */
  enabledItemIds?: readonly string[];
};

export function SideNav({
  variant = "expanded",
  overlayPosition = "fixed",
  expanded: expandedControlled,
  defaultExpanded,
  onExpandedChange,
  sections = SIDE_NAV_DEFAULT_SECTIONS,
  socialItems = SIDE_NAV_DEFAULT_SOCIAL_ITEMS,
  activeItemId,
  defaultActiveItemId = SIDE_NAV_DEFAULT_ACTIVE_ITEM_ID,
  showInstallBanner,
  installAppLabel,
  installAppBadgeText,
  hasCreatedCharacter = false,
  onItemClick,
  onCreateClick,
  onToggleClick,
  onInstallAppClick,
  genderOption,
  onGenderOptionChange,
  enabledItemIds,
  className,
  ...props
}: SideNavProps) {
  const resolvedInstallAppLabel = installAppLabel ?? SIDE_NAV_DEFAULT_INSTALL_APP_LABEL;
  const [internalActiveItemId, setInternalActiveItemId] = React.useState(defaultActiveItemId);
  const isOverlay = variant === "overlay";
  const isExpandedControlled = expandedControlled !== undefined;
  const resolvedDefaultExpanded = defaultExpanded ?? variant !== "collapsed";
  const [internalExpanded, setInternalExpanded] = React.useState(resolvedDefaultExpanded);
  const [lastSyncedVariant, setLastSyncedVariant] = React.useState(variant);

  if (!isExpandedControlled && !isOverlay && lastSyncedVariant !== variant) {
    setLastSyncedVariant(variant);
    setInternalExpanded(variant !== "collapsed");
  }

  const isExpanded = isExpandedControlled ? expandedControlled : internalExpanded;
  const resolvedActiveItemId = activeItemId ?? internalActiveItemId;
  const resolvedVariant: SideNavVariant = isOverlay
    ? "overlay"
    : isExpanded
      ? "expanded"
      : "collapsed";
  const isCollapsed = resolvedVariant === "collapsed";
  const showSectionTitles = !isCollapsed;
  const includesCreateItem = sections.some((section) =>
    section.items.some((item) => item.id === SIDE_NAV_CREATE_ITEM_ID),
  );
  const showRoseCreateCta = !hasCreatedCharacter && includesCreateItem;
  const showCollapsedGreyCreate = isCollapsed && hasCreatedCharacter && includesCreateItem;
  const showCreateCta = showRoseCreateCta || showCollapsedGreyCreate;
  const showCreateAppItem = !isCollapsed && hasCreatedCharacter && includesCreateItem;
  const isItemDisabled = (itemId: string) =>
    enabledItemIds !== undefined && !enabledItemIds.includes(itemId);
  const createItem = findSideNavCreateItem(sections);
  const resolvedShowInstallBanner = showInstallBanner ?? isOverlay;
  // Collapsed rail keeps its layout, but inherits item overrides (e.g. "Get Tokens")
  // from the caller's `sections` so label/badge stay in sync with the expanded nav.
  const sectionsForVariant = isCollapsed
    ? SIDE_NAV_COLLAPSED_SECTIONS.map((section) => ({
        ...section,
        items: section.items.map((item) => {
          const override = sections
            .flatMap((candidate) => candidate.items)
            .find((candidate) => candidate.id === item.id);
          return override ?? item;
        }),
      }))
    : sections;
  const sectionsWithoutCreate = showCreateAppItem
    ? sectionsForVariant
    : omitSideNavCreateItem(sectionsForVariant);
  const resolvedSections = isOverlay
    ? omitSideNavDesktopOnlyItems(sectionsWithoutCreate)
    : sectionsWithoutCreate;
  const resolvedSocialItems = isCollapsed
    ? socialItems.filter((item) => item.showLeftIcon !== false && item.leftIcon != null)
    : socialItems;

  const handleExpandedChange = (nextExpanded: boolean) => {
    if (!isExpandedControlled) {
      setInternalExpanded(nextExpanded);
    }
    onExpandedChange?.(nextExpanded);
  };

  const handleItemClick = (item: SideNavItem) => {
    if (activeItemId === undefined) {
      setInternalActiveItemId(item.id);
    }
    onItemClick?.(item);
  };

  const sectionNodes = resolvedSections.map((section) => (
    <div key={section.id} data-slot="side-nav-section" className="space-y-2">
      {showSectionTitles && section.title ? (
        <p className="text-select-muted-text px-3 text-xs leading-4 font-semibold tracking-wide uppercase">
          {section.title}
        </p>
      ) : null}
      <div className={cn("flex flex-col", isCollapsed ? "items-center gap-3" : "gap-2")}>
        {section.items.map((item) => (
          <SideNavLinkRow
            key={item.id}
            item={item}
            variant={resolvedVariant}
            isActive={item.id === resolvedActiveItemId}
            disabled={isItemDisabled(item.id)}
            onClick={() => handleItemClick(item)}
            showLabels
          />
        ))}
      </div>
    </div>
  ));

  const socialsNode =
    resolvedSocialItems.length > 0 ? (
      <div data-slot="side-nav-socials" className="space-y-2">
        {showSectionTitles ? (
          <p className="text-select-muted-text px-3 text-xs leading-4 font-semibold tracking-wide uppercase">
            SOCIALS
          </p>
        ) : null}
        <div className={cn("flex flex-col", isCollapsed ? "items-center gap-3" : "gap-1")}>
          {resolvedSocialItems.map((item) => (
            <SideNavLinkRow
              key={item.id}
              item={item}
              variant={resolvedVariant}
              isActive={item.id === resolvedActiveItemId}
              disabled={isItemDisabled(item.id)}
              onClick={() => handleItemClick(item)}
              showLabels
            />
          ))}
        </div>
      </div>
    ) : null;

  return (
    <aside
      data-slot="side-nav"
      data-variant={resolvedVariant}
      aria-label="Side navigation"
      className={cn(
        "border-surface-strong bg-dialog-bg flex shrink-0 flex-col gap-4 overflow-hidden",
        isOverlay
          ? SIDE_NAV_WIDTH_CLASS_BY_VARIANT.overlay
          : cn(
              "h-full min-h-0 transition-[width,padding] duration-300 ease-in-out",
              isExpanded
                ? SIDE_NAV_WIDTH_CLASS_BY_VARIANT.expanded
                : SIDE_NAV_WIDTH_CLASS_BY_VARIANT.collapsed,
            ),
        isCollapsed && "items-center",
        !isCollapsed && !isOverlay && "px-4 py-3",
        // Overlay: keep horizontal inset on the shell, but put vertical padding
        // inside the scroller so it sits under the header at rest and scrolls away.
        isOverlay && "px-4",
        isOverlay &&
          overlayPosition === "fixed" &&
          "fixed inset-y-0 top-[61px] left-0 z-[80] shadow-2xl",
        isOverlay && overlayPosition === "embedded" && "h-full min-h-0 w-full shadow-2xl",
        className,
      )}
      {...props}
    >
      {!isOverlay ? (
        <div data-slot="side-nav-header" className="relative z-20 w-full shrink-0 overflow-visible">
          <Separator className="bg-surface-strong absolute -bottom-px -left-5 z-222 mx-auto h-px w-[800px]" />
          <LogoExpand
            mode="desktop"
            className="z-999 items-center justify-center"
            expanded={isExpanded}
            onExpandedChange={handleExpandedChange}
            onToggleClick={onToggleClick}
            selectedOption={genderOption}
            onOptionChange={onGenderOptionChange}
            label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          />
        </div>
      ) : null}

      <div
        data-slot="side-nav-body"
        className={cn(
          "scrollbar-hidden flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain",
          isCollapsed && "px-2",
          !isOverlay && "gap-4",
        )}
      >
        <div
          data-slot="side-nav-scroller"
          className={cn("flex flex-col gap-4", isOverlay ? "py-3" : "contents")}
        >
          {showCreateCta ? (
            showCollapsedGreyCreate ? (
              <SideNavLinkRow
                item={createItem}
                variant={resolvedVariant}
                isActive={createItem.id === resolvedActiveItemId}
                onClick={() => handleItemClick(createItem)}
                showLabels
              />
            ) : (
              <NavigationLink
                data-slot="side-nav-create"
                type="rose"
                status={isCollapsed ? "collapsed" : "expanded"}
                label={SIDE_NAV_CREATE_CTA_LABEL}
                tooltipText={SIDE_NAV_CREATE_CTA_LABEL}
                leftIconSrc={SIDE_NAV_CREATE_ICON_SRC}
                showRightIcon={false}
                className={cn(
                  "shrink-0 justify-center [&_span]:text-center [&>div]:!justify-center [&>div>div:first-child]:justify-center",
                  isCollapsed ? SIDE_NAV_COLLAPSED_LINK_HOVER_CLASS : "w-full",
                )}
                onClick={onCreateClick}
              />
            )
          ) : null}

          {resolvedShowInstallBanner && !isCollapsed ? (
            <div className="shrink-0">
              <SideNavInstallBanner
                label={resolvedInstallAppLabel}
                badgeText={installAppBadgeText}
                onClick={onInstallAppClick}
              />
            </div>
          ) : null}

          <div
            className={cn(
              "flex flex-col",
              isCollapsed ? "min-h-0 flex-1 justify-between gap-4" : "gap-6",
            )}
          >
            {isCollapsed ? (
              <>
                {sectionNodes[0]}
                <div className="flex flex-col items-center gap-4">
                  {sectionNodes.slice(1)}
                  {socialsNode}
                </div>
              </>
            ) : (
              <>
                {sectionNodes}
                {socialsNode}
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
