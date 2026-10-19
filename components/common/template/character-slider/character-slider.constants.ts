import { dummyImage } from "@/lib/dummy-images";
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
  { id: "1", imageSrc: dummyImage(170), imageAlt: "Character slide 1" },
  {
    id: "2",
    imageSrc: dummyImage(171),
    imageAlt: "Character slide 2",
  },
  {
    id: "3",
    imageSrc: dummyImage(172),
    imageAlt: "Character slide 3",
  },
  {
    id: "4",
    imageSrc: dummyImage(173),
    imageAlt: "Character slide 4",
  },
  {
    id: "5",
    imageSrc: dummyImage(174),
    imageAlt: "Character slide 5",
  },
];
