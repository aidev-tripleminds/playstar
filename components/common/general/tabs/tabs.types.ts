import type { StaticImageData } from "next/image";
import type * as React from "react";

export type TabsVariant = "underlined" | "compact" | "lines" | "link";

export type CompactLayout = "stack" | "segmented" | "scroll";

export type Tab = {
  label: string;
  subLabel?: string;
  leftIconSrc?: string | StaticImageData | React.ReactNode;
  showBadge?: boolean;
  /**
   * URL this tab also exists at, for the `link` variant only. Renders the tab
   * as a real anchor instead of a button, so a crawler can follow it and a
   * visitor can middle-click or copy it — while a plain left click still runs
   * `onChange` and nothing navigates.
   *
   * Only for a tab whose content genuinely has its own URL (`/generate-image`
   * next to `/generate`). A tab that is pure in-page state must leave this
   * unset, or it advertises a link that 404s.
   */
  href?: string;
  /** Shown at full color. A click does nothing and it is not a link. */
  disabled?: boolean;
};

export type TabsProps = {
  variant?: TabsVariant;
  tabs?: Tab[];
  compactLayout?: CompactLayout;
  selected?: number;
  defaultSelected?: number;
  onChange?: (index: number) => void;
  /**
   * A tab's `href` is being opened by the BROWSER rather than by this component
   * — a cmd/ctrl/middle click, which deliberately falls through so a new tab
   * opens. `onChange` does not fire for those, so this is the page's only
   * notice that another document is about to read state this one may not have
   * written yet. It cannot delay the navigation: treat it as a chance to start
   * a save, not a guarantee that one finishes.
   */
  onNavigate?: (index: number) => void;
  unstyled?: boolean;
  className?: string;
  scrollArrows?: "desktop" | false;
  showTabIcon?: boolean;
  listLabel?: string;
};

export type TabSelectionOptions = Pick<TabsProps, "selected" | "defaultSelected" | "onChange">;

export type LinkTabsProps = TabSelectionOptions &
  Pick<TabsProps, "onNavigate"> & {
    tabs: Tab[];
    showTabIcon?: boolean;
    listLabel?: string;
  };

export type CompactTabsProps = {
  tabs: Tab[];
  layout: CompactLayout;
  selected?: number;
  defaultSelected?: number;
  onChange?: (index: number) => void;
  /** Same as {@link TabsProps.onNavigate}. */
  onNavigate?: (index: number) => void;
  scrollArrows?: "desktop" | false;
  showTabIcon?: boolean;
};
