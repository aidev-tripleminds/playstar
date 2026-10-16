"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { useAuthGate } from "@/components/common/auth/auth-gate";
import { ROUTES } from "@/lib/routes";

export type PromoBannerCtaValue = {
  /** Set for a logged-in visitor so the banner stays a real link. */
  href: string | undefined;
  /** Opens signup when logged out. Logged-in clicks go to /premium. */
  onClick: () => void;
};

/**
 * Click behaviour for the homepage hero banner and the Prismic SEO banner
 * (FRONT-695): guests open signup, signed-in visitors go to pricing.
 *
 * The logged-in case is a real `href` rather than a router push so middle-click
 * and "open in new tab" work. A visitor who authenticates through the modal is
 * sent to the same destination by the gate's success callback.
 */
export function usePromoBannerCta(): PromoBannerCtaValue {
  const { requireAuth, isLoggedIn } = useAuthGate();
  const router = useRouter();
  const openPremium = React.useCallback(() => {
    router.push(ROUTES.premium);
  }, [router]);

  const onClick = React.useCallback(() => {
    const canContinue = requireAuth({
      preferModal: "signup",
      onSuccess: openPremium,
      verifyEmailReturnTo: ROUTES.premium,
    });
    if (canContinue) openPremium();
  }, [openPremium, requireAuth]);

  return { href: isLoggedIn ? ROUTES.premium : undefined, onClick };
}
