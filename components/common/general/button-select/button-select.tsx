"use client";

import Image from "next/image";
import * as React from "react";

import { AnchoredMenuPortal } from "@/components/common/general/anchored-menu-portal";
import { OptionList } from "@/components/common/general/option-list/option-list";
import { Tooltip } from "@/components/common/general/tooltip/tooltip";
import {
  RATIO_ICON_RATIOS,
  RatioIcon,
  type RatioIconRatio,
} from "@/components/common/generate/ratio-icon";
import { cn } from "@/lib/utils";

export type ButtonSelectOption = {
  value: string;
  label: string;
  icon?: React.ReactNode; // optional icon for wider-options variant
  disabled?: boolean;
};

export type ButtonSelectProps = {
  options?: ButtonSelectOption[];
  value?: string;
  imgIcon?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  menuLabel?: string;
  showButtonIcon?: boolean;
  showWide?: boolean;
  showOptionIcons?: boolean;
  /** When true, the trigger renders but the options menu never opens. */
  disableMenu?: boolean;
  /** Fires on trigger click even when `disableMenu` is true. */
  onTriggerClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** When false, hover tooltip is never shown. Defaults to true. */
  showTooltip?: boolean;
  className?: string;
  widthMode?: "content" | "trigger" | "wider-options";
  dropdownVerticalDirection?: "up" | "down";
  dropdownHorizontalAlign?: "left" | "right"; // only used in wider-options
};

const defaultOptions: ButtonSelectOption[] = [
  { value: "nano-banana-1", label: "Nano Banana 1" },
  { value: "nano-banana-2", label: "Nano Banana 2" },
  { value: "nano-banana-3", label: "Nano Banana 3" },
];

const defaultWiderOptions: ButtonSelectOption[] = [
  { value: "16:9", label: "16:9" },
  { value: "9:16", label: "9:16" },
  { value: "1:1", label: "1:1" },
  { value: "4:3", label: "4:3" },
  { value: "3:4", label: "3:4" },
];

function resolveRatioIconRatio(value: string): RatioIconRatio {
  return RATIO_ICON_RATIOS.includes(value as RatioIconRatio) ? (value as RatioIconRatio) : "4:3";
}

function isRatioIconRatio(value: string): value is RatioIconRatio {
  return RATIO_ICON_RATIOS.includes(value as RatioIconRatio);
}

function toOptionListItems(options: ButtonSelectOption[], showOptionIcons: boolean) {
  return options.map((option) => ({
    ...option,
    showIcon: showOptionIcons,
    leftIcon:
      option.icon ??
      (isRatioIconRatio(option.value) ? (
        <RatioIcon ratio={option.value} className="text-current" />
      ) : undefined),
  }));
}

// ─── Root ButtonSelect Component ──────────────────────────────────────────────

export function ButtonSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  menuLabel = "Lorem ipsum",
  showButtonIcon = true,
  imgIcon = "/assets/circle_help.svg",
  showOptionIcons = true,
  showWide = true,
  disableMenu = false,
  onTriggerClick,
  showTooltip = true,
  className,
  widthMode = "content",
  dropdownVerticalDirection = "up",
  dropdownHorizontalAlign = "left",
}: ButtonSelectProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const resolvedOptions =
    options ?? (widthMode === "wider-options" ? defaultWiderOptions : defaultOptions);

  const fallbackValue = resolvedOptions[0]?.value ?? "";
  const preferredDefaultValue = resolvedOptions[0]?.value ?? fallbackValue;
  const isControlled = value !== undefined;

  const [internalSelectedValue, setInternalSelectedValue] = React.useState(
    defaultValue ?? preferredDefaultValue,
  );
  const [open, setOpen] = React.useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  const isMenuOpen = open && !disableMenu;
  const isTooltipVisible = showTooltip && isTooltipOpen && !isMenuOpen;

  const selectedValue = isControlled ? value : internalSelectedValue;
  const selectedOption =
    resolvedOptions.find((o) => o.value === selectedValue) ?? resolvedOptions[0];

  // ─── Width lock (content/trigger modes) ────────────────────────────────────
  const measureRef = React.useRef<HTMLSpanElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (widthMode === "wider-options" || !measureRef.current) return;
    const longest = resolvedOptions.reduce((a, b) => (a.label.length > b.label.length ? a : b));
    measureRef.current.innerText = longest.label;
    setButtonWidth(measureRef.current.offsetWidth + 60);
  }, [resolvedOptions, widthMode]);

  const handleTriggerClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onTriggerClick?.(event);
    if (disableMenu) return;
    setOpen((prev) => !prev);
  };

  const handleTriggerMouseEnter = () => {
    if (!showTooltip) return;
    setIsTooltipOpen(true);
  };

  const handleTriggerMouseLeave = () => {
    setIsTooltipOpen(false);
  };

  const handleSelect = (val: string) => {
    const option = resolvedOptions.find((item) => item.value === val);
    if (option?.disabled) {
      onValueChange?.(val);
      setOpen(false);
      return;
    }

    if (!isControlled) {
      setInternalSelectedValue(val);
    }
    onValueChange?.(val);
    setOpen(false);
  };

  // Close on outside click / Escape
  React.useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen]);

  // ─── wider-options variant ──────────────────────────────────────────────────
  if (widthMode === "wider-options") {
    return (
      <div ref={containerRef} className="relative inline-flex">
        <Tooltip text={menuLabel} open={isTooltipVisible}>
          <button
            onClick={handleTriggerClick}
            onMouseEnter={handleTriggerMouseEnter}
            onMouseLeave={handleTriggerMouseLeave}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all",
              "bg-tooltip-default-bg text-tooltip-text",
              "border-surface-strong! border",
              "hover:bg-surface-strong",
              "active:border-tooltip-left-bg",
              isMenuOpen && "bg-surface-strong border-tooltip-left-bg! border",
              className,
            )}
          >
            {showButtonIcon ? (
              <RatioIcon ratio={resolveRatioIconRatio(selectedOption.value)} />
            ) : null}
            <span>{selectedOption.label}</span>
          </button>
        </Tooltip>

        <AnchoredMenuPortal
          open={isMenuOpen}
          anchorRef={containerRef}
          menuRef={menuRef}
          verticalDirection={dropdownVerticalDirection}
          horizontalAlign={dropdownHorizontalAlign}
          slot="button-select-dropdown"
        >
          <OptionList
            title={menuLabel}
            items={toOptionListItems(resolvedOptions, showOptionIcons)}
            value={selectedOption.value}
            onValueChange={handleSelect}
            onDisabledItemClick={handleSelect}
            className="w-[220px]"
          />
        </AnchoredMenuPortal>
      </div>
    );
  }

  // ─── original content / trigger variants ───────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={cn("relative", widthMode === "trigger" ? "w-full" : "inline-flex")}
    >
      <Tooltip text={menuLabel} open={isTooltipVisible}>
        <button
          onClick={handleTriggerClick}
          onMouseEnter={handleTriggerMouseEnter}
          onMouseLeave={handleTriggerMouseLeave}
          style={widthMode === "content" && buttonWidth ? { width: buttonWidth } : undefined}
          className={cn(
            "border-option-hover bg-tooltip-default-bg text-tooltip-text shadow-toggle-thumb-shadow hover:bg-surface-strong inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-3",
            "border-surface-strong! border",
            "hover:bg-surface-strong",
            "active:border-tooltip-left-bg",
            isMenuOpen && "bg-surface-strong border-tooltip-left-bg! border",
            widthMode === "trigger" ? "w-full" : "",
            className,
          )}
        >
          {showButtonIcon ? (
            <span className="relative size-5 shrink-0">
              <Image src={imgIcon} alt="" fill />
            </span>
          ) : null}
          <span className="text-sm font-medium whitespace-nowrap">{selectedOption.label}</span>
        </button>
      </Tooltip>

      <AnchoredMenuPortal
        open={isMenuOpen}
        anchorRef={containerRef}
        menuRef={menuRef}
        verticalDirection={dropdownVerticalDirection}
        matchAnchorWidth={widthMode === "trigger"}
        className={widthMode === "trigger" ? "w-full" : "w-auto max-w-[min(90vw,400px)]"}
        slot="button-select-dropdown"
      >
        <OptionList
          title={menuLabel}
          items={toOptionListItems(resolvedOptions, showOptionIcons)}
          value={selectedOption.value}
          onValueChange={handleSelect}
          onDisabledItemClick={handleSelect}
          className={cn(widthMode === "trigger" ? "w-full" : "w-auto min-w-full")}
        />
      </AnchoredMenuPortal>
      {showWide && (
        <span
          ref={measureRef}
          className="invisible absolute px-7 text-sm font-medium whitespace-nowrap"
        />
      )}
    </div>
  );
}
