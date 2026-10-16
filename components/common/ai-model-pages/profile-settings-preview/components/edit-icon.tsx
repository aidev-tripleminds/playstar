import Image from "next/image";

import { cn } from "@/lib/utils";

import type { EditIconButtonProps } from "../types";

export default function EditIconButton({
  ariaLabel,
  onClick,
  isActive,
  disabled = false,
  className,
}: EditIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-full p-2 transition-colors",
        "bg-tooltip-default-bg border-surface-strong border",
        isActive ? "bg-surface-strong" : "hover:bg-surface-strong",
        disabled && "hover:bg-tooltip-default-bg cursor-not-allowed opacity-70",
        className,
      )}
    >
      <Image
        src="/assets/edit.svg"
        width={20}
        height={20}
        className="cursor-pointer object-cover"
        alt=""
      />
    </button>
  );
}
