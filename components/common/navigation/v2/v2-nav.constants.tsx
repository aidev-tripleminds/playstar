import Image from "next/image";
import * as React from "react";

import { LANGUAGE_FEATURE_ENABLED, SIDE_NAV_PREVIEW_LINKS_ENABLED } from "@/lib/feature-flags";
import { ROUTES } from "@/lib/routes";
import {
  AiCreateIcon,
  ArrowUpRightIcon,
  CarouselIcon,
  ChatIcon,
  CrownFilledIcon,
  DiscoverIcon,
  DocumentIcon,
  LoveIcon,
  MobileIcon,
  NetworkIcon,
  PlayVideoIcon,
  ProfileCircleIcon,
  SettingsOutlineIcon,
  TargetIcon,
  TrophyIcon,
} from "@/public/assets/icons";

import { SIDE_NAV_GET_APP_ITEM_ID } from "../side-nav/side-nav.constants";

/** Figma V2-Navigation (node 24748:163906). */
export const V2_NAV_PLAN_LABEL = "My Plan";
export const V2_NAV_UPGRADE_LABEL = "Upgrade";
/** Infinite Monthly uses "Rewards" on the rail (24748:159075 / 24748:159156). Premium stays "Reward" until expanded. */
export const V2_NAV_REWARDS_LABEL = "Rewards";
/** Free rail discount (Collapsed 24748:163907, Expanded 24748:164255). */
export const V2_NAV_PREMIUM_BADGE = "-80%";
/** Not-premium bottom tab (24748:172515). */
export const V2_NAV_BOTTOM_PREMIUM_BADGE = "-85%";
export const V2_NAV_MORE_LABEL = "More";
export const V2_NAV_COLLAPSED_WIDTH_CLASS = "w-[109px]";
export const V2_NAV_EXPANDED_WIDTH_CLASS = "w-[260px]";
/** Live sidebar rail: width and padding ease together (spicestars.ai). */
export const V2_NAV_RAIL_TRANSITION_CLASS =
  "overflow-hidden transition-[width,padding] duration-300 ease-in-out motion-reduce:transition-none motion-reduce:duration-0";
export const V2_NAV_MORE_MENU_WIDTH_CLASS = "w-[273px]";

const V2_NAV_ICON_CLASS = "size-6 shrink-0";

export type V2NavBadgeCounts = Partial<Record<"create" | "generate" | "chat", number>>;

export type V2NavItem = {
  id: string;
  label: string;
  /** Shorter caption on the collapsed rail. Falls back to `label`. */
  collapsedLabel?: string;
  renderIcon: () => React.ReactNode;
  href?: string;
  external?: boolean;
  showExternalIcon?: boolean;
  tone?: "default" | "tokens" | "premium";
  /** Static pill such as the free-plan discount. Count badges stay on `badges`. */
  badgeText?: string;
};

export type V2NavPremium = "infinite-yearly" | "infinite-monthly" | "premium" | "free";

/** Live billing snapshot from the frontend session (`useMe` / `/me`). */
export type V2NavSession = {
  isInfinitePlan: boolean;
  isPremiumPlan?: boolean;
  /** `useMe().isPremium`: an active subscription that is not a known V2 plan. */
  isSubscribed?: boolean;
  interval: string | null | undefined;
  /**
   * False while `/me` is still loading. Omitted means the caller already knows
   * the plan, so Storybook and tests can pass a session without it.
   */
  isResolved?: boolean;
  /** Logged-in free uses the compact menu and the Tokens account list. Guests do not. */
  isLoggedIn?: boolean;
};

/** Used only when a caller omits `session`. The app shell always passes `/me`. */
export const V2_NAV_DEFAULT_SESSION: V2NavSession = {
  isInfinitePlan: true,
  isPremiumPlan: false,
  interval: "yearly",
};

/** Rose Upgrade control. Yearly keeps "My Plan". */
export function v2NavShowsUpgrade(premium: V2NavPremium): boolean {
  return premium === "infinite-monthly" || premium === "premium" || premium === "free";
}

/**
 * Paid plans use the small mobile menu. Not premium keeps the full menu
 * and the Premium tab (24748:170318 / 24748:172515).
 */
export function v2NavUsesCompactMobile(premium: V2NavPremium | null): boolean {
  if (!premium || premium === "free") return false;
  return true;
}

export function resolveV2Navigation(input: V2NavSession): V2NavPremium | null {
  if (input.isResolved === false) return null;
  if (input.isInfinitePlan) {
    if (input.interval === "yearly") return "infinite-yearly";
    if (input.interval === "monthly") return "infinite-monthly";
    return null;
  }
  if (input.isPremiumPlan) return "premium";
  if (input.isSubscribed) return null;
  return "free";
}

export function isInfiniteYearlyNavigation(input: {
  isInfinitePlan: boolean;
  interval: string | null | undefined;
}): boolean {
  return resolveV2Navigation(input) === "infinite-yearly";
}

/**
 * Account menu keeps Language and Redeem Coupon.
 * Yearly 24748:173555, monthly 24748:159075, premium 24748:159070.
 * Guests stay on the shorter menu, so free only opts in when `isLoggedIn`.
 */
export function v2NavShowsInfiniteAccountMenu(
  premium: V2NavPremium | null,
  isLoggedIn = false,
): boolean {
  return (
    premium === "infinite-yearly" ||
    premium === "infinite-monthly" ||
    premium === "premium" ||
    (isLoggedIn && premium === "free")
  );
}

const primaryItems: V2NavItem[] = [
  {
    id: "explore",
    label: "Explore",
    renderIcon: () => <DiscoverIcon className={V2_NAV_ICON_CLASS} />,
  },
  {
    id: "generate",
    label: "Generate",
    renderIcon: () => <PlayVideoIcon className={V2_NAV_ICON_CLASS} />,
  },
  { id: "chat", label: "Chat", renderIcon: () => <ChatIcon className={V2_NAV_ICON_CLASS} /> },
  { id: "feed", label: "Feed", renderIcon: () => <CarouselIcon className={V2_NAV_ICON_CLASS} /> },
  {
    id: "create",
    label: "Create AI",
    renderIcon: () => <AiCreateIcon className={V2_NAV_ICON_CLASS} />,
  },
  { id: "my-ais", label: "My AIs", renderIcon: () => <LoveIcon className={V2_NAV_ICON_CLASS} /> },
  {
    id: SIDE_NAV_GET_APP_ITEM_ID,
    label: "Get SpiceStars App",
    collapsedLabel: "App",
    renderIcon: () => <MobileIcon className={V2_NAV_ICON_CLASS} width={24} height={24} />,
  },
];

const tokenItems: V2NavItem[] = [
  {
    id: "premium",
    label: "Get Tokens",
    tone: "tokens",
    renderIcon: () => (
      <Image
        src="/assets/spice-coin.png"
        alt=""
        width={24}
        height={24}
        aria-hidden
        className={V2_NAV_ICON_CLASS}
      />
    ),
  },
  {
    id: "rewards",
    label: "Reward",
    renderIcon: () => <TrophyIcon className={V2_NAV_ICON_CLASS} width={24} height={24} />,
  },
];

/** FRONT-657: Profile has no route until preview destinations ship. */
const profileItem: V2NavItem = {
  id: "profile",
  label: "Profile",
  renderIcon: () => <ProfileCircleIcon className={V2_NAV_ICON_CLASS} width={24} height={24} />,
};

const visibleProfileItems: V2NavItem[] = SIDE_NAV_PREVIEW_LINKS_ENABLED ? [profileItem] : [];

/** FRONT-657: Feed is a placeholder and Rewards opens the failed-renewal demo. */
function withoutUnfinishedPreviewItems(items: readonly V2NavItem[]): V2NavItem[] {
  if (SIDE_NAV_PREVIEW_LINKS_ENABLED) return [...items];
  return items.filter((item) => item.id !== "feed" && item.id !== "rewards");
}

const languageItem: V2NavItem = {
  id: "language",
  label: "English",
  renderIcon: () => (
    <Image
      src="/assets/flags/United-States.svg"
      alt=""
      width={24}
      height={24}
      unoptimized
      aria-hidden
      className={V2_NAV_ICON_CLASS}
    />
  ),
};

export const V2_NAV_MORE_ITEMS: V2NavItem[] = [
  {
    id: "settings",
    label: "Settings",
    renderIcon: () => <SettingsOutlineIcon className={V2_NAV_ICON_CLASS} />,
  },
  {
    id: "affiliates",
    label: "Affiliates",
    href: ROUTES.affiliates,
    external: true,
    showExternalIcon: true,
    renderIcon: () => <NetworkIcon size={24} className={V2_NAV_ICON_CLASS} />,
  },
  {
    id: "help",
    label: "Support",
    showExternalIcon: true,
    renderIcon: () => <TargetIcon className={V2_NAV_ICON_CLASS} />,
  },
  {
    id: "policies",
    label: "Policies",
    renderIcon: () => <DocumentIcon className={V2_NAV_ICON_CLASS} width={24} height={24} />,
  },
];

export const V2_NAV_PRIMARY_ITEMS = withoutUnfinishedPreviewItems(primaryItems);
export const V2_NAV_TOKEN_ITEMS: V2NavItem[] = withoutUnfinishedPreviewItems([
  ...tokenItems,
  ...visibleProfileItems,
]);
/** Language stays hidden until translations ship (BACK-5). */
export const V2_NAV_LANGUAGE_ITEMS: V2NavItem[] = LANGUAGE_FEATURE_ENABLED ? [languageItem] : [];

function v2NavItemById(items: V2NavItem[], id: string): V2NavItem {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Missing v2 nav item: ${id}`);
  return item;
}

/** Create AI leads. No Get App on the guest rail (Figma Premium=No, 24748:163907). */
export const V2_NAV_FREE_PRIMARY_ITEMS: V2NavItem[] = withoutUnfinishedPreviewItems(
  ["create", "explore", "generate", "chat", "feed", "my-ais"].map((id) =>
    v2NavItemById(primaryItems, id),
  ),
);

export const V2_NAV_FREE_TOKEN_ITEMS: V2NavItem[] = withoutUnfinishedPreviewItems([
  {
    id: "premium",
    label: "Get Premium",
    collapsedLabel: "Premium",
    tone: "premium",
    badgeText: V2_NAV_PREMIUM_BADGE,
    renderIcon: () => (
      <CrownFilledIcon size={24} tone="solid" className={`${V2_NAV_ICON_CLASS} text-[#FFD900]`} />
    ),
  },
  { ...v2NavItemById(tokenItems, "rewards"), label: V2_NAV_REWARDS_LABEL },
  // Logged-in not premium shows Profile (24748:159066 / 24748:159148).
  profileItem,
]);

/** Logged-in not premium shows English (24748:159066), same as the infinite rails. */
export const V2_NAV_FREE_LANGUAGE_ITEMS: V2NavItem[] = [languageItem];

export function v2NavPrimaryItems(premium: V2NavPremium): V2NavItem[] {
  // Premium matches the logged-not-premium rail (24748:159066 / 24748:159148).
  return premium === "free" || premium === "premium"
    ? V2_NAV_FREE_PRIMARY_ITEMS
    : V2_NAV_PRIMARY_ITEMS;
}

export function v2NavTokenItems(premium: V2NavPremium): V2NavItem[] {
  if (premium === "free" || premium === "premium") return V2_NAV_FREE_TOKEN_ITEMS;
  const items =
    premium === "infinite-monthly"
      ? tokenItems.map((item) =>
          item.id === "rewards" ? { ...item, label: V2_NAV_REWARDS_LABEL } : item,
        )
      : tokenItems;
  // Profile sits under the rewards row (yearly 24748:173555, monthly 24748:159075).
  if (premium === "infinite-yearly" || premium === "infinite-monthly") {
    return withoutUnfinishedPreviewItems([...items, profileItem]);
  }
  return V2_NAV_TOKEN_ITEMS;
}

export function v2NavLanguageItems(premium: V2NavPremium): V2NavItem[] {
  if (premium === "free") return V2_NAV_FREE_LANGUAGE_ITEMS;
  if (premium === "infinite-yearly" || premium === "infinite-monthly" || premium === "premium") {
    return [languageItem];
  }
  return V2_NAV_LANGUAGE_ITEMS;
}

export function V2NavExternalIcon() {
  return <ArrowUpRightIcon className={V2_NAV_ICON_CLASS} width={24} height={24} aria-hidden />;
}

export function v2NavItemLabel(item: V2NavItem, expanded: boolean): string {
  if (!expanded && item.collapsedLabel) return item.collapsedLabel;
  return item.label;
}
