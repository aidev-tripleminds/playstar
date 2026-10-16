import type { StaticImageData } from "next/image";
import type * as React from "react";

import type {
  QuickActionsContentType,
  QuickActionsModelStatus,
} from "@/components/common/image-preview/quick-actions/types";

export type MediaPreviewItem = {
  id: string;
  src: string | StaticImageData;
  alt?: string;
  description?: string;
  videoSrc?: string;
  /** CharacterMedia.id when this slide is a gallery row. */
  mediaId?: string;
  /** Required to Animate (create-video needs character_id + source_media_id). */
  characterId?: string | null;
  kind?: "image" | "video";
  /** The API's `blurred`: `src` is already a safe still; overlays the unblur CTA. */
  blurred?: boolean;
  /**
   * Grid tile source from `mediaCardSources`: the ≤480 px card (a muted MP4
   * for a video). Absent → tiles fall back to `videoSrc` / `src`.
   */
  cardSrc?: string;
  /** Still for a video tile's `poster` and its carousel thumbnail. */
  posterSrc?: string;
  /**
   * Full-screen source (HD rendition ?? original) for the main view: the image,
   * or the video to play. Absent → `src` / `videoSrc`. Downloads keep those.
   */
  fullSrc?: string;
};

export type MediaPreviewLockMode = "coins" | "premium";

export type MediaPreviewVariant = "default" | "locked" | "premium";

export type MediaPreviewProps = Omit<React.ComponentProps<"div">, "onSelect"> & {
  variant?: MediaPreviewVariant;
  items?: MediaPreviewItem[];
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onSelectedIndexChange?: (index: number) => void;
  modelStatus?: QuickActionsModelStatus;
  modelTitle?: string;
  modelImageSrc?: string | StaticImageData;
  onCreateModelClick?: () => void;
  postedAt?: string;
  prompt?: string;
  unlockCost?: number;
  onUnlockPrompt?: () => void;
  metadata?: string[];
  content?: QuickActionsContentType;
  onClose?: () => void;
  onExpand?: () => void;
  onDownload?: () => void;
  onMore?: () => void;
  onMoreItemClick?: (value: string) => void;
  /** FRONT-611: reveal "Set as profile picture" for an owned character image. */
  showSetProfilePicture?: boolean;
  onEdit?: () => void;
  onRemix?: () => void;
  /**
   * Loads the current image into Image to video.
   * On mobile, Animate opens a choice first; Custom prompt calls this.
   */
  onCreateVideo?: () => void;
  /** Loads the current video into Extend video (custom prompt). */
  onExtendVideo?: () => void;
  /** Fired when Use in template is chosen. The template picker still opens. */
  onUseInTemplate?: () => void;
  onQuickAction?: (value: string) => void;
  createVideoLabel?: string;
  editDisabled?: boolean;
  remixDisabled?: boolean;
  createVideoDisabled?: boolean;
  extendVideoDisabled?: boolean;
  /**
   * Mirrors the image's `can_generate_from`. When false, image actions that
   * feed it back to the provider (Edit image, Create video) are hidden.
   */
  canGenerateFrom?: boolean;
  /**
   * When false, hide every action that starts a video generation: Animate,
   * Use in template, Extend and Edit video. Image actions are unaffected.
   */
  showVideoActions?: boolean;
  /**
   * When false, hide save, download, the overflow menu, and generation
   * actions. Surfaces that only preview public media use this.
   */
  showActions?: boolean;
};
