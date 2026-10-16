"use client";

import Image from "next/image";
import * as React from "react";

import { OptionList } from "@/components/common/general/option-list/option-list";
import { resolveAsset } from "@/lib/assets/asset-store";
import { cn } from "@/lib/utils";

import EditIconButton from "./components/edit-icon";
import type { ProfileSettingsMenuTarget, ProfileSettingsPreviewProps } from "./types";
import { profileSettingsBannerMenuItems, profileSettingsPhotoMenuItems } from "./types";

export function ProfileSettingsPreview({
  bannerSrc = resolveAsset("demo_pics_cat_cover").image ?? "",
  bannerAlt = "Profile banner",
  avatarSrc = resolveAsset("demo_pics_profile2").image ?? "",
  avatarAlt = "Profile photo",
  openMenu: openMenuProp,
  defaultOpenMenu = null,
  onOpenMenuChange,
  photoMenuItems = profileSettingsPhotoMenuItems,
  bannerMenuItems = profileSettingsBannerMenuItems,
  onPhotoMenuAction,
  onBannerMenuAction,
  onBannerEditClick,
  onPhotoEditClick,
  className,
  ...props
}: ProfileSettingsPreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [internalOpenMenu, setInternalOpenMenu] =
    React.useState<ProfileSettingsMenuTarget>(defaultOpenMenu);

  const openMenu = openMenuProp ?? internalOpenMenu;

  const setOpenMenu = React.useCallback(
    (menu: ProfileSettingsMenuTarget) => {
      if (openMenuProp === undefined) {
        setInternalOpenMenu(menu);
      }
      onOpenMenuChange?.(menu);
    },
    [onOpenMenuChange, openMenuProp],
  );

  const toggleMenu = React.useCallback(
    (target: Exclude<ProfileSettingsMenuTarget, null>) => {
      setOpenMenu(openMenu === target ? null : target);
    },
    [openMenu, setOpenMenu],
  );

  // Close on outside click or Escape
  React.useEffect(() => {
    if (!openMenu) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openMenu, setOpenMenu]);

  const handleBannerEdit = () => {
    onBannerEditClick?.();
    if (window.innerWidth < 768) return;
    toggleMenu("banner");
  };

  const handlePhotoEdit = () => {
    onPhotoEditClick?.();
    if (window.innerWidth < 768) return;
    toggleMenu("photo");
  };

  return (
    <div
      ref={containerRef}
      data-slot="profile-settings-preview"
      className={cn("relative w-full font-[Onest]", className)}
      {...props}
    >
      {/* ── Banner ─────────────────────────────────────────────────────────── */}
      <div className="relative w-full">
        <div className="relative h-[127px] w-full overflow-hidden rounded-[16px] md:h-[170px]">
          <Image
            src={bannerSrc}
            alt={bannerAlt}
            priority
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute top-3 right-3 z-10">
          <EditIconButton
            ariaLabel="Edit banner"
            onClick={handleBannerEdit}
            isActive={openMenu === "banner"}
          />

          {openMenu === "banner" && (
            <OptionList
              variant="menu"
              items={bannerMenuItems}
              className={cn("absolute top-full right-0 z-20 mt-2 min-w-[162px]")}
              onItemClick={(value) => {
                onBannerMenuAction?.(value);
                setOpenMenu(null);
              }}
            />
          )}
        </div>
      </div>

      {/* ── Avatar ─────────────────────────────────────────────────────────── */}
      <div className="relative -mt-[38px] ml-4 w-fit md:-mt-[52px] md:ml-4">
        <div
          className={cn(
            "relative size-30 overflow-hidden rounded-full",
            "border-tooltip-default-bg border-[3px] md:border-4",
          )}
        >
          <Image src={avatarSrc} alt={avatarAlt} fill className="object-cover" sizes="120px" />
        </div>
        <div className="absolute top-0 right-0 z-10">
          <EditIconButton
            ariaLabel="Edit profile photo"
            onClick={handlePhotoEdit}
            className="bg-tooltip-default-bg"
          />

          {openMenu === "photo" && (
            <OptionList
              variant="menu"
              items={photoMenuItems}
              className={cn(
                "absolute z-20 min-w-[162px]",
                "top-full left-0 mt-2",
                "sm:top-0 sm:left-full sm:mt-0 sm:ml-2",
              )}
              onItemClick={(value) => {
                onPhotoMenuAction?.(value);
                setOpenMenu(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
