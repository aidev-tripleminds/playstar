import * as React from "react";

import { cn } from "@/lib/utils";

import {
  NUMBER_DEFAULT_VALUE,
  NUMBER_DEFAULT_VARIANT,
  type NumberVariant,
} from "./number.constants";

/** Figma Button/Pink Primary Gradient as a 1px ring. */
const numberHollowBorderStyle: React.CSSProperties = {
  padding: 1,
  background: "var(--button-pink-primary-gradient)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  maskComposite: "exclude",
};

const numberClassName =
  "relative inline-flex size-[18px] shrink-0 items-center justify-center rounded-full font-sans text-[10px] leading-none font-medium text-cookie-bg";

export type NumberProps = Omit<React.ComponentProps<"span">, "children"> & {
  variant?: NumberVariant;
  value?: string;
};

export function Number({
  variant = NUMBER_DEFAULT_VARIANT,
  value = NUMBER_DEFAULT_VALUE,
  className,
  ...props
}: NumberProps) {
  const resolvedVariant = variant ?? NUMBER_DEFAULT_VARIANT;

  return (
    <span
      data-slot="number"
      data-variant={resolvedVariant}
      className={cn(
        numberClassName,
        resolvedVariant === "filled" && "bg-[image:var(--button-pink-primary-gradient)]",
        className,
      )}
      {...props}
    >
      {resolvedVariant === "hollow" ? (
        <span
          data-slot="number-border"
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={numberHollowBorderStyle}
        />
      ) : null}
      {value}
    </span>
  );
}
