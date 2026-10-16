export const SCENE_VARIANTS = ["default", "add"] as const;

export type SceneVariant = (typeof SCENE_VARIANTS)[number];

export const SCENE_DEFAULT_VARIANT: SceneVariant = "default";
export const SCENE_DEFAULT_NAME = "Cowgirl POV";
export const SCENE_ADD_LABEL = "Add more actions";
export const SCENE_DEFAULT_IMAGE_SRC = "/assets/action-cards/preview.webp";

/** Figma Scene — 92×146, radius 16. */
export const SCENE_WIDTH_PX = 92;
export const SCENE_HEIGHT_PX = 146;

/** Thumbnail inside the default scene, including its 1px light border. */
export const SCENE_THUMB_WIDTH_PX = 82;
export const SCENE_THUMB_HEIGHT_PX = 96;
