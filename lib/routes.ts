import type { BottomNavigationTab } from "@/components/common/navigation/bottom-navigation";

export const ROUTES = {
  /**
   * The homepage. `/` is its only URL — `home` below is the alias that 308s
   * here (BACK-148 / BACK-156), not a second page.
   */
  root: "/",
  /** Legacy alias for {@link ROUTES.root}; `app/(main)/home` redirects it there. */
  home: "/home",
  explore: "/explore",
  generate: "/generate",
  /**
   * The Create workspace addressed straight at one gallery — the same route
   * `/generate` serves, opened on Images / Videos instead of Templates, with
   * its own CMS document and `<head>` (BACK-222). Both start with `/generate`,
   * so every `startsWith(ROUTES.generate)` nav check already covers them.
   */
  generateImage: "/generate-image",
  generateVideo: "/generate-video",
  /**
   * My AIs (`/my-ais`). Kept on `profile` so existing `ROUTES.profile` callers
   * keep working after FRONT-675 moved the URL off `/profile`.
   */
  profile: "/my-ais",
  /** Legacy My AIs URL — `app/(main)/profile` 308s here. */
  profileLegacy: "/profile",
  feed: "/feed",
  chat: "/chat",
  settings: "/settings",
  /**
   * Dummy/test URLs for the restricted-account flow (FRONT-743). Restricted
   * users will eventually be sent here by the app; these are not linked from
   * navigation or the sitemap.
   */
  restrictedAccount: "/restricted-account",
  restrictedAccountSubmitAppeal: "/restricted-account/submit-appeal",
  restrictedAccountInReview: "/restricted-account/in-review",
  restrictedAccountDeclined: "/restricted-account/declined",
  premium: "/premium",
  ageVerification: "/age-verification",
  /**
   * Post–Premium Monthly upgrade surface (`/upgrade`). FRONT-545: Infinite
   * comparison after a monthly purchase, with leave-retention upsells.
   */
  upgrade: "/upgrade",
  createAiGirlfriend: "/create-ai-girlfriend",
  /**
   * The same create wizard opened on another gender, each with its own CMS
   * document and `<head>` (BACK-226). Unlike the generate landings, these are
   * not prefixes of the route they vary — so `CREATE_ROUTES` below names all
   * three, and every "is this the create flow?" check reads that list.
   */
  createAiBoyfriend: "/create-ai-boyfriend",
  createAiTrans: "/create-ai-trans",
  policies: "/policies",
  verifyEmail: "/auth/verify-email",
  /**
   * Where a cross-origin session handoff is redeemed (funnel-page task 10 /
   * R18). The BACKEND also holds this path — it builds the destination address
   * server-side so nothing from the request can steer it — so the two must stay
   * in step: `HANDOFF_LANDING_PATH` in `src/services/session-handoff/destination.ts`.
   */
  authHandoff: "/auth/handoff",
  /**
   * Where a GDPR data-export email link lands when the visitor has no session
   * (BACK-123). `/settings` carries the same two dialogs for a signed-in user;
   * this route exists because the export links are opened from an inbox, which
   * is routinely a different device from the one the account is signed in on.
   */
  authDataExport: "/auth/data-export",
  /** The chrome-less funnel (D24) — a real, reachable page, not just a rewrite target. */
  funnel: "/spicestars",
  /**
   * Influencer landing (`/affiliates`). Not in app navigation — shared as a
   * campaign URL, not a destination the chrome links to.
   */
  affiliates: "/affiliates",
  /**
   * HTML sitemap (`/sitemap`). Linked from the footer copyright line, not
   * from side/bottom nav.
   */
  sitemap: "/sitemap",
  /**
   * Legacy SEO Chat URL (`/ai-chat`). Redirects to `/chat`, which is both the
   * in-app chat (signed-in) and the Chat SEO landing (logged-out).
   */
  aiChat: "/ai-chat",
  /**
   * Minimal character profile (FRONT-835). `/ai` picks a character;
   * `/ai/:characterId` opens one. This is a different path from
   * {@link ROUTES.aiChat} (`/ai-chat`) — do not prefix-match `ai`, because
   * `"/ai-chat".startsWith("/ai")` is true.
   */
  ai: "/ai",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export function policyRoute(policyId: string): string {
  return `${ROUTES.policies}/${policyId}`;
}

/**
 * Query key for deep-linking a character, e.g. `/my-ais?character=<id>`.
 * The create flow sends the user to My AIs with this param on success; the
 * profile showcase's Chat and Generate actions pass it through as well.
 */
export const PROFILE_CHARACTER_PARAM = "character";

export function buildProfileCharacterHref(characterId: string): string {
  return `${ROUTES.profile}?${PROFILE_CHARACTER_PARAM}=${encodeURIComponent(characterId)}`;
}

export function buildChatCharacterHref(characterId: string): string {
  return `${ROUTES.chat}?${PROFILE_CHARACTER_PARAM}=${encodeURIComponent(characterId)}`;
}

export function buildGenerateCharacterHref(characterId: string): string {
  return `${ROUTES.generate}?${PROFILE_CHARACTER_PARAM}=${encodeURIComponent(characterId)}`;
}

/** Minimal profile for one character (`/ai/:characterId`). */
export function buildAiCharacterHref(characterId: string): string {
  return `${ROUTES.ai}/${encodeURIComponent(characterId)}`;
}

/**
 * True for `/ai` and `/ai/:id` only. A `startsWith("/ai")` check would also
 * match {@link ROUTES.aiChat}.
 */
export function isAiCharacterRoute(pathname: string): boolean {
  return pathname === ROUTES.ai || pathname.startsWith(`${ROUTES.ai}/`);
}

/**
 * FRONT-654: empty image-preview "Create AI Character" opens the wizard on
 * the style-intro step. A saved draft would otherwise restore a later funnel
 * position (identity, summary, …) and skip the intro. Lands on
 * `/create-ai-girlfriend` since the gender-neutral `/create-ai-character`
 * landing was retired; the wizard's own Female default is the same either way.
 */
export const CREATE_AI_CHARACTER_INTRO_PARAM = "intro";

export function buildCreateAiCharacterIntroHref(): string {
  return `${ROUTES.createAiGirlfriend}?${CREATE_AI_CHARACTER_INTRO_PARAM}=1`;
}

export function hasCreateAiCharacterIntroQuery(value: string | null): boolean {
  return value === "1" || value === "true";
}

/**
 * After a successful purchase the checkout success state redirects here.
 * The create page (or any main-app destination) opens the
 * "How did you hear about us?" modal when this param is present, then strips it.
 */
export const HEAR_ABOUT_US_PARAM = "hearAboutUs";
export const HEAR_ABOUT_US_ORDER_PARAM = "surveyOrder";

/**
 * Deep-link the data-export dialogs, e.g.
 * `/settings?dataExport=verify&token=<token>` (BACK-123).
 *
 * The backend emails both links; they must point at this app rather than at
 * the backend's own domain, or the session cookie a signed-in visitor arrives
 * with lands in the wrong cookie jar (BACK-54).
 */
export const DATA_EXPORT_PARAM = "dataExport";
export const DATA_EXPORT_TOKEN_PARAM = "token";

export type DataExportStep = "verify" | "download";

const DATA_EXPORT_STEPS: DataExportStep[] = ["verify", "download"];

/** Narrow a raw `?dataExport=` value, so an unknown step is never deep-linked. */
export function parseDataExportStep(value: string | null | undefined): DataExportStep | null {
  return DATA_EXPORT_STEPS.find((step) => step === value) ?? null;
}

/**
 * Deep-link the `/premium` plan tabs, e.g. `/premium?plan=infinite`.
 * Used when a Premium subscriber upgrades from Get Tokens.
 */
export const PREMIUM_PLAN_PARAM = "plan";
export const PREMIUM_INFINITE_PLAN = "infinite";

export function buildPremiumHref(plan?: string): string {
  if (!plan) return ROUTES.premium;
  return `${ROUTES.premium}?${PREMIUM_PLAN_PARAM}=${encodeURIComponent(plan)}`;
}

export function buildCreateAiGirlfriendHearAboutUsHref(orderId: string): string {
  const query = new URLSearchParams({
    [HEAR_ABOUT_US_PARAM]: "1",
    [HEAR_ABOUT_US_ORDER_PARAM]: orderId,
  });
  return `${ROUTES.createAiGirlfriend}?${query.toString()}`;
}

/** After Premium Monthly checkout — carry the order so leave-skip can still survey. */
export function buildUpgradeHref(orderId?: string | null): string {
  if (!orderId) return ROUTES.upgrade;
  const query = new URLSearchParams({
    [HEAR_ABOUT_US_ORDER_PARAM]: orderId,
  });
  return `${ROUTES.upgrade}?${query.toString()}`;
}

/**
 * Destination after leaving `/upgrade` without buying Infinite (skip-all) or
 * after a successful Infinite checkout. Same place Premium Monthly used to go
 * before FRONT-545 inserted this page.
 */
export function buildPostUpgradeDestination(orderId?: string | null): string {
  return orderId ? buildCreateAiGirlfriendHearAboutUsHref(orderId) : ROUTES.createAiGirlfriend;
}

export function hasHearAboutUsQuery(value: string | null): boolean {
  return value === "1" || value === "true";
}

/**
 * "Edit my AI" — the create wizard's summary screen in edit mode, prefilled
 * from an existing character. Nested under the create route on purpose: the
 * screen IS the create flow's summary step, and `isCreateRoute` /
 * `resolveActiveBottomNavTab` already prefix-match it, so navigation
 * highlighting keeps working with no extra cases.
 */
export function buildEditAiCharacterHref(characterId: string): string {
  return `${ROUTES.createAiGirlfriend}/edit/${encodeURIComponent(characterId)}`;
}

export const SIDE_NAV_ITEM_ROUTES: Partial<Record<string, AppRoute>> = {
  create: ROUTES.createAiGirlfriend,
  explore: ROUTES.explore,
  generate: ROUTES.generate,
  "my-ais": ROUTES.profile,
  feed: ROUTES.feed,
  chat: ROUTES.chat,
  settings: ROUTES.settings,
  premium: ROUTES.premium,
};

export const BOTTOM_NAV_ITEM_ROUTES: Partial<Record<BottomNavigationTab, AppRoute>> = {
  explore: ROUTES.explore,
  chat: ROUTES.chat,
  generate: ROUTES.generate,
  create: ROUTES.createAiGirlfriend,
  premium: ROUTES.premium,
};

/**
 * Where the "Explore" nav entry points.
 *
 * `/explore` is the signed-in discovery feed and redirects an anonymous
 * visitor to `/` (BACK-222). Pointing the menu straight at `/` for those
 * visitors saves a pointless round trip through that redirect, and `/` is the
 * page they were going to end up on anyway — the Prismic-authored marketing
 * surface. The redirect stays as the safety net for anyone who reaches
 * `/explore` some other way (a bookmark, a stale link, a typed URL).
 *
 * Both nav resolvers below and the two other menus that carry an Explore entry
 * go through `useExploreNavRoute`, so this rule lives in one place.
 */
export function exploreNavRoute(isLoggedIn: boolean): AppRoute {
  return isLoggedIn ? ROUTES.explore : ROUTES.root;
}

export function resolveSideNavItemRoute(itemId: string): AppRoute | undefined {
  return SIDE_NAV_ITEM_ROUTES[itemId];
}

export function resolveBottomNavItemRoute(tab: BottomNavigationTab): AppRoute | undefined {
  return BOTTOM_NAV_ITEM_ROUTES[tab];
}

export function resolveActiveSideNavItemId(pathname: string): string | undefined {
  // "/" renders the same marketing surface as logged-out /explore, and /home
  // is an alias that redirects to "/" — all three highlight "explore".
  if (pathname === ROUTES.root) return "explore";
  if (pathname.startsWith(ROUTES.home)) return "explore";
  if (pathname.startsWith(ROUTES.explore)) return "explore";
  if (pathname.startsWith(ROUTES.generate)) return "generate";
  if (pathname.startsWith(ROUTES.profile) || pathname.startsWith(ROUTES.profileLegacy)) {
    return "my-ais";
  }
  if (pathname.startsWith(ROUTES.feed)) return "feed";
  if (pathname.startsWith(ROUTES.chat)) return "chat";
  if (pathname.startsWith(ROUTES.settings)) return "settings";
  if (pathname.startsWith(ROUTES.premium)) return "premium";
  if (pathname.startsWith(ROUTES.upgrade)) return "premium";
  if (isCreateRoute(pathname)) return "create";
  return undefined;
}

export function resolveActiveBottomNavTab(pathname: string): BottomNavigationTab {
  if (pathname.startsWith(ROUTES.chat)) return "chat";
  if (pathname.startsWith(ROUTES.generate)) return "generate";
  if (isCreateRoute(pathname)) return "create";
  if (pathname.startsWith(ROUTES.premium)) return "premium";
  if (pathname.startsWith(ROUTES.upgrade)) return "premium";
  return "explore";
}

/**
 * Every path that renders the create wizard: `/create-ai-girlfriend` and the
 * two gender-preselected landings (BACK-226). A prefix test on
 * `createAiGirlfriend` alone would highlight the nav on one of the three.
 */
const CREATE_ROUTES = [
  ROUTES.createAiGirlfriend,
  ROUTES.createAiBoyfriend,
  ROUTES.createAiTrans,
] as const;

export function isCreateRoute(pathname: string): boolean {
  return CREATE_ROUTES.some((route) => pathname.startsWith(route));
}

export function isExploreContentRoute(pathname: string): boolean {
  return (
    pathname === ROUTES.root ||
    pathname.startsWith(ROUTES.explore) ||
    pathname.startsWith(ROUTES.home)
  );
}
