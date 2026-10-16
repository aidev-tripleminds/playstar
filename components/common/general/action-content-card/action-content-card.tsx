"use client";

import * as React from "react";

import { ImageWithSkeleton } from "@/components/common/skeleton";
import { useAssetImage } from "@/lib/assets/asset-map-context";
import { cn } from "@/lib/utils";

import {
  ACTION_CONTENT_CARD_ADD_LABEL,
  ACTION_CONTENT_CARD_DEFAULT_IMAGE_SRC,
  ACTION_CONTENT_CARD_DEFAULT_OVERFLOW_COUNT,
  ACTION_CONTENT_CARD_DEFAULT_VARIANT,
  ACTION_CONTENT_CARD_HEIGHT_PX,
  ACTION_CONTENT_CARD_OVERFLOW_BACKGROUND,
  ACTION_CONTENT_CARD_OVERLAP_PX,
  ACTION_CONTENT_CARD_SCRIM,
  ACTION_CONTENT_CARD_STACK_ROTATIONS_DEG,
  ACTION_CONTENT_CARD_WIDTH_PX,
  type ActionContentCardVariant,
} from "./action-content-card.constants";

/** Figma `iconsax-add-circle` — filled circle with the plus cut out. */
const ADD_CIRCLE_PATH =
  "M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z";

type ThumbKind = "empty" | "photo" | "photo-add" | "overflow";

type ThumbItem = {
  kind: ThumbKind;
  imageSrc?: string;
  overflowLabel?: string;
};

function rotatedBounds(degrees: number) {
  const radians = (Math.abs(degrees) * Math.PI) / 180;

  return {
    width:
      ACTION_CONTENT_CARD_WIDTH_PX * Math.cos(radians) +
      ACTION_CONTENT_CARD_HEIGHT_PX * Math.sin(radians),
    height:
      ACTION_CONTENT_CARD_WIDTH_PX * Math.sin(radians) +
      ACTION_CONTENT_CARD_HEIGHT_PX * Math.cos(radians),
  };
}

function AddCircleGlyph({ className, gradientId }: { className?: string; gradientId?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      {gradientId ? (
        <defs>
          <linearGradient
            id={gradientId}
            x1="12"
            y1="2"
            x2="12"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#525252" />
            <stop offset="100%" stopColor="#737373" />
          </linearGradient>
        </defs>
      ) : null}
      <path d={ADD_CIRCLE_PATH} fill={gradientId ? `url(#${gradientId})` : "currentColor"} />
    </svg>
  );
}

function ActionContentThumb({
  kind,
  imageSrc,
  overflowLabel,
  icon,
  addLabel,
  onAddClick,
}: ThumbItem & {
  icon?: React.ReactNode;
  addLabel: string;
  onAddClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const gradientId = React.useId().replace(/:/g, "");
  const isEmpty = kind === "empty";

  return (
    <div
      data-slot={kind === "overflow" ? "action-content-card-overflow" : "action-content-card-thumb"}
      data-kind={kind}
      className={cn(
        "relative box-border h-[44px] w-[35px] shrink-0 overflow-hidden rounded-[6px] border font-sans",
        isEmpty ? "border-border-control bg-surface-strong border-dashed" : "border-cookie-bg",
        kind === "overflow" && "text-tooltip-text",
      )}
      style={
        kind === "overflow" ? { background: ACTION_CONTENT_CARD_OVERFLOW_BACKGROUND } : undefined
      }
    >
      {imageSrc ? (
        <ImageWithSkeleton src={imageSrc} alt="" fill sizes="35px" className="object-cover" />
      ) : null}

      {isEmpty ? (
        <button
          type="button"
          aria-label={addLabel}
          onClick={onAddClick}
          className="absolute inset-0 flex cursor-pointer items-center justify-center focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
        >
          <AddCircleGlyph gradientId={gradientId} className="size-4" />
        </button>
      ) : null}

      {kind === "photo-add" ? (
        icon ? (
          <span
            data-slot="action-content-card-icon"
            className="text-tooltip-text pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-6 items-center justify-center [&_svg]:size-4"
            style={{ background: ACTION_CONTENT_CARD_SCRIM }}
          >
            {icon}
          </span>
        ) : (
          <button
            type="button"
            data-slot="action-content-card-add"
            aria-label={addLabel}
            onClick={onAddClick}
            className="text-tooltip-text absolute inset-x-0 bottom-0 z-10 flex h-6 cursor-pointer items-center justify-center focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
            style={{ background: ACTION_CONTENT_CARD_SCRIM }}
          >
            <AddCircleGlyph className="size-4" />
          </button>
        )
      ) : null}

      {kind === "overflow" ? (
        <span className="absolute inset-0 flex items-center justify-center text-sm leading-5 font-medium">
          {overflowLabel}
        </span>
      ) : null}
    </div>
  );
}

function itemsForVariant(
  variant: ActionContentCardVariant,
  imageSrcs: string[],
  overflowCount: number,
): ThumbItem[] {
  const srcAt = (index: number) => imageSrcs[index] ?? imageSrcs[imageSrcs.length - 1] ?? "";

  if (variant === "default") return [{ kind: "empty" }];
  if (variant === "loaded") return [{ kind: "photo-add", imageSrc: srcAt(0) }];
  if (variant === "two") {
    return [
      { kind: "photo", imageSrc: srcAt(0) },
      { kind: "photo-add", imageSrc: srcAt(1) },
    ];
  }
  if (variant === "three") {
    return [
      { kind: "photo", imageSrc: srcAt(0) },
      { kind: "photo", imageSrc: srcAt(1) },
      { kind: "photo-add", imageSrc: srcAt(2) },
    ];
  }

  return [
    { kind: "photo", imageSrc: srcAt(0) },
    { kind: "photo", imageSrc: srcAt(1) },
    { kind: "photo", imageSrc: srcAt(2) },
    { kind: "overflow", overflowLabel: `+${overflowCount}` },
  ];
}

export type ActionContentCardProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Figma `Property 1`. */
  variant?: ActionContentCardVariant;
  /** Logical asset key, re-resolved live via `useAsset`. */
  assetKey?: string;
  imageSrc?: string;
  /** Thumbnails for the fan. Missing entries repeat the last source. */
  imageSrcs?: string[];
  /** Count drawn on the overflow card as `+{count}`. */
  overflowCount?: number;
  /** Replaces the add glyph on a loaded card. Reused by the compact prompt box. */
  icon?: React.ReactNode;
  addLabel?: string;
  onAddClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function ActionContentCard({
  variant = ACTION_CONTENT_CARD_DEFAULT_VARIANT,
  assetKey,
  imageSrc,
  imageSrcs,
  overflowCount = ACTION_CONTENT_CARD_DEFAULT_OVERFLOW_COUNT,
  icon,
  addLabel = ACTION_CONTENT_CARD_ADD_LABEL,
  onAddClick,
  className,
  ...props
}: ActionContentCardProps) {
  const resolvedImageSrc = useAssetImage(
    assetKey ?? "",
    imageSrc ?? ACTION_CONTENT_CARD_DEFAULT_IMAGE_SRC,
  );
  const sources = imageSrcs?.length ? imageSrcs : [resolvedImageSrc];
  const items = itemsForVariant(variant, sources, overflowCount);
  const isStack = items.length > 1;

  return (
    <div
      data-slot="action-content-card"
      data-variant={variant}
      className={cn("inline-flex items-center", className)}
      {...props}
    >
      {items.map((item, index) => {
        const thumb = (
          <ActionContentThumb
            key={`${item.kind}-${index}`}
            kind={item.kind}
            imageSrc={item.imageSrc}
            overflowLabel={item.overflowLabel}
            icon={icon}
            addLabel={addLabel}
            onAddClick={onAddClick}
          />
        );

        if (!isStack) return thumb;

        const rotation = ACTION_CONTENT_CARD_STACK_ROTATIONS_DEG[index] ?? 0;
        const bounds = rotatedBounds(rotation);

        return (
          <div
            key={`${item.kind}-${index}`}
            data-slot="action-content-card-fan"
            data-rotation={rotation}
            className="relative flex shrink-0 items-center justify-center"
            style={{
              width: bounds.width,
              height: bounds.height,
              zIndex: index + 1,
              marginLeft: index > 0 ? -ACTION_CONTENT_CARD_OVERLAP_PX : undefined,
            }}
          >
            <div style={rotation ? { transform: `rotate(${rotation}deg)` } : undefined}>
              {thumb}
            </div>
          </div>
        );
      })}
    </div>
  );
}
