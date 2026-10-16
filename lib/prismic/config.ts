/**
 * Prismic repository name (the "xxxx" in xxxx.prismic.io).
 *
 * NEXT_PUBLIC_-prefixed like `NEXT_PUBLIC_API_BASE_URL` in `lib/api/config.ts`
 * — it is needed client-side too, for preview/link resolution — but unlike
 * that one there is no safe local-dev fallback (no workspace name is stable
 * across environments), so this throws whenever it's missing.
 *
 * Deliberately NOT read into a top-level `const` the way `API_BASE_URL` is:
 * that would make merely *importing* this module throw in any process where
 * the env var isn't set (tests, tooling, Storybook), even if nothing there
 * needs a Prismic client. Callers resolve it on demand instead — see
 * `createClient()` in `./client.ts`.
 */
export function resolveRepositoryName(): string {
  const raw = process.env.NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME?.trim();

  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME is not set. Copy .env.local.example " +
        "and set it to the connected Prismic workspace's repository name.",
    );
  }

  return raw;
}

/**
 * Prismic API access token — SERVER-ONLY. Must never be prefixed with
 * NEXT_PUBLIC_ or it ships in the client bundle. Optional: only required if
 * the workspace is private (the default for a new workspace).
 */
export function resolveAccessToken(): string | undefined {
  return process.env.PRISMIC_ACCESS_TOKEN?.trim() || undefined;
}
