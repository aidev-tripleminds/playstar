import type { StaticImageData } from "next/image";
import Image from "next/image";
import React from "react";

import { UserAIIcon } from "@/public/assets/icons";

export function isStaticImageData(value: unknown): value is StaticImageData {
  return (
    typeof value === "object" &&
    value !== null &&
    "src" in value &&
    "height" in value &&
    "width" in value
  );
}

export function isNextImageSrc(
  value: string | StaticImageData | React.ReactNode,
): value is string | StaticImageData {
  return typeof value === "string" || isStaticImageData(value);
}

/** Presigned gallery URLs must skip next/image optimization or they 403. */
export function isRemoteImageSrc(src: string | StaticImageData | undefined): boolean {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

export function MediaPreviewEmptyIcon({
  emptyIconSrc,
}: {
  emptyIconSrc?: string | StaticImageData | React.ReactNode;
}) {
  if (!emptyIconSrc) {
    return <UserAIIcon className="text-divider-label size-4 shrink-0" />;
  }

  if (React.isValidElement(emptyIconSrc)) {
    return emptyIconSrc;
  }

  if (isNextImageSrc(emptyIconSrc)) {
    return (
      <Image
        src={emptyIconSrc}
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0 object-contain"
      />
    );
  }

  return <UserAIIcon className="size-4 shrink-0" />;
}
