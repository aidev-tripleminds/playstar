/**
 * Frontend mirror of the backend character API contract.
 *
 * Source of truth: `omnipink-backend/src/modules/characters/schemas.ts`
 * (`createCharacterSchema`, `designCharacterSchema`) and
 * `src/modules/billing/routes.ts` (`GET /api/v1/me`). Keep in sync by hand —
 * the repos don't share a package.
 */

/** `POST /api/v1/characters/create` body. Snake_case, trait keys + `_custom` pairs. */
export type CreateCharacterBody = {
  /** Blank on create means "name the character for me" (FRONT-882). */
  name: string;
  gender: string;

  /** BCP-47 tag of the UI locale. Recorded on the character; nothing is translated. */
  language?: string;

  style?: string;
  age?: number;

  ethnicity?: string;
  ethnicity_custom?: string;
  eye_colour?: string;
  eye_colour_custom?: string;
  hair_colour?: string;
  hair_colour_custom?: string;
  hair_style?: string;
  hair_style_custom?: string;
  body_type?: string;
  body_type_custom?: string;
  breast_size?: string;
  breast_size_custom?: string;
  butt_size?: string;
  butt_size_custom?: string;
  personality?: string;
  personality_custom?: string;
  occupation?: string;
  occupation_custom?: string;
  relationship_type?: string;
  relationship_type_custom?: string;

  /**
   * `Voice.id` from the catalogue (`GET /api/v1/voices`) — the character's
   * actual synthesis voice, not a cosmetic label. Replaces the removed
   * `voice_type`/`voice_type_custom` pair, which named a nationality
   * ("Italian") that no runtime code ever read.
   *
   * Optional only for the transition: the backend substitutes a configured
   * default when it is absent, and will tighten that to required once every
   * client sends it. Treat it as required here.
   */
  voice_id?: string;

  hobbies?: string;
  fetish?: string;

  bio?: string;
  backstory?: string;
  personality_description?: string;
  greeting_message?: string;
  extra_physical_details?: string;

  clothing?: string;
  special_features?: string;

  /** Verbatim "Design with AI" instruction, echoed so it's saved with the character. */
  design_prompt?: string;
  /**
   * The portrait's scene from a "Design with AI" draft (BACK-398). Create only;
   * without it the backend writes one itself.
   */
  scenario?: string;

  privacy?: "public" | "private";
  onlyfans_url?: string;
  fanvue_url?: string;
  tiktok_url?: string;
  instagram_url?: string;
};

/**
 * `POST /api/v1/characters/edit-by-id` body. Same trait vocabulary as
 * `CreateCharacterBody`, but every field besides `character_id` is optional —
 * the backend applies only what's present and leaves the rest untouched.
 * Metadata-only: it persists traits but does not itself trigger regeneration.
 */
export type EditCharacterBody = Partial<CreateCharacterBody> & { character_id: string };

/**
 * One content-moderation verdict per checked free-text field, keyed by the
 * snake_case body field (BACK-391). `rejected` = not allowed, `unavailable` =
 * could not be checked right now (retryable). Neither was saved.
 */
export type FieldModerationStatus = "passed" | "rejected" | "unavailable";
export type FieldModeration = Record<string, FieldModerationStatus>;

/**
 * Why a field was rejected: the words the backend's blocklist matched, or the
 * moderation provider's reason sentence. Only `rejected` fields have one.
 */
export type FieldModerationDetail =
  | { source: "blocklist"; terms: string[] }
  | { source: "omnifence"; reason: string };
export type FieldModerationDetails = Record<string, FieldModerationDetail>;

/**
 * `POST /api/v1/characters/edit-by-id` 200 response. `moderation` covers the
 * free-text fields this edit changed; only the `passed` ones were saved, the
 * rest of the edit applied as usual.
 */
export type EditCharacterResponse = {
  message: string;
  moderation?: FieldModeration;
  /** Why each rejected field was refused. */
  moderation_details?: FieldModerationDetails;
  /** The undo record this edit wrote — pass it to `retryCharacterImage`. */
  revision_id?: string | null;
  can_undo?: boolean;
};

/**
 * `POST /api/v1/characters/set-profile-picture` body.
 * Identify the image by CharacterMedia.id. The target character is derived
 * from that row — owner-only, images only, and the media must belong to a
 * character the caller owns.
 */
export type SetCharacterProfilePictureBody = {
  character_media_id: string;
};

/** `POST /api/v1/characters/set-profile-picture` 200. */
export type SetCharacterProfilePictureResponse = {
  message: string;
};

/**
 * `POST /api/v1/characters/delete/:characterId` body. Absent/false keeps the
 * caller's own media and chat history; true deletes them too. See the
 * character-delete API contract — the server never infers this from a count.
 */
export type DeleteCharacterBody = { delete_media: boolean };

/** `POST /api/v1/characters/delete/:characterId` 200 response. Idempotent. */
export type DeleteCharacterResponse = { detail: string };

/**
 * `GET /api/v1/characters/edit-payload/:characterId` 200 response.
 *
 * The character's layer-1 fields shaped exactly like a create body, so the edit
 * flow can prefill itself through the same mapper the "Design with AI" draft
 * uses and post the result straight back to `edit-by-id`.
 *
 * Owner-only (or `characters:moderate`) — a non-owner gets 404. Deliberately
 * NOT `fetch-by-id`: that response omits `occupation`, `fetish`, `backstory`,
 * `personality_description`, `greeting_message`, `extra_physical_details` and
 * every `*_custom` field, so prefilling from it would post them back empty.
 */
export type CharacterEditPayloadResponse = {
  character: CreateCharacterBody;
  /** Whether `undo-last-change` has a saved change to revert. */
  can_undo?: boolean;
};

/** `POST /api/v1/characters/design` body. */
export type DesignCharacterBody = {
  gender: string;
  style: string;
  prompt?: string;
};

/** `POST /api/v1/characters/design` 200 response. Draft is create-body shaped. */
export type DesignCharacterResponse = {
  draft: CreateCharacterBody;
  llm_used: boolean;
};

/**
 * Why a generation ended without media (BACK-90). Mirrors the backend's
 * `MediaFailureReason` — deliberately coarse: it says what the UI has to decide
 * (which sentence to show, whether to offer a retry) and nothing more.
 *
 * - `moderation` / `moderation_warning` / `moderation_ban` — the prompt was
 *   refused. Deterministic, so retrying the same input is pointless; the
 *   backend reports these with `retryable: false`.
 * - `generation` — the provider failed or returned nothing usable.
 * - `timeout` — the provider accepted the job and never finished in time.
 * - `unavailable` — nothing was even started (no worker alive / queue refused).
 * - `internal` — our side broke around an otherwise fine generation.
 */
export type MediaFailureReason =
  | "moderation"
  | "moderation_warning"
  | "moderation_ban"
  | "generation"
  | "timeout"
  | "unavailable"
  | "internal";

/**
 * A terminal image-generation failure, as the backend reports it.
 *
 * `message` is owned by the backend (`failureMessageFor`) so the copy cannot
 * drift between the two repos, and a reason this app has never heard of still
 * renders a real sentence instead of a blank card. `retryable` is likewise the
 * backend's call — it is false for every moderation grade.
 */
export type GenerationFailure = {
  reason: MediaFailureReason;
  message: string;
  retryable: boolean;
  /**
   * Whether the coins charged for this generation were actually given back.
   *
   * A fact reported by the backend, not a policy the UI may assume: it is false
   * when the debit was already reversed or the refund could not be written, and
   * absent when nobody made a claim either way. Only `true` earns the "No coins
   * were deducted" line — anything else stays silent rather than promising the
   * user money that never moved.
   */
  refunded?: boolean;
  /**
   * The image provider's own moderation sentence, e.g. "Rejected by the
   * underage policy: the content appears to depict a minor." Only present on a
   * `moderation*` reason, when their moderation refused the image and said why.
   */
  moderation_reason?: string;
};

/** `POST /api/v1/characters/create` 201 response (legacy shape). */
export type CreateCharacterResponse = {
  message: string;
  image_path: string | null;
  id: string;
  name: string;
  username: string;
  sdxl_prompt: string | null;
  background_processing: boolean;
  /**
   * The name and flavor fields the create left blank and the backend filled
   * with AI (BACK-398, FRONT-882) — absent when none were. Create does the
   * autofill itself, in the same request.
   */
  autofilled?: Partial<
    Pick<
      CreateCharacterBody,
      "name" | "bio" | "backstory" | "personality_description" | "greeting_message"
    >
  >;
  /**
   * Present ONLY when the generation could not be started at all (BACK-90) —
   * the character exists and was charged for, but nothing was enqueued, so no
   * `media.failed` event will ever arrive over SSE. The client cannot subscribe
   * before it has this response, which is exactly why the terminal state is
   * inlined here rather than published to the (ephemeral) event channel.
   */
  generation_failure?: GenerationFailure;
};

/** `GET /api/v1/characters/create-status/:idempotencyKey` 200 response (BACK-95). */
export type CreateStatusResponse = {
  status: "unknown" | "in_progress" | "succeeded";
  character: CreateCharacterResponse | null;
};

/**
 * The card that rides next to a character's existing image fields (character
 * dicts, My AIs). Per viewer, like the image fields: a blurred viewer gets the
 * blurred card. `null` until it exists; absent on older responses. Read it
 * through `characterCardSrc`, never directly.
 */
export type CharacterCardUrls = {
  /** ≤480 px WebP card of the image the card shows (profile image ?? reference image). */
  thumbnail_url?: string | null;
};

/**
 * Subset of `GET /api/v1/characters/fetch-by-id/:characterId`'s dict this app
 * polls after create — the image (and bio) are generated in the background,
 * so they are null until the pipeline finishes.
 */
export type CharacterDetail = CharacterCardUrls & {
  id: string;
  name: string;
  bio: string | null;
  /**
   * The character's chosen voice. Present here and NOT on
   * `CharacterEditPayloadResponse`, which is why the edit flow takes it from
   * this response — see `create-ai-girlfriend-view.tsx`.
   */
  voice_id: string | null;
  image_url_s3: string | null;
  webp_image_url_s3: string | null;
  presigned_image_url_s3: string | null;
  /** The backend's decision that this viewer must see it blurred. Absent on older responses. */
  blurred?: boolean;
  /**
   * Where the character's own image generation stands (BACK-387), so a client
   * that reloaded mid-generation can tell "still working" from "already
   * failed" without waiting out a poll. Optional: a backend that predates it
   * omits the field, and `status: null` is a character created before the
   * backend tracked it — both mean "unknown", never "failed".
   */
  image_generation?: {
    status: "pending" | "ready" | "failed" | null;
    /** Non-null only when `status` is `"failed"` — the same copy the `media.failed` event carries. */
    failure: GenerationFailure | null;
  };
};

/** `GET /api/v1/characters/fetch-by-id/:characterId` 200 response. */
export type FetchCharacterByIdResponse = { character: CharacterDetail };

/** `POST /api/v1/characters/retry-image` 202 response for the `character_id` mode. */
export type RetryCharacterImageResponse = {
  message: string;
  background_processing: boolean;
  can_undo?: boolean;
};

/** `POST /api/v1/characters/undo-last-change` 200 response. */
export type UndoLastCharacterChangeResponse = {
  message: string;
  /** Whether the previous image came back too (false for a text-only change). */
  image_restored: boolean;
  /** Whether another undo step is available. */
  can_undo: boolean;
};

/**
 * One entry of `GET /api/v1/characters/fetch-loggedin-user`.
 *
 * The image fields are PRESIGNED S3 URLs minted per response, not stable links —
 * they expire (`S3_PRESIGNED_EXPIRES`), so this payload must not be cached
 * client-side beyond its lifetime.
 */
export type MyCharacterListItem = CharacterCardUrls & {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  style: string | null;
  gender: string;
  image_url_s3: string | null;
  webp_image_url_s3: string | null;
  gif_url_s3: string | null;
  presigned_url: string | null;
  created_at: string | null;
  privacy: string | null;
  /**
   * The VIEWER's own images/videos created with this character — never a
   * count of everyone's media, since only the owner's is theirs to delete.
   * See character-delete API contract.
   */
  my_media: { images: number; videos: number };
  /** ISO timestamp the owner removed this character, or `null` if still live. */
  removed_at: string | null;
  /** Rating of the image in `image_url_s3` (My AIs: the profile image); `null` until tagged. */
  nsfw?: boolean | null;
  /** The backend's decision that this viewer must see it blurred. Absent on older responses. */
  blurred?: boolean;
  /**
   * Whether new images of this character can be generated — false when the
   * portrait was uploaded rather than generated. Absent on older responses.
   */
  can_generate_from?: boolean;
};

/** `GET /api/v1/characters/fetch-loggedin-user` 200 response (snake_case, legacy shape). */
export type MyCharactersResponse = {
  items: MyCharacterListItem[];
  total: number;
  page: number;
  per_page: number;
};

/**
 * Query for the caller's own characters. `search` matches name + bio; `style`
 * and `gender` are case-insensitive exact matches. Omit a field to leave it
 * unfiltered — the backend only recognises the literal "all" as a wildcard, so
 * UI values like "Any" must never be forwarded.
 */
export type MyCharactersQuery = {
  page?: number;
  per_page?: number;
  search?: string;
  style?: string;
  gender?: string;
};

/**
 * One entry of `GET /api/v1/characters/fetch-default` — the PUBLIC character
 * list (no auth required). Mirrors `MyCharacterListItem` but drops the
 * fields this endpoint doesn't return: `webp_image_url_s3`, `created_at`,
 * `privacy`.
 *
 * The image fields are the same "not stable, may expire" shape as
 * `MyCharacterListItem` — see that type's doc comment.
 */
export type PublicCharacterListItem = CharacterCardUrls & {
  id: string;
  name: string;
  username: string;
  bio: string | null;
  style: string | null;
  gender: string;
  image_url_s3: string | null;
  gif_url_s3: string | null;
  presigned_url: string | null;
  /** Rating of the image in `image_url_s3` (My AIs: the profile image); `null` until tagged. */
  nsfw?: boolean | null;
  /** The backend's decision that this viewer must see it blurred. Absent on older responses. */
  blurred?: boolean;
  /**
   * Whether new images of this character can be generated — false when the
   * portrait was uploaded rather than generated. Absent on older responses.
   */
  can_generate_from?: boolean;
};

/** `GET /api/v1/characters/fetch-default` 200 response (snake_case, legacy shape). */
export type PublicCharactersResponse = {
  items: PublicCharacterListItem[];
  total: number;
  page: number;
  per_page: number;
};

/**
 * Query for the public character list. `style` and `gender` are
 * case-insensitive exact matches. Omit a field to leave it unfiltered — the
 * backend only recognises the literal "all" as a wildcard, so UI values like
 * "Any" must never be forwarded (same caveat as `MyCharactersQuery`).
 */
export type PublicCharactersQuery = {
  page?: number;
  per_page?: number;
  style?: string;
  gender?: string;
};

/**
 * `GET /api/v1/user/get-profile` 200 response, narrowed to the fields the app
 * reads. The endpoint returns the full snake_case profile snapshot; `username`
 * and `gender` are always populated (registration assigns a username and the
 * profile row defaults `gender` to "male").
 */
export type UserProfileResponse = {
  id: string;
  email: string;
  full_name: string | null;
  username: string;
  /** Backend vocabulary: "male" | "female" | "other". */
  gender: string;
  birth_date: string | null;
  profile_image_url: string | null;
  marketing_notifications: boolean;
  product_notifications: boolean;
};

/**
 * One entry of `GET /api/v1/voices` — the whole public shape of a voice.
 *
 * The catalogue row's provider, provider voice id and design prompt are
 * admin-only secrets and are absent by construction (the backend's response
 * schema strips them); do not add them here expecting them to arrive.
 */
export type PublicVoice = {
  id: string;
  name: string;
  /** BCP-47 tag, e.g. "en-US". One language per voice — the same timbre in two languages is two rows. */
  language: string;
  /** Exactly "female" or "male". The catalogue has no other value. */
  gender: string;
  /** Absolute, directly playable mp3 URL. Per-brand buckets mean the host varies — never hardcode an origin. */
  sample_url: string;
  /**
   * The voice to pre-select for its gender + language, chosen in the admin. At
   * most one per gender + language; a group may have none (see `defaultVoice`).
   */
  is_default: boolean;
};

/**
 * Query for `GET /api/v1/voices`. All optional; no filter means the whole
 * catalogue visible to the requesting brand, in picker order: the default
 * voice first, then the most used, then alphabetically.
 *
 * There is no brand parameter on purpose — the backend resolves the brand from
 * the request origin and ignores anything the caller claims.
 */
export type VoicesQuery = {
  language?: string;
  /** "female" | "male" only. For a Trans character the FRONTEND picks the pool; the backend has no mapping. */
  gender?: string;
  /** Case-insensitive name search. */
  q?: string;
  /** Defaults to 50 server-side, capped at 200. */
  limit?: number;
  /** Opaque keyset cursor from a previous response's `next_cursor`. */
  cursor?: string;
};

/**
 * One action, clothing or location the generate forms offer. The whole public
 * shape: the prompt terms behind an option are admin-only and never arrive.
 */
export type GenerateOption = {
  /** The create-image / create-video field value. Labels are not unique across media. */
  key: string;
  label: string;
  /** Asset-map key of the poster image and/or the preview video. Either may be missing. */
  asset_key: string;
  /** Optional grouping in the picker. */
  category: string | null;
  /** Show the "New" badge. */
  is_new: boolean;
};

/**
 * `GET /api/v1/generate/options` 200 response. Active options only, in picker
 * order. Actions are per media: the same key can be in both lists.
 */
export type GenerateOptionsResponse = {
  actions: { image: GenerateOption[]; video: GenerateOption[] };
  clothing: GenerateOption[];
  locations: GenerateOption[];
};

/** `GET /api/v1/voices` 200 response. Keyset-paginated, so there is no total. */
export type VoicesResponse = {
  items: PublicVoice[];
  next_cursor: string | null;
  has_more: boolean;
};

/** Public location policy; `GET /api/v1/info` requires no session. */
export type InfoResponse = Pick<MeResponse, "location" | "age_verification_needed">;

/** `GET /api/v1/me` 200 response. */
export type MeResponse = {
  /** Current request geolocation; unresolved fields are null. */
  location: {
    ip: string | null;
    country_code: string | null;
    country_name: string | null;
    region: string | null;
    city: string | null;
  };
  age_verified: boolean;
  /** Whether the current location requires verification, independently of account verification. */
  age_verification_needed: boolean;
  is_authenticated: boolean;
  has_active_subscription: boolean;
  token_balance: number;
  subscription_coin_reward: number;
  subscription_plan_name: string;
  plan: string | null;
  interval: "monthly" | "quarterly" | "yearly" | null;
  nextTier: string | null;
  /** ISO datetime, or null when there's no subscription or it never expires (infinite/lifetime). */
  subscription_expires_at: string | null;
};

/** One row from `create-image`'s `media` array (FRONT-552). Prefer `id` over URL. */
export type CharacterMediaRef = {
  id: string;
  url: string;
  media_type: string;
  character_id?: string | null;
  created_at: string;
  /** Content rating; `null` until tagged. */
  nsfw?: boolean | null;
  /** The backend's decision that this viewer must see it blurred. Absent on older responses. */
  blurred?: boolean;
  /**
   * Whether this image can be the source of an edit or animation — only images
   * Phantom Router generated can. Absent on older responses; treat as allowed.
   */
  can_generate_from?: boolean;
};

/**
 * Card renditions that ride next to a media item's existing URL
 * (`s3_path_gallery`, a chip's `image_url`). Per viewer, like that URL: for a
 * `blurred` image `web_url` is the blurred image and `web_hd_url` null; for a
 * `blurred` video `web_url` / `web_hd_url` are the blurred muted videos (or
 * `null` until they exist) and `poster_url` the blurred poster. No clear URL
 * is ever sent to a blurred viewer. A clear field is `null` until its
 * derivative exists; absent on older responses. Read them through
 * `mediaCardSources`, never directly.
 */
export type MediaCardUrls = {
  /** ≤480 px card: WebP for an image, muted MP4 for a video (blurred when `blurred`). */
  web_url?: string | null;
  /** ≤1280 px full-screen rendition: WebP for an image, MP4 with audio for a video; when blurred, `null` for an image and the muted blurred video for a video. */
  web_hd_url?: string | null;
  /** Videos only: WebP still for the card's `poster` (the blurred poster when blurred). */
  poster_url?: string | null;
};

/**
 * One row from `GET /api/v1/characters/media/get-users-character-media`.
 * Display URL is `s3_path_gallery` (presigned). Prefer `id` over that URL.
 */
export type UsersCharacterMediaItem = MediaCardUrls & {
  id: string;
  character_id: string | null;
  user_id: string;
  media_type: string;
  s3_path_gallery: string;
  mime_type: string;
  created_at: string;
  /** Content rating; `null` until tagged. */
  nsfw?: boolean | null;
  /** The backend's decision that this viewer must see it blurred. Absent on older responses. */
  blurred?: boolean;
  /**
   * Whether this image can be the source of an edit or animation — only images
   * Phantom Router generated can. Absent on older responses; treat as allowed.
   */
  can_generate_from?: boolean;
  pose: string | null;
  prompt: string | null;
  aspect_ratio?: string | null;
  checkpoint?: string | null;
};

/** Query for the caller's own generated media. Auth required. */
export type UsersCharacterMediaQuery = {
  /** Defaults to 60. */
  limit?: number;
  /** Opaque keyset cursor from a previous response's `next_cursor`. */
  cursor?: string;
};

/** `GET /api/v1/characters/media/get-users-character-media` 200. */
export type UsersCharacterMediaResponse = {
  message: string;
  media: UsersCharacterMediaItem[];
  next_cursor: string | null;
  has_more: boolean;
};

/**
 * `POST /api/v1/characters/media/delete-media` body.
 * IDs are `UsersCharacterMediaItem.id` from get-users-character-media.
 * Single delete: `character_media_id`. Bulk: `character_media_ids` (one request).
 */
export type DeleteCharacterMediaBody = {
  character_media_id?: string;
  character_media_ids?: string[];
};

/** `POST /api/v1/characters/media/delete-media` 200. */
export type DeleteCharacterMediaResponse = {
  message?: string;
};

/** `POST /api/v1/characters/media/create-image` body. */
export type CreateCharacterImageBody = {
  /** Optional. Omit when empty. Ignored (reset to "") for non-premium users. */
  prompt?: string;
  source_media_id?: string;
  character_id?: string;
  num_images?: number;
  name?: string;
  /** Action key or display label (e.g. "Missionary" or `missionary`). */
  action?: string;
  /** Clothing key or display label (e.g. "Bikini"). */
  clothing?: string;
  /** Location key or display label (e.g. "Tropical Beach"). */
  location?: string;
  aspect_ratio?: string;
};

/**
 * `POST /api/v1/characters/media/create-image` 200.
 * `media` is identity; `image_paths` is a URL-only alias until it is removed.
 * The two are index-aligned when both are present.
 */
export type CreateCharacterImageResponse = {
  message: string;
  media?: CharacterMediaRef[];
  image_paths?: string[];
  status_code?: number;
};

/**
 * `POST /api/v1/characters/media/edit-image` body.
 * Identify the source by CharacterMedia.id only — never a URL.
 */
export type EditCharacterImageBody = {
  source_media_id: string;
  prompt: string;
  num_images?: number;
};

/**
 * `POST /api/v1/characters/media/edit-image` 200.
 * Synchronous prototype (same `media` / `image_paths` shape as create-image).
 * Regenerates with the source as a face reference; it is not img2img/inpaint.
 */
export type EditCharacterImageResponse = CreateCharacterImageResponse;

/**
 * `POST /api/v1/characters/media/edit-video` body.
 * Identify the source by CharacterMedia.id only — never a URL.
 * The job is asynchronous, same contract as create-video.
 */
export type EditCharacterVideoBody = {
  source_media_id: string;
  prompt: string;
  duration?: number;
  resolution?: string;
  aspect_ratio?: string;
};

/** `POST /api/v1/characters/media/edit-video` 200 — generation is async. */
export type EditCharacterVideoResponse = CreateCharacterVideoResponse;

/**
 * `POST /api/v1/characters/media/extend-video` body.
 * Identify the source by CharacterMedia.id only — never a URL.
 * The job is asynchronous, same contract as edit-video.
 */
export type ExtendCharacterVideoBody = {
  source_media_id: string;
  prompt: string;
  duration?: number;
  resolution?: string;
  aspect_ratio?: string;
};

/** `POST /api/v1/characters/media/extend-video` 200 — generation is async. */
export type ExtendCharacterVideoResponse = CreateCharacterVideoResponse;

/**
 * `POST /api/v1/characters/media/create-video` body.
 * Prefer `source_media_id` (CharacterMedia.id from create-image). Do not send
 * `image_url` when a media id is available — the backend resolves the image.
 */
export type CreateCharacterVideoBody = {
  character_id: string;
  name: string;
  /** Optional. Omit when empty. Ignored (reset to "") for non-premium users. */
  prompt?: string;
  duration?: number;
  resolution?: string;
  negative_prompt?: string;
  /** CharacterMedia.id of the image to animate. */
  source_media_id?: string;
  image_url?: string;
  /** Video-list action key or display label. Do not forward the source image's action. */
  action?: string;
  clothing?: string;
  location?: string;
  /**
   * Image action (key or label) to pick a random stored image of this character.
   * Ignored when `source_media_id` is given.
   */
  action_name?: string;
  aspect_ratio?: string;
};

/** `POST /api/v1/characters/media/create-video` 200 — generation is async. */
export type CreateCharacterVideoResponse = {
  message: string;
  video_url: string | null;
  job_id: string;
  video_job_id?: string;
  status: string;
  /** CharacterMedia.id when the backend includes it on start. */
  media_id?: string | null;
};

/** `GET /api/v1/characters/media/video-status/:job_id` 200. */
export type CharacterVideoJobStatus = {
  job_id: string;
  status: "queued" | "generating" | "processing" | "completed" | "failed" | string;
  video_url: string | null;
  reason?: string | null;
  message?: string | null;
  retryable?: boolean | null;
  /** CharacterMedia.id when the completed job persisted a row. */
  media_id?: string | null;
};

/** `GET /api/v1/characters/media/:id/remix-params` 200. Ownership-scoped. */
export type RemixParamsResponse = {
  media_id: string;
  character_id: string | null;
  character: {
    id: string;
    name: string;
    image_url: string;
    removed_at: string | null;
  } | null;
  action: string | null;
  clothing: string | null;
  location: string | null;
  seed: number | null;
  prompt: string | null;
  prompt_available: boolean;
};
