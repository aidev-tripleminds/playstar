"use client";

import { SparklesIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { DialogDescription } from "@/components/ui/dialog";
import {
  PRE_LAUNCH_NOTICE_BODY,
  PRE_LAUNCH_NOTICE_CTA,
  PRE_LAUNCH_NOTICE_FOOTNOTE,
  PRE_LAUNCH_NOTICE_TITLE,
} from "@/lib/pre-launch";
import { cn } from "@/lib/utils";

export type PreLaunchNoticeProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Runs when the user takes the CTA (rather than dismissing). */
  onContinue?: () => void;
  className?: string;
};

/**
 * The "we're still building" dialog an early-bird account sees once signed in.
 *
 * Dismissible on purpose: the whole reason to ship this early is that there IS
 * something to look at (the Explore feed and the CMS pages), so trapping the
 * user behind an undismissable wall would defeat it. The lock itself does not
 * depend on this dialog staying open — see `PreLaunchGate`.
 *
 * Visual language is deliberately the age gate's (logo, gradient badge, single
 * rose CTA) so it reads as part of the product rather than an error state.
 */
export function PreLaunchNotice({
  open,
  onOpenChange,
  onContinue,
  className,
}: PreLaunchNoticeProps) {
  const handleContinue = React.useCallback(() => {
    onContinue?.();
    onOpenChange(false);
  }, [onContinue, onOpenChange]);

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={PRE_LAUNCH_NOTICE_TITLE}
      showIcon={false}
      // No X: "Start Creating" is the only thing to do here, and an X sitting
      // in a header that is visually hidden (the title renders in the body,
      // under the badge, the way the age gate does it) would be invisible.
      // Escape and an outside click still dismiss.
      showClose={false}
      showMobileHandle
      headerClassName="sr-only"
      className={cn("border-surface-strong bg-dialog-bg z-71 md:max-w-[420px]", className)}
    >
      <div data-slot="pre-launch-notice" className="flex flex-col items-center gap-4 text-center">
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
          <SparklesIcon
            className="size-10 text-[#FDA5D5] drop-shadow-[0_0_8px_rgba(230,0,118,0.35)]"
            strokeWidth={1.5}
          />
        </div>

        <div className="flex w-full flex-col gap-3">
          <p className="text-select-text text-[18px] leading-7 font-semibold" aria-hidden>
            {PRE_LAUNCH_NOTICE_TITLE}
          </p>

          <DialogDescription className="text-modal-text flex flex-col gap-2 text-sm leading-5 font-normal">
            {PRE_LAUNCH_NOTICE_BODY.map((paragraph) => (
              <span key={paragraph}>{paragraph}</span>
            ))}
          </DialogDescription>

          <p className="text-modal-text text-[12px] leading-4 font-normal opacity-80">
            {PRE_LAUNCH_NOTICE_FOOTNOTE}
          </p>
        </div>

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={PRE_LAUNCH_NOTICE_CTA}
          onClick={handleContinue}
          className="w-full max-w-none cursor-pointer"
        />
      </div>
    </ModalLayout>
  );
}
