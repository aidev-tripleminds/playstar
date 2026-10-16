import { resolveAsset } from "@/lib/assets/asset-store";
/** Figma Character Slider (node 16974-73566). */
export type CharacterSliderSize = "desktop" | "mobile";

export type CharacterSliderSlide = {
  id: string;
  imageSrc: string;
  videoSrc?: string;
  /** Still shown before the video plays. */
  posterSrc?: string;
  imageAlt?: string;
  locked?: boolean;
  /**
   * The API's `blurred`: its URLs are already safe (`videoSrc` is then the
   * muted blurred video, played looped without controls under the unblur CTA).
   */
  blurred?: boolean;
};

export const CHARACTER_SLIDER_SIZES = [
  "desktop",
  "mobile",
] as const satisfies readonly CharacterSliderSize[];

export const CHARACTER_SLIDER_LOCKED_TITLE = "Do you want more?";
export const CHARACTER_SLIDER_LOCKED_CTA = "Check her content";

export const CHARACTER_SLIDER_DEFAULT_SLIDES: CharacterSliderSlide[] = [
  { id: "1", imageSrc: resolveAsset("demo_pics_dog").image ?? "", imageAlt: "Character slide 1" },
  {
    id: "2",
    imageSrc: resolveAsset("demo_pics_model1").image ?? "",
    imageAlt: "Character slide 2",
  },
  {
    id: "3",
    imageSrc: resolveAsset("demo_pics_model2").image ?? "",
    imageAlt: "Character slide 3",
  },
  {
    id: "4",
    imageSrc: resolveAsset("demo_pics_model3").image ?? "",
    imageAlt: "Character slide 4",
  },
  {
    id: "5",
    imageSrc: resolveAsset("demo_pics_model4").image ?? "",
    imageAlt: "Character slide 5",
  },
];
