import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, SettingsOutlineIcon } from "@/public/assets/icons";

export const PROMPT_CHATBAR_SEND_TOKEN_COST = "0.2";
export const PROMPT_CHATBAR_TOKEN_ICON_SRC = "/assets/spice-coin.png";

const TOKEN_PILL_CLASS =
  "bg-[linear-gradient(180deg,rgba(234,179,8,0.06)_0%,rgba(234,179,8,0.2)_100%)]";

const ROSE_BUTTON_CLASS =
  "text-tooltip-text bg-[image:var(--gradient-rose)] hover:bg-[image:var(--gradient-rose)] dark:hover:bg-[image:var(--gradient-rose)]";

export type PromptChatbarSendProps = Omit<React.ComponentProps<"button">, "children"> & {
  sendLabel?: string;
  settingsLabel?: string;
  tokenCost?: string;
  showTokenCost?: boolean;
  onSettingsClick?: () => void;
};

export function PromptChatbarSend({
  sendLabel = "Send message",
  settingsLabel = "Advanced settings",
  tokenCost = PROMPT_CHATBAR_SEND_TOKEN_COST,
  showTokenCost = true,
  onSettingsClick,
  className,
  type = "button",
  ...props
}: PromptChatbarSendProps) {
  return (
    <div
      data-slot="prompt-chatbar-send-cluster"
      className={cn("flex shrink-0 items-center gap-2", className)}
    >
      <Button
        type="button"
        variant="ghost"
        disableActiveEffect
        data-slot="prompt-chatbar-settings"
        aria-label={settingsLabel}
        onClick={onSettingsClick}
        className={cn(
          "size-11 min-h-0 shrink-0 rounded-full border border-[#262626] bg-[#171717] p-3",
          "hover:bg-[#171717] dark:hover:bg-[#171717]",
          "focus-visible:ring-brand-primary focus-visible:ring-2 focus-visible:outline-none",
        )}
      >
        <SettingsOutlineIcon className="size-5 shrink-0 text-[#fafafa]" aria-hidden />
      </Button>

      <div
        data-slot="prompt-chatbar-send-action"
        className={cn(
          "inline-flex shrink-0 items-center rounded-full",
          showTokenCost && TOKEN_PILL_CLASS,
        )}
      >
        {showTokenCost ? (
          <span
            data-slot="prompt-chatbar-token-cost"
            className="inline-flex items-center gap-1.5 py-0 pr-2 pl-3"
          >
            <Image
              src={PROMPT_CHATBAR_TOKEN_ICON_SRC}
              alt=""
              aria-hidden
              width={16}
              height={16}
              className="size-4 shrink-0 object-contain"
            />
            <span className="text-tooltip-text text-sm leading-5 font-medium">{tokenCost}</span>
          </span>
        ) : null}
        <button
          type={type}
          data-slot="prompt-chatbar-send"
          aria-label={sendLabel}
          className={cn(
            "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-[28px] p-3",
            "shadow-[0_0_5px_rgba(0,0,0,0.25)]",
            "transition-opacity hover:opacity-90",
            "focus-visible:ring-border-focus focus-visible:ring-2 focus-visible:outline-none",
            "disabled:pointer-events-none disabled:opacity-50",
            ROSE_BUTTON_CLASS,
          )}
          {...props}
        >
          <ArrowRightIcon className="size-5 shrink-0 -rotate-90" aria-hidden />
        </button>
      </div>
    </div>
  );
}
