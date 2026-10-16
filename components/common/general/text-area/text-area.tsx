import Image from "next/image";
import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { HelpIcon } from "@/public/assets/icons/circle-help";

/**
 * Grow with the text, then scroll inside the field. Without the cap a
 * content-sized textarea stretches the dialog and the footer slides off screen.
 * 16rem is reserved for the title, padding, and action row.
 */
export const TEXT_AREA_DIALOG_SCROLL_CLASS =
  "max-h-[min(28rem,calc(95dvh-16rem))] overflow-y-auto overscroll-contain [&_textarea]:max-h-[min(28rem,calc(95dvh-16rem))] [&_textarea]:overflow-y-auto [&_textarea]:overscroll-contain";

export type TextAreaProps = Omit<React.ComponentProps<typeof Textarea>, "className"> & {
  status?: "default" | "focus";
  showLeftIcon?: boolean;
  leftIcon?: React.ReactNode;
  leftIconSrc?: string;
  className?: string;
};

export function TextArea({
  showLeftIcon = true,
  leftIcon = <HelpIcon className="text-text-muted-strong size-5 shrink-0" />,
  leftIconSrc,
  className,
  ...props
}: TextAreaProps) {
  return (
    <div
      className={cn(
        "border-border-strong bg-tooltip-default-bg flex min-h-24 w-[250px] rounded-[16px] border p-3",
        "focus-within:border-border-muted",
        className,
      )}
    >
      {showLeftIcon ? (
        leftIconSrc ? (
          <Image
            src={leftIconSrc}
            alt=""
            width={20}
            height={20}
            className="mt-0.5 size-5 shrink-0 object-contain"
          />
        ) : (
          leftIcon
        )
      ) : null}

      <Textarea
        className={cn(
          "text-text-muted-strong scrollbar-hidden min-h-0 resize-none border-0 bg-transparent px-0 py-0 text-[14px]! leading-[20px]!",

          "text-text-inverse placeholder:text-text-muted-strong placeholder-shown:text-text-muted-strong font-medium",

          "focus-visible:ring-0 focus-visible:outline-none",
        )}
        {...props}
      />
    </div>
  );
}
