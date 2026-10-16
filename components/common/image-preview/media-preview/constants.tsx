import { resolveAsset } from "@/lib/assets/asset-store";
import {
  DownloadIcon,
  FaceFemaleIcon,
  FlagIcon,
  GalleryPluscon,
  PublishIcon,
  ScissorIcon,
  ShareIcon,
  TrashIcon,
} from "@/public/assets/icons";

import { type OptionListItem } from "../../general/option-list/option-list";
import type { MediaPreviewItem } from "./types";

export const defaultMediaPreviewItems: MediaPreviewItem[] = [
  {
    id: "1",
    src: resolveAsset("demo_pics_dummy").image ?? "",
    // videoSrc: (resolveAsset("female_realistic_style_intro").video ?? ""),
    alt: "Preview 1",
    description:
      "This preview captures soft studio lighting with warm amber backdrop, featuring relaxed three-quarter pose and polished editorial finish. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "2",
    src: resolveAsset("demo_pics_model1").image ?? "",
    // videoSrc: (resolveAsset("female_anime_style_intro").video ?? ""),
    alt: "Preview 2",
    description:
      "This preview captures close-up portrait with natural skin detail, featuring subtle side glance and gentle beauty lighting. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "3",
    src: resolveAsset("demo_pics_model2").image ?? "",
    // videoSrc:
    //   (resolveAsset("female_realistic_ethnicity_latina").video ?? ""),
    alt: "Preview 3",
    description:
      "This preview captures full-body fashion frame with muted concrete wall, featuring soft architectural shadows and elongated stance. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "4",
    src: resolveAsset("demo_pics_model4").image ?? "",
    // videoSrc:
    //   (resolveAsset("female_realistic_ethnicity_asian").video ?? ""),
    alt: "Preview 4",
    description:
      "This preview captures editorial headshot with cool daylight, featuring clean minimal background and quiet confident expression. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "5",
    src: resolveAsset("demo_pics_cover_image").image ?? "",
    // videoSrc:
    //   (resolveAsset("female_realistic_ethnicity_black").video ?? ""),
    alt: "Preview 5",
    description:
      "This preview captures wide cover composition with cinematic contrast, featuring layered depth of field and dramatic horizon line. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "6",
    src: resolveAsset("demo_pics_pexel5").image ?? "",
    // videoSrc:
    //   (resolveAsset("female_realistic_ethnicity_arab").video ?? ""),
    alt: "Preview 6",
    description:
      "This preview captures playful cover crop with vibrant color accents, featuring centered framing and bright cheerful mood. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "7",
    src: resolveAsset("demo_pics_model4").image ?? "",
    // videoSrc:
    //   (resolveAsset("female_realistic_ethnicity_indian").video ?? ""),
    alt: "Preview 7",
    description:
      "This preview captures mid-shot portrait with gentle rim light, featuring calm confident expression and balanced studio setup. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "8",
    src: resolveAsset("demo_pics_pexel5").image ?? "",
    // videoSrc:
    //   (resolveAsset("female_realistic_ethnicity_elf").video ?? ""),
    alt: "Preview 8",
    description:
      "This preview captures lifestyle still with natural outdoor light, featuring shallow depth of field and candid everyday energy. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "9",
    src: resolveAsset("demo_pics_profile2").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 9",
    description:
      "This preview captures profile crop with even flattering light, featuring avatar-ready framing and soft neutral palette. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "10",
    src: resolveAsset("demo_pics_model7").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 10",
    description:
      "This preview captures high-contrast fashion look with bold color blocking, featuring sharp subject focus and graphic wardrobe detail. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "11",
    src: resolveAsset("demo_pics_profile2").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 11",
    description:
      "This preview captures alternate profile angle with softer highlights, featuring neutral palette and quiet intimate feel. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "12",
    src: resolveAsset("demo_pics_pexel2").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 12",
    description:
      "This preview captures candid street-style frame with ambient city light, featuring subtle motion blur and urban documentary mood. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "13",
    src: resolveAsset("demo_pics_pexel5").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 13",
    description:
      "This preview captures golden-hour crop with warm tones, featuring lightly blurred backdrop and sunlit romantic atmosphere. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "14",
    src: resolveAsset("demo_pics_model1").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 14",
    description:
      "This preview captures beauty close-up with eye detail emphasis, featuring soft fill lighting and refined skin texture. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "15",
    src: resolveAsset("demo_pics_model2").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 15",
    description:
      "This preview captures standing pose with elongated framing, featuring cool monochrome set and architectural negative space. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "16",
    src: resolveAsset("demo_pics_model3").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 16",
    description:
      "This preview captures seated portrait with directional window light, featuring quiet atmosphere and contemplative mood. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "17",
    src: resolveAsset("demo_pics_model4").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 17",
    description:
      "This preview captures classic three-point lighting with polished studio finish, featuring controlled highlights and timeless portrait look. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "18",
    src: resolveAsset("demo_pics_model7").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 18",
    description:
      "This preview captures dynamic angle with saturated color grade, featuring crisp subject separation and energetic fashion energy. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "19",
    src: resolveAsset("demo_pics_profile2").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 19",
    description:
      "This preview captures square profile crop with balanced exposure, featuring social thumbnail framing and clean edge detail. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "20",
    src: resolveAsset("demo_pics_pexel2").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 20",
    description:
      "This preview captures documentary-style shot with natural grain, featuring available light only and honest unposed feeling. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "21",
    src: resolveAsset("demo_pics_pexel5").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 21",
    description:
      "This preview captures sunlit outdoor frame with soft haze, featuring gentle color wash and breezy afternoon light. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "22",
    src: resolveAsset("demo_pics_model4").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 22",
    description:
      "This preview captures refined studio portrait with mirror-soft reflections, featuring cool tones and elegant composure. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "23",
    src: resolveAsset("demo_pics_model7").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 23",
    description:
      "This preview captures fashion mid-shot with graphic wardrobe, featuring high-key background and bold silhouette. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "24",
    src: resolveAsset("demo_pics_profile2").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 24",
    description:
      "This preview captures compact avatar still with centered framing, featuring clean edges and simple usable crop. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
  {
    id: "25",
    src: resolveAsset("demo_pics_pexel2").image ?? "",
    videoSrc: resolveAsset("female_realistic_style_intro").video ?? "",
    alt: "Preview 25",
    description:
      "This preview captures urban lifestyle capture with deep shadows, featuring neon accents and night city atmosphere. The composition keeps the subject as the clear focal point while supporting details stay secondary. Texture, color temperature, and contrast are tuned for a polished yet natural look on mobile and desktop. Soft background gradients separate the figure without visual noise, and the crop leaves room for UI overlays. Choose this frame when you want a distinctive carousel slide that still matches the series mood, lighting language, and storytelling rhythm across neighboring media preview images.",
  },
];

export const defaultMediaPreviewPromptPlaceholder = "Lorem";

/** FRONT-719: premium lock overlay on the blurred prompt. */
export const MEDIA_PREVIEW_PREMIUM_UNLOCK_LABEL = "Get premium to unlock";
export const defaultMediaPreviewMetadata = [
  "Klams AI",
  "1:1",
  defaultMediaPreviewPromptPlaceholder,
];
export const defaultMediaPreviewMetaVideodata = ["Klams AI", "1:1", "8.0s"];

export const defaultMediaPreviewPrompt =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit,  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

/**
 * FRONT-613: keep these quick actions in source, but omit them from menus
 * until they are wired. Pass a value in `revealedValues` (or remove it from
 * this set) to show it again.
 */
const HIDDEN_QUICK_ACTION_VALUES = new Set([
  "addCollection",
  "publish",
  "share",
  "report",
  "setProfilePic",
]);

function visibleQuickActions(
  items: OptionListItem[],
  revealedValues?: ReadonlySet<string>,
): OptionListItem[] {
  return items.filter(
    (item) => !HIDDEN_QUICK_ACTION_VALUES.has(item.value) || revealedValues?.has(item.value),
  );
}

const allDotOptionMenuItems: OptionListItem[] = [
  { value: "download", label: "Download", leftIcon: <DownloadIcon className="size-5" /> },
  { value: "delete", label: "Delete", leftIcon: <TrashIcon /> },
  { value: "setProfilePic", label: "Set as profile picture", leftIcon: <FaceFemaleIcon /> },
  {
    value: "addCollection",
    label: "Add to collection",
    leftIcon: <GalleryPluscon className="size-5" />,
  },
  { value: "publish", label: "Publish", leftIcon: <PublishIcon className="size-5" /> },
  { value: "share", label: "Share", leftIcon: <ShareIcon className="size-5" /> },
  { value: "report", label: "Report", leftIcon: <FlagIcon className="size-5" /> },
];

const allDotOptionMenuItemsVideo: OptionListItem[] = [
  { value: "download", label: "Download", leftIcon: <DownloadIcon className="size-5" /> },
  { value: "delete", label: "Delete", leftIcon: <TrashIcon /> },
  { value: "setProfilePic", label: "Set as profile video", leftIcon: <FaceFemaleIcon /> },
  {
    value: "addCollection",
    label: "Add to collection",
    leftIcon: <GalleryPluscon className="size-5" />,
  },
  { value: "publish", label: "Publish", leftIcon: <PublishIcon className="size-5" /> },
  { value: "share", label: "Share", leftIcon: <ShareIcon className="size-5" /> },
  { value: "edit", label: "Edit video", leftIcon: <ScissorIcon className="size-5" /> },
  { value: "report", label: "Report", leftIcon: <FlagIcon className="size-5" /> },
];

export function getMediaPreviewMenuItems({
  hasVideo = false,
  showSetProfilePicture = false,
}: {
  hasVideo?: boolean;
  showSetProfilePicture?: boolean;
} = {}): OptionListItem[] {
  const items = hasVideo ? allDotOptionMenuItemsVideo : allDotOptionMenuItems;
  const revealed = !hasVideo && showSetProfilePicture ? new Set(["setProfilePic"]) : undefined;
  return visibleQuickActions(items, revealed);
}

export const dotOptionMenuItems = getMediaPreviewMenuItems();
export const dotOptionMenuItemsVideo = getMediaPreviewMenuItems({ hasVideo: true });
