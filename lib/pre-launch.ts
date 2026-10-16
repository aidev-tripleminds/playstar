import { ROUTES } from "./routes";

/**
 * Pre-launch lock: ships the site as a public, crawlable brochure while the
 * product itself is still being built.
 *
 * Off unless `NEXT_PUBLIC_PRE_LAUNCH_LOCK` is set to a truthy value, so nothing
 * changes for developers or for a normal production deploy — the variable does
 * not need to exist at all.
 *
 * When on:
 * - Logged-OUT visitors are untouched. Every page still renders its SEO
 *   content, and signup/login still work — the point of shipping early is to
 *   collect early-bird accounts and let crawlers index the CMS content.
 * - Logged-IN users get {@link PRE_LAUNCH_NOTICE_TITLE} and are kept out of
 *   the product routes ({@link isPreLaunchLockedRoute}); Explore and their own
 *   account pages stay reachable so there is something to look at and a way
 *   back out. Age verification is never gated either: it is a legal check,
 *   not a product feature (`requestAgeVerification` in `main-layout-shell`).
 *
 * `NEXT_PUBLIC_` because the gate is enforced in the browser. Next inlines
 * these at BUILD time, so flipping the variable on Vercel needs a redeploy to
 * take effect — it is not a runtime switch.
 */
export const PRE_LAUNCH_LOCK_ENV_VAR = "NEXT_PUBLIC_PRE_LAUNCH_LOCK";

const TRUTHY_VALUES = new Set(["1", "true", "yes", "on"]);

/** Exported for tests — the module-level flag reads the env var only once. */
export function isPreLaunchLockValue(value: string | undefined | null): boolean {
  return TRUTHY_VALUES.has((value ?? "").trim().toLowerCase());
}

/**
 * Must reference `process.env.NEXT_PUBLIC_PRE_LAUNCH_LOCK` as a full literal:
 * Next's build-time inlining is a textual substitution, so an indirection like
 * `process.env[PRE_LAUNCH_LOCK_ENV_VAR]` compiles to `undefined` in the browser
 * bundle and the lock would silently never engage.
 */
export const IS_PRE_LAUNCH_LOCKED = isPreLaunchLockValue(process.env.NEXT_PUBLIC_PRE_LAUNCH_LOCK);

/**
 * Product areas that can be opened one at a time while the lock is on (BACK-322).
 *
 * The launch is phased — Explore only, then create + My AIs, then generate,
 * then chat, then payments — and each phase is a redeploy with one more name
 * in {@link PRE_LAUNCH_UNLOCKED_FEATURES_ENV_VAR}. Explore and the CMS pages
 * are not features: they are never locked.
 *
 * Generate opens in two steps (FRONT-900): `generate-image` is the workspace
 * with images only; `generate` is all of it, adding everything that makes a
 * video — the Videos tab, Animate, Extend. `generate` is also the backend's
 * name for the whole feature, which has no image-only step. `templates` adds
 * the Templates tab on top of `generate` (every template makes a video, so it
 * stays hidden without `generate`); it is frontend-only and owns no route or
 * endpoint of its own.
 */
export const PRE_LAUNCH_FEATURES = [
  "create",
  "generate-image",
  "generate",
  "templates",
  "chat",
  "settings",
  "payments",
] as const;

export type PreLaunchFeature = (typeof PRE_LAUNCH_FEATURES)[number];

/**
 * Comma-separated {@link PreLaunchFeature} names to open while the lock is on,
 * e.g. `create,settings`. Ignored when the lock is off (everything is open).
 */
export const PRE_LAUNCH_UNLOCKED_FEATURES_ENV_VAR = "NEXT_PUBLIC_PRE_LAUNCH_UNLOCKED_FEATURES";

function isPreLaunchFeature(value: string): value is PreLaunchFeature {
  return (PRE_LAUNCH_FEATURES as readonly string[]).includes(value);
}

/**
 * Exported for tests. Unknown names are dropped rather than rejected: a typo
 * leaves that feature locked, which is the safe side to fail on.
 */
export function parseUnlockedFeatures(
  value: string | undefined | null,
): ReadonlySet<PreLaunchFeature> {
  const names = (value ?? "").split(",").map((name) => name.trim().toLowerCase());
  return new Set(names.filter(isPreLaunchFeature));
}

/** Full literal for the same build-time inlining reason as {@link IS_PRE_LAUNCH_LOCKED}. */
export const PRE_LAUNCH_UNLOCKED_FEATURES = parseUnlockedFeatures(
  process.env.NEXT_PUBLIC_PRE_LAUNCH_UNLOCKED_FEATURES,
);

/** Whether a feature is usable in this build — always, unless the lock is on. */
export function isPreLaunchFeatureUnlocked(
  feature: PreLaunchFeature,
  unlocked: ReadonlySet<PreLaunchFeature> = PRE_LAUNCH_UNLOCKED_FEATURES,
): boolean {
  return !IS_PRE_LAUNCH_LOCKED || unlocked.has(feature);
}

/**
 * Product routes a logged-in user is bounced out of while the lock is on,
 * grouped by the feature that opens them. The feed has no feature: it is
 * unfinished and stays locked until the lock itself is lifted.
 *
 * A blocklist rather than an allowlist on purpose: `app/(main)/[...path]`
 * turns every published Prismic `content_page` into a route, so the set of
 * legitimate content URLs is not knowable here. Anything not named below —
 * Explore, policies, the sitemap, affiliates, auth callbacks and every CMS
 * page — stays reachable.
 *
 * Siblings that merely SHARE a prefix with a route (`/generate-image`,
 * `/create-ai-boyfriend`) are not children of it — `matchesRoute` needs an
 * exact path or a `/`-delimited child — so every route that opens the same
 * workspace or the same wizard has to be named (BACK-222, BACK-226).
 */
/**
 * Features whose screens ask for Premium (premium-only traits, out of tokens,
 * blurred media). Opening any of them opens `/premium` too, where — while
 * `payments` itself is locked — "buy" claims free early-access Premium instead
 * of starting checkout.
 */
export const PRE_LAUNCH_PREMIUM_FEATURES = [
  "create",
  "generate-image",
  "generate",
  "chat",
  "payments",
] as const satisfies readonly PreLaunchFeature[];

export const PRE_LAUNCH_FEATURE_ROUTES: Record<PreLaunchFeature | "always", readonly string[]> = {
  create: [
    ROUTES.createAiGirlfriend,
    ROUTES.createAiBoyfriend,
    ROUTES.createAiTrans,
    ROUTES.profile,
    // The funnel IS the character-creation wizard. A logged-out visitor may
    // still walk it — that is the signup funnel we want running.
    ROUTES.funnel,
    // Every premium feature (PRE_LAUNCH_PREMIUM_FEATURES) also owns the
    // premium page, so its upsells have somewhere to land.
    ROUTES.premium,
  ],
  "generate-image": [
    ROUTES.generate,
    ROUTES.generateImage,
    // FRONT-835 profile. Also listed under chat: Chat and Generate are the
    // only actions on the page, so either feature opens it.
    ROUTES.ai,
    ROUTES.premium,
  ],
  // Everything `generate-image` opens, plus the Videos tab's own URL. The tab
  // itself is hidden inside the workspace (`GenerateView`'s `videoEnabled`),
  // which the route table cannot do.
  generate: [
    ROUTES.generate,
    ROUTES.generateImage,
    ROUTES.generateVideo,
    ROUTES.ai,
    ROUTES.premium,
  ],
  // A tab inside the `/generate` workspace (`GenerateView`'s `templatesEnabled`).
  templates: [],
  chat: [
    ROUTES.chat,
    ROUTES.aiChat,
    // Same profile as generate. Segment matching keeps `/ai` from swallowing
    // the legacy `/ai-chat` URL, which stays owned by chat alone.
    ROUTES.ai,
    ROUTES.premium,
  ],
  // Sign-out does not depend on Settings: it lives in the header profile menu
  // (`modal-nav-variation.tsx`).
  settings: [ROUTES.settings],
  // `/upgrade` (the post-purchase upsell) only follows real payments.
  payments: [ROUTES.premium, ROUTES.upgrade],
  always: [ROUTES.feed],
};

/** Every route the lock can close, whatever is unlocked. */
export const PRE_LAUNCH_LOCKED_ROUTES = Object.values(PRE_LAUNCH_FEATURE_ROUTES).flat();

/** Where a locked route sends the user instead. */
export const PRE_LAUNCH_FALLBACK_ROUTE = ROUTES.explore;

function matchesRoute(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

/**
 * The features owning the longest matching prefix, so `/api/v1/characters/media`
 * belongs to generate even though `/api/v1/characters` belongs to create. A
 * prefix listed under several features (`/premium`) has several owners.
 */
function owningFeatures(
  pathname: string,
  table: Record<PreLaunchFeature | "always", readonly string[]>,
): (PreLaunchFeature | "always")[] {
  let owners: (PreLaunchFeature | "always")[] = [];
  let longest = -1;
  for (const [feature, prefixes] of Object.entries(table) as [
    PreLaunchFeature | "always",
    readonly string[],
  ][]) {
    for (const prefix of prefixes) {
      if (!matchesRoute(pathname, prefix) || prefix.length < longest) continue;
      if (prefix.length > longest) {
        owners = [];
        longest = prefix.length;
      }
      owners.push(feature);
    }
  }
  return owners;
}

/** Locked when something owns the path and none of its owners is unlocked. */
function isOwnedByLockedFeature(
  pathname: string,
  table: Record<PreLaunchFeature | "always", readonly string[]>,
  unlocked: ReadonlySet<PreLaunchFeature>,
): boolean {
  const owners = owningFeatures(pathname, table);
  if (owners.length === 0) return false;
  return !owners.some((owner) => owner !== "always" && unlocked.has(owner));
}

/**
 * Whether the lock closes this route, given what is unlocked. Prefix-matched
 * so nested routes (`/create-ai-girlfriend/edit/<id>`, `/generate/v2`) are
 * locked with their parent. Says nothing about whether the lock is ON — pair
 * it with {@link IS_PRE_LAUNCH_LOCKED} (the gate does).
 */
export function isPreLaunchLockedRoute(
  pathname: string,
  unlocked: ReadonlySet<PreLaunchFeature> = PRE_LAUNCH_UNLOCKED_FEATURES,
): boolean {
  return isOwnedByLockedFeature(pathname, PRE_LAUNCH_FEATURE_ROUTES, unlocked);
}

/**
 * Backend endpoints that must not be reachable while their feature is locked,
 * matched on non-GET requests only (see `apiFetch`).
 *
 * Scoped to the families that spend money or produce content. Auth, consent,
 * profile, account deletion and the early-access claim stay open: signing up,
 * confirming age, naming yourself in the personalize popup and deleting your
 * account are all things an early-bird account must still be able to do.
 */
export const PRE_LAUNCH_FEATURE_API_PREFIXES: Record<
  PreLaunchFeature | "always",
  readonly string[]
> = {
  create: ["/api/v1/characters"],
  "generate-image": ["/api/v1/characters/media"],
  // The three video prefixes are longer than the shared one, so `generate`
  // alone owns them and they stay closed when only `generate-image` is open.
  generate: [
    "/api/v1/characters/media",
    "/api/v1/characters/media/create-video",
    "/api/v1/characters/media/edit-video",
    "/api/v1/characters/media/extend-video",
  ],
  templates: [],
  chat: [],
  settings: [],
  payments: ["/api/v1/payments", "/api/v1/subscription"],
  always: [],
};

export function isPreLaunchLockedApiPath(
  path: string,
  unlocked: ReadonlySet<PreLaunchFeature> = PRE_LAUNCH_UNLOCKED_FEATURES,
): boolean {
  // Strip any query string before matching so `?foo=/api/v1/...` cannot smuggle
  // a prefix past, and a legitimate query cannot break one.
  const pathname = path.split(/[?#]/)[0];
  return isOwnedByLockedFeature(pathname, PRE_LAUNCH_FEATURE_API_PREFIXES, unlocked);
}

/** Requests that change state. Reads stay open so Explore still renders. */
export function isMutatingMethod(method: string | undefined): boolean {
  const normalized = (method ?? "GET").toUpperCase();
  return normalized !== "GET" && normalized !== "HEAD" && normalized !== "OPTIONS";
}

/** Error code surfaced by `apiFetch` when the lock refuses a request. */
export const PRE_LAUNCH_API_ERROR_CODE = "PRE_LAUNCH_LOCKED";

export const PRE_LAUNCH_NOTICE_TITLE = "You're on the early list";

export const PRE_LAUNCH_NOTICE_BODY = [
  "Spicestars isn't open yet, we're still building. We'd rather show you something great than something half-finished.",
  "Your account is saved and you're in the early group. We'll email you as soon as your access opens, so you'll get in before everyone else.",
] as const;

export const PRE_LAUNCH_NOTICE_FOOTNOTE =
  "In the meantime, have a look around Explore or Create your first AI Character.";

export const PRE_LAUNCH_NOTICE_CTA = "Start Creating";
