import Image from "next/image";

import { Buttons } from "@/components/common/general/button/buttons";
import { cn } from "@/lib/utils";

import { avatarBorderClass, type PublicVariantProps } from "./types";
import { VerifiedIcon } from "./verified-icon";

export function PublicVariant({
  avatarSrc,
  displayName,
  showVerified,
  followersCount,
  aiModelsCount,
  interactionsCount,
  followLabel,
  followingLabel,
  isFollowing,
  chatLabel,
  chatIconSrc,
  onFollow,
  onChat,
}: PublicVariantProps) {
  return (
    <div className="flex w-full max-w-full min-w-0 items-start gap-2 md:max-w-[816px] md:gap-0">
      <div
        className={cn(
          "relative h-[105px] w-[105px] shrink-0 overflow-hidden rounded-full md:h-[170px] md:w-[170px]",
          avatarBorderClass,
        )}
      >
        <Image
          src={avatarSrc}
          alt={displayName}
          fill
          sizes="(max-width: 767px) 105px, 170px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-3 pl-2 md:h-[170px] md:justify-end md:pb-6 md:pl-4">
        <div className="flex items-start gap-1 md:items-center">
          {showVerified ? <VerifiedIcon /> : null}

          <h1 className="text-tooltip-text text-[24px] leading-6 font-bold md:text-[30px] md:leading-[30px]">
            {displayName}
          </h1>
        </div>

        <div className="text-cookie-bg flex flex-wrap items-center gap-2 text-sm leading-5 md:gap-4">
          <span>
            <b>{followersCount}</b>
            <span className="text-divider-label font-medium"> followers</span>
          </span>
          <span>
            <b>{aiModelsCount}</b>
            <span className="text-divider-label font-medium"> AI Models</span>
          </span>
          <span>
            <b>{interactionsCount}</b>
            <span className="text-divider-label font-medium"> interactions</span>
          </span>
        </div>

        <div className="flex w-full min-w-0 items-start gap-2">
          <Buttons
            type="button"
            variant={isFollowing ? "neutral" : "light-grey"}
            size="btn-s"
            leftIcon={false}
            rightIcon={false}
            label={isFollowing ? followingLabel : followLabel}
            onClick={onFollow}
            className="min-w-0 flex-1 md:flex-none md:shrink-0"
          />
          <Buttons
            type="button"
            variant="rose"
            size="btn-s"
            leftIcon
            rightIcon={false}
            leftIconSrc={chatIconSrc}
            label={chatLabel}
            onClick={onChat}
            className="min-w-0 flex-1 md:flex-none md:shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
