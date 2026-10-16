"use client";

import { cva } from "class-variance-authority";
import * as React from "react";

import { Add } from "@/components/common/general/add";
import { ImageWithSkeleton } from "@/components/common/skeleton";
import { useAssetImage } from "@/lib/assets/asset-map-context";
import { cn } from "@/lib/utils";

import {
  ACTION_CARD_ADD_LABEL,
  ACTION_CARD_DEFAULT_IMAGE_SRC,
  ACTION_CARD_DEFAULT_NAME,
  ACTION_CARD_DEFAULT_SIZE,
  ACTION_CARD_DEFAULT_STATUS,
  ACTION_CARD_DESKTOP_WIDTH_PX,
  ACTION_CARD_MOBILE_WIDTH_PX,
  type ActionCardSize,
  type ActionCardStatus,
} from "./action-card.constants";

const actionCardVariants = cva("relative isolate shrink-0 overflow-hidden font-sans", {
  variants: {
    size: {
      desktop: "h-[330px] w-[220px] rounded-[24px]",
      mobile: "h-[255px] w-[175px] rounded-[12px]",
    },
  },
  defaultVariants: {
    size: ACTION_CARD_DEFAULT_SIZE,
  },
});

const actionCardOverlayVariants = cva(
  "absolute inset-x-0 bottom-0 z-10 flex items-end justify-center [background:var(--gradient-character-black)]",
  {
    variants: {
      size: {
        desktop: "h-[100px] p-4",
        mobile: "h-20 px-2 py-2.5",
      },
    },
    defaultVariants: {
      size: ACTION_CARD_DEFAULT_SIZE,
    },
  },
);

const actionCardNameVariants = cva("text-tooltip-text w-full text-center font-semibold", {
  variants: {
    size: {
      desktop: "text-[18px] leading-7",
      mobile: "text-sm leading-4",
    },
  },
  defaultVariants: {
    size: ACTION_CARD_DEFAULT_SIZE,
  },
});

const actionCardAddPositionVariants = cva("absolute z-20", {
  variants: {
    size: {
      desktop: "top-4 right-4",
      mobile: "top-3 right-3",
    },
  },
  defaultVariants: {
    size: ACTION_CARD_DEFAULT_SIZE,
  },
});

/** Figma Border/Light Inner — 1px gradient stroke, same treatment as explore placeholders. */
const actionCardBorderStyle: React.CSSProperties = {
  padding: 1,
  background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 100%)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
};

export type ActionCardProps = Omit<React.ComponentProps<"article">, "children"> & {
  size?: ActionCardSize;
  status?: ActionCardStatus;
  /** Figma text property `Name`. */
  name?: string;
  /** Logical asset key, re-resolved live via `useAsset`. */
  assetKey?: string;
  imageSrc?: string;
  imageAlt?: string;
  onAddClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function ActionCard({
  size = ACTION_CARD_DEFAULT_SIZE,
  status = ACTION_CARD_DEFAULT_STATUS,
  name = ACTION_CARD_DEFAULT_NAME,
  assetKey,
  imageSrc,
  imageAlt,
  onAddClick,
  onClick,
  onKeyDown,
  className,
  ...props
}: ActionCardProps) {
  const resolvedImageSrc = useAssetImage(assetKey ?? "", imageSrc ?? ACTION_CARD_DEFAULT_IMAGE_SRC);
  const showAdd = status === "add";
  const isCardClickable = Boolean(onClick) && !showAdd;
  const imageWidth = size === "mobile" ? ACTION_CARD_MOBILE_WIDTH_PX : ACTION_CARD_DESKTOP_WIDTH_PX;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !isCardClickable || !onClick) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(event as unknown as React.MouseEvent<HTMLElement>);
    }
  };

  const handleAddClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onAddClick?.(event);
  };

  return (
    <article
      data-slot="action-card"
      data-size={size}
      data-status={status}
      role={isCardClickable ? "button" : undefined}
      tabIndex={isCardClickable ? 0 : undefined}
      className={cn(actionCardVariants({ size }), isCardClickable && "cursor-pointer", className)}
      onClick={isCardClickable ? onClick : undefined}
      onKeyDown={isCardClickable ? handleKeyDown : onKeyDown}
      {...props}
    >
      <ImageWithSkeleton
        src={resolvedImageSrc}
        alt={imageAlt ?? ""}
        fill
        sizes={`${imageWidth}px`}
        className="object-cover"
      />

      <div data-slot="action-card-overlay" className={actionCardOverlayVariants({ size })}>
        <p data-slot="action-card-name" className={actionCardNameVariants({ size })}>
          {name}
        </p>
      </div>

      {showAdd ? (
        <Add
          size={size === "mobile" ? "mobile" : "default"}
          aria-label={ACTION_CARD_ADD_LABEL}
          className={actionCardAddPositionVariants({ size })}
          onClick={handleAddClick}
        />
      ) : null}

      <span
        data-slot="action-card-border"
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30 rounded-[inherit]"
        style={actionCardBorderStyle}
      />
    </article>
  );
}
