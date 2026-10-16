import { zipSync } from "fflate";

import { characterMediaDownloadProxyHref } from "@/lib/api/character-media";

/**
 * Client download for generated gallery media.
 *
 * Single file: navigate the browser at the same-origin download-proxy so the
 * native download manager handles it (videos must not be buffered into JS).
 * That path is a Next.js route — the live backend does not expose it.
 *
 * Two or more: fetch each file through that same same-origin proxy (S3 is not
 * reliably CORS-readable), pack with store-only ZIP (media is already
 * compressed), then save one archive. There is no zip endpoint in the spec.
 */

export const MEDIA_DOWNLOAD_ZIP_CONCURRENCY = 4;
export const MEDIA_DOWNLOAD_ZIP_NAME_PREFIX = "spicestars-media";

export type DownloadableMedia = {
  id: string;
  mediaId?: string;
  src?: string | { src: string };
  videoSrc?: string;
  /** The ≤1280 px HD rendition (see `MediaCardSources.fullSrc`). */
  fullSrc?: string;
  /**
   * The backend's `blurred`: the viewer has no original, so the download is
   * the blurred HD rendition (`fullSrc`), else the blurred `videoSrc` / `src`.
   */
  blurred?: boolean;
  kind?: "image" | "video";
  alt?: string;
};

export type DownloadMediaResult =
  | { status: "empty" }
  | { status: "single"; failed: number }
  | { status: "zip"; saved: number; failed: number }
  | { status: "aborted" };

export type DownloadMediaOptions = {
  signal?: AbortSignal;
  now?: Date;
};

const HTTP_URL_PATTERN = /^https?:\/\//i;
const FILENAME_UNSAFE_PATTERN = /[<>:"/\\|?*\u0000-\u001f]+/g;

function isAbortError(error: unknown) {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

function throwIfAborted(signal?: AbortSignal) {
  if (!signal?.aborted) return;
  throw signal.reason instanceof Error ? signal.reason : new DOMException("Aborted", "AbortError");
}

export function isRemoteMediaUrl(url: string | undefined): url is string {
  return Boolean(url && HTTP_URL_PATTERN.test(url));
}

export function resolveDownloadableMediaUrl(item: DownloadableMedia): string | undefined {
  if (item.blurred === true && isRemoteMediaUrl(item.fullSrc)) return item.fullSrc;
  if (isRemoteMediaUrl(item.videoSrc)) return item.videoSrc;
  if (typeof item.src === "string" && isRemoteMediaUrl(item.src)) return item.src;
  if (item.src && typeof item.src === "object" && isRemoteMediaUrl(item.src.src)) {
    return item.src.src;
  }
  return undefined;
}

function extensionFromPathname(pathname: string): string | undefined {
  const match = pathname.match(/\.([a-z0-9]{2,5})$/i);
  return match?.[1]?.toLowerCase();
}

export function mediaDownloadExtension(item: DownloadableMedia): string {
  const url = resolveDownloadableMediaUrl(item);
  if (url) {
    try {
      const ext = extensionFromPathname(new URL(url).pathname);
      if (ext) return ext;
    } catch {
      const path = url.split("?")[0] ?? url;
      const ext = extensionFromPathname(path);
      if (ext) return ext;
    }
  }

  return item.kind === "video" ? "mp4" : "webp";
}

export function mediaDownloadFilename(item: DownloadableMedia): string {
  const id = item.mediaId || item.id;
  const kind = item.kind === "video" ? "video" : "image";
  const ext = mediaDownloadExtension(item);
  const raw = `spicestars-${kind}-${id}.${ext}`;
  return raw.replace(FILENAME_UNSAFE_PATTERN, "-").slice(0, 180);
}

export function uniqueDownloadFilenames(filenames: string[]): string[] {
  const used = new Set<string>();
  return filenames.map((filename) => {
    if (!used.has(filename)) {
      used.add(filename);
      return filename;
    }

    const dot = filename.lastIndexOf(".");
    const base = dot === -1 ? filename : filename.slice(0, dot);
    const ext = dot === -1 ? "" : filename.slice(dot);
    let n = 2;
    let candidate = `${base}-${n}${ext}`;
    while (used.has(candidate)) {
      n += 1;
      candidate = `${base}-${n}${ext}`;
    }
    used.add(candidate);
    return candidate;
  });
}

export function mediaDownloadZipName(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${MEDIA_DOWNLOAD_ZIP_NAME_PREFIX}-${year}-${month}-${day}.zip`;
}

/**
 * Hand a URL to the browser's own download manager.
 *
 * Exported because the GDPR data-export dialog needs exactly this: a presigned
 * S3 URL whose object carries `Content-Disposition: attachment`, which must be
 * navigated rather than fetched (buffering a multi-gigabyte archive into JS is
 * not an option, and S3 is not reliably CORS-readable).
 */
export function triggerAnchorDownload(href: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  triggerAnchorDownload(objectUrl, filename);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index]!, index);
    }
  }

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

type ResolvedDownload = {
  url: string;
  filename: string;
};

function resolvedDownloads(items: DownloadableMedia[]): {
  files: ResolvedDownload[];
  skipped: number;
} {
  const files: ResolvedDownload[] = [];
  let skipped = 0;
  for (const item of items) {
    const url = resolveDownloadableMediaUrl(item);
    if (!url) {
      skipped += 1;
      continue;
    }
    files.push({ url, filename: mediaDownloadFilename(item) });
  }
  return { files, skipped };
}

async function fetchProxyBytes(href: string, signal?: AbortSignal): Promise<Uint8Array> {
  const response = await fetch(href, { credentials: "include", signal });
  if (!response.ok) {
    throw new Error(`DOWNLOAD_FAILED_${response.status}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}

async function downloadZip(
  files: ResolvedDownload[],
  options: DownloadMediaOptions,
): Promise<DownloadMediaResult> {
  const filenames = uniqueDownloadFilenames(files.map((file) => file.filename));
  const zipFiles: Record<string, Uint8Array> = {};

  const fetched = await mapPool(files, MEDIA_DOWNLOAD_ZIP_CONCURRENCY, async (file, index) => {
    throwIfAborted(options.signal);
    try {
      const bytes = await fetchProxyBytes(
        characterMediaDownloadProxyHref(file.url, filenames[index]),
        options.signal,
      );
      return { filename: filenames[index]!, bytes };
    } catch (error) {
      if (isAbortError(error)) throw error;
      return null;
    }
  });

  throwIfAborted(options.signal);

  for (const entry of fetched) {
    if (!entry) continue;
    zipFiles[entry.filename] = entry.bytes;
  }

  const saved = Object.keys(zipFiles).length;
  const failed = files.length - saved;
  if (saved === 0) {
    return { status: "empty" };
  }

  // Images/videos are already compressed; store-only ZIP is faster and smaller
  // in CPU than deflating them again.
  const zipped = zipSync(zipFiles, { level: 0 });
  triggerBlobDownload(
    new Blob([zipped as BlobPart], { type: "application/zip" }),
    mediaDownloadZipName(options.now),
  );

  return { status: "zip", saved, failed };
}

/**
 * Save one gallery item, or many as a zip. One selected item is never zipped.
 */
export async function downloadGeneratedMedia(
  items: DownloadableMedia[],
  options: DownloadMediaOptions = {},
): Promise<DownloadMediaResult> {
  throwIfAborted(options.signal);

  const { files, skipped } = resolvedDownloads(items);
  if (files.length === 0) return { status: "empty" };

  if (files.length === 1) {
    const file = files[0]!;
    triggerAnchorDownload(characterMediaDownloadProxyHref(file.url, file.filename), file.filename);
    return { status: "single", failed: skipped };
  }

  try {
    const result = await downloadZip(files, options);
    if (result.status === "zip") {
      return { ...result, failed: result.failed + skipped };
    }
    return result;
  } catch (error) {
    if (isAbortError(error)) return { status: "aborted" };
    throw error;
  }
}
