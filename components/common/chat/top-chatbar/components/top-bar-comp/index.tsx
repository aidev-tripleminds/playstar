import Image from "next/image";
import * as React from "react";

import { dummyImage } from "@/lib/dummy-images";
import { cn } from "@/lib/utils";

export const DEFAULT_MEMBER_AVATARS = [
  dummyImage(104),
  dummyImage(105),
  dummyImage(106),
] as const;

export function ChatbarIconButton({
  label,
  onClick,
  className,
  children,
  ref,
  disabled = false,
}: {
  ref?: React.Ref<HTMLButtonElement>;
  label: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-6 shrink-0 cursor-pointer items-center justify-center transition-opacity",
        "focus-visible:ring-border-focus focus-visible:ring-2 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-70",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TopChatbarAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="border-tooltip-default-bg bg-border-strong relative size-9 shrink-0 overflow-hidden rounded-full border">
      {src ? <Image src={src} alt={alt} fill sizes="36px" className="object-cover" /> : null}
    </span>
  );
}

export function TopChatbarAvatarStack({
  avatars,
  alt,
}: {
  avatars: readonly string[];
  alt: string;
}) {
  return (
    <span data-slot="top-chatbar-avatar-stack" className="inline-flex shrink-0 items-center">
      {avatars.map((src, index) => (
        <span
          key={`${src}-${index}`}
          className={cn(
            "border-tooltip-default-bg bg-border-strong relative size-9 overflow-hidden rounded-full border",
            index > 0 && "-ml-1.5",
          )}
          style={{ zIndex: avatars.length - index }}
        >
          {src ? (
            <Image
              src={src}
              alt={index === 0 ? alt : ""}
              fill
              sizes="28px"
              className="object-cover"
            />
          ) : null}
        </span>
      ))}
    </span>
  );
}
