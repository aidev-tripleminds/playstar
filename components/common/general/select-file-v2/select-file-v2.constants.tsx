import { dummyImage } from "@/lib/dummy-images";
import { CoatHangerIcon, ProfileIcon, SofaIcon, VideoHorizontal } from "@/public/assets/icons";

export const SELECT_FILE_V2_DEFAULT_TITLE = "Select Lorem Ipsum";
export const SELECT_FILE_V2_SEARCH_PLACEHOLDER = "Search...";
export const SELECT_FILE_V2_EMPTY_LABEL = "No files found";
export const SELECT_FILE_V2_NEW_LABEL = "New";
export const SELECT_FILE_V2_CARD_NAME = "Lorem Ipsum";
export const SELECT_FILE_V2_IMAGE_SRC = dummyImage(119);

/** Desktop dialog: 32px inset on each side, capped at 1600px. Height stays 800px. */
export const SELECT_FILE_V2_DIALOG_CLASS =
  "flex h-[min(800px,calc(100vh-2rem))] max-h-[min(800px,calc(100vh-2rem))] w-[calc(100%-64px)] max-w-[1600px] flex-col overflow-hidden p-6 sm:max-w-[1600px] md:max-w-[1600px] md:p-6";

/**
 * Figma `24001:115200` — 390×740 sheet. Padding 8px 16px 16px, 16px between sections.
 * Wider phones and tablets keep that 16px inset and grow with the viewport.
 * Mobile DialogContent uses `h-fit!` so Android sheets can grow past Vaul's
 * inline height. iOS Safari then sizes fit-content from the header only —
 * nested `flex-1 min-h-0` children collapse to 0.
 * A definite drawer height keeps the picker usable, and the 16px inset keeps
 * the sheet off the screen edges and the browser toolbar.
 */
export const SELECT_FILE_V2_MOBILE_DIALOG_CLASS = [
  "mb-0! flex w-[calc(100%-2rem)] max-w-none flex-col gap-4 overflow-hidden px-4! pt-2! pb-4!",
  "h-[min(724px,calc(100dvh-2rem))] max-h-[min(724px,calc(100dvh-2rem))]",
  "sm:max-w-none",
  "data-[vaul-drawer-direction=bottom]:inset-x-4! data-[vaul-drawer-direction=bottom]:bottom-4!",
  "data-[vaul-drawer-direction=bottom]:h-[min(724px,calc(100dvh-2rem))]!",
  "data-[vaul-drawer-direction=bottom]:max-h-[min(724px,calc(100dvh-2rem))]!",
  "data-[vaul-drawer-direction=bottom]:min-h-[min(724px,calc(100dvh-2rem))]!",
].join(" ");

/** Figma category column. */
export const SELECT_FILE_V2_CATEGORY_COLUMN_CLASS = "w-[175px]";

/** File cards are 4:5 on mobile and desktop. */
export const SELECT_FILE_V2_CARD_RATIO_CLASS = "aspect-[4/5]";

/** Desktop card radius is 16px. Mobile stays 12px. */
export const SELECT_FILE_V2_DESKTOP_CARD_RADIUS_CLASS = "rounded-[16px]";
export const SELECT_FILE_V2_MOBILE_CARD_RADIUS_CLASS = "rounded-[12px]";

/** Desktop card name is 16px on a 24px line. */
export const SELECT_FILE_V2_DESKTOP_CARD_NAME_CLASS = "text-base leading-6";

export const SELECT_FILE_V2_CARD_ASPECT_CLASS = `${SELECT_FILE_V2_CARD_RATIO_CLASS} ${SELECT_FILE_V2_DESKTOP_CARD_RADIUS_CLASS}`;

/**
 * Desktop cards gain a column when the dialog grows wide enough for another
 * one. 200px is the floor, so a 1600px dialog fits six across.
 */
export const SELECT_FILE_V2_DESKTOP_GRID_CLASS = "grid-cols-[repeat(auto-fill,minmax(200px,1fr))]";

export const SELECT_FILE_V2_MOBILE_CARD_CLASS = `${SELECT_FILE_V2_CARD_RATIO_CLASS} ${SELECT_FILE_V2_MOBILE_CARD_RADIUS_CLASS}`;

/** Empty action slots under the grid. Figma footer holds four 35×44 add cards. */
export const SELECT_FILE_V2_SLOT_COUNT = 4;
export const SELECT_FILE_V2_SAVE_LABEL = "Save";

/**
 * Footer slot for a clicked card.
 * Character → 1 of 4, Action → 2 of 4, Location → 3 of 4, Clothing → 4 of 4.
 * Actions stack in that slot. The timeline above lists each clip.
 */
export const SELECT_FILE_V2_SLOT_INDEX = {
  characters: 0,
  actions: 1,
  clothings: 2,
  location: 3,
} as const;

/** Timeline holds at most ten action clips. */
export const SELECT_FILE_V2_MAX_ACTIONS = 10;
export const SELECT_FILE_V2_TIMELINE_LABEL = "Timeline";

/** Figma `24121:59453` — iOS scissors emoji beside the timeline label. */
export const SELECT_FILE_V2_TIMELINE_EMOJI_SRC = "/assets/emoji/scissors.png";

/** Left and right arrows appear once the timeline has this many clips. */
export const SELECT_FILE_V2_TIMELINE_ARROW_MIN = 7;

/** Figma connector between timeline scenes — 12×2, centered on the 146px card. */
export const SELECT_FILE_V2_TIMELINE_CONNECTOR_WIDTH_PX = 12;
export const SELECT_FILE_V2_TIMELINE_CONNECTOR_HEIGHT_PX = 2;

/** Connector into “Add more actions”. Figma gray `#525252` → pink `#F6339A`. */
export const SELECT_FILE_V2_TIMELINE_CONNECTOR_ADD_CLASS =
  "bg-[linear-gradient(90deg,#525252_0%,#f6339a_100%)]";

const SLOT_ICON_CLASS = "size-4 shrink-0";

export const SELECT_FILE_V2_SLOT_ICONS = {
  characters: <ProfileIcon className={SLOT_ICON_CLASS} />,
  actions: <VideoHorizontal className={SLOT_ICON_CLASS} />,
  clothings: <CoatHangerIcon className={SLOT_ICON_CLASS} />,
  location: <SofaIcon className={SLOT_ICON_CLASS} />,
} as const;

export const SELECT_FILE_V2_SLOT_LABELS = {
  characters: "Selected character",
  actions: "Selected action",
  clothings: "Selected clothing",
  location: "Selected location",
} as const;

/** Figma name scrim — transparent to black at 85%, 100px tall. */
export const SELECT_FILE_V2_CARD_SCRIM =
  "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.85) 100%)";

/** Figma Border/Light Inner — 1px gradient stroke. */
export const SELECT_FILE_V2_CARD_BORDER_STYLE = {
  padding: 1,
  background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 100%)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
} as const;

const CATEGORY_ICON_CLASS = "size-5 shrink-0";

export const SELECT_FILE_V2_CATEGORIES = [
  {
    id: "characters",
    label: "Character",
    icon: <ProfileIcon className={CATEGORY_ICON_CLASS} />,
  },
  {
    id: "actions",
    label: "Action",
    icon: <VideoHorizontal className={CATEGORY_ICON_CLASS} />,
  },
  {
    id: "clothings",
    label: "Clothing",
    icon: <CoatHangerIcon className={CATEGORY_ICON_CLASS} />,
  },
  {
    id: "location",
    label: "Location",
    icon: <SofaIcon className={CATEGORY_ICON_CLASS} />,
  },
] as const;

export type SelectFileCategory = (typeof SELECT_FILE_V2_CATEGORIES)[number]["id"];

export const SELECT_FILE_V2_DEFAULT_CATEGORY: SelectFileCategory = "actions";

export const SELECT_FILE_V2_FILTER_TABS = [
  "All",
  "MILF",
  "Teen (18+)",
  "Blonde",
  "Big Ass",
  "Athletic",
  "Small Tits",
  "Teen (18+)",
  "Blonde",
  "Big Ass",
  "Athletic",
  "Feet",
  "Small Tits",
  "Latina",
  "Big ass",
] as const;

export const SELECT_FILE_V2_DEFAULT_FILTER = "All";

export const SELECT_FILE_V2_SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
] as const;

export type SelectFileSortValue = (typeof SELECT_FILE_V2_SORT_OPTIONS)[number]["value"];

export const SELECT_FILE_V2_DEFAULT_SORT_VALUE: SelectFileSortValue = "newest";

export type SelectFileItem = {
  id: string;
  name: string;
  /** The card's still. A video's still is its poster. */
  imageSrc?: string;
  /**
   * Muted preview, played only while the card is hovered (desktop) or was the
   * last one tapped (mobile). Without an `imageSrc` its first frame is the still.
   */
  videoSrc?: string;
  /** Shows the "New" badge on the card. */
  isNew?: boolean;
  /** Catalog tabs. Omitted for a flat image list such as Edit Image. */
  category?: SelectFileCategory;
  tags: readonly string[];
  /**
   * Newest/oldest order. ISO timestamps sort as text. When omitted, the
   * catalog falls back to id order.
   */
  sortKey?: string;
};

const CATEGORY_TAGS: Record<SelectFileCategory, readonly string[]> = {
  characters: ["MILF", "Blonde", "Latina", "Athletic"],
  actions: [
    "MILF",
    "MILF",
    "Teen (18+)",
    "Blonde",
    "Big Ass",
    "Athletic",
    "Small Tits",
    "Feet",
    "Latina",
    "MILF",
    "Blonde",
    "Big Ass",
  ],
  location: ["Blonde", "Athletic"],
  clothings: ["Small Tits", "Latina", "Feet"],
};

const CATEGORY_COUNTS: Record<SelectFileCategory, number> = {
  characters: 8,
  actions: 12,
  location: 4,
  clothings: 6,
};

function buildCategoryItems(category: SelectFileCategory): SelectFileItem[] {
  const tags = CATEGORY_TAGS[category];
  const count = CATEGORY_COUNTS[category];

  return Array.from({ length: count }, (_, index) => ({
    id: `${category}-${index + 1}`,
    name: SELECT_FILE_V2_CARD_NAME,
    imageSrc: SELECT_FILE_V2_IMAGE_SRC,
    category,
    tags: [tags[index % tags.length]],
  }));
}

export const SELECT_FILE_V2_DEFAULT_ITEMS: SelectFileItem[] = (
  Object.keys(CATEGORY_COUNTS) as SelectFileCategory[]
).flatMap(buildCategoryItems);
