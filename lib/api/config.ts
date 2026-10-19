/**
 * This demo does not call a backend. The exports stay so older modules compile,
 * and none of them point at a live API host.
 */

export const API_BASE_URL = "";

export function isNonProductionClientTarget(): boolean {
  return true;
}

export const API_PATH_PREFIX = "/api";

export const CLIENT_API_ORIGIN =
  typeof window === "undefined" ? "http://127.0.0.1" : window.location.origin;

export function newRequestId(): string | undefined {
  return undefined;
}

export function resolveAppPublicHost(): string | undefined {
  return undefined;
}

export const BRAND_HOST_HEADER = "X-Forwarded-Host";

export function absoluteAppUrl(path: string): string {
  return path;
}
