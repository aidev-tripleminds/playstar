import Image from "next/image";

import { Buttons } from "@/components/common/general/button/buttons";
import { Spinner } from "@/components/common/general/spinner";
import { cn } from "@/lib/utils";

import { avatarBorderClass, type BannerVariantProps } from "./types";

export function BannerVariant({
  status,
  coverImageSrc,
  avatarSrc,
  displayName,
  followLabel,
  followingLabel,
  isFollowing,
  createPostLabel,
  createPostIconSrc,
  onFollow,
  onCreatePost,
}: BannerVariantProps) {
  const isLoading = status === "loading";
  const isEdit = status === "edit" || isLoading;

  return (
    <div className="flex w-full max-w-full min-w-0 flex-col items-start md:max-w-[816px]">
      <div className="relative h-[115px] w-full min-w-0 overflow-hidden md:h-[240px] md:rounded-[16px]">
        {isLoading ? (
          <div
            className="absolute inset-0"
            style={{ background: "var(--cover-skeleton-gradient)" }}
          />
        ) : (
          <Image
            src={coverImageSrc}
            alt=""
            fill
            sizes="(max-width: 767px) 100vw, 816px"
            className="object-cover"
          />
        )}
        {isLoading ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner className="size-6 md:size-8" />
          </span>
        ) : null}
      </div>

      <div className="relative -mt-[45px] flex w-full min-w-0 items-end justify-between gap-0 px-4 md:-mt-[85px] md:px-6">
        <div
          className={cn(
            "relative box-border h-[130px] w-[130px] shrink-0 overflow-hidden rounded-full md:h-[170px] md:w-[170px]",
            avatarBorderClass,
          )}
        >
          {isLoading ? (
            <>
              <div
                className="absolute inset-0"
                style={{ background: "var(--cover-skeleton-gradient)" }}
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <Spinner className="size-6 md:size-8" />
              </span>
            </>
          ) : (
            <Image
              src={avatarSrc}
              alt={displayName}
              fill
              sizes="(max-width: 767px) 130px, 170px"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-end justify-end pb-6 pl-2 md:pl-4">
          <Buttons
            type="button"
            variant={isFollowing ? "neutral" : "light-grey"}
            size="btn-s"
            leftIcon={isEdit}
            rightIcon={false}
            leftIconSrc={isEdit ? createPostIconSrc : undefined}
            label={isEdit ? createPostLabel : isFollowing ? followingLabel : followLabel}
            onClick={isEdit ? onCreatePost : onFollow}
            className="max-w-full shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
