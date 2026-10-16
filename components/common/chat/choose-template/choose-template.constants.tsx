import {
  AI_MODEL_DEFAULT_DESCRIPTION,
  AI_MODEL_DEFAULT_IMAGE_SRC,
  AI_MODEL_DEFAULT_NAME,
  AI_MODEL_DEFAULT_STATS,
  AI_MODEL_MEDIA_DEFAULT_NAME,
  AI_MODEL_TEMPLATES_DEFAULT_BADGE,
  type AiModelStat,
  type AiModelVariant,
} from "@/components/common/Prismic/ai-model";
import { resolveAsset } from "@/lib/assets/asset-store";
import { GalleryIcon, ProfileIcon, VideoSquareIcon } from "@/public/assets/icons";

import { AI_MODEL_TEMPLATES_INSET_IMAGE_SRC } from "../../Prismic/ai-model/ai-model.constants";

export const CHOOSE_TEMPLATE_DEFAULT_TITLE = "Select a template";
export const CHOOSE_TEMPLATE_DEFAULT_SEARCH_PLACEHOLDER = "Search...";
export const CHOOSE_TEMPLATE_DEFAULT_CANCEL_LABEL = "Cancel";
export const CHOOSE_TEMPLATE_DEFAULT_SELECT_LABEL = "Select";
export const CHOOSE_TEMPLATE_TITLE_ICON_SRC = "/assets/folder.svg";

/**
 * Mobile DialogContent uses `h-fit!` so Android sheets can grow past Vaul's
 * inline height. iOS Safari then sizes fit-content from the header only —
 * nested `flex-1 min-h-0 overflow-hidden` children collapse to 0.
 * A definite drawer height keeps the picker usable on both platforms.
 */
export const CHOOSE_TEMPLATE_MOBILE_DRAWER_SIZE_CLASS =
  "data-[vaul-drawer-direction=bottom]:h-[min(960px,calc(100dvh-1rem))]! data-[vaul-drawer-direction=bottom]:max-h-[min(960px,calc(100dvh-1rem))]! data-[vaul-drawer-direction=bottom]:min-h-[min(960px,calc(100dvh-1rem))]";

const TYPE_TAB_ICON_CLASS = "size-5 shrink-0";

export const CHOOSE_TEMPLATE_TYPE_TABS = [
  {
    label: "Characters",
    leftIconSrc: <ProfileIcon className={TYPE_TAB_ICON_CLASS} />,
  },
  {
    label: "Images",
    leftIconSrc: <GalleryIcon className={TYPE_TAB_ICON_CLASS} />,
  },
  {
    label: "Video",
    leftIconSrc: <VideoSquareIcon className={TYPE_TAB_ICON_CLASS} />,
  },
] as const;

export const CHOOSE_TEMPLATE_FILTER_TABS = [
  "All",
  "MILF",
  "Teen (18+)",
  "Blonde",
  "Big Ass",
  "Athletic",
  "Small Tits",
  "Feet",
  "Latina",
  "MILF",
  "Teen (18+)",
  "Blonde",
  "Big Ass",
  "Athletic",
  "Small Tits",
  "Feet",
  "Latina",
  "Latina",
  "MILF",
  "Teen (18+)",
  "Blonde",
  "Big Ass",
  "Athletic",
  "Small Tits",
  "Feet",
  "Latina",
] as const;

export const CHOOSE_TEMPLATE_DEFAULT_SORT_VALUE = "newest";

export const CHOOSE_TEMPLATE_SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
] as const;

export type ChooseTemplateSortValue = (typeof CHOOSE_TEMPLATE_SORT_OPTIONS)[number]["value"];

export const CHOOSE_TEMPLATE_TYPE_VARIANTS = [
  "characters",
  "images",
  "videos",
] as const satisfies readonly AiModelVariant[];

export type ChooseTemplateTypeVariant = (typeof CHOOSE_TEMPLATE_TYPE_VARIANTS)[number];

export type ChooseTemplateItem = {
  id: string;
  variant?: AiModelVariant;
  name?: string;
  description?: string;
  /** Logical asset key, re-resolved live via `useAsset` on the card. */
  assetKey?: string;
  imageSrc?: string;
  videoSrc?: string;
  imageAlt?: string;
  /** The API's `blurred`: its URLs are already safe; overlays the unblur CTA. */
  blurred?: boolean;
  stats?: AiModelStat[];
  badgeLabel?: string;
  insetImageSrc?: string;
  filterTag?: string;
};

export const CHOOSE_TEMPLATE_DEFAULT_ITEMS: ChooseTemplateItem[] = [
  {
    id: "template-1",
    variant: "characters",
    name: AI_MODEL_DEFAULT_NAME,
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: AI_MODEL_DEFAULT_IMAGE_SRC,
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-2",
    variant: "characters",
    name: "Lorem Ipsum 18",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_model3").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-3",
    variant: "characters",
    name: "Lorem Ipsum 19",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_model4").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-4",
    variant: "characters",
    name: "Lorem Ipsum 20",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_model7").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-5",
    variant: "characters",
    name: "Lorem Ipsum 21",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_katarina").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-6",
    variant: "characters",
    name: "Lorem Ipsum 23",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_nangi").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-7",
    variant: "images",
    name: AI_MODEL_MEDIA_DEFAULT_NAME,
    imageSrc: resolveAsset("demo_pics_pexel2").image ?? "",
  },
  {
    id: "template-8",
    variant: "videos",
    name: AI_MODEL_MEDIA_DEFAULT_NAME,
    imageSrc: resolveAsset("demo_pics_cover_image").image ?? "",
    videoSrc: resolveAsset("female_anime_ethnicity_caucasian").video ?? "",
  },
  {
    id: "template-9",
    variant: "templates",
    name: AI_MODEL_MEDIA_DEFAULT_NAME,
    imageSrc: "/assets/pics/image.png",
    badgeLabel: AI_MODEL_TEMPLATES_DEFAULT_BADGE,
    insetImageSrc: AI_MODEL_TEMPLATES_INSET_IMAGE_SRC,
  },
  {
    id: "template-10",
    variant: "characters",
    name: "Lorem Ipsum 24",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_dummy").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-11",
    variant: "characters",
    name: AI_MODEL_DEFAULT_NAME,
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: AI_MODEL_DEFAULT_IMAGE_SRC,
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-12",
    variant: "characters",
    name: "Lorem Ipsum 18",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_model3").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-13",
    variant: "characters",
    name: "Lorem Ipsum 19",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_model4").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-14",
    variant: "characters",
    name: "Lorem Ipsum 20",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_model7").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-15",
    variant: "characters",
    name: "Lorem Ipsum 21",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_katarina").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-16",
    variant: "characters",
    name: "Lorem Ipsum 23",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_nangi").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-17",
    variant: "images",
    name: AI_MODEL_MEDIA_DEFAULT_NAME,
    imageSrc: resolveAsset("demo_pics_dummy").image ?? "",
  },
  {
    id: "template-18",
    variant: "videos",
    name: "Romania",
    imageSrc: resolveAsset("demo_pics_cover_image").image ?? "",
    videoSrc: resolveAsset("female_realistic_ethnicity_black").video ?? "",
  },
  {
    id: "template-19",
    variant: "templates",
    name: AI_MODEL_MEDIA_DEFAULT_NAME,
    imageSrc: "/assets/pics/image.png",
    badgeLabel: AI_MODEL_TEMPLATES_DEFAULT_BADGE,
    insetImageSrc: AI_MODEL_TEMPLATES_INSET_IMAGE_SRC,
  },
  {
    id: "template-20",
    variant: "characters",
    name: "Lorem Ipsum 24",
    description: AI_MODEL_DEFAULT_DESCRIPTION,
    imageSrc: resolveAsset("demo_pics_dummy").image ?? "",
    stats: AI_MODEL_DEFAULT_STATS,
  },
  {
    id: "template-21",
    variant: "images",
    name: AI_MODEL_MEDIA_DEFAULT_NAME,
    imageSrc: resolveAsset("demo_pics_nangi").image ?? "",
  },
  {
    id: "template-22",
    variant: "images",
    name: AI_MODEL_MEDIA_DEFAULT_NAME,
    imageSrc: resolveAsset("demo_pics_katarina").image ?? "",
  },
  {
    id: "template-23",
    variant: "images",
    name: AI_MODEL_MEDIA_DEFAULT_NAME,
    imageSrc: resolveAsset("demo_pics_model4").image ?? "",
  },
  {
    id: "template-24",
    variant: "images",
    name: AI_MODEL_MEDIA_DEFAULT_NAME,
    imageSrc: resolveAsset("demo_pics_model7").image ?? "",
  },
  {
    id: "template-25",
    variant: "images",
    name: AI_MODEL_MEDIA_DEFAULT_NAME,
    imageSrc: resolveAsset("demo_pics_model3").image ?? "",
  },
  {
    id: "template-26",
    variant: "videos",
    name: "Susaun 1",
    imageSrc: resolveAsset("demo_pics_cover_image").image ?? "",
    videoSrc: resolveAsset("trans_anime_ethnicity_arab").video ?? "",
  },
  {
    id: "template-27",
    variant: "videos",
    name: "Lomas Su",
    imageSrc: resolveAsset("demo_pics_cover_image").image ?? "",
    videoSrc: resolveAsset("female_anime_ethnicity_indian").video ?? "",
  },
  {
    id: "template-28",
    variant: "videos",
    name: "Sonaje",
    imageSrc: resolveAsset("demo_pics_cover_image").image ?? "",
    videoSrc: resolveAsset("female_anime_ethnicity_elf").video ?? "",
  },
  {
    id: "template-29",
    variant: "videos",
    name: "Ramnado",
    imageSrc: resolveAsset("demo_pics_cover_image").image ?? "",
    videoSrc: resolveAsset("trans_realistic_ethnicity_arab").video ?? "",
  },
  {
    id: "template-30",
    variant: "videos",
    name: "Olaaro",
    imageSrc: resolveAsset("demo_pics_cover_image").image ?? "",
    videoSrc: resolveAsset("trans_realistic_ethnicity_elf").video ?? "",
  },
  {
    id: "template-31",
    variant: "videos",
    name: "Sonika",
    imageSrc: resolveAsset("demo_pics_cover_image").image ?? "",
    videoSrc: resolveAsset("trans_anime_ethnicity_elf").video ?? "",
  },
  {
    id: "template-32",
    variant: "videos",
    name: "Monekaa",
    imageSrc: resolveAsset("demo_pics_cover_image").image ?? "",
    videoSrc: resolveAsset("trans_anime_ethnicity_caucasian").video ?? "",
  },
  {
    id: "template-33",
    variant: "videos",
    name: "Lilley",
    imageSrc: resolveAsset("demo_pics_cover_image").image ?? "",
    videoSrc: resolveAsset("trans_anime_ethnicity_indian").video ?? "",
  },
];
