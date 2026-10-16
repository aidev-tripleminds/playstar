import * as React from "react";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn } from "@/lib/utils";

import { Buttons, type ButtonVariant } from "../general/button/buttons";
import {
  BottomNavigation,
  type BottomNavigationProps,
  type BottomNavigationTab,
} from "./bottom-navigation";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const buttonNavShadowsVariants = [
  "nav-only",
  "nav-plus-one-button",
  "nav-plus-two-buttons",
  "one-button-only",
  "two-buttons-only",
] as const;

export type ButtonNavShadowsVariant = (typeof buttonNavShadowsVariants)[number];

export type ButtonNavShadowsProps = Omit<React.ComponentProps<"div">, "children"> & {
  children?: React.ReactNode;
  btnOneChildren?: React.ReactNode;
  btnTwoChildren?: React.ReactNode;
  childrenPlacement?: "left" | "right";
  variant?: ButtonNavShadowsVariant;
  btnSingleVariant?: ButtonVariant;
  btnOneVariant?: ButtonVariant;
  btnOneClass?: string;
  btnTwoClass?: string;
  /** Classes for the row that holds the two action buttons. */
  buttonsRowClassName?: string;
  singleBtnClass?: string;
  leftIconSrc?: string;
  rightIconSrc?: string;
  rightIconSizeClassName?: string;
  leftIconSizeClassName?: string;
  btnTwoVariant?: ButtonVariant;
  label?: string;
  singleBtnLeftIcon?: boolean;
  singleBtnRightIcon?: boolean;
  btnOneLeftIcon?: boolean;
  btnOneRightIcon?: boolean;
  btnTwoLeftIcon?: boolean;
  btnTwoRightIcon?: boolean;
  navLabel?: string;
  activeTab?: BottomNavigationTab;
  defaultActiveTab?: BottomNavigationTab;
  isPremiumUser?: boolean;
  leftIconNode?: React.ReactNode;
  rightIconNode?: React.ReactNode;
  OneleftIconNode?: React.ReactNode;
  oneRightIconNode?: React.ReactNode;
  TwoleftIconNode2?: React.ReactNode;
  twoRightIconNode?: React.ReactNode;
  premiumBadgeText?: string;
  showPremiumBadge?: boolean;
  onTabClick?: BottomNavigationProps["onTabClick"];
  primaryButtonLabel?: string;
  secondaryButtonLabel?: string;
  primaryButtonDisabled?: boolean;
  secondaryButtonDisabled?: boolean;
  onPrimaryButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
  onSecondaryButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function ButtonNavShadows({
  className,
  children,
  btnOneChildren,
  btnTwoChildren,
  childrenPlacement = "left",
  btnSingleVariant = "rose",
  btnOneVariant = "light-grey",
  btnOneClass,
  btnTwoClass,
  buttonsRowClassName,
  singleBtnClass,
  btnTwoVariant = "light-grey",
  variant = "nav-only",
  label = "Button nav shadows",
  navLabel = "Bottom navigation",
  activeTab,
  singleBtnLeftIcon,
  rightIconSizeClassName,
  leftIconSizeClassName,
  singleBtnRightIcon = false,
  btnOneLeftIcon = false,
  btnOneRightIcon = false,
  btnTwoLeftIcon = false,
  btnTwoRightIcon = false,
  leftIconNode,
  rightIconSrc,
  leftIconSrc,
  rightIconNode,
  OneleftIconNode,
  oneRightIconNode,
  TwoleftIconNode2,
  twoRightIconNode,
  defaultActiveTab = "explore",
  isPremiumUser = false,
  premiumBadgeText = "-75%",
  showPremiumBadge = true,
  onTabClick,
  primaryButtonLabel = "Click me",
  secondaryButtonLabel = "Click me",
  primaryButtonDisabled = false,
  secondaryButtonDisabled = false,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  ...props
}: ButtonNavShadowsProps) {
  const showNavigation = variant !== "one-button-only" && variant !== "two-buttons-only";
  const showSingleButton = variant === "nav-plus-one-button" || variant === "one-button-only";
  const showTwoButtons = variant === "nav-plus-two-buttons" || variant === "two-buttons-only";
  //buttons variants  colors
  const isOneBtn = variant === "one-button-only" || variant === "nav-plus-one-button";
  const isTwoBtn = variant === "two-buttons-only" || variant === "nav-plus-two-buttons";
  const isNavOnly = variant === "nav-only";
  const isDesktop = useIsDesktop();

  return (
    <div aria-label={label} className={cn("h-full w-full overflow-visible", className)} {...props}>
      <div
        className={cn(
          "relative p-4",
          // isOneBtn && "bg-one-btn",
          // isTwoBtn && "bg-two-btn",
          // Visible so the underfill can extend past the 16px gutter and cover
          // the HUD / home-indicator strip. Overflow-hidden clipped that fill.
          isNavOnly && "overflow-visible",
        )}
      >
        {isNavOnly ? (
          <>
            <div
              aria-hidden
              data-slot="button-nav-shadow-fade"
              className="pointer-events-none absolute inset-x-0 top-0 bottom-4 bg-[linear-gradient(180deg,rgba(14,14,14,0)_0%,#0E0E0E_100%)]"
            />
            <div
              aria-hidden
              data-slot="button-nav-shadow-underfill"
              className="bg-dialog-bg pointer-events-none absolute inset-x-0 top-4 -bottom-24"
            />
          </>
        ) : null}
        <div className="relative z-10 space-y-3">
          {showSingleButton ? (
            <div className="flex items-center justify-center">
              <Buttons
                rightIconSizeClassName={rightIconSizeClassName}
                leftIconSizeClassName={leftIconSizeClassName}
                rightIconSrc={rightIconSrc}
                leftIconSrc={leftIconSrc}
                variant={btnSingleVariant}
                size={isDesktop ? "btn-l" : "btn-m"}
                className={singleBtnClass}
                label={primaryButtonLabel}
                leftIconNode={leftIconNode}
                rightIconNode={rightIconNode}
                leftIcon={singleBtnLeftIcon ?? variant === "one-button-only"}
                rightIcon={singleBtnRightIcon}
                disabled={primaryButtonDisabled}
                onClick={onPrimaryButtonClick}
              >
                {children}
              </Buttons>
            </div>
          ) : null}

          {showTwoButtons ? (
            <div className={cn("flex items-center justify-center gap-2", buttonsRowClassName)}>
              <Buttons
                variant={btnOneVariant}
                rightIconSizeClassName={rightIconSizeClassName}
                leftIconSizeClassName={leftIconSizeClassName}
                size={isDesktop ? "btn-l" : "btn-m"}
                className={btnOneClass}
                rightIconSrc={rightIconSrc}
                leftIconSrc={leftIconSrc}
                label={primaryButtonLabel}
                leftIconNode={OneleftIconNode}
                rightIconNode={oneRightIconNode}
                leftIcon={btnOneLeftIcon}
                rightIcon={btnOneRightIcon}
                disabled={primaryButtonDisabled}
                onClick={onPrimaryButtonClick}
              >
                {childrenPlacement === "left" ? children : btnOneChildren}
              </Buttons>
              <Buttons
                variant={btnTwoVariant}
                rightIconSizeClassName={rightIconSizeClassName}
                leftIconSizeClassName={leftIconSizeClassName}
                size={isDesktop ? "btn-l" : "btn-m"}
                className={btnTwoClass}
                rightIconSrc={rightIconSrc}
                leftIconSrc={leftIconSrc}
                label={secondaryButtonLabel}
                leftIconNode={TwoleftIconNode2}
                rightIconNode={twoRightIconNode}
                leftIcon={btnTwoLeftIcon}
                rightIcon={btnTwoRightIcon}
                disabled={secondaryButtonDisabled}
                onClick={onSecondaryButtonClick}
              >
                {childrenPlacement === "right" ? children : btnTwoChildren}
              </Buttons>
            </div>
          ) : null}

          {showNavigation ? (
            <BottomNavigation
              label={navLabel}
              activeTab={activeTab}
              defaultActiveTab={defaultActiveTab}
              isPremiumUser={isPremiumUser}
              premiumBadgeText={premiumBadgeText}
              showPremiumBadge={showPremiumBadge}
              onTabClick={onTabClick}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
