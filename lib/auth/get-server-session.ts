import { headers } from "next/headers";

import { API_BASE_URL } from "@/lib/api/config";
import { fetchBackend } from "@/lib/api/report-api-failure";
import { runInRequestContext } from "@/lib/request-context";

/**
 * Server-side session lookup for gating SSR content before any HTML ships —
 * e.g. redirecting a logged-in visitor away from "/" without the client-side
 * flash a `useSession()` check would cause. Forwards the incoming request's
 * `Cookie` header straight to the backend, mirroring how `apiFetch` attaches
 * it in the browser (see `CLIENT_API_ORIGIN` in `lib/api/config.ts`).
 *
 * `next/headers` only works in Server Components/Route Handlers — do not call
 * this from a `"use client"` file.
 *
 * A backend outage/timeout/malformed response must not 500 the page for
 * anonymous visitors — treat any transport or parsing failure the same as
 * "no session" and let the client-side check in `useMe()` recover once the
 * backend is back.
 *
 * Runs in the request's log context, so the backend call carries the page
 * request's `x-request-id` (INF-83). The page is already dynamic: it reads the
 * cookie.
 */
export async function hasServerSession(): Promise<boolean> {
  const cookie = (await headers()).get("cookie");
  if (!cookie) return false;

  try {
    const response = await runInRequestContext(() =>
      fetchBackend(`${API_BASE_URL}/api/v1/auth/get-session`, {
        headers: { cookie },
        cache: "no-store",
      }),
    );
    if (!response.ok) return false;

    const data = (await response.json()) as { user?: unknown } | null;
    return Boolean(data?.user);
  } catch {
    return false;
  }
}
