"use client";

import Image from "next/image";
import * as React from "react";
import { createPortal } from "react-dom";

import type { BottomNavigationTab } from "@/components/common/navigation/bottom-navigation";
import { type MobileLinkItem, MobileLinks } from "@/components/common/navigation/mobile-links";
import type { SideNavItem } from "@/components/common/navigation/side-nav";
import { SIDE_NAV_GET_APP_ITEM_ID } from "@/components/common/navigation/side-nav";
import { useMainNavContext } from "@/components/layout/main-layout/main-nav-context";
import {
  HOMEPAGE_BOTTOM_NAV_BLEED_CLASS,
  HOMEPAGE_BOTTOM_NAV_INNER_CLASS,
  HOMEPAGE_BOTTOM_NAV_WRAPPER_CLASS,
} from "@/components/pages/homepage/_lib/layout.constants";
import { useMobileModalOpen } from "@/hooks/use-mobile-modal-open";
import { cn } from "@/lib/utils";
import {
  DiscordIcon,
  LoveIcon,
  NetworkIcon,
  SettingsOutlineIcon,
  TargetIcon,
} from "@/public/assets/icons";

import { V2MenuMorphIcon } from "./v2-menu-morph-icon";
import { toSideNavItem } from "./v2-nav";
import {
  resolveV2Navigation,
  V2_NAV_DEFAULT_SESSION,
  V2_NAV_MORE_ITEMS,
  V2_NAV_PRIMARY_ITEMS,
  V2_NAV_TOKEN_ITEMS,
  V2_NAV_UPGRADE_LABEL,
  type V2NavBadgeCounts,
  type V2NavItem,
  v2NavLanguageItems,
  type V2NavSession,
  v2NavShowsUpgrade,
  v2NavTokenItems,
  v2NavUsesCompactMobile,
} from "./v2-nav.constants";

type V2InfiniteYearlyMobileNavProps = {
  /** Frontend session. The menu variation is `resolveV2Navigation(session)`. */
  session?: V2NavSession;
  show: boolean;
  activeTab?: BottomNavigationTab;
  onTabClick?: (tab: BottomNavigationTab) => void;
  tokenBalance?: number;
  badges?: V2NavBadgeCounts;
  socialItems?: SideNavItem[];
  /** Same decision as the overlay install banner. False in an installed PWA. */
  showInstallBanner?: boolean;
  onItemClick?: (item: SideNavItem) => void;
  onPlanClick?: () => void;
  /** Controlled menu. The app shell leaves this unset and toggles from the Menu tab. */
  menuOpen?: boolean;
  defaultMenuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  className?: string;
};

function subscribeToClientMount() {
  return () => {};
}

function getClientMountSnapshot() {
  return true;
}

function getClientMountServerSnapshot() {
  return false;
}

const barTabs = ["explore", "chat", "create", "generate"] as const;

/** gap-1.5 on the menu grid. */
const MENU_GRID_GAP_PX = 6;
/** Add a column once a tile is wider than this, so it wraps onto fewer rows. */
const MENU_CARD_MAX_PX = 100;
/** Drop a column once a tile is narrower than this, so it wraps onto another row. */
const MENU_CARD_MIN_PX = 70;
const MENU_COLUMN_MIN = 2;
const MENU_COLUMN_MAX = 8;

/**
 * Keeps menu tiles between 70px and 100px while the sheet is resized.
 * Wider than 100px adds a column. Narrower than 70px removes one.
 * The band between those sizes stays put so a resize does not flicker.
 */
export function resolveV2MobileMenuColumns(width: number, columns: number): number {
  if (width <= 0) return columns;

  const sizeFor = (count: number) => (width - MENU_GRID_GAP_PX * (count - 1)) / count;
  let next = Math.min(MENU_COLUMN_MAX, Math.max(MENU_COLUMN_MIN, columns));
  let size = sizeFor(next);

  while (size > MENU_CARD_MAX_PX && next < MENU_COLUMN_MAX) {
    const candidate = next + 1;
    if (sizeFor(candidate) < MENU_CARD_MIN_PX) break;
    next = candidate;
    size = sizeFor(next);
  }

  while (size < MENU_CARD_MIN_PX && next > MENU_COLUMN_MIN) {
    const candidate = next - 1;
    if (sizeFor(candidate) > MENU_CARD_MAX_PX) break;
    next = candidate;
    size = sizeFor(next);
  }

  return next;
}

function barIcon(tab: (typeof barTabs)[number], active: boolean) {
  const src = {
    explore: active ? "/assets/ai-discover-filled.svg" : "/assets/discover-default.svg",
    chat: active ? "/assets/ai-chat-filled.svg" : "/assets/ai-chat.svg",
    create: active ? "/assets/ai-add-filled.svg" : "/assets/ai-add.svg",
    generate: active ? "/assets/ai-play-filled.svg" : "/assets/play-video.svg",
  }[tab];
  return <Image src={src} alt="" width={24} height={24} />;
}

const barLabels: Record<(typeof barTabs)[number], string> = {
  explore: "Explore",
  chat: "Chat",
  create: "Create",
  generate: "Generate",
};

function findItem(items: V2NavItem[], id: string) {
  return items.find((item) => item.id === id);
}

const UPGRADE_ICON_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M10.18 9.31921C9.35999 8.18921 8.05001 7.44922 6.54001 7.44922C4.03001 7.44922 1.98999 9.48921 1.98999 11.9992C1.98999 14.5092 4.03001 16.5492 6.54001 16.5492C8.23001 16.5492 9.80001 15.6592 10.67 14.2092L12 11.9992L13.32 9.78918C14.19 8.33918 15.76 7.44922 17.45 7.44922C19.96 7.44922 22 9.48921 22 11.9992C22 14.5092 19.96 16.5492 17.45 16.5492C15.95 16.5492 14.64 15.8092 13.81 14.6792" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
)}")`;

/** Infinity mark painted with the same gold as the Upgrade label (Premium/Primary). */
function UpgradeMenuIcon() {
  return (
    <span
      aria-hidden
      data-slot="v2-upgrade-icon"
      className="inline-block size-6 shrink-0 bg-[image:var(--gradient-premium)]"
      style={{
        maskImage: UPGRADE_ICON_MASK,
        WebkitMaskImage: UPGRADE_ICON_MASK,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

/** Figma Crown-outlined (444:1199). Color comes from the tile label (#A3A3A3). */
function MyPlanOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 shrink-0" aria-hidden>
      <path
        d="M12 5.75L8.386 11.75L3 8.25L4.5 18.25H19.5L21 8.25L15.614 11.75L12 5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function V2InfiniteYearlyMobileNav({
  session = V2_NAV_DEFAULT_SESSION,
  show,
  activeTab = "explore",
  onTabClick,
  tokenBalance,
  badges,
  socialItems = [],
  showInstallBanner = true,
  onItemClick,
  onPlanClick,
  menuOpen: menuOpenControlled,
  defaultMenuOpen = false,
  onMenuOpenChange,
  className,
}: V2InfiniteYearlyMobileNavProps) {
  const premium = resolveV2Navigation(session);
  const mounted = React.useSyncExternalStore(
    subscribeToClientMount,
    getClientMountSnapshot,
    getClientMountServerSnapshot,
  );
  const mobileModalOpen = useMobileModalOpen();
  const navContext = useMainNavContext();
  const portalTarget = navContext ? navContext.layoutElement : mounted ? document.body : null;
  const [menuOpenState, setMenuOpenState] = React.useState(defaultMenuOpen);
  const menuOpen = menuOpenControlled ?? menuOpenState;
  const [socialsOpen, setSocialsOpen] = React.useState(false);
  const menuGridRef = React.useRef<HTMLDivElement>(null);
  const [menuColumns, setMenuColumns] = React.useState(4);

  React.useLayoutEffect(() => {
    const grid = menuGridRef.current;
    if (!grid) return;

    const update = () => {
      setMenuColumns((current) => resolveV2MobileMenuColumns(grid.clientWidth, current));
    };

    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [menuOpen, premium, show]);

  const setMenuOpen = React.useCallback(
    (next: boolean) => {
      if (menuOpenControlled === undefined) setMenuOpenState(next);
      onMenuOpenChange?.(next);
    },
    [menuOpenControlled, onMenuOpenChange],
  );

  if (
    !premium ||
    !v2NavUsesCompactMobile(premium) ||
    !show ||
    !mounted ||
    mobileModalOpen ||
    !portalTarget
  ) {
    return null;
  }

  const activate = (item: V2NavItem) => {
    setMenuOpen(false);
    setSocialsOpen(false);
    onItemClick?.(toSideNavItem(item));
  };

  const appItem = findItem(V2_NAV_PRIMARY_ITEMS, SIDE_NAV_GET_APP_ITEM_ID);
  const feedItem = findItem(V2_NAV_PRIMARY_ITEMS, "feed");
  const myAisItem = findItem(V2_NAV_PRIMARY_ITEMS, "my-ais");
  const tokenItems = v2NavTokenItems(premium);
  const tokensItem = findItem(tokenItems, "premium");
  // The sheet shows the coin balance (24748:159132). The free rail's crown stays on the desktop.
  const balanceItem =
    premium === "free" || premium === "premium"
      ? (findItem(V2_NAV_TOKEN_ITEMS, "premium") ?? tokensItem)
      : tokensItem;
  const rewardItem = findItem(tokenItems, "rewards");
  const profileItem = findItem(tokenItems, "profile");
  const languageItem = v2NavLanguageItems(premium)[0];
  const settingsItem = findItem(V2_NAV_MORE_ITEMS, "settings");
  const supportItem = findItem(V2_NAV_MORE_ITEMS, "help");
  const affiliatesItem = findItem(V2_NAV_MORE_ITEMS, "affiliates");
  const balanceLabel = tokenBalance === undefined ? "…" : String(tokenBalance);

  const items: MobileLinkItem[] = [
    ...barTabs.map((tab) => {
      const isActive = tab === activeTab;
      const badgeCount = tab === "explore" ? undefined : badges?.[tab];
      return {
        id: tab,
        label: barLabels[tab],
        variant: isActive ? ("default-selected" as const) : ("default" as const),
        icon: barIcon(tab, isActive),
        className: !isActive ? "text-divider-label" : undefined,
        showBadge: typeof badgeCount === "number" && badgeCount > 0,
        badgeText: badgeCount ? String(badgeCount) : undefined,
        badgePlacement: "icon" as const,
      };
    }),
    {
      id: "menu",
      label: "Menu",
      variant: "default" as const,
      icon: <V2MenuMorphIcon open={menuOpen} />,
      labelClassName: menuOpen ? "text-rose-text" : undefined,
      className: cn("text-divider-label", menuOpen && "bg-surface-strong text-rose-text"),
    },
  ];

  return createPortal(
    <div
      data-slot="v2-mobile-nav"
      data-premium={premium}
      data-open={menuOpen}
      className={cn(HOMEPAGE_BOTTOM_NAV_WRAPPER_CLASS, className)}
    >
      {menuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="pointer-events-auto fixed inset-0 z-[65] cursor-default bg-transparent"
          onClick={() => {
            setMenuOpen(false);
            setSocialsOpen(false);
          }}
        />
      ) : null}
      {menuOpen ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-full z-[69] px-4 pt-6 pb-2">
          <div className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 pointer-events-auto w-full duration-200 ease-out motion-reduce:animate-none">
            <div className="w-full rounded-[32px] bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,0.1))] p-px shadow-[0_-8px_20px_rgba(0,0,0,0.35)]">
              <div
                data-slot="v2-mobile-menu"
                className="bg-tooltip-default-bg flex flex-col items-center gap-3 rounded-[31px] p-3"
              >
                <span aria-hidden className="bg-handle-bg h-[3px] w-[35px] rounded-full" />
                <div
                  ref={menuGridRef}
                  data-slot="v2-mobile-menu-grid"
                  data-columns={menuColumns}
                  className="grid w-full gap-1.5"
                  style={{ gridTemplateColumns: `repeat(${menuColumns}, minmax(0, 1fr))` }}
                >
                  {appItem && showInstallBanner ? (
                    <MenuTile
                      label="Get App"
                      tone="rose"
                      icon={appItem.renderIcon()}
                      onClick={() => activate(appItem)}
                    />
                  ) : null}
                  {v2NavShowsUpgrade(premium) ? (
                    <MenuTile
                      label={V2_NAV_UPGRADE_LABEL}
                      tone="upgrade"
                      labelClassName="text-premium-gradient"
                      icon={<UpgradeMenuIcon />}
                      onClick={() => {
                        setMenuOpen(false);
                        onPlanClick?.();
                      }}
                    />
                  ) : null}
                  {balanceItem ? (
                    <MenuTile
                      label={balanceLabel}
                      ariaLabel={
                        tokenBalance === undefined ? "Get Tokens" : `Get Tokens, ${balanceLabel}`
                      }
                      tone="tokens"
                      badge="Bonus"
                      icon={balanceItem.renderIcon()}
                      onClick={() => activate(balanceItem)}
                    />
                  ) : null}
                  {premium === "infinite-yearly" ? (
                    <MenuTile
                      label="My plan"
                      tone="default"
                      icon={<MyPlanOutlineIcon />}
                      onClick={() => {
                        setMenuOpen(false);
                        onPlanClick?.();
                      }}
                    />
                  ) : null}
                  {rewardItem ? (
                    <MenuTile
                      label="Reward"
                      tone="default"
                      icon={rewardItem.renderIcon()}
                      onClick={() => activate(rewardItem)}
                    />
                  ) : null}
                  {feedItem ? (
                    <MenuTile
                      label="Feed"
                      tone="default"
                      icon={feedItem.renderIcon()}
                      onClick={() => activate(feedItem)}
                    />
                  ) : null}
                  {myAisItem ? (
                    <MenuTile
                      label="My AIs"
                      tone="default"
                      icon={<LoveIcon className="size-6 shrink-0" />}
                      onClick={() => activate(myAisItem)}
                    />
                  ) : null}
                  {profileItem ? (
                    <MenuTile
                      label="Profile"
                      tone="default"
                      icon={profileItem.renderIcon()}
                      onClick={() => activate(profileItem)}
                    />
                  ) : null}
                  {settingsItem ? (
                    <MenuTile
                      label="Settings"
                      tone="default"
                      icon={<SettingsOutlineIcon className="size-6 shrink-0" />}
                      onClick={() => activate(settingsItem)}
                    />
                  ) : null}
                  {socialItems.length > 0 ? (
                    <MenuTile
                      label="Socials"
                      tone="default"
                      icon={<DiscordIcon className="size-6 shrink-0" />}
                      onClick={() => setSocialsOpen((open) => !open)}
                    />
                  ) : null}
                  {languageItem ? (
                    <MenuTile
                      label="English"
                      tone="default"
                      icon={languageItem.renderIcon()}
                      onClick={() => activate(languageItem)}
                    />
                  ) : null}
                  {supportItem ? (
                    <MenuTile
                      label="Support"
                      tone="default"
                      icon={<TargetIcon className="size-6 shrink-0" />}
                      onClick={() => activate(supportItem)}
                    />
                  ) : null}
                  {affiliatesItem ? (
                    <MenuTile
                      label="Affiliates"
                      tone="default"
                      icon={<NetworkIcon size={24} className="size-6 shrink-0" />}
                      href={affiliatesItem.href}
                      external={affiliatesItem.external}
                      onClick={() => {
                        setMenuOpen(false);
                        onItemClick?.(toSideNavItem(affiliatesItem));
                      }}
                    />
                  ) : null}
                </div>
                {socialsOpen && socialItems.length > 0 ? (
                  <div
                    data-slot="v2-mobile-socials"
                    className="mt-3 flex items-center justify-between px-2"
                  >
                    {socialItems.map((item) =>
                      item.href ? (
                        <a
                          key={item.id}
                          href={item.href}
                          aria-label={item.label}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-divider-label inline-flex size-6"
                        >
                          {item.leftIcon}
                        </a>
                      ) : (
                        <span key={item.id} aria-label={item.label} className="inline-flex size-6">
                          {item.leftIcon}
                        </span>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className={cn(HOMEPAGE_BOTTOM_NAV_INNER_CLASS, "overflow-visible px-4 pb-4")}>
        <div className="pointer-events-auto w-full [&_nav]:pointer-events-auto">
          <nav aria-label="Bottom navigation" className="w-full">
            <div className="w-full rounded-[1000px] bg-[linear-gradient(180deg,rgba(255,255,255,0.00),rgba(255,255,255,0.18))] p-[0.8px]">
              <div className="bg-tooltip-default-bg w-full rounded-[1000px] p-1">
                <MobileLinks
                  label="Bottom navigation tabs"
                  className="w-full border-0 px-0 py-0"
                  items={items}
                  selectable={false}
                  onItemClick={(item) => {
                    if (item.id === "menu") {
                      setMenuOpen(!menuOpen);
                      setSocialsOpen(false);
                      return;
                    }
                    setMenuOpen(false);
                    onTabClick?.(item.id as BottomNavigationTab);
                  }}
                />
              </div>
            </div>
          </nav>
        </div>
      </div>
      <div
        aria-hidden
        data-slot="homepage-bottom-nav-bleed"
        className={HOMEPAGE_BOTTOM_NAV_BLEED_CLASS}
      />
    </div>,
    portalTarget,
  );
}

function MenuTile({
  label,
  ariaLabel,
  tone,
  icon,
  badge,
  href,
  external,
  labelClassName,
  onClick,
}: {
  label: string;
  ariaLabel?: string;
  tone: "rose" | "tokens" | "default" | "upgrade";
  icon: React.ReactNode;
  badge?: string;
  href?: string;
  external?: boolean;
  labelClassName?: string;
  onClick?: () => void;
}) {
  const className = cn(
    "relative flex aspect-square flex-col items-center justify-center rounded-[12px] px-2 py-3 text-center text-xs leading-4 font-medium",
    tone === "rose" && "bg-[image:var(--gradient-rose)] text-white",
    tone === "tokens" && "bg-dialog-bg text-white [background-image:var(--gradient-premium-20)]",
    tone === "upgrade" &&
      "bg-[linear-gradient(180deg,rgba(234,179,8,0.15)_0%,rgba(234,179,8,0.5)_100%)]",
    tone === "default" && "text-divider-label bg-[linear-gradient(180deg,#171717_0%,#0e0e0e_100%)]",
  );
  const inner = (
    <>
      {badge ? (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[image:var(--gradient-rose)] px-1.5 py-1 text-[10px] leading-none font-medium text-white shadow-[0_0_4px_rgba(0,0,0,0.15)]">
          {badge}
        </span>
      ) : null}
      {icon}
      <span className={cn("max-w-full truncate pt-1.5", labelClassName)}>{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel ?? label}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type="button" aria-label={ariaLabel ?? label} className={className} onClick={onClick}>
      {inner}
    </button>
  );
}
