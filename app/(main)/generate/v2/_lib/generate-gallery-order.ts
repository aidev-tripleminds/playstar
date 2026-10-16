import type { GenerateGalleryItem, GenerateProcessingItem } from "./types";

export type GenerateGalleryEntry =
  | { type: "processing"; item: GenerateProcessingItem }
  | { type: "media"; item: GenerateGalleryItem };

function createdAtMillis(value: string | undefined): number | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

/**
 * In-progress cards stay at the top. Failed cards join the completed images
 * in creation order, newest first, without reshuffling the image list.
 */
export function orderGenerateGalleryEntries(
  processingItems: GenerateProcessingItem[],
  items: GenerateGalleryItem[],
): GenerateGalleryEntry[] {
  const active: GenerateGalleryEntry[] = [];
  const failed: GenerateProcessingItem[] = [];

  for (const item of processingItems) {
    if (item.state === "moderation-issue") failed.push(item);
    else active.push({ type: "processing", item });
  }

  const datedFailed: { item: GenerateProcessingItem; index: number; time: number }[] = [];
  const undatedFailed: GenerateProcessingItem[] = [];

  failed.forEach((item, index) => {
    const time = createdAtMillis(item.createdAt);
    if (time === null) undatedFailed.push(item);
    else datedFailed.push({ item, index, time });
  });

  datedFailed.sort((a, b) => b.time - a.time || a.index - b.index);

  const settled: GenerateGalleryEntry[] = undatedFailed.map((item) => ({
    type: "processing",
    item,
  }));

  let failureIndex = 0;
  for (const item of items) {
    const itemTime = createdAtMillis(item.createdAt);
    while (failureIndex < datedFailed.length) {
      const failure = datedFailed[failureIndex];
      if (!failure) break;
      // An image with the same timestamp stays above the failure.
      // An image with no timestamp keeps its place in the list.
      if (itemTime === null || failure.time <= itemTime) break;
      settled.push({ type: "processing", item: failure.item });
      failureIndex += 1;
    }
    settled.push({ type: "media", item });
  }

  while (failureIndex < datedFailed.length) {
    const failure = datedFailed[failureIndex];
    if (failure) settled.push({ type: "processing", item: failure.item });
    failureIndex += 1;
  }

  return [...active, ...settled];
}
