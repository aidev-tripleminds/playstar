"use client";

import * as React from "react";

import { DotOption } from "@/components/common/ai-model-pages/dot-option/dot-option";
import { AvatarGroup } from "@/components/common/chat/avatar-group/avatar-group";
import { resolveAvatarGroupPersons } from "@/components/common/chat/avatar-group/constants";
import { RadioIndicator } from "@/components/common/general/radio-indicator/radio-indicator";
import { cn } from "@/lib/utils";
import { PinIcon } from "@/public/assets/icons/pin-icon";

import {
  type ConversationStatusState,
  DEFAULT_CONVERSATION_AVATAR,
  DEFAULT_CONVERSATION_DOT_MENU_ITEMS,
  DEFAULT_CONVERSATION_MEMBER_AVATARS,
  DEFAULT_CONVERSATION_NAME,
  DEFAULT_CONVERSATION_PREVIEW,
  STATUSES_WITH_STATIC_SURFACE,
} from "./components/constants";
import {
  buildRowAriaLabel,
  ConversationAvatar,
  isPointerMovingToTarget,
  previewVariants,
  UnreadIndicator,
} from "./components/helpers";
import { useHoverCapable } from "./components/use-hover-capable";
import { type ConversationStatusProps } from "./types";
import { conversationStatusVariants } from "./variants";

export type { ConversationStatusState } from "./components/constants";
export {
  CONVERSATION_STATUS_STATES,
  DEFAULT_CONVERSATION_AVATAR,
  DEFAULT_CONVERSATION_DOT_MENU_ITEMS,
  DEFAULT_CONVERSATION_MEMBER_AVATARS,
  DEFAULT_CONVERSATION_NAME,
  DEFAULT_CONVERSATION_PREVIEW,
} from "./components/constants";
export { conversationStatusVariants } from "./variants";

const ROW_BUTTON_CLASS =
  "flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl border-0 bg-transparent p-0 text-left focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export function ConversationStatus({
  status = "default",
  name = DEFAULT_CONVERSATION_NAME,
  preview = DEFAULT_CONVERSATION_PREVIEW,
  avatarSrc = DEFAULT_CONVERSATION_AVATAR,
  avatar,
  memberAvatars,
  avatarGroupPersons,
  dotMenuItems = DEFAULT_CONVERSATION_DOT_MENU_ITEMS,
  menuOpen: menuOpenProp,
  defaultMenuOpen = false,
  onMenuOpenChange,
  onDotItemClick,
  onDotTriggerClick,
  isPinned = false,
  showRadioIndicator,
  /** Rose = unread; muted = read. Not used for active/selected state. */
  radioChecked = false,
  showAvatar,
  disabled = false,
  buttonType = "button",
  dotAriaLabel = "Conversation options",
  enableMobileMenu = false,
  previewLineClamp = 1,
  disableHoverActions = false,
  showDotMenu = true,
  as: Component = "div",
  className,
  onClick,
  "aria-label": ariaLabel,
  ...props
}: ConversationStatusProps) {
  const resolvedStatus: ConversationStatusState = status ?? "default";
  const isGroupStatus = resolvedStatus === "group";
  const resolvedMemberAvatars =
    memberAvatars ?? (isGroupStatus ? DEFAULT_CONVERSATION_MEMBER_AVATARS : undefined);
  const showGroupAvatar =
    isGroupStatus || (resolvedMemberAvatars != null && resolvedMemberAvatars.length >= 2);
  const resolvedAvatarGroupPersons =
    avatarGroupPersons ?? resolveAvatarGroupPersons(resolvedMemberAvatars?.length ?? 2);
  const isMemory = resolvedStatus === "memory";
  const shouldShowAvatar = showAvatar ?? !isMemory;
  const showRadio = showRadioIndicator ?? resolvedStatus === "radio";
  const hasStaticSurface = (STATUSES_WITH_STATIC_SURFACE as readonly string[]).includes(
    resolvedStatus,
  );
  const hoverActionsEnabled = !disableHoverActions;
  const dotMenuEnabled = hoverActionsEnabled && showDotMenu;
  const hoverCapable = useHoverCapable();

  const [isRowHovered, setIsRowHovered] = React.useState(false);
  const [isDotHovered, setIsDotHovered] = React.useState(false);
  const [isActionsFocused, setIsActionsFocused] = React.useState(false);
  const isMenuControlled = menuOpenProp !== undefined;
  const [internalMenuOpen, setInternalMenuOpen] = React.useState(defaultMenuOpen);
  const isMenuOpen = isMenuControlled ? Boolean(menuOpenProp) : internalMenuOpen;

  const setMenuOpen = React.useCallback(
    (open: boolean) => {
      if (!isMenuControlled) {
        setInternalMenuOpen(open);
      }
      onMenuOpenChange?.(open);
    },
    [isMenuControlled, onMenuOpenChange],
  );

  const resetInteraction = React.useCallback(() => {
    setIsRowHovered(false);
    setIsDotHovered(false);
    setIsActionsFocused(false);
    setMenuOpen(false);
  }, [setMenuOpen]);

  const showDots =
    dotMenuEnabled &&
    (hoverCapable === false ||
      (hoverCapable === true && (isRowHovered || isMenuOpen || isActionsFocused || isDotHovered)));

  const showCardHoverBg =
    hoverActionsEnabled &&
    !hasStaticSurface &&
    resolvedStatus !== "focus" &&
    hoverCapable &&
    isRowHovered &&
    !isDotHovered &&
    !isMenuOpen &&
    !isActionsFocused;

  const resolvedRowLabel = buildRowAriaLabel(name, resolvedStatus, ariaLabel);

  const handleRowPointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    if (isPointerMovingToTarget(event.currentTarget, event.relatedTarget)) {
      return;
    }
    // Menu is portaled to document.body, so moving onto it leaves the row.
    // Keep it open; DotOption closes on outside click, Escape, or item select.
    if (isMenuOpen) {
      setIsRowHovered(false);
      setIsDotHovered(false);
      return;
    }
    resetInteraction();
  };

  const handleActionsPointerEnter = () => {
    setIsDotHovered(true);
  };

  const handleActionsPointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    if (isPointerMovingToTarget(event.currentTarget, event.relatedTarget)) {
      return;
    }
    setIsDotHovered(false);
  };

  const handleActionsFocus = () => {
    setIsActionsFocused(true);
  };

  const handleActionsBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (isPointerMovingToTarget(event.currentTarget, event.relatedTarget)) {
      return;
    }
    setIsActionsFocused(false);
  };

  const handleDotItemClick = (value: string) => {
    onDotItemClick?.(value);
    setMenuOpen(false);
  };

  const rowClassName = cn(
    conversationStatusVariants({ status: resolvedStatus }),
    showCardHoverBg && "bg-surface-strong",
    hoverActionsEnabled &&
      !hasStaticSurface &&
      resolvedStatus !== "focus" &&
      (isDotHovered || isMenuOpen || isActionsFocused) &&
      "!bg-transparent",
    className,
  );

  const rowChildren = (
    <>
      <button
        type={buttonType}
        disabled={disabled}
        onClick={onClick}
        aria-label={resolvedRowLabel}
        aria-current={resolvedStatus === "focus" ? "true" : undefined}
        aria-disabled={disabled || undefined}
        className={ROW_BUTTON_CLASS}
      >
        {shouldShowAvatar ? (
          avatar != null ? (
            avatar
          ) : showGroupAvatar && resolvedMemberAvatars ? (
            <AvatarGroup
              persons={resolvedAvatarGroupPersons}
              avatars={resolvedMemberAvatars}
              label={name}
            />
          ) : (
            <ConversationAvatar src={avatarSrc} alt="" />
          )
        ) : null}

        <span className={cn("relative min-w-0 flex-1", hoverActionsEnabled && "")}>
          <span className="flex min-w-0 items-center gap-0.5">
            {resolvedStatus === "pinned" || isPinned ? (
              <PinIcon className="text-modal-text size-4 shrink-0" aria-hidden />
            ) : null}
            <span className="text-tooltip-text min-w-0 flex-1 truncate text-[14px] leading-5 font-medium">
              {name}
            </span>
            {resolvedStatus === "unread" || (radioChecked && !showRadio) ? (
              <UnreadIndicator />
            ) : null}
          </span>

          {preview ? (
            <span
              className={cn(
                previewVariants({ status: resolvedStatus }),
                previewLineClamp === 2 ? "line-clamp-2 whitespace-normal" : "truncate",
                showDots && hoverCapable === false && "pr-10",
              )}
            >
              {preview}
            </span>
          ) : null}
        </span>
      </button>

      {showRadio ? (
        <RadioIndicator checked={radioChecked} className={cn("pl-2", showDots && "invisible")} />
      ) : null}

      {dotMenuEnabled ? (
        <div
          data-slot="conversation-status-actions"
          className={cn(
            "bg-tooltip-default-bg absolute right-4 bottom-3.5 z-10 rounded-full transition-opacity motion-reduce:transition-none",
            showDots ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          )}
          tabIndex={showDots ? -1 : undefined}
          onPointerEnter={handleActionsPointerEnter}
          onPointerLeave={handleActionsPointerLeave}
          onFocus={handleActionsFocus}
          onBlur={handleActionsBlur}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <DotOption
            items={dotMenuItems}
            menuOpen={isMenuOpen}
            onMenuOpenChange={setMenuOpen}
            onItemClick={handleDotItemClick}
            onTriggerClick={onDotTriggerClick}
            ariaLabel={dotAriaLabel}
            align="right"
            enableMobileMenu={enableMobileMenu}
            className={cn(
              isDotHovered && "[&>button]:bg-tooltip-default-bg [&>button]:text-tooltip-text",
              isMenuOpen && "[&>button]:bg-surface-strong [&>button]:text-tooltip-text",
            )}
            menuClassName="min-w-[144px]"
          />
        </div>
      ) : null}
    </>
  );

  return React.createElement(
    Component,
    {
      "data-slot": "conversation-status",
      "data-status": resolvedStatus,
      "data-hovered": showCardHoverBg || undefined,
      "data-dots-visible": showDots || undefined,
      "data-disabled": disabled || undefined,
      onPointerEnter: () => {
        if (hoverActionsEnabled) {
          setIsRowHovered(true);
        }
      },
      onPointerLeave: handleRowPointerLeave,
      className: rowClassName,
      ...props,
    },
    rowChildren,
  );
}
