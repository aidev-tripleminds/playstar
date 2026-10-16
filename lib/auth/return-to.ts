import { absoluteAppUrl } from "@/lib/api/config";
import { ROUTES } from "@/lib/routes";

/**
 * FRONT-435 / BACK-94: carries the page a user was on before an auth
 * interruption (register, resend-verification) back through the emailed
 * verify-email link, so a successful verification can return them there
 * instead of always landing on {@link ROUTES.explore}.
 *
 * Contract (shared with the backend, which re-embeds this as a top-level
 * query param on the actual mailed link — see BACK-94):
 * - Param name is `returnTo`.
 * - On the way out, it is nested inside the `callbackURL` sent to Better
 *   Auth: `${absoluteAppUrl(ROUTES.verifyEmail)}?returnTo=<encoded path>`.
 * - On the way back, `verify-email-view.tsx` reads a plain top-level
 *   `returnTo` query param and must validate it itself — never trust a URL
 *   blindly, even though the backend also validates.
 */
const RETURN_TO_PARAM = "returnTo";

/** Generous enough for any real in-app path; guards against pathological input. */
const RETURN_TO_MAX_LENGTH = 2048;

/**
 * Any C0 control character, plus DEL.
 *
 * Browsers strip ASCII tab, LF and CR from a URL *wherever they occur* before
 * parsing it, so `/<TAB>/evil.com` passes a naive "starts with a single slash"
 * check and then resolves to `https://evil.com` once something navigates to it.
 * That made every guard below bypassable: the leading-`//` test sees `/<TAB>/`,
 * the browser sees `//`. No legitimate in-app path contains a control
 * character, so they are rejected outright rather than stripped — rejecting
 * needs no agreement about what the stripped value should be, and the caller
 * already has a safe fallback.
 *
 * The backend's `sanitizeReturnTo` (`src/auth/return-to.ts` in
 * `omnipink-backend`) defends the same class on the same value; this is the
 * client-side half of that contract, and the two must not disagree.
 */

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;

/**
 * A valid `returnTo` is a same-origin relative path: exactly one leading
 * slash (never `//...`, which browsers/some proxies treat as protocol-relative),
 * no backslash anywhere (`/\evil.com` gets normalized to `//evil.com` by some
 * browsers, the same protocol-relative trick spelled differently), no
 * `://` (rules out absolute URLs smuggled in after the leading slash), and no
 * control characters (see {@link CONTROL_CHARS} — the guards above are only
 * meaningful once the string a browser will parse is the string checked here).
 */
function isValidReturnTo(raw: string): boolean {
  if (!raw) return false;
  if (raw.length > RETURN_TO_MAX_LENGTH) return false;
  if (CONTROL_CHARS.test(raw)) return false;
  if (!raw.startsWith("/")) return false;
  if (raw.startsWith("//")) return false;
  if (raw.includes("\\")) return false;
  if (raw.includes("://")) return false;
  return true;
}

/**
 * Validates a raw `returnTo` query-param value read back from the URL.
 * Anything missing or invalid — including an attempted off-site redirect —
 * falls back to {@link ROUTES.explore}, exactly like the pre-FRONT-435
 * behavior.
 */
export function resolveReturnTo(raw: string | null | undefined): string {
  if (raw && isValidReturnTo(raw)) return raw;
  return ROUTES.explore;
}

/**
 * The current browser location as a `returnTo` candidate, or `null` when there
 * is nothing usable: no window (SSR), anywhere already under `/auth/*` (the
 * auth flow itself — returning into it would bounce the user straight back
 * into the screen they just finished), or a location that fails validation.
 */
function currentPathCandidate(): string | null {
  if (typeof window === "undefined") return null;
  const { pathname, search } = window.location;
  if (pathname === "/auth" || pathname.startsWith("/auth/")) return null;
  const candidate = `${pathname}${search}`;
  return isValidReturnTo(candidate) ? candidate : null;
}

/**
 * {@link currentPathCandidate}, minus the home page: an emailed verify link
 * clicked hours later should land on `/explore` (the signed-in landing page),
 * not back on the marketing root the user happened to register from.
 */
function currentReturnToCandidate(): string | null {
  const candidate = currentPathCandidate();
  return candidate === "/" ? null : candidate;
}

/**
 * Builds the `callbackURL` for a social sign-in (`signIn.social`), so finishing
 * a Google round trip lands the user back on the exact page they started from
 * instead of always on `/explore`.
 *
 * Two things differ from {@link buildVerifyEmailCallbackUrl}:
 * - No nested `returnTo` param. Better Auth 302s the browser straight to this
 *   URL once the OAuth callback completes, so the destination IS the callback
 *   URL — there is no email round trip for the backend to re-embed it into.
 * - The home page is kept as a destination. Unlike a verify link clicked hours
 *   later, this redirect happens seconds after the click, so "exactly where I
 *   was" is what the user expects even when that was `/`.
 *
 * Only the path is carried, which is all that is needed: state that lives
 * outside the URL rides through the round trip on its own, because the OAuth
 * redirect leaves and re-enters the SAME origin (the `next.config.ts` rewrite
 * keeps the whole flow first-party) and so keeps localStorage. That is what
 * restores the create-AI-girlfriend wizard to the step the user was on — the
 * draft, including `activeStep`/`maxStepReached`, is already autosaved there by
 * `create-ai-girlfriend-view`, and its restore runs on mount.
 */
export function buildSocialCallbackUrl(explicitReturnTo?: string): string {
  return absoluteAppUrl(
    explicitReturnTo !== undefined
      ? resolveReturnTo(explicitReturnTo)
      : (currentPathCandidate() ?? ROUTES.explore),
  );
}

/**
 * Builds the `callbackURL` to hand Better Auth for a verify-email send
 * (initial signup or a resend), nesting the current location as `returnTo`
 * per the contract above when it makes sense to return there.
 *
 * `explicitReturnTo` overrides the derived-from-`window.location` candidate —
 * for the funnel (funnel-page task 5 / D21), where the current location IS
 * `/`, and `currentReturnToCandidate()` deliberately drops `/` (a verify link
 * clicked hours later should not land on the marketing root). Without an
 * override, a funnel sign-up's mailed link would carry no `returnTo` at all
 * and land the visitor on `ROUTES.explore` instead of the wizard they came
 * from — the fix is passing this explicitly from funnel mode, never widening
 * the `/` rule above, which exists for a good reason on the main site.
 */
export function buildVerifyEmailCallbackUrl(explicitReturnTo?: string): string {
  const base = absoluteAppUrl(ROUTES.verifyEmail);
  const candidate =
    explicitReturnTo && isValidReturnTo(explicitReturnTo)
      ? explicitReturnTo
      : currentReturnToCandidate();
  if (!candidate) return base;
  return `${base}?${RETURN_TO_PARAM}=${encodeURIComponent(candidate)}`;
}
