"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";
import { HeartIcon } from "@/public/assets/icons/heart";

import type { PostCardFooterProps } from "../types";

export function PostCardFooter({
  chatLabel = "Chat",
  shareLabel = "Share",
  onLike,
  onChat,
  onShare,
  className,
}: PostCardFooterProps) {
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <footer
      data-slot="post-card-footer"
      className={cn("relative z-[0] flex items-center gap-4 text-right text-sm", className)}
    >
      <button
        type="button"
        aria-label={isLiked ? "Unlike post" : "Like post"}
        aria-pressed={isLiked}
        onClick={() => {
          setIsLiked((prev) => !prev);
          onLike?.();
        }}
        className="flex items-center justify-center transition-opacity"
      >
        <HeartIcon
          filled={isLiked}
          fillColor="var(--brand-primary)"
          strokeColor={isLiked ? "var(--brand-primary)" : "var(--tooltip-text)"}
        />
      </button>

      <button
        type="button"
        onClick={onChat}
        className="text-tooltip-text inline-flex items-center gap-1.5 leading-5 font-medium transition-opacity hover:opacity-80"
      >
        <Image
          src="/assets/ai-chat-outline.svg"
          alt=""
          width={24}
          height={24}
          className="object-cover"
        />
        <span className="leading-5 font-medium">{chatLabel}</span>
      </button>

      <button
        type="button"
        onClick={onShare}
        className="text-tooltip-text inline-flex items-center gap-1.5 leading-5 font-medium transition-opacity hover:opacity-80"
      >
        <Image src="/assets/share.svg" alt="" width={24} height={24} className="object-cover" />
        <span className="leading-5 font-medium">{shareLabel}</span>
      </button>
    </footer>
  );
}
