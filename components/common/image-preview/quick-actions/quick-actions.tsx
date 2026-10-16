"use client";

import Image from "next/image";
import * as React from "react";

import { isNextImageSrc } from "@/components/common/image-preview/components/helpers";
import { cn } from "@/lib/utils";

import { getQuickActionItems } from "./constants";
import type { QuickActionItem, QuickActionsProps } from "./types";

function QuickActionIcon({ icon }: { icon?: QuickActionItem["icon"] }) {
  if (!icon) {
    return null;
  }

  if (React.isValidElement(icon)) {
    return icon;
  }

  if (isNextImageSrc(icon)) {
    return (
      <Image
        src={icon}
        alt=""
        width={24}
        height={24}
        className="text-tooltip-text size-6 shrink-0"
      />
    );
  }

  return null;
}

export {
  createAiQuickAction,
  getQuickActionItems,
  imageQuickActions,
  videoQuickActions,
} from "./constants";
export type {
  QuickActionItem,
  QuickActionsContentType,
  QuickActionsModelStatus,
  QuickActionsProps,
} from "./types";

export function QuickActions({
  content = "image",
  modelStatus = "ai-model",
  items,
  onActionClick,
  className,
  ...props
}: QuickActionsProps) {
  const resolvedItems = items ?? getQuickActionItems(content, modelStatus);

  return (
    <div
      data-slot="quick-actions"
      data-content={content}
      data-model-status={modelStatus}
      className={cn("flex w-full items-center justify-between rounded-full p-1", className)}
      {...props}
    >
      {resolvedItems.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-label={item.label}
          disabled={item.disabled}
          onClick={() => onActionClick?.(item.value)}
          className={cn(
            "flex min-w-[52px] flex-1 basis-0 flex-col items-center justify-center gap-0.5 rounded-[40px]",
            "px-1.5",
            "cursor-pointer transition-colors hover:bg-white/10",
            "text-cookie-bg",
            "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
          )}
        >
          <QuickActionIcon icon={item.icon} />
          <span className="text-[10px] leading-2.5 font-medium text-nowrap">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
