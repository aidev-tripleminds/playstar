"use client";

import Image from "next/image";
import * as React from "react";

import { useAsset } from "@/lib/assets/asset-map-context";
import { dummyImage } from "@/lib/dummy-images";
import { assetCardSources } from "@/lib/media-card-sources";
import { cn } from "@/lib/utils";
import TickIcon from "@/public/assets/icons/tick-icon";

export type IntroOnlySelectorStatus = "selected" | "unselected";

export type IntroOnlySelectorProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> & {
  status?: IntroOnlySelectorStatus;
  defaultStatus?: IntroOnlySelectorStatus;
  label?: string;
  /**
   * Logical asset key. When set, the card re-resolves image/video/description
   * from the live asset map (`useAsset`) so admin/live-map edits render, falling
   * back to the baked `imageSrc`/`videoSrc`/`description` props for first paint,
   * SSR, offline, and stories.
   */
  assetKey?: string;
  imageSrc?: string;
  videoSrc?: string;
  description?: string;
  autoPlayAlways?: boolean;
  onStatusChange?: (nextStatus: IntroOnlySelectorStatus) => void;
};

export function IntroOnlySelector({
  status,
  defaultStatus = "unselected",
  label = "Lorem",
  assetKey,
  imageSrc = dummyImage(110),
  videoSrc = "",
  description = "",
  autoPlayAlways = true,
  className,
  onClick,
  onStatusChange,
  ...props
}: IntroOnlySelectorProps) {
  const [internalStatus, setInternalStatus] =
    React.useState<IntroOnlySelectorStatus>(defaultStatus);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const isSelected = (status ?? internalStatus) === "selected";
  // The live map already includes the bundled floor, so when it holds an entry
  // for this key that entry is authoritative at the OBJECT level: a tag replaces
  // the whole { image, video, description }, so an image-only override must clear
  // the baked video rather than fall through per-field. The baked props are the
  // floor only when there is no entry (assetKey unset, unknown key, no provider).
  const liveAsset = useAsset(assetKey ?? "");
  const hasLiveEntry = Object.keys(liveAsset).length > 0;
  // A selector is a thumbnail, so the live entry resolves to its card renditions.
  const liveCards = assetCardSources(liveAsset);
  const effectiveVideoSrc = (hasLiveEntry ? liveCards.video : videoSrc) ?? "";
  const effectiveImageSrc = (hasLiveEntry ? liveCards.image : imageSrc) ?? imageSrc;
  const effectivePosterSrc = hasLiveEntry ? liveCards.poster : undefined;
  const effectiveDescription = (hasLiveEntry ? liveAsset.description : description) ?? description;

  React.useEffect(() => {
    // Changing a `<source>`'s `src` doesn't reload the video on its own, so a
    // live-map override on an already-mounted card would keep playing the old
    // clip without this (mirrors ImageSelector).
    videoRef.current?.load();
  }, [effectiveVideoSrc]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    const nextStatus: IntroOnlySelectorStatus = isSelected ? "unselected" : "selected";
    if (status === undefined) {
      setInternalStatus(nextStatus);
    }
    onStatusChange?.(nextStatus);
  };

  return (
    <button
      type="button"
      aria-label={props["aria-label"] ?? label}
      aria-pressed={isSelected}
      onClick={handleClick}
      className={cn(
        // FRONT-893: mobile height tracks the viewport (28rem covers the header,
        // title, tabs, and the footer) so taller phones get taller cards.
        // Width stays in the existing clamp so both cards fit. object-cover
        // keeps the media ratio without stretching.
        "relative inline-flex cursor-pointer p-[2px]",
        "h-[clamp(280px,calc(100dvh-28rem),460px)] w-[clamp(146px,45vw,241px)] rounded-[20px]",
        "md:h-[470px] md:w-[clamp(320px,35vw,360px)] md:rounded-[32px]",
        isSelected && "bg-[image:var(--gradient-rose)]",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "border-dialog-bg bg-tooltip-default-bg relative isolate inline-flex h-full w-full flex-col items-center justify-end overflow-hidden border-2 p-4",
          "rounded-[18px]",
          "md:rounded-[30px]",
        )}
      >
        {effectiveVideoSrc ? (
          <video
            ref={videoRef}
            poster={effectivePosterSrc}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay={autoPlayAlways}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={effectiveDescription || undefined}
          >
            <source src={effectiveVideoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={effectiveImageSrc}
            alt={effectiveDescription}
            fill
            sizes="(max-width: 768px) 45vw, clamp(320px, 35vw, 360px)"
            className="object-cover"
          />
        )}
        <span
          className={cn(
            "absolute inset-0",
            isSelected
              ? "bg-[image:var(--gradient-overlay-dark-sel)]"
              : "bg-[image:var(--gradient-overlay-dark)]",
          )}
        />

        <span className="text-tooltip-text text-shadow-toggle relative z-10 w-full shrink-0 text-center text-base leading-6 font-medium">
          {label}
        </span>

        {isSelected && (
          // Mobile: top-2 right-2, size-6 / Desktop: top-3 right-3, size-8
          <span className="absolute top-2 right-2 z-10 inline-flex size-6 items-center justify-center rounded-full md:top-3 md:right-3 md:size-8">
            <TickIcon className="size-full" color="var(--gradient-rose)" />
          </span>
        )}
      </span>
    </button>
  );
}
