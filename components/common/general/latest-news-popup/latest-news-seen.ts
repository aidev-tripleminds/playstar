import { readBrowserStorage, writeBrowserStorage } from "@/lib/browser-storage";

import { LATEST_NEWS_SEEN_STORAGE_KEY, type LatestNewsItem } from "./latest-news-popup.constants";

/**
 * Keeps the entry from growing without bound on a shared/kiosk browser.
 * A real user's own dismissed ids are never the ones FIFO-evicted.
 */
const MAX_ENTRIES = 200;

function readAll(): string[] {
  const raw = readBrowserStorage(LATEST_NEWS_SEEN_STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function writeAll(ids: string[]): void {
  writeBrowserStorage(LATEST_NEWS_SEEN_STORAGE_KEY, JSON.stringify(ids.slice(-MAX_ENTRIES)));
}

export function isImportantNewsItem(item: LatestNewsItem): boolean {
  return item.important !== false;
}

export function getUnseenNewsItems(items: readonly LatestNewsItem[]): LatestNewsItem[] {
  const seen = new Set(readAll());
  return items.filter(
    (item) => isImportantNewsItem(item) && Boolean(item.id) && !seen.has(item.id),
  );
}

export function markNewsItemsSeen(ids: readonly string[]): void {
  const existing = readAll();
  const next = [...existing];
  for (const id of ids) {
    if (!id || next.includes(id)) continue;
    next.push(id);
  }
  if (next.length === existing.length) return;
  writeAll(next);
}
