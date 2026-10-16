"use client";

import Image from "next/image";
import * as React from "react";

import {
  OptionList,
  type OptionListItem,
} from "@/components/common/general/option-list/option-list";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { resolveAsset } from "@/lib/assets/asset-store";
import { cn } from "@/lib/utils";
import { PhoneGreenIcon, RefreshIcon } from "@/public/assets/icons";
import { MicrophoneIcon } from "@/public/assets/icons/microphone";
import { VideoCameraIcon } from "@/public/assets/icons/video-camera";

import { ActiveCallModal } from "./components/active-call-modal";
import { CallOptionsModal } from "./components/call-options-modal";
import { ResetChatModal } from "./components/reset-chat-modal";
import {
  ChatbarIconButton,
  DEFAULT_MEMBER_AVATARS,
  TopChatbarAvatar,
  TopChatbarAvatarStack,
} from "./components/top-bar-comp";
import { type TopChatbarProps } from "./components/types";
import { topChatbarLeadingVariants, topChatbarVariants } from "./variants";

export { topChatbarLeadingVariants, topChatbarVariants } from "./variants";

/** Tablet+ shares the desktop call dropdown; only phones use the bottom-sheet modal. */
const CALL_MENU_DESKTOP_BREAKPOINT = 768;

const DEFAULT_CALL_MENU_ITEMS: OptionListItem[] = [
  {
    value: "audio",
    label: "Audio call",
    leftIcon: <MicrophoneIcon className="size-5" />,
  },
  {
    value: "video",
    label: "Video call",
    leftIcon: <VideoCameraIcon className="size-5" />,
  },
];

const VIEW_PROFILE_LABEL = "View profile";

function TopChatbarIdentity({
  isGroup,
  name,
  avatarSrc,
  memberAvatars,
  showViewProfile = false,
}: {
  isGroup: boolean;
  name: string;
  avatarSrc: string;
  memberAvatars: string[];
  showViewProfile?: boolean;
}) {
  return (
    <>
      {isGroup ? (
        <TopChatbarAvatarStack avatars={memberAvatars} alt={showViewProfile ? "" : name} />
      ) : (
        <TopChatbarAvatar src={avatarSrc} alt={showViewProfile ? "" : name} />
      )}
      <span className="flex min-w-0 flex-col pr-2">
        <span className="text-tooltip-text truncate text-sm leading-5 font-medium">{name}</span>
        {showViewProfile ? (
          <span className="text-divider-label truncate text-xs leading-5 font-normal">
            {VIEW_PROFILE_LABEL}
          </span>
        ) : null}
      </span>
    </>
  );
}

export function TopChatbar({
  status = "default",
  name = "Cassy Anderson",
  avatarSrc = resolveAsset("demo_pics_profile2").image ?? "",
  memberAvatars = [...DEFAULT_MEMBER_AVATARS],
  callMenuItems = DEFAULT_CALL_MENU_ITEMS,
  onBackClick,
  onSidebarClick,
  onRefreshClick,
  onPhoneClick,
  onSettingsClick,
  onMenuClick,
  onCallOptionClick,
  onBeforeCallOption,
  backLabel = "Go back",
  sidebarLabel = "Toggle sidebar",
  refreshLabel = "Refresh chat",
  phoneLabel = "Start call",
  settingsLabel = "Chat settings",
  menuLabel = "Open menu",
  className,
  showExpandIcon = true,
  sidebarCollapsed = true,
  showLeftExpandIcon = true,
  isRefreshing = false,
  ...props
}: TopChatbarProps) {
  const resolvedStatus = status ?? "default";
  const isMobileVariant = resolvedStatus === "mobile" || resolvedStatus === "group-mobile";
  const isGroupVariant = resolvedStatus === "group" || resolvedStatus === "group-mobile";
  const showSettings = isMobileVariant;
  const showMenuChevron = !isMobileVariant;
  // Chat shell treats tablet as mobile (<1024), but call UI should use the dropdown from md up.
  const useDesktopCallMenu = useIsDesktop(CALL_MENU_DESKTOP_BREAKPOINT);
  const [isCallMenuOpen, setIsCallMenuOpen] = React.useState(false);
  const [isActiveCallOpen, setIsActiveCallOpen] = React.useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);
  const callMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isCallMenuOpen || !useDesktopCallMenu) {
      return;
    }

    function handleClickOutside(event: MouseEvent) {
      if (callMenuRef.current && !callMenuRef.current.contains(event.target as Node)) {
        setIsCallMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCallMenuOpen, useDesktopCallMenu]);

  function handleCallMenuToggle() {
    setIsCallMenuOpen((prev) => !prev);
    onPhoneClick?.();
  }

  function handleCallOptionClick(value: string) {
    setIsCallMenuOpen(false);
    if (onBeforeCallOption && !onBeforeCallOption()) {
      return;
    }
    setIsActiveCallOpen(true);
    onCallOptionClick?.(value);
  }

  function handleRefreshClick() {
    if (isRefreshing) {
      return;
    }

    setIsResetConfirmOpen(true);
  }

  function handleResetConfirm() {
    onRefreshClick?.();
  }

  return (
    <header
      data-slot="top-chatbar"
      data-status={resolvedStatus}
      className={cn(topChatbarVariants({ status: resolvedStatus }), className)}
      {...props}
    >
      <div className={cn(topChatbarLeadingVariants({ status: resolvedStatus }))}>
        {isMobileVariant ? (
          <ChatbarIconButton label={backLabel} onClick={onBackClick}>
            <Image
              src="/assets/left.svg"
              alt=""
              width={24}
              height={24}
              className="size-6 object-contain"
            />
          </ChatbarIconButton>
        ) : showExpandIcon ? (
          <ChatbarIconButton label={sidebarLabel} onClick={onSidebarClick}>
            <Image
              src="/assets/expanded.svg"
              alt=""
              width={24}
              height={24}
              className={cn("size-6 object-contain", !sidebarCollapsed && "rotate-180")}
            />
          </ChatbarIconButton>
        ) : null}

        <div className="flex min-w-0 items-center gap-2">
          {isMobileVariant ? (
            <button
              type="button"
              onClick={onSettingsClick}
              aria-label={`${name}, view profile`}
              className="focus-visible:ring-border-focus flex min-w-0 cursor-pointer items-center gap-2 text-left focus-visible:ring-2 focus-visible:outline-none"
            >
              <TopChatbarIdentity
                isGroup={isGroupVariant}
                name={name}
                avatarSrc={avatarSrc}
                memberAvatars={memberAvatars}
                showViewProfile
              />
            </button>
          ) : (
            <TopChatbarIdentity
              isGroup={isGroupVariant}
              name={name}
              avatarSrc={avatarSrc}
              memberAvatars={memberAvatars}
            />
          )}
        </div>
      </div>

      <div className="relative flex shrink-0 items-center gap-4">
        <ChatbarIconButton
          label={refreshLabel}
          onClick={handleRefreshClick}
          disabled={isRefreshing}
        >
          <RefreshIcon
            className={cn(
              "text-tooltip-text block size-6",
              isRefreshing && "animate-spin motion-reduce:animate-none",
            )}
            aria-hidden
          />
        </ChatbarIconButton>

        <div ref={callMenuRef} className="relative flex items-center justify-center">
          <ChatbarIconButton label={phoneLabel} onClick={handleCallMenuToggle}>
            <PhoneGreenIcon className="block size-6" aria-hidden />
          </ChatbarIconButton>

          {isCallMenuOpen && useDesktopCallMenu ? (
            <OptionList
              variant="menu"
              items={callMenuItems}
              onItemClick={handleCallOptionClick}
              className="absolute top-[calc(100%+8px)] right-0 z-40"
            />
          ) : null}
        </div>

        {showLeftExpandIcon &&
          (showMenuChevron ? (
            <ChatbarIconButton label={menuLabel} onClick={onMenuClick}>
              <Image
                src="/assets/expanded.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 rotate-180 object-contain"
              />
            </ChatbarIconButton>
          ) : null)}
      </div>

      {!useDesktopCallMenu ? (
        <CallOptionsModal
          open={isCallMenuOpen}
          onOpenChange={setIsCallMenuOpen}
          name={name}
          items={callMenuItems}
          onItemClick={handleCallOptionClick}
        />
      ) : null}

      <ActiveCallModal
        open={isActiveCallOpen}
        onOpenChange={setIsActiveCallOpen}
        name={name}
        avatarSrc={avatarSrc}
        transcript="Hey, how are you doing honey? I’ve been waiting for you all day... What are you up to? Let’s have a chat, I’m getting bored. Tell me about your day! How was it? Hey, how are you doing honey? What are you up to? Let’s have a chat, I’m getting bored. Tell me about your day! How was it? Hey, how are you doing honey?"
      />

      <ResetChatModal
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        onConfirm={handleResetConfirm}
      />
    </header>
  );
}
