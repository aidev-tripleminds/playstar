import type * as React from "react";

export type AiModelHeaderStatus = "default" | "edit" | "loading" | "public";
export type BannerHeaderStatus = "default" | "edit" | "loading";

export const avatarBorderClass =
  "border-[3px] border-transparent [background-image:var(--cover-skeleton-gradient),var(--avatar-border-gradient)] [background-clip:padding-box,border-box] [background-origin:border-box]";

export type BannerVariantProps = {
  status: BannerHeaderStatus;
  coverImageSrc: string;
  avatarSrc: string;
  displayName: string;
  followLabel: string;
  followingLabel: string;
  isFollowing: boolean;
  createPostLabel: string;
  createPostIconSrc?: string;
  onFollow?: () => void;
  onCreatePost?: () => void;
};

export type PublicVariantProps = {
  avatarSrc: string;
  displayName: string;
  showVerified: boolean;
  followersCount: string;
  aiModelsCount: string;
  interactionsCount: string;
  followLabel: string;
  followingLabel: string;
  isFollowing: boolean;
  chatLabel: string;
  chatIconSrc?: string;
  onFollow?: () => void;
  onChat?: () => void;
};

export type AiModelHeaderProps = React.ComponentProps<"header"> & {
  status?: AiModelHeaderStatus;
  coverImageSrc?: string;
  avatarSrc?: string;
  displayName?: string;
  showVerified?: boolean;
  followersCount?: string;
  aiModelsCount?: string;
  interactionsCount?: string;
  followLabel?: string;
  followingLabel?: string;
  isFollowing?: boolean;
  createPostLabel?: string;
  chatLabel?: string;
  onFollow?: () => void;
  onCreatePost?: () => void;
  onChat?: () => void;
};
