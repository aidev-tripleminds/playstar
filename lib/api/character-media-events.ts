import { authClient } from "@/lib/auth/auth-client";

import { CLIENT_API_ORIGIN } from "./config";
import type { GenerationFailure, MediaFailureReason } from "./types";

/**
 * `media.created` frame — generated media is ready to render.
 *
 * Not consumed by the create wizard (it polls `fetch-by-id` for the image, and
 * the poll is what proves the image is actually readable), but part of the same
 * stream and typed here so a subscriber can tell the two events apart.
 */
export type MediaCreatedEventData = {
  id: string;
  character_id: string | null;
  media_type: string;
  s3_path_gallery: string;
  created_at: string;
};

/**
 * `media.failed` frame — a generation ended with no media, terminally. Nothing
 * is left running behind one of these, so a client waiting on the image can
 * stop waiting the moment it arrives.
 */
export type MediaFailedEventData = GenerationFailure & {
  /** For a character head image this is the character id. */
  id: string;
  character_id: string | null;
  media_type: string;
  created_at: string;
};

/**
 * `media.stage` — a character portrait moved forward through the pipeline.
 * Named in the media-events description: queued → moderating_input →
 * generating → moderating_output. Not terminal.
 */
export const PORTRAIT_GENERATION_STAGES = [
  "queued",
  "moderating_input",
  "generating",
  "moderating_output",
] as const;

export type PortraitGenerationStage = (typeof PORTRAIT_GENERATION_STAGES)[number];

export type MediaStageEventData = {
  /** For a character head image this is the character id. */
  id: string;
  character_id: string | null;
  media_type: string;
  stage: PortraitGenerationStage;
  created_at: string;
};

type SubscribeOptions = {
  onFailed?: (data: MediaFailedEventData) => void;
  onCreated?: (data: MediaCreatedEventData) => void;
  onStage?: (data: MediaStageEventData) => void;
};

export type CharacterMediaEventsSubscription = {
  /** Resolves once the server has accepted the SSE connection, or false if setup fails. */
  ready: Promise<boolean>;
  unsubscribe: () => void;
};

const MEDIA_FAILURE_REASONS: readonly MediaFailureReason[] = [
  "moderation",
  "moderation_warning",
  "moderation_ban",
  "generation",
  "timeout",
  "unavailable",
  "internal",
];

/**
 * Parse a `media.failed` frame, tolerating a reason this build has never heard
 * of: the backend owns both the reason vocabulary and the copy, so an unknown
 * one still carries a usable `message` and must not be dropped — it degrades to
 * `generation` (retryable, neutral), exactly as the backend does for rows
 * written before the column existed.
 */
/** Ignore a stage this build does not render, rather than inventing a card for it. */
export function parseMediaStageEvent(raw: string): MediaStageEventData | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }

  const data = parsed as Record<string, unknown>;
  if (typeof data.id !== "string") {
    return null;
  }

  if (!PORTRAIT_GENERATION_STAGES.includes(data.stage as PortraitGenerationStage)) {
    return null;
  }

  return {
    id: data.id,
    character_id: typeof data.character_id === "string" ? data.character_id : null,
    media_type: typeof data.media_type === "string" ? data.media_type : "image",
    stage: data.stage as PortraitGenerationStage,
    created_at: typeof data.created_at === "string" ? data.created_at : new Date().toISOString(),
  };
}

/**
 * Stages only move forward. A missing current stage accepts the first event,
 * including one that skips ahead.
 */
export function advancePortraitGenerationStage(
  current: PortraitGenerationStage | null,
  next: PortraitGenerationStage,
): PortraitGenerationStage {
  if (current === null) {
    return next;
  }

  return PORTRAIT_GENERATION_STAGES.indexOf(next) >= PORTRAIT_GENERATION_STAGES.indexOf(current)
    ? next
    : current;
}

export function parseMediaFailedEvent(raw: string): MediaFailedEventData | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }

  const data = parsed as Record<string, unknown>;
  if (typeof data.id !== "string" || typeof data.message !== "string") {
    return null;
  }

  const reason = MEDIA_FAILURE_REASONS.includes(data.reason as MediaFailureReason)
    ? (data.reason as MediaFailureReason)
    : "generation";

  return {
    id: data.id,
    character_id: typeof data.character_id === "string" ? data.character_id : null,
    media_type: typeof data.media_type === "string" ? data.media_type : "image",
    reason,
    message: data.message,
    // Only an explicit `false` withholds the retry: an older/unknown payload
    // that omits the field should not silently strip the user's way out.
    retryable: data.retryable !== false,
    // The mirror image of `retryable`'s default: a missing `refunded` is NOT a
    // refund. Claiming one the backend never reported would be telling the user
    // their coins are back on no evidence.
    ...(typeof data.refunded === "boolean" ? { refunded: data.refunded } : {}),
    ...(typeof data.moderation_reason === "string" && data.moderation_reason.trim() !== ""
      ? { moderation_reason: data.moderation_reason }
      : {}),
    created_at: typeof data.created_at === "string" ? data.created_at : new Date().toISOString(),
  };
}

/**
 * Subscribe to this user's generated-media event stream
 * (`GET /api/v1/characters/media/events`).
 *
 * `EventSource` cannot set request headers, so the backend authenticates this
 * one route on a `?token=` query param rather than the session cookie — hence
 * the `getSession()` round trip before the stream can be opened. The returned
 * subscription exposes readiness and can be cancelled even while that token is
 * still resolving, so an unmount mid-connect never leaves a stream open.
 *
 * The browser's own `EventSource` reconnects on a dropped connection. Frames
 * published while it was down are lost (Redis pub/sub keeps no history) — the
 * create flow's image poll is what covers that gap.
 */
export function subscribeToCharacterMediaEvents({
  onFailed,
  onCreated,
  onStage,
}: SubscribeOptions): CharacterMediaEventsSubscription {
  let source: EventSource | null = null;
  let cancelled = false;
  let settleReady: (ready: boolean) => void = () => {};
  const ready = new Promise<boolean>((resolve) => {
    settleReady = resolve;
  });

  void (async () => {
    let token: string | undefined;
    try {
      const { data } = await authClient.getSession();
      token = data?.session.token;
    } catch {
      // No session, or the session call failed — there is nothing to subscribe
      // to. Callers must not depend on this stream for correctness: it is the
      // fast path, and the image poll is the fallback.
      settleReady(false);
      return;
    }

    if (cancelled || !token) {
      settleReady(false);
      return;
    }

    try {
      source = new EventSource(
        `${CLIENT_API_ORIGIN}/api/v1/characters/media/events?token=${encodeURIComponent(token)}`,
      );
    } catch {
      settleReady(false);
      return;
    }
    source.addEventListener("open", () => settleReady(true), { once: true });
    source.addEventListener("error", () => settleReady(false), { once: true });

    if (onFailed) {
      source.addEventListener("media.failed", (event) => {
        const data = parseMediaFailedEvent((event as MessageEvent<string>).data);
        if (data) {
          onFailed(data);
        }
      });
    }

    if (onCreated) {
      source.addEventListener("media.created", (event) => {
        try {
          onCreated(JSON.parse((event as MessageEvent<string>).data) as MediaCreatedEventData);
        } catch {
          // Unparseable frame — ignore it rather than tearing down the stream.
        }
      });
    }

    if (onStage) {
      source.addEventListener("media.stage", (event) => {
        const data = parseMediaStageEvent((event as MessageEvent<string>).data);
        if (data) {
          onStage(data);
        }
      });
    }
  })();

  return {
    ready,
    unsubscribe: () => {
      cancelled = true;
      settleReady(false);
      source?.close();
      source = null;
    },
  };
}
