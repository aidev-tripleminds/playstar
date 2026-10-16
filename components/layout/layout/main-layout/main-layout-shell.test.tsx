import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as FeatureFlags from "@/lib/feature-flags";

const routerPush = vi.hoisted(() => vi.fn());
const releaseModalHistoryForNavigation = vi.hoisted(() => vi.fn());
const requireAuth = vi.hoisted(() => vi.fn(() => true));
const isInstalledAppMock = vi.hoisted(() => vi.fn(() => false));
const useMeMock = vi.hoisted(() =>
  vi.fn(
    (): {
      isLoggedIn: boolean;
      isSessionPending: boolean;
      isPremium: boolean;
      isPremiumResolved: boolean;
      isPremiumError: boolean;
      isPremiumPlan: boolean;
      isInfinitePlan: boolean;
      interval?: "monthly" | "quarterly" | "yearly" | null;
      tokenBalance: number | undefined;
    } => ({
      isLoggedIn: true,
      isSessionPending: false,
      isPremium: false,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: false,
      isInfinitePlan: false,
      interval: null,
      tokenBalance: 30 as number | undefined,
    }),
  ),
);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: routerPush, replace: vi.fn() }),
  usePathname: () => "/generate",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/hooks/use-me", () => ({
  useMe: () => useMeMock(),
  useInvalidateMe: () => vi.fn(),
}));

vi.mock("@/components/common/auth/auth-gate", () => ({
  AuthGateProvider: ({ children }: { children: unknown }) => children,
  useAuthGate: () => ({
    requireAuth,
    isLoggedIn: true,
    isSessionPending: false,
  }),
}));

vi.mock("@/hooks/use-my-characters", () => ({
  useMyCharacters: () => ({ data: { items: [], total: 0 }, refetch: vi.fn() }),
}));

vi.mock("@/hooks/use-wallet-stream", () => ({
  useWalletStream: vi.fn(),
}));

vi.mock("@/lib/modal-history", () => ({
  releaseModalHistoryForNavigation,
}));

vi.mock("@/lib/is-installed-app", () => ({
  isInstalledApp: isInstalledAppMock,
}));

vi.mock("@/components/common/pricing-modals/get-premium-popup/get-premium", () => ({
  GetPremium: ({ open, onContinue }: { open?: boolean; onContinue?: () => void }) =>
    open ? (
      <div data-testid="get-premium-modal">
        <button type="button" onClick={onContinue}>
          premium-continue
        </button>
      </div>
    ) : null,
}));

vi.mock("@/components/common/token-modals/get-tokens-modal", () => ({
  GetTokensModal: ({ open, onUpgrade }: { open?: boolean; onUpgrade?: () => void }) =>
    open ? (
      <div data-testid="get-tokens-modal">
        <button type="button" onClick={onUpgrade}>
          Upgrade to Infinite
        </button>
      </div>
    ) : null,
  GetTokensModalInfinite: () => null,
  GetTokensModalOutOfTokens: ({ open, onUpgrade }: { open?: boolean; onUpgrade?: () => void }) =>
    open ? (
      <div data-testid="get-tokens-out-of-tokens">
        <button type="button" onClick={onUpgrade}>
          Upgrade to Infinite
        </button>
      </div>
    ) : null,
}));

vi.mock("@/components/common/general/age-warning/age-warning", () => ({
  AgeWarning: () => null,
  AGE_WARNING_COOKIE_NAME: "spicestars-age-confirmed",
}));

vi.mock("@/components/common/general/latest-news-popup", () => ({
  LatestNewsPopup: () => null,
  LATEST_NEWS_ENABLED: false,
}));

vi.mock("@/components/common/payment-modals/hear-about-us", () => ({
  HearAboutUsAfterPurchase: () => null,
}));

// Production keeps navigation v2 unpublished. These cases cover the shell once
// the flag is flipped on.
const navigationV2Enabled = vi.hoisted(() => ({ current: true }));

vi.mock("@/lib/feature-flags", async () => {
  const actual = await vi.importActual<typeof FeatureFlags>("@/lib/feature-flags");
  return {
    ...actual,
    get NAVIGATION_V2_ENABLED() {
      return navigationV2Enabled.current;
    },
  };
});

import { QueryProvider } from "@/components/providers/query-provider";

import { MainLayoutShell } from "./main-layout-shell";

beforeEach(() => {
  navigationV2Enabled.current = true;
});

describe("MainLayoutShell premium upsell", () => {
  beforeEach(() => {
    routerPush.mockReset();
    releaseModalHistoryForNavigation.mockReset();
    requireAuth.mockReset();
    requireAuth.mockReturnValue(true);
    isInstalledAppMock.mockReturnValue(false);
    useMeMock.mockReturnValue({
      isLoggedIn: true,
      isSessionPending: false,
      isPremium: false,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: false,
      isInfinitePlan: false,
      tokenBalance: 30,
    });
  });

  it("sends the header token balance to /premium instead of opening Get Premium", async () => {
    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "30" }));

    expect(screen.queryByTestId("get-premium-modal")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(routerPush).toHaveBeenCalledWith("/premium");
    });
  });

  it("sends sidebar Get Premium to /premium instead of opening the modal", async () => {
    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    const premium = document.querySelector('[data-slot="v2-nav"] [data-item-id="premium"]');
    expect(premium).toBeInstanceOf(HTMLElement);
    fireEvent.click(premium as HTMLElement);

    expect(screen.queryByTestId("get-premium-modal")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(routerPush).toHaveBeenCalledWith("/premium");
    });
  });

  it("does not show the crown CTA for a premium subscriber", () => {
    useMeMock.mockReturnValue({
      isLoggedIn: true,
      isSessionPending: false,
      isPremium: true,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: true,
      isInfinitePlan: false,
      tokenBalance: 30,
    });

    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    expect(screen.queryByRole("button", { name: "-75%" })).not.toBeInTheDocument();
    expect(screen.queryByTestId("get-premium-modal")).not.toBeInTheDocument();
  });

  it("opens /premium on the Infinite tab from Upgrade to Infinite", async () => {
    useMeMock.mockReturnValue({
      isLoggedIn: true,
      isSessionPending: false,
      isPremium: true,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: true,
      isInfinitePlan: false,
      tokenBalance: 30,
    });

    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "30" }));
    await waitFor(() => {
      expect(screen.getByTestId("get-tokens-modal")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Upgrade to Infinite" }));

    expect(releaseModalHistoryForNavigation).toHaveBeenCalledTimes(1);
    expect(routerPush).toHaveBeenCalledWith("/premium?plan=infinite");
    expect(releaseModalHistoryForNavigation.mock.invocationCallOrder[0]).toBeLessThan(
      routerPush.mock.invocationCallOrder[0]!,
    );
    expect(screen.queryByTestId("get-tokens-modal")).not.toBeInTheDocument();
  });

  it("rechecks /me after login instead of using the guest premium snapshot", async () => {
    let resume: (() => void) | undefined;
    requireAuth.mockImplementation((options?: { onSuccess?: () => void }) => {
      resume = options?.onSuccess;
      return false;
    });
    useMeMock.mockReturnValue({
      isLoggedIn: false,
      isSessionPending: false,
      isPremium: false,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: false,
      isInfinitePlan: false,
      tokenBalance: undefined,
    });

    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    const premium = document.querySelector('[data-slot="v2-nav"] [data-item-id="premium"]');
    expect(premium).toBeInstanceOf(HTMLElement);
    fireEvent.click(premium as HTMLElement);
    expect(resume).toEqual(expect.any(Function));

    useMeMock.mockReturnValue({
      isLoggedIn: true,
      isSessionPending: false,
      isPremium: true,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: true,
      isInfinitePlan: false,
      tokenBalance: 30,
    });
    resume?.();

    await waitFor(() => {
      expect(screen.getByTestId("get-tokens-modal")).toBeInTheDocument();
    });
    expect(routerPush).not.toHaveBeenCalledWith("/premium");
  });
});

describe("MainLayoutShell mobile overlay CTAs", () => {
  beforeEach(() => {
    routerPush.mockReset();
    releaseModalHistoryForNavigation.mockReset();
    requireAuth.mockReset();
    requireAuth.mockReturnValue(false);
    isInstalledAppMock.mockReturnValue(false);
    useMeMock.mockReturnValue({
      isLoggedIn: false,
      isSessionPending: false,
      isPremium: false,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: false,
      isInfinitePlan: false,
      tokenBalance: undefined,
    });
  });

  it("closes the overlay and requests signup when Try Free is clicked", () => {
    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    const overlay = document.querySelector("[data-slot='main-layout-sidebar-mobile']");
    expect(overlay).toHaveAttribute("data-open", "true");

    fireEvent.click(screen.getByRole("button", { name: "Try Free +30" }));

    expect(overlay).toHaveAttribute("data-open", "false");
    expect(requireAuth).toHaveBeenCalledWith({ preferModal: "signup" });
  });

  it("keeps the header above the mobile close scrim", () => {
    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    const layout = document.querySelector('[data-slot="main-layout"]');
    const scrim = document.querySelector('[aria-label="Close sidebar"]');
    const overlay = document.querySelector<HTMLElement>("[data-slot='main-layout-sidebar-mobile']");
    const bottomNav = document.querySelector<HTMLElement>("[data-slot='homepage-bottom-nav']");

    expect(scrim).toHaveClass("z-[75]");
    expect(overlay).toHaveClass("z-[80]");
    expect(bottomNav).toHaveClass("z-[70]");
    expect(screen.getByRole("navigation", { name: "Application header" })).toHaveClass("z-[85]");
    expect(layout).toHaveClass("isolate");
    expect(layout).toContainElement(overlay);
    expect(layout).toContainElement(bottomNav);
  });

  it("shows Install Spicestars App in the mobile overlay in the browser", () => {
    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    const overlay = document.querySelector("[data-slot='main-layout-sidebar-mobile']");
    const getApp = overlay?.querySelector('[data-item-id="get-spicestars-app"]');

    expect(overlay).toHaveAttribute("data-open", "true");
    expect(getApp).toBeInTheDocument();
    expect(getApp).toHaveTextContent("Get SpiceStars App");
  });

  it("hides Install Spicestars App in the mobile overlay when already in the downloaded app", () => {
    isInstalledAppMock.mockReturnValue(true);

    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    const overlay = document.querySelector("[data-slot='main-layout-sidebar-mobile']");

    expect(overlay).toHaveAttribute("data-open", "true");
    expect(overlay?.querySelector('[data-item-id="get-spicestars-app"]')).not.toBeInTheDocument();
  });
});

describe("MainLayoutShell mobile document scroll", () => {
  it("lets the document scroll on mobile so Safari can hide its HUD", () => {
    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    const layout = document.querySelector('[data-slot="main-layout"]');
    const main = document.querySelector('[data-slot="main-layout-main"]');

    expect(layout).toHaveClass("min-h-[100lvh]", "md:h-dvh", "md:overflow-hidden");
    expect(layout?.className.split(/\s+/)).not.toContain("overflow-hidden");
    expect(main).toHaveClass("md:overflow-y-auto", "md:overflow-x-clip");
    expect(main?.className.split(/\s+/)).not.toContain("overflow-y-auto");
    expect(main?.className.split(/\s+/)).not.toContain("overflow-x-clip");
  });
});

describe("MainLayoutShell infinite yearly navigation", () => {
  beforeEach(() => {
    useMeMock.mockReturnValue({
      isLoggedIn: true,
      isSessionPending: false,
      isPremium: true,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: false,
      isInfinitePlan: true,
      interval: "yearly",
      tokenBalance: 534,
    });
  });

  it("uses the V2 rail and drops the mobile overlay", () => {
    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    expect(document.querySelector('[data-slot="v2-nav"]')).toHaveAttribute(
      "data-premium",
      "infinite-yearly",
    );
    expect(
      document.querySelector('[data-slot="main-layout-sidebar-mobile"]'),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Toggle sidebar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "My Plan" })).toBeInTheDocument();
  });
});

describe("MainLayoutShell infinite monthly navigation", () => {
  beforeEach(() => {
    routerPush.mockReset();
    useMeMock.mockReturnValue({
      isLoggedIn: true,
      isSessionPending: false,
      isPremium: true,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: false,
      isInfinitePlan: true,
      interval: "monthly",
      tokenBalance: 534,
    });
  });

  it("uses the monthly rail and sends Upgrade to the Infinite plan", () => {
    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    expect(document.querySelector('[data-slot="v2-nav"]')).toHaveAttribute(
      "data-premium",
      "infinite-monthly",
    );
    expect(
      document.querySelector('[data-slot="main-layout-sidebar-mobile"]'),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "My Plan" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Upgrade" }));
    expect(routerPush).toHaveBeenCalledWith("/premium?plan=infinite");

    fireEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    expect(screen.getByRole("button", { name: "Language" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Redeem Coupon" })).toBeInTheDocument();
  });
});

describe("MainLayoutShell premium navigation", () => {
  beforeEach(() => {
    routerPush.mockReset();
    useMeMock.mockReturnValue({
      isLoggedIn: true,
      isSessionPending: false,
      isPremium: true,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: true,
      isInfinitePlan: false,
      interval: "monthly",
      tokenBalance: 534,
    });
  });

  it("uses the premium rail, drops the mobile overlay, and sends Upgrade to Infinite", () => {
    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    expect(document.querySelector('[data-slot="v2-nav"]')).toHaveAttribute(
      "data-premium",
      "premium",
    );
    expect(
      document.querySelector('[data-slot="main-layout-sidebar-mobile"]'),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Toggle sidebar" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "My Plan" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Premium" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "English" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "App" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    const accountMenu = screen.getByRole("navigation", { name: "Modal navigation" });
    expect(accountMenu).toHaveTextContent("Tokens");
    expect(accountMenu).toHaveTextContent("Language");
    expect(accountMenu).toHaveTextContent("Redeem Coupon");

    fireEvent.click(screen.getByRole("button", { name: "Upgrade" }));
    expect(routerPush).toHaveBeenCalledWith("/premium?plan=infinite");
  });
});

describe("MainLayoutShell free and signed-out navigation", () => {
  beforeEach(() => {
    routerPush.mockReset();
    requireAuth.mockReset();
    requireAuth.mockReturnValue(true);
    isInstalledAppMock.mockReturnValue(false);
    useMeMock.mockReturnValue({
      isLoggedIn: true,
      isSessionPending: false,
      isPremium: false,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: false,
      isInfinitePlan: false,
      interval: null,
      tokenBalance: 30,
    });
  });

  it("uses the free desktop rail, the Premium tab, and the full mobile menu", async () => {
    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    const rail = document.querySelector('[data-slot="v2-nav"]');
    expect(rail).toHaveAttribute("data-premium", "free");
    expect(rail).toHaveTextContent("Premium");
    expect(rail).toHaveTextContent("Profile");
    expect(rail).toHaveTextContent("English");
    expect(document.querySelector('[data-slot="v2-mobile-overlay"]')).toHaveTextContent(
      "Get Premium",
    );
    expect(document.querySelector('[data-slot="v2-mobile-overlay"]')).toHaveTextContent("-80%");
    expect(document.querySelector('[data-slot="v2-mobile-nav"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="homepage-bottom-nav"]')).toHaveTextContent("-85%");
    expect(screen.getByRole("button", { name: "Toggle sidebar" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    const accountMenu = screen.getByRole("navigation", { name: "Modal navigation" });
    expect(accountMenu).toHaveTextContent("Premium");
    expect(accountMenu).toHaveTextContent("-75%");
    expect(accountMenu).toHaveTextContent("Language");
    expect(accountMenu).toHaveTextContent("Redeem Coupon");
    expect(accountMenu).not.toHaveTextContent("Tokens");

    fireEvent.click(rail?.querySelector('[data-slot="v2-nav-plan"]') as HTMLElement);
    await waitFor(() => {
      expect(routerPush).toHaveBeenCalledWith("/premium");
    });
    expect(routerPush).not.toHaveBeenCalledWith("/premium?plan=infinite");
  });

  it("keeps the sidebar overlay for a signed-out visitor", () => {
    useMeMock.mockReturnValue({
      isLoggedIn: false,
      isSessionPending: false,
      isPremium: false,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: false,
      isInfinitePlan: false,
      interval: null,
      tokenBalance: undefined,
    });

    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    expect(document.querySelector('[data-slot="v2-mobile-nav"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="v2-mobile-overlay"]')).toHaveTextContent("Upgrade");
    expect(document.querySelector('[data-slot="v2-mobile-overlay"]')).toHaveTextContent(
      "Get SpiceStars App",
    );
    expect(screen.getByRole("button", { name: "Try Free +30" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Toggle sidebar" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    const accountMenu = screen.getByRole("navigation", { name: "Modal navigation" });
    expect(accountMenu).toHaveTextContent("Sign up");
    expect(accountMenu).toHaveTextContent("Login");
    expect(accountMenu).toHaveTextContent("Premium");
    expect(accountMenu).toHaveTextContent("-75%");
    expect(accountMenu).toHaveTextContent("Language");
    expect(accountMenu).toHaveTextContent("Affiliates");
    expect(accountMenu).toHaveTextContent("Menu");
    expect(accountMenu).not.toHaveTextContent("Redeem Coupon");
    expect(accountMenu).not.toHaveTextContent("Logout");
  });

  it("keeps the previous sidebar until billing has loaded", () => {
    useMeMock.mockReturnValue({
      isLoggedIn: true,
      isSessionPending: true,
      isPremium: false,
      isPremiumResolved: false,
      isPremiumError: false,
      isPremiumPlan: false,
      isInfinitePlan: false,
      interval: null,
      tokenBalance: undefined,
    });

    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    expect(document.querySelector('[data-slot="v2-nav"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="main-layout-sidebar-mobile"]')).toBeInTheDocument();
  });
});

describe("MainLayoutShell while navigation v2 is unpublished", () => {
  beforeEach(() => {
    navigationV2Enabled.current = false;
    useMeMock.mockReturnValue({
      isLoggedIn: true,
      isSessionPending: false,
      isPremium: false,
      isPremiumResolved: true,
      isPremiumError: false,
      isPremiumPlan: false,
      isInfinitePlan: false,
      interval: null,
      tokenBalance: 30,
    });
  });

  it("keeps the current sidebar on the site", () => {
    render(
      <QueryProvider>
        <MainLayoutShell policies={[]} socials={[]}>
          page
        </MainLayoutShell>
      </QueryProvider>,
    );

    expect(document.querySelector('[data-slot="v2-nav"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="v2-mobile-overlay"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="v2-mobile-nav"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="side-nav"]')).toBeInTheDocument();
  });
});
