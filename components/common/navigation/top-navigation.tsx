"use client";

import { cva } from "class-variance-authority";
import * as React from "react";

import { useAuthGate } from "@/components/common/auth/auth-gate";
import { cn } from "@/lib/utils";

import { Buttons } from "../general/button/buttons";
import { LogoTopBar, type LogoTopBarGenderOption } from "./logo-top-bar";
import { ModalNavVariation, type ModalNavVariationProps } from "./modal-nav-variation";

const topNavigationVariants = cva(
  "flex w-full items-center justify-between gap-2 border-b px-4 py-3",
  {
    variants: {
      variant: {
        default: "border-surface-strong bg-dialog-bg",
        transparent: "border-transparent bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type TopNavigationProps = Omit<React.ComponentProps<"nav">, "children"> & {
  variant?: "default" | "transparent";
  status?: "not-logged" | "not-premium" | "premium" | "all";
  label?: string;
  profileButtonLabel?: string;
  creditsLabel?: string;
  discountLabel?: string;
  tryFreeLabel?: string;
  bonusLabel?: string;
  onCreditsClick?: React.MouseEventHandler<HTMLButtonElement>;
  onDiscountClick?: React.MouseEventHandler<HTMLButtonElement>;
  onTryFreeClick?: React.MouseEventHandler<HTMLButtonElement>;
  onProfileClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMobileMenuClick?: React.MouseEventHandler<HTMLButtonElement>;
  mobileMenuOpen?: boolean;
  showLogoTopBar?: boolean;
  /**
   * Renders the two affordances that open the mobile sidebar — the expand icon and
   * the profile menu's "Menu" entry. Set `false` where no sidebar exists to open
   * (the funnel); both are dead controls there.
   */
  showMobileMenu?: boolean;
  /**
   * Rendered on the funnel. Auth modals are owned by `AuthGateProvider`; this is
   * accepted for the shared header API and ignored here (funnel-page task 5 / D21).
   */
  isFunnel?: boolean;
  sidebarExpanded?: boolean;
  genderOption?: LogoTopBarGenderOption;
  onGenderOptionChange?: (value: LogoTopBarGenderOption) => void;
  /** Infinite yearly and monthly account menus include Language and Redeem Coupon. */
  showInfiniteYearlyMenu?: boolean;
  onRedeemClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Overrides the account-menu token row. Premium plan uses "Tokens". */
  tokenMenuLabel?: string;
};

const STATUS_TO_MODAL_VARIATION = {
  "not-logged": "not-logged",
  "not-premium": "logged-not-premium",
  premium: "premium",
  all: "all",
} as const satisfies Record<
  NonNullable<TopNavigationProps["status"]>,
  NonNullable<ModalNavVariationProps["variation"]>
>;

export function TopNavigation({
  className,
  status = "not-logged",
  label = "Top navigation",
  profileButtonLabel = "Open profile menu",
  creditsLabel = "534",
  discountLabel = "-75%",
  tryFreeLabel = "Try Free",
  bonusLabel = "+30",
  variant = "default",
  onCreditsClick,
  onDiscountClick,
  onTryFreeClick,
  onProfileClick,
  onMobileMenuClick,
  mobileMenuOpen,
  showLogoTopBar = true,
  showMobileMenu = true,
  isFunnel = false,
  sidebarExpanded,
  genderOption,
  onGenderOptionChange,
  showInfiniteYearlyMenu = false,
  onRedeemClick,
  tokenMenuLabel,
  ...props
}: TopNavigationProps) {
  const { requireAuth } = useAuthGate();
  const showTryFree = status === "not-logged" || status === "all";
  // Logged-in not premium shows the token balance (24748:159070), not the crown discount.
  const showDiscount = status === "all";
  // Premium / Infinite open the token modal. Logged-in not premium shows the same balance.
  const showCredits = status === "premium" || status === "not-premium" || status === "all";

  const dismissMobileMenuIfOpen = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      // Close the drawer first so the CTA's modal isn't hidden behind it (FRONT-696).
      if (mobileMenuOpen) {
        onMobileMenuClick?.(event);
      }
    },
    [mobileMenuOpen, onMobileMenuClick],
  );

  const handleTryFreeClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      dismissMobileMenuIfOpen(event);
      onTryFreeClick?.(event);
      // Guest conversion CTA — same signup modal as the profile menu's Sign up.
      // Login stays one click away inside AuthModals.
      requireAuth({ preferModal: "signup" });
    },
    [dismissMobileMenuIfOpen, onTryFreeClick, requireAuth],
  );

  const handleDiscountClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      dismissMobileMenuIfOpen(event);
      onDiscountClick?.(event);
    },
    [dismissMobileMenuIfOpen, onDiscountClick],
  );

  const handleCreditsClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      dismissMobileMenuIfOpen(event);
      onCreditsClick?.(event);
    },
    [dismissMobileMenuIfOpen, onCreditsClick],
  );

  return (
    <nav
      aria-label={label}
      className={cn(topNavigationVariants({ variant }), className)}
      {...props}
    >
      {showLogoTopBar ? (
        <LogoTopBar
          className={cn(sidebarExpanded && "md:hidden")}
          selectedOption={genderOption}
          onOptionChange={onGenderOptionChange}
          onMobileMenuClick={onMobileMenuClick}
          mobileMenuOpen={mobileMenuOpen}
          showMobileMenuButton={showMobileMenu}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <div className="scrollbar-hidden flex min-w-0 items-center justify-end gap-2 overflow-x-auto">
          {showCredits ? (
            <Buttons
              className="bg-btn-bg hover:bg-btn-bg"
              variant="neutral"
              size="btn-s"
              label={creditsLabel}
              leftIcon={false}
              rightIcon
              rightIconSrc="/assets/spice-coin.png"
              onClick={handleCreditsClick}
            />
          ) : null}
          {showDiscount ? (
            <Buttons
              className=""
              variant="premium-10"
              size="btn-s"
              label={discountLabel}
              leftIcon
              rightIcon={false}
              leftIconSrc="/assets/crown-filled.svg"
              onClick={handleDiscountClick}
            />
          ) : null}
          {showTryFree ? (
            <Buttons
              variant="rose"
              size="btn-s"
              label={`${tryFreeLabel} ${bonusLabel}`.trim()}
              leftIcon={false}
              rightIcon
              rightIconSrc="/assets/spice-coin.png"
              rightIconSizeClassName="h-[14px] w-[14px]"
              onClick={handleTryFreeClick}
            />
          ) : null}
        </div>
        <ModalNavVariation
          variation={STATUS_TO_MODAL_VARIATION[status]}
          showMenuItem={showMobileMenu || showInfiniteYearlyMenu}
          isFunnel={isFunnel}
          profileButtonLabel={profileButtonLabel}
          onProfileClick={onProfileClick}
          onMenuClick={onMobileMenuClick}
          showInfiniteYearlyMenu={showInfiniteYearlyMenu}
          onRedeemClick={onRedeemClick}
          tokenMenuLabel={tokenMenuLabel}
        />
      </div>
    </nav>
  );
}
