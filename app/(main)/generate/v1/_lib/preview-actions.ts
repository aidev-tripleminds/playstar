import type { StaticImageData } from "next/image";

import type { PromptboxHybridMedia } from "@/components/common/generate/promptbox-hybrid";

import {
  canAnimateGeneratedMedia,
  canEditGeneratedMedia,
  canRemixGeneratedMedia,
} from "../../_lib/generate-media";
import {
  GENERATE_IMAGE_EDIT_TAB,
  GENERATE_IMAGE_PRESETS_TAB,
  GENERATE_IMAGES_SECTION_INDEX,
  GENERATE_VIDEO_EDIT_TAB,
  GENERATE_VIDEO_EXTEND_TAB,
  GENERATE_VIDEO_IMAGE2VID_TAB,
  GENERATE_VIDEOS_SECTION_INDEX,
  type GenerateGalleryItem,
  type GenerateSectionTabId,
} from "./constants";

export type GeneratePreviewAction = "edit" | "remix" | "animate" | "extend";

export type GeneratePreviewComposerTarget = {
  action: GeneratePreviewAction;
  sectionTabId: GenerateSectionTabId;
  sectionIndex: number;
  promptTab: number;
  media: PromptboxHybridMedia;
};

export function resolveGenerateMediaSrc(src: string | StaticImageData | undefined) {
  if (!src) return "";
  return typeof src === "string" ? src : src.src;
}

export function canAnimateGenerateItem(item: GenerateGalleryItem | null | undefined) {
  return canAnimateGeneratedMedia(item);
}

export function canRemixGenerateItem(item: GenerateGalleryItem | null | undefined) {
  return canRemixGeneratedMedia(item);
}

export function canEditGenerateItem(item: GenerateGalleryItem | null | undefined) {
  return canEditGeneratedMedia(item);
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
      promptTab: GENERATE_VIDEO_IMAGE2VID_TAB,
      media: "video-image2vid",
    };
  }

  if (action === "extend") {
    return {
      action,
      sectionTabId: "videos",
      sectionIndex: GENERATE_VIDEOS_SECTION_INDEX,
      promptTab: GENERATE_VIDEO_EXTEND_TAB,
      media: "video-extend",
    };
  }

  if (action === "edit") {
    if (item?.kind === "video") {
      return {
        action,
        sectionTabId: "videos",
        sectionIndex: GENERATE_VIDEOS_SECTION_INDEX,
        promptTab: GENERATE_VIDEO_EDIT_TAB,
        media: "video-edit",
      };
    }

    return {
      action,
      sectionTabId: "images",
      sectionIndex: GENERATE_IMAGES_SECTION_INDEX,
      promptTab: GENERATE_IMAGE_EDIT_TAB,
      media: "image-edit",
    };
  }

  return {
    action,
    sectionTabId: "images",
    sectionIndex: GENERATE_IMAGES_SECTION_INDEX,
    promptTab: GENERATE_IMAGE_PRESETS_TAB,
    media: "image-presets",
  };
}
