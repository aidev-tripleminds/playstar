import type { OptionListItem } from "@/components/common/general/option-list/option-list";

export type DotOptionProps = {
  items?: OptionListItem[];
  menuOpen?: boolean;
  defaultMenuOpen?: boolean;
  onMenuOpenChange?: (open: boolean) => void;
  onItemClick?: (value: string) => void;
  onTriggerClick?: () => void;
  ariaLabel?: string;
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
  btnClassName?: string;
  /** When true, opens the inline OptionList dropdown on mobile instead of trigger-only. */
  enableMobileMenu?: boolean;
};
