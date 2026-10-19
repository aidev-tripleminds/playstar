import type { MediaPreviewItem } from "@/components/common/image-preview/media-preview/types";
import { dummyImage } from "@/lib/dummy-images";
import type {
  CharacterCardUrls,
  CharacterMediaRef,
  CharacterVideoJobStatus,
  CreateCharacterImageBody,
  CreateCharacterImageResponse,
  CreateCharacterVideoBody,
  CreateCharacterVideoResponse,
  EditCharacterImageBody,
  EditCharacterVideoBody,
  ExtendCharacterVideoBody,
  UsersCharacterMediaItem,
  UsersCharacterMediaResponse,
} from "@/lib/api/types";
import { characterCardSrc, storedMediaCardSources } from "@/lib/media-card-sources";
import { capTrimmedUserPrompt } from "@/lib/prompt-limits";

/**
 * Shared generate-media contract for v1 and v2.
 *
 * Transport lives in `lib/api/character-media` (same as every other backend
 * call). This module is the feature layer: defaulted request bodies, response
 * mapping, and the create-image / edit-image / edit-video / extend-video /
 * create-video orchestration both workspaces run through.
 */

export const GENERATE_DEFAULT_NUM_IMAGES = 1;
export const GENERATE_DEFAULT_VIDEO_DURATION = 5;
export const GENERATE_FALLBACK_IMAGE_ALT = "Generated image";

function optionalTrimmed(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

/** User-typed prompt. The backend counts length after trim and rejects past `PROMPT_MAX_LENGTH`. */
function optionalCappedPrompt(value?: string | null): string | undefined {
  const capped = capTrimmedUserPrompt(value);
  return capped || undefined;
}

export const GENERATE_PREVIEW_DEFAULT_CHECKPOINT = "Klams AI";
export const GENERATE_PREVIEW_DEFAULT_ASPECT_RATIO = "16:9";

const POSTED_AT_MINUTE_MS = 60_000;
const POSTED_AT_HOUR_MS = 60 * POSTED_AT_MINUTE_MS;
const POSTED_AT_DAY_MS = 24 * POSTED_AT_HOUR_MS;
const POSTED_AT_WEEK_MS = 7 * POSTED_AT_DAY_MS;

/**
 * FRONT-787: relative time through one week, then a TikTok-style calendar date.
 * Same year is month-day (`9-8`). Another year prefixes the year (`2026-8-9`).
 */
export function formatGeneratePreviewPostedAt(
  createdAt: string | null | undefined,
  now: Date = new Date(),
): string {
  if (!createdAt) return "";
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return "";

  const elapsed = Math.max(0, now.getTime() - created.getTime());
  if (elapsed < POSTED_AT_HOUR_MS) {
    const minutes = Math.max(1, Math.floor(elapsed / POSTED_AT_MINUTE_MS));
    return `${minutes} min ago`;
  }
  if (elapsed < POSTED_AT_DAY_MS) {
    const hours = Math.floor(elapsed / POSTED_AT_HOUR_MS);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  }
  if (elapsed < POSTED_AT_WEEK_MS) {
    const days = Math.floor(elapsed / POSTED_AT_DAY_MS);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  }
  if (elapsed < POSTED_AT_WEEK_MS + POSTED_AT_DAY_MS) {
    return "1 week ago";
  }

  const month = created.getMonth() + 1;
  const day = created.getDate();
  if (created.getFullYear() !== now.getFullYear()) {
    return `${created.getFullYear()}-${month}-${day}`;
  }
  return `${month}-${day}`;
}

export function getGeneratePreviewMetadata(
  item?: {
    checkpoint?: string | null;
    aspectRatio?: string | null;
  } | null,
): string[] {
  return [
    item?.checkpoint?.trim() || GENERATE_PREVIEW_DEFAULT_CHECKPOINT,
    item?.aspectRatio?.trim() || GENERATE_PREVIEW_DEFAULT_ASPECT_RATIO,
  ];
}

/**
 * Action, clothing, and location are stored on the prompt when custom text is empty.
 * The request carries option keys (`tropical_beach`), so they are shown as words
 * until the stored row brings the backend's own wording.
 */
function displayPromptFromGeneration(body: {
  prompt?: string | null;
  action?: string | null;
  clothing?: string | null;
  location?: string | null;
}): string | undefined {
  const prompt = optionalTrimmed(body.prompt);
  if (prompt) return prompt;

  const scene = [body.action, body.clothing, body.location]
    .map((part) => optionalTrimmed(part)?.replaceAll("_", " "))
    .filter((part): part is string => Boolean(part));
  return scene.length > 0 ? scene.join(", ") : undefined;
}

type GeneratePreviewCharacter = CharacterCardUrls & {
  id: string;
  name: string;
  webp_image_url_s3?: string | null;
  image_url_s3?: string | null;
  presigned_url?: string | null;
};

export function resolveGeneratedMediaCharacter(
  item:
    | {
        characterId?: string | null;
        characterName?: string;
        characterImageSrc?: string;
      }
    | null
    | undefined,
  characters?: GeneratePreviewCharacter[],
): { name?: string; imageSrc?: string } | null {
  if (!item?.characterId) return null;

  const character = characters?.find((entry) => entry.id === item.characterId);
  const name = item.characterName?.trim() || character?.name || undefined;
  const imageSrc =
    item.characterImageSrc ||
    (character && characterCardSrc(character)) ||
    character?.presigned_url ||
    undefined;

  if (!name && !imageSrc) return null;
  return { name, imageSrc };
}

export type GenerateMediaKind = "image" | "video";

/** Gallery row both generate versions can render after an API result. */
export type GeneratedMediaItem = Pick<MediaPreviewItem, "cardSrc" | "posterSrc" | "fullSrc"> & {
  id: string;
  src: string;
  alt?: string;
  description?: string;
  videoSrc?: string;
  mediaId?: string;
  characterId?: string | null;
  characterName?: string;
  characterImageSrc?: string;
  kind: GenerateMediaKind;
  isNsfw?: boolean;
  /**
   * The backend's `blurred`: `src` is already a safe still. A blurred video's
   * `videoSrc` is its blurred card video, or absent while it has none.
   */
  blurred?: boolean;
  /** Mirrors `can_generate_from`: false when the image cannot seed an edit or animation. */
  canGenerateFrom?: boolean;
  prompt?: string;
  pose?: string;
  checkpoint?: string | null;
  aspectRatio?: string | null;
  /** ISO timestamp from the media row's `created_at`. */
  createdAt?: string;
};

export type GenerateMediaRequest =
  | {
      type: "create-image";
      body: CreateCharacterImageBody;
      characterImageSrc?: string;
    }
  | {
      type: "edit-image";
      body: EditCharacterImageBody;
    }
  | {
      type: "edit-video";
      body: EditCharacterVideoBody;
    }
  | {
      type: "extend-video";
      body: ExtendCharacterVideoBody;
    }
  | { type: "create-video"; body: CreateCharacterVideoBody };

export type BuildCreateImageInput = {
  sourceMediaId?: string;
  prompt?: string;
  characterId?: string | null;
  characterName?: string;
  characterImageSrc?: string;
  action?: string | null;
  clothing?: string | null;
  location?: string | null;
  aspectRatio?: string | null;
  numImages?: number;
};

export type BuildCreateVideoInput = {
  characterId: string;
  sourceMediaId: string;
  characterName?: string;
  prompt?: string;
  duration?: number;
  resolution?: string;
  /** Video-list action only — do not forward the source image's action. */
  action?: string | null;
  clothing?: string | null;
  location?: string | null;
  aspectRatio?: string | null;
};

export type BuildTextToVideoInput = {
  characterId: string;
  characterName?: string;
  prompt?: string;
  duration?: number;
  resolution?: string;
  /** Video-list action labels, already joined when the timeline has several clips. */
  action?: string | null;
  clothing?: string | null;
  location?: string | null;
  aspectRatio?: string | null;
};

export type BuildEditImageInput = {
  sourceMediaId: string;
  prompt?: string;
  numImages?: number;
};

export type BuildEditVideoInput = {
  sourceMediaId: string;
  prompt?: string;
  duration?: number;
  resolution?: string;
  aspectRatio?: string | null;
};

export type BuildExtendVideoInput = BuildEditVideoInput;

/**
 * Mock ChooseTemplate ids (`template-1`) are not Character.id / CharacterMedia.id
 * values. create-image / create-video must only receive a real persisted id.
 */
export function isPersistedCharacterId(id: string | null | undefined): id is string {
  const value = id?.trim();
  if (!value) return false;
  return !/^template-\d+$/i.test(value);
}

type GenerationSourceItem = { kind?: string; mediaId?: string; canGenerateFrom?: boolean };

/** Edit and animate feed the image back to the provider, which needs `can_generate_from`. */
function canSeedGeneration(item: GenerationSourceItem | null | undefined) {
  return Boolean(item && item.kind === "image" && item.mediaId && item.canGenerateFrom !== false);
}

export function canAnimateGeneratedMedia(
  item: (GenerationSourceItem & { characterId?: string | null }) | null | undefined,
) {
  return canSeedGeneration(item) && Boolean(item?.characterId);
}

export function canEditGeneratedMedia(item: GenerationSourceItem | null | undefined) {
  return canSeedGeneration(item);
}

export function canRemixGeneratedMedia(
  item: { kind?: string; mediaId?: string } | null | undefined,
) {
  return Boolean(item && item.kind === "image" && item.mediaId);
}

/**
 * FRONT-611: "Set as profile picture" is owner-only and only for an image
 * generated from a character the caller owns. Videos and character-less
 * generations must not show the action.
 */
export function canSetGeneratedMediaAsProfilePicture(
  item:
    | {
        id?: string;
        mediaId?: string;
        kind?: string;
        characterId?: string | null;
        videoSrc?: string;
      }
    | null
    | undefined,
  ownedCharacters?: { id: string }[] | null,
): boolean {
  if (!item) return false;
  if (item.kind === "video" || item.videoSrc) return false;
  if (!item.characterId) return false;
  if (!characterMediaIdFromGalleryItem(item)) return false;
  return Boolean(ownedCharacters?.some((character) => character.id === item.characterId));
}

export function buildCreateImageRequest(input: BuildCreateImageInput): GenerateMediaRequest {
  const prompt = optionalCappedPrompt(input.prompt);
  const name = optionalTrimmed(input.characterName);
  const action = optionalTrimmed(input.action);
  const clothing = optionalTrimmed(input.clothing);
  const location = optionalTrimmed(input.location);
  const aspectRatio = optionalTrimmed(input.aspectRatio);
  const numImages = Math.max(1, input.numImages ?? GENERATE_DEFAULT_NUM_IMAGES);

  return {
    type: "create-image",
    body: {
      num_images: numImages,
      ...(prompt ? { prompt } : {}),
      ...(isPersistedCharacterId(input.sourceMediaId)
        ? { source_media_id: input.sourceMediaId }
        : {}),
      ...(isPersistedCharacterId(input.characterId) ? { character_id: input.characterId } : {}),
      ...(name ? { name } : {}),
      ...(action ? { action } : {}),
      ...(clothing ? { clothing } : {}),
      ...(location ? { location } : {}),
      ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
    },
    ...(input.characterImageSrc ? { characterImageSrc: input.characterImageSrc } : {}),
  };
}

export function buildCreateVideoRequest(
  input: BuildCreateVideoInput,
): GenerateMediaRequest | undefined {
  if (!isPersistedCharacterId(input.characterId) || !isPersistedCharacterId(input.sourceMediaId)) {
    return undefined;
  }

  const aspectRatio = optionalTrimmed(input.aspectRatio);
  const prompt = optionalCappedPrompt(input.prompt);
  const action = optionalTrimmed(input.action);
  const clothing = optionalTrimmed(input.clothing);
  const location = optionalTrimmed(input.location);

  return {
    type: "create-video",
    body: {
      character_id: input.characterId,
      name: optionalTrimmed(input.characterName) || "Video",
      duration: input.duration ?? GENERATE_DEFAULT_VIDEO_DURATION,
      source_media_id: input.sourceMediaId,
      ...(prompt ? { prompt } : {}),
      ...(action ? { action } : {}),
      ...(clothing ? { clothing } : {}),
      ...(location ? { location } : {}),
      ...(input.resolution ? { resolution: input.resolution } : {}),
      ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
    },
  };
}

/**
 * Text to Video. Same create-video job as image-to-video, without a source
 * still: the character, video action, clothing, and location come from the
 * admin catalogs.
 */
export function buildTextToVideoRequest(
  input: BuildTextToVideoInput,
): GenerateMediaRequest | undefined {
  if (!isPersistedCharacterId(input.characterId)) return undefined;

  const aspectRatio = optionalTrimmed(input.aspectRatio);
  const prompt = optionalTrimmed(input.prompt);
  const action = optionalTrimmed(input.action);
  const clothing = optionalTrimmed(input.clothing);
  const location = optionalTrimmed(input.location);

  return {
    type: "create-video",
    body: {
      character_id: input.characterId,
      name: optionalTrimmed(input.characterName) || "Video",
      duration: input.duration ?? GENERATE_DEFAULT_VIDEO_DURATION,
      ...(prompt ? { prompt } : {}),
      ...(action ? { action } : {}),
      ...(clothing ? { clothing } : {}),
      ...(location ? { location } : {}),
      ...(input.resolution ? { resolution: input.resolution } : {}),
      ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
    },
  };
}

export function buildEditImageRequest(
  input: BuildEditImageInput,
): GenerateMediaRequest | undefined {
  if (!isPersistedCharacterId(input.sourceMediaId)) {
    return undefined;
  }

  const prompt = optionalCappedPrompt(input.prompt);
  if (!prompt) {
    return undefined;
  }

  return {
    type: "edit-image",
    body: {
      source_media_id: input.sourceMediaId,
      prompt,
      num_images: Math.max(1, input.numImages ?? GENERATE_DEFAULT_NUM_IMAGES),
    },
  };
}

export function buildEditVideoRequest(
  input: BuildEditVideoInput,
): GenerateMediaRequest | undefined {
  if (!isPersistedCharacterId(input.sourceMediaId)) {
    return undefined;
  }

  const prompt = optionalCappedPrompt(input.prompt);
  if (!prompt) {
    return undefined;
  }

  const aspectRatio = optionalTrimmed(input.aspectRatio);

  return {
    type: "edit-video",
    body: {
      source_media_id: input.sourceMediaId,
      prompt,
      duration: input.duration ?? GENERATE_DEFAULT_VIDEO_DURATION,
      ...(input.resolution ? { resolution: input.resolution } : {}),
      ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
    },
  };
}

export function buildExtendVideoRequest(
  input: BuildExtendVideoInput,
): GenerateMediaRequest | undefined {
  if (!isPersistedCharacterId(input.sourceMediaId)) {
    return undefined;
  }

  const prompt = optionalTrimmed(input.prompt);
  if (!prompt) {
    return undefined;
  }

  const aspectRatio = optionalTrimmed(input.aspectRatio);

  return {
    type: "extend-video",
    body: {
      source_media_id: input.sourceMediaId,
      prompt,
      duration: input.duration ?? GENERATE_DEFAULT_VIDEO_DURATION,
      ...(input.resolution ? { resolution: input.resolution } : {}),
      ...(aspectRatio ? { aspect_ratio: aspectRatio } : {}),
    },
  };
}

/**
 * Video results are not read for a rating yet, so a fresh video counts as NSFW
 * until the gallery reloads it with the stored `nsfw` flag.
 */
const GENERATED_MEDIA_IS_NSFW = true;

function generatedItemFromImageMedia(
  media: Pick<
    CharacterMediaRef,
    "id" | "url" | "character_id" | "nsfw" | "blurred" | "can_generate_from"
  > & {
    media_type?: string;
    created_at?: string;
  },
  body: CreateCharacterImageBody,
  extras?: { characterImageSrc?: string; requireRequestedCharacter?: boolean },
): GeneratedMediaItem {
  const isLocalPlaceholderId = media.id.startsWith("generated-");
  const requestedCharacter = isPersistedCharacterId(body.character_id);
  const omitUnrequestedCharacter = extras?.requireRequestedCharacter && !requestedCharacter;
  const prompt = displayPromptFromGeneration(body);

  return {
    id: media.id,
    mediaId: isLocalPlaceholderId ? undefined : media.id,
    src: media.url,
    alt: prompt || GENERATE_FALLBACK_IMAGE_ALT,
    description: prompt,
    kind: media.media_type === "video" ? "video" : "image",
    isNsfw: media.nsfw !== false,
    blurred: media.blurred === true,
    canGenerateFrom: media.can_generate_from,
    prompt,
    createdAt: optionalTrimmed(media.created_at) ?? new Date().toISOString(),
    // FRONT-654: a create-image sent without character_id must stay unlinked
    // in the gallery, even if the API echoes an owned character onto the row.
    // Edit-image reuses this mapper and has no character_id on the body, so
    // that path keeps the response character.
    characterId: omitUnrequestedCharacter
      ? null
      : (media.character_id ?? body.character_id ?? null),
    characterName: omitUnrequestedCharacter ? undefined : body.name,
    characterImageSrc: omitUnrequestedCharacter ? undefined : extras?.characterImageSrc,
    pose: body.action,
    aspectRatio: body.aspect_ratio,
  };
}

type GalleryIdentity = Pick<MediaPreviewItem, "cardSrc" | "posterSrc" | "fullSrc"> & {
  id?: string;
  mediaId?: string;
  src?: unknown;
  videoSrc?: string;
  kind?: string;
  prompt?: string;
  description?: string;
  alt?: string;
  createdAt?: string;
  checkpoint?: string | null;
  aspectRatio?: string | null;
  pose?: string;
};

function firstFilled(...values: (string | null | undefined)[]): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function galleryDisplayUrlKey(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).pathname;
  } catch {
    const queryIndex = url.indexOf("?");
    return queryIndex === -1 ? url : url.slice(0, queryIndex);
  }
}

function galleryItemUrlKey(item: GalleryIdentity): string | undefined {
  const src = typeof item.src === "string" ? item.src : undefined;
  return galleryDisplayUrlKey(item.videoSrc) ?? galleryDisplayUrlKey(src);
}

function isRemoteDisplayUrl(url: string | undefined): boolean {
  return Boolean(url && /^https?:\/\//i.test(url));
}

export function matchPersistedMediaId(
  media: UsersCharacterMediaItem[] | undefined,
  url: string,
  mediaType?: UsersCharacterMediaItem["media_type"],
): string | undefined {
  const key = galleryDisplayUrlKey(url);
  if (!key) return undefined;

  return media?.find(
    (entry) =>
      (!mediaType || entry.media_type === mediaType) &&
      galleryDisplayUrlKey(entry.s3_path_gallery) === key,
  )?.id;
}

export function matchPersistedVideoMediaId(
  media: UsersCharacterMediaItem[] | undefined,
  videoUrl: string,
): string | undefined {
  return matchPersistedMediaId(media, videoUrl, "video");
}

function mediaIdFromVideoPayload(
  started: CreateCharacterVideoResponse,
  status: CharacterVideoJobStatus,
): string | undefined {
  const id = started.media_id || status.media_id;
  if (!id || id.startsWith("video-")) return undefined;
  return id;
}

async function fetchPersistedMediaForIdLookup(
  _signal?: AbortSignal,
): Promise<UsersCharacterMediaItem[]> {
  return [];
}

async function resolveCompletedVideoMediaId(
  videoUrl: string,
  started: CreateCharacterVideoResponse,
  status: CharacterVideoJobStatus,
  signal?: AbortSignal,
): Promise<string | undefined> {
  const fromPayload = mediaIdFromVideoPayload(started, status);
  if (fromPayload) return fromPayload;

  try {
    return matchPersistedVideoMediaId(await fetchPersistedMediaForIdLookup(signal), videoUrl);
  } catch {
    return undefined;
  }
}

/**
 * Stamp CharacterMedia.id onto create-image `image_paths` fallback rows by
 * matching the display URL against get-users-character-media.
 */
async function attachMissingPersistedMediaIds(
  items: GeneratedMediaItem[],
  signal?: AbortSignal,
): Promise<GeneratedMediaItem[]> {
  if (items.every((item) => characterMediaIdFromGalleryItem(item))) return items;

  try {
    const media = await fetchPersistedMediaForIdLookup(signal);
    return items.map((item) => {
      if (characterMediaIdFromGalleryItem(item)) return item;
      const src = typeof item.src === "string" ? item.src : undefined;
      const url = item.videoSrc ?? src;
      if (!url) return item;
      const mediaId = matchPersistedMediaId(media, url, item.kind === "video" ? "video" : "image");
      if (!mediaId) return item;
      return { ...item, mediaId };
    });
  } catch {
    return items;
  }
}

/**
 * Enrich session rows from their persisted gallery row: stamp CharacterMedia.id
 * onto rows that still only have a synthetic `video-*` / `generated-*` id, and
 * carry the card / poster / HD renditions, assembled prompt, and `created_at`
 * the create responses do not include. Matches on media id, then on display URL path.
 */
export function attachPersistedMediaIds<T extends GalleryIdentity>(
  sessionItems: T[],
  fetchedItems: T[],
): T[] {
  return sessionItems.map((item) => {
    const sessionMediaId = characterMediaIdFromGalleryItem(item);
    const itemKey = galleryItemUrlKey(item);

    const match = sessionMediaId
      ? fetchedItems.find((fetched) => characterMediaIdFromGalleryItem(fetched) === sessionMediaId)
      : itemKey
        ? fetchedItems.find((fetched) => galleryItemUrlKey(fetched) === itemKey)
        : undefined;
    const mediaId = sessionMediaId ?? characterMediaIdFromGalleryItem(match);
    if (!match || !mediaId) return item;

    const prompt = firstFilled(match.prompt, item.prompt);
    return {
      ...item,
      mediaId,
      cardSrc: item.cardSrc ?? match.cardSrc,
      posterSrc: item.posterSrc ?? match.posterSrc,
      fullSrc: item.fullSrc ?? match.fullSrc,
      // The list row carries the assembled prompt (custom text plus action,
      // clothing, and location). Copy it onto the session card so the preview
      // does not stay on the empty placeholder until a full reload.
      prompt,
      description: firstFilled(match.description, prompt, item.description),
      alt: firstFilled(match.alt, item.alt),
      createdAt: firstFilled(match.createdAt, item.createdAt),
      checkpoint: firstFilled(match.checkpoint) ?? item.checkpoint,
      aspectRatio: firstFilled(match.aspectRatio) ?? item.aspectRatio,
      pose: firstFilled(match.pose, item.pose),
    };
  });
}

export function mergeGeneratedGalleryItems<T extends GalleryIdentity>(
  sessionItems: T[],
  fetchedItems: T[],
  removedIds: Set<string>,
): T[] {
  const sessionWithIds = attachPersistedMediaIds(sessionItems, fetchedItems);
  const seenIds = new Set<string>();
  const seenMediaIds = new Set<string>();
  const seenUrls = new Set<string>();
  const merged: T[] = [];

  for (const item of [...sessionWithIds, ...fetchedItems]) {
    if (!item.id || removedIds.has(item.id)) continue;

    const mediaId = characterMediaIdFromGalleryItem(item);
    if (mediaId && (removedIds.has(mediaId) || seenMediaIds.has(mediaId))) continue;

    const urlKey = galleryItemUrlKey(item);
    if (urlKey && seenUrls.has(urlKey)) continue;
    if (seenIds.has(item.id)) continue;

    seenIds.add(item.id);
    if (mediaId) seenMediaIds.add(mediaId);
    if (urlKey) seenUrls.add(urlKey);
    merged.push(item);
  }

  return merged;
}

function generatedItemFromStoredMedia(media: UsersCharacterMediaItem): GeneratedMediaItem {
  const isVideo = media.media_type === "video";
  const prompt = media.prompt?.trim() || undefined;
  const src = media.s3_path_gallery;
  const {
    cardSrc,
    posterSrc,
    fullSrc,
    isVideo: playsVideo,
  } = storedMediaCardSources(media, isVideo);

  return {
    id: media.id,
    mediaId: media.id,
    // Gallery dedupe reads `src` / `videoSrc`: the original, or for a blurred
    // item its blurred still / card video. Tiles read `cardSrc`, the full-screen
    // preview `fullSrc`; downloads the original, or a blurred item's `fullSrc`.
    src,
    // A blurred video has no original to hand out: it plays its blurred card
    // video when one exists, else it is its still (`src`).
    videoSrc: playsVideo ? (media.blurred === true ? cardSrc : src) : undefined,
    cardSrc,
    posterSrc,
    fullSrc,
    kind: isVideo ? "video" : "image",
    isNsfw: media.nsfw !== false,
    blurred: media.blurred === true,
    canGenerateFrom: media.can_generate_from,
    prompt,
    alt: prompt,
    description: prompt,
    characterId: media.character_id,
    pose: media.pose ?? undefined,
    checkpoint: media.checkpoint?.trim() || undefined,
    aspectRatio: media.aspect_ratio?.trim() || undefined,
    createdAt: optionalTrimmed(media.created_at),
  };
}

export function generatedItemsFromCreateImageResponse(
  response: CreateCharacterImageResponse,
  body: CreateCharacterImageBody,
  extras?: { characterImageSrc?: string; requireRequestedCharacter?: boolean },
): GeneratedMediaItem[] {
  const resolvedExtras = {
    ...extras,
    requireRequestedCharacter: extras?.requireRequestedCharacter ?? true,
  };
  const fromMedia = (response.media ?? []).filter((entry) => entry.url);
  if (fromMedia.length > 0) {
    return fromMedia.map((entry) => generatedItemFromImageMedia(entry, body, resolvedExtras));
  }

  const paths = response.image_paths ?? [];
  if (paths.length === 0) {
    throw new Error("create-image returned no media");
  }

  return paths.map((url, index) =>
    generatedItemFromImageMedia(
      {
        id: `generated-${Date.now()}-${index}`,
        url,
        media_type: "image",
        character_id: body.character_id ?? null,
      },
      body,
      resolvedExtras,
    ),
  );
}

/** Map persisted CharacterMedia rows onto the generate grid. */
export function generatedItemsFromStoredMedia(
  media: UsersCharacterMediaItem[] | undefined,
): GeneratedMediaItem[] {
  return (media ?? [])
    .filter((entry) => entry.id && entry.s3_path_gallery)
    .map(generatedItemFromStoredMedia);
}

/** Map the caller's persisted gallery rows onto the generate grid. */
export function generatedItemsFromUsersCharacterMedia(
  response: UsersCharacterMediaResponse | undefined,
): GeneratedMediaItem[] {
  return generatedItemsFromStoredMedia(response?.media);
}

/**
 * CharacterMedia.id for delete-media / remix / edit. Prefers `mediaId`, then
 * the list row `id`. Local generate placeholders never have a server id.
 */
export function characterMediaIdFromGalleryItem(
  item: { id?: string; mediaId?: string } | null | undefined,
): string | undefined {
  const id = item?.mediaId || item?.id;
  if (!id) return undefined;
  if (id.startsWith("generated-") || id.startsWith("video-")) return undefined;
  return id;
}

/**
 * Persisted create-image fallback / session video rows have a remote URL but
 * may still lack CharacterMedia.id. Those must not be treated as local-only.
 */
export function isUnresolvedPersistedGalleryItem(item: GalleryIdentity): boolean {
  if (characterMediaIdFromGalleryItem(item)) return false;
  const src = typeof item.src === "string" ? item.src : undefined;
  return isRemoteDisplayUrl(item.videoSrc) || isRemoteDisplayUrl(src);
}

export function mapCreateVideoResult(
  body: CreateCharacterVideoBody,
  jobId: string,
  videoUrl: string,
  mediaId?: string,
): GeneratedMediaItem {
  const prompt = displayPromptFromGeneration(body);
  return {
    id: mediaId ?? `video-${jobId}`,
    mediaId,
    src: videoUrl,
    videoSrc: videoUrl,
    kind: "video",
    isNsfw: GENERATED_MEDIA_IS_NSFW,
    prompt,
    description: prompt,
    alt: prompt || "Generated video",
    characterId: body.character_id,
    characterName: body.name,
    aspectRatio: body.aspect_ratio,
    createdAt: new Date().toISOString(),
  };
}

const LOCAL_SCENE_VIDEO = "/assets/playright/banner.mp4";
let localSceneIndex = 0;

/** Local stand-in. Nothing is sent to a generation API. */
export async function runGenerateMediaRequest(
  request: GenerateMediaRequest,
  signal?: AbortSignal,
): Promise<GeneratedMediaItem[]> {
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const prompt = request.body.prompt ?? "";
  const isVideo =
    request.type === "create-video" ||
    request.type === "edit-video" ||
    request.type === "extend-video";
  const index = localSceneIndex;
  localSceneIndex += 1;
  const still = dummyImage(index);

  return [
    {
      id: `generated-${Date.now()}-${index}`,
      src: still,
      posterSrc: still,
      cardSrc: still,
      fullSrc: isVideo ? LOCAL_SCENE_VIDEO : still,
      videoSrc: isVideo ? LOCAL_SCENE_VIDEO : undefined,
      kind: isVideo ? "video" : "image",
      prompt,
      description: prompt,
      alt: prompt || "Generated scene",
      createdAt: new Date().toISOString(),
    },
  ];
}
