"use client";

import Image from "next/image";
import * as React from "react";

import { useAsset } from "@/lib/assets/asset-map-context";
import { dummyImage } from "@/lib/dummy-images";
import { assetCardSources } from "@/lib/media-card-sources";
import { cn } from "@/lib/utils";
import TickIcon from "@/public/assets/icons/tick-icon";

export type ImageSelectorStatus = "selected" | "unselected";

/**
 * The rendered width of a card image: at most 150 px from `md`, 90 px below.
 * Without it `fill` defaults to `100vw` and requests a 3840 px image.
 */
export const IMAGE_SELECTOR_IMAGE_SIZES = "(min-width: 768px) 150px, 90px";
export type ImageSelectorVariant = "big" | "custom" | "selector" | "age";

export type ImageSelectorProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  status?: ImageSelectorStatus;
  defaultStatus?: ImageSelectorStatus;
  variant?: ImageSelectorVariant;
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
  customimageSrc?: string;
  showSelectionIcon?: boolean;
  onStatusChange?: (nextStatus: ImageSelectorStatus) => void;
};

export function ImageSelector({
  status,
  defaultStatus = "unselected",
  variant = "big",
  label = "Lorem",
  assetKey,
  imageSrc = dummyImage(108),
  videoSrc = "",
  description = "",
  customimageSrc = dummyImage(109),
  autoPlayAlways = true,
  showSelectionIcon = true,
  className,
  onClick,
  onStatusChange,
  ...props
}: ImageSelectorProps) {
  const [internalStatus, setInternalStatus] = React.useState<ImageSelectorStatus>(defaultStatus);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const isSelectable = variant === "big" || variant === "custom";
  const isImageCard = variant === "big" || variant === "custom" || variant === "selector";
  const currentStatus = status ?? internalStatus;
  const isSelected = isSelectable && currentStatus === "selected";

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

  // The custom variant's baked placeholder (`customimageSrc`) is distinct from
  // `imageSrc`, but a live entry is still authoritative once one exists.
  const resolvedImageSrc =
    variant === "custom" && !hasLiveEntry ? customimageSrc : effectiveImageSrc;

  const shouldPlayVideo = Boolean(effectiveVideoSrc && (autoPlayAlways || isSelected));

  React.useEffect(() => {
    // Changing the `src` of a `<source>` child doesn't reload the video on
    // its own — the same card instance is reused across trait selections
    // (e.g. in the summary), so without this the old clip keeps playing.
    // Calling load() for a card that is not playing would fetch every clip
    // on the step. preload="none" keeps the poster up until this card plays.
    if (!shouldPlayVideo) {
      return;
    }
    videoRef.current?.load();
  }, [effectiveVideoSrc, shouldPlayVideo]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (shouldPlayVideo) {
      void video.play().catch(() => {
        // Autoplay may be blocked by the browser.
      });
    } else {
      video.pause();

      if (video.readyState >= 1) {
        video.currentTime = 0;
      } else {
        const reset = () => {
          video.currentTime = 0;
          video.removeEventListener("loadedmetadata", reset);
        };

        video.addEventListener("loadedmetadata", reset);
      }
    }
  }, [shouldPlayVideo]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!isSelectable) {
      return;
    }

    const nextStatus: ImageSelectorStatus = isSelected ? "unselected" : "selected";

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
        // Fill the grid column. A fixed 150px card overflows the 600px step
        // column (FRONT-876) and a fixed 90px card leaves gaps on wider
        // phones (FRONT-879). Aspect ratio keeps the portrait shape as the
        // width changes.
        "relative block max-w-full min-w-0 shrink-0 cursor-pointer",
        (variant === "big" || variant === "custom") &&
          "aspect-[90/138] w-full rounded-[12px] md:rounded-[16px]",
        (variant === "selector" || variant === "age") &&
          "aspect-square w-full rounded-[12px] md:w-[128px] md:rounded-[16px]",
        // Unselected stroke is the 1px inset of --card-border (white 0% → 10%).
        !isSelected && "bg-[image:var(--card-border)]",
        isSelected && "shadow-selection-box bg-[image:var(--gradient-rose)]",
        className,
      )}
      {...props}
    >
      {isImageCard ? (
        <span
          className={cn(
            // Stretch between both edges. Percentage height inside the old
            // padded flex box rounded a pixel short on some mobile widths.
            "absolute isolate flex overflow-hidden",
            isSelected
              ? "border-dialog-bg bg-tooltip-default-bg inset-0.5 rounded-[10px] border-2 md:rounded-[14px]"
              : "inset-px rounded-[11px] border-0 bg-transparent md:rounded-[15px]",
            variant === "custom"
              ? "items-center justify-center bg-transparent p-1.5 md:p-3"
              : "items-end justify-center p-1.5 md:p-3",
          )}
        >
          {/* Overscan so object-fit rounding cannot expose the card background. */}
          <span className="pointer-events-none absolute -inset-px">
            {effectiveVideoSrc ? (
              <video
                ref={videoRef}
                poster={effectivePosterSrc}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay={shouldPlayVideo}
                muted
                loop
                playsInline
                preload={shouldPlayVideo ? "metadata" : "none"}
                aria-label={effectiveDescription || undefined}
              >
                <source src={effectiveVideoSrc} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={resolvedImageSrc}
                alt={effectiveDescription}
                fill
                sizes={IMAGE_SELECTOR_IMAGE_SIZES}
                className="object-cover"
              />
            )}
          </span>

          <span
            className={cn(
              "absolute inset-0",
              isSelected
                ? "bg-[image:var(--gradient-overlay-dark-sel)]"
                : "bg-[image:var(--gradient-overlay-dark)]",
            )}
          />

          {variant === "custom" ? (
            <span className="relative z-10 flex h-full w-full flex-col items-center justify-end">
              {!isSelected && label === "Custom" && (
                <Image
                  src="/assets/crown-filled.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-4 drop-shadow-[0px_0px_15px_rgba(0,0,0,0.8)] md:size-5"
                />
              )}

              <span
                className={cn(
                  "text-tooltip-text line-clamp-3 text-center font-medium [overflow-wrap:anywhere] [text-shadow:0px_0px_15px_#000]",
                  isSelected
                    ? "text-[14px] leading-4 md:text-[14px] md:leading-5"
                    : "text-[14px] leading-4 md:text-[16px] md:leading-5",
                )}
              >
                {label}
              </span>
            </span>
          ) : (
            <span
              className={cn(
                "text-tooltip-text relative z-10 line-clamp-3 w-full text-center font-medium [overflow-wrap:anywhere] md:text-nowrap",
                variant === "selector"
                  ? "text-[14px] leading-5 [text-shadow:0px_0px_15px_#000] md:text-[16px] md:leading-6"
                  : "text-[14px] leading-4 [text-shadow:0px_0px_15px_#000] md:text-[16px] md:leading-6",
              )}
            >
              {label}
            </span>
          )}

          {isSelected && showSelectionIcon ? (
            <span
              className={cn(
                "absolute top-1 right-1 z-10 inline-flex size-4 items-center justify-center rounded-full md:top-3 md:right-3 md:size-6",
              )}
            >
              <TickIcon className="h-full w-full" color="var(--gradient-rose)" />
            </span>
          ) : null}
        </span>
      ) : (
        <span
          className={cn(
            "absolute inset-px flex items-center justify-center rounded-[11px] bg-[image:var(--background-neutral-gradient)] p-1.5 md:rounded-[15px] md:p-3",
          )}
        >
          <span className="text-shadow-toggle text-tooltip-text line-clamp-3 text-center text-[16px] leading-6 font-medium [overflow-wrap:anywhere]">
            {label}
          </span>
        </span>
      )}
    </button>
  );
}
