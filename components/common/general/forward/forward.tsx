import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HelpIcon } from "@/public/assets/icons/circle-help";

const forwardVariants = cva(
  "inline-flex h-[44px] w-[250px] items-center gap-2 px-3 py-3 text-sm leading-5 font-medium transition-colors",
  {
    variants: {
      status: {
        default:
          "cursor-pointer rounded-none border border-transparent bg-transparent text-text-muted-strong hover:border-b hover:border-surface-strong hover:bg-surface-strong hover:text-text-inverse",
        mobileSettings: "rounded-full bg-tooltip-default-bg text-tooltip-text",
        panel:
          "h-auto w-full max-w-none rounded-none border-0 bg-transparent px-3 py-3 text-divider-label hover:bg-surface-strong hover:text-tooltip-text",
        panelActive:
          "h-auto w-full max-w-none rounded-none border-0 bg-surface-strong px-3 py-3 text-tooltip-text hover:bg-surface-strong",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

export type ForwardProps = Omit<React.ComponentProps<typeof ShadcnButton>, "variant" | "size"> &
  VariantProps<typeof forwardVariants> & {
    label?: string;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    leftIcon?: React.ReactNode;
    leftIconSrc?: string;
  };

export function Forward({
  status = "default",
  label = "Style:",
  showLeftIcon = true,
  showRightIcon = true,
  leftIcon = <HelpIcon className="size-5 shrink-0" />,
  leftIconSrc,
  className,
  "aria-label": ariaLabel,
  ...props
}: ForwardProps) {
  return (
    <ShadcnButton
      aria-label={ariaLabel ?? label}
      className={cn(forwardVariants({ status }), className)}
      {...props}
    >
      {showLeftIcon ? (
        leftIconSrc ? (
          <Image
            src={leftIconSrc}
            alt=""
            aria-hidden
            width={20}
            height={20}
            className="size-5 shrink-0"
          />
        ) : (
          leftIcon
        )
      ) : null}
      <span className="flex-1 text-left text-inherit">{label}</span>
      {showRightIcon ? <ChevronRight className="size-5 text-current" /> : null}
    </ShadcnButton>
  );
}
