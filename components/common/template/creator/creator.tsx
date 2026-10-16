"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { cn } from "@/lib/utils";

import {
  CREATOR_AVATAR_FRAME_CLASS_BY_SIZE,
  CREATOR_AVATAR_INNER_CLASS,
  CREATOR_AVATAR_SIZE_PX,
  CREATOR_BG_CLASS,
  CREATOR_BORDER_RADIUS_CLASS,
  CREATOR_CONTENT_CLASS_BY_SIZE,
  CREATOR_DEFAULT_FOLLOW_LABEL,
  CREATOR_DEFAULT_FOLLOWERS,
  CREATOR_DEFAULT_FOLLOWING_LABEL,
  CREATOR_DEFAULT_IMAGE_SRC,
  CREATOR_DEFAULT_INTERACTIONS,
  CREATOR_DEFAULT_NAME,
  CREATOR_FOLLOW_BUTTON_CLASS_BY_SIZE,
  CREATOR_FOLLOW_BUTTON_SIZE_BY_SIZE,
  CREATOR_NAME_CLASS_BY_SIZE,
  CREATOR_ROOT_CLASS_BY_SIZE,
  CREATOR_STATS_CLASS,
  type CreatorSize,
} from "./creator.constants";
import { useCreatorSize } from "./use-creator-size";

export type CreatorProps = Omit<React.ComponentProps<"article">, "children"> & {
  size?: CreatorSize;
  name?: string;
  interactionsCount?: string;
  followersCount?: string;
  imageSrc?: string;
  imageAlt?: string;
  followLabel?: string;
  followingLabel?: string;
  isFollowing?: boolean;
  onFollowClick?: React.ComponentProps<typeof Buttons>["onClick"];
};

export function Creator({
  size,
  name = CREATOR_DEFAULT_NAME,
  interactionsCount = CREATOR_DEFAULT_INTERACTIONS,
  followersCount = CREATOR_DEFAULT_FOLLOWERS,
  imageSrc = CREATOR_DEFAULT_IMAGE_SRC,
  imageAlt,
  followLabel = CREATOR_DEFAULT_FOLLOW_LABEL,
  followingLabel = CREATOR_DEFAULT_FOLLOWING_LABEL,
  isFollowing = false,
  onFollowClick,
  className,
  ...props
}: CreatorProps) {
  const resolvedSize = useCreatorSize(size);
  const avatarSize = CREATOR_AVATAR_SIZE_PX[resolvedSize];
  const showFollowers = resolvedSize === "desktop";

  return (
    <article
      data-slot="creator"
      data-size={resolvedSize}
      className={cn(
        "flex w-full items-center",
        CREATOR_BG_CLASS,
        CREATOR_BORDER_RADIUS_CLASS,
        CREATOR_ROOT_CLASS_BY_SIZE[resolvedSize],
        className,
      )}
      {...props}
    >
      <div data-slot="creator-avatar" className={CREATOR_AVATAR_FRAME_CLASS_BY_SIZE[resolvedSize]}>
        <Image
          src={imageSrc}
          alt={imageAlt ?? name}
          width={avatarSize}
          height={avatarSize}
          className={cn(CREATOR_AVATAR_INNER_CLASS, "h-full w-full object-cover")}
        />
      </div>

      <div className={CREATOR_CONTENT_CLASS_BY_SIZE[resolvedSize]}>
        <p data-slot="creator-name" className={CREATOR_NAME_CLASS_BY_SIZE[resolvedSize]}>
          {name}
        </p>
        <p data-slot="creator-stats" className={CREATOR_STATS_CLASS}>
          {interactionsCount}
          {showFollowers ? ` • ${followersCount}` : null}
        </p>
      </div>

      <Buttons
        data-slot="creator-follow"
        type="button"
        variant={isFollowing ? "neutral-hover" : "neutral2"}
        size={CREATOR_FOLLOW_BUTTON_SIZE_BY_SIZE[resolvedSize]}
        leftIcon={false}
        rightIcon={false}
        label={isFollowing ? followingLabel : followLabel}
        className={CREATOR_FOLLOW_BUTTON_CLASS_BY_SIZE[resolvedSize]}
        onClick={onFollowClick}
      />
    </article>
  );
}
