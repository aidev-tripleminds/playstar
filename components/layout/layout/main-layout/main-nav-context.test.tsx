import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  MainNavContext,
  type MainNavContextValue,
  useMainLayoutPageHero,
} from "./main-nav-context";

function PageHero({ enabled = true }: { enabled?: boolean }) {
  useMainLayoutPageHero(enabled);
  return null;
}

function contextValue(
  registerPageHero: MainNavContextValue["registerPageHero"],
): MainNavContextValue {
  return {
    sidebarExpanded: false,
    setSidebarExpanded: vi.fn(),
    closeMobileSidebar: vi.fn(),
    registerPageHero,
  };
}

describe("useMainLayoutPageHero", () => {
  it("registers the hero for its mounted lifetime", () => {
    const unregister = vi.fn();
    const register = vi.fn(() => unregister);

    const { unmount } = render(
      <MainNavContext.Provider value={contextValue(register)}>
        <PageHero />
      </MainNavContext.Provider>,
    );

    expect(register).toHaveBeenCalledOnce();

    unmount();

    expect(unregister).toHaveBeenCalledOnce();
  });

  it("does not register an ordinary embedded homepage", () => {
    const register = vi.fn(() => vi.fn());

    render(
      <MainNavContext.Provider value={contextValue(register)}>
        <PageHero enabled={false} />
      </MainNavContext.Provider>,
    );

    expect(register).not.toHaveBeenCalled();
  });
});
