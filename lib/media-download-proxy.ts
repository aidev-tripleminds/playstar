/**
 * Validation for GET /api/v1/characters/media/download-proxy.
 *
 * The live backend does not ship this route (confirmed against the test
 * OpenAPI). The Next.js handler at the same path claims it before the `/api`
 * rewrite, fetches allowlisted media server-side, and returns it as an
 * attachment — which is also how the spec described the missing backend.
 *
 * Host allowlist is the SSRF gate: anything else is rejected before fetch.
 */

export const MEDIA_DOWNLOAD_DEFAULT_FILENAME = "download.bin";
export const MEDIA_DOWNLOAD_PROXY_MAX_REDIRECTS = 2;

const FILENAME_SAFE_PATTERN = /[^A-Za-z0-9._-]+/g;

export function isAllowedMediaDownloadHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (host === "t3.storage.dev" || host === "s3.storage.dev") return true;
  if (host.endsWith(".t3.storage.dev")) return true;
  return host.endsWith(".t3.tigrisfiles.io");
}

export type ParsedMediaDownloadUrl = { ok: true; url: URL } | { ok: false; message: string };

export function parseMediaDownloadUrl(raw: string | null | undefined): ParsedMediaDownloadUrl {
  const value = raw?.trim();
  if (!value) {
    return { ok: false, message: "url is required" };
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, message: "url must be an absolute http(s) URL" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, message: "url must be http(s)" };
  }

  if (!isAllowedMediaDownloadHost(parsed.hostname)) {
    return { ok: false, message: "url host is not an allowlisted media host" };
  }

  return { ok: true, url: parsed };
}

export function sanitizeDownloadFilename(name?: string | null): string {
  const trimmed = name?.trim() ?? "";
  const sanitized = trimmed.replace(FILENAME_SAFE_PATTERN, "-").replace(/^\.+/, "").slice(0, 180);
  return sanitized || MEDIA_DOWNLOAD_DEFAULT_FILENAME;
}

export function mediaDownloadContentDisposition(name?: string | null): string {
  return `attachment; filename="${sanitizeDownloadFilename(name)}"`;
}

export function mediaDownloadProxyError(statusCode: number, error: string, message: string) {
  return { error, message, statusCode };
}

export async function fetchAllowlistedMedia(
  url: URL,
  init?: Pick<RequestInit, "signal">,
): Promise<Response> {
  let current = url;

  for (let hop = 0; hop <= MEDIA_DOWNLOAD_PROXY_MAX_REDIRECTS; hop += 1) {
    const response = await fetch(current, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: init?.signal,
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        throw new Error("REDIRECT_WITHOUT_LOCATION");
      }
      const next = parseMediaDownloadUrl(new URL(location, current).toString());
      if (!next.ok) {
        throw new Error("REDIRECT_NOT_ALLOWLISTED");
      }
      current = next.url;
      continue;
    }

    return response;
  }

  throw new Error("TOO_MANY_REDIRECTS");
}
