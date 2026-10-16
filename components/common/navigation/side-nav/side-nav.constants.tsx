import Image from "next/image";
import * as React from "react";

import type { NavigationLinkProps } from "@/components/common/navigation/navigation-link";
import type { FooterLink } from "@/components/common/Prismic/footer/footer.constants";
import {
  FooterSocialIcon,
  hasFooterSocialIcon,
} from "@/components/common/Prismic/footer/footer-social-icon";
import { LANGUAGE_FEATURE_ENABLED, SIDE_NAV_PREVIEW_LINKS_ENABLED } from "@/lib/feature-flags";
import { cn } from "@/lib/utils";
import {
  AiCreateIcon,
  ArrowUpRightIcon,
  CarouselIcon,
  ChatIcon,
  DiscordIcon,
  DiscoverIcon,
  DocumentIcon,
  InstagramIcon,
  LoveIcon,
  MobileIcon,
  NetworkIcon,
  PlayVideoIcon,
  ProfileCircleIcon,
  RedditIcon,
  RedgifsIcon,
  SelectionFillIcon,
  SettingsOutlineIcon,
  StoryBoardIcon,
  TargetIcon,
  TicketIcon,
  TiktokIcon,
  TrophyIcon,
  TwitterIcon,
  UserAIIcon,
} from "@/public/assets/icons";

/** Figma Side Nav (node 49-2660). */
export const SIDE_NAV_COLLAPSED_WIDTH_CLASS = "w-[72px] p-3";
export const SIDE_NAV_EXPANDED_WIDTH_CLASS = "w-[260px]";
export const SIDE_NAV_OVERLAY_WIDTH_CLASS = "w-[100%]";

/** Shared collapse/expand motion — keep logo + rail in sync. */
export const SIDE_NAV_TRANSITION_DURATION_MS = 500;
export const SIDE_NAV_TRANSITION_CLASS =
  "duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none motion-reduce:duration-0";
export const SIDE_NAV_RAIL_TRANSITION_CLASS = cn(
  "transition-[width,padding,gap]",
  SIDE_NAV_TRANSITION_CLASS,
);
export const SIDE_NAV_LOGO_TRANSITION_CLASS = cn(
  "transition-[max-width,opacity,gap]",
  SIDE_NAV_TRANSITION_CLASS,
);
export const SIDE_NAV_OVERLAY_TRANSITION_CLASS = cn(
  "transition-transform",
  SIDE_NAV_TRANSITION_CLASS,
);

export const SIDE_NAV_TOGGLE_ICON_SRC = "/assets/expanded.svg";
/** Horizontal mirror when the sidebar is open — do not rotate, the panel glyph is not symmetric. */
export const SIDE_NAV_TOGGLE_ICON_OPEN_CLASS = "-scale-x-100";
export const SIDE_NAV_CREATE_ICON_SRC = "/assets/ai-add-white.svg";
export const SIDE_NAV_CREATE_ITEM_ID = "create";
export const SIDE_NAV_CREATE_ITEM_LABEL = "Create my AI";
export const SIDE_NAV_CREATE_CTA_LABEL = "Create my AI";
export const SIDE_NAV_INSTALL_APP_ICON_SRC = "/assets/nav-mobile.svg";
/** FRONT-721: desktop expanded APP row. No destination yet — not the mobile Install App banner. */
export const SIDE_NAV_GET_APP_ITEM_ID = "get-spicestars-app";
export const SIDE_NAV_GET_APP_LABEL = "Get Spicestars App";

export const SIDE_NAV_COLLAPSED_LINK_HOVER_CLASS =
  "hover:!bg-tooltip-default-bg hover:!text-base-color hover:[background-image:none]";

export const SIDE_NAV_DEFAULT_ACTIVE_ITEM_ID = "chat";
export const SIDE_NAV_DEFAULT_INSTALL_APP_LABEL = "Install Spicestars App";
export const SIDE_NAV_DEFAULT_INSTALL_APP_BADGE = "Exclusive!";

const SIDE_NAV_ICON_CLASS = "size-6 shrink-0";

export const SIDE_NAV_EXTERNAL_LINK_ICON_SRC = (
  <ArrowUpRightIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} aria-hidden />
);

const createAiModelIcon = <AiCreateIcon className={SIDE_NAV_ICON_CLASS} />;
const exploreIcon = <DiscoverIcon className={SIDE_NAV_ICON_CLASS} />;
const chatIcon = <ChatIcon className={SIDE_NAV_ICON_CLASS} />;
const generateIcon = <PlayVideoIcon className={SIDE_NAV_ICON_CLASS} />;
const feedIcon = <CarouselIcon className={SIDE_NAV_ICON_CLASS} />;
const dreamboothIcon = <SelectionFillIcon className={SIDE_NAV_ICON_CLASS} />;
const storyboardIcon = <StoryBoardIcon className={SIDE_NAV_ICON_CLASS} />;
const myAisIcon = <LoveIcon className={SIDE_NAV_ICON_CLASS} />;
const myAiTwinIcon = <UserAIIcon className={SIDE_NAV_ICON_CLASS} />;
const profileIcon = <ProfileCircleIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} />;
const getSpicestarsAppIcon = <MobileIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} />;
const premiumIcon = (
  <Image
    src="/assets/crown-filled.svg"
    alt=""
    width={24}
    height={24}
    aria-hidden
    className={SIDE_NAV_ICON_CLASS}
  />
);
/** Token icon for paid subscribers (Premium / Infinite) — replaces crown on "Get Tokens". */
export const SIDE_NAV_TOKENS_ICON = (
  <Image
    src="/assets/spice-coin.png"
    alt=""
    width={24}
    height={24}
    aria-hidden
    className={SIDE_NAV_ICON_CLASS}
  />
);
const rewardsIcon = <TrophyIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} />;
const redeemIcon = <TicketIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} />;
const settingsIcon = <SettingsOutlineIcon className={SIDE_NAV_ICON_CLASS} />;
const languageIcon = (
  <Image
    src="/assets/flags/United-States.svg"
    alt=""
    width={24}
    height={24}
    aria-hidden
    className={SIDE_NAV_ICON_CLASS}
  />
);
const affiliatesIcon = <NetworkIcon size={24} className={SIDE_NAV_ICON_CLASS} />;
const helpIcon = <TargetIcon className={SIDE_NAV_ICON_CLASS} />;
const policiesIcon = <DocumentIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} />;
const discordIcon = <DiscordIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} />;
const redditIcon = <RedditIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} />;
const xIcon = <TwitterIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} />;
const instagramIcon = <InstagramIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} />;
const tiktokIcon = <TiktokIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} />;
const redgifsIcon = <RedgifsIcon className={SIDE_NAV_ICON_CLASS} width={24} height={24} />;

export type SideNavVariant = "collapsed" | "expanded" | "overlay";

export type SideNavItem = {
  id: string;
  label: string;
  /** Set for a real destination — renders the row as an `<a>` instead of a button. */
  href?: string;
  /** Opens in a new tab when the row has an `href`. Socials do; in-app rows do not. */
  external?: boolean;
  leftIcon: React.ReactNode;
  showLeftIcon?: boolean;
  activeLeftIcon?: React.ReactNode;
  type?: NavigationLinkProps["type"];
  badgeText?: string;
  tooltipText?: string;
  showExternalIcon?: boolean;
};

export type SideNavSection = {
  id: string;
  title?: string;
  items: SideNavItem[];
};

/** FRONT-657: hide these rows until the destinations ship. */
const SIDE_NAV_PREVIEW_ITEM_IDS = new Set([
  "feed",
  "dreambooth",
  "storyboard",
  "my-ai-twin",
  "profile",
  "rewards",
]);

function isSideNavItemVisible(item: SideNavItem): boolean {
  return SIDE_NAV_PREVIEW_LINKS_ENABLED || !SIDE_NAV_PREVIEW_ITEM_IDS.has(item.id);
}

function withVisibleSideNavItems(sections: SideNavSection[]): SideNavSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter(isSideNavItemVisible),
    }))
    .filter((section) => section.items.length > 0);
}

const SIDE_NAV_ALL_SECTIONS: SideNavSection[] = [
  {
    id: "app",
    title: "APP",
    items: [
      {
        id: SIDE_NAV_CREATE_ITEM_ID,
        label: SIDE_NAV_CREATE_ITEM_LABEL,
        leftIcon: createAiModelIcon,
      },
      {
        id: "explore",
        label: "Explore",
        leftIcon: exploreIcon,
      },
      {
        id: "chat",
        label: "Chat",
        leftIcon: chatIcon,
      },
      {
        id: "generate",
        label: "Generate",
        leftIcon: generateIcon,
      },
      {
        id: "feed",
        label: "Feed",
        leftIcon: feedIcon,
      },
      {
        id: "dreambooth",
        label: "Dreambooth",
        leftIcon: dreamboothIcon,
      },
      {
        id: "storyboard",
        label: "Storyboard",
        leftIcon: storyboardIcon,
      },
      {
        id: "my-ais",
        label: "My AIs",
        leftIcon: myAisIcon,
      },
      {
        id: "my-ai-twin",
        label: "My AI Twin",
        leftIcon: myAiTwinIcon,
      },
      {
        id: "profile",
        label: "Profile",
        leftIcon: profileIcon,
      },
      {
        id: SIDE_NAV_GET_APP_ITEM_ID,
        label: SIDE_NAV_GET_APP_LABEL,
        leftIcon: getSpicestarsAppIcon,
      },
    ],
  },
  {
    id: "tokens",
    title: "TOKENS",
    items: [
      {
        id: "premium",
        label: "Get Premium",
        type: "premium",
        leftIcon: premiumIcon,
        badgeText: "-75%",
      },
      {
        id: "rewards",
        label: "Rewards",
        leftIcon: rewardsIcon,
      },
      {
        id: "redeem",
        label: "Redeem tokens",
        leftIcon: redeemIcon,
      },
    ],
  },
  {
    id: "other",
    title: "OTHER",
    items: [
      { id: "settings", label: "Settings", leftIcon: settingsIcon },
      // Language hidden until translations ship (BACK-5) — restore per BACK-137.
      ...(LANGUAGE_FEATURE_ENABLED
        ? [{ id: "language", label: "English", leftIcon: languageIcon }]
        : []),
      {
        id: "affiliates",
        label: "Affiliates",
        leftIcon: affiliatesIcon,
        showExternalIcon: true,
      },
      {
        id: "help",
        label: "Help",
        leftIcon: helpIcon,
        showExternalIcon: true,
      },
      {
        id: "policies",
        label: "Policies",
        leftIcon: policiesIcon,
      },
    ],
  },
];

export const SIDE_NAV_DEFAULT_SECTIONS: SideNavSection[] =
  withVisibleSideNavItems(SIDE_NAV_ALL_SECTIONS);

export function omitSideNavCreateItem(sections: SideNavSection[]): SideNavSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.id !== SIDE_NAV_CREATE_ITEM_ID),
  }));
}

/** Overlay (mobile) hides desktop-only rows such as Get Spicestars App. */
export function omitSideNavDesktopOnlyItems(sections: SideNavSection[]): SideNavSection[] {
  return sections.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.id !== SIDE_NAV_GET_APP_ITEM_ID),
  }));
}

export function findSideNavCreateItem(sections: SideNavSection[]): SideNavItem {
  for (const section of sections) {
    const item = section.items.find((candidate) => candidate.id === SIDE_NAV_CREATE_ITEM_ID);
    if (item) return item;
  }
  return pickDefaultSideNavItem(SIDE_NAV_CREATE_ITEM_ID);
}

/**
 * Design-system fixture ONLY — Storybook and the side-nav's own tests.
 *
 * These rows carry no `href`, so in the running app they were six buttons that
 * did nothing when clicked. `MainLayout` now passes the real list, built from
 * the Prismic `footer` document by `sideNavSocialItems`, and `AppSidebar`
 * defaults to none — a social with nowhere to go should not be drawn at all.
 */
export const SIDE_NAV_DEFAULT_SOCIAL_ITEMS: SideNavItem[] = [
  { id: "discord", label: "Discord", leftIcon: discordIcon },
  { id: "reddit", label: "Reddit", leftIcon: redditIcon },
  { id: "x", label: "X.com", leftIcon: xIcon },
  { id: "instagram", label: "Instagram", leftIcon: instagramIcon },
  { id: "tiktok", label: "Tiktok", leftIcon: tiktokIcon },
  { id: "redgifs", label: "Redgifs", leftIcon: redgifsIcon },
];

/**
 * Collapsed icon rail from Figma `49:2443`.
 * Top: Explore → Profile + Get Premium
 * Bottom: Rewards, Settings, Language, then socials (Discord → Redgifs)
 * FRONT-657 hides Feed, Profile, and Rewards until those destinations ship.
 */
function pickDefaultSideNavItem(id: string): SideNavItem {
  for (const section of SIDE_NAV_ALL_SECTIONS) {
    const item = section.items.find((candidate) => candidate.id === id);
    if (item) return item;
  }
  throw new Error(`Missing side-nav item: ${id}`);
}

export const SIDE_NAV_COLLAPSED_SECTIONS: SideNavSection[] = withVisibleSideNavItems([
  {
    id: "collapsed-top",
    items: [
      pickDefaultSideNavItem("explore"),
      pickDefaultSideNavItem("chat"),
      pickDefaultSideNavItem("generate"),
      pickDefaultSideNavItem("feed"),
      pickDefaultSideNavItem("my-ais"),
      pickDefaultSideNavItem("profile"),
      pickDefaultSideNavItem("premium"),
    ],
  },
  {
    id: "collapsed-bottom",
    items: [
      pickDefaultSideNavItem("rewards"),
      pickDefaultSideNavItem("settings"),
      ...(LANGUAGE_FEATURE_ENABLED ? [pickDefaultSideNavItem("language")] : []),
    ],
  },
]);

export const SIDE_NAV_WIDTH_CLASS_BY_VARIANT: Record<SideNavVariant, string> = {
  collapsed: SIDE_NAV_COLLAPSED_WIDTH_CLASS,
  expanded: SIDE_NAV_EXPANDED_WIDTH_CLASS,
  overlay: SIDE_NAV_OVERLAY_WIDTH_CLASS,
};

export function resolveSideNavLinkType(
  item: SideNavItem,
  isActive: boolean,
): NavigationLinkProps["type"] {
  if (item.type) return item.type;
  return isActive ? "default-active" : "default";
}

export function resolveSideNavItemIcon(item: SideNavItem, isActive: boolean) {
  return isActive && item.activeLeftIcon ? item.activeLeftIcon : item.leftIcon;
}

/**
 * The sidebar's SOCIALS rail, from the same authored links the footer and
 * `/sitemap` render.
 *
 * Icons resolve through `FooterSocialIcon`, so one Prismic row draws the same
 * glyph in all three places: an authored `icon_url` wins, otherwise the
 * built-in glyph for the selected platform. Pass the list through
 * `socialLinks()` first — rows with no real destination never reach here.
 */
export function sideNavSocialItems(links: FooterLink[]): SideNavItem[] {
  return links.map((link) => {
    const hasIcon = hasFooterSocialIcon(link);

    return {
      id: link.id,
      label: link.label,
      href: link.href,
      external: true,
      showExternalIcon: false,
      showLeftIcon: hasIcon,
      leftIcon: hasIcon ? (
        <FooterSocialIcon
          link={link}
          size={24}
          slot="side-nav-social-icon"
          className={SIDE_NAV_ICON_CLASS}
        />
      ) : null,
    };
  });
}
