"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { HelpIcon } from "@/public/assets/icons/circle-help";

const textInputVariants = cva(
  "group/input-text flex w-[250px] items-center gap-0 rounded-full border bg-tooltip-default-bg p-3 transition-colors [--autofill-bg:var(--tooltip-default-bg)] [--autofill-text:var(--text-inverse)]",
  {
    variants: {
      status: {
        default: "border-border-strong focus-within:border-border-muted",
        error: "border-feedback-error focus-within:border-feedback-error",
        success: "border-feedback-success focus-within:border-feedback-success",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

export type InputTextProps = Omit<React.ComponentProps<typeof Input>, "className"> &
  VariantProps<typeof textInputVariants> & {
    showLeftIcon?: boolean;
    leftIcon?: React.ReactNode;
    leftIconSrc?: string;

    message?: string;
    messageType?: "error" | "success";
    wrapperClassName?: string;
    className?: string;
  };

export function TextInput({
  status = "default",
  showLeftIcon = true,
  message,
  leftIcon = <HelpIcon className="text-text-muted-strong size-5 shrink-0 transition-colors" />,

  leftIconSrc,
  messageType = "error",
  wrapperClassName,
  className,
  ...props
}: InputTextProps) {
  const helperTextClass =
    messageType === "success" ? "text-feedback-success" : "text-feedback-error";

  return (
    <div className={cn("w-full space-y-1", wrapperClassName)}>
      <div className={cn(textInputVariants({ status }), className)}>
        {showLeftIcon ? (
          leftIconSrc ? (
            <Image
              width={20}
              height={20}
              src={leftIconSrc}
              alt=""
              className="size-5 shrink-0 object-contain"
            />
          ) : (
            leftIcon
          )
        ) : null}
        <Input
          className={cn(
            "text-text-muted-strong border-0 bg-transparent px-2 py-0.5 text-[14px]! leading-[20px]! font-medium",

            "text-text-inverse placeholder:text-text-muted-strong placeholder-shown:text-text-muted-strong",

            "focus-visible:ring-0 focus-visible:outline-none",

            "disabled:bg-transparent dark:disabled:bg-transparent",
          )}
          placeholder="This is input..."
          {...props}
        />
      </div>
      {message ? (
        <p className={cn("text-sm leading-5 font-medium", helperTextClass)}>{message}</p>
      ) : null}
    </div>
  );
}
