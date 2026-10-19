"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dummyImage } from "@/lib/dummy-images";
import { cn } from "@/lib/utils";

import { Alert } from "../../general/alert/alert";

const panelVariants = cva(
  "relative flex w-full max-w-[min(100%,326px)] flex-col items-center justify-center gap-4 overflow-visible rounded-[28px] border border-surface-strong bg-dialog-bg px-4 pt-[50px] pb-4 text-center text-tooltip-text isolation-isolate md:max-w-[430px] md:px-6 md:pt-[72px] md:pb-6",
  {
    variants: {
      status: {
        default: "",
        premium: "",
        age: "text-sm",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

export type PaywallModalStatus = "default" | "age" | "premium";

const STATUS_DEFAULTS = {
  default: {
    title: "Premium Content",
    subtitle: "100% Exclusive",
    description: "Unlock all media, create custom AI Porn and enjoy unlimited messages.",
    ctaLabel: "Join for Free",
    ctaKind: "rose" as const,
  },
  premium: {
    title: "Premium Content",
    subtitle: "100% Exclusive",
    description: "Unlock all media, create custom AI Porn and enjoy unlimited messages.",
    ctaLabel: "Get Premium",
    ctaKind: "premium" as const,
  },
  age: {
    title: "Age Verification Required",
    subtitle: undefined,
    description:
      "To comply with UK regulations, we are required to verify that you are 18+ to access this content.",
    infoText:
      "Verification is handled by a secure, independent third party. It is anonymous. Spicestars DO NOT share your data with the government.",
    ctaLabel: "Verify my age now",
    ctaKind: "rose" as const,
  },
} satisfies Record<
  PaywallModalStatus,
  {
    title: string;
    subtitle?: string;
    description: string;
    infoText?: string;
    ctaLabel: string;
    ctaKind: "rose" | "premium";
  }
>;

function AvatarBadge({ src }: { src: string }) {
  return (
    <div
      className={cn(
        "isolation-isolate absolute -top-[60px] left-1/2 z-[3] flex -translate-x-[50px] flex-col items-center md:-translate-x-[60px]",
      )}
    >
      <div className="h-[100px] w-[100px] rounded-full bg-[image:var(--gradient-rose)] p-[4px] md:h-[120px] md:w-[120px]">
        <Image
          src={src}
          alt=""
          width={120}
          height={120}
          className="border-dialog-bg h-full w-full rounded-full border-4 object-cover"
        />
      </div>
      <div className="bg-brand-primary absolute right-0 bottom-2 z-[1] flex items-center rounded-full p-[6px]">
        <Image
          src="/assets/eye-slash.svg"
          alt=""
          width={20}
          height={20}
          className="h-5 w-full object-cover"
        />
      </div>
    </div>
  );
}

export type PaywallModalPanelProps = VariantProps<typeof panelVariants> & {
  status?: PaywallModalStatus;
  avatarSrc?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  infoText?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  className?: string;
};

export function PaywallModalPanel({
  status = "default",
  avatarSrc = dummyImage(11),
  title,
  subtitle,
  description,
  infoText,
  ctaLabel,
  onCtaClick,
  className,
}: PaywallModalPanelProps) {
  const cfg = STATUS_DEFAULTS[status];
  const resolvedTitle = title ?? cfg.title;
  const resolvedSubtitle = subtitle ?? cfg.subtitle;
  const resolvedDescription = description ?? cfg.description;
  const resolvedInfoText = infoText ?? ("infoText" in cfg ? cfg.infoText : undefined);
  const resolvedCtaLabel = ctaLabel ?? cfg.ctaLabel;
  const isAge = status === "age";
  const isPremium = status === "premium";

  return (
    <div data-slot="paywall-modal-panel" className={cn(panelVariants({ status }), className)}>
      <AvatarBadge src={avatarSrc} />
      <div className="z-[2] flex flex-shrink-0 flex-col items-center">
        <h2 className="text-tooltip-text text-[18px] leading-[28px] font-semibold">
          {resolvedTitle}
        </h2>
        {!isAge && resolvedSubtitle ? (
          <p className="text-divider-label text-sm leading-5">{resolvedSubtitle}</p>
        ) : null}
      </div>
      <p
        className={cn(
          "text-cookie-bg z-[1] flex-shrink-0 self-stretch",
          isAge ? "text-sm leading-5" : "text-base leading-6",
        )}
      >
        {resolvedDescription}
      </p>
      {isAge ? <Alert showIcon={false} text={resolvedInfoText} /> : null}
      <Buttons
        label={resolvedCtaLabel}
        variant={isPremium ? "premium-full" : "rose"}
        className="w-full"
        leftIcon={false}
        rightIcon={false}
        onClick={onCtaClick}
      />
    </div>
  );
}

export type PaywallModalProps = PaywallModalPanelProps & {
  trigger?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
};

export function PaywallModal({
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  contentClassName,
  className,
  ...panelProps
}: PaywallModalProps) {
  const cfg = STATUS_DEFAULTS[panelProps.status ?? "default"];

  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className={cn(
          "border-0 bg-transparent p-0 shadow-none ring-0 outline-none",
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[calc(100%-2rem)] max-w-[430px]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          contentClassName,
        )}
      >
        <DialogTitle className="sr-only">{panelProps.title ?? cfg.title}</DialogTitle>
        <DialogDescription className="sr-only">
          {panelProps.description ?? cfg.description}
        </DialogDescription>
        <PaywallModalPanel className={className} {...panelProps} />
      </DialogContent>
    </Dialog>
  );
}
