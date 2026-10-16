"use client";

import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "@/public/assets/icons/sparkles-icon";

import {
  PROMPT_BOX_CROWN_ICON_SRC,
  PROMPT_BOX_DEFAULT_TOKEN_COST,
  PROMPT_BOX_TOKEN_ICON_SRC,
  PROMPT_BOX_UPGRADE_LABEL,
} from "../prompt-box.constants";

export type PromptBoxGenerateActionVariant = "tokens" | "usage" | "upgrade";

export type PromptBoxGenerateActionProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "size" | "variant"
> & {
  tokenCost?: React.ReactNode;
  tokenIconSrc?: string;
  generateLabel?: string;
  /** `tokens` = coin cost, `usage` = FREE, `upgrade` = crown + generate sparkles. */
  variant?: PromptBoxGenerateActionVariant;
  /**
   * Mobile compact bar (Figma `16127:36747`): 18px coin, stronger gold pill,
   * and a 44px generate button.
   */
  compact?: boolean;
};

const TOKEN_PILL_CLASS =
  "bg-[linear-gradient(180deg,rgba(234,179,8,0.06)_0%,rgba(234,179,8,0.2)_100%)]";

/** Figma compact token pill — gold from 15% to 50%. */
const COMPACT_TOKEN_PILL_CLASS =
  "bg-[linear-gradient(180deg,rgba(234,179,8,0.15)_0%,rgba(234,179,8,0.5)_100%)]";

const PILL_CLASS: Record<PromptBoxGenerateActionVariant, string> = {
  tokens: TOKEN_PILL_CLASS,
  usage: "bg-[image:var(--gradient-action-premium-border)]",
  upgrade: TOKEN_PILL_CLASS,
};

const LABEL_CLASS: Record<Exclude<PromptBoxGenerateActionVariant, "upgrade">, string> = {
  tokens: "text-tooltip-text",
  usage: "text-tokens-gradient",
};

const ROSE_BUTTON_CLASS =
  "text-tooltip-text bg-[image:var(--gradient-rose)] hover:bg-[image:var(--gradient-rose)] dark:hover:bg-[image:var(--gradient-rose)]";

export function PromptBoxGenerateAction({
  tokenCost,
  tokenIconSrc = PROMPT_BOX_TOKEN_ICON_SRC,
  generateLabel,
  variant = "tokens",
  compact = false,
  className,
  type = "button",
  onClick,
  disabled,
  ...props
}: PromptBoxGenerateActionProps) {
  const isUpgrade = variant === "upgrade";
  const resolvedTokenCost =
    tokenCost ?? (isUpgrade ? PROMPT_BOX_UPGRADE_LABEL : PROMPT_BOX_DEFAULT_TOKEN_COST);
  const resolvedGenerateLabel =
    generateLabel ?? (isUpgrade ? PROMPT_BOX_UPGRADE_LABEL : "Generate");
  const showTokenIcon = variant === "tokens";
  const handleClick = disabled ? undefined : onClick;

  return (
    <div
      data-slot="prompt-box-generate-action"
      data-variant={variant}
      className={cn(
        "inline-flex shrink-0 cursor-pointer! items-center rounded-full",
        PILL_CLASS[variant],
        compact && variant !== "usage" && COMPACT_TOKEN_PILL_CLASS,
        className,
      )}
      onClick={handleClick as React.MouseEventHandler<HTMLDivElement> | undefined}
    >
      <span className="inline-flex items-center gap-1.5 py-0 pr-2 pl-3">
        {showTokenIcon ? (
          <Image
            src={tokenIconSrc}
            alt=""
            aria-hidden
            width={compact ? 18 : 16}
            height={compact ? 18 : 16}
            className={cn("shrink-0 object-contain", compact ? "size-[18px]" : "size-4")}
          />
        ) : null}
        {isUpgrade ? (
          <Image
            src={PROMPT_BOX_CROWN_ICON_SRC}
            alt=""
            aria-hidden
            width={20}
            height={20}
            className="size-5 shrink-0 object-contain"
          />
        ) : (
          <span className={cn("text-sm leading-5 font-medium", LABEL_CLASS[variant])}>
            {resolvedTokenCost}
          </span>
        )}
      </span>

      <Button
        type={type}
        variant="ghost"
        disableActiveEffect
        data-slot="prompt-box-generate-button"
        aria-label={resolvedGenerateLabel}
        disabled={disabled}
        className={cn(
          "size-auto min-h-0 shrink-0 rounded-[28px] p-3",
          compact && "size-11 border-0 p-0",
          "shadow-[0px_0px_5px_rgba(0,0,0,0.25)]",
          "hover:opacity-90",
          "hover:bg-transparent",
          "focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:outline-none",
          ROSE_BUTTON_CLASS,
        )}
        {...props}
        onClick={(event) => {
          event.stopPropagation();
          handleClick?.(event);
        }}
      >
        <SparklesIcon className="size-5 shrink-0 text-[#fafafa]" />
      </Button>
    </div>
  );
}
