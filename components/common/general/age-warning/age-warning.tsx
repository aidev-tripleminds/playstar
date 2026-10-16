"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  CookiePopup,
  hasCookieConsent,
} from "@/components/common/general/cookie-popup/cookie-popup";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { DialogDescription } from "@/components/ui/dialog";
import { recordConsent } from "@/lib/api/consent";
import {
  ONE_YEAR_SECONDS,
  readCookie,
  subscribeToCookieKey,
  writeCookie,
} from "@/lib/browser-cookie";
import { cn } from "@/lib/utils";

/** Proof-of-consent cookie: value is the ISO timestamp the user clicked "Continue", for audit purposes. */
export const AGE_WARNING_COOKIE_NAME = "spicestars-age-confirmed";
const AGE_WARNING_COOKIE_MAX_AGE_SECONDS = ONE_YEAR_SECONDS;

export type AgeWarningProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When true (default), opens automatically once until the user continues. */
  autoOpenOnce?: boolean;
  cookieName?: string;
  cookieConsentCookieName?: string;
  termsHref?: string;
  onContinue?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  className?: string;
};

/** Sequential legal gates: age first, cookies only after age is cleared. */
type ConsentPhase = "age" | "cookies" | "done";

/**
 * The cookie is client-writable, so an empty or unparseable value is no proof at
 * all — treat it as "not confirmed" and show the gate again rather than letting
 * garbage unlock the site.
 */
function getAgeConfirmation(cookieName: string): string | null {
  const raw = readCookie(cookieName);
  return raw && !Number.isNaN(Date.parse(raw)) ? raw : null;
}

function hasAcknowledgedAgeWarning(cookieName: string) {
  return getAgeConfirmation(cookieName) != null;
}

/**
 * Persist the confirmation locally (the UI gate) and post the audit proof to the
 * backend, which cannot see this cookie. Both carry the same timestamp.
 */
function setAcknowledgedAgeWarning(cookieName: string) {
  const timestamp = new Date().toISOString();
  writeCookie(cookieName, timestamp, AGE_WARNING_COOKIE_MAX_AGE_SECONDS);
  void recordConsent({ type: "age" }, timestamp);
}

function resolveConsentPhase(ageCookieName: string, cookieConsentCookieName: string): ConsentPhase {
  if (!hasAcknowledgedAgeWarning(ageCookieName)) {
    return "age";
  }
  if (!hasCookieConsent(cookieConsentCookieName)) {
    return "cookies";
  }
  return "done";
}

/**
 * Client consent phase from cookies.
 * Server/hydration snapshot is "done" so neither gate flashes during SSR.
 */
function useConsentPhase(ageCookieName: string, cookieConsentCookieName: string): ConsentPhase {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const unsubscribeAge = subscribeToCookieKey(ageCookieName, onStoreChange);
      const unsubscribeCookie = subscribeToCookieKey(cookieConsentCookieName, onStoreChange);
      return () => {
        unsubscribeAge();
        unsubscribeCookie();
      };
    },
    [ageCookieName, cookieConsentCookieName],
  );

  const getSnapshot = React.useCallback(
    () => resolveConsentPhase(ageCookieName, cookieConsentCookieName),
    [ageCookieName, cookieConsentCookieName],
  );

  return React.useSyncExternalStore(subscribe, getSnapshot, () => "done");
}

const AGE_DECLINE_REDIRECT_URL = "https://www.google.com";

export function AgeWarning({
  trigger,
  open: openProp,
  defaultOpen,
  onOpenChange,
  autoOpenOnce = true,
  cookieName = AGE_WARNING_COOKIE_NAME,
  cookieConsentCookieName = COOKIE_CONSENT_STORAGE_KEY,
  termsHref = "/",
  onContinue,
  onCancel,
  onClose,
  className,
}: AgeWarningProps) {
  const isControlled = openProp !== undefined;
  const [dismissed, setDismissed] = React.useState(false);
  const phase = useConsentPhase(cookieName, cookieConsentCookieName);

  const shouldAutoOpen = autoOpenOnce && phase === "age";
  const uncontrolledOpen = !dismissed && (defaultOpen ?? shouldAutoOpen);
  const open = isControlled ? Boolean(openProp) : uncontrolledOpen;

  // Re-show the gate after Cancel → Google → browser Back (including bfcache restore).
  React.useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && !hasAcknowledgedAgeWarning(cookieName)) {
        setDismissed(false);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [cookieName]);

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      // Only "I am over 18" may dismiss the gate; Escape/outside/X cannot enter the site.
      if (!nextOpen && !hasAcknowledgedAgeWarning(cookieName)) {
        return;
      }
      if (!isControlled && !nextOpen) {
        setDismissed(true);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange, cookieName],
  );

  // Never stack gates: cookies only after age is acknowledged and the age modal is closed.
  const showCookiePopup = phase === "cookies" && !open;

  const leaveSite = React.useCallback(() => {
    onCancel?.();
    window.location.assign(AGE_DECLINE_REDIRECT_URL);
  }, [onCancel]);

  const handleClose = React.useCallback(() => {
    onClose?.();
    leaveSite();
  }, [leaveSite, onClose]);

  const handleContinue = () => {
    setAcknowledgedAgeWarning(cookieName);
    onContinue?.();
    setOpen(false);
  };

  const handleCancel = () => {
    leaveSite();
  };

  return (
    <>
      <ModalLayout
        trigger={trigger}
        open={open}
        onOpenChange={setOpen}
        title="Adults Only"
        showIcon={false}
        showClose={false}
        showMobileHandle
        dismissOnOutsideClick={false}
        headerClassName="sr-only"
        onClose={handleClose}
        className={cn("border-surface-strong bg-dialog-bg z-71 md:max-w-[390px]", className)}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="/assets/logo-spicestars.svg"
            alt="SpiceStars"
            width={120}
            height={24}
            className="h-6 w-[120px]"
          />

          <div
            aria-hidden
            className="flex size-[100px] items-center justify-center rounded-full p-2"
            style={{
              border: "1px solid var(--Button-Pink-Primary-Gradient, #F6339A)",
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(255, 88, 176, 0.30) 0%, rgba(255, 88, 176, 0.00) 100%)",
            }}
          >
            <span className="bg-[linear-gradient(149deg,#fda5d5_0%,#c6005c_50%)] bg-clip-text text-[36px] leading-none font-bold text-transparent drop-shadow-[0_0_5px_rgba(230,0,118,0.1)]">
              18+
            </span>
          </div>

          <div className="flex w-full flex-col">
            <p className="text-select-text text-[18px] leading-7 font-semibold" aria-hidden>
              Adults Only
            </p>
            <DialogDescription className="text-modal-text text-sm leading-5 font-normal">
              By entering, you agree to our{" "}
              <Link href={termsHref} className="text-modal-text underline">
                Terms
              </Link>
              .
            </DialogDescription>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Buttons
              variant="rose"
              size="btn-m"
              leftIcon={false}
              rightIcon={false}
              label="I am over 18 – Continue"
              onClick={handleContinue}
              className="w-full max-w-none cursor-pointer"
            />
            <Buttons
              variant="neutral"
              size="btn-s"
              leftIcon={false}
              rightIcon={false}
              label="Leave now"
              onClick={handleCancel}
              className="w-full max-w-none cursor-pointer text-[12px]! leading-4"
            />
          </div>
        </div>
      </ModalLayout>

      <CookiePopup open={showCookiePopup} cookieName={cookieConsentCookieName} />
    </>
  );
}
