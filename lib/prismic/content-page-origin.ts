import { headers } from "next/headers";

import { absoluteContentPageUrl } from "./content-page-path";

/** The serving origin for canonical metadata and sitemap URLs (BACK-240). */
export async function contentPageOrigin(): Promise<URL> {
  const requestHeaders = await headers();
  const host = (
    requestHeaders.get("x-forwarded-host")?.split(",")[0] || requestHeaders.get("host")
  )?.trim();

  if (!host) return new URL(absoluteContentPageUrl("/"));

  const origin = new URL(absoluteContentPageUrl("/", host));
  if (/[\s/\\?#@]/.test(host) || origin.username || origin.password) {
    throw new Error("Invalid request host for canonical metadata.");
  }
  return origin;
}
