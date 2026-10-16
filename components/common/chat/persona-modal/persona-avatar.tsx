"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";
import { ForbiddenIcon } from "@/public/assets/icons";

import {
  getPersonaBackgroundColor,
  getPersonaIconSrc,
  type PersonaItem,
} from "./persona-modal.constants";

export type PersonaAvatarProps = {
  persona?: Pick<PersonaItem, "source" | "imageSrc" | "iconId" | "backgroundId"> | null;
  variant?: "none" | "persona";
  className?: string;
  size?: "sm" | "md";
};

export function PersonaAvatar({
  persona,
  variant = "persona",
  className,
  size = "md",
}: PersonaAvatarProps) {
  const sizeClass = size === "sm" ? "size-10 text-lg" : "size-11 text-xl";

  if (variant === "none") {
    return (
      <span
        data-slot="persona-avatar"
        data-variant="none"
        className={cn(
          "bg-surface-strong text-modal-text flex shrink-0 items-center justify-center rounded-xl",
          sizeClass,
          className,
        )}
      >
        <ForbiddenIcon className="size-5" />
      </span>
    );
  }

  if (persona?.source === "ai-model" && persona.imageSrc) {
    return (
      <span
        data-slot="persona-avatar"
        data-variant="ai-model"
        className={cn("relative shrink-0 overflow-hidden rounded-xl", sizeClass, className)}
      >
        <Image src={persona.imageSrc} alt="" fill sizes="44px" className="object-cover" />
      </span>
    );
  }

  const backgroundId = persona?.backgroundId;
  const iconId = persona?.iconId;

  const iconSizeClass = size === "sm" ? "size-6" : "size-7";

  return (
    <span
      data-slot="persona-avatar"
      data-variant="custom"
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-xl",
        sizeClass,
        className,
      )}
      style={{ backgroundColor: getPersonaBackgroundColor(backgroundId) }}
    >
      <span className={cn("relative shrink-0", iconSizeClass)} aria-hidden>
        <Image src={getPersonaIconSrc(iconId)} alt="" fill className="object-contain" />
      </span>
    </span>
  );
}
