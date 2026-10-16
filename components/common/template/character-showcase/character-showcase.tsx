"use client";

import "./character-showcase-image.css";
import "./character-showcase-slider.css";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { CloseOnAgeVerification, UnblurOverlay } from "@/components/common/general/unblur-overlay";
import { CharacterSlider } from "@/components/common/template/character-slider/character-slider";
import type { CharacterSliderSlide } from "@/components/common/template/character-slider/character-slider.constants";
import { Creator } from "@/components/common/template/creator/creator";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";

import {
  CHARACTER_SHOWCASE_CHAT_ICON_SRC,
  CHARACTER_SHOWCASE_DEFAULT_CHAT_LABEL,
  CHARACTER_SHOWCASE_DEFAULT_CREATOR_FOLLOWERS,
  CHARACTER_SHOWCASE_DEFAULT_CREATOR_INTERACTIONS,
  CHARACTER_SHOWCASE_DEFAULT_CREATOR_NAME,
  CHARACTER_SHOWCASE_DEFAULT_DELETE_LABEL,
  CHARACTER_SHOWCASE_DEFAULT_DESCRIPTION,
  CHARACTER_SHOWCASE_DEFAULT_DISCUSSIONS,
  CHARACTER_SHOWCASE_DEFAULT_GENERATE_LABEL,
  CHARACTER_SHOWCASE_DEFAULT_IMAGE_ALT,
  CHARACTER_SHOWCASE_DEFAULT_IMAGE_SRC,
  CHARACTER_SHOWCASE_DEFAULT_MESSAGES,
  CHARACTER_SHOWCASE_DEFAULT_SETTINGS_LABEL,
  CHARACTER_SHOWCASE_DEFAULT_SLIDES,
  CHARACTER_SHOWCASE_DEFAULT_STATUS,
  CHARACTER_SHOWCASE_DEFAULT_TITLE,
  CHARACTER_SHOWCASE_DELETE_ICON_SRC,
  CHARACTER_SHOWCASE_DESKTOP_BREAKPOINT_PX,
  CHARACTER_SHOWCASE_DISCUSSIONS_LABEL,
  CHARACTER_SHOWCASE_GENERATE_ICON_SRC,
  CHARACTER_SHOWCASE_IMAGE_CLASSNAME,
  CHARACTER_SHOWCASE_IMAGE_HEIGHT_PX,
  CHARACTER_SHOWCASE_IMAGE_WIDTH_PX,
  CHARACTER_SHOWCASE_MESSAGES_LABEL,
  CHARACTER_SHOWCASE_MOBILE_ACTION_BUTTON_CLASSNAME,
  CHARACTER_SHOWCASE_MODAL_SHELL_CLASSNAME,
  CHARACTER_SHOWCASE_SETTINGS_ICON_SRC,
  CHARACTER_SHOWCASE_SLIDER_CLASSNAME,
  CHARACTER_SHOWCASE_TITLE_ICON_SRC,
  type CharacterShowcaseStatus,
} from "./character-showcase.constants";

const showcaseActionButtonClassName = CHARACTER_SHOWCASE_MOBILE_ACTION_BUTTON_CLASSNAME;

export type CharacterShowcaseProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Figma Status: `default` = slider, `profile-picture` = single image */
  status?: CharacterShowcaseStatus;
  title?: string;
  titleIconSrc?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** The API's `blurred` for the `profile-picture` image: overlays the unblur CTA. */
  imageBlurred?: boolean;
  slides?: CharacterSliderSlide[];
  messagesCount?: string;
  discussionsCount?: string;
  /** Show the messages/discussions stats row. Defaults to true; set false where there is no real engagement data — e.g. the user's own characters. */
  showStats?: boolean;
  /** Show the slider's prev/next chevrons. Defaults to true; navigation still works via swipe/drag when hidden. */
  showSliderArrows?: boolean;
  /** Show the slider's blurred rotated side-preview images. Defaults to true. */
  showSliderSidePreviews?: boolean;
  /** Show the slider's "current / total" counter badge. Defaults to true. */
  showSliderCounter?: boolean;
  chatLabel?: string;
  generateLabel?: string;
  chatIconSrc?: string;
  chatButtonVariant?: React.ComponentProps<typeof Buttons>["variant"];
  generateFirst?: boolean;
  /**
   * Show a second action row with Settings and Delete buttons. Defaults to
   * false — only the user's own characters (My AIs dialog) offer these.
   */
  showSecondaryActions?: boolean;
  showDeleteAction?: boolean;
  settingsLabel?: string;
  deleteLabel?: string;
  settingsIconSrc?: string;
  deleteIconSrc?: string;
  onSettingsClick?: () => void;
  onDeleteClick?: () => void;
  contentDataSlot?: string;
  description?: string;
  creatorName?: string;
  creatorInteractions?: string;
  creatorFollowers?: string;
  creatorImageSrc?: string;
  /**
   * Show the creator strip. Defaults to true; set false where there is no real
   * creator to name — e.g. the user's own characters, which would otherwise
   * render the demo "Joan Doe / 7.4m interactions" placeholder.
   */
  showCreator?: boolean;
  onClose?: () => void;
  onChatClick?: () => void;
  onGenerateClick?: () => void;
  /** False hides Generate, e.g. when the character's `can_generate_from` is false. */
  showGenerateAction?: boolean;
  onCheckContentClick?: (slide: CharacterSliderSlide, index: number) => void;
  onFollowClick?: React.ComponentProps<typeof Creator>["onFollowClick"];
  overlayClassName?: string;
  className?: string;
};

export function CharacterShowcase({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  status = CHARACTER_SHOWCASE_DEFAULT_STATUS,
  title = CHARACTER_SHOWCASE_DEFAULT_TITLE,
  titleIconSrc = CHARACTER_SHOWCASE_TITLE_ICON_SRC,
  imageSrc = CHARACTER_SHOWCASE_DEFAULT_IMAGE_SRC,
  imageAlt = CHARACTER_SHOWCASE_DEFAULT_IMAGE_ALT,
  imageBlurred = false,
  slides = CHARACTER_SHOWCASE_DEFAULT_SLIDES,
  messagesCount = CHARACTER_SHOWCASE_DEFAULT_MESSAGES,
  discussionsCount = CHARACTER_SHOWCASE_DEFAULT_DISCUSSIONS,
  showStats = true,
  showSliderArrows = true,
  showSliderSidePreviews = true,
  showSliderCounter = true,
  chatLabel = CHARACTER_SHOWCASE_DEFAULT_CHAT_LABEL,
  generateLabel = CHARACTER_SHOWCASE_DEFAULT_GENERATE_LABEL,
  chatIconSrc = CHARACTER_SHOWCASE_CHAT_ICON_SRC,
  chatButtonVariant = "neutral",
  generateFirst = false,
  showSecondaryActions = false,
  showDeleteAction = true,
  settingsLabel = CHARACTER_SHOWCASE_DEFAULT_SETTINGS_LABEL,
  deleteLabel = CHARACTER_SHOWCASE_DEFAULT_DELETE_LABEL,
  settingsIconSrc = CHARACTER_SHOWCASE_SETTINGS_ICON_SRC,
  deleteIconSrc = CHARACTER_SHOWCASE_DELETE_ICON_SRC,
  onSettingsClick,
  onDeleteClick,
  description = CHARACTER_SHOWCASE_DEFAULT_DESCRIPTION,
  creatorName = CHARACTER_SHOWCASE_DEFAULT_CREATOR_NAME,
  creatorInteractions = CHARACTER_SHOWCASE_DEFAULT_CREATOR_INTERACTIONS,
  creatorFollowers = CHARACTER_SHOWCASE_DEFAULT_CREATOR_FOLLOWERS,
  creatorImageSrc,
  showCreator = true,
  onClose,
  onChatClick,
  onGenerateClick,
  showGenerateAction = true,
  onCheckContentClick,
  onFollowClick,
  overlayClassName,
  className,
}: CharacterShowcaseProps) {
  const isDesktop = useIsDesktop(CHARACTER_SHOWCASE_DESKTOP_BREAKPOINT_PX);
  const isSlider = status === "default";
  const closeForAgeVerification = React.useCallback(() => {
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);
  const generateButton = showGenerateAction ? (
    <Buttons
      type="button"
      variant="rose"
      size="btn-m"
      leftIcon
      rightIcon={false}
      label={generateLabel}
      leftIconSrc={CHARACTER_SHOWCASE_GENERATE_ICON_SRC}
      className={showcaseActionButtonClassName}
      onClick={onGenerateClick}
    />
  ) : null;

  return (
    <CloseOnAgeVerification onClose={closeForAgeVerification}>
      <ModalLayout
        trigger={trigger}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        title={title}
        titleIconSrc={titleIconSrc}
        showIcon
        showMobileHandle
        onClose={onClose}
        closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
        overlayClassName={overlayClassName}
        className={cn(
          CHARACTER_SHOWCASE_MODAL_SHELL_CLASSNAME,
          className,
          "z-71 md:max-w-[430px]!",
        )}
      >
        <div
          data-slot="character-showcase"
          data-status={status}
          className="flex w-full min-w-0 flex-col items-stretch gap-4"
        >
          {isSlider ? (
            <div
              data-slot="character-showcase-slider"
              className={CHARACTER_SHOWCASE_SLIDER_CLASSNAME}
            >
              <CharacterSlider
                size={isDesktop ? "desktop" : "mobile"}
                slides={slides}
                blurSidePreviewsOnLocked
                showArrows={showSliderArrows}
                showSidePreviews={showSliderSidePreviews}
                showCounter={showSliderCounter}
                className="w-full max-w-none"
                onCheckContentClick={onCheckContentClick}
              />
            </div>
          ) : (
            <div
              data-slot="character-showcase-image"
              className={CHARACTER_SHOWCASE_IMAGE_CLASSNAME}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={CHARACTER_SHOWCASE_IMAGE_WIDTH_PX}
                height={CHARACTER_SHOWCASE_IMAGE_HEIGHT_PX}
                className="size-full object-cover"
              />
              {imageBlurred ? <UnblurOverlay /> : null}
            </div>
          )}

          {showStats ? (
            <div
              data-slot="character-showcase-stats"
              className="text-tooltip-text flex w-full min-w-0 items-center justify-center gap-4 text-sm leading-5"
            >
              <p>
                <span className="font-normal">{messagesCount}</span>{" "}
                <span className="text-select-muted-text">{CHARACTER_SHOWCASE_MESSAGES_LABEL}</span>
              </p>
              <p>
                <span className="font-normal">{discussionsCount}</span>{" "}
                <span className="text-select-muted-text">
                  {CHARACTER_SHOWCASE_DISCUSSIONS_LABEL}
                </span>
              </p>
            </div>
          ) : null}

          <div
            data-slot="character-showcase-actions-group"
            className="flex w-full min-w-0 flex-col gap-2"
          >
            <div
              data-slot="character-showcase-actions"
              className="flex w-full max-w-full min-w-0 justify-center gap-2 max-sm:overflow-hidden sm:justify-start"
            >
              {generateFirst ? (
                <>
                  {generateButton}
                  <Buttons
                    type="button"
                    variant={chatButtonVariant}
                    size="btn-m"
                    leftIcon
                    rightIcon={false}
                    label={chatLabel}
                    leftIconSrc={chatIconSrc}
                    className={showcaseActionButtonClassName}
                    onClick={onChatClick}
                  />
                </>
              ) : (
                <>
                  <Buttons
                    type="button"
                    variant={chatButtonVariant}
                    size="btn-m"
                    leftIcon
                    rightIcon={false}
                    label={chatLabel}
                    leftIconSrc={chatIconSrc}
                    className={cn(
                      showcaseActionButtonClassName,
                      chatButtonVariant === "neutral" &&
                        "text-bank-foreground [background:var(--chat-gradient-bg)]",
                    )}
                    onClick={onChatClick}
                  />
                  {generateButton}
                </>
              )}
            </div>

            {showSecondaryActions ? (
              <div
                data-slot="character-showcase-secondary-actions"
                className="flex w-full max-w-full min-w-0 justify-center gap-2 max-sm:overflow-hidden sm:justify-start"
              >
                <Buttons
                  type="button"
                  variant="neutral"
                  size="btn-m"
                  leftIcon
                  rightIcon={false}
                  label={settingsLabel}
                  leftIconSrc={settingsIconSrc}
                  className={showcaseActionButtonClassName}
                  onClick={onSettingsClick}
                />
                {showDeleteAction ? (
                  <Buttons
                    type="button"
                    variant="neutral"
                    size="btn-m"
                    leftIcon
                    rightIcon={false}
                    label={deleteLabel}
                    leftIconSrc={deleteIconSrc}
                    className={showcaseActionButtonClassName}
                    onClick={onDeleteClick}
                  />
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Omitted when empty, so a character with no bio doesn't leave a
            blank line and its flex gap between the actions and the creator
            strip. */}
          {description ? (
            <p
              data-slot="character-showcase-description"
              className="text-modal-text line-clamp-3 w-full min-w-0 text-left text-sm leading-5 font-normal break-words"
            >
              {description}
            </p>
          ) : null}

          {showCreator ? (
            <Creator
              size={isDesktop ? "desktop" : "mobile"}
              name={creatorName}
              interactionsCount={creatorInteractions}
              followersCount={creatorFollowers}
              imageSrc={creatorImageSrc}
              className="w-full max-w-full min-w-0"
              onFollowClick={onFollowClick}
            />
          ) : null}
        </div>
      </ModalLayout>
    </CloseOnAgeVerification>
  );
}
