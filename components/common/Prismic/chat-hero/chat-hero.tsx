"use client";

import * as React from "react";

import { CharacterPlaceholder } from "@/components/common/chat/character-placeholder/character-placeholder";
import { GradientGrid } from "@/components/common/general/gradient-grid/gradient-grid";
import { useTryFreeCta } from "@/components/common/Prismic/cta/use-try-free-cta";
import { cn } from "@/lib/utils";

import {
  CHAT_HERO_CLUSTER_GAP_PX,
  CHAT_HERO_CONTENT_CLASS,
  CHAT_HERO_CONTENT_WIDTH_PX,
  CHAT_HERO_COPY_GAP_PX,
  CHAT_HERO_DEFAULT_DESCRIPTION,
  CHAT_HERO_DEFAULT_HEADING,
  CHAT_HERO_DEFAULT_PLACEHOLDER_LABEL,
  CHAT_HERO_DESCRIPTION_CLASS,
  CHAT_HERO_HEADING_CLASS,
  CHAT_HERO_SECTION_CLASS,
} from "./chat-hero.constants";

export type ChatHeroProps = Omit<React.ComponentProps<"section">, "children"> & {
  heading?: string;
  description?: string;
  placeholderLabel?: string;
  signupSource?: string;
  showBackground?: boolean;
  showPlaceholder?: boolean;
  onPlaceholderClick?: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 * Logged-out `/chat` hero from Figma **SEO - Chat** (`22534:148431`): the chat
 * empty state (character placeholder + heading + description) as a full-width
 * marketing block with the pink grid glow behind it.
 *
 * "Select an AI" is the page's conversion control — with no caller handler
 * it is the shared try-free CTA (signup, or /explore when already signed in).
 */
export function ChatHero({
  heading = CHAT_HERO_DEFAULT_HEADING,
  description = CHAT_HERO_DEFAULT_DESCRIPTION,
  placeholderLabel = CHAT_HERO_DEFAULT_PLACEHOLDER_LABEL,
  signupSource,
  showBackground = true,
  showPlaceholder = true,
  onPlaceholderClick,
  className,
  ...props
}: ChatHeroProps) {
  const tryFree = useTryFreeCta(signupSource);
  const resolvedHeading = heading.trim();
  const resolvedDescription = description.trim();
  const resolvedPlaceholderLabel = placeholderLabel.trim();
  const hasHeading = resolvedHeading.length > 0;
  const hasDescription = resolvedDescription.length > 0;
  const hasPlaceholder = showPlaceholder && resolvedPlaceholderLabel.length > 0;
  const resolvedOnPlaceholderClick = onPlaceholderClick ?? tryFree.onClick;

  if (!hasHeading && !hasDescription && !hasPlaceholder) return null;

  return (
    <section
      data-slot="chat-hero"
      className={cn(CHAT_HERO_SECTION_CLASS, "h-auto min-h-[520px] md:h-[840px]", className)}
      {...props}
    >
      {showBackground ? (
        <GradientGrid
          minOpacity={0.3}
          maxOpacity={0.25}
          className="pointer-events-none absolute inset-x-0 -top-80 z-0 h-full max-h-[720px]"
        />
      ) : null}

      <div
        data-slot="chat-hero-content"
        className={CHAT_HERO_CONTENT_CLASS}
        style={{ maxWidth: CHAT_HERO_CONTENT_WIDTH_PX, gap: CHAT_HERO_CLUSTER_GAP_PX }}
      >
        {hasPlaceholder ? (
          <CharacterPlaceholder
            label={resolvedPlaceholderLabel}
            onClick={resolvedOnPlaceholderClick}
          />
        ) : null}

        {hasHeading || hasDescription ? (
          <div
            className="flex w-full flex-col items-center text-center"
            style={{ gap: CHAT_HERO_COPY_GAP_PX }}
          >
            {/* Styled identically either way — only the element changes. The
                page needs exactly one `<h1>`: the Prismic `heading_1` below
                takes it when authored, and this line steps down to a plain
                paragraph. With no CMS heading to defer to there is nothing
                else on the page that could be the H1, so it stays one. */}
            {hasHeading ? (
              <p data-slot="chat-hero-heading" className={CHAT_HERO_HEADING_CLASS}>
                {resolvedHeading}
              </p>
            ) : null}
            {hasDescription ? (
              <p data-slot="chat-hero-description" className={CHAT_HERO_DESCRIPTION_CLASS}>
                {resolvedDescription}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
