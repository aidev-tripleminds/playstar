import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type * as PreLaunchModule from "@/lib/pre-launch";

const routerPush = vi.hoisted(() => vi.fn());
const releaseModalHistoryForNavigation = vi.hoisted(() => vi.fn());
const requireAuth = vi.hoisted(() => vi.fn(() => true));
const isInstalledAppMock = vi.hoisted(() => vi.fn(() => false));
const useMeMock = vi.hoisted(() =>
  vi.fn(() => ({
    isLoggedIn: true,
    isSessionPending: false,
    isPremium: true,
    isPremiumResolved: true,
    isPremiumError: false,
    isPremiumPlan: false,
    isInfinitePlan: false,
    tokenBalance: 30 as number | undefined,
  })),
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

// The lock is ON and nothing is unlocked: the soft-launch production build.
vi.mock("@/lib/pre-launch", async (importOriginal) => ({
  ...(await importOriginal<typeof PreLaunchModule>()),
  IS_PRE_LAUNCH_LOCKED: true,
  PRE_LAUNCH_UNLOCKED_FEATURES: new Set(),
}));

// The welcome notice has been seen, so any notice in these tests comes from a
// blocked action, not from the first visit.
vi.mock("@/components/common/pre-launch/pre-launch-notice-session", () => ({
  PRE_LAUNCH_NOTICE_SEEN_KEY: "spicestars:pre-launch:notice-seen",
  hasSeenPreLaunchNotice: () => true,
  markPreLaunchNoticeSeen: vi.fn(),
  clearPreLaunchNoticeSeen: vi.fn(),
}));

vi.mock("@/components/common/pre-launch/pre-launch-notice", () => ({
  PreLaunchNotice: ({ open }: { open: boolean }) =>
    open ? <div data-testid="pre-launch-notice" /> : null,
}));

vi.mock("@/components/common/general/verify-age/verify-age", () => ({
  VerifyAge: ({ open }: { open: boolean }) =>
    open ? <div data-testid="verify-age-dialog" /> : null,
}));

import { QueryProvider } from "@/components/providers/query-provider";

import { MainLayoutShell } from "./main-layout-shell";
import { useMainNavContext } from "./main-nav-context";

function Actions() {
  const nav = useMainNavContext();
  return (
    <>
      <button type="button" onClick={() => nav?.requestAgeVerification?.()}>
        verify-age
      </button>
      <button type="button" onClick={() => nav?.requestMembership?.()}>
        membership
      </button>
    </>
  );
}

function renderLockedShell() {
  render(
    <QueryProvider>
      <MainLayoutShell policies={[]} socials={[]}>
        <Actions />
      </MainLayoutShell>
    </QueryProvider>,
  );
}

describe("MainLayoutShell while the pre-launch lock is on", () => {
  beforeEach(() => {
    requireAuth.mockReset();
    requireAuth.mockReturnValue(true);
  });

  // Age verification is a legal check, not a product feature: a user in a
  // region that requires it must be able to verify even before launch.
  it("opens age verification instead of the pre-launch notice", () => {
    renderLockedShell();
    fireEvent.click(screen.getByRole("button", { name: "verify-age" }));
    expect(screen.getByTestId("verify-age-dialog")).toBeTruthy();
    expect(screen.queryByTestId("pre-launch-notice")).toBeNull();
  });

  it("still shows the notice for membership while no premium feature is unlocked", () => {
    renderLockedShell();
    fireEvent.click(screen.getByRole("button", { name: "membership" }));
    expect(screen.getByTestId("pre-launch-notice")).toBeTruthy();
    expect(screen.queryByTestId("get-premium-modal")).toBeNull();
  });
});
