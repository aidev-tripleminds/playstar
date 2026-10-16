/**
 * A host that serves the chrome-less funnel instead of the main site, and the
 * funnel route it rewrites onto.
 *
 * A list, not a single `FUNNEL_HOST` — a second funnel brand needs its own
 * route, and R14.3 requires that to be a config change, not a code change
 * (D24).
 */
export type FunnelHostRoute = {
  host: string;
  path: string;
};

export const FUNNEL_HOSTS: FunnelHostRoute[] = [
  { host: "spicestars.network", path: "/spicestars" },
];
