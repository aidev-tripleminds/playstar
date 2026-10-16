"use client";

import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { DialogDescription } from "@/components/ui/dialog";
import { type CookieConsentChoice, recordConsent } from "@/lib/api/consent";
import { ONE_YEAR_SECONDS, readCookie, writeCookie } from "@/lib/browser-cookie";
import { policyRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";

export const COOKIE_CONSENT_STORAGE_KEY = "spicestars-cookie-consent";
const COOKIE_CONSENT_MAX_AGE_SECONDS = ONE_YEAR_SECONDS;

export type CookiePopupProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  cookieName?: string;
  title?: string;
  description?: string;
  readMoreHref?: string;
  readMoreLabel?: string;
  acceptAllLabel?: string;
  onlyNecessaryLabel?: string;
  onAcceptAll?: () => void;
  onOnlyNecessary?: () => void;
  className?: string;
};

// Re-exported so consumers of the banner keep importing it from here, while the
// definition lives next to the API call that also speaks it (one-way dependency:
// lib/api never imports components).
export type { CookieConsentChoice };

/** Proof of consent: the choice plus when it was given, per compliance requirements. */
export type CookieConsentRecord = {
  choice: CookieConsentChoice;
  timestamp: string;
};

export function getCookieConsent(
  cookieName = COOKIE_CONSENT_STORAGE_KEY,
): CookieConsentRecord | null {
  const raw = readCookie(cookieName);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (
      (parsed.choice === "all" || parsed.choice === "necessary") &&
      typeof parsed.timestamp === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Only a *valid* record counts as consent. The cookie is client-writable, so a
 * malformed or truncated value must re-prompt rather than silently settle the
 * banner with no usable audit record behind it.
 */
export function hasCookieConsent(cookieName = COOKIE_CONSENT_STORAGE_KEY) {
  return getCookieConsent(cookieName) != null;
}

/**
 * Persist the choice locally (the UI gate) and post the audit proof to the
 * backend, which cannot see this cookie. Both carry the same timestamp.
 */
function setCookieConsent(choice: CookieConsentChoice, cookieName = COOKIE_CONSENT_STORAGE_KEY) {
  const record: CookieConsentRecord = { choice, timestamp: new Date().toISOString() };
  writeCookie(cookieName, JSON.stringify(record), COOKIE_CONSENT_MAX_AGE_SECONDS);
  void recordConsent({ type: "cookies", choice }, record.timestamp);
}

export function CookiePopup({
  trigger,
  open: openProp,
  defaultOpen,
  onOpenChange,
  cookieName = COOKIE_CONSENT_STORAGE_KEY,
  title = "We use cookies",
  description = "We use cookies to ensure a smooth browsing experience, personalize content, improve our website, and perform other functions described in our Cookie Policy.",
  readMoreHref = policyRoute("cookies"),
  readMoreLabel = "Read more",
  acceptAllLabel = "Accept all",
  onlyNecessaryLabel = "Only necessary",
  onAcceptAll,
  onOnlyNecessary,
  className,
}: CookiePopupProps) {
  const isControlled = openProp !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const open = isControlled ? Boolean(openProp) : uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      // Only Accept all / Only necessary may dismiss the gate.
      if (!nextOpen && !hasCookieConsent(cookieName)) {
        return;
      }
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [cookieName, isControlled, onOpenChange],
  );

  const handleAcceptAll = () => {
    setCookieConsent("all", cookieName);
    onAcceptAll?.();
    setOpen(false);
  };

  const handleOnlyNecessary = () => {
    setCookieConsent("necessary", cookieName);
    onOnlyNecessary?.();
    setOpen(false);
  };

  return (
    <ModalLayout
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
      title={title}
      showIcon={false}
      showClose={false}
      showMobileHandle
      dismissOnOutsideClick={false}
      headerClassName="sr-only"
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

        <div className="flex w-full flex-col items-center">
          <span className="text-[56px] leading-none font-bold" aria-hidden>
            🍪
          </span>
          <p className="text-select-text text-[18px] leading-7 font-semibold" aria-hidden>
            {title}
          </p>
          <DialogDescription
            id="cookie-popup-description"
            className="text-modal-text text-sm leading-5 font-normal"
          >
            {description}{" "}
            <a href={readMoreHref} className="text-modal-text underline">
              {readMoreLabel}
            </a>
          </DialogDescription>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Buttons
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={acceptAllLabel}
            className="w-full max-w-none cursor-pointer"
            onClick={handleAcceptAll}
          />
          <Buttons
            variant="neutral"
            size="btn-s"
            leftIcon={false}
            rightIcon={false}
            label={onlyNecessaryLabel}
            className="w-full max-w-none cursor-pointer text-[12px]! leading-4"
            onClick={handleOnlyNecessary}
          />
        </div>
      </div>
    </ModalLayout>
  );
}
