import { ROUTES } from "@/lib/routes";

export type LatestNewsItem = {
  id: string;
  title: string;
  /** One paragraph, or several rendered with 4px gaps like the Figma card. */
  body: string | readonly string[];
  imageSrc: string;
  imageAlt?: string;
  readMoreHref?: string;
  readMoreLabel?: string;
  /**
   * Session-start popup only opens for important items. Defaults to true so a
   * newly published item shows until the user dismisses it.
   */
  important?: boolean;
};

/**
 * Disabled until a real news system exists: the cards below are hardcoded
 * placeholders, so the session popup is hidden instead of shipping lorem
 * ipsum. Flip to `true` once news is authored from the backoffice.
 */
export const LATEST_NEWS_ENABLED = false;

export const LATEST_NEWS_TITLE = "Latest news";
export const LATEST_NEWS_TITLE_ICON_SRC = "/assets/spice-coin.png";
export const LATEST_NEWS_IMAGE_SRC = "/assets/latest-news-klams.png";
export const LATEST_NEWS_READ_MORE_LABEL = "Read more";
export const LATEST_NEWS_CLOSE_LABEL = "Close";

export const LATEST_NEWS_MODAL_CLASS =
  "border-surface-strong bg-dialog-bg z-71 max-w-[calc(100%-1rem)] overflow-hidden md:max-w-[390px]";

export const LATEST_NEWS_CLOSE_CLASS =
  "bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text";

/** Figma `21937:145718` — list slot is 653px; shrink on short viewports so the header stays on screen. */
export const LATEST_NEWS_LIST_CLASS =
  "custom-scrollbar flex max-h-[min(653px,calc(95dvh-8rem))] flex-col gap-4 overflow-y-auto overscroll-y-contain pr-1";

const LATEST_NEWS_PLACEHOLDER_BODY = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
] as const;

/**
 * Current latest-news cards. When a new important `id` is added, the session
 * popup opens again even if earlier cards were dismissed.
 */
export const LATEST_NEWS_ITEMS: LatestNewsItem[] = [
  {
    id: "klams-two",
    title: "Klams Two is now available!",
    body: LATEST_NEWS_PLACEHOLDER_BODY,
    imageSrc: LATEST_NEWS_IMAGE_SRC,
    imageAlt: "Klams Two",
    readMoreHref: ROUTES.explore,
  },
];

export const LATEST_NEWS_SEEN_STORAGE_KEY = "spicestars:latest-news-seen";
