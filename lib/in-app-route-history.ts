/**
 * The page the user was on before the current one, within this SPA session.
 *
 * `window.history.length` cannot answer "is there a page to go back to?": it
 * counts entries from before the site was opened, and every open modal pushes
 * a same-URL entry of its own (`lib/modal-history.ts`). This remembers real
 * route changes only, so a fresh tab has no previous route.
 */
let currentRoute: string | null = null;
let previousRoute: string | null = null;

/** Called by the main layout on every pathname change. */
export function recordInAppRoute(pathname: string): void {
  if (pathname === currentRoute) return;
  previousRoute = currentRoute;
  currentRoute = pathname;
}

/** The route before the current one, or null when this is the first page of the visit. */
export function previousInAppRoute(): string | null {
  return previousRoute;
}

/** Exported for tests — module state otherwise outlives a test case. */
export function resetInAppRouteHistory(): void {
  currentRoute = null;
  previousRoute = null;
}
