export const RATIO_ICON_RATIOS = ["16:9", "9:16", "1:1", "4:3", "3:4", "4:5", "5:4"] as const;

export type RatioIconRatio = (typeof RATIO_ICON_RATIOS)[number];

export const RATIO_ICON_DIMENSIONS: Record<
  RatioIconRatio,
  { width: number; height: number; radius: number }
> = {
  "16:9": { width: 18, height: 11, radius: 3 },
  "9:16": { width: 11, height: 18, radius: 3 },
  "1:1": { width: 14, height: 14, radius: 2 },
  "4:3": { width: 16, height: 12, radius: 3 },
  "3:4": { width: 12, height: 16, radius: 3 },
  "4:5": { width: 13, height: 16, radius: 3 },
  "5:4": { width: 16, height: 13, radius: 3 },
};

export const RATIO_ICON_VIEWBOX_SIZE = 20;
