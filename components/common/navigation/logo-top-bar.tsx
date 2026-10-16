"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { createPortal } from "react-dom";

import { OptionList } from "@/components/common/general/option-list/option-list";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { SIDE_NAV_TOGGLE_ICON_OPEN_CLASS } from "./side-nav/side-nav.constants";

export type LogoTopBarGenderOption = "woman" | "man";

const logoTopBarVariants = cva("relative inline-flex items-center", {
  variants: {
    mode: {
      desktop: "",
      mobile: "",
      responsive: "",
    },
  },
  defaultVariants: {
    mode: "responsive",
  },
});

export type LogoTopBarProps = Omit<React.ComponentProps<"div">, "children"> &
  VariantProps<typeof logoTopBarVariants> & {
    label?: string;
    selectedOption?: LogoTopBarGenderOption;
    defaultOption?: LogoTopBarGenderOption;
    onOptionChange?: (value: LogoTopBarGenderOption) => void;
    onMobileMenuClick?: React.MouseEventHandler<HTMLButtonElement>;
    /** When provided, drives the expand-icon horizontal mirror (e.g. mobile sidebar open). */
    mobileMenuOpen?: boolean;
    /**
     * Renders the mobile sidebar toggle. Set `false` where there is no sidebar
     * for it to open (the funnel), so the bar shows the logo alone instead of a
     * button that toggles nothing.
     */
    showMobileMenuButton?: boolean;
  };

function PlaystarLogoLink({ href, className }: { href: string; className: string }) {
  return (
    <Link
      href={href}
      aria-label="Playstar home"
      className={cn(
        "text-foreground inline-flex h-6 items-center text-lg leading-none font-semibold tracking-tight",
        className,
      )}
    >
      Playstar
    </Link>
  );
}

type LogoTopBarProfileSelectorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOption: LogoTopBarGenderOption;
  selectedIconSrc: string;
  selectedLabel: string;
  onSelectOption: (value: LogoTopBarGenderOption) => void;
  iconClassName: string;
  chevronClassName: string;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
};

function LogoTopBarProfileSelector({
  open,
  onOpenChange,
  selectedOption,
  selectedIconSrc,
  selectedLabel,
  onSelectOption,
  iconClassName,
  chevronClassName,
  dropdownRef,
}: LogoTopBarProfileSelectorProps) {
  const selectorRef = React.useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = React.useState<{ top: number; left: number } | null>(
    null,
  );

  React.useLayoutEffect(() => {
    if (!open || !selectorRef.current) {
      setMenuPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!selectorRef.current) return;

      const style = window.getComputedStyle(selectorRef.current);
      if (style.display === "none" || style.visibility === "hidden") {
        setMenuPosition(null);
        return;
      }

      const rect = selectorRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.left - 40,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const optionList = (
    <OptionList
      title="Select gender"
      items={[
        { value: "woman", label: "Woman", showIcon: true, leftIconSrc: "/assets/woman.svg" },
        { value: "man", label: "Men", showIcon: true, leftIconSrc: "/assets/man.svg" },
      ]}
      value={selectedOption}
      onValueChange={(value) => onSelectOption(value as LogoTopBarGenderOption)}
      className="w-max"
    />
  );

  return (
    <div ref={selectorRef} className="relative">
      <div className="flex items-center">
        <div className={cn("relative", iconClassName)}>
          <Image
            src={selectedIconSrc}
            alt={`${selectedLabel} option`}
            fill
            className="object-cover"
          />
        </div>
        <button
          type="button"
          aria-label="Open gender options"
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn("relative cursor-pointer", chevronClassName)}
          onClick={(event) => {
            event.stopPropagation();
            onOpenChange(!open);
          }}
        >
          <Image
            src="/assets/chevron-down.svg"
            alt="Open menu"
            fill
            className={`object-contain ${open ? "rotate-180" : ""} `}
          />
        </button>
      </div>

      {open && menuPosition && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={dropdownRef}
              className="fixed z-100 w-max"
              style={{ top: menuPosition.top, left: menuPosition.left }}
            >
              {optionList}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export function LogoTopBar({
  mode = "responsive",
  className,
  label = "Logo top bar",
  selectedOption: selectedOptionControlled,
  defaultOption = "woman",
  onOptionChange,
  onMobileMenuClick,
  mobileMenuOpen,
  showMobileMenuButton = true,
  ...props
}: LogoTopBarProps) {
  const logoHref = ROUTES.generate;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [internalMenuOpen, setInternalMenuOpen] = React.useState(false);
  const isMenuOpenControlled = mobileMenuOpen !== undefined;
  const isMenuActive = isMenuOpenControlled ? mobileMenuOpen : internalMenuOpen;
  const [internalSelectedOption, setInternalSelectedOption] = React.useState(defaultOption);
  const isSelectedOptionControlled = selectedOptionControlled !== undefined;
  const selectedOption = isSelectedOptionControlled
    ? selectedOptionControlled
    : internalSelectedOption;
  const [prevDefaultOption, setPrevDefaultOption] = React.useState(defaultOption);

  if (!isSelectedOptionControlled && defaultOption !== prevDefaultOption) {
    setPrevDefaultOption(defaultOption);
    setInternalSelectedOption(defaultOption);
  }

  React.useEffect(() => {
    if (!open) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (containerRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const showMobile = mode !== "desktop";
  const showDesktop = mode !== "mobile";
  const mobileClassName =
    mode === "responsive" ? "flex items-center gap-[6px] md:hidden" : "flex items-center gap-[6px]";
  const desktopClassName =
    mode === "responsive" ? "hidden items-center gap-2 md:flex" : "flex items-center gap-2";

  const selectOption = (value: LogoTopBarGenderOption) => {
    if (!isSelectedOptionControlled) {
      setInternalSelectedOption(value);
    }
    onOptionChange?.(value);
    setOpen(false);
  };

  const selectedIconSrc = selectedOption === "woman" ? "/assets/woman.svg" : "/assets/man.svg";
  const selectedLabel = selectedOption === "woman" ? "Woman" : "Man";

  const profileSelector = (
    <LogoTopBarProfileSelector
      open={open}
      onOpenChange={setOpen}
      selectedOption={selectedOption}
      selectedIconSrc={selectedIconSrc}
      selectedLabel={selectedLabel}
      onSelectOption={selectOption}
      dropdownRef={dropdownRef}
      iconClassName={mode === "mobile" ? "h-4 w-4" : "h-5 w-5"}
      chevronClassName={mode === "mobile" ? "h-3 w-3" : "h-4 w-4"}
    />
  );

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={label}
      className={cn(logoTopBarVariants({ mode }), className)}
      {...props}
    >
      {showMobile ? (
        <div className={mobileClassName}>
          {showMobileMenuButton ? (
            <button
              type="button"
              aria-label="Toggle sidebar"
              aria-expanded={isMenuActive}
              className="text-tooltip-text relative size-6 shrink-0 cursor-pointer rounded-full"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (!isMenuOpenControlled) {
                  setInternalMenuOpen((prev) => !prev);
                }
                onMobileMenuClick?.(event);
              }}
            >
              <Image
                src="/assets/expanded.svg"
                alt=""
                aria-hidden
                width={24}
                height={24}
                className={cn(
                  "size-6 object-contain",
                  isMenuActive && SIDE_NAV_TOGGLE_ICON_OPEN_CLASS,
                )}
              />
            </button>
          ) : null}

          <PlaystarLogoLink href={logoHref} className="h-6" />

          {/* {profileSelector} */}
        </div>
      ) : null}

      {showDesktop ? (
        <div className={desktopClassName}>
          <PlaystarLogoLink href={logoHref} className="h-6" />

          {/* {profileSelector} */}
        </div>
      ) : null}
    </div>
  );
}
