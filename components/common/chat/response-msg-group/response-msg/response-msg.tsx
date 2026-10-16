import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const responseMsgVariants = cva(
  "inline-flex w-fit max-w-[230px] justify-center gap-1 md:max-w-[380px]",
  {
    variants: {
      variant: {
        chat: "bg-surface-strong flex-col rounded-[16px_16px_16px_4px] px-3 py-2",
        storytelling: "flex-col",
        quote: "flex-row items-stretch gap-1.5",
      },
    },
    defaultVariants: {
      variant: "chat",
    },
  },
);

const responseMsgTextVariants = cva(
  "w-full text-left text-[14px] leading-[20px] font-normal [overflow-wrap:anywhere]",
  {
    variants: {
      variant: {
        chat: "text-tooltip-text",
        storytelling: "text-tooltip-text",
        quote: "text-[var(--gray-text)] italic",
      },
    },
    defaultVariants: {
      variant: "chat",
    },
  },
);

export type ResponseMsgVariant = NonNullable<VariantProps<typeof responseMsgVariants>["variant"]>;

export type ResponseMsgProps = {
  message?: string;
  className?: string;
  children?: React.ReactNode;
} & VariantProps<typeof responseMsgVariants>;

export function ResponseMsg({
  variant = "chat",
  message = "This is the text user sends.",
  className,
  children,
}: ResponseMsgProps) {
  return (
    <div
      data-slot="response-msg"
      data-variant={variant}
      className={cn(responseMsgVariants({ variant }), className)}
    >
      {variant === "quote" ? (
        <div aria-hidden="true" className="flex shrink-0 py-0.5">
          <span className="bg-border-control w-0.5" />
        </div>
      ) : null}
      <p className={responseMsgTextVariants({ variant })}>{children ?? message}</p>
    </div>
  );
}
