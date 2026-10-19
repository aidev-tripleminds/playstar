import { dummyImage } from "@/lib/dummy-images";
/** Figma Creator bar (node 16974-72606). */
export type CreatorSize = "desktop" | "mobile";

export const CREATOR_SIZES = ["desktop", "mobile"] as const satisfies readonly CreatorSize[];

export const CREATOR_DEFAULT_NAME = "Joan Doe";
export const CREATOR_DEFAULT_INTERACTIONS = "7.4m interactions";
export const CREATOR_DEFAULT_FOLLOWERS = "450 followers";
export const CREATOR_DEFAULT_IMAGE_SRC = dummyImage(175);
export const CREATOR_DEFAULT_FOLLOW_LABEL = "Follow";
export const CREATOR_DEFAULT_FOLLOWING_LABEL = "Following";

export const CREATOR_BG_CLASS = "[background:var(--gradient-creator-bg)]";
export const CREATOR_BORDER_RADIUS_CLASS = "rounded-[12px]";
export const CREATOR_AVATAR_BORDER_WIDTH_PX = 2;
export const CREATOR_AVATAR_OUTER_RADIUS_PX = 12;
export const CREATOR_AVATAR_INNER_CLASS = "relative overflow-hidden rounded-[10px]";

export const CREATOR_ROOT_CLASS_BY_SIZE: Record<CreatorSize, string> = {
  desktop: "w-full min-w-0 max-w-[400px] gap-2 p-2",
  mobile: "w-[332px] max-w-full shrink-0 gap-2 p-2",
};

export const CREATOR_AVATAR_FRAME_CLASS_BY_SIZE: Record<CreatorSize, string> = {
  desktop: "size-11 shrink-0 rounded-[12px] p-[2px] [background:var(--Button-Token-gradient)]",
  mobile: "size-11 shrink-0 rounded-[12px] p-[2px] [background:var(--Button-Token-gradient)]",
};

export const CREATOR_AVATAR_SIZE_PX: Record<CreatorSize, number> = {
  desktop: 44,
  mobile: 44,
};

export const CREATOR_NAME_CLASS_BY_SIZE: Record<CreatorSize, string> = {
  desktop: "text-tooltip-text truncate text-sm leading-4 font-medium",
  mobile: "text-tooltip-text truncate text-sm leading-4 font-medium",
};

export const CREATOR_STATS_CLASS =
  "text-[color:var(--select-muted-text)] truncate text-xs leading-3 font-medium";

export const CREATOR_CONTENT_CLASS_BY_SIZE: Record<CreatorSize, string> = {
  desktop: "flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden",
  mobile: "flex min-w-0 flex-1 flex-col gap-0.5",
};

export const CREATOR_FOLLOW_BUTTON_SIZE_BY_SIZE: Record<CreatorSize, "btn-s"> = {
  desktop: "btn-s",
  mobile: "btn-s",
};

export const CREATOR_FOLLOW_BUTTON_CLASS_BY_SIZE: Record<CreatorSize, string> = {
  desktop: "shrink-0 self-center",
  mobile: "h-[36px]! w-[68px]! shrink-0 self-center text-sm!",
};
