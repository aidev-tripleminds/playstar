import Image from "next/image";
import * as React from "react";

import { resolveAsset } from "@/lib/assets/asset-store";
import { cn } from "@/lib/utils";

export type ModelEmptyStateCard = {
  src: string;
  alt: string;
  rotationDeg: number;
  positionClassName: string;
  zIndexClassName?: string;
  /** Width as a percentage of the 187px container (matches Figma/CSS %). */
  widthPercent: number;
  /** Height as a percentage of the 193px container. */
  heightPercent: number;
};

export const modelEmptyStateDefaultCards: ModelEmptyStateCard[] = [
  {
    // image3: left: 0%, top: 0%, width: 69.86%, height: 82.12%
    src: resolveAsset("demo_pics_model3").image ?? "",
    alt: "",
    rotationDeg: -11.94,
    positionClassName: "left-0 top-0",
    zIndexClassName: "z-[1]",
    widthPercent: 69.86,
    heightPercent: 82.12,
  },
  {
    // image2: right: 0%, top: 9.03%, width: 69.11%, height: 81.66%
    src: resolveAsset("demo_pics_model2").image ?? "",
    alt: "",
    rotationDeg: 11.22,
    positionClassName: "right-0 top-[9.03%]",
    zIndexClassName: "z-[1]",
    widthPercent: 69.11,
    heightPercent: 81.66,
  },
  {
    // image1: left: 11.3%, top: 23.95%, width: 60.56%, height: 76.06%
    src: resolveAsset("demo_pics_model1").image ?? "",
    alt: "",
    rotationDeg: 3.9,
    positionClassName: "left-[11.3%] top-[23.95%]",
    zIndexClassName: "z-[2]",
    widthPercent: 60.56,
    heightPercent: 76.06,
  },
];

export type ModelEmptyStateProps = React.ComponentProps<"div"> & {
  cards?: ModelEmptyStateCard[];
};

export function ModelEmptyState({
  cards = modelEmptyStateDefaultCards,
  className,
  ...props
}: ModelEmptyStateProps) {
  return (
    <div
      data-slot="model-empty-state"
      className={cn("inline-flex flex-col items-center", className)}
      {...props}
    >
      {/* Container matches original: 193px tall. Width 187px (≈ 100% of the
          widest card at 69.86% of ~267px original; here we let percentage
          widths on children resolve against a fixed parent width). */}
      <div className="relative mx-auto h-[193px] w-[187px] shrink-0">
        {cards.map((card, index) => (
          <div
            key={`${card.src}-${index}`}
            className={cn(
              "border-tooltip-text absolute overflow-hidden rounded-2xl border-[2.4px] shadow-[0_0_16px_rgba(0,0,0,0.5)]",
              card.positionClassName,
              card.zIndexClassName,
            )}
            style={{
              width: `${card.widthPercent}%`,
              height: `${card.heightPercent}%`,
              transform: `rotate(${card.rotationDeg}deg)`,
            }}
          >
            <span className="relative block h-full w-full">
              <Image
                src={card.src}
                alt={card.alt}
                fill
                sizes="131px"
                className="bg-muted scale-[1.197] object-cover"
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
