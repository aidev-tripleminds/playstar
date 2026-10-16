"use client";

import { REQUEST_ID_HEADER } from "@omnipink/logger/context";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";

import type { EmailPreferenceSavePayload } from "@/components/common/auth/email-preference/email-preference";
import type {
  GenderPopupOption,
  GenderPopupSavePayload,
} from "@/components/common/auth/gender-popup/gender-popup";
import type { LoginSubmitResult } from "@/components/common/auth/login/login";
import type { SignupSubmitResult } from "@/components/common/auth/signup/signup";
import { showToast } from "@/components/common/general/toast/toast";
import { clearCreateAiGfDraft } from "@/components/pages/create-ai-girlfriend/_lib/create-ai-gf-pending-creation";
import { confirmPasswordReset, requestPasswordReset } from "@/lib/api/auth";
import { ApiRequestError } from "@/lib/api/client";
import { absoluteAppUrl, newRequestId } from "@/lib/api/config";
import { fetchProfile, updateEmailPreferences, updateProfile } from "@/lib/api/profile";
import {
  authClient,
  changeEmail,
  sendVerificationEmail,
  signIn,
  signOut,
  signUp,
} from "@/lib/auth/auth-client";
import {
  ACCOUNT_PENDING_DELETION_CODE,
  pendingDeletionDeadline,
  pendingDeletionMessage,
} from "@/lib/auth/pending-deletion";
import { buildSocialCallbackUrl, buildVerifyEmailCallbackUrl } from "@/lib/auth/return-to";
import { ROUTES } from "@/lib/routes";

import { useGoogleProviderId } from "./use-bootstrap";
import { ME_QUERY_KEY } from "./use-me";

/**
 * Design copy for a signup against an address that already has an account —
 * only reached once the auto-login fallback (BACK-53) has failed too, i.e. the
 * password does not match that account.
 */
const SIGNUP_EMAIL_IN_USE_MESSAGE = "Email is already in use";

/**
 * Shown when the auto-login retry is refused for a reason that is not "wrong
 * password" — the backend's escalating login lockout, or a plain rate limit.
 * Telling that user the address is taken would send them to the login form to
 * hit the very same block with the very same credentials.
 */
const SIGNUP_TOO_MANY_ATTEMPTS_MESSAGE = "Too many attempts, try again later";

/** Design copy for a reset link that is expired, already used, or malformed. */
const RESET_LINK_INVALID_MESSAGE = "Invalid or expired link";

/** Design copy for anything we could not classify (network down, 5xx). */
const UNKNOWN_ERROR_MESSAGE = "Error, please contact support";

/** Shown when logout cannot confirm that the server session ended. */
export const LOGOUT_FAILED_MESSAGE = "Couldn't log you out, please try again";

/**
 * Sign out, and tell whether the server session is gone.
 *
 * The sign-out response can be lost after the backend has already ended the
 * session (SPICESTARS-FRONTEND-13: the backend answered 200 in 40 ms, and
 * Safari still rejected the fetch with "Load failed"). So a failed sign-out
 * asks the server once more: no session means the logout happened. The
 * session store is then told to re-read it, because only a sign-out
 * *response* does that by itself.
 *
 * On failure it gives the sign-out's request ID, for the toast's reference
 * code: a Better Auth error does not carry it, so the ID is made here and sent
 * as the request's `x-request-id`.
 */
async function endServerSession(): Promise<{ ended: true } | { ended: false; requestId?: string }> {
  const requestId = newRequestId();
  try {
    const { error } = await signOut({
      fetchOptions: { headers: requestId ? { [REQUEST_ID_HEADER]: requestId } : {} },
    });
    if (!error) return { ended: true };
  } catch {
    // No response at all: check below whether the request still got through.
  }
  try {
    const { data, error } = await authClient.getSession();
    if (error || data) return { ended: false, requestId };
  } catch {
    return { ended: false, requestId };
  }
  authClient.$store.notify("$sessionSignal");
  return { ended: true };
}

/** What registration already stored, shown as the personalize popup's starting values. */
export type SignupPersonalizationDefaults = {
  username?: string;
  gender?: GenderPopupOption | null;
};

/**
 * Real Better Auth actions for the auth modals. Most return an error message to
 * display, or null on success (matching the modals' `onSubmit` contract);
 * `register` returns a `SignupSubmitResult` instead, because the modal also has
 * to know whether the call created an account or signed into an existing one.
 */
export function useAuthActions() {
  const queryClient = useQueryClient();
  const router = useRouter();
  // null while bootstrap is in flight, and for a brand with no Google client.
  const googleProviderId = useGoogleProviderId();

  const login = React.useCallback(
    async (email: string, password: string): Promise<LoginSubmitResult> => {
      const { error } = await signIn.email({ email, password });
      if (error) {
        // Correct credentials, unverified address (D23's login gate) — never a
        // plain inline error. The modal opens the confirm-email popup instead
        // (BACK-72), same as an unverified auto-login retry on signup.
        if (error.code === "EMAIL_NOT_VERIFIED") {
          return { emailUnverified: true };
        }
        if (error.code === ACCOUNT_PENDING_DELETION_CODE) {
          return { error: pendingDeletionMessage(pendingDeletionDeadline(error)) };
        }
        return { error: error.message ?? "Invalid email or password." };
      }

      await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      return {};
    },
    [queryClient],
  );

  /**
   * "Continue with Google", shared by the login and signup modals — Better
   * Auth's social sign-in makes no distinction between the two, since whether
   * an account already exists for the Google address is only knowable after
   * Google answers.
   *
   * Resolves to an error message to show inline, or null once the browser is
   * on its way to Google. Null is NOT "signed in": the client answers with the
   * consent-screen URL and navigates there, so on success this page is being
   * torn down and there is no session to invalidate the `me` query for — the
   * app reloads from scratch at `callbackURL` when Google sends the user back,
   * which is also why there is no `queryClient` dependency here.
   *
   * There is no verified/unverified fork either: a Google address arrives
   * already verified, so the confirm-email popup the email flows need never
   * applies.
   */
  const signInWithGoogle = React.useCallback(
    async (options?: { returnTo?: string }): Promise<string | null> => {
      // Every brand fronts its own Google app, so the provider is addressed by a
      // brand-specific id (`google-<slug>`) rather than the literal "google", and
      // the call is `signIn.oauth2` (the genericOAuth plugin) rather than
      // `signIn.social` (the built-in provider, which the backend does not mount).
      //
      // No id means this brand has no usable client. Callers already hide the
      // button in that case; this guard is the backstop, because guessing an id
      // would send the user to an endpoint that answers "provider not found".
      if (!googleProviderId) return UNKNOWN_ERROR_MESSAGE;

      // Success may return to filtered Explore. Failures must return to the public
      // page that opened auth so its error handler can show the refusal without
      // the anonymous Explore redirect discarding the callback parameters.
      const callbackURL = buildSocialCallbackUrl(options?.returnTo);

      try {
        const { error } = await signIn.oauth2({
          providerId: googleProviderId,
          callbackURL,
          errorCallbackURL: buildSocialCallbackUrl(),
        });
        if (error) {
          if (error.status === 429) return "Too many attempts, try again later";
          return error.message ?? UNKNOWN_ERROR_MESSAGE;
        }
        return null;
      } catch {
        return UNKNOWN_ERROR_MESSAGE;
      }
    },
    [googleProviderId],
  );

  /**
   * BACK-53: someone hit "Join" with the credentials of an account they
   * already have — a common way of typing "log me in". The address being taken
   * says nothing about whether the password is right, so try it: a match is a
   * plain login and lands them signed in, anything else falls back to the
   * taken-address message and the login form.
   *
   * This is not a new way to guess a password — the caller must already supply
   * the correct one, which is exactly what the sign-in endpoint asks for. If
   * anything it says less than the current unconditional "email is already in
   * use", which confirms the account to someone who guessed nothing.
   */
  const signInExistingAccount = React.useCallback(
    async (email: string, password: string): Promise<SignupSubmitResult> => {
      let outcome: Awaited<ReturnType<typeof signIn.email>>;
      try {
        outcome = await signIn.email({ email, password });
      } catch {
        // The retry itself fell over (network down, unexpected 5xx). The
        // address is taken regardless, and saying so at least points the user
        // at the login form — "could not create your account, try again" would
        // ask them to retry a registration that can never succeed.
        return { error: SIGNUP_EMAIL_IN_USE_MESSAGE };
      }

      const { error } = outcome;
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
        return { autoLoggedIn: true };
      }
      // The address has an account whose email was never confirmed — the
      // same situation the confirm-email popup's own repeat-Join detection
      // (`lib/auth/pending-signups`) handles for a second Join across page
      // reloads, except the backend can tell us on the very FIRST Join too.
      // Route it into that same dialog (resend, no Okay) instead of a plain
      // inline error, which would leave the user with no action.
      if (error.code === "EMAIL_NOT_VERIFIED") {
        return { emailUnverified: true };
      }
      if (error.code === ACCOUNT_PENDING_DELETION_CODE) {
        return { error: pendingDeletionMessage(pendingDeletionDeadline(error)) };
      }
      // This retry spends the account's login-failure budget: the backend locks
      // an account for 15 min after 5 consecutive failures, doubling from
      // there. A user who forgot which password they used can therefore lock
      // themselves out from the signup form, so the block has to be named —
      // "Email is already in use" would send them to the login form to be
      // refused again, with no hint that waiting is what fixes it. The lockout
      // (429 `LOGIN_LOCKED`) and Better Auth's own rate limit both answer 429
      // with no `code`, so key off the status.
      if (error.status === 429) {
        return { error: SIGNUP_TOO_MANY_ATTEMPTS_MESSAGE };
      }
      // A social-only account (signed up with Google/X, so no password to
      // check) lands here too, as does a genuinely wrong password. Better Auth
      // does not distinguish the two, so both get the taken-address message.
      return { error: SIGNUP_EMAIL_IN_USE_MESSAGE };
    },
    [queryClient],
  );

  const register = React.useCallback(
    async (
      email: string,
      password: string,
      options?: { returnTo?: string },
    ): Promise<SignupSubmitResult> => {
      // The signup design collects no name; Better Auth requires one, so use
      // the email local-part as a starting display name.
      const name = email.split("@")[0] || email;
      const { error } = await signUp.email({
        email,
        password,
        name,
        callbackURL: buildVerifyEmailCallbackUrl(options?.returnTo),
      });
      if (error) {
        // Better Auth reports a taken address under either code depending on
        // the endpoint, so match the shared prefix rather than one spelling.
        if (error.code?.startsWith("USER_ALREADY_EXISTS")) {
          return signInExistingAccount(email, password);
        }
        // The address already has an unconfirmed account and this Join
        // supplied its password — the backend says so outright (BACK-72,
        // `auth/repeat-signup.ts`) rather than returning its usual
        // anti-enumeration fake success, precisely so this dialog can offer a
        // resend. Nothing was sent by this call, so the resend button is the
        // only thing that will get the user an email.
        if (error.code === "EMAIL_NOT_VERIFIED") {
          return { emailUnverified: true };
        }
        return { error: error.message ?? "Could not create your account." };
      }

      await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
      return {};
    },
    [queryClient, signInExistingAccount],
  );

  /**
   * Send the "reset your password" email. The backend answers 200 even for an
   * address it has never seen, so a null return means "the request went
   * through", never "that account exists".
   */
  const sendPasswordResetEmail = React.useCallback(
    async (email: string): Promise<string | null> => {
      try {
        await requestPasswordReset(email);
        return null;
      } catch (error) {
        if (error instanceof ApiRequestError && error.status === 429) {
          return "Too many attempts, try again later";
        }
        return UNKNOWN_ERROR_MESSAGE;
      }
    },
    [],
  );

  /**
   * Re-send the signup confirmation email from the post-Join "Confirm your
   * email" popup. Better Auth answers without revealing whether the address
   * still needs verifying, so a null return only means the request went through.
   * Points at the same `/auth/verify-email` landing page as the original
   * signup email, so a resent link behaves identically to the first one.
   */
  const sendConfirmationEmail = React.useCallback(
    async (email: string, options?: { returnTo?: string }): Promise<string | null> => {
      try {
        const { error } = await sendVerificationEmail({
          email,
          callbackURL: buildVerifyEmailCallbackUrl(options?.returnTo),
        });
        if (error) {
          if (error.status === 429) return "Too many attempts, try again later";
          return error.message ?? UNKNOWN_ERROR_MESSAGE;
        }
        return null;
      } catch {
        return UNKNOWN_ERROR_MESSAGE;
      }
    },
    [],
  );

  /**
   * Settings > Account "Save changes": request a change to `newEmail`. Better
   * Auth sends a confirmation link to the CURRENT address first (never leaks
   * whether `newEmail` already belongs to someone else — same response either
   * way) and, once that's clicked, sends a second link to `newEmail` itself.
   * Returns an error message to show inline, or null once the request went
   * through (not once the swap is complete — that only happens after both
   * links are clicked).
   */
  const requestEmailChange = React.useCallback(async (newEmail: string): Promise<string | null> => {
    try {
      const { error } = await changeEmail({
        newEmail,
        callbackURL: absoluteAppUrl(ROUTES.settings),
      });
      if (error) {
        if (error.status === 429) return "Too many attempts, try again later";
        return error.message ?? UNKNOWN_ERROR_MESSAGE;
      }
      return null;
    } catch {
      return UNKNOWN_ERROR_MESSAGE;
    }
  }, []);

  /**
   * Redeem the token from the emailed link and set the new password. The token
   * is single-use and short-lived, so a 400 here is almost always a link that
   * was already used or has expired.
   */
  const resetPassword = React.useCallback(
    async (token: string, newPassword: string): Promise<string | null> => {
      try {
        await confirmPasswordReset(token, newPassword);
        // The password just changed under the current session (if any) — drop
        // every cached answer rather than serve a stale one.
        await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
        return null;
      } catch (error) {
        if (error instanceof ApiRequestError) {
          if (error.status === 400) return RESET_LINK_INVALID_MESSAGE;
          if (error.status === 429) return "Too many attempts, try again later";
        }
        return UNKNOWN_ERROR_MESSAGE;
      }
    },
    [queryClient],
  );

  const logout = React.useCallback(async () => {
    const result = await endServerSession();
    if (!result.ended) {
      // Still signed in on the server: clearing local state now would show a
      // logged-out page over a live session (a shared device keeps it).
      showToast({ type: "error", text: LOGOUT_FAILED_MESSAGE, requestId: result.requestId });
      return;
    }
    // Clear the WHOLE cache, not just `me` — "My AIs" (and anything else
    // user-scoped) must not keep rendering the previous session's data. A
    // targeted removeQueries(ME_QUERY_KEY) left `my-characters` cached, so
    // navigating back to My AIs after logout still showed the old list.
    queryClient.clear();
    // A parked wizard run belongs to the user who left it — never hand it to
    // whoever logs in next on this browser.
    clearCreateAiGfDraft();
    // My AIs is an authed page; leaving the user there after logout is
    // confusing (and the empty/error state would flash before any auth
    // redirect kicked in). Land on /explore instead, the same way a fresh
    // guest visit does — it renders the logged-out homepage variation.
    router.push(ROUTES.explore);
  }, [queryClient, router]);

  /**
   * Read back what registration already stored, so the
   * "Personalize your experience" popup opens pre-filled instead of empty.
   * Resolves to null if the profile cannot be read — the popup then just shows
   * blank fields rather than blocking the user behind an error.
   */
  const loadPersonalization =
    React.useCallback(async (): Promise<SignupPersonalizationDefaults | null> => {
      try {
        const profile = await fetchProfile();
        return {
          username: profile.username,
          // Backend vocabulary is "female"/"male"; the popup speaks
          // "woman"/"man". Anything unexpected is left unselected rather than
          // silently shown as "Man".
          gender: profile.gender === "female" ? "woman" : profile.gender === "male" ? "man" : null,
        };
      } catch {
        return null;
      }
    }, []);

  /**
   * Persist the "Personalize your experience" popup (username + gender) to
   * the user's profile. Returns an error message to show inline,
   * or null on success (matching the modals' own `onSubmit` contract) — the
   * popup only closes when this resolves to null.
   *
   * Both fields are optional: registration already assigned a username and a
   * default gender, so an omitted field is left untouched rather than cleared.
   */
  const savePersonalization = React.useCallback(
    async (data: GenderPopupSavePayload): Promise<string | null> => {
      try {
        await updateProfile({
          username: data.username,
          // The popup speaks "woman"/"man"; the backend's gender vocabulary
          // is "female"/"male" (decisions.md D7). Map at this edge only.
          gender: data.gender && (data.gender === "woman" ? "female" : "male"),
        });
        await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
        return null;
      } catch (error) {
        if (error instanceof ApiRequestError) {
          if (error.status === 409) return "That username is already taken";
          if (error.status === 400) return error.message || "Invalid username.";
        }
        return "Could not save your changes right now. Please try again.";
      }
    },
    [queryClient],
  );

  /**
   * Persist the post-verification email-preference popup (marketing + product
   * notification flags). Returns an error message to show inline, or null
   * on success — the popup only closes when this resolves to null.
   */
  const saveEmailPreferences = React.useCallback(
    async (data: EmailPreferenceSavePayload): Promise<string | null> => {
      try {
        await updateEmailPreferences({
          marketing_notifications: data.marketing,
          product_notifications: data.product,
        });
        await queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY });
        return null;
      } catch {
        return "Could not save your changes right now. Please try again.";
      }
    },
    [queryClient],
  );

  return {
    login,
    register,
    signInWithGoogle,
    /** False when this brand cannot complete a Google sign-in — hide the button. */
    isGoogleAvailable: googleProviderId !== null,
    logout,
    loadPersonalization,
    savePersonalization,
    saveEmailPreferences,
    sendPasswordResetEmail,
    sendConfirmationEmail,
    requestEmailChange,
    resetPassword,
  };
}
