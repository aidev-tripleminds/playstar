"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

import { type AvatarGroupPersons, DEFAULT_AVATAR_GROUP_SOURCES } from "./constants";

export {
  type AvatarGroupPersons,
  DEFAULT_AVATAR_GROUP_SOURCES,
  resolveAvatarGroupPersons,
} from "./constants";

const PERSON_COUNT: Record<AvatarGroupPersons, number> = {
  "two-person": 2,
  "three-person": 3,
  "four-person": 4,
};

const avatarGroupVariants = cva("overflow-hidden rounded-[12px] shrink-0", {
  variants: {
    persons: {
      "two-person": "flex h-11 w-11",
      "three-person": "flex h-11 w-11 flex-col",
      "four-person": "grid h-11 w-11 grid-cols-2 grid-rows-2",
    },
  },
  defaultVariants: {
    persons: "two-person",
  },
});

type AvatarCellProps = {
  src: string;
  alt: string;
  className?: string;
};

function AvatarCell({ src, alt, className }: AvatarCellProps) {
  return (
    <div className={cn("bg-border-strong relative overflow-hidden", className)}>
      {src ? <Image src={src} alt={alt} fill sizes="44px" className="object-cover" /> : null}
    </div>
  );
}

export type AvatarGroupProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof avatarGroupVariants> & {
    avatars?: readonly string[];
    label?: string;
  };

export function AvatarGroup({
  persons = "two-person",
  avatars = [...DEFAULT_AVATAR_GROUP_SOURCES],
  label = "Group members",
  className,
  ...props
}: AvatarGroupProps) {
  const resolvedPersons: AvatarGroupPersons = persons ?? "two-person";
  const sources = avatars.slice(0, PERSON_COUNT[resolvedPersons]);

  return (
    <div
      role="img"
      aria-label={label}
      data-slot="avatar-group"
      data-persons={resolvedPersons}
      className={cn(avatarGroupVariants({ persons: resolvedPersons }), className)}
      {...props}
    >
      {resolvedPersons === "two-person" && (
        <>
          {sources.map((src, index) => (
            <AvatarCell key={`${src}-${index}`} src={src} alt="" className="h-full flex-1" />
          ))}
        </>
      )}

      {resolvedPersons === "three-person" && (
        <>
          <div className="flex h-1/2 w-full">
            {sources.slice(0, 2).map((src, index) => (
              <AvatarCell key={`${src}-${index}`} src={src} alt="" className="h-full flex-1" />
            ))}
          </div>

          <AvatarCell src={sources[2] ?? sources[0]} alt="" className="h-1/2 w-full" />
        </>
      )}

      {resolvedPersons === "four-person" &&
        sources.map((src, index) => (
          <AvatarCell key={`${src}-${index}`} src={src} alt="" className="h-full w-full" />
        ))}
    </div>
  );
}
