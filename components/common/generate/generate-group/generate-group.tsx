"use client";

import Image from "next/image";
import * as React from "react";

import { SkipQueueBtn } from "@/components/common/generate/skip-queue-btn";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "@/public/assets/icons/sparkles-icon";

import {
  GENERATE_GROUP_DEFAULT_LABEL,
  GENERATE_GROUP_DEFAULT_TOKEN_COST,
  GENERATE_GROUP_TOKEN_ICON_SRC,
} from "./generate-group.constants";

export type GenerateGroupProps = Omit<React.ComponentProps<"div">, "children"> & {
  tokenCost?: React.ReactNode;
  tokenIconSrc?: string;
  /** When false, hides the coin icon (used for guest `n/5` / crown states). Defaults to true. */
  showTokenIcon?: boolean;
  generateLabel?: string;
  generateDisabled?: boolean;
  onGenerate?: React.MouseEventHandler<HTMLButtonElement>;
  showSkipQueue?: boolean;
  skipQueueDisabled?: boolean;
  defaultSkipQueueDisabled?: boolean;
  onSkipQueueClick?: React.MouseEventHandler<HTMLButtonElement>;
  onSkipQueueDisabledChange?: (disabled: boolean) => void;
  generateAriaLabel?: string;
  skipQueueAriaLabel?: string;
};

export function GenerateGroup({
  tokenCost = GENERATE_GROUP_DEFAULT_TOKEN_COST,
  tokenIconSrc = GENERATE_GROUP_TOKEN_ICON_SRC,
  showTokenIcon = true,
  generateLabel = GENERATE_GROUP_DEFAULT_LABEL,
  generateDisabled,
  onGenerate,
  showSkipQueue = true,
  skipQueueDisabled,
  defaultSkipQueueDisabled = false,
  onSkipQueueClick,
  onSkipQueueDisabledChange,
  generateAriaLabel,
  skipQueueAriaLabel,
  className,
  ...props
}: GenerateGroupProps) {
  return (
    <div
      data-slot="generate-group"
      className={cn("flex w-full items-center gap-2", className)}
      {...props}
    >
      <div
        data-slot="generate-group-action"
        className={cn(
          "inline-flex min-w-0 flex-1 items-center justify-end rounded-[100px]",
          "bg-[linear-gradient(180deg,rgba(234,179,8,0.06),rgba(234,179,8,0.2)),linear-gradient(#0e0e0e,#0e0e0e)]",
        )}
      >
        <span
          data-slot="generate-group-token"
          className="inline-flex shrink-0 items-center gap-1.5 py-0 pr-2 pl-3"
        >
          {showTokenIcon ? (
            <Image
              src={tokenIconSrc}
              alt=""
              aria-hidden
              width={18}
              height={18}
              className="size-[18px] shrink-0 object-contain"
            />
          ) : null}
          <span
            className={cn(
              "text-sm leading-5 font-medium",
              showTokenIcon ? "text-tooltip-text" : "text-tokens-gradient",
            )}
          >
            {tokenCost}
          </span>
        </span>

        <Button
          type="button"
          variant="ghost"
          disableActiveEffect
          disabled={generateDisabled}
          data-slot="generate-group-generate-button"
          aria-label={generateAriaLabel ?? generateLabel}
          onClick={onGenerate}
          className={cn(
            "size-auto min-h-0 min-w-0 flex-1 gap-1.5 rounded-[28px] border-0 p-3",
            "text-tooltip-text text-sm leading-5 font-medium",
            "bg-[image:var(--gradient-rose)] shadow-[0px_0px_5px_rgba(0,0,0,0.25)]",
            "hover:bg-[image:var(--gradient-rose)] hover:opacity-90 dark:hover:bg-[image:var(--gradient-rose)]",
            "focus-visible:ring-brand-primary hover:text-tooltip-text focus-visible:ring-2 focus-visible:outline-none",
          )}
        >
          <SparklesIcon className="text-tooltip-text hover:text-tooltip-text size-5 shrink-0" />
          <span className="shrink-0 text-nowrap">{generateLabel}</span>
        </Button>
      </div>

      {showSkipQueue ? (
        <SkipQueueBtn
          disabled={skipQueueDisabled}
          defaultDisabled={defaultSkipQueueDisabled}
          onClick={onSkipQueueClick}
          onDisabledChange={onSkipQueueDisabledChange}
          aria-label={skipQueueAriaLabel}
        />
      ) : null}
    </div>
  );
}

export {
  GENERATE_GROUP_DEFAULT_LABEL,
  GENERATE_GROUP_DEFAULT_TOKEN_COST,
  GENERATE_GROUP_TOKEN_ICON_SRC,
} from "./generate-group.constants";
