"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { useCountdown } from "@/hooks/use-countdown";
import { releaseModalHistoryForNavigation } from "@/lib/modal-history";
import { cn } from "@/lib/utils";

const REDIRECT_COOLDOWN_MS = 3_000;

export type PasswordChangedProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  titleIconSrc?: string;
  description?: string;
  ctaLabel?: string;
  redirectMs?: number;
  redirectHref?: string;
  onGoToExplore?: () => void;
  onClose?: () => void;
  className?: string;
};

function RedirectCountdown({
  redirectMs,
  onComplete,
}: {
  redirectMs: number;
  onComplete: () => void;
}) {
  const { totalSeconds, isComplete } = useCountdown({ initialMs: redirectMs });
  const hasCompletedRef = React.useRef(false);

  React.useEffect(() => {
    if (!isComplete || hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onComplete();
  }, [isComplete, onComplete]);

  return (
    <div className="flex items-center justify-center gap-1">
      <Image
        src="/assets/clock-resend.svg"
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0"
      />
      <p className="text-select-muted-text text-sm leading-5 font-normal tracking-[-0.14px]">
        Redirecting in {totalSeconds}s
      </p>
    </div>
  );
}

export function PasswordChanged({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  title = "Password changed",
  titleIconSrc = "/assets/tick-circle.svg",
  description = "Your password has been successfully changed. You can now sign in with your new credentials.",
  ctaLabel = "Go to Explore",
  redirectMs = REDIRECT_COOLDOWN_MS,
  redirectHref = "/explore",
  onGoToExplore,
  onClose,
  className,
}: PasswordChangedProps) {
  const router = useRouter();
  const isOpen = open ?? Boolean(defaultOpen);
  const hasRedirectedRef = React.useRef(false);

  const handleClose = React.useCallback(() => {
    onClose?.();
    onOpenChange?.(false);
  }, [onClose, onOpenChange]);

  const handleRedirect = React.useCallback(() => {
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;

    if (onGoToExplore) {
      onGoToExplore();
      onOpenChange?.(false);
      return;
    }

    // This dialog is still open, and closing it rewinds the synthetic history
    // entry it pushed for back-button trapping. That `history.back()` lands
    // after the navigation below and would pop it straight off again, leaving
    // the user exactly where they were — drop the marker first so the close
    // leaves history alone.
    releaseModalHistoryForNavigation();
    // `replace`, not `push`: the reset is done and its token is spent, so
    // there is nothing on this page worth offering the Back button.
    router.replace(redirectHref);
    onOpenChange?.(false);
  }, [onGoToExplore, onOpenChange, redirectHref, router]);

  React.useEffect(() => {
    if (isOpen) {
      hasRedirectedRef.current = false;
    }
  }, [isOpen]);

  return (
    <ModalLayout
      trigger={trigger}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={title}
      titleIconSrc={titleIconSrc}
      showIcon
      showMobileHandle
      closeLabel="Close"
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
      className={cn("border-surface-strong bg-dialog-bg z-71 md:max-w-[475px]", className)}
    >
      <div className="flex flex-col gap-4">
        <p className="text-modal-text text-sm leading-5 font-normal">{description}</p>

        {isOpen ? (
          <RedirectCountdown
            key={`${isOpen}-${redirectMs}`}
            redirectMs={redirectMs}
            onComplete={handleRedirect}
          />
        ) : null}

        <Buttons
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={ctaLabel}
          onClick={handleRedirect}
          className="w-full cursor-pointer"
        />
      </div>
    </ModalLayout>
  );
}
