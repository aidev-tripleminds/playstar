"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { ArrowRightIcon, ForbiddenIcon, SparklesIcon } from "@/public/assets/icons";

const aiChatActionVariants = cva(
  [
    "inline-flex cursor-pointer items-center justify-end gap-1 rounded-3xl border px-2 py-1.5",
    "text-xs leading-4 font-normal",
    "transition-colors focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:outline-none",
    "disabled:pointer-events-none disabled:opacity-50 text-cookie-bg",
  ],
  {
    variants: {
      status: {
        default: ["card-default-border"],
        ai: ["card-premium-border"],
        discard: ["card-alert-border"],
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

const STATUS_CONFIG = {
  default: {
    label: "Continue",
    Icon: ArrowRightIcon,
  },
  ai: {
    label: "Fill with AI",
    Icon: SparklesIcon,
  },
  discard: {
    label: "Discard",
    Icon: ForbiddenIcon,
  },
} as const satisfies Record<
  string,
  { label: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
>;

export type AiChatActionStatus = keyof typeof STATUS_CONFIG;

export type AiChatActionProps = Omit<React.ComponentProps<"button">, "children"> &
  VariantProps<typeof aiChatActionVariants> & {
    label?: string;
  };

export function AiChatAction({
  status = "default",
  label,
  className,
  type = "button",
  disabled,
  "aria-label": ariaLabel,
  ...props
}: AiChatActionProps) {
  const resolvedStatus = (status ?? "default") as AiChatActionStatus;
  const { label: defaultLabel, Icon } = STATUS_CONFIG[resolvedStatus];
  const resolvedLabel = label ?? defaultLabel;

  return (
    <button
      type={type}
      data-slot="ai-chat-action"
      data-status={resolvedStatus}
      disabled={disabled}
      aria-label={ariaLabel ?? resolvedLabel}
      className={cn(aiChatActionVariants({ status: resolvedStatus }), className)}
      {...props}
    >
      <Icon className="size-4 shrink-0" />
      <span className="shrink-0">{resolvedLabel}</span>
    </button>
  );
}
