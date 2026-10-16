"use client";

import * as React from "react";

export type MainNavContextValue = {
  layoutElement: HTMLElement | null;
  requestMembership: () => void;
  requestAgeVerification: () => void;
  requestPremium: () => void;
};

const MainNavContext = React.createContext<MainNavContextValue | null>(null);

export function useMainNavContext() {
  return React.useContext(MainNavContext);
}
