import { cva, type VariantProps } from "class-variance-authority";
import Image, { type StaticImageData } from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";
import { CrossIcon } from "@/public/assets/icons/cross";

const closeButtonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full p-1",
    "bg-tooltip-default-bg text-modal-text",
    "transition-[background-color,color,transform] duration-150 ease-out",
    "hover:bg-surface-strong hover:text-tooltip-text",
    "active:scale-95",
    "focus-visible:ring-tooltip-text/40 focus-visible:ring-2 focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        medium: "size-7",
        small: "size-6",
      },
      /** Forced visual state for design previews; hover is also applied via CSS. */
      status: {
        default: "",
        hover: "bg-surface-strong text-tooltip-text",
      },
    },
    defaultVariants: {
      size: "medium",
      status: "default",
    },
  },
);

const iconSizeClasses = {
  medium: "size-5",
  small: "size-4",
} as const;

const iconPixelSizes = {
  medium: 20,
  small: 16,
} as const;

export type CloseProps = VariantProps<typeof closeButtonVariants> &
  Omit<React.ComponentProps<"button">, "children"> & {
    iconSrc?: string | StaticImageData | React.ReactNode;
    iconAlt?: string;
    iconClassName?: string;
  };

export const Close = React.forwardRef<HTMLButtonElement, CloseProps>(function Close(
  {
    status = "default",
    size = "medium",
    className,
    disabled,
    iconSrc,
    iconAlt = "Close",
    iconClassName,
    type = "button",
    "aria-label": ariaLabel = "Close",
    ...props
  },
  ref,
) {
  const resolvedSize = size ?? "medium";
  const iconPixels = iconPixelSizes[resolvedSize];

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        closeButtonVariants({ status, size: resolvedSize }),
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
      {...props}
    >
      {React.isValidElement(iconSrc) ? (
        <span
          className={cn(
            "inline-flex items-center justify-center",
            iconSizeClasses[resolvedSize],
            iconClassName,
          )}
        >
          {iconSrc}
        </span>
      ) : iconSrc ? (
        <Image
          src={iconSrc as string | StaticImageData}
          alt={iconAlt}
          width={iconPixels}
          height={iconPixels}
          className={cn("object-cover", iconSizeClasses[resolvedSize], iconClassName)}
        />
      ) : (
        <CrossIcon className={cn("shrink-0", iconSizeClasses[resolvedSize], iconClassName)} />
      )}
    </button>
  );
});
