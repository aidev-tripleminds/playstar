import { resolveAppPublicHost } from "@/lib/api/config";

const PATH_SEGMENT_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type ContentPagePathSource = {
  uid: string | null;
  data: {
    subfolder?: string | null;
  };
};

function normalizePath(raw: string | null | undefined): string | undefined {
  if (!raw?.trim()) return "";

  const path = raw.trim().replace(/^\/+|\/+$/g, "");
  if (!path) return "";

  const segments = path.split("/");
  return segments.every((segment) => PATH_SEGMENT_PATTERN.test(segment))
    ? segments.join("/")
    : undefined;
}

/** Returns the canonical app path for a content page, or undefined for invalid authored input. */
export function contentPagePath(document: ContentPagePathSource): string | undefined {
  if (!document.uid || !PATH_SEGMENT_PATTERN.test(document.uid)) return undefined;

  const subfolder = normalizePath(document.data.subfolder);
  if (subfolder === undefined) return undefined;

  return `/${subfolder ? `${subfolder}/` : ""}${document.uid}`;
}

/**
 * Resolves an authored redirect to a same-origin absolute path. Empty values
 * disable redirects; invalid/external values fail loudly instead of becoming
 * an open redirect or silently doing the wrong thing.
 */
export function contentPageRedirectPath(raw: string | null | undefined): string | undefined {
  if (!raw?.trim()) return undefined;

  const path = normalizePath(raw);
  if (!path) {
    throw new Error(`Invalid Prismic content-page redirect: ${JSON.stringify(raw)}`);
  }

  return `/${path}`;
}

/** Absolute public URL used by canonical metadata and sitemap.xml. */
export function absoluteContentPageUrl(path: string, host = resolveAppPublicHost()): string {
  if (!host) {
    throw new Error("APP_PUBLIC_HOST is required to generate canonical and sitemap URLs.");
  }

  const protocol = /^(?:localhost|127\.0\.0\.1)(?::|$)/.test(host) ? "http" : "https";
  return `${protocol}://${host}${path}`;
}
