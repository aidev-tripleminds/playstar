"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import {
  OptionList,
  type OptionListItem,
} from "@/components/common/general/option-list/option-list";
import { cn } from "@/lib/utils";
import { HelpIcon } from "@/public/assets/icons/circle-help";

const dropdownVariants = cva(
  "flex w-[250px] cursor-pointer items-center gap-2 rounded-full border bg-tooltip-default-bg p-3 text-sm leading-5 font-medium transition-colors",
  {
    variants: {
      status: {
        default: "border-border-strong",
        focus: "border-border-focus",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

/* ✅ NEW: width mode type */
type DropdownWidthMode = "content" | "trigger";

export type DropdownOption = string | OptionListItem;

export type DropdownProps = VariantProps<typeof dropdownVariants> & {
  label?: string;
  value?: string;
  options?: DropdownOption[];
  onValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  showLabel?: boolean;
  className?: string;
  /** Overrides the trigger wrapper width. */
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  leftIconSrc?: string;
  widthMode?: DropdownWidthMode;
  /**
   * When true, the trigger does not open the option menu.
   * Use with `onTriggerClick` to open a modal instead.
   */
  disableMenu?: boolean;
  onTriggerClick?: () => void;
  /** Controlled expanded chrome (border/chevron), e.g. while a picker modal is open. */
  expanded?: boolean;
  /** Controlled overlay open state. Omit for uncontrolled. */
  open?: boolean;
  /** Replaces the default option list. Rendered in the overlay when open. */
  menu?: React.ReactNode;
  /** Caps the overlay height. Also clamped to remaining viewport space. */
  menuMaxHeight?: number;
  /** Extra classes on the overlay. */
  menuClassName?: string;
  /** When false, the overlay sizes to its content instead of remaining viewport space. */
  clampMenuHeight?: boolean;
};

function normalizeDropdownOptions(options: DropdownOption[]): OptionListItem[] {
  return options.map((option) =>
    typeof option === "string"
      ? {
          value: option,
          label: option,
        }
      : option,
  );
}

export function Dropdown({
  status = "default",
  label = "Style:",
  showLabel = true,
  value = "Any",
  options = ["Any", "Rose", "Neutral", "Premium"],
  onValueChange,
  onOpenChange,
  showLeftIcon = true,
  showRightIcon = true,
  leftIcon = <HelpIcon className="text-text-muted-strong size-5 shrink-0" />,
  leftIconSrc,
  className,
  containerClassName,
  disableMenu = false,
  onTriggerClick,
  expanded,
  open,
  menu,
  menuMaxHeight,
  menuClassName,
  clampMenuHeight = true,

  /* ✅ default = content-based */
  widthMode = "content",
}: DropdownProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const isOpenControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);
  const isMenuOpen = (isOpenControlled ? open : uncontrolledOpen) && !disableMenu;

  const selectedValue = value ?? internalValue;
  const normalizedOptions = React.useMemo(() => normalizeDropdownOptions(options), [options]);

  const setMenuOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange],
  );

  React.useLayoutEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const menu = menuRef.current;
    if (!menu) {
      return;
    }

    const update = () => {
      if (!clampMenuHeight) {
        menu.style.maxHeight = "";
        return;
      }

      const top = menu.getBoundingClientRect().top;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const available = Math.max(0, viewportHeight - top - 16);
      const maxHeight = menuMaxHeight == null ? available : Math.min(menuMaxHeight, available);
      menu.style.maxHeight = `${maxHeight}px`;
    };

    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, [clampMenuHeight, isMenuOpen, menuMaxHeight]);

  React.useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen, setMenuOpen]);

  const isExpanded = expanded ?? isMenuOpen;
  const borderStatus = isExpanded ? "focus" : status;

  const selectedOption =
    normalizedOptions.find((option) => option.value === selectedValue) ?? normalizedOptions[0];
  const selectedOptionValue = selectedOption?.value ?? "";
  const selectedOptionLabel = selectedOption?.label ?? selectedOptionValue;

  const handleSelect = (nextValue: string) => {
    setInternalValue(nextValue);
    onValueChange?.(nextValue);
    setMenuOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative",
        widthMode === "trigger" ? "w-full" : "w-[250px]",
        isMenuOpen && "z-50",
        containerClassName,
      )}
    >
      {/* Trigger */}
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-haspopup={disableMenu ? "dialog" : "listbox"}
        onClick={() => {
          if (disableMenu) {
            onTriggerClick?.();
            return;
          }
          setMenuOpen(!isMenuOpen);
        }}
        className={cn(dropdownVariants({ status: borderStatus }), "w-full", className)}
      >
        {showLeftIcon ? (
          leftIconSrc ? (
            <Image
              src={leftIconSrc}
              alt="left icon"
              width={20}
              height={20}
              className="size-5 shrink-0"
            />
          ) : (
            leftIcon
          )
        ) : null}
        <div className="flex min-w-0 flex-1 items-center gap-1">
          {showLabel && <span className="text-text-muted-strong shrink-0">{label}</span>}
          <span
            className={cn(
              "text-text-inverse truncate",
              widthMode === "trigger" && showLabel && "ml-auto text-right",
            )}
          >
            {selectedOptionLabel}
          </span>
        </div>

        {showRightIcon ? (
          <ChevronDown
            className={cn(
              "text-text-muted-strong size-5 shrink-0 transition-transform duration-200",
              isExpanded ? "rotate-180" : "rotate-0",
            )}
          />
        ) : null}
      </button>

      {isMenuOpen ? (
        <div
          ref={menuRef}
          data-slot="dropdown-menu"
          className={cn(
            "absolute top-full left-0 z-50 mt-1 flex min-h-0 flex-col overflow-hidden rounded-[24px] shadow-[var(--select-content-shadow)]",
            widthMode === "trigger" ? "w-full" : "w-max",
            menuClassName,
          )}
        >
          {menu ?? (
            <OptionList
              variant="menu"
              items={normalizedOptions.map((option) => ({
                ...option,
                highlighted: option.value === selectedOptionValue,
              }))}
              onItemClick={handleSelect}
              className={cn(
                "max-h-[min(280px,50vh,100%)] min-h-0 overflow-y-auto shadow-none",
                "w-full",
              )}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}
