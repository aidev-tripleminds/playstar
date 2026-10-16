"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export type VideoPromptTextProps = Omit<React.ComponentProps<"div">, "children"> & {
  prompt?: string;
  clapperIconSrc?: string;
  dismissIconSrc?: string;
  showDismiss?: boolean;
  dismissLabel?: string;
  onDismiss?: () => void;
};

export function VideoPromptText({
  prompt = "Show me a video of you taking a selfie",
  clapperIconSrc = "/assets/clapper-board.svg",
  dismissIconSrc = "/assets/cross-icon.svg",
  showDismiss = true,
  dismissLabel = "Remove video prompt",
  onDismiss,
  className,
  ...props
}: VideoPromptTextProps) {
  return (
    <div
      data-slot="video-prompt-text"
      className={cn(
        "inline-flex h-7 max-w-full items-center gap-1 rounded-2xl border px-2 py-1.5",
        "border-border-focus bg-surface-strong",
        className,
      )}
      {...props}
    >
      <Image
        src={clapperIconSrc}
        alt=""
        aria-hidden
        width={16}
        height={16}
        className="size-4 shrink-0 object-contain"
      />
      <p className="text-tooltip-text min-w-0 text-sm leading-4 font-normal [overflow-wrap:anywhere]">
        {prompt}
      </p>
      {showDismiss ? (
        <button
          type="button"
          data-slot="video-prompt-text-dismiss"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className={cn(
            "text-divider-label shrink-0 cursor-pointer rounded-sm p-0.5",
            "transition-opacity",
            "focus-visible:ring-border-focus focus-visible:ring-2 focus-visible:outline-none",
          )}
        >
          <Image
            src={dismissIconSrc}
            alt=""
            aria-hidden
            width={12}
            height={12}
            className="size-3 object-contain opacity-70"
          />
        </button>
      ) : null}
    </div>
  );
}
