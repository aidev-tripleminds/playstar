"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { cn } from "@/lib/utils";

export type AiModelIntroProps = React.ComponentProps<"section"> & {
  displayName?: string;
  showVerified?: boolean;
  handle?: string;
  bio?: string;
  playIntroLabel?: string;
  onPlayIntro?: () => void;
  chatLabel?: string;
  modelName?: string;
  createContentLabel?: string;
  liveContentLabel?: string;
  onChat?: () => void;
  onCreateContent?: () => void;
  chatIconSrc?: string;
  liveIconSrc?: string;
  createIconSrc?: string;
};

const DEFAULT_BIO =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

export function AiModelIntro({
  displayName = "Valentina",
  showVerified = true,
  handle = "ai/@Sexyanna",
  bio = DEFAULT_BIO,
  playIntroLabel = "Play my intro",
  onPlayIntro,
  chatLabel = "Chat with",
  modelName = "Name",
  createContentLabel = "General content",
  liveContentLabel = "AI live cam",
  onChat,
  onCreateContent,
  chatIconSrc = "/assets/ai-chat-white.svg",
  liveIconSrc = "/assets/cam-ai.svg",
  createIconSrc = "/assets/icons/magic-pen.svg",
  className,
  ...props
}: AiModelIntroProps) {
  return (
    <section
      data-slot="ai-model-intro"
      className={cn(
        "flex w-full max-w-full min-w-0 flex-col gap-6",
        "px-4 md:px-6",
        "min-h-[374px] md:min-h-[228px]",
        "md:max-w-[816px]",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0">
          <div className="flex items-center gap-1">
            {showVerified ? (
              <span className="relative inline-block h-5 w-5 shrink-0 md:h-6 md:w-6">
                <Image src="/assets/verified-badge.svg" alt="" fill className="object-cover" />
              </span>
            ) : null}

            <h1 className="text-tooltip-text text-left text-[24px] leading-8 font-bold md:text-[30px]">
              {displayName}
            </h1>
          </div>

          <p className="text-select-muted-text text-[14px] leading-5 font-normal md:text-[16px] md:leading-6">
            {handle}
          </p>
        </div>

        <div className="flex items-center gap-2 py-1 md:py-2">
          <button
            type="button"
            onClick={() => onPlayIntro?.()}
            className="inline-flex size-[26px] items-center justify-center rounded-full bg-[image:var(--gradient-rose)] p-1.5 transition-opacity hover:opacity-90 md:size-8"
            aria-label={playIntroLabel}
          >
            <Image src="/assets/play.svg" alt="" width={20} height={20} className="object-cover" />
          </button>

          <span className="text-tooltip-text text-sm leading-5 font-semibold md:text-base md:leading-6">
            {playIntroLabel}
          </span>
        </div>

        <p className="text-tooltip-text inline-block text-left text-[14px] leading-5 font-normal">
          {bio}
        </p>
      </div>

      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="min-w-0 flex-1">
          <Buttons
            type="button"
            variant="rose"
            size="btn-m"
            leftIcon
            rightIcon={false}
            label={createContentLabel}
            leftIconSrc={createIconSrc}
            className="!w-full"
            onClick={onCreateContent}
          />
        </div>

        <div className="relative min-w-0 flex-1">
          <Buttons
            type="button"
            variant="neutral-border"
            size="btn-m"
            leftIcon
            rightIcon={false}
            label={liveContentLabel}
            leftIconSrc={liveIconSrc}
            className="!w-full"
            onClick={onChat}
          />

          <div
            className={cn(
              "bg-status-active-dot border-dialog-bg absolute rounded-full",
              "-top-0.5 -right-0.5",
              "size-4 border-[2px] md:top-0 md:right-[0.03px]",
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <Buttons
            type="button"
            variant="neutral-border"
            size="btn-m"
            leftIcon
            rightIcon={false}
            label={`${chatLabel} ${modelName}`}
            leftIconSrc={chatIconSrc}
            className="!w-full"
            onClick={onChat}
          />
        </div>
      </div>
    </section>
  );
}
