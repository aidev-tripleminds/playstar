"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import InfinityIcon from "@/public/assets/icons/infinity-icon";
import UnlimitedIcon from "@/public/assets/icons/unlimited-icon";

const notificationBannerVariants = cva(
  "flex w-full items-center justify-center gap-2.5 rounded-b-[24px] text-center text-sm leading-5 font-medium",
  {
    variants: {
      color: {
        premium: "[background-image:var(--gradient-premium-light)]",
        neutral: "bg-surface-strong text-tooltip-text",
        red: "bg-[rgba(230,0,118,0.2)] text-rose-text",
      },
      size: {
        desktop: "px-3 py-3",
        mobile: "px-3 py-2",
        responsive: "px-3 py-2 md:py-3",
      },
    },
    defaultVariants: {
      color: "neutral",
      size: "responsive",
    },
  },
);

export type NotificationBannerColor = NonNullable<
  VariantProps<typeof notificationBannerVariants>["color"]
>;
export type NotificationBannerSize = NonNullable<
  VariantProps<typeof notificationBannerVariants>["size"]
>;

export type NotificationBannerProps = Omit<React.ComponentProps<"div">, "children" | "color"> &
  VariantProps<typeof notificationBannerVariants> & {
    label?: string;
    children?: React.ReactNode;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

const DEFAULT_TEXT: Record<NotificationBannerColor, string> = {
  premium: "Unlock Infinite Generations",
  neutral: "Notification text goes here...",
  red: "Notification text goes here...",
};

function BannerIcon({ color }: { color: NotificationBannerColor }) {
  if (color === "premium") {
    return <InfinityIcon color="#FFD900" />;
  }

  return (
    <UnlimitedIcon
      size={20}
      className={cn(
        color === "neutral" && "text-tooltip-text",
        color === "red" && "text-rose-text",
      )}
    />
  );
}

export function NotificationBanner({
  className,
  color = "neutral",
  size = "responsive",
  label = "Notification banner",
  children,
  showLeftIcon,
  showRightIcon,
  leftIcon,
  rightIcon,
  ...props
}: NotificationBannerProps) {
  const resolvedColor = color ?? "neutral";
  const isPremium = resolvedColor === "premium";
  const shouldShowLeftIcon = showLeftIcon ?? !isPremium;
  const shouldShowRightIcon = showRightIcon ?? true;
  const content = children ?? DEFAULT_TEXT[resolvedColor];

  return (
    <div
      role="status"
      aria-label={label}
      className={cn(notificationBannerVariants({ color: resolvedColor, size }), className)}
      {...props}
    >
      <div className="flex items-center justify-center gap-1">
        {shouldShowLeftIcon ? (leftIcon ?? <BannerIcon color={resolvedColor} />) : null}
        <span className={cn(isPremium && "text-[#FFD900]")}>{content}</span>
        {shouldShowRightIcon ? (rightIcon ?? <BannerIcon color={resolvedColor} />) : null}
      </div>
    </div>
  );
}
