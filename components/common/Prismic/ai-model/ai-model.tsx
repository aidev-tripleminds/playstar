"use client";

import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { UnblurOverlay } from "@/components/common/general/unblur-overlay";
import {
  ImageWithSkeleton,
  MediaSkeletonOverlay,
  VideoWithSkeleton,
} from "@/components/common/skeleton";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useAsset } from "@/lib/assets/asset-map-context";
import { assetCardSources } from "@/lib/media-card-sources";
import { cn } from "@/lib/utils";

import {
  AI_MODEL_DEFAULT_DESCRIPTION,
  AI_MODEL_DEFAULT_IMAGE_SRC,
  AI_MODEL_DEFAULT_NAME,
  AI_MODEL_DEFAULT_STATS,
  AI_MODEL_MEDIA_DEFAULT_NAME,
  AI_MODEL_TEMPLATES_DEFAULT_BADGE,
  AI_MODEL_TEMPLATES_DEFAULT_NAME,
  AI_MODEL_TEMPLATES_INSET_IMAGE_SRC,
  type AiModelSize,
  type AiModelStat,
  type AiModelVariant,
} from "./ai-model.constants";
import {
  aiModelCardVariants,
  aiModelInsetVariants,
  aiModelOverlayVariants,
  aiModelVariants,
} from "./ai-model.shared";
import { AiModelCharactersContent } from "./components/ai-model-characters-content";
import { AiModelMediaContent } from "./components/ai-model-media-content";
import { AiModelTemplatesContent } from "./components/ai-model-templates-content";

export type AiModelProps = VariantProps<typeof aiModelVariants> &
  Omit<React.ComponentProps<"div">, "children"> & {
    variant?: AiModelVariant;
    size?: AiModelSize;
    name?: string;
    description?: string;
    /** Logical asset key, re-resolved live via `useAsset`. See `CharacterHighlight`. */
    assetKey?: string;
    imageSrc?: string;
    videoSrc?: string;
    /** Still shown until the video plays (a video card's `poster_url`). */
    posterSrc?: string;
    imageAlt?: string;
    stats?: AiModelStat[];
    showLive?: boolean;
    showVerified?: boolean;
    badgeLabel?: string;
    insetImageSrc?: string;
    insetImageAlt?: string;
    actionLabel?: string;
    showActionButton?: boolean;
    showVideo?: boolean;
    /**
     * The backend's `blurred`: overlays the unblur CTA. Its URLs are already
     * safe — a blurred video's `videoSrc` is its blurred video.
     */
    blurred?: boolean;
    showStats?: boolean;
    /** Homepage videos tab: enable name → generate hover swap at tiny/mobile sizes. */
    mediaHoverAtAllSizes?: boolean;
    onActionClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

function hasNestedActionButtons(
  variant: AiModelVariant,
  size: AiModelSize,
  showActionButton: boolean,
) {
  if (variant === "templates") {
    return true;
  }

  return (variant === "images" || variant === "videos") && showActionButton && size === "default";
}

function resolveName(variant: AiModelVariant, name?: string) {
  if (variant === "characters") {
    return name ?? AI_MODEL_DEFAULT_NAME;
  }

  if (variant === "templates") {
    if (name == null || name === AI_MODEL_DEFAULT_NAME) {
      return AI_MODEL_TEMPLATES_DEFAULT_NAME;
    }

    return name;
  }

  if (name == null || name === AI_MODEL_DEFAULT_NAME) {
    return AI_MODEL_MEDIA_DEFAULT_NAME;
  }

  return name;
}

export function AiModel({
  variant = "characters",
  size: sizeProp,
  name,
  description = AI_MODEL_DEFAULT_DESCRIPTION,
  assetKey,
  imageSrc = AI_MODEL_DEFAULT_IMAGE_SRC,
  videoSrc,
  posterSrc,
  showVideo = false,
  blurred = false,
  imageAlt,
  stats = AI_MODEL_DEFAULT_STATS,
  showLive = true,
  showVerified = true,
  badgeLabel = AI_MODEL_TEMPLATES_DEFAULT_BADGE,
  insetImageSrc = AI_MODEL_TEMPLATES_INSET_IMAGE_SRC,
  insetImageAlt,
  actionLabel,
  showActionButton = true,
  showStats = true,
  mediaHoverAtAllSizes = false,
  onActionClick,
  className,
  onClick,
  onKeyDown,
  ...props
}: AiModelProps) {
  const isDesktop = useIsDesktop();
  // The card is a thumbnail, so a live asset resolves to its card renditions.
  const asset = useAsset(assetKey ?? "");
  const assetCards = assetCardSources(asset);
  const resolvedImageSrc = assetCards.image ?? imageSrc;
  // A gated viewer's entry carries only its blurred video and poster (if any);
  // never substitute the caller's (clear) `videoSrc` / `posterSrc` for them.
  const gated = asset.blurred === true;
  const resolvedVideoSrc = assetCards.video ?? (gated ? undefined : videoSrc) ?? "";
  const resolvedPosterSrc = assetCards.poster ?? (gated ? undefined : posterSrc);
  const resolvedSize: AiModelSize = sizeProp ?? (isDesktop ? "default" : "tiny");
  const resolvedName = resolveName(variant, name);
  const resolvedImageAlt = imageAlt ?? resolvedName;
  const resolvedInsetImageAlt = insetImageAlt ?? resolvedName;
  const insetImageSizes = resolvedSize === "default" ? "66px" : "44px";
  const nestedActionButtons =
    hasNestedActionButtons(variant, resolvedSize, showActionButton) ||
    (mediaHoverAtAllSizes && showActionButton && (variant === "images" || variant === "videos"));
  const isCardClickable = Boolean(onClick) && !nestedActionButtons;

  const media =
    resolvedVideoSrc && showVideo ? (
      <VideoWithSkeleton
        src={resolvedVideoSrc}
        poster={resolvedPosterSrc}
        className="object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    ) : resolvedImageSrc ? (
      <ImageWithSkeleton
        src={resolvedImageSrc}
        alt={resolvedImageAlt}
        fill
        className="object-cover"
      />
    ) : assetKey ? (
      <MediaSkeletonOverlay isLoaded={false} />
    ) : null;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !isCardClickable || !onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      data-slot="ai-model"
      data-variant={variant}
      data-size={resolvedSize}
      aria-label={resolvedName}
      role={isCardClickable ? "button" : undefined}
      tabIndex={isCardClickable ? 0 : undefined}
      className={cn(aiModelVariants({ size: resolvedSize }), className, "w-[100%]")}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <span className={aiModelCardVariants({ size: resolvedSize })} data-slot="ai-model-card">
        {media}

        <span
          className={aiModelOverlayVariants({ size: resolvedSize, variant })}
          data-slot="ai-model-overlay"
          aria-hidden
        />
        {variant === "characters" ? (
          <AiModelCharactersContent
            showStats={showStats}
            size={resolvedSize}
            name={resolvedName}
            description={description}
            stats={stats}
            showLive={showLive}
            showVerified={showVerified}
          />
        ) : null}

        {variant === "images" || variant === "videos" ? (
          <AiModelMediaContent
            variant={variant}
            size={resolvedSize}
            name={resolvedName}
            actionLabel={actionLabel}
            showActionButton={showActionButton}
            mediaHoverAtAllSizes={mediaHoverAtAllSizes}
            onActionClick={onActionClick}
          />
        ) : null}

        {variant === "templates" ? (
          <span className={aiModelInsetVariants({ size: resolvedSize })} data-slot="ai-model-inset">
            <ImageWithSkeleton
              src={insetImageSrc}
              alt={resolvedInsetImageAlt}
              fill
              sizes={insetImageSizes}
              className="object-cover"
            />
          </span>
        ) : null}

        {variant === "templates" ? (
          <AiModelTemplatesContent
            size={resolvedSize}
            name={resolvedName}
            badgeLabel={badgeLabel}
            actionLabel={actionLabel}
            showActionButton={showActionButton}
            onActionClick={onActionClick}
          />
        ) : null}

        {blurred ? <UnblurOverlay /> : null}
      </span>
    </div>
  );
}

export { aiModelCardVariants, aiModelVariants } from "./ai-model.shared";
