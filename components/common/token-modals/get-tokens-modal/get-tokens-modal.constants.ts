/** Figma Get Tokens modal (node 1117-15138). */
export const GET_TOKENS_MODAL_TITLE = "Get Tokens";
export const GET_TOKENS_MODAL_ICON = "/assets/spice-coin.png";
export const GET_TOKENS_MODAL_FOOTER_TEXT = "Tokens never expire";
export const GET_TOKENS_MODAL_FOOTER_ICON = "/assets/icons/moneybag.svg";
export const GET_TOKENS_MODAL_UPGRADE_LABEL = "Upgrade to Yearly";

/** Mobile header inset — dialog content uses px-0 so carousel can bleed edge-to-edge. */
export const GET_TOKENS_MODAL_HEADER_CLASS = "max-md:px-4";

/** Mobile: bottom sheet, full width. Desktop: Figma frame 846×508 — no inner scroll. */
export const GET_TOKENS_MODAL_CONTENT_CLASS =
  "border-surface-strong bg-dialog-bg scrollbar-hidden w-full max-w-[calc(100%-1rem)] px-0 gap-2 overflow-x-clip overflow-y-hidden rounded-[28px] pb-4  md:w-[846px]! md:max-h-[708px]! md:max-w-[846px]! md:rounded-[48px]! md:p-[30px]! lg:rounded-[48px] z-71";

export const GET_TOKENS_MODAL_INNER_CLASS = "gradient-bg-main relative flex flex-col gap-2  ";

/** Mobile carousel bleed — one card + next card peek; clip without enabling vertical scroll. */
export const GET_TOKENS_MODAL_CAROUSEL_CLASS =
  "w-full max-md:-mx-4 max-md:w-[calc(100%+2rem)] max-md:overflow-x-clip";

export const GET_TOKENS_MODAL_BANNER_CLASS = "flex w-full justify-center";

export const GET_TOKENS_MODAL_DIVIDER_CLASS = "m-auto w-full min-w-0 md:w-[282px]";

export const GET_TOKENS_MODAL_UPGRADE_BUTTON_CLASS = "m-auto w-full  md:w-[201px] w-[201px]";
