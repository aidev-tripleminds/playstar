import type { OptionListItem } from "@/components/common/general/option-list/option-list";
import { GalleryIcon, PlayVideoIcon, TrashIcon, VideoSquareIcon } from "@/public/assets/icons";

export type ProfileSettingsMenuTarget = "banner" | "photo" | null;

export type EditIconButtonProps = {
  ariaLabel: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
};

export const profileSettingsPhotoMenuItems: OptionListItem[] = [
  {
    value: "change-picture",
    label: "Change picture",
    leftIconSrc: <GalleryIcon />,
  },
  {
    value: "animate",
    label: "Animate",
    leftIconSrc: <PlayVideoIcon />,
  },
  {
    value: "add-video",
    label: "Add video",
    leftIconSrc: <VideoSquareIcon />,
  },
];

export const profileSettingsBannerMenuItems: OptionListItem[] = [
  {
    value: "change-banner",
    label: "Change banner",
    leftIconSrc: <GalleryIcon />,
  },
  {
    value: "delete-banner",
    label: "Delete banner",
    leftIconSrc: <TrashIcon />,
  },
];

export type ProfileSettingsPreviewProps = React.ComponentProps<"div"> & {
  bannerSrc?: string;
  bannerAlt?: string;
  avatarSrc?: string;
  avatarAlt?: string;
  openMenu?: ProfileSettingsMenuTarget;
  defaultOpenMenu?: ProfileSettingsMenuTarget;
  onOpenMenuChange?: (menu: ProfileSettingsMenuTarget) => void;
  photoMenuItems?: OptionListItem[];
  bannerMenuItems?: OptionListItem[];
  onPhotoMenuAction?: (action: string) => void;
  onBannerMenuAction?: (action: string) => void;
  onBannerEditClick?: () => void;
  onPhotoEditClick?: () => void;
};
