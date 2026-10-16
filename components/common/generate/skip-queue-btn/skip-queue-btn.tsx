"use client";

import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FLASH_ICON_SRC = "/assets/flash.svg";
const FLASH_QUE_ICON_SRC = "/assets/flash-que.svg";

export type SkipQueueBtnProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "children" | "size" | "variant" | "disabled"
> & {
  "aria-label"?: string;
  disabled?: boolean;
  defaultDisabled?: boolean;
  onDisabledChange?: (disabled: boolean) => void;
};

function SkipQueueEnabledIcon({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("size-5 shrink-0 bg-[image:var(--gradient-rose)]", className)}
      style={{
        WebkitMaskImage: `url(${FLASH_QUE_ICON_SRC})`,
        maskImage: `url(${FLASH_QUE_ICON_SRC})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}

function SkipQueueDisabledIcon({ className }: { className?: string }) {
  return (
    <Image
      src={FLASH_ICON_SRC}
      alt=""
      aria-hidden
      width={20}
      height={20}
      className={cn("size-5 shrink-0 object-contain", className)}
    />
  );
}

export function SkipQueueBtn({
  disabled: disabledProp,
  defaultDisabled = false,
  onDisabledChange,
  className,
  type = "button",
  onClick,
  "aria-label": ariaLabel = "Skip queue",
  ...props
}: SkipQueueBtnProps) {
  const [internalDisabled, setInternalDisabled] = React.useState(defaultDisabled);
  const isDisabled = disabledProp ?? internalDisabled;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) return;

    const nextDisabled = !isDisabled;

    if (disabledProp === undefined) {
      setInternalDisabled(nextDisabled);
    }
    onDisabledChange?.(nextDisabled);
  };

  return (
    <Button
      type={type}
      variant="ghost"
      disableActiveEffect
      data-slot="skip-queue-btn"
      data-state={isDisabled ? "disabled" : "enabled"}
      aria-pressed={!isDisabled}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={cn(
        "size-11 min-h-0 shrink-0 rounded-[32px] border p-3",
        "bg-select-trigger-bg hover:bg-select-trigger-bg dark:hover:bg-select-trigger-bg",
        "focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:outline-none",
        "disabled:opacity-100",
        isDisabled ? "border-border-strong" : "border-border-brand",
        className,
      )}
      {...props}
    >
      {isDisabled ? <SkipQueueDisabledIcon /> : <SkipQueueEnabledIcon />}
    </Button>
  );
}
