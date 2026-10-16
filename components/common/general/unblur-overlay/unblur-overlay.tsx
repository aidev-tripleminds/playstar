"use client";

import Image from "next/image";
import * as React from "react";

import { useAuthGate } from "@/components/common/auth/auth-gate";
import { Badge } from "@/components/common/general/badge/badge";
import { Buttons } from "@/components/common/general/button/buttons";
import {
  HOME_CARD_SIGNUP_BADGE_CLASS,
  HOME_CARD_UNBLUR_ICON_SRC,
  HOME_CARD_VARIANT_CONFIG,
  resolveHomeCardCtaClass,
} from "@/components/common/Prismic/home-cards/home-cards.constants";
import { useMainNavContext } from "@/components/layout/main-layout/main-nav-context";
import { useMe } from "@/hooks/use-me";
import { useSignupCtaBonusLabel } from "@/hooks/use-signup-cta-bonus";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** The home-card unblur variants (Figma 22629-187970) this overlay reuses. */
export type UnblurOverlayVariant = "unblur--premium" | "unblur--verify-age" | "unblur--sign-up";

const CloseOnAgeVerificationContext = React.createContext<(() => void) | null>(null);

/**
 * A modal that renders {@link UnblurOverlay} registers here so starting age
 * verification closes that modal. The verify dialog then opens alone.
 */
export function CloseOnAgeVerification({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <CloseOnAgeVerificationContext.Provider value={onClose}>
      {children}
    </CloseOnAgeVerificationContext.Provider>
  );
}

/**
 * Which unblur CTA the viewer gets: guests sign up, free accounts subscribe,
 * and premium accounts verify their age. `null` while the answer is unknown.
 */
export function useUnblurAction(): {
  variant: UnblurOverlayVariant | null;
  onAction: () => void;
} {
  const { isLoggedIn, isSessionPending, isPremium, isPremiumResolved } = useMe();
  const { requireAuth } = useAuthGate();
  const nav = useMainNavContext();
  const closeHostOnAgeVerification = React.useContext(CloseOnAgeVerificationContext);

  const variant: UnblurOverlayVariant | null = isSessionPending
    ? null
    : !isLoggedIn
      ? "unblur--sign-up"
      : !isPremiumResolved
        ? null
        : isPremium
          ? "unblur--verify-age"
          : "unblur--premium";

  const onAction = React.useCallback(() => {
    if (variant === "unblur--sign-up") {
      requireAuth({ preferModal: "signup" });
    } else if (variant === "unblur--premium") {
      if (nav?.requestMembership) nav.requestMembership();
      else window.location.assign(ROUTES.premium);
    } else if (variant === "unblur--verify-age") {
      closeHostOnAgeVerification?.();
      if (nav?.requestAgeVerification) nav.requestAgeVerification();
      else window.location.assign(ROUTES.ageVerification);
    }
  }, [closeHostOnAgeVerification, nav, requireAuth, variant]);

  return { variant, onAction };
}

export type UnblurPromptProps = Omit<React.ComponentProps<"div">, "children"> & {
  variant: UnblurOverlayVariant | null;
  onAction?: () => void;
  /** The Signup CTA's bonus badge, e.g. `+30`. */
  signupBonusLabel?: string;
};

/**
 * Eye-slash, "Unblur" and the CTA over media the backend sent blurred. It
 * scales down on tiles narrower than 200px. Only the CTA takes clicks, so the
 * tile underneath still opens its preview.
 */
export function UnblurPrompt({
  variant,
  onAction,
  signupBonusLabel,
  className,
  ...props
}: UnblurPromptProps) {
  const config = HOME_CARD_VARIANT_CONFIG[variant ?? "unblur--premium"];

  const stop = (event: React.SyntheticEvent) => event.stopPropagation();

  return (
    <div
      data-slot="unblur-overlay"
      data-variant={variant ?? undefined}
      className={cn(
        "@container pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/20",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-3 px-2 text-center @min-[200px]:gap-5">
        <div className="flex flex-col items-center gap-1.5">
          <Image
            src={HOME_CARD_UNBLUR_ICON_SRC}
            alt=""
            width={32}
            height={32}
            aria-hidden
            className="size-6 shrink-0 @min-[200px]:size-8"
          />
          <p className="text-tooltip-text text-base leading-5 font-semibold @min-[200px]:text-[22px] @min-[200px]:leading-[22px]">
            {config.unblurLabel}
          </p>
        </div>
        {variant ? (
          <Buttons
            data-slot="unblur-overlay-cta"
            type="button"
            variant={config.buttonVariant}
            size={config.buttonSize}
            label={config.ctaLabel}
            leftIcon={false}
            rightIcon={false}
            className={cn(
              "pointer-events-auto",
              resolveHomeCardCtaClass(variant, "desktop", config.buttonSize),
              "@max-[199px]:h-8! @max-[199px]:w-auto! @max-[199px]:px-3! @max-[199px]:text-xs!",
            )}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onAction?.();
            }}
            onKeyDown={stop}
            onPointerDown={stop}
          >
            {config.showSignupBadge && signupBonusLabel ? (
              <Badge
                className={HOME_CARD_SIGNUP_BADGE_CLASS}
                text={signupBonusLabel}
                type="empty"
                size="small"
              />
            ) : null}
          </Buttons>
        ) : null}
      </div>
    </div>
  );
}

/** {@link UnblurPrompt} with the CTA resolved for the current viewer. */
export function UnblurOverlay(props: Omit<UnblurPromptProps, "variant" | "onAction">) {
  const { variant, onAction } = useUnblurAction();
  const signupBonusLabel = useSignupCtaBonusLabel();
  return (
    <UnblurPrompt
      variant={variant}
      onAction={onAction}
      signupBonusLabel={signupBonusLabel}
      {...props}
    />
  );
}
