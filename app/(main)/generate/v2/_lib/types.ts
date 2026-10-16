import type { PlaceholderProcessingState } from "@/components/common/general/placeholder-processing/placeholder-processing";
import type { MediaPreviewItem } from "@/components/common/image-preview/media-preview/types";

import type { GenerateMediaRequest } from "../../_lib/generate-media";

export const GENERATE_SECTION_TAB_IDS = ["templates", "images", "videos"] as const;

export type GenerateSectionTabId = (typeof GENERATE_SECTION_TAB_IDS)[number];

export type GenerateMediaKind = "image" | "video";

export type GenerateGalleryItem = MediaPreviewItem & {
  kind: GenerateMediaKind;
  isNsfw?: boolean;
  canGenerateFrom?: boolean;
  prompt?: string;
  characterName?: string;
  characterImageSrc?: string;
  pose?: string;
  checkpoint?: string | null;
  aspectRatio?: string | null;
  /** ISO timestamp from the media row's `created_at`. */
  createdAt?: string;
};

export const GENERATE_SOURCE_SLOT_IDS = [
  "character",
  "action",
  "clothing",
  "location",
  "image",
  "video",
  "audio",
] as const;

export type GenerateSourceSlotId = (typeof GENERATE_SOURCE_SLOT_IDS)[number];

export type GenerateActionClip = {
  id: string;
  label: string;
  imageSrc: string;
};

export type GenerateImageSourceSelection = {
  kind?: "image";
  id: string;
  imageSrc: string;
  imageAlt: string;
  label: string;
  /** Text to Video timeline, in order. The Action placeholder shows the first clip. */
  clips?: GenerateActionClip[];
};

export type GenerateAudioSourceSelection = {
  kind: "audio";
  id: string;
  audioSrc: string;
  audioLabel: string;
};

export type GenerateSourceSelection = GenerateImageSourceSelection | GenerateAudioSourceSelection;

export type GenerateCreatePayload = {
  prompt: string;
  kind: GenerateMediaKind;
  count: number;
  aspectRatio: string;
  resolution?: string;
  duration?: string;
  /** When true, skip the Queue stage and start at Processing. */
  skipQueue?: boolean;
  /** Logged-in generate: create-image / edit-image / edit-video / extend-video / create-video. Shared with v1. */
  request?: GenerateMediaRequest;
};

/** Gallery card shown while a generation request is in flight. */
export type GenerateProcessingItem = {
  id: string;
  kind: GenerateMediaKind;
  state: PlaceholderProcessingState;
  /** 0–100 while `state === "generating"`. */
  progressPercent?: number;
  prompt?: string;
  /** Mock outcome flag used when retrying / skipping the queue. */
  willFail?: boolean;
  /**
   * True while this card is waiting for an earlier generation in the queue.
   * Waiting cards stay on Queue until the previous job finishes.
   */
  waitingForTurn?: boolean;
  payload: GenerateCreatePayload;
  /** Backend `message` from the failed request. Absent when it sent none. */
  failure?: string;
  /**
   * When this attempt was started, refreshed when it fails.
   * The gallery uses it to place a failed card among completed images.
   */
  createdAt?: string;
};
