import { resolveAsset } from "@/lib/assets/asset-store";
import type { InstallAppPlatform } from "@/lib/get-install-app-platform";

export type { InstallAppPlatform };

/** Admin asset-management key for the Android install-app hero image. */
export const INSTALL_APP_ANDROID_IMAGE_ASSET_KEY = "android_app_offer";

/** Admin asset-management key for the iOS install-app hero image. */
export const INSTALL_APP_IOS_IMAGE_ASSET_KEY = "ios_app_offer";

const INSTALL_APP_ANDROID_IMAGE_FALLBACK_SRC = "/assets/install-app-android.png";
const INSTALL_APP_IOS_IMAGE_FALLBACK_SRC = "/assets/install-app-ios.png";

export type InstallAppPlatformContent = {
  title: string;
  titleIconSrc: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  /** Figma source line above the tap steps (iOS only). */
  instructionSourceLabel?: string;
};

export const INSTALL_APP_PLATFORM_CONTENT: Record<InstallAppPlatform, InstallAppPlatformContent> = {
  android: {
    title: "Get our Android app",
    titleIconSrc: "/assets/google-play.svg",
    imageSrc:
      resolveAsset(INSTALL_APP_ANDROID_IMAGE_ASSET_KEY).image ??
      INSTALL_APP_ANDROID_IMAGE_FALLBACK_SRC,
    imageAlt: "Install Spicestars on Android",
    description:
      "Get the full experience on Android. Enjoy push notifications, fullscreen mode, faster performance, and more.",
  },
  ios: {
    title: "Get our iOS app",
    titleIconSrc: "/assets/apple.svg",
    imageSrc:
      resolveAsset(INSTALL_APP_IOS_IMAGE_ASSET_KEY).image ?? INSTALL_APP_IOS_IMAGE_FALLBACK_SRC,
    imageAlt: "Install Spicestars on iOS",
    description:
      "Get the full experience on iOS. Enjoy push notifications, fullscreen mode, faster performance, and more.",
    instructionSourceLabel: "From Safari Browser App:",
  },
};

export const INSTALL_APP_CTA_LABEL = "Okay";
