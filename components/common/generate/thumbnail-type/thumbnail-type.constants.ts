import type { CheckpointThumbnailVariant } from "../checkpoint-thumbnail";

export const THUMBNAIL_TYPE_TYPES = ["picture", "icon", "checkpoint"] as const;

export type ThumbnailTypeKind = (typeof THUMBNAIL_TYPE_TYPES)[number];

export const THUMBNAIL_TYPE_DEFAULT_TYPE: ThumbnailTypeKind = "picture";

export const THUMBNAIL_TYPE_DEFAULT_SIZE = 40;

export const THUMBNAIL_TYPE_DEFAULT_IMAGE_SRC = "/assets/ai-thumbnails/rec-ai.svg";

export const THUMBNAIL_TYPE_DEFAULT_ICON_SRC = "/assets/video-horizontal.svg";

export const THUMBNAIL_TYPE_DEFAULT_CHECKPOINT_VARIANT: CheckpointThumbnailVariant = "pony";

export const THUMBNAIL_TYPE_LABELS: Record<ThumbnailTypeKind, string> = {
  picture: "Picture thumbnail",
  icon: "Icon thumbnail",
  checkpoint: "Checkpoint thumbnail",
};

export const THUMBNAIL_TYPE_ICON_PADDING_RATIO = 0.2;
