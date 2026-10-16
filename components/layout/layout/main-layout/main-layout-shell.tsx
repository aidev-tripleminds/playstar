"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Suspense } from "react";

import { PoliciesModal } from "@/app/(main)/settings/_components/policies-modal";
import { AuthGateProvider, useAuthGate } from "@/components/common/auth/auth-gate";
import { AgeWarning } from "@/components/common/general/age-warning/age-warning";
import { InstallAppPopup } from "@/components/common/general/install-app-popup";
import {
  LATEST_NEWS_ENABLED,
  LatestNewsPopup,
} from "@/components/common/general/latest-news-popup";
import { VerifyAge } from "@/components/common/general/verify-age/verify-age";
import type { BottomNavigationTab } from "@/components/common/navigation/bottom-navigation";
import {
  SIDE_NAV_DEFAULT_SECTIONS,
  SIDE_NAV_GET_APP_ITEM_ID,
  SIDE_NAV_OVERLAY_TRANSITION_CLASS,
  SIDE_NAV_OVERLAY_WIDTH_CLASS,
  SIDE_NAV_TOKENS_ICON,
  SIDE_NAV_TRANSITION_CLASS,
  type SideNavItem,
  type SideNavSection,
  sideNavSocialItems,
} from "@/components/common/navigation/side-nav";
import {
  resolveV2Navigation,
  V2InfiniteYearlyMobileNav,
  V2MobileOverlay,
  V2Nav,
  v2NavShowsInfiniteAccountMenu,
  v2NavShowsUpgrade,
  v2NavUsesCompactMobile,
} from "@/components/common/navigation/v2";
import { FailedRenewal } from "@/components/common/payment-modals/failed-renewal";
import { HearAboutUsAfterPurchase } from "@/components/common/payment-modals/hear-about-us";
import { RedeemCoupon } from "@/components/common/payment-modals/redeem-coupon";
import { REDEEM_COUPON_ERROR_MESSAGE } from "@/components/common/payment-modals/redeem-coupon/redeem-coupon.constants";
import { PreLaunchGateProvider, usePreLaunchGate } from "@/components/common/pre-launch";
import { GetPremium } from "@/components/common/pricing-modals/get-premium-popup/get-premium";
import { UpgradeLeaveRetentionProvider } from "@/components/common/pricing-modals/infinite-upsell/upgrade-leave-retention-gate";
import { PremiumLeaveRetentionProvider } from "@/components/common/pricing-modals/join-premium-flow/premium-leave-retention-gate";
import type { FooterLink } from "@/components/common/Prismic/footer/footer.constants";
import {
  EarnFreeTokensPopup,
  EarnFreeTokensSuccessPopup,
  RedeemRewardPopup,
  useEarnFreeTokensFlow,
} from "@/components/common/token-modals/earn-free-tokens";
import {
  GetTokensModal,
  GetTokensModalInfinite,
  GetTokensModalOutOfTokens,
} from "@/components/common/token-modals/get-tokens-modal";
import { AppHeader } from "@/components/layout/app-header/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar/app-sidebar";
import { HomepageBottomNav } from "@/components/pages/homepage/_components/homepage-bottom-nav";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useIsHydrated } from "@/hooks/use-is-hydrated";
import { useMe } from "@/hooks/use-me";
import { useMyCharacters } from "@/hooks/use-my-characters";
import { SignupCtaBonusProvider } from "@/hooks/use-signup-cta-bonus";
import { useWalletStream } from "@/hooks/use-wallet-stream";
import type { LegalDocumentSummary } from "@/lib/api/legal";
import { NAVIGATION_V2_ENABLED } from "@/lib/feature-flags";
import { isInstalledApp } from "@/lib/is-installed-app";
import { releaseModalHistoryForNavigation } from "@/lib/modal-history";
import { PRE_LAUNCH_PREMIUM_FEATURES } from "@/lib/pre-launch";
import {
  buildPremiumHref,
  isExploreContentRoute,
  PREMIUM_INFINITE_PLAN,
  ROUTES,
} from "@/lib/routes";
import { cn } from "@/lib/utils";

import {
  MAIN_LAYOUT_HEADER_Z_CLASS,
  MAIN_LAYOUT_MAIN_PADDING_CLASS,
  MAIN_LAYOUT_SIDEBAR_DESKTOP_BREAKPOINT,
  MAIN_LAYOUT_STACKING_CLASS,
} from "./main-layout.constants";
import { MainNavContext } from "./main-nav-context";
import {
  resolveTokenPurchaseDestination,
  type TokenPurchaseReason,
} from "./resolve-token-destination";
import { useMainNav } from "./use-main-nav";

type MainLayoutShellProps = {
  children: React.ReactNode;
  /** Fetched server-side (task 16, D28) — this shell has no data access of its own. */
  policies: LegalDocumentSummary[];
  /** Authored socials for the sidebar rail; empty until a Prismic footer document is published. */
  socials: FooterLink[];
};

export function MainLayoutShell({ children, policies, socials }: MainLayoutShellProps) {
  return (
    <AuthGateProvider>
      <PreLaunchGateProvider>
        <SignupCtaBonusProvider>
          <PremiumLeaveRetentionProvider>
            <UpgradeLeaveRetentionProvider>
              <MainLayoutShellContent policies={policies} socials={socials}>
                {children}
              </MainLayoutShellContent>
            </UpgradeLeaveRetentionProvider>
          </PremiumLeaveRetentionProvider>
        </SignupCtaBonusProvider>
      </PreLaunchGateProvider>
    </AuthGateProvider>
  );
}

function MainLayoutShellContent({ children, policies, socials }: MainLayoutShellProps) {
  const router = useRouter();
  const isDesktop = useIsDesktop(MAIN_LAYOUT_SIDEBAR_DESKTOP_BREAKPOINT);
  const isHydrated = useIsHydrated();
  const { requireAuth } = useAuthGate();
  const { blockIfLocked } = usePreLaunchGate();
  const mainRef = React.useRef<HTMLElement>(null);
  const pageHeroRegistrationCountRef = React.useRef(0);
  const [hasRegisteredPageHero, setHasRegisteredPageHero] = React.useState(false);
  const [headerSolid, setHeaderSolid] = React.useState(false);
  const [installAppOpen, setInstallAppOpen] = React.useState(false);
  const [redeemCouponOpen, setRedeemCouponOpen] = React.useState(false);
  /** Temporary: Rewards side-nav opens failed renewal demo flow. */
  const [failedRenewalOpen, setFailedRenewalOpen] = React.useState(false);
  const [policiesOpen, setPoliciesOpen] = React.useState(false);
  const [getTokensOpen, setGetTokensOpen] = React.useState(false);
  const [getTokensInfiniteOpen, setGetTokensInfiniteOpen] = React.useState(false);
  const [outOfTokensOpen, setOutOfTokensOpen] = React.useState(false);
  const [getPremiumOpen, setGetPremiumOpen] = React.useState(false);
  const [verifyAgeOpen, setVerifyAgeOpen] = React.useState(false);
  const earnFreeTokens = useEarnFreeTokensFlow({
    onOpenInstallApp: () => setInstallAppOpen(true),
  });
  const [prevIsDesktop, setPrevIsDesktop] = React.useState(isDesktop);
  const [v2MobileMenuOpen, setV2MobileMenuOpen] = React.useState(false);
  /** Clicked Premium / ran out of tokens before `/me` finished — open once plan flags are real. */
  const pendingTokenReasonRef = React.useRef<TokenPurchaseReason | null>(null);
  /** Nav Get Premium before `/me` finished — send free users to `/premium` once plan flags are real. */
  const pendingNavPremiumRef = React.useRef(false);
  /** Bumps so a queued nav-premium decision can flush after auth without a stale guest snapshot. */
  const [navPremiumEpoch, setNavPremiumEpoch] = React.useState(0);
  const {
    pathname,
    activeItemId,
    activeBottomNavTab,
    mobileSidebarOpen,
    sidebarExpanded,
    setSidebarExpanded,
    bottomNavVisible,
    setBottomNavVisible,
    topNavVisible,
    setTopNavVisible,
    genderOption,
    navigateTo,
    handleItemClick,
    handleCreateClick,
    handleBottomTabClick,
    handleMobileMenuToggle,
    closeMobileSidebar,
    handleSidebarExpandedChange,
    handleGenderOptionChange,
  } = useMainNav();
  const hasTransparentHeader = isExploreContentRoute(pathname) || hasRegisteredPageHero;
  const headerVariant = !isDesktop || headerSolid ? "default" : "transparent";
  // The default header border is #262626. On Generate it reads as a 1px slit
  // between the bar and the source cards. Match the header fill instead.
  const headerBorderClass =
    pathname.startsWith("/generate") && headerVariant === "default"
      ? "border-dialog-bg"
      : undefined;

  const {
    isLoggedIn,
    isPremium,
    isPremiumPlan,
    isInfinitePlan,
    isPremiumResolved,
    isPremiumError,
    tokenBalance,
    interval,
  } = useMe();
  const wasLoggedInRef = React.useRef(isLoggedIn);
  const { data: myCharacters } = useMyCharacters();
  const hasCreatedCharacter = (myCharacters?.total ?? 0) > 0;
  useWalletStream(isLoggedIn);
  const headerStatus = !isLoggedIn ? "not-logged" : isPremium ? "premium" : "not-premium";
  const creditsLabel = tokenBalance === undefined ? "…" : String(tokenBalance);
  const v2NavSession = {
    isInfinitePlan,
    isPremiumPlan,
    isSubscribed: isPremium,
    interval,
    isResolved: isPremiumResolved,
    isLoggedIn,
  };
  const v2NavPremium = NAVIGATION_V2_ENABLED ? resolveV2Navigation(v2NavSession) : null;
  const showV2CompactMobile = v2NavUsesCompactMobile(v2NavPremium);
  const showAccountMenuExtras = v2NavShowsInfiniteAccountMenu(v2NavPremium, isLoggedIn);

  // Memoised: each item carries a rendered icon element, so rebuilding on every
  // render would hand both sidebars new nodes for unchanged links.
  const socialItems = React.useMemo(() => sideNavSocialItems(socials), [socials]);

  // Paid subscribers (Premium / Infinite) see "Get Tokens" + token icon; Free keeps "Get Premium" + crown.
  const sideNavSections = React.useMemo<SideNavSection[]>(() => {
    if (!isPremium) return SIDE_NAV_DEFAULT_SECTIONS;
    return SIDE_NAV_DEFAULT_SECTIONS.map((section) => ({
      ...section,
      items: section.items.map((item) =>
        item.id === "premium"
          ? {
              ...item,
              label: "Get Tokens",
              type: "tokens" as const,
              badgeText: undefined,
              leftIcon: SIDE_NAV_TOKENS_ICON,
            }
          : item,
      ),
    }));
  }, [isPremium]);

  if (isDesktop !== prevIsDesktop) {
    setPrevIsDesktop(isDesktop);
    if (isDesktop) {
      setInstallAppOpen(false);
      earnFreeTokens.setOfferOpen(false);
      earnFreeTokens.setRedeemOpen(false);
      earnFreeTokens.setSuccessOpen(false);
      setV2MobileMenuOpen(false);
      closeMobileSidebar();
    }
  }

  const handleInstallAppClick = React.useCallback(() => {
    closeMobileSidebar();
    setInstallAppOpen(true);
  }, [closeMobileSidebar]);

  // FRONT-723: hide "Install Spicestars App" when this session already is the
  // downloaded app (PWA / Add to Home Screen). Wait for hydration so SSR and
  // the first client pass stay identical.
  const showMobileInstallBanner = !(isHydrated && isInstalledApp());

  /**
   * Nav Get Premium (requestPremium): Free → `/premium`. Paid → token modals.
   * Insufficient tokens (requestOutOfTokens): Free → Get Premium modal.
   * Paid with tokens → Get Tokens modal (Infinite variant has no Upgrade CTA)
   * Paid out of tokens / insufficient for an action → Out of tokens modal
   *
   * Waits for `/me` so an empty plan name during fetch does not mis-route
   * subscribers to the free upsell. `/me` errors fall through to the free path.
   */
  const openTokenDestination = React.useCallback(
    (reason: TokenPurchaseReason) => {
      if (!isPremiumResolved && !isPremiumError) {
        pendingTokenReasonRef.current = reason;
        return;
      }

      pendingTokenReasonRef.current = null;
      closeMobileSidebar();
      setGetTokensOpen(false);
      setGetTokensInfiniteOpen(false);
      setOutOfTokensOpen(false);
      setGetPremiumOpen(false);

      const destination = resolveTokenPurchaseDestination({
        isPremium,
        isInfinitePlan,
        tokenBalance,
        reason,
      });

      if (destination === "membership") {
        setGetPremiumOpen(true);
        return;
      }
      // Every other destination sells tokens, which needs real checkout.
      if (blockIfLocked("payments")) return;
      if (destination === "out-of-tokens") {
        setOutOfTokensOpen(true);
        return;
      }
      if (destination === "get-tokens-infinite") {
        setGetTokensInfiniteOpen(true);
        return;
      }
      setGetTokensOpen(true);
    },
    [
      blockIfLocked,
      closeMobileSidebar,
      isInfinitePlan,
      isPremium,
      isPremiumError,
      isPremiumResolved,
      tokenBalance,
    ],
  );

  React.useEffect(() => {
    const wasLoggedIn = wasLoggedInRef.current;
    wasLoggedInRef.current = isLoggedIn;
    if (wasLoggedIn && !isLoggedIn) {
      pendingTokenReasonRef.current = null;
      pendingNavPremiumRef.current = false;
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    if (!pendingTokenReasonRef.current && !pendingNavPremiumRef.current) {
      return;
    }
    if (!isLoggedIn) {
      pendingTokenReasonRef.current = null;
      return;
    }
    if (!isPremiumResolved && !isPremiumError) {
      return;
    }
    const navPremiumPending = pendingNavPremiumRef.current;
    const reason = pendingTokenReasonRef.current;
    pendingTokenReasonRef.current = null;
    pendingNavPremiumRef.current = false;
    // Defer so opening modals / navigating is not a synchronous setState inside the effect body.
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) {
        return;
      }
      if (navPremiumPending) {
        if (isPremium) {
          openTokenDestination("buy");
          return;
        }
        navigateTo(ROUTES.premium);
        return;
      }
      if (reason) {
        openTokenDestination(reason);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [
    isLoggedIn,
    isPremium,
    isPremiumError,
    isPremiumResolved,
    navigateTo,
    navPremiumEpoch,
    openTokenDestination,
  ]);

  const queueNavPremium = React.useCallback(() => {
    pendingNavPremiumRef.current = true;
    setNavPremiumEpoch((epoch) => epoch + 1);
  }, []);

  const requestPremium = React.useCallback(() => {
    closeMobileSidebar();
    if (blockIfLocked(PRE_LAUNCH_PREMIUM_FEATURES)) return;
    // Always queue — never branch on this closure's isPremium snapshot. After
    // login, AuthGate calls the saved callback with guest values still closed
    // over (`isPremiumResolved && !isPremium`), which would skip `/me`.
    const allowed = requireAuth({ onSuccess: queueNavPremium });
    if (!allowed) return;
    queueNavPremium();
  }, [blockIfLocked, closeMobileSidebar, queueNavPremium, requireAuth]);

  const requestOutOfTokens = React.useCallback(() => {
    closeMobileSidebar();
    if (blockIfLocked(PRE_LAUNCH_PREMIUM_FEATURES)) return;
    const allowed = requireAuth({ onSuccess: () => openTokenDestination("insufficient") });
    if (!allowed) return;
    openTokenDestination("insufficient");
  }, [blockIfLocked, closeMobileSidebar, openTokenDestination, requireAuth]);

  const requestMembership = React.useCallback(() => {
    closeMobileSidebar();
    if (blockIfLocked(PRE_LAUNCH_PREMIUM_FEATURES)) return;
    const openMembership = () => setGetPremiumOpen(true);
    const allowed = requireAuth({ preferModal: "signup", onSuccess: openMembership });
    if (!allowed) return;
    openMembership();
  }, [blockIfLocked, closeMobileSidebar, requireAuth]);

  // Never pre-launch gated: age verification is a legal check, not a product
  // feature. A user in a region that requires it must be able to verify while
  // the product is locked; the backend lock keeps these routes open too.
  const requestAgeVerification = React.useCallback(() => {
    closeMobileSidebar();
    const openVerifyAge = () => setVerifyAgeOpen(true);
    const allowed = requireAuth({ onSuccess: openVerifyAge });
    if (!allowed) return;
    openVerifyAge();
  }, [closeMobileSidebar, requireAuth]);

  const queryClient = useQueryClient();
  // Every list the backend blurred for this viewer is stale once they verify.
  const handleAgeVerified = React.useCallback(() => {
    void queryClient.invalidateQueries();
  }, [queryClient]);

  const requestRedeem = React.useCallback(() => {
    closeMobileSidebar();
    if (blockIfLocked("payments")) return;
    const openRedeem = () => setRedeemCouponOpen(true);
    const allowed = requireAuth({ onSuccess: openRedeem });
    if (!allowed) return;
    openRedeem();
  }, [blockIfLocked, closeMobileSidebar, requireAuth]);

  const requestFailedRenewal = React.useCallback(() => {
    closeMobileSidebar();
    setFailedRenewalOpen(true);
  }, [closeMobileSidebar]);

  const requestPolicies = React.useCallback(() => {
    closeMobileSidebar();
    setPoliciesOpen(true);
  }, [closeMobileSidebar]);

  const handleRedeem = React.useCallback(async () => {
    // Redeem API is not wired yet — never report success without a backend call.
    return REDEEM_COUPON_ERROR_MESSAGE;
  }, []);

  const handleUpgradeFromTokens = React.useCallback(() => {
    // Modal close would history.back() over this push — drop the trap first.
    releaseModalHistoryForNavigation();
    setGetTokensOpen(false);
    setOutOfTokensOpen(false);
    router.push(buildPremiumHref(PREMIUM_INFINITE_PLAN));
  }, [router]);

  const handlePremiumContinue = React.useCallback(
    (selection?: { plan?: string }) => {
      releaseModalHistoryForNavigation();
      setGetPremiumOpen(false);
      router.push(buildPremiumHref(selection?.plan));
    },
    [router],
  );

  const handleSidebarItemClick = React.useCallback(
    (item: SideNavItem) => {
      if (item.id === "redeem") {
        requestRedeem();
        return;
      }
      if (item.id === "premium") {
        requestPremium();
        return;
      }
      // Temporary demo: Rewards opens the failed renewal → upcoming change flow.
      if (item.id === "rewards") {
        requestFailedRenewal();
        return;
      }
      if (item.id === "policies") {
        requestPolicies();
        return;
      }
      handleItemClick(item);
    },
    [handleItemClick, requestFailedRenewal, requestPolicies, requestPremium, requestRedeem],
  );

  const handleBottomTabClickWithTokens = React.useCallback(
    (tab: BottomNavigationTab) => {
      if (tab === "premium") {
        requestPremium();
        return;
      }
      handleBottomTabClick(tab);
    },
    [handleBottomTabClick, requestPremium],
  );

  const handleV2ItemClick = React.useCallback(
    (item: SideNavItem) => {
      if (item.id === SIDE_NAV_GET_APP_ITEM_ID) {
        handleInstallAppClick();
        return;
      }
      handleSidebarItemClick(item);
    },
    [handleInstallAppClick, handleSidebarItemClick],
  );

  const handleV2PlanClick = React.useCallback(() => {
    if (v2NavPremium === "free") {
      requestPremium();
      return;
    }
    if (v2NavPremium && v2NavShowsUpgrade(v2NavPremium)) {
      navigateTo(buildPremiumHref(PREMIUM_INFINITE_PLAN));
      return;
    }
    handleItemClick({ id: "settings", label: "My Plan", leftIcon: null });
  }, [handleItemClick, navigateTo, requestPremium, v2NavPremium]);

  const registerPageHero = React.useCallback(() => {
    pageHeroRegistrationCountRef.current += 1;
    setHasRegisteredPageHero(true);
    setSidebarExpanded(true);

    return () => {
      pageHeroRegistrationCountRef.current = Math.max(0, pageHeroRegistrationCountRef.current - 1);
      if (pageHeroRegistrationCountRef.current === 0) {
        setHasRegisteredPageHero(false);
        if (!isExploreContentRoute(pathname)) {
          setSidebarExpanded(false);
        }
      }
    };
  }, [pathname, setSidebarExpanded]);

  const [layoutElement, setLayoutElement] = React.useState<HTMLDivElement | null>(null);
  const mainNavContextValue = React.useMemo(
    () => ({
      sidebarExpanded,
      setSidebarExpanded,
      closeMobileSidebar,
      registerPageHero,
      layoutElement,
      bottomNavVisible,
      setBottomNavVisible,
      topNavVisible,
      setTopNavVisible,
      requestPremium,
      requestOutOfTokens,
      requestMembership,
      requestAgeVerification,
    }),
    [
      sidebarExpanded,
      setSidebarExpanded,
      closeMobileSidebar,
      registerPageHero,
      layoutElement,
      bottomNavVisible,
      setBottomNavVisible,
      topNavVisible,
      setTopNavVisible,
      requestPremium,
      requestOutOfTokens,
      requestMembership,
      requestAgeVerification,
    ],
  );

  const showMobileTopNav = isDesktop || topNavVisible;

  if (!hasTransparentHeader && headerSolid) {
    setHeaderSolid(false);
  }

  React.useEffect(() => {
    if (!hasTransparentHeader) {
      return;
    }

    // Mobile uses document scroll so iOS Safari can hide its HUD; desktop keeps nested main scroll.
    const handleScroll = () => {
      const scrollTop = isDesktop ? (mainRef.current?.scrollTop ?? 0) : window.scrollY;
      setHeaderSolid(scrollTop > 0);
    };

    const scrollTarget: Window | HTMLElement | null = isDesktop ? mainRef.current : window;
    if (!scrollTarget) {
      return;
    }

    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });
    queueMicrotask(handleScroll);

    return () => {
      scrollTarget.removeEventListener("scroll", handleScroll);
    };
  }, [hasTransparentHeader, pathname, isDesktop]);

  const mainScrollClassName = cn(
    // Mobile: document scroll so iOS Safari can collapse its HUD on every main route.
    // Desktop: nested overflow scroll inside the fixed viewport shell.
    "scrollbar-hidden w-full flex-1 md:min-h-0 md:overflow-y-auto md:overscroll-y-contain",
    // Do not set overflow-x on mobile. `clip`/`hidden` on one axis computes the
    // other to `auto`/`clip` in WebKit, which traps scroll inside main and pins
    // Safari's HUD. Body already clips horizontal overflow. Desktop keeps clip.
    "md:overflow-x-clip",
    hasTransparentHeader && "md:overflow-x-hidden md:overscroll-x-none",
  );

  return (
    <MainNavContext.Provider value={mainNavContextValue}>
      <div
        ref={setLayoutElement}
        data-slot="main-layout"
        className={cn(
          MAIN_LAYOUT_STACKING_CLASS,
          // 100lvh stays the large viewport while Safari's HUD is showing, so
          // short pages (empty generate) can still document-scroll and collapse it.
          // dvh shrinks to the HUD-visible height and leaves nothing to scroll.
          "bg-dialog-bg text-foreground flex min-h-[100lvh] md:h-dvh md:overflow-hidden",
        )}
      >
        <div
          data-slot="main-layout-sidebar-desktop"
          className="border-surface-strong hidden h-full shrink-0 border-r md:block"
        >
          {v2NavPremium ? (
            <V2Nav
              session={v2NavSession}
              expanded={sidebarExpanded}
              onExpandedChange={handleSidebarExpandedChange}
              activeItemId={activeItemId}
              socialItems={socialItems}
              genderOption={genderOption}
              onGenderOptionChange={handleGenderOptionChange}
              onItemClick={handleV2ItemClick}
              onPlanClick={handleV2PlanClick}
            />
          ) : (
            <AppSidebar
              variant="expanded"
              expanded={sidebarExpanded}
              onExpandedChange={handleSidebarExpandedChange}
              genderOption={genderOption}
              onGenderOptionChange={handleGenderOptionChange}
              activeItemId={activeItemId}
              sections={sideNavSections}
              socialItems={socialItems}
              hasCreatedCharacter={hasCreatedCharacter}
              onItemClick={handleSidebarItemClick}
              onCreateClick={handleCreateClick}
            />
          )}
        </div>

        {showV2CompactMobile ? null : (
          <>
            <button
              type="button"
              aria-label="Close sidebar"
              aria-hidden={!mobileSidebarOpen}
              tabIndex={mobileSidebarOpen ? 0 : -1}
              className={cn(
                // Above bottom nav (z-[70]) so the dim/close target covers tabs while open.
                // Below the header (z-[85]) so Try Free / Get Premium still receive the tap.
                "fixed inset-0 z-[75] md:hidden",
                "transition-opacity",
                SIDE_NAV_TRANSITION_CLASS,
                mobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              onClick={closeMobileSidebar}
            />
            <div
              data-slot="main-layout-sidebar-mobile"
              data-open={mobileSidebarOpen}
              aria-hidden={!mobileSidebarOpen}
              inert={mobileSidebarOpen ? undefined : true}
              className={cn(
                // Above bottom nav (z-[70]) so AppSidebar covers the tab bar.
                showMobileTopNav
                  ? "fixed top-[61px] bottom-0 left-0 z-[80] md:hidden"
                  : "fixed inset-y-0 left-0 z-[80] md:hidden",
                SIDE_NAV_OVERLAY_WIDTH_CLASS,
                "max-w-full",
                SIDE_NAV_OVERLAY_TRANSITION_CLASS,
                mobileSidebarOpen ? "translate-x-0" : "pointer-events-none -translate-x-full",
              )}
            >
              {v2NavPremium === "free" ? (
                <V2MobileOverlay
                  activeItemId={activeItemId}
                  socialItems={socialItems}
                  showInstallBanner={showMobileInstallBanner}
                  onItemClick={handleV2ItemClick}
                  onPlanClick={handleV2PlanClick}
                />
              ) : (
                <AppSidebar
                  variant="overlay"
                  overlayPosition="embedded"
                  activeItemId={activeItemId}
                  sections={sideNavSections}
                  socialItems={socialItems}
                  hasCreatedCharacter={hasCreatedCharacter}
                  showInstallBanner={showMobileInstallBanner}
                  onItemClick={handleSidebarItemClick}
                  onCreateClick={handleCreateClick}
                  onInstallAppClick={handleInstallAppClick}
                />
              )}
            </div>
          </>
        )}

        <div data-slot="main-layout-content" className="flex min-w-0 flex-1 flex-col md:min-h-0">
          {hasTransparentHeader ? (
            <main
              ref={mainRef}
              data-slot="main-layout-main"
              className={cn(
                mainScrollClassName,
                MAIN_LAYOUT_MAIN_PADDING_CLASS,
                !isDesktop && bottomNavVisible && "pb-24",
              )}
            >
              {showMobileTopNav ? (
                <AppHeader
                  status={headerStatus}
                  creditsLabel={creditsLabel}
                  variant={headerVariant}
                  showLogoTopBar
                  showMobileMenu={!showV2CompactMobile}
                  sidebarExpanded={sidebarExpanded}
                  genderOption={genderOption}
                  onGenderOptionChange={handleGenderOptionChange}
                  onMobileMenuClick={
                    showV2CompactMobile ? () => setV2MobileMenuOpen(true) : handleMobileMenuToggle
                  }
                  mobileMenuOpen={mobileSidebarOpen}
                  onCreditsClick={requestPremium}
                  onDiscountClick={requestPremium}
                  showInfiniteYearlyMenu={showAccountMenuExtras}
                  onRedeemClick={() => requestRedeem()}
                  tokenMenuLabel={v2NavPremium === "premium" ? "Tokens" : undefined}
                  className={cn(
                    MAIN_LAYOUT_HEADER_Z_CLASS,
                    "sticky top-0 transition-[background-color] duration-200",
                    headerBorderClass,
                  )}
                />
              ) : null}

              {children}
            </main>
          ) : (
            <>
              {showMobileTopNav ? (
                <div
                  data-slot="main-layout-header"
                  className={cn(MAIN_LAYOUT_HEADER_Z_CLASS, "sticky top-0 shrink-0")}
                >
                  <AppHeader
                    status={headerStatus}
                    creditsLabel={creditsLabel}
                    variant="default"
                    showLogoTopBar
                    showMobileMenu={!showV2CompactMobile}
                    sidebarExpanded={sidebarExpanded}
                    genderOption={genderOption}
                    onGenderOptionChange={handleGenderOptionChange}
                    onMobileMenuClick={
                      showV2CompactMobile ? () => setV2MobileMenuOpen(true) : handleMobileMenuToggle
                    }
                    mobileMenuOpen={mobileSidebarOpen}
                    onCreditsClick={requestPremium}
                    onDiscountClick={requestPremium}
                    showInfiniteYearlyMenu={showAccountMenuExtras}
                    onRedeemClick={() => requestRedeem()}
                    tokenMenuLabel={v2NavPremium === "premium" ? "Tokens" : undefined}
                    className={headerBorderClass}
                  />
                </div>
              ) : null}

              <main
                data-slot="main-layout-main"
                className={cn(
                  mainScrollClassName,
                  MAIN_LAYOUT_MAIN_PADDING_CLASS,
                  !isDesktop && bottomNavVisible && "pb-24",
                )}
              >
                {children}
              </main>
            </>
          )}
        </div>

        {showV2CompactMobile ? (
          <V2InfiniteYearlyMobileNav
            session={v2NavSession}
            show={!isDesktop && bottomNavVisible}
            activeTab={activeBottomNavTab}
            onTabClick={handleBottomTabClickWithTokens}
            tokenBalance={tokenBalance}
            socialItems={socialItems}
            showInstallBanner={showMobileInstallBanner}
            onItemClick={handleV2ItemClick}
            onPlanClick={handleV2PlanClick}
            menuOpen={v2MobileMenuOpen}
            onMenuOpenChange={setV2MobileMenuOpen}
          />
        ) : (
          <HomepageBottomNav
            show={!isDesktop && bottomNavVisible}
            activeTab={activeBottomNavTab}
            onTabClick={handleBottomTabClickWithTokens}
          />
        )}
        <AgeWarning />
        {LATEST_NEWS_ENABLED && <LatestNewsPopup />}
        <RedeemCoupon
          open={redeemCouponOpen}
          onOpenChange={setRedeemCouponOpen}
          onRedeem={handleRedeem}
        />
        <FailedRenewal open={failedRenewalOpen} onOpenChange={setFailedRenewalOpen} />
        <Suspense fallback={null}>
          <HearAboutUsAfterPurchase />
        </Suspense>
        <PoliciesModal open={policiesOpen} onOpenChange={setPoliciesOpen} policies={policies} />
        <GetPremium
          open={getPremiumOpen}
          onOpenChange={setGetPremiumOpen}
          onContinue={handlePremiumContinue}
        />
        <VerifyAge
          open={verifyAgeOpen}
          onOpenChange={setVerifyAgeOpen}
          onVerified={handleAgeVerified}
        />
        <GetTokensModal
          open={getTokensOpen}
          onOpenChange={setGetTokensOpen}
          defaultOpen={false}
          isSeasonal
          onUpgrade={handleUpgradeFromTokens}
        />
        <GetTokensModalInfinite
          open={getTokensInfiniteOpen}
          onOpenChange={setGetTokensInfiniteOpen}
          defaultOpen={false}
        />
        <GetTokensModalOutOfTokens
          open={outOfTokensOpen}
          onOpenChange={setOutOfTokensOpen}
          defaultOpen={false}
          showUpgrade={!isInfinitePlan}
          onUpgrade={handleUpgradeFromTokens}
          onGetFreeTokens={() => {
            if (isDesktop) {
              return;
            }
            setOutOfTokensOpen(false);
            earnFreeTokens.start();
          }}
        />
        {!isDesktop ? (
          <>
            <EarnFreeTokensPopup
              open={earnFreeTokens.offerOpen}
              onOpenChange={earnFreeTokens.setOfferOpen}
              onGetTheApp={earnFreeTokens.handleGetTheApp}
            />
            <InstallAppPopup open={installAppOpen} onOpenChange={setInstallAppOpen} />
            <RedeemRewardPopup
              open={earnFreeTokens.redeemOpen}
              onOpenChange={earnFreeTokens.setRedeemOpen}
              onNotificationsGranted={earnFreeTokens.showSuccess}
              onRedeem={earnFreeTokens.showSuccess}
            />
            <EarnFreeTokensSuccessPopup
              open={earnFreeTokens.successOpen}
              onOpenChange={(open) => {
                if (!open) {
                  earnFreeTokens.handleSuccessClose();
                  return;
                }
                earnFreeTokens.setSuccessOpen(true);
              }}
              onGotIt={earnFreeTokens.handleSuccessClose}
            />
          </>
        ) : null}
      </div>
    </MainNavContext.Provider>
  );
}
