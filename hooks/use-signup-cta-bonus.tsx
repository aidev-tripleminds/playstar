"use client";

import * as React from "react";

import { useBootstrap } from "./use-bootstrap";

/**
 * Key under `Bootstrap.features` carrying the bonus tokens a visitor earns by
 * signing up through a CMS page's "Try for free" CTA (BACK-149).
 *
 * The amount is admin-configurable per system/organization/brand, so it is
 * resolved by the backend and read here — never authored in Prismic. CMS copy
 * is what let the button say "+10" while signup granted something else.
 */
export const SIGNUP_CTA_BONUS_FEATURE_KEY = "signup_cta_bonus_tokens";

/**
 * Used while bootstrap is in flight, when the backend does not carry the key
 * yet (it is added by the pending backend task), and anywhere the provider is
 * not mounted (Storybook, unit tests).
 *
 * Deliberately the product's current intended value rather than 0: a CTA that
 * briefly reads "+0 tokens" is worse than one that briefly reads the usual
 * amount, and the badge is decoration on a button whose behaviour does not
 * depend on it.
 */
export const SIGNUP_CTA_BONUS_FALLBACK = 10;

/**
 * Narrows one `features` entry to a usable token count.
 *
 * `features` is `Record<string, unknown>` because the backend adds keys to it
 * without a frontend release, so the value is checked rather than trusted. A
 * non-numeric or negative value is treated as absent — a malformed config must
 * not render "+NaN" into marketing copy.
 */
export function readSignupCtaBonus(features: Record<string, unknown> | undefined): number {
  const raw = features?.[SIGNUP_CTA_BONUS_FEATURE_KEY];
  return typeof raw === "number" && Number.isFinite(raw) && raw >= 0
    ? raw
    : SIGNUP_CTA_BONUS_FALLBACK;
}

/**
 * Context rather than a direct `useBootstrap()` call in every CTA, for two
 * reasons: one bootstrap subscription per page instead of one per CTA, and —
 * more importantly — a default value means a CTA renders correctly with no
 * `QueryClientProvider` above it. Leaf marketing components should not drag a
 * data-fetching dependency into every test and story that renders them; this
 * mirrors how `useAuthGate` already degrades outside its provider.
 */
const SignupCtaBonusContext = React.createContext<number>(SIGNUP_CTA_BONUS_FALLBACK);

/** Resolves the configured bonus once and shares it with every CTA below. */
export function SignupCtaBonusProvider({ children }: { children: React.ReactNode }) {
  const { data } = useBootstrap();
  const bonus = readSignupCtaBonus(data?.features);

  return <SignupCtaBonusContext.Provider value={bonus}>{children}</SignupCtaBonusContext.Provider>;
}

/** Bonus tokens advertised on the CMS "Try for free" CTA. */
export function useSignupCtaBonus(): number {
  return React.useContext(SignupCtaBonusContext);
}

/** The bonus rendered as it appears on the badge, e.g. `+10`. */
export function useSignupCtaBonusLabel(): string {
  return `+${useSignupCtaBonus()}`;
}
