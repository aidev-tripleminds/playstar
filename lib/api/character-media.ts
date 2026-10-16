import { apiFetch, ApiRequestError, isClientErrorResponse } from "./client";
import { CLIENT_API_ORIGIN } from "./config";
import type {
  CharacterVideoJobStatus,
  CreateCharacterImageBody,
  CreateCharacterImageResponse,
  CreateCharacterVideoBody,
  CreateCharacterVideoResponse,
  DeleteCharacterMediaBody,
  DeleteCharacterMediaResponse,
  EditCharacterImageBody,
  EditCharacterImageResponse,
  EditCharacterVideoBody,
  EditCharacterVideoResponse,
  ExtendCharacterVideoBody,
  ExtendCharacterVideoResponse,
  RemixParamsResponse,
  UsersCharacterMediaQuery,
  UsersCharacterMediaResponse,
} from "./types";

/** First-page size used by the generate gallery and video-id lookup. */
export const USERS_CHARACTER_MEDIA_PAGE_SIZE = 60;

/**
 * Public GET implemented by this Next app (not the backend rewrite).
 * Streams `url` back with `Content-Disposition: attachment` so the
 * browser can save it. Query: `url` (required http(s) allowlisted host), `name`
 * (optional filename, default `download.bin`).
 */
export const CHARACTER_MEDIA_DOWNLOAD_PROXY_PATH = "/api/v1/characters/media/download-proxy";

/**
 * Same-origin download-proxy path. Implemented by this app
 * (`app/api/v1/characters/media/download-proxy`) because the live backend
 * does not expose the route; the filesystem handler wins over the `/api`
 * rewrite. Query: `url` (required http(s) allowlisted host), `name`
 * (optional filename, default `download.bin`).
 */
export function characterMediaDownloadProxyPath(url: string, name?: string): string {
  const params = new URLSearchParams({ url });
  const filename = name?.trim();
  if (filename) params.set("name", filename);
  return `${CHARACTER_MEDIA_DOWNLOAD_PROXY_PATH}?${params.toString()}`;
}

export function characterMediaDownloadProxyHref(url: string, name?: string): string {
  return `${CLIENT_API_ORIGIN}${characterMediaDownloadProxyPath(url, name)}`;
}

const VIDEO_STATUS_POLL_MS = 2000;
const VIDEO_STATUS_TIMEOUT_MS = 180_000;
const IMAGE_JOB_POLL_MS = 3000;
/** Cap for the backoff after status reads that failed transiently. */
const IMAGE_JOB_RETRY_MAX_MS = 30_000;

type CharacterMediaRequestInit = Pick<RequestInit, "signal">;

/** Gallery text-to-image. Synchronous — the request stays open for the generation. */
export async function createCharacterImage(
  body: CreateCharacterImageBody,
  init?: CharacterMediaRequestInit,
): Promise<CreateCharacterImageResponse> {
  const response = await apiFetch<CreateCharacterImageResponse | { job_id: string }>(
    "/api/v1/characters/media/create-image",
    {
      method: "POST",
      headers: { Prefer: "respond-async" },
      body: JSON.stringify(body),
      signal: init?.signal,
    },
  );
  return "job_id" in response
    ? waitForImageJob(response.job_id, init?.signal ?? undefined)
    : response;
}

/**
 * Image-to-video. Returns a job id immediately. Poll {@link fetchCharacterVideoStatus}
 * or listen on `subscribeToCharacterMediaEvents`.
 */
export function createCharacterVideo(
  body: CreateCharacterVideoBody,
  init?: CharacterMediaRequestInit,
): Promise<CreateCharacterVideoResponse> {
  return apiFetch<CreateCharacterVideoResponse>("/api/v1/characters/media/create-video", {
    method: "POST",
    body: JSON.stringify(body),
    signal: init?.signal,
  });
}

export function fetchCharacterVideoStatus(jobId: string): Promise<CharacterVideoJobStatus> {
  return apiFetch<CharacterVideoJobStatus>(
    `/api/v1/characters/media/video-status/${encodeURIComponent(jobId)}`,
  );
}

/**
 * Edit an owned image by id. Synchronous prototype — same response shape as
 * create-image. Ownership-scoped; rejects a video source.
 */
export async function editCharacterImage(
  body: EditCharacterImageBody,
  init?: CharacterMediaRequestInit,
): Promise<EditCharacterImageResponse> {
  const response = await apiFetch<EditCharacterImageResponse | { job_id: string }>(
    "/api/v1/characters/media/edit-image",
    {
      method: "POST",
      headers: { Prefer: "respond-async" },
      body: JSON.stringify(body),
      signal: init?.signal,
    },
  );
  return "job_id" in response
    ? waitForImageJob(response.job_id, init?.signal ?? undefined)
    : response;
}

/**
 * Edit an owned video by id. Returns a job id immediately. Poll
 * {@link fetchCharacterVideoStatus} until the new clip is ready.
 */
export function editCharacterVideo(
  body: EditCharacterVideoBody,
  init?: CharacterMediaRequestInit,
): Promise<EditCharacterVideoResponse> {
  return apiFetch<EditCharacterVideoResponse>("/api/v1/characters/media/edit-video", {
    method: "POST",
    body: JSON.stringify(body),
    signal: init?.signal,
  });
}

/**
 * Extend an owned video by id. Returns a job id immediately. Poll
 * {@link fetchCharacterVideoStatus} until the new clip is ready.
 */
export function extendCharacterVideo(
  body: ExtendCharacterVideoBody,
  init?: CharacterMediaRequestInit,
): Promise<ExtendCharacterVideoResponse> {
  return apiFetch<ExtendCharacterVideoResponse>("/api/v1/characters/media/extend-video", {
    method: "POST",
    body: JSON.stringify(body),
    signal: init?.signal,
  });
}

/** Remix prefill payload. 404 if the media is not the caller's. */
export function fetchRemixParams(mediaId: string): Promise<RemixParamsResponse> {
  return apiFetch<RemixParamsResponse>(
    `/api/v1/characters/media/${encodeURIComponent(mediaId)}/remix-params`,
  );
}

/**
 * The caller's own generated media, newest first. Auth required — the backend
 * scopes the query to the session user. Display URLs live on `s3_path_gallery`.
 */
export function fetchUsersCharacterMedia(
  query: UsersCharacterMediaQuery = {},
  init?: CharacterMediaRequestInit,
): Promise<UsersCharacterMediaResponse> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return apiFetch<UsersCharacterMediaResponse>(
    `/api/v1/characters/media/get-users-character-media${queryString ? `?${queryString}` : ""}`,
    { signal: init?.signal },
  );
}

/**
 * Remove one or more of the caller's generated media rows. Auth required;
 * ownership scoped. Identify rows by CharacterMedia.id (`media[].id` from
 * get-users-character-media) — never a URL. Single: `character_media_id`.
 * Bulk: `character_media_ids` in one request.
 */
export function deleteCharacterMedia(
  body: DeleteCharacterMediaBody,
  init?: CharacterMediaRequestInit,
): Promise<DeleteCharacterMediaResponse> {
  return apiFetch<DeleteCharacterMediaResponse>("/api/v1/characters/media/delete-media", {
    method: "POST",
    body: JSON.stringify(body),
    signal: init?.signal,
  });
}

/**
 * Save or unsave one media item (a switch: the caller passes the state it
 * wants). Idempotent on the backend, so a repeat returns the same state.
 */
export function setCharacterMediaSaved(
  mediaId: string,
  saved: boolean,
): Promise<{ saved: boolean }> {
  return apiFetch<{ saved: boolean }>(
    `/api/v1/characters/media/${encodeURIComponent(mediaId)}/${saved ? "save" : "unsave"}`,
    { method: "POST" },
  );
}

/** The caller's saved state for up to 200 media ids, in request order. */
export function checkCharacterMediaSaved(
  mediaIds: string[],
): Promise<{ items: { id: string; saved: boolean }[] }> {
  return apiFetch<{ items: { id: string; saved: boolean }[] }>(
    "/api/v1/characters/media/check-saved",
    { method: "POST", body: JSON.stringify({ media_ids: mediaIds }) },
  );
}

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(
        signal.reason instanceof Error ? signal.reason : new DOMException("Aborted", "AbortError"),
      );
      return;
    }

    const timerId = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      window.clearTimeout(timerId);
      reject(
        signal?.reason instanceof Error ? signal.reason : new DOMException("Aborted", "AbortError"),
      );
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * Poll video-status until completed, failed, or timeout. Prefer this over a
 * URL held in client state — the completed payload includes a fresh presigned URL.
 */
export async function waitForCharacterVideoJob(
  jobId: string,
  signal?: AbortSignal,
): Promise<CharacterVideoJobStatus> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < VIDEO_STATUS_TIMEOUT_MS) {
    if (signal?.aborted) {
      throw signal.reason instanceof Error
        ? signal.reason
        : new DOMException("Aborted", "AbortError");
    }

    const status = await fetchCharacterVideoStatus(jobId);

    if (status.status === "completed") {
      return status;
    }

    if (status.status === "failed") {
      throw new ApiRequestError(
        422,
        status.reason ?? "GENERATION_FAILED",
        status.message ?? "Video generation failed",
      );
    }

    await sleep(VIDEO_STATUS_POLL_MS, signal);
  }

  throw new ApiRequestError(408, "TIMEOUT", "Video generation timed out");
}

/** A job in the list: status only. Finished images come from the gallery. */
export type GalleryImageJob = {
  job_id: string;
  status: "queued" | "processing" | "completed" | "failed";
  created_at: string;
  updated_at: string;
  error: string | null;
  message: string | null;
};

/** One job read by id, with its finished images. */
export type GalleryImageJobDetail = GalleryImageJob & {
  media: NonNullable<CreateCharacterImageResponse["media"]>;
};

export function fetchImageJobs(signal?: AbortSignal) {
  return apiFetch<{ jobs: GalleryImageJob[] }>("/api/v1/characters/media/image-jobs", { signal });
}

/** Leaving the page only stops this observer; the durable server job continues. */
export async function waitForImageJob(
  jobId: string,
  signal?: AbortSignal,
): Promise<CreateCharacterImageResponse> {
  let retryDelayMs = IMAGE_JOB_POLL_MS;
  for (;;) {
    let job: GalleryImageJobDetail;
    try {
      job = await apiFetch<GalleryImageJobDetail>(
        `/api/v1/characters/media/image-jobs/${encodeURIComponent(jobId)}`,
        { signal },
      );
    } catch (error) {
      // A 4xx is the server's answer about this job. A dropped connection, a
      // 5xx or an unreadable body says nothing about it — the job keeps
      // running server-side, so keep observing rather than fail a paid
      // generation that may still land (and invite a second one).
      if (signal?.aborted || (isClientErrorResponse(error) && error.status !== 429)) throw error;
      await sleep(retryDelayMs, signal);
      retryDelayMs = Math.min(retryDelayMs * 2, IMAGE_JOB_RETRY_MAX_MS);
      continue;
    }
    retryDelayMs = IMAGE_JOB_POLL_MS;
    if (job.status === "completed")
      return {
        message: "Images created successfully",
        media: job.media,
        image_paths: job.media.map((item) => item.url),
        status_code: 200,
      };
    if (job.status === "failed")
      throw new ApiRequestError(422, job.error ?? "GENERATION_FAILED", job.message?.trim() ?? "");
    await sleep(IMAGE_JOB_POLL_MS, signal);
  }
}
