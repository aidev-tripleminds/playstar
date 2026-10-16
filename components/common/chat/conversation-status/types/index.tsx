import type * as React from "react";

import { type OptionListItem } from "@/components/common/general/option-list/option-list";

import type { AvatarGroupPersons } from "../../avatar-group/constants";
import type { ConversationStatusState } from "../components/constants";

export type ConversationStatusProps = Omit<React.ComponentProps<"div">, "children" | "onClick"> & {
  status?: ConversationStatusState;
  onClick?: React.ComponentProps<"button">["onClick"];
  name?: string;
  preview?: string;
  avatarSrc?: string;
  /** Custom avatar node; when set, replaces the default image / avatar group. */
  avatar?: React.ReactNode;
  memberAvatars?: readonly string[];
  avatarGroupPersons?: AvatarGroupPersons;
  dotMenuItems?: OptionListItem[];
  menuOpen?: boolean;
  defaultMenuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  onDotItemClick?: (value: string) => void;
  /** Fires when the three-dot trigger is pressed (desktop and mobile). */
  onDotTriggerClick?: () => void;
  /** Shows the pin icon even when status is not `"pinned"` (e.g. focused + pinned). */
  isPinned?: boolean;
  showRadioIndicator?: boolean;
  /**
   * Rose radio indicator = unread. Muted = read.
   * Only applies when the radio indicator is shown (`status="radio"` or `showRadioIndicator`).
   * Active/selected state is `status="radio"` / `status="focus"`, not this prop.
   */
  radioChecked?: boolean;
  /** When false, hides the avatar / avatar group (e.g. chat history radio rows). Defaults to hidden for `memory`. */
  showAvatar?: boolean;
  disabled?: boolean;
  buttonType?: React.ComponentProps<"button">["type"];
  dotAriaLabel?: string;
  /** Allows the three-dot menu to open on mobile (passed through to DotOption). */
  enableMobileMenu?: boolean;
  previewLineClamp?: 1 | 2;
  /** Disables row hover background and three-dot menu (e.g. AI suggestion rows). */
  disableHoverActions?: boolean;
  /** When false, hides the three-dot menu while still allowing row hover background. */
  showDotMenu?: boolean;
  /** Use `"li"` when rendering inside a `<ul>` / `<ol>`. */
  as?: "div" | "li";
};
