"use client";

import { dummyImage } from "@/lib/dummy-images";
import { cn } from "@/lib/utils";

import {
  type AiModelHeaderProps,
  type BannerHeaderStatus,
  BannerVariant,
  PublicVariant,
} from "./variants";

export type { AiModelHeaderProps, AiModelHeaderStatus } from "./variants";

export function AiModelHeader({
  status = "default",
  coverImageSrc = dummyImage(3),
  avatarSrc = dummyImage(4),
  displayName = "Valentina",
  showVerified = true,
  followersCount = "30.3K",
  aiModelsCount = "30",
  interactionsCount = "1.5M",
  followLabel = "Follow",
  followingLabel = "Unfollow",
  isFollowing = false,
  createPostLabel = "Create a Post",
  chatLabel = "Chat",
  onFollow,
  onCreatePost,
  onChat,
  className,
  ...props
}: AiModelHeaderProps) {
  const isPublic = status === "public";
  const bannerStatus: BannerHeaderStatus = status === "public" ? "default" : status;

  return (
    <header
      data-slot="ai-model-header"
      data-status={status}
      className={cn(
        "text-tooltip-default-bg relative w-full min-w-0 overflow-hidden font-[Onest] text-sm",
        className,
      )}
      {...props}
    >
      {isPublic ? (
        <PublicVariant
          avatarSrc={avatarSrc}
          displayName={displayName}
          showVerified={showVerified}
          followersCount={followersCount}
          aiModelsCount={aiModelsCount}
          interactionsCount={interactionsCount}
          followLabel={followLabel}
          followingLabel={followingLabel}
          isFollowing={isFollowing}
          chatLabel={chatLabel}
          chatIconSrc="/assets/ai-chat-outline.svg"
          onFollow={onFollow}
          onChat={onChat}
        />
      ) : (
        <BannerVariant
          status={bannerStatus}
          coverImageSrc={coverImageSrc}
          avatarSrc={avatarSrc}
          displayName={displayName}
          followLabel={followLabel}
          followingLabel={followingLabel}
          isFollowing={isFollowing}
          createPostLabel={createPostLabel}
          createPostIconSrc="/assets/add.svg"
          onFollow={onFollow}
          onCreatePost={onCreatePost}
        />
      )}
    </header>
  );
}
