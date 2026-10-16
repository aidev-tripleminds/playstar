"use client";

import { type VariantProps } from "class-variance-authority";
import Image from "next/image";

import { LiveBadge } from "@/components/common/Prismic/live-badge";

import {
  AI_MODEL_VERIFIED_ICON_SRC,
  type AiModelSize,
  type AiModelStat,
} from "../ai-model.constants";
import {
  aiModelContentVariants,
  aiModelDescriptionVariants,
  aiModelLiveBadgeDotVariants,
  aiModelLiveBadgeVariants,
  aiModelNameVariants,
  aiModelVerifiedIconVariants,
} from "../ai-model.shared";
import { AiModelStats } from "./ai-model-stats";

export type AiModelCharactersContentProps = VariantProps<typeof aiModelContentVariants> & {
  size?: AiModelSize;
  name: string;
  description: string;
  stats: AiModelStat[];
  showLive?: boolean;
  showVerified?: boolean;
  showStats?: boolean;
};

export function AiModelCharactersContent({
  size = "default",
  name,
  description,
  stats,
  showLive = true,
  showVerified = true,
  showStats = true,
}: AiModelCharactersContentProps) {
  return (
    <>
      {showLive ? (
        <LiveBadge
          className={aiModelLiveBadgeVariants({ size })}
          dotClassName={aiModelLiveBadgeDotVariants({ size })}
        />
      ) : null}

      <span className={aiModelContentVariants({ size })}>
        <span data-slot="ai-model-name-row" className="inline-flex min-w-0 items-center gap-1">
          {showVerified ? (
            <span
              className={aiModelVerifiedIconVariants({ size })}
              aria-hidden
              data-slot="ai-model-verified-icon"
            >
              <Image src={AI_MODEL_VERIFIED_ICON_SRC} alt="" fill className="object-cover" />
            </span>
          ) : null}
          <span data-slot="ai-model-name" className={aiModelNameVariants({ size })}>
            {name}
          </span>
        </span>

        {/* Skipped entirely when empty rather than rendered blank: this column
            is `flex flex-col gap-1`, so an empty element still leaves its gap
            behind and the card reads as mis-spaced. */}
        {description ? (
          <span data-slot="ai-model-description" className={aiModelDescriptionVariants({ size })}>
            {description}
          </span>
        ) : null}
        {showStats && <AiModelStats stats={stats} size={size} />}
      </span>
    </>
  );
}
