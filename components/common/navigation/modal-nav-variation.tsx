"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { preload } from "react-dom";

import { useAuthGate } from "@/components/common/auth/auth-gate";
import { usePreLaunchGate } from "@/components/common/pre-launch";
import { useLeaveRetention } from "@/components/common/pricing-modals/use-leave-retention";
import { useMainNavContext } from "@/components/layout/main-layout/main-nav-context";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { LANGUAGE_FEATURE_ENABLED } from "@/lib/feature-flags";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { defaultItems, ModalNav, type ModalNavProps } from "./modal-nav";
import { Profile } from "./profile";

/** FRONT-683: hide the header profile icon below 360px so the top bar still fits. */
export const PROFILE_ICON_NARROW_VIEWPORT_CLASS = "max-[359px]:hidden";

export type ModalNavVariationProps = Omit<ModalNavProps, "items"> & {
  variation?: "premium" | "logged-not-premium" | "not-logged" | "all";
  showProfileIcon?: boolean;
  /** Mobile-only "Menu" entry that opens the sidebar. `false` where there is none (the funnel). */
  showMenuItem?: boolean;
  profileButtonLabel?: string;
  onProfileClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMenuClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Infinite account menu (yearly 24748:173555, monthly 24748:159075 / 24748:159079):
   * Language and Redeem Coupon stay in the list.
   */
  showInfiniteYearlyMenu?: boolean;
  onRedeemClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Premium plan account row (24748:159070). Infinite keeps "Get Tokens". */
  tokenMenuLabel?: string;
  items?: ModalNavProps["items"];
  /** @deprecated Auth modals are owned by AuthGateProvider; ignored. */
  signupTokens?: number | string;
  /** @deprecated Auth modals are owned by AuthGateProvider; pass `isFunnel` there. */
  isFunnel?: boolean;
};

const VARIATION_ITEM_IDS: Record<ModalNavVariationProps["variation"] & string, string[]> = {
  premium: ["tokens", "language", "affiliates", "menu", "settings", "logout"],
  // Logged-in not premium (24748:172515): Premium -75%, then Redeem Coupon.
  "logged-not-premium": [
    "premium",
    "language",
    "affiliates",
    "menu",
    "redeem",
    "settings",
    "logout",
  ],
  "not-logged": ["signup", "login", "premium", "language", "affiliates", "menu"],
  all: [
    "signup",
    "login",
    "premium",
    "tokens",
    "language",
    "affiliates",
    "menu",
    "settings",
    "logout",
  ],
};

export function ModalNavVariation({
  variation = "premium",
  showProfileIcon = true,
  showMenuItem = true,
  profileButtonLabel = "Open profile menu",
  onProfileClick,
  onMenuClick,
  showInfiniteYearlyMenu = false,
  onRedeemClick,
  tokenMenuLabel,
  items,
  signupTokens: _signupTokens,
  isFunnel: _isFunnel,
  className,
  ...props
}: ModalNavVariationProps) {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const { requireAuth } = useAuthGate();
  const { requestLeave } = useLeaveRetention();
  const { blockIfLocked } = usePreLaunchGate();
  const mainNav = useMainNavContext();
  const [isOpen, setIsOpen] = React.useState(!showProfileIcon);
  const { logout } = useAuthActions();

  // The coin and flag menu icons only mount once the dropdown opens; preload
  // them ahead of time so they don't pop in on first open.
  preload("/assets/spice-coin.png", { as: "image" });
  // Not logged (24748:159061) and logged-in not premium keep Language even while
  // translations are off. Paid plans only show it with the infinite account menu.
  if (
    LANGUAGE_FEATURE_ENABLED ||
    showInfiniteYearlyMenu ||
    variation === "not-logged" ||
    variation === "logged-not-premium"
  ) {
    preload("/assets/flags/United-States.svg", { as: "image" });
  }

  const menuIds = VARIATION_ITEM_IDS[variation].flatMap((id) =>
    showInfiniteYearlyMenu && variation === "premium" && id === "settings" ? ["redeem", id] : [id],
  );
  const allowedIds = menuIds.filter(
    (id) =>
      (id !== "menu" || (!isDesktop && showMenuItem)) &&
      (id !== "language" ||
        LANGUAGE_FEATURE_ENABLED ||
        showInfiniteYearlyMenu ||
        variation === "logged-not-premium" ||
        variation === "not-logged"),
  );

  const filteredItems = (items ?? defaultItems).filter((item) => allowedIds.includes(item.id));

  // Preserve the order defined in VARIATION_ITEM_IDS
  const orderedItems = allowedIds
    .map((id) => filteredItems.find((item) => item.id === id))
    .filter(Boolean) as NonNullable<ModalNavProps["items"]>;

  const openAuthModal = (modal: "login" | "signup") => {
    setIsOpen(false);
    requireAuth({ preferModal: modal });
  };

  const goPremiumFallback = React.useCallback(() => {
    router.push(ROUTES.premium);
  }, [router]);

  const itemsWithAuth = orderedItems.map((item) => {
    if (item.id === "signup") {
      return {
        ...item,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          item.onClick?.(event);
          openAuthModal("signup");
        },
      };
    }

    if (item.id === "login") {
      return {
        ...item,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          item.onClick?.(event);
          openAuthModal("login");
        },
      };
    }

    if (item.id === "premium" || item.id === "tokens") {
      return {
        ...item,
        label: item.id === "tokens" ? (tokenMenuLabel ?? item.label) : item.label,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          item.onClick?.(event);
          setIsOpen(false);
          // Layout-owned routing:
          // - Premium/Infinite "Get Tokens" → Get Tokens modal
          // - Free "Premium" → /premium (FRONT-659)
          // - Guest "Premium" → auth login modal
          if (mainNav?.requestPremium) {
            mainNav.requestPremium();
            return;
          }
          if (!requireAuth({ preferModal: "login", onSuccess: goPremiumFallback })) return;
          goPremiumFallback();
        },
      };
    }

    if (item.id === "menu") {
      return {
        ...item,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          item.onClick?.(event);
          setIsOpen(false);
          onMenuClick?.(event);
        },
      };
    }

    if (item.id === "redeem") {
      return {
        ...item,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          item.onClick?.(event);
          setIsOpen(false);
          onRedeemClick?.(event);
        },
      };
    }

    if (item.id === "settings") {
      return {
        ...item,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          item.onClick?.(event);
          setIsOpen(false);
          // Pre-launch: Settings is locked until its feature is unlocked, so
          // answer here rather than letting the gate bounce the navigation.
          if (blockIfLocked("settings")) return;
          const allowed = requireAuth({
            preferModal: "signup",
            onSuccess: () => {
              if (!requestLeave(ROUTES.settings)) return;
              router.push(ROUTES.settings);
            },
          });
          if (!allowed) return;
          if (!requestLeave(ROUTES.settings)) return;
          router.push(ROUTES.settings);
        },
      };
    }

    if (item.id === "logout") {
      return {
        ...item,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          item.onClick?.(event);
          setIsOpen(false);
          void logout();
        },
      };
    }

    return item;
  });

  return (
    <div
      className={cn(
        "relative inline-flex flex-col items-end",
        showProfileIcon && PROFILE_ICON_NARROW_VIEWPORT_CLASS,
        className,
      )}
      tabIndex={0}
      onBlur={(event) => {
        const nextFocused = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(nextFocused)) {
          setIsOpen(false);
        }
      }}
    >
      {showProfileIcon ? (
        <>
          <Profile
            className="cursor-pointer"
            label={profileButtonLabel}
            onClick={(event) => {
              setIsOpen((prev) => !prev);
              onProfileClick?.(event);
            }}
          />
          {isOpen ? (
            <div className="absolute top-full right-0 z-50 mt-2 w-[273px]">
              <ModalNav items={itemsWithAuth} {...props} />
            </div>
          ) : null}
        </>
      ) : (
        <ModalNav items={itemsWithAuth} {...props} />
      )}
    </div>
  );
}
