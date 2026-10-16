import { apiFetch } from "./client";

/**
 * Per-brand runtime configuration, resolved by the backend from the request's
 * origin. Unauthenticated — it is what the app needs before anyone signs in.
 */
export type Bootstrap = {
  appName: string;
  frontendUrl: string | null;
  /**
   * Which social sign-ins THIS brand can actually complete.
   *
   * `google` is `null` unless the backend has a usable OAuth client for this
   * brand AND has it mounted — the backend answers from the providers loaded at
   * its last restart, not from its config table, so a value here means the
   * button will work rather than merely that a credential exists somewhere.
   *
   * `providerId` is brand-specific (`google-<brand slug>`) because each brand
   * may front its own Google app; it is the id handed to `signIn.oauth2`.
   */
  // Optional during rollout: an older backend still supports redirect sign-in.
  // Public client ID only; the OAuth secret stays on the backend.
  auth: { google: { providerId: string; clientId?: string } | null };
  /** Public hosted SDK configuration; absent/null until this domain is configured. */
  ageVerification?: { accountId: string; siteKey: string } | null;
  features: Record<string, unknown>;
};

export function fetchBootstrap(): Promise<Bootstrap> {
  return apiFetch<Bootstrap>("/api/v1/bootstrap");
}
