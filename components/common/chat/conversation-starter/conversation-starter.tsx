import * as React from "react";

import { cn } from "@/lib/utils";

import { Badge } from "../../general/badge/badge";

export type ConversationStarterContentType = "default" | "video";

export type ConversationStarterProps = Omit<React.ComponentProps<"button">, "children"> & {
  badgeText?: string;
  message?: string;
  showBadge?: boolean;
  /** Use `"video"` for the rose gradient border on mobile. */
  contentType?: ConversationStarterContentType;
};

export function ConversationStarter({
  badgeText = "ROMANTIC",
  message = "Hey, what makes you feel special and appreciated?",
  showBadge = true,
  contentType = "default",
  className,
  type = "button",
  ...props
}: ConversationStarterProps) {
  return (
    <button
      type={type}
      data-slot="conversation-starter"
      data-content-type={contentType}
      className={cn(
        "box-border flex w-full max-w-[342px] flex-col items-start gap-2 rounded-[16px] border border-transparent p-4 text-left",
        contentType === "video"
          ? "conversation-starter-border-video"
          : "conversation-starter-border",
        "focus-visible:ring-border-focus translate-y-0 transition-[translate] duration-300 ease-out",
        "hover:-translate-y-1 focus-visible:ring-2 focus-visible:outline-none",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
      {...props}
    >
      {showBadge ? (
        <Badge
          type="neutral"
          size="small"
          showIcon={false}
          text={badgeText}
          className="rounded-[20px]!"
        />
      ) : null}
      <p className="text-divider-label w-full text-left text-[14px] leading-5 font-normal [overflow-wrap:anywhere]">
        {message}
      </p>
    </button>
  );
}
