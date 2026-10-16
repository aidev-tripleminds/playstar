import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { HelpIcon } from "@/public/assets/icons/circle-help";

const radioButtonVariants = cva(
  "flex w-[250px] items-center gap-2 rounded-full border px-3 py-3 text-left",
  {
    variants: {
      status: {
        default: "bg-tooltip-default-bg border-border-strong text-text-muted-strong",
        borderless: "bg-tooltip-default-bg border-transparent text-text-muted-strong",
      },
    },
    defaultVariants: {
      status: "default",
    },
  },
);

export type RadioButtonGroupProps = React.ComponentProps<typeof RadioGroup>;

export function RadioButtonGroup({ className, ...props }: RadioButtonGroupProps) {
  return <RadioGroup className={cn("gap-3", className)} {...props} />;
}

type RadioButtonProps = Omit<
  React.ComponentProps<typeof RadioGroupItem>,
  "children" | "className"
> &
  VariantProps<typeof radioButtonVariants> & {
    label?: string;
    showLeftIcon?: boolean;
    className?: string;
    leftIcon?: React.ReactNode;
    leftIconSrc?: string;
    badge?: React.ReactNode;
    onDisabledClick?: () => void;
  };

export function RadioButton({
  status = "default",
  label = "Option",
  showLeftIcon = true,
  leftIcon = <HelpIcon className="size-5 shrink-0" />,
  leftIconSrc,
  badge,
  className,
  onDisabledClick,
  disabled,
  ...props
}: RadioButtonProps) {
  return (
    <label
      onClick={() => {
        if (disabled) {
          onDisabledClick?.();
        }
      }}
      className={cn(
        radioButtonVariants({ status }),
        "cursor-pointer",
        "has-[button[data-state=checked]]:bg-surface-strong has-[button[data-state=checked]]:text-tooltip-text has-[button[data-state=checked]]:border-transparent",
        "has-[button:disabled]:cursor-not-allowed has-[button:disabled]:opacity-50",
        className,
      )}
    >
      {showLeftIcon ? (
        leftIconSrc ? (
          <Image
            src={leftIconSrc}
            alt="left icon"
            width={20}
            height={20}
            className="size-5 shrink-0"
          />
        ) : (
          leftIcon
        )
      ) : null}
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-sm leading-5 font-medium">{label}</span>
        {badge}
      </span>
      <RadioGroupItem
        className={cn(
          "scrollbar-hidden shrink-0 border-none bg-transparent shadow-none outline-none",
          "after:hidden focus-visible:ring-0",
          // Keep a 20px hit target; hide the dot until selected (Figma RadioIndicator opacity 0).
          "size-5! overflow-hidden opacity-0",
          "data-[state=checked]:opacity-100",
          "data-checked:opacity-100",
        )}
        {...props}
        disabled={disabled}
      />
    </label>
  );
}
