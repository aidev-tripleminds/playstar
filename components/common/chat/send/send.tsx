import * as React from "react";

import { cn } from "@/lib/utils";

export type SendProps = {
  message?: string;
  className?: string;
  children?: React.ReactNode;
};

export function Send({ message = "This is the text user sends.", className, children }: SendProps) {
  return (
    <div
      data-slot="send-msg"
      className={cn(
        "bg-tooltip-default-bg inline-flex w-fit max-w-[230px] flex-col justify-center gap-1 rounded-[16px_16px_4px_16px] px-3 py-2 md:max-w-[380px]",
        className,
      )}
    >
      <p className="text-tooltip-text w-full text-left text-[14px] leading-[20px] font-normal [overflow-wrap:anywhere]">
        {children ?? message}
      </p>
    </div>
  );
}
