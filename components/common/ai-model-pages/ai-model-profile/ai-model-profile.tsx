"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { dummyImage } from "@/lib/dummy-images";
import { cn } from "@/lib/utils";

import { Buttons } from "../../general/button/buttons";

const profileVariants = cva(
  "relative flex min-w-[300px] flex-col items-start justify-end overflow-hidden rounded-[16px] bg-cover bg-top bg-no-repeat text-center ",
);

export type AiModelProfileProps = React.ComponentProps<"article"> &
  VariantProps<typeof profileVariants> & {
    coverImageSrc?: string;
    avatarSrc?: string;
    displayName?: string;
    handle?: string;
    showVerified?: boolean;
    followLabel?: string;
    followingLabel?: string;
    isFollowing?: boolean;
    onFollow?: () => void;
  };

export function AiModelProfile({
  coverImageSrc = dummyImage(5),
  avatarSrc = dummyImage(6),
  displayName = "Valentina",
  handle = "ai/@sexyvalentina",
  showVerified = true,
  followLabel = "Follow",
  followingLabel = "Unfollow",
  isFollowing = false,
  onFollow,
  className,
  ...props
}: AiModelProfileProps) {
  return (
    <article
      data-slot="ai-model-profile"
      className={cn(profileVariants(), className)}
      style={{ backgroundImage: `url(${coverImageSrc})` }}
      {...props}
    >
      <div className="flex w-full flex-col items-end px-4 pt-3 pb-5">
        <Buttons
          type="button"
          variant={isFollowing ? "neutral" : "light-grey"}
          size="btn-s"
          leftIcon={false}
          rightIcon={false}
          label={isFollowing ? followingLabel : followLabel}
          onClick={onFollow}
        />
      </div>

      <div
        className="text-tooltip-text flex h-16 w-full items-end gap-2 px-4 py-3 text-left"
        style={{
          borderRadius: "0 0 8px 8px",
          backgroundColor: "var(--background-opacity)",
        }}
      >
        <div
          className="border-surface-strong relative h-[100px] w-[100px] shrink-0 overflow-hidden border-[3px]"
          style={{ borderRadius: "89px" }}
        >
          <Image
            src={avatarSrc}
            alt={displayName}
            width={100}
            height={100}
            className="h-[100px] w-[100px] object-cover"
            style={{ borderRadius: "89px" }}
          />
        </div>
        <div className="flex flex-1 shrink-0 flex-col items-start justify-center">
          <div className="flex items-center gap-1">
            {showVerified ? (
              <span className="flex items-center pt-[1px]">
                <Image
                  src="/assets/verified-badge.svg"
                  alt="Verified"
                  width={16}
                  height={16}
                  className="h-4 w-full object-contain"
                />
              </span>
            ) : null}
            <span className="text-tooltip-text text-sm leading-5 font-semibold">{displayName}</span>
          </div>
          <p className="text-cookie-bg text-left text-sm leading-5">{handle}</p>
        </div>
      </div>
    </article>
  );
}
