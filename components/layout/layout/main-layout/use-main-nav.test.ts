import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ROUTES } from "@/lib/routes";

const pathnameState = vi.hoisted(() => ({ value: "/" }));
const routerPush = vi.hoisted(() => vi.fn());
const requireAuth = vi.hoisted(() => vi.fn(() => true));

vi.mock("next/navigation", () => ({
  usePathname: () => pathnameState.value,
  useRouter: () => ({ push: routerPush, replace: vi.fn(), prefetch: vi.fn() }),
}));

vi.mock("@/hooks/use-me", () => ({
  useMe: () => ({ isLoggedIn: false, isSessionPending: false }),
}));

vi.mock("@/components/common/auth/auth-gate", () => ({
  useAuthGate: () => ({
    requireAuth,
    isLoggedIn: false,
    isSessionPending: false,
  }),
}));

vi.mock("@/components/common/pre-launch", () => ({
  usePreLaunchGate: () => ({ isLocked: false, showNotice: vi.fn() }),
}));

vi.mock(
  "@/components/common/pricing-modals/join-premium-flow/premium-leave-retention-gate",
  () => ({
    usePremiumLeaveRetention: () => ({ requestLeave: () => true }),
  }),
);

vi.mock("@/components/common/pricing-modals/infinite-upsell/upgrade-leave-retention-gate", () => ({
  useUpgradeLeaveRetention: () => ({ requestLeave: () => true }),
}));

vi.mock("@/hooks/use-explore-nav-route", () => ({
  useExploreAwareHref: () => (href: string | undefined) => href,
}));

const { useMainNav } = await import("./use-main-nav");

describe("useMainNav sidebar expand (FRONT-605)", () => {
  beforeEach(() => {
    pathnameState.value = ROUTES.root;
    routerPush.mockReset();
    requireAuth.mockReset();
    requireAuth.mockReturnValue(true);
  });

  it("starts expanded on the homepage", () => {
    const { result } = renderHook(() => useMainNav());

    expect(result.current.sidebarExpanded).toBe(true);
  });

  it("starts expanded on the signed-in Explore feed", () => {
    pathnameState.value = ROUTES.explore;

    const { result } = renderHook(() => useMainNav());

    expect(result.current.sidebarExpanded).toBe(true);
  });

  it("starts collapsed on an in-app page", () => {
    pathnameState.value = ROUTES.chat;

    const { result } = renderHook(() => useMainNav());

    expect(result.current.sidebarExpanded).toBe(false);
  });

  it("collapses when navigating from the homepage to Chat, Generate, or My AIs", () => {
    const { result, rerender } = renderHook(() => useMainNav());

    expect(result.current.sidebarExpanded).toBe(true);

    for (const href of [ROUTES.chat, ROUTES.generate, ROUTES.profile]) {
      pathnameState.value = ROUTES.root;
      rerender();
      act(() => {
        result.current.setSidebarExpanded(true);
      });

      pathnameState.value = href;
      rerender();

      expect(result.current.sidebarExpanded).toBe(false);
    }
  });

  it("collapses when navigating between in-app pages", () => {
    pathnameState.value = ROUTES.chat;
    const { result, rerender } = renderHook(() => useMainNav());

    act(() => {
      result.current.setSidebarExpanded(true);
    });
    expect(result.current.sidebarExpanded).toBe(true);

    pathnameState.value = ROUTES.generate;
    rerender();

    expect(result.current.sidebarExpanded).toBe(false);
  });

  it("expands again when returning to Homepage or Explore", () => {
    pathnameState.value = ROUTES.chat;
    const { result, rerender } = renderHook(() => useMainNav());

    expect(result.current.sidebarExpanded).toBe(false);

    pathnameState.value = ROUTES.root;
    rerender();
    expect(result.current.sidebarExpanded).toBe(true);

    pathnameState.value = ROUTES.profile;
    rerender();
    expect(result.current.sidebarExpanded).toBe(false);

    pathnameState.value = ROUTES.explore;
    rerender();
    expect(result.current.sidebarExpanded).toBe(true);
  });

  it("does not override a manual collapse while still on the homepage", () => {
    const { result } = renderHook(() => useMainNav());

    act(() => {
      result.current.setSidebarExpanded(false);
    });

    expect(result.current.sidebarExpanded).toBe(false);
  });
});

describe("useMainNav auth-gated destinations", () => {
  beforeEach(() => {
    pathnameState.value = ROUTES.root;
    routerPush.mockReset();
    requireAuth.mockReset();
    requireAuth.mockReturnValue(false);
  });

  it("opens signup instead of navigating when a guest clicks Settings", () => {
    const { result } = renderHook(() => useMainNav());

    act(() => {
      result.current.handleItemClick({ id: "settings", label: "Settings", leftIcon: null });
    });

    expect(requireAuth).toHaveBeenCalledWith(expect.objectContaining({ preferModal: "signup" }));
    expect(routerPush).not.toHaveBeenCalled();
  });

  it("opens signup instead of navigating when a guest clicks My AIs", () => {
    const { result } = renderHook(() => useMainNav());

    act(() => {
      result.current.handleItemClick({ id: "my-ais", label: "My AIs", leftIcon: null });
    });

    expect(requireAuth).toHaveBeenCalledWith(expect.objectContaining({ preferModal: "signup" }));
    expect(routerPush).not.toHaveBeenCalled();
  });

  it("navigates to My AIs at /my-ais after auth succeeds", () => {
    requireAuth.mockImplementation((options?: { onSuccess?: () => void }) => {
      options?.onSuccess?.();
      return false;
    });
    const { result } = renderHook(() => useMainNav());

    act(() => {
      result.current.handleItemClick({ id: "my-ais", label: "My AIs", leftIcon: null });
    });

    expect(routerPush).toHaveBeenCalledWith(ROUTES.profile);
    expect(ROUTES.profile).toBe("/my-ais");
  });

  it("does not navigate when Get Spicestars App is clicked", () => {
    requireAuth.mockReturnValue(true);
    const { result } = renderHook(() => useMainNav());

    act(() => {
      result.current.handleItemClick({
        id: "get-spicestars-app",
        label: "Get Spicestars App",
        leftIcon: null,
      });
    });

    expect(routerPush).not.toHaveBeenCalled();
    expect(requireAuth).not.toHaveBeenCalled();
  });
});
