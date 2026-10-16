"use client";

import { HourglassIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CrownFilledIcon } from "@/public/assets/icons";

/**
 * `granted`: the claim went through. `closed`: the admin panel has switched
 * free premium off (`EARLY_ACCESS_PREMIUM_DISABLED`).
 */
export type EarlyAccessPremiumDialogVariant = "granted" | "closed";

export const EARLY_ACCESS_PREMIUM_COPY = {
  granted: {
    title: "You're Premium — on us",
    body: [
      "As an early bird, you've unlocked unlimited Premium access, with 9,999 tokens to spend however you like.",
      "No card, no charge. Enjoy everything Spicestars has to offer while we get ready to launch.",
    ],
    finePrint: "This is a free, temporary Premium trial and may end at any time without notice.",
    cta: "Start Creating",
  },
  closed: {
    title: "Free Premium trials are closed",
    body: [
      "Sorry — we're not handing out free Premium memberships anymore.",
      "Premium opens to everyone at launch, and we'll let you know the moment it does.",
    ],
    finePrint: null,
    cta: "Got it",
  },
} as const;

export type EarlyAccessPremiumDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: EarlyAccessPremiumDialogVariant;
  /**
   * Runs when the user takes the CTA (rather than dismissing), before the
   * dialog closes — the one place a caller may navigate away, as with
   * `PreLaunchNotice`.
   */
  onContinue?: () => void;
  className?: string;
};

/**
 * The answer to Settings' upgrade CTA while payments are pre-launch locked
 * (BACK-322). Same visual language as `PreLaunchNotice` — logo, gradient
 * badge, single rose CTA — so the two read as one family.
 */
export function EarlyAccessPremiumDialog({
  open,
  onOpenChange,
  variant,
  onContinue,
  className,
}: EarlyAccessPremiumDialogProps) {
  const copy = EARLY_ACCESS_PREMIUM_COPY[variant];
  const handleContinue = React.useCallback(() => {
    onContinue?.();
    onOpenChange(false);
  }, [onContinue, onOpenChange]);

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={copy.title}
      showIcon={false}
      // The title renders in the body under the badge (as the age gate and the
      // pre-launch notice do), so an X in the hidden header would be invisible.
      // Escape and an outside click still dismiss.
      showClose={false}
      showMobileHandle
      headerClassName="sr-only"
      className={cn("border-surface-strong bg-dialog-bg z-71 md:max-w-[420px]", className)}
    >
      <div
        data-slot="early-access-premium-dialog"
        data-variant={variant}
        className="flex flex-col items-center gap-4 text-center"
      >
        <Image
          src="/assets/logo-spicestars.svg"
          alt="Spicestars"
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
          {variant === "granted" ? (
            <CrownFilledIcon size={40} />
          ) : (
            <HourglassIcon
              className="size-10 text-[#FDA5D5] drop-shadow-[0_0_8px_rgba(230,0,118,0.35)]"
              strokeWidth={1.5}
            />
          )}
        </div>

        <div className="flex w-full flex-col gap-3">
          <p className="text-select-text text-[18px] leading-7 font-semibold" aria-hidden>
            {copy.title}
          </p>

          <DialogDescription className="text-modal-text flex flex-col gap-2 text-sm leading-5 font-normal">
            {copy.body.map((paragraph) => (
              <span key={paragraph}>{paragraph}</span>
            ))}
          </DialogDescription>

          {copy.finePrint ? (
            <p className="text-modal-text text-[11px] leading-4 font-normal opacity-70">
              {copy.finePrint}
            </p>
          ) : null}
        </div>

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={copy.cta}
          onClick={handleContinue}
          className="w-full max-w-none cursor-pointer"
        />
      </div>
    </ModalLayout>
  );
}
