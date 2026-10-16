"use client";

import { cva } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { CollapseButton } from "@/components/common/general/collapse-button";
import { cn } from "@/lib/utils";
import { UserAIIcon } from "@/public/assets/icons";

import {
  RightPanelCharacterCarousel,
  RightPanelGroupHero,
} from "./components/right-panel-character-carousel";
import { RightPanelHistoryList } from "./components/right-panel-history-list";
import { RightPanelMediaGrid } from "./components/right-panel-media-grid";
import { RightPanelSectionTabs } from "./components/right-panel-section-tabs";
import {
  DEFAULT_RIGHT_PANEL_CHARACTER_AGE,
  DEFAULT_RIGHT_PANEL_CHARACTER_BIO,
  DEFAULT_RIGHT_PANEL_CHARACTER_IMAGE,
  DEFAULT_RIGHT_PANEL_CHARACTER_IMAGES,
  DEFAULT_RIGHT_PANEL_CHARACTER_NAME,
  DEFAULT_RIGHT_PANEL_GROUP_TITLE,
  DEFAULT_RIGHT_PANEL_MEMBER_AVATARS,
  DEFAULT_RIGHT_PANEL_MEMBER_COUNT_LABEL,
  DEFAULT_RIGHT_PANEL_PROFILE_LABEL,
  RIGHT_PANEL_MEDIA_EMPTY_LABEL,
} from "./constants";
import type { RightPanelProps, RightPanelTab } from "./types";

export {
  DEFAULT_RIGHT_PANEL_CHARACTER_AGE,
  DEFAULT_RIGHT_PANEL_CHARACTER_BIO,
  DEFAULT_RIGHT_PANEL_CHARACTER_IMAGE,
  DEFAULT_RIGHT_PANEL_CHARACTER_IMAGES,
  DEFAULT_RIGHT_PANEL_CHARACTER_NAME,
  DEFAULT_RIGHT_PANEL_FORWARD_ITEMS,
  DEFAULT_RIGHT_PANEL_GALLERY_LABEL,
  DEFAULT_RIGHT_PANEL_GROUP_TITLE,
  DEFAULT_RIGHT_PANEL_MEDIA_ITEMS,
  DEFAULT_RIGHT_PANEL_MEMBER_AVATARS,
  DEFAULT_RIGHT_PANEL_MEMBER_COUNT_LABEL,
  DEFAULT_RIGHT_PANEL_NEW_CHAT_LABEL,
  DEFAULT_RIGHT_PANEL_PROFILE_LABEL,
  RIGHT_PANEL_HISTORY_EMPTY_LABEL,
  RIGHT_PANEL_HISTORY_TAB_LABEL,
  RIGHT_PANEL_MEDIA_EMPTY_LABEL,
  RIGHT_PANEL_MEDIA_TAB_LABEL,
} from "./constants";
export type {
  RightPanelForwardItem,
  RightPanelHistoryItem,
  RightPanelMediaItem,
  RightPanelProps,
  RightPanelTab,
  RightPanelVariant,
} from "./types";
export { RIGHT_PANEL_VARIANTS } from "./types";

const rightPanelVariants = cva(
  [
    "relative flex h-full w-full max-w-[320px] flex-col gap-4 overflow-hidden scrollbar-hidden ",
    "border-l border-border-strong bg-dialog-bg",
  ],
  {
    variants: {
      variant: {
        default: "",
        group: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function RightPanelProfileSummary({
  variant,
  characterName,
  characterAge,
  characterBio,
  memberCountLabel,
}: {
  variant: RightPanelProps["variant"];
  characterName: string;
  characterAge: string | number;
  characterBio: string;
  memberCountLabel: string;
}) {
  if (variant === "group") {
    return (
      <div data-slot="right-panel-summary" className="flex w-full flex-col gap-2">
        <h2 className="text-tooltip-text text-lg leading-7 font-semibold">{characterName}</h2>
        <div className="text-divider-label flex items-center justify-center gap-1 text-xs leading-4 font-medium">
          <Image
            src="/assets/group.svg"
            alt=""
            aria-hidden
            width={16}
            height={16}
            className="size-4 shrink-0 object-contain opacity-80"
          />
          <span>{memberCountLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div data-slot="right-panel-summary" className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap items-baseline gap-1.5">
        <h2 className="text-tooltip-text text-lg leading-7 font-semibold">{characterName}</h2>
        <span className="text-cookie-bg text-lg leading-7 font-bold">{characterAge}</span>
      </div>
      <p className="text-divider-label line-clamp-2 text-sm leading-5 font-medium">
        {characterBio}
      </p>
    </div>
  );
}

function RightPanelProfileButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <Buttons
      variant="neutral-border"
      size="btn-m"
      label={label}
      leftIcon
      rightIcon={false}
      leftIconNode={<UserAIIcon className="size-5" />}
      className="h-11! w-full! max-w-none!"
      onClick={onClick}
    />
  );
}

export function RightPanel({
  variant = "default",
  characterName = DEFAULT_RIGHT_PANEL_CHARACTER_NAME,
  characterAge = DEFAULT_RIGHT_PANEL_CHARACTER_AGE,
  characterBio = DEFAULT_RIGHT_PANEL_CHARACTER_BIO,
  characterImageSrc = DEFAULT_RIGHT_PANEL_CHARACTER_IMAGE,
  characterImages = DEFAULT_RIGHT_PANEL_CHARACTER_IMAGES,
  memberAvatars = DEFAULT_RIGHT_PANEL_MEMBER_AVATARS,
  memberCountLabel = DEFAULT_RIGHT_PANEL_MEMBER_COUNT_LABEL,
  carouselIndex = 1,
  mediaItems = [],
  historyItems = [],
  activeHistoryId = null,
  onHistorySelect,
  showCarousel,
  showProfileButton,
  profileLabel = DEFAULT_RIGHT_PANEL_PROFILE_LABEL,
  collapseLabel = "Collapse character panel",
  onProfileClick,
  onCollapseClick,
  onCarouselIndexChange,
  onMediaSelect,
  className,
  ...props
}: RightPanelProps) {
  const resolvedVariant = variant ?? "default";
  const isGroup = resolvedVariant === "group";
  const resolvedCharacterName =
    isGroup && characterName === DEFAULT_RIGHT_PANEL_CHARACTER_NAME
      ? DEFAULT_RIGHT_PANEL_GROUP_TITLE
      : characterName;
  const resolvedShowProfile = showProfileButton ?? !isGroup;
  const resolvedShowCarousel = showCarousel ?? !isGroup;
  const hasOverlayCollapse = resolvedShowCarousel || isGroup;
  const resolvedCharacterImages =
    characterImages.length > 0 ? characterImages : characterImageSrc ? [characterImageSrc] : [];
  const [section, setSection] = React.useState<RightPanelTab>("media");

  return (
    <aside
      data-slot="right-panel"
      data-variant={resolvedVariant}
      aria-label={resolvedCharacterName}
      className={cn(rightPanelVariants({ variant: resolvedVariant }), className)}
      {...props}
    >
      <div
        data-slot="right-panel-footer"
        className={cn("z-21 flex w-full p-4", hasOverlayCollapse ? "absolute" : "relative")}
      >
        <CollapseButton
          className="z-20!"
          variant="footer"
          label={collapseLabel}
          onClick={onCollapseClick}
        />
      </div>

      {isGroup ? (
        <div className="pb-4">
          <RightPanelGroupHero memberAvatars={memberAvatars} />
        </div>
      ) : resolvedShowCarousel ? (
        <RightPanelCharacterCarousel
          images={resolvedCharacterImages}
          carouselIndex={carouselIndex}
          onCarouselIndexChange={onCarouselIndexChange}
        />
      ) : null}

      <div className="flex w-full flex-col gap-4 px-4">
        <RightPanelProfileSummary
          variant={resolvedVariant}
          characterName={resolvedCharacterName}
          characterAge={characterAge}
          characterBio={characterBio}
          memberCountLabel={memberCountLabel}
        />

        {resolvedShowProfile ? (
          <RightPanelProfileButton label={profileLabel} onClick={onProfileClick} />
        ) : null}
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
        <div className="px-4">
          <RightPanelSectionTabs selected={section} onSelect={setSection} />
        </div>

        <div
          role="tabpanel"
          id={`right-panel-tabpanel-${section}`}
          aria-labelledby={`right-panel-tab-${section}`}
          className="flex w-full flex-col px-4 pb-4"
        >
          {section === "media" ? (
            mediaItems.length > 0 ? (
              <RightPanelMediaGrid
                items={mediaItems}
                modelTitle={resolvedCharacterName}
                modelImageSrc={resolvedCharacterImages[0]}
                onMediaSelect={onMediaSelect}
              />
            ) : (
              <p className="text-divider-label px-1 py-3 text-sm leading-5">
                {RIGHT_PANEL_MEDIA_EMPTY_LABEL}
              </p>
            )
          ) : (
            <RightPanelHistoryList
              items={historyItems}
              activeId={activeHistoryId}
              onSelect={onHistorySelect}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
