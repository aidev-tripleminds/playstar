import { apiFetch } from "./client";
import type {
  CharacterEditPayloadResponse,
  CreateCharacterBody,
  CreateCharacterResponse,
  CreateStatusResponse,
  DeleteCharacterResponse,
  DesignCharacterBody,
  DesignCharacterResponse,
  EditCharacterBody,
  EditCharacterResponse,
  FetchCharacterByIdResponse,
  MyCharactersQuery,
  MyCharactersResponse,
  PublicCharactersQuery,
  PublicCharactersResponse,
  RetryCharacterImageResponse,
  SetCharacterProfilePictureBody,
  SetCharacterProfilePictureResponse,
  UndoLastCharacterChangeResponse,
} from "./types";

/** "Design with AI" — build a full draft from gender/style (+ optional prompt). Auth required. */
export function designCharacter(
  body: DesignCharacterBody,
  signal?: AbortSignal,
): Promise<DesignCharacterResponse> {
  return apiFetch<DesignCharacterResponse>("/api/v1/characters/design", {
    method: "POST",
    body: JSON.stringify(body),
    signal,
  });
}

/**
 * The caller's own characters, newest first. Auth required — the backend scopes
 * the query to the session user, so there is no user id to pass.
 */
export function fetchMyCharacters(query: MyCharactersQuery = {}): Promise<MyCharactersResponse> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    // An empty search string is not a filter — sending it would match nothing.
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return apiFetch<MyCharactersResponse>(
    `/api/v1/characters/fetch-loggedin-user${queryString ? `?${queryString}` : ""}`,
  );
}

/**
 * The public character list, org/brand-scoped server-side. No auth required —
 * available for server-rendered character lists.
 */
export function fetchPublicCharacters(
  query: PublicCharactersQuery = {},
): Promise<PublicCharactersResponse> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    // An empty search string is not a filter — sending it would match nothing.
    // `null` is guarded too: the callers are Prismic Select fields, whose
    // generated non-nullable type is inferred from `default_value` and is not
    // an API guarantee for documents authored before that default existed.
    // Without this, `String(null)` would send the literal "null" and silently
    // return zero characters.
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  const queryString = params.toString();
  return apiFetch<PublicCharactersResponse>(
    `/api/v1/characters/fetch-default${queryString ? `?${queryString}` : ""}`,
  );
}

/**
 * Persist a character. Auth required; costs coins (402 = insufficient balance).
 *
 * `idempotencyKey` (BACK-95) makes the paid POST safe to repeat: a second
 * request with the same key and body replays the first one's 201 instead of
 * creating and charging again.
 */
export function createCharacter(
  body: CreateCharacterBody,
  idempotencyKey?: string,
): Promise<CreateCharacterResponse> {
  return apiFetch<CreateCharacterResponse>("/api/v1/characters/create", {
    method: "POST",
    body: JSON.stringify(body),
    headers: idempotencyKey ? { "Idempotency-Key": idempotencyKey } : undefined,
  });
}

/**
 * What became of a create sent with `idempotencyKey` whose answer was lost.
 * Read-only — it never creates or charges, so it is always safe to ask.
 * `unknown`: nothing was created (safe to create again). `in_progress`: still
 * running. `succeeded`: created and charged; `character` is the original 201
 * body, or null if the character was deleted since.
 */
export function fetchCreateStatus(idempotencyKey: string): Promise<CreateStatusResponse> {
  return apiFetch<CreateStatusResponse>(
    `/api/v1/characters/create-status/${encodeURIComponent(idempotencyKey)}`,
  );
}

/**
 * A single character, including its (possibly still-null) generated image —
 * the polling target after `createCharacter` while the image is generated in
 * the background. Auth required.
 */
export function fetchCharacterById(characterId: string): Promise<FetchCharacterByIdResponse> {
  return apiFetch<FetchCharacterByIdResponse>(
    `/api/v1/characters/fetch-by-id/${encodeURIComponent(characterId)}`,
  );
}

/**
 * The character's editable (layer-1) fields, shaped exactly like a create body
 * — what the edit flow prefills its form from. Auth required; OWNER-only (or
 * `characters:moderate`), so a non-owner gets 404 rather than 403.
 *
 * Not interchangeable with `fetchCharacterById`: that response is the public
 * serializer, which drops `occupation`, `fetish`, `backstory`,
 * `personality_description`, `greeting_message`, `extra_physical_details` and
 * every `*_custom` field. Prefilling an edit form from it would post those back
 * empty on the first save and wipe them.
 */
export function fetchCharacterEditPayload(
  characterId: string,
): Promise<CharacterEditPayloadResponse> {
  return apiFetch<CharacterEditPayloadResponse>(
    `/api/v1/characters/edit-payload/${encodeURIComponent(characterId)}`,
  );
}

/**
 * Re-enqueue image/voice/preview generation for an already-created character,
 * using its currently persisted attributes. Auth required; owner-or-admin.
 *
 * Costs `CHARACTER_COST` coins (the same as `createCharacter`) and debits the
 * character's OWNER — a 402 here means insufficient balance, exactly as on
 * create. Persist trait edits with `updateCharacter` FIRST: traits regenerate
 * from what is stored, not from anything passed here.
 *
 * `scenario` (BACK-79 R7) is the ONE exception, and it is a scene, not the
 * whole prompt — it replaces the setting the image is generated in, while the
 * identity slots are always rebuilt from the character's stored traits. Note
 * the field is NOT `prompt`: on this endpoint's other (gallery-image) mode
 * `prompt` means the entire image prompt, which is why the backend 400s if the
 * two are crossed over.
 *
 * Omitting it is a real instruction, not a default: the backend generates a
 * SCENE-FREE image rather than inventing a scene the user did not ask for, and
 * clears the character's stored scene to match. Passing `undefined` and passing
 * `""` are identical — both mean "no scene".
 */
export function retryCharacterImage(
  characterId: string,
  scenario?: string,
  revisionId?: string,
  options: { keepSeedAndScene?: boolean } = {},
): Promise<RetryCharacterImageResponse> {
  return apiFetch<RetryCharacterImageResponse>("/api/v1/characters/retry-image", {
    method: "POST",
    body: JSON.stringify({
      character_id: characterId,
      ...(scenario ? { scenario } : {}),
      // The undo record of the edit this regeneration follows, so one undo
      // reverts the traits and the new image together.
      ...(revisionId ? { revision_id: revisionId } : {}),
      // "Apply changes": regenerate with the current image's seed and scene, so
      // only the edited traits change. A plain Retry leaves it off (new image).
      ...(options.keepSeedAndScene ? { keep_seed_and_scene: true } : {}),
    }),
  });
}

/**
 * Revert the character's last saved change: the texts and traits it altered
 * and, when that change regenerated the image, the previous image with its
 * prompt and preview. A text-only change restores just the texts. Repeating it
 * steps further back. Free — nothing is refunded.
 *
 * 409 while a regeneration is still running (it would overwrite the undo), 404
 * when there is nothing left to undo. Re-read the edit payload and
 * `fetchCharacterById` afterwards.
 */
export function undoLastCharacterChange(
  characterId: string,
): Promise<UndoLastCharacterChangeResponse> {
  return apiFetch<UndoLastCharacterChangeResponse>("/api/v1/characters/undo-last-change", {
    method: "POST",
    body: JSON.stringify({ character_id: characterId }),
  });
}

/**
 * Set an owned generated image as that character's display profile picture.
 * Auth required; owner-only. The target character is derived from the media
 * row — images without a character, videos, and other people's characters
 * are rejected. Display thumbnails only; the original reference image and
 * prompts stay as they are. Refresh character lists after success.
 */
export function setCharacterProfilePicture(
  body: SetCharacterProfilePictureBody,
): Promise<SetCharacterProfilePictureResponse> {
  return apiFetch<SetCharacterProfilePictureResponse>("/api/v1/characters/set-profile-picture", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Follow or unfollow a character (a switch: the caller passes the state it
 * wants). Idempotent on the backend, so a repeat returns the same state.
 */
export function setCharacterFollowing(
  characterId: string,
  following: boolean,
): Promise<{ following: boolean }> {
  return apiFetch<{ following: boolean }>(
    `/api/v1/characters/${encodeURIComponent(characterId)}/${following ? "follow" : "unfollow"}`,
    { method: "POST" },
  );
}

/**
 * Persist trait edits on an already-created character. Auth required;
 * owner-or-admin. Metadata-only — it does not itself enqueue regeneration,
 * so a `retryCharacterImage` call must follow to pick up the new traits.
 */
export function updateCharacter(body: EditCharacterBody): Promise<EditCharacterResponse> {
  return apiFetch<EditCharacterResponse>("/api/v1/characters/edit-by-id", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Remove a character. Auth required; owner-or-moderator (404, not 403, if
 * neither). `deleteMedia` is authoritative — the server never infers it from
 * a count — and defaults to `false` (keep the caller's own media and chat
 * history) when omitted. Idempotent: deleting an already-removed character
 * still returns 200.
 */
export function deleteCharacter(
  characterId: string,
  deleteMedia: boolean,
): Promise<DeleteCharacterResponse> {
  return apiFetch<DeleteCharacterResponse>(
    `/api/v1/characters/delete/${encodeURIComponent(characterId)}`,
    {
      method: "POST",
      body: JSON.stringify({ delete_media: deleteMedia }),
    },
  );
}
