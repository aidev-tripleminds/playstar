import Image from "next/image";
import * as React from "react";

import { dummyImage } from "@/lib/dummy-images";
import { cn } from "@/lib/utils";

export const SENDER_NAME_DEFAULT_NAME = "Cassy Anderson";
export const SENDER_NAME_DEFAULT_AVATAR_SRC = dummyImage(102);

export type SenderNameProps = {
  name?: string;
  /** When omitted, a neutral placeholder is shown — never a wrong default face. */
  avatarSrc?: string;
  avatarAlt?: string;
  /** When false, only the avatar is shown (e.g. while typing). */
  showName?: boolean;
  className?: string;
};

export function SenderName({
  name = SENDER_NAME_DEFAULT_NAME,
  avatarSrc,
  avatarAlt,
  showName = true,
  className,
}: SenderNameProps) {
  const resolvedAlt = avatarAlt ?? name;

  return (
    <div data-slot="sender-name" className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="border-tooltip-default-bg relative size-6 shrink-0 overflow-hidden rounded-full border">
        {avatarSrc ? (
          <Image src={avatarSrc} alt={resolvedAlt} fill sizes="24px" className="object-cover" />
        ) : (
          <span
            data-slot="sender-name-avatar-placeholder"
            className="bg-surface-strong block size-full"
            aria-hidden
          />
        )}
      </div>
      {showName ? (
        <span className="text-tooltip-text text-[12px] leading-[16px] font-medium">{name}</span>
      ) : null}
    </div>
  );
}
