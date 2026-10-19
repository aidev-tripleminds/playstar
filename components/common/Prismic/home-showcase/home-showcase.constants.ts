import { dummyImage } from "@/lib/dummy-images";
/** Figma Home Showcase section (node 2919-17863). */
export const HOME_SHOWCASE_MAX_WIDTH_PX = 1148;
export const HOME_SHOWCASE_PADDING_Y_PX = 48;
export const HOME_SHOWCASE_DEFAULT_HEADING = "Heading 2";
export const HOME_SHOWCASE_DEFAULT_CTA_LABEL = "Start Creating";
export const HOME_SHOWCASE_DEFAULT_COUNT = "+30";
export const HOME_SHOWCASE_DEFAULT_IMAGE_SRC = dummyImage(169);

export const HOME_SHOWCASE_CENTER_CARD_WIDTH_PX = 125;
export const HOME_SHOWCASE_CENTER_CARD_HEIGHT_PX = 156;
export const HOME_SHOWCASE_SIDE_CARD_WIDTH_PX = 100;
export const HOME_SHOWCASE_SIDE_CARD_HEIGHT_PX = 125;
export const HOME_SHOWCASE_SIDE_CARD_ROTATION_DEG = 5;
export const HOME_SHOWCASE_SIDE_CARD_OFFSET_PX = 95;

export const HOME_SHOWCASE_CARD_BORDER_WIDTH_PX = 4;
export const HOME_SHOWCASE_CARD_BORDER_RADIUS_PX = 24;
export const HOME_SHOWCASE_CARD_BORDER_COLOR = "rgba(250, 250, 250, 0.8)";
export const HOME_SHOWCASE_CARD_INNER_BORDER_RADIUS_PX =
  HOME_SHOWCASE_CARD_BORDER_RADIUS_PX - HOME_SHOWCASE_CARD_BORDER_WIDTH_PX;

export const HOME_SHOWCASE_BACKGROUND_HEIGHT_PX = 420;
export const HOME_SHOWCASE_BACKGROUND_WIDTH_PX = 700;

export const HOME_SHOWCASE_SECTION_CLASS =
  "relative mx-auto flex w-full flex-col items-center  overflow-visible";

export const HOME_SHOWCASE_CARDS_CLASS =
  "relative flex w-full max-w-[447px] h-[259px] items-center justify-center";

export const HOME_SHOWCASE_BACKGROUND_CLASS = "pointer-events-none absolute inset-0 -z-10";

export const HOME_SHOWCASE_CARD_CLASS = "box-border shrink-0";

export const HOME_SHOWCASE_CARD_MEDIA_CLASS =
  "relative h-full w-full overflow-hidden bg-cover bg-center bg-no-repeat";

/** Figma Heading 2 default state: Neutral/50 (#FAFAFA), Text 2XL/Bold. */
export const HOME_SHOWCASE_HEADING_CLASS =
  "text-tooltip-text text-center text-[24px] leading-[32px] font-bold md:text-[24px] md:leading-[32px]";

/** Figma Heading 2 compact / Variant2: Neutral/50 (#FAFAFA), Text XL/Bold. */
export const HOME_SHOWCASE_HEADING_COMPACT_CLASS =
  "text-tooltip-text text-center text-[20px] leading-[28px] font-bold md:text-[20px] md:leading-[28px]";

export type HomeShowcaseVariant = "default" | "compact";

export const HOME_SHOWCASE_HEADING_CLASS_BY_VARIANT = {
  default: HOME_SHOWCASE_HEADING_CLASS,
  compact: HOME_SHOWCASE_HEADING_COMPACT_CLASS,
} as const satisfies Record<HomeShowcaseVariant, string>;

export type HomeShowcaseImage = {
  videoSrc?: string;
  id: string;
  src: string;
  alt?: string;
};

export const HOME_SHOWCASE_DEFAULT_IMAGES: HomeShowcaseImage[] = [
  {
    id: "left",
    src: HOME_SHOWCASE_DEFAULT_IMAGE_SRC,
    alt: "Showcase preview left",
  },
  {
    id: "center",
    src: HOME_SHOWCASE_DEFAULT_IMAGE_SRC,
    alt: "Showcase preview center",
  },
  {
    id: "right",
    src: HOME_SHOWCASE_DEFAULT_IMAGE_SRC,
    alt: "Showcase preview right",
  },
];
