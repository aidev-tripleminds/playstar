export type ResponsiveBannerData = {
  desktopAssetKey?: string;
  mobileAssetKey?: string;
  desktopImageSrc?: string;
  mobileImageSrc?: string;
  imageAlt?: string;
};

export const RESPONSIVE_BANNER_DESKTOP_ASSET_KEY = "banner_desktop";
export const RESPONSIVE_BANNER_MOBILE_ASSET_KEY = "banner_mobile";

export const RESPONSIVE_BANNER_WIDTH_PX = 1148;
export const RESPONSIVE_BANNER_HEIGHT_PX = 230;
export const RESPONSIVE_BANNER_MOBILE_WIDTH_PX = 390;
export const RESPONSIVE_BANNER_MOBILE_HEIGHT_PX = 195;

/** Mobile-first height; desktop (md+) uses the 1148×230 banner ratio. */
export const RESPONSIVE_BANNER_HEIGHT_CLASS = "h-[175px] md:h-[230px]";

/** 12px radius on mobile; 16px from md+ (FRONT-688). */
export const RESPONSIVE_BANNER_RADIUS_CLASS = "rounded-[12px] md:rounded-[16px]";

export const RESPONSIVE_BANNER_DEFAULT_DATA: ResponsiveBannerData = {
  desktopAssetKey: RESPONSIVE_BANNER_DESKTOP_ASSET_KEY,
  mobileAssetKey: RESPONSIVE_BANNER_MOBILE_ASSET_KEY,
  imageAlt: "Promotional banner",
};
