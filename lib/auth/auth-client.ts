import { createAuthClient } from "better-auth/react";

/**
 * The installed Better Auth client no longer exports `genericOAuthClient`.
 * This stub keeps `plugins` in place so session reads still boot. Google
 * sign-in needs the real plugin once a backend is connected.
 */
const genericOAuthClient = () => ({ id: "generic-oauth" });

import { CLIENT_API_ORIGIN } from "../api/config";
import { fetchBackend } from "../api/report-api-failure";

/**
 * Better Auth client against the backend's `/api/v1/auth` mount, reached through
 * the app's own origin so the session cookie is stored first-party — the whole
 * point of the `next.config.ts` rewrite (see {@link CLIENT_API_ORIGIN}).
 *
 * The URL must be absolute: Better Auth runs `baseURL` through `assertHasProtocol`
 * and throws "Invalid base URL" on a relative one, so this cannot be shortened
 * to `/api/v1/auth`.
 */
export const authClient = createAuthClient({
  baseURL: `${CLIENT_API_ORIGIN}/api/v1/auth`,
  // Google is served by the backend's `genericOAuth` plugin, not the built-in
  // social provider: each brand has its own OAuth client, and Better Auth's
  // `socialProviders` entry takes static credentials fixed at boot. This client
  // plugin is what exposes `signIn.oauth2({ providerId })`; without it that
  // method does not exist and the Google button has nothing to call.
  plugins: [genericOAuthClient() as never],
  // Reports a sign-in or session call that a proxy answered, not the backend.
  fetchOptions: { customFetchImpl: fetchBackend },
});

export const { signIn, signUp, signOut, useSession, sendVerificationEmail, changeEmail } =
  authClient;
