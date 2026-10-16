"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { cn } from "@/lib/utils";

import { aiModelShowOnHoverVariants } from "../ai-model.shared";

export type AiModelActionButtonProps = Omit<
  React.ComponentProps<typeof Buttons>,
  "label" | "variant" | "size" | "leftIcon" | "rightIcon"
> & {
  label: string;
  leftIconSrc?: string;
  showOnHover?: boolean;
};

export function AiModelActionButton({
  label,
  leftIconSrc,
  showOnHover = true,
  className,
  onClick,
  ...props
}: AiModelActionButtonProps) {
  const hasLeftIcon = Boolean(leftIconSrc);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick?.(event);
  };

  return (
    <Buttons
      type="button"
      variant="rose"
      size="btn-s"
      label={label}
      leftIcon={hasLeftIcon}
      rightIcon={false}
      leftIconSrc={leftIconSrc}
      leftIconSizeClassName="h-4! w-4!"
      disableActiveEffect
      data-slot="ai-model-action-button"
      aria-label={label}
      className={cn(
        "h-auto! w-auto! border-0 py-3! font-semibold shadow-none",
        hasLeftIcon ? "gap-1.5 px-4.5!" : "px-3!",
        aiModelShowOnHoverVariants({ enabled: showOnHover }),
        className,
      )}
      onClick={handleClick}
      {...props}
    />
  );
}
