/**
 * Shared "Confirm your email" copy for the two places that gate on a verified
 * address: post-signup (Signup's confirm-email popup) and post-login (Login's,
 * BACK-72 — a sign-in attempt with correct credentials but an unverified
 * address). Both share the same `sendConfirmationEmail` call, but not the
 * same buttons: the dialog offers exactly one action, decided by whether an
 * email was just sent.
 *
 * - Brand-new signup: registration itself sent the confirmation email, so
 *   there is nothing to re-request — Okay alone.
 * - Repeat Join on a known-unverified address, and the unverified-login
 *   check (which sends nothing at all): Resend alone, enabled on open so the
 *   first click works, then disabled for the cooldown. The backend's own
 *   per-address throttle (`VERIFY_RESEND_COOLDOWN_SECONDS`,
 *   `auth-lockout.ts`) still applies on top.
 */
export const CONFIRM_EMAIL_TITLE = "Confirm your email";
export const CONFIRM_EMAIL_DESCRIPTION =
  "Please check your inbox for a confirmation link to verify your email and access to your account.";
export const CONFIRM_EMAIL_RESEND_LABEL = "Resend confirmation email";
