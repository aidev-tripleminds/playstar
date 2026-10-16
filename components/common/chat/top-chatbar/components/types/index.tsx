import type * as React from "react";

import type { OptionListItem } from "@/components/common/general/option-list/option-list";

export type TopChatbarStatus = "default" | "mobile" | "group" | "group-mobile" | "call";

export type TopChatbarProps = Omit<React.ComponentProps<"header">, "children"> & {
  status?: TopChatbarStatus;
  name?: string;
  avatarSrc?: string;
  memberAvatars?: string[];
  callMenuItems?: OptionListItem[];
  onBackClick?: () => void;
  onSidebarClick?: () => void;
  onRefreshClick?: () => void;
  onPhoneClick?: () => void;
  onSettingsClick?: () => void;
  onMenuClick?: () => void;
  onCallOptionClick?: (value: string) => void;
  /** When it returns false, the active call screen is not opened (e.g. signup required). */
  onBeforeCallOption?: () => boolean;
  backLabel?: string;
  sidebarLabel?: string;
  refreshLabel?: string;
  phoneLabel?: string;
  settingsLabel?: string;
  menuLabel?: string;
  showExpandIcon?: boolean;
  /** When false, the leading sidebar control points inward (collapse) instead of outward (expand). */
  sidebarCollapsed?: boolean;
  showLeftExpandIcon?: boolean;
  isRefreshing?: boolean;
};
