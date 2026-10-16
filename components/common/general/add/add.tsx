import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/** Figma `24044:83036` — 28px default, 24px mobile, black/40 fill, 4px blur. */
const addButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-full p-1",
    "bg-black/40 text-tooltip-text backdrop-blur-[4px]",
    "transition-colors duration-150 ease-out",
    "hover:bg-black/55",
    "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        default: "size-7",
        mobile: "size-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const addIconVariants = cva("shrink-0", {
  variants: {
    size: {
      default: "size-5",
      mobile: "size-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

/** Figma `Scene/akar-icons:plus` — 24 viewBox, stroke 2, scaled to 20px or 16px. */
function AddPlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 20V12M12 12V4M12 12H20M12 12H4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const ADD_SIZES = ["default", "mobile"] as const;
export type AddSize = (typeof ADD_SIZES)[number];

export type AddProps = Omit<React.ComponentProps<"button">, "children"> &
  VariantProps<typeof addButtonVariants>;

export function Add({
  size = "default",
  className,
  type = "button",
  disabled,
  "aria-label": ariaLabel = "Add",
  ...props
}: AddProps) {
  const resolvedSize = size ?? "default";

  return (
    <button
      type={type}
      data-slot="add"
      data-size={resolvedSize}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        addButtonVariants({ size: resolvedSize }),
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
      {...props}
    >
      <AddPlusIcon className={addIconVariants({ size: resolvedSize })} />
    </button>
  );
}
