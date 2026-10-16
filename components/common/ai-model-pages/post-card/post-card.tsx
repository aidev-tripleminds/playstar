"use client";

import Image from "next/image";
import * as React from "react";

import { DotOption } from "@/components/common/ai-model-pages/dot-option/dot-option";
import { resolveAsset } from "@/lib/assets/asset-store";
import { cn } from "@/lib/utils";

import { PostCardFooter } from "./components/post-card-footer";
import { PostCardMedia } from "./components/postcard-media";
import { postCardMenuItems } from "./constants";
import type { PostCardProps } from "./types";
import { postCardVariants } from "./variants";

export { PostCardFooter } from "./components/post-card-footer";
export { PostCardMedia } from "./components/postcard-media";
export { postCardMenuItems } from "./constants";
export type {
  PostCardFooterProps,
  PostCardMediaProps,
  PostCardMediaRatio,
  PostCardProps,
} from "./types";
export { mediaVariants, postCardVariants } from "./variants";

export function PostCard({
  ratio = "default",
  avatarSrc = resolveAsset("demo_pics_profile_pic").image ?? "",
  displayName = "Miranda Ming",
  handle = "@mirandaming",
  showVerified = false,
  date = "23 sept. 2026",
  body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  mediaSrc = resolveAsset("demo_pics_pexel2").image ?? "",
  mediaAlt = "Post media",
  chatLabel,
  shareLabel,
  onLike,
  onChat,
  onShare,
  onMenu,
  menuItems = postCardMenuItems,
  menuOpen: menuOpenProp,
  defaultMenuOpen = false,
  onMenuOpenChange,
  onMenuAction,
  className,
  ...props
}: PostCardProps) {
  return (
    <article data-slot="post-card" className={cn(postCardVariants(), className)} {...props}>
      <header className="relative z-[3] flex items-start justify-between gap-5 text-white">
        <div className="flex items-center gap-2">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-[99px]">
            <Image src={avatarSrc} alt={displayName} fill className="object-cover" sizes="48px" />
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className="text-base leading-6 font-semibold text-white">
              {displayName}
              {showVerified && (
                <Image
                  src="/assets/verified-badge.svg"
                  alt="Verified"
                  width={16}
                  height={16}
                  className="ml-1 inline-block size-4"
                />
              )}
            </span>
            <span className="text-divider-label text-sm leading-5">{handle}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 text-right">
          <span className="text-divider-label text-sm leading-5">{date}</span>
          <DotOption
            items={menuItems}
            menuOpen={menuOpenProp}
            defaultMenuOpen={defaultMenuOpen}
            onMenuOpenChange={onMenuOpenChange}
            onItemClick={onMenuAction}
            onTriggerClick={onMenu}
            ariaLabel="Post options"
          />
        </div>
      </header>

      {body ? (
        <p className="text-tooltip-text relative z-[2] self-stretch text-sm leading-5 [overflow-wrap:anywhere] md:text-[16px]">
          {body}
        </p>
      ) : null}

      {mediaSrc ? (
        <div className="relative z-[1] self-stretch">
          <PostCardMedia mediaSrc={mediaSrc} mediaAlt={mediaAlt} ratio={ratio ?? "default"} />
        </div>
      ) : null}

      <PostCardFooter
        chatLabel={chatLabel}
        shareLabel={shareLabel}
        onLike={onLike}
        onChat={onChat}
        onShare={onShare}
      />
    </article>
  );
}
