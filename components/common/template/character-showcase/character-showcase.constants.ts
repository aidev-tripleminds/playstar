import { CHARACTER_SLIDER_DEFAULT_SLIDES } from "@/components/common/template/character-slider/character-slider.constants";
import {
  CREATOR_DEFAULT_FOLLOWERS,
  CREATOR_DEFAULT_INTERACTIONS,
  CREATOR_DEFAULT_NAME,
} from "@/components/common/template/creator/creator.constants";

/** Figma Character Showcase (node 16476-44209). File: luktNB0x647cWFHtKPAh7O */
export const CHARACTER_SHOWCASE_FIGMA_FILE_KEY = "luktNB0x647cWFHtKPAh7O";
export const CHARACTER_SHOWCASE_FIGMA_NODE_ID = "16476-44209";
/** Status=Profile Picture */
export const CHARACTER_SHOWCASE_FIGMA_DESKTOP_PROFILE_NODE_ID = "20239-66271";
export const CHARACTER_SHOWCASE_FIGMA_MOBILE_PROFILE_NODE_ID = "20239-66290";
/** Status=Default (slider) */
export const CHARACTER_SHOWCASE_FIGMA_DESKTOP_DEFAULT_NODE_ID = "16476-44210";
export const CHARACTER_SHOWCASE_FIGMA_MOBILE_DEFAULT_NODE_ID = "16476-44220";

export const CHARACTER_SHOWCASE_MODAL_MOBILE_WIDTH_PX = 390;
export const CHARACTER_SHOWCASE_MODAL_DESKTOP_WIDTH_PX = 430;
export const CHARACTER_SHOWCASE_MOBILE_OUTER_PADDING_PX = 8;
export const CHARACTER_SHOWCASE_MOBILE_INNER_TOP_PADDING_PX = 16;
export const CHARACTER_SHOWCASE_MOBILE_INNER_GAP_PX = 16;
export const CHARACTER_SHOWCASE_DESKTOP_BREAKPOINT_PX = 768;
export const CHARACTER_SHOWCASE_TABLET_SIDE_PEEK_PX = 80;

/** Figma Status: Default = slider, Profile Picture = single image */
export const CHARACTER_SHOWCASE_STATUSES = ["default", "profile-picture"] as const;
export type CharacterShowcaseStatus = (typeof CHARACTER_SHOWCASE_STATUSES)[number];
export const CHARACTER_SHOWCASE_DEFAULT_STATUS: CharacterShowcaseStatus = "profile-picture";

/** Mobile (<640px): transparent shell inset 8px from viewport; sm+: centered 430px modal. */
export const CHARACTER_SHOWCASE_MODAL_SHELL_CLASSNAME = "overflow-x-hidden scrollbar-hidden ";
/** Figma Inner — card surface below sm; sm+ uses the desktop modal contents layout. */
export const CHARACTER_SHOWCASE_MODAL_INNER_CLASSNAME =
  "max-sm:flex max-sm:w-full max-sm:min-w-0 max-sm:flex-col max-sm:gap-4 " +
  "max-sm:rounded-[28px] max-sm:border max-sm:border-surface-strong max-sm:bg-dialog-bg " +
  "max-sm:px-4 max-sm:pt-4 max-sm:pb-4 max-sm:overflow-x-hidden sm:contents";
export const CHARACTER_SHOWCASE_MOBILE_BUTTON_WIDTH_PX = 167;
export const CHARACTER_SHOWCASE_MOBILE_LOCKED_CTA_WIDTH_PX = 155;
export const CHARACTER_SHOWCASE_MOBILE_ACTION_BUTTON_CLASSNAME =
  `max-sm:min-w-0 max-sm:flex-1 max-sm:max-w-[${CHARACTER_SHOWCASE_MOBILE_BUTTON_WIDTH_PX}px] ` +
  "sm:min-w-0 sm:w-auto sm:flex-1 sm:shrink";

/** Figma AI Character inner — 270×330 on desktop and mobile (Profile Picture). */
export const CHARACTER_SHOWCASE_IMAGE_WIDTH_PX = 270;
export const CHARACTER_SHOWCASE_IMAGE_HEIGHT_PX = 330;
export const CHARACTER_SHOWCASE_IMAGE_DESKTOP_RADIUS_PX = 32;
export const CHARACTER_SHOWCASE_IMAGE_MOBILE_RADIUS_PX = 24;
export const CHARACTER_SHOWCASE_IMAGE_CLASSNAME = "character-showcase-image";

export const CHARACTER_SHOWCASE_SLIDER_CENTER_WIDTH_PX = 270;
export const CHARACTER_SHOWCASE_MOBILE_SLIDER_CENTER_WIDTH_PX = 270;
export const CHARACTER_SHOWCASE_MOBILE_SLIDER_HEIGHT_PX = 330;
export const CHARACTER_SHOWCASE_MOBILE_SLIDER_TRACK_WIDTH_PX = 342;
export const CHARACTER_SHOWCASE_MOBILE_SIDE_PREVIEW_HEIGHT_PX = 193;
export const CHARACTER_SHOWCASE_MOBILE_SIDE_PREVIEW_WIDTH_PX = 153;
export const CHARACTER_SHOWCASE_COMPACT_MOBILE_MIN_WIDTH_PX = 320;
export const CHARACTER_SHOWCASE_COMPACT_MOBILE_MAX_WIDTH_PX = 480;
export const CHARACTER_SHOWCASE_COMPACT_MOBILE_SLIDER_WIDTH_PX = 160;
export const CHARACTER_SHOWCASE_COMPACT_MOBILE_SLIDER_HEIGHT_PX = 200;
export const CHARACTER_SHOWCASE_COMPACT_MOBILE_SLIDER_TRACK_WIDTH_PX = 203;
export const CHARACTER_SHOWCASE_COMPACT_MOBILE_SIDE_PREVIEW_WIDTH_PX = 103;
export const CHARACTER_SHOWCASE_COMPACT_MOBILE_SIDE_PREVIEW_HEIGHT_PX = 126;
export const CHARACTER_SHOWCASE_COMPACT_MOBILE_SIDE_PREVIEW_RADIUS_PX = 24;

/** Showcase-only slider wrapper; layout rules live in character-showcase-slider.css */
export const CHARACTER_SHOWCASE_SLIDER_CLASSNAME = "character-showcase-slider";
export const CHARACTER_SHOWCASE_DEFAULT_TITLE = "Marina Petranova";
export const CHARACTER_SHOWCASE_TITLE_ICON_SRC = "/assets/character.svg";
export const CHARACTER_SHOWCASE_DEFAULT_MESSAGES = "34.5K";
export const CHARACTER_SHOWCASE_DEFAULT_DISCUSSIONS = "4.8K";
export const CHARACTER_SHOWCASE_MESSAGES_LABEL = "Messages";
export const CHARACTER_SHOWCASE_DISCUSSIONS_LABEL = "Discussions";
export const CHARACTER_SHOWCASE_DEFAULT_CHAT_LABEL = "Chat";
export const CHARACTER_SHOWCASE_DEFAULT_GENERATE_LABEL = "Generate";
export const CHARACTER_SHOWCASE_DEFAULT_SETTINGS_LABEL = "Settings";
export const CHARACTER_SHOWCASE_DEFAULT_DELETE_LABEL = "Delete";
export const CHARACTER_SHOWCASE_CHAT_ICON_SRC = "/assets/ai-chat-black.svg";
export const CHARACTER_SHOWCASE_GENERATE_ICON_SRC = "/assets/icons/magic-pen.svg";
export const CHARACTER_SHOWCASE_SETTINGS_ICON_SRC = "/assets/settings-outline.svg";
export const CHARACTER_SHOWCASE_DELETE_ICON_SRC = "/assets/trash.svg";
export const CHARACTER_SHOWCASE_DEFAULT_DESCRIPTION =
  "Marina Petranova is a data scientist specializing in machine learning and AI-driven solutions for environmental conservation. She holds a Ph.D. from the University of Aelia...";
export const CHARACTER_SHOWCASE_DEFAULT_IMAGE_SRC =
  "/assets/character-showcase/character-profile.png";
export const CHARACTER_SHOWCASE_DEFAULT_IMAGE_ALT = "Marina Petranova";

export const CHARACTER_SHOWCASE_DEFAULT_CREATOR_NAME = CREATOR_DEFAULT_NAME;
export const CHARACTER_SHOWCASE_DEFAULT_CREATOR_INTERACTIONS = CREATOR_DEFAULT_INTERACTIONS;
export const CHARACTER_SHOWCASE_DEFAULT_CREATOR_FOLLOWERS = CREATOR_DEFAULT_FOLLOWERS;
export const CHARACTER_SHOWCASE_DEFAULT_SLIDES = CHARACTER_SLIDER_DEFAULT_SLIDES;
