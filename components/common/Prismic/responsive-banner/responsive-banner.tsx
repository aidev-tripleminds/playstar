"use client";

import { getImageProps } from "next/image";

import { useAssetImage } from "@/lib/assets/asset-map-context";
import { cn } from "@/lib/utils";

import {
  RESPONSIVE_BANNER_DEFAULT_DATA,
  RESPONSIVE_BANNER_HEIGHT_CLASS,
  RESPONSIVE_BANNER_HEIGHT_PX,
  RESPONSIVE_BANNER_MOBILE_HEIGHT_PX,
  RESPONSIVE_BANNER_MOBILE_WIDTH_PX,
  RESPONSIVE_BANNER_RADIUS_CLASS,
  RESPONSIVE_BANNER_WIDTH_PX,
  type ResponsiveBannerData,
} from "./responsive-banner.constants";

export type ResponsiveBannerProps = {
  banner?: ResponsiveBannerData;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
};

export function ResponsiveBanner({
  banner = RESPONSIVE_BANNER_DEFAULT_DATA,
  className,
  fetchPriority,
}: ResponsiveBannerProps) {
  const desktopImageSrc = useAssetImage(banner.desktopAssetKey ?? "", banner.desktopImageSrc);
  const mobileImageSrc = useAssetImage(
    banner.mobileAssetKey ?? "",
    banner.mobileImageSrc || desktopImageSrc,
  );

  if (!desktopImageSrc) return null;

  const common = {
    alt: banner.imageAlt ?? "",
    sizes: "(max-width: 767px) 100vw, 1148px",
  };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    src: desktopImageSrc,
    width: RESPONSIVE_BANNER_WIDTH_PX,
    height: RESPONSIVE_BANNER_HEIGHT_PX,
  });
  const {
    props: { srcSet: mobileSrcSet, ...mobileImageProps },
  } = getImageProps({
    ...common,
    src: mobileImageSrc || desktopImageSrc,
    width: RESPONSIVE_BANNER_MOBILE_WIDTH_PX,
    height: RESPONSIVE_BANNER_MOBILE_HEIGHT_PX,
    fetchPriority,
  });

  return (
    <picture
      data-slot="responsive-banner"
      className={cn(
        "relative block w-full max-w-full min-w-0 overflow-hidden",
        RESPONSIVE_BANNER_HEIGHT_CLASS,
        RESPONSIVE_BANNER_RADIUS_CLASS,
        className,
      )}
    >
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
      <img
        {...mobileImageProps}
        alt={mobileImageProps.alt}
        className="absolute inset-0 h-full w-full object-cover"
        data-slot="responsive-banner-image"
      />
    </picture>
  );
}
