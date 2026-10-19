import type { LegalDocumentSummary } from "@/lib/api/legal";
import { dummyImage } from "@/lib/dummy-images";
import { policyRoute, ROUTES } from "@/lib/routes";

/** Figma Footer (node 2116-17249). Cap matches Explore; 16px gutter lives inside it. */
export const FOOTER_WIDTH_PX = 1632;
export const FOOTER_PADDING_X_PX = 16;
export const FOOTER_PADDING_Y_PX = 48;
export const FOOTER_COLUMN_GAP_PX = 32;
export const FOOTER_LOGO_SRC = "/assets/logo-spicestars.svg";
export const FOOTER_LOGO_WIDTH_PX = 121.2;
export const FOOTER_LOGO_HEIGHT_PX = 12;

export const FOOTER_PAYMENT_MASTERCARD_SRC = dummyImage(165);
export const FOOTER_PAYMENT_VISA_SRC = dummyImage(166);
export const FOOTER_PAYMENT_VOLT_SRC = dummyImage(167);
// NOT migrated: the asset manifest's "demo_pics_evershield" key still points at the
// old EverShield logo — "omnifences.svg" (the OMNIFENCE rebrand from dev, 2026-07-30)
// was never added to the manifest/Tigris, so this stays on the local path until it is.
export const FOOTER_EVERYSHIELD_LOGO_SRC = "/assets/pics/omnifences.svg";

export const FOOTER_COMPANY_ADDRESS =
  "OMNIPINK LTD, HE 491125\nJohn Kennedy 8, IRIS HOUSE, 3rd floor\n3106, Limassol, Cyprus";

export const FOOTER_EVERYSHIELD_TEXT = "Safer with OMNIFENCE AI";

export const FOOTER_SITEMAP_LABEL = "Sitemap";
export const FOOTER_COPYRIGHT_PREFIX = "© 2026 SpiceStars AI - All Rights Reserved - ";
export const FOOTER_DEFAULT_COPYRIGHT = `${FOOTER_COPYRIGHT_PREFIX}${FOOTER_SITEMAP_LABEL}`;
export const FOOTER_SITEMAP_HREF = ROUTES.sitemap;

export const FOOTER_DEFAULT_EMAIL = "hello@spicestars.ai";

export type FooterLink = {
  id: string;
  label: string;
  href: string;
  icon?: FooterSocialPlatform;
  /**
   * Icon URL authored in the back office, which WINS over the built-in `icon`
   * glyph. Optional in both directions: pick a `platform` and leave this empty
   * to reuse the hand-drawn SVG we already ship for that network, or paste a
   * URL to bring a network the `platform` select has never heard of (BACK-160).
   *
   * A URL rather than a Prismic Image upload (BACK-154 follow-up): overriding
   * one of the six socials we already draw should not force an editor to find
   * and upload an icon file first.
   *
   * No `alt`: the icon is always drawn beside its own visible label, so it
   * renders decoratively — see `FooterSocialIcon`.
   */
  iconUrl?: string;
};

export type FooterSocialPlatform = "reddit" | "x" | "discord" | "instagram" | "tiktok" | "redgifs";

export type FooterLinkGroup = {
  id: string;
  title: string;
  links: FooterLink[];
};

export type FooterSocialLink = {
  id: string;
  label: string;
  href: string;
  iconSrc: string;
};

/**
 * True when a social link actually points at a profile.
 *
 * The built-in defaults below are PLACEHOLDERS: every `href` is `"/"`, because
 * the real profile URLs have never been filled in. That is survivable in the
 * footer, where the column is part of the chrome, but not on `/sitemap`, whose
 * Socials section exists to publish outbound profile links — six `nofollow`
 * links pointing back at the homepage are worse than no section at all.
 *
 * Callers that publish these links filter with this; the moment real URLs land
 * in `FOOTER_DEFAULT_LINK_GROUPS` (or a Prismic `footer` document is
 * published) it stops excluding anything.
 */
export function hasSocialDestination(link: FooterLink): boolean {
  const href = link.href.trim();
  return href.length > 0 && href !== "/" && href !== "#";
}

/**
 * The socials worth PUBLISHING, from whatever `getFooterLinkGroups()` returned.
 *
 * Every surface that links out to a profile — `/sitemap`, the sidebar's SOCIALS
 * rail — reads the list through here, so they cannot drift from each other or
 * from the footer. The placeholder defaults are filtered out by
 * `hasSocialDestination`: an outward-facing link that goes nowhere is worse
 * than no link, and until a Prismic `footer` document is published every
 * built-in href is still `"/"`.
 *
 * The footer column itself deliberately does NOT use this — it renders the
 * group as-is, placeholders included, because there it is chrome rather than a
 * published destination.
 */
export function socialLinks(linkGroups: FooterLinkGroup[]): FooterLink[] {
  const socials = linkGroups.find((group) => group.id === "socials")?.links ?? [];
  return socials.filter(hasSocialDestination);
}

export const FOOTER_DEFAULT_LINK_GROUPS: FooterLinkGroup[] = [
  {
    id: "socials",
    title: "Socials",
    links: [
      { id: "reddit", label: "Reddit", href: "/" },
      { id: "x", label: "X.com", href: "/" },
      { id: "discord", label: "Discord", href: "/" },
      { id: "instagram", label: "Instagram", href: "/" },
      { id: "tiktok", label: "TikTok", href: "/" },
      { id: "redgifs", label: "Redgifs", href: "/" },
    ],
  },
];

/**
 * Derived from the backend's published document list (task 16, D28) — the
 * one place these ids and labels are now written down. Order is whatever
 * the backend serves (`displayOrder`, the settings-modal/Figma order); the
 * footer's own near-alphabetical order is dropped along with the duplicate
 * list that produced it.
 */
export function footerDefaultLegalLinks(documents: LegalDocumentSummary[]): FooterLink[] {
  return documents.map((doc) => ({ id: doc.key, label: doc.title, href: policyRoute(doc.key) }));
}

export const FOOTER_DEFAULT_SOCIAL_LINKS: FooterSocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com",
    iconSrc: "/assets/fb-icon.svg",
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com",
    iconSrc: "/assets/icons/footer-x.svg",
  },
];

export const FOOTER_SURFACE_CLASS = "w-full border-t border-surface-strong";

export const FOOTER_INNER_CLASS = "mx-auto flex w-full max-w-full flex-col gap-10";

export const FOOTER_COLUMNS_CLASS =
  "grid w-full grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2";

export const FOOTER_COLUMN_TITLE_CLASS = "text-select-muted-text text-base leading-6";

export const FOOTER_LINK_LIST_CLASS = "mt-3 flex flex-col gap-2";

export const FOOTER_LINK_CLASS =
  "text-select-text hover:text-tooltip-text text-base font-medium leading-6 transition-colors";

export const FOOTER_SOCIAL_ICON_SIZE_PX = 16;

export const FOOTER_SOCIAL_LINK_CLASS = `${FOOTER_LINK_CLASS} inline-flex items-center gap-2`;

export const FOOTER_BOTTOM_CLASS = "flex flex-col gap-2";

export const FOOTER_COPYRIGHT_CLASS =
  "text-[var(--select-muted-text)] text-sm leading-5 font-semibold";

export const FOOTER_SITEMAP_LINK_CLASS =
  "text-[var(--select-muted-text)] hover:text-tooltip-text text-sm leading-5 font-semibold transition-colors";

export const FOOTER_LEGAL_ROW_CLASS = "flex flex-wrap items-center gap-1";

export const FOOTER_LEGAL_LINK_CLASS =
  "text-select-muted-text hover:text-tooltip-text text-xs leading-[18px] transition-colors";

export const FOOTER_LEGAL_SEPARATOR_CLASS = "bg-border-focus text-xs w-[4px] h-[4px] rounded-[4px]";

export const FOOTER_EMAIL_CLASS =
  "text-select-muted-text hover:text-tooltip-text text-xs leading-[18px] transition-colors";
