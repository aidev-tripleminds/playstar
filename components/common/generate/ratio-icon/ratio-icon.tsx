import * as React from "react";

import { cn } from "@/lib/utils";

import {
  RATIO_ICON_DIMENSIONS,
  RATIO_ICON_VIEWBOX_SIZE,
  type RatioIconRatio,
} from "./ratio-icon.constants";

export type RatioIconProps = React.SVGProps<SVGSVGElement> & {
  ratio?: RatioIconRatio;
};

export function RatioIcon({ ratio = "4:3", className, ...props }: RatioIconProps) {
  const { width, height, radius } = RATIO_ICON_DIMENSIONS[ratio];
  const viewBoxSize = RATIO_ICON_VIEWBOX_SIZE;

  return (
    <svg
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      data-slot="ratio-icon"
      data-ratio={ratio}
      className={cn("text-divider-label size-5 shrink-0", className)}
      {...props}
    >
      <rect
        x={(viewBoxSize - width) / 2}
        y={(viewBoxSize - height) / 2}
        width={width}
        height={height}
        rx={radius}
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export {
  RATIO_ICON_DIMENSIONS,
  RATIO_ICON_RATIOS,
  RATIO_ICON_VIEWBOX_SIZE,
  type RatioIconRatio,
} from "./ratio-icon.constants";
