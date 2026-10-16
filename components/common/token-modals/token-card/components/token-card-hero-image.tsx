"use client";

import type { StaticImageData } from "next/image";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { TOKEN_CARD_COINS_TOKEN_PATH, TOKEN_CARD_DEFAULT_HERO_PATH } from "../token-card.constants";

export type TokenCardHeroImageProps = {
  src?: string | StaticImageData;
  alt: string;
  className?: string;
  imageClassName?: string;
};

export function TokenCardHeroImage({
  src = TOKEN_CARD_DEFAULT_HERO_PATH,
  alt,
  className,
  imageClassName,
}: TokenCardHeroImageProps) {
  return (
    <div
      data-slot="token-card-hero-image"
      className={cn("absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="250px"
        className={cn("object-cover object-center", imageClassName)}
      />
      <Image
        alt=""
        src={TOKEN_CARD_COINS_TOKEN_PATH}
        width={240}
        height={240}
        className="cointoken absolute top-1/2 -z-10 w-full -translate-y-[45%]"
      />
    </div>
  );
}
