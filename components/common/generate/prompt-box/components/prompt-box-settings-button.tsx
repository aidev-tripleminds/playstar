"use client";

import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { PROMPT_BOX_SETTINGS_ICON_SRC } from "../prompt-box.constants";

export type PromptBoxSettingsButtonProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "children" | "size" | "variant"
> & {
  iconSrc?: string;
};

export function PromptBoxSettingsButton({
  iconSrc = PROMPT_BOX_SETTINGS_ICON_SRC,
  className,
  type = "button",
  "aria-label": ariaLabel = "Settings",
  ...props
}: PromptBoxSettingsButtonProps) {
  return (
    <Button
      type={type}
      variant="ghost"
      disableActiveEffect
      data-slot="prompt-box-settings-button"
      aria-label={ariaLabel}
      className={cn(
        "size-11 min-h-0 shrink-0 rounded-full border border-[#262626] bg-[#171717] p-3",
        "hover:bg-[#171717] dark:hover:bg-[#171717]",
        "focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <Image
        src={iconSrc}
        alt=""
        aria-hidden
        width={20}
        height={20}
        className="size-5 shrink-0 object-contain opacity-80"
      />
    </Button>
  );
}
