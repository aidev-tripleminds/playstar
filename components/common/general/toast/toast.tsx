"use client";

import Image from "next/image";
import * as React from "react";
import { toast as sonnerToast } from "sonner";

import { ReferenceCode } from "@/components/common/general/reference-code/reference-code";
import { requestIdOf } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { CrossIcon } from "@/public/assets/icons/cross";

export type ToastType = "success" | "error";

export type ToastProps = Omit<React.ComponentProps<"div">, "children"> & {
  type?: ToastType;
  text?: string;
  showIcon?: boolean;
  showClose?: boolean;
  onClose?: () => void;
  /** The failed request's ID, shown as a reference code under the text. */
  referenceCode?: string;
};

const iconByType: Record<ToastType, { src: string; glow: string }> = {
  success: {
    src: "/assets/tick.svg",
    glow: "drop-shadow-[0_0_6px_#00c950]",
  },
  error: {
    src: "/assets/cross.svg",
    glow: "drop-shadow-[0_0_6px_#c90011]",
  },
};

export function Toast({
  type = "success",
  text = "New location created successfully!",
  showIcon = true,
  showClose = true,
  onClose,
  referenceCode,
  className,
  ...props
}: ToastProps) {
  const icon = iconByType[type];

  return (
    <div
      data-slot="toast"
      data-type={type}
      role="status"
      aria-live="polite"
      className={cn(
        "text-tooltip-text border-surface-strong flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-3 text-left font-sans text-xs",
        "bg-[linear-gradient(180deg,var(--color-tooltip-default-bg),var(--color-surface-strong))]",
        "shadow-(--select-content-shadow)",
        className,
      )}
      {...props}
    >
      {showIcon ? (
        <span className={cn("relative size-5 shrink-0 rounded-full", icon.glow)} aria-hidden>
          <Image
            src={icon.src}
            alt=""
            width={20}
            height={20}
            unoptimized
            className="size-5 rounded-full object-contain"
          />
        </span>
      ) : null}

      <div className="min-w-0 flex-1">
        <p className="text-xs leading-4 font-medium">{text}</p>
        <ReferenceCode id={referenceCode} className="mt-1" />
      </div>

      {showClose ? (
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onClose}
          className="text-divider-label hover:text-tooltip-text inline-flex size-6 shrink-0 cursor-pointer items-center justify-center transition-colors"
        >
          <CrossIcon className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

export type ShowToastOptions = {
  type?: ToastType;
  text: string;
  duration?: number;
  showIcon?: boolean;
  showClose?: boolean;
  /**
   * The error that caused an error toast. When it is a failed API call, the
   * toast shows its request ID as a reference code.
   */
  error?: unknown;
  /**
   * The request ID to show as the reference code, for a failure that `error`
   * cannot give it for (a Better Auth call). Wins over `error`'s ID.
   */
  requestId?: string;
};

export function showToast({
  type = "success",
  text,
  duration = 4000,
  showIcon = true,
  showClose = true,
  error,
  requestId,
}: ShowToastOptions) {
  const referenceCode = requestId ?? requestIdOf(error);
  return sonnerToast.custom(
    (id) => (
      <Toast
        type={type}
        text={text}
        showIcon={showIcon}
        showClose={showClose}
        referenceCode={referenceCode}
        onClose={() => sonnerToast.dismiss(id)}
      />
    ),
    { duration },
  );
}

export { sonnerToast as toast };
