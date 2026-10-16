"use client";

import * as React from "react";

import { Close } from "@/components/common/general/close/close";
import { ImageWithSkeleton } from "@/components/common/skeleton";
import { useAssetImage } from "@/lib/assets/asset-map-context";
import { cn } from "@/lib/utils";

import {
  SCENE_ADD_LABEL,
  SCENE_DEFAULT_IMAGE_SRC,
  SCENE_DEFAULT_NAME,
  SCENE_DEFAULT_VARIANT,
  SCENE_THUMB_WIDTH_PX,
  type SceneVariant,
} from "./scene.constants";

/** Figma `24035:94935` — 4×2 dots, radius 1.67, on a 23×10 grip. */
const SCENE_GRIP_DOTS = [
  [1.643, 1.667],
  [8.214, 1.667],
  [14.786, 1.667],
  [21.357, 1.667],
  [1.643, 8.333],
  [8.214, 8.333],
  [14.786, 8.333],
  [21.357, 8.333],
] as const;

/** Figma Border/Light Inner — 1px gradient stroke. */
const sceneBorderStyle: React.CSSProperties = {
  padding: 1,
  background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 100%)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
};

/** Figma Button/Pink Primary Gradient on the add-state icon. */
const sceneAddIconBorderStyle: React.CSSProperties = {
  ...sceneBorderStyle,
  background: "var(--button-pink-primary-gradient)",
};

const sceneFrameClassName =
  "relative box-border h-[146px] w-[92px] shrink-0 rounded-[16px] p-[5px] font-sans";

function SceneBorder() {
  return (
    <span
      data-slot="scene-border"
      aria-hidden
      className="pointer-events-none absolute inset-0 z-30 rounded-[inherit]"
      style={sceneBorderStyle}
    />
  );
}

function SceneGrip() {
  return (
    <svg
      data-slot="scene-grip"
      width={23}
      height={10}
      viewBox="0 0 23 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="text-gray-text pointer-events-none mb-0.5 h-2.5 w-[23px] shrink-0"
    >
      {SCENE_GRIP_DOTS.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.667} fill="currentColor" />
      ))}
    </svg>
  );
}

/** Figma `lucide:playing-cards-fan` — 24 viewBox, drawn at 20px. */
function PlayingCardsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12.6498 7.64988C12.7537 7.40851 12.9041 7.18998 13.0925 7.00677C13.2808 6.82355 13.5034 6.67925 13.7476 6.58211C13.9917 6.48497 14.2526 6.4369 14.5154 6.44063C14.7781 6.44437 15.0376 6.49984 15.2788 6.60388L20.7888 8.97787C21.0301 9.08174 21.2485 9.23211 21.4316 9.4204C21.6148 9.60869 21.759 9.8312 21.8561 10.0752C21.9533 10.3193 22.0014 10.58 21.9977 10.8427C21.9941 11.1053 21.9387 11.3646 21.8348 11.6059L17.8778 20.7899C17.774 21.0311 17.6236 21.2495 17.4353 21.4327C17.247 21.6158 17.0245 21.76 16.7805 21.8572C16.5365 21.9543 16.2757 22.0024 16.013 21.9988C15.7504 21.9951 15.4911 21.9398 15.2498 21.8359L9.73984 19.4619C9.4986 19.358 9.28018 19.2076 9.09705 19.0194C8.91392 18.8311 8.76967 18.6086 8.67254 18.3645C8.57541 18.1205 8.5273 17.8597 8.53096 17.5971C8.53461 17.3344 8.58996 17.0751 8.69384 16.8339L12.6498 7.64988Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 7.777V4C18 3.46957 17.7893 2.96086 17.4142 2.58579C17.0391 2.21071 16.5304 2 16 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4V14C7.99985 14.3775 8.10655 14.7473 8.30775 15.0667C8.50896 15.3862 8.79645 15.6421 9.137 15.805"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99981 4.38916L3.63581 5.19816C3.11447 5.29484 2.65286 5.59459 2.35245 6.03151C2.05205 6.46843 1.93744 7.00676 2.03381 7.52816L3.85581 17.3612C3.95249 17.8827 4.25238 18.3445 4.68953 18.6449C5.12668 18.9454 5.66526 19.0598 6.18681 18.9632L8.72881 18.4932"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type SceneProps = Omit<React.HTMLAttributes<HTMLElement>, "children" | "onClick"> & {
  /** Figma `Property 1`. `add` is Variant2. */
  variant?: SceneVariant;
  /** Figma text on the default scene. */
  name?: string;
  /** Figma text on the add scene. */
  addLabel?: string;
  /** Logical asset key, re-resolved live via `useAsset`. */
  assetKey?: string;
  imageSrc?: string;
  imageAlt?: string;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  closeLabel?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  disabled?: boolean;
};

export function Scene({
  variant = SCENE_DEFAULT_VARIANT,
  name = SCENE_DEFAULT_NAME,
  addLabel = SCENE_ADD_LABEL,
  assetKey,
  imageSrc,
  imageAlt,
  onClose,
  closeLabel,
  onClick,
  disabled,
  className,
  ...props
}: SceneProps) {
  const resolvedImageSrc = useAssetImage(assetKey ?? "", imageSrc ?? SCENE_DEFAULT_IMAGE_SRC);

  if (variant === "add") {
    return (
      <button
        type="button"
        data-slot="scene"
        data-variant="add"
        disabled={disabled}
        className={cn(
          sceneFrameClassName,
          "flex flex-col items-center justify-center gap-2.5",
          "bg-tooltip-default-bg text-tooltip-text",
          "cursor-pointer",
          "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        onClick={onClick}
        {...props}
      >
        <span
          data-slot="scene-add-icon"
          className="bg-surface-strong relative flex size-[38px] shrink-0 items-center justify-center rounded-full"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={sceneAddIconBorderStyle}
          />
          <PlayingCardsIcon className="text-tooltip-text relative size-5" />
        </span>
        <span data-slot="scene-label" className="w-full text-center text-xs leading-4 font-medium">
          {addLabel}
        </span>
        <SceneBorder />
      </button>
    );
  }

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClose?.(event);
  };

  return (
    <article
      data-slot="scene"
      data-variant="default"
      className={cn(
        sceneFrameClassName,
        "bg-surface-strong flex flex-col items-center gap-1.5",
        className,
      )}
      {...props}
    >
      {onClick ? (
        <button
          type="button"
          data-slot="scene-action"
          aria-label={name}
          className={cn(
            "absolute inset-0 z-1 cursor-pointer rounded-[inherit] border-0 bg-transparent p-0",
            "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none",
          )}
          onClick={onClick}
        />
      ) : null}

      <SceneGrip />

      <div
        data-slot="scene-thumb"
        className={cn(
          "border-tooltip-text relative z-20 h-[96px] w-full overflow-hidden rounded-[12px] border shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)]",
          onClick && "pointer-events-none",
        )}
      >
        <ImageWithSkeleton
          src={resolvedImageSrc}
          alt={imageAlt ?? ""}
          fill
          sizes={`${SCENE_THUMB_WIDTH_PX}px`}
          className="object-cover"
        />
        <Close
          size="small"
          aria-label={closeLabel ?? `Remove ${name}`}
          className="pointer-events-auto absolute top-1 right-1 z-20"
          onClick={handleClose}
        />
      </div>

      <p
        data-slot="scene-name"
        aria-hidden={onClick ? true : undefined}
        className="text-cookie-bg pointer-events-none w-full text-center text-xs leading-4 font-medium"
      >
        {name}
      </p>

      <SceneBorder />
    </article>
  );
}
