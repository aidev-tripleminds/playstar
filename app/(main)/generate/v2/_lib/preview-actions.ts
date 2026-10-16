import type { PromptBoxMedia } from "@/components/common/generate/prompt-box";

import {
  canAnimateGeneratedMedia,
  canEditGeneratedMedia,
  canRemixGeneratedMedia,
  characterMediaIdFromGalleryItem,
} from "../../_lib/generate-media";
import { GENERATE_IMAGES_SECTION_INDEX, GENERATE_VIDEOS_SECTION_INDEX } from "./constants";
import type { GenerateGalleryItem, GenerateSectionTabId } from "./types";

export type GeneratePreviewAction = "edit" | "remix" | "animate" | "extend";

export type GeneratePreviewComposerTarget = {
  action: GeneratePreviewAction;
  sectionTabId: GenerateSectionTabId;
  sectionIndex: number;
  media: PromptBoxMedia;
};

export function resolveGenerateMediaSrc(src: GenerateGalleryItem["src"] | undefined) {
  if (!src) return "";
  return typeof src === "string" ? src : src.src;
}

export function canAnimateGenerateItem(item: GenerateGalleryItem | null | undefined) {
  return canAnimateGeneratedMedia(item);
}

export function canEditGenerateItem(item: GenerateGalleryItem | null | undefined) {
  if (item?.kind === "video") {
    return Boolean(item.mediaId && characterMediaIdFromGalleryItem(item));
  }
  return canEditGeneratedMedia(item);
}

export function canRemixGenerateItem(item: GenerateGalleryItem | null | undefined) {
  return canRemixGeneratedMedia(item);
}

export function getGeneratePreviewComposerTarget(
  action: GeneratePreviewAction,
  item?: Pick<GenerateGalleryItem, "kind"> | null,
): GeneratePreviewComposerTarget {
  if (action === "animate") {
    return {
      action,
      sectionTabId: "videos",
      sectionIndex: GENERATE_VIDEOS_SECTION_INDEX,
      media: "video-image2vid",
    };
  }

  if (action === "extend") {
    return {
      action,
      sectionTabId: "videos",
      sectionIndex: GENERATE_VIDEOS_SECTION_INDEX,
      media: "video-extend",
    };
  }

  if (action === "edit") {
    if (item?.kind === "video") {
      return {
        action,
        sectionTabId: "videos",
        sectionIndex: GENERATE_VIDEOS_SECTION_INDEX,
        media: "video-edit",
      };
    }

    return {
      action,
      sectionTabId: "images",
      sectionIndex: GENERATE_IMAGES_SECTION_INDEX,
      media: "image-edit",
    };
  }

  return {
    action,
    sectionTabId: "images",
    sectionIndex: GENERATE_IMAGES_SECTION_INDEX,
    media: "image-presets",
  };
}
