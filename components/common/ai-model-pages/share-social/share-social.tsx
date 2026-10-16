import Image, { type StaticImageData } from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export type ShareSocialProps = React.ComponentProps<"div"> & {
  label: string;
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
  dark?: boolean;
  imageClassName?: string;
};

export function ShareSocial({
  label,
  imageSrc = "/assets/fb-icon.svg",
  imageAlt = "",
  dark = true,
  className,
  imageClassName,
  ...props
}: ShareSocialProps) {
  return (
    <div
      data-slot="share-social"
      className={cn(
        "flex w-full flex-col items-center gap-[6px] text-center font-[Onest]",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "relative inline-block size-[60px] overflow-hidden rounded-full",
          imageClassName,
        )}
      >
        <Image src={imageSrc} alt={imageAlt} fill sizes="60px" className="object-cover" />
      </span>

      <p
        className={cn(
          "w-full text-[10px] leading-4 font-medium",
          dark ? "text-tooltip-text" : "text-tooltip-default-bg",
        )}
      >
        {label}
      </p>
    </div>
  );
}
