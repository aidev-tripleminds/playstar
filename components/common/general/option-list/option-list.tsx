import type { StaticImageData } from "next/image";
import Image from "next/image";
import * as React from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { HelpIcon } from "@/public/assets/icons/circle-help";

export type OptionListItem = {
  value: string;
  label: string;
  showIcon?: boolean;
  iconSrc?: string;
  leftIcon?: React.ReactNode;
  leftIconSrc?: string | StaticImageData | React.ReactNode;
  disabled?: boolean;
  highlighted?: boolean;
};

type OptionListBaseProps = {
  title?: string;
  items: OptionListItem[];
  className?: string;
};

export type OptionListRadioProps = OptionListBaseProps &
  Omit<React.ComponentProps<typeof RadioGroup>, "children" | "title"> & {
    variant?: "radio";
    onItemClick?: never;
    onDisabledItemClick?: (value: string) => void;
  };

export type OptionListMenuProps = OptionListBaseProps & {
  variant: "menu";
  onItemClick?: (value: string) => void;
  value?: never;
  defaultValue?: never;
  onValueChange?: never;
};

export type OptionListProps = OptionListRadioProps | OptionListMenuProps;

export const OPTION_LIST_SURFACE_CLASSNAME =
  "border-surface-strong bg-tooltip-default-bg rounded-[24px] border p-1 shadow-[var(--select-content-shadow)]";

function isStaticImageData(value: unknown): value is StaticImageData {
  return (
    typeof value === "object" &&
    value !== null &&
    "src" in value &&
    "height" in value &&
    "width" in value
  );
}

function isNextImageSrc(
  value: string | StaticImageData | React.ReactNode,
): value is string | StaticImageData {
  return typeof value === "string" || isStaticImageData(value);
}

function OptionListItemIcon({
  leftIcon,
  leftIconSrc,
  fallback = null,
}: {
  leftIcon?: React.ReactNode;
  leftIconSrc?: OptionListItem["leftIconSrc"];
  fallback?: React.ReactNode;
}) {
  if (leftIcon) {
    return <>{leftIcon}</>;
  }

  if (!leftIconSrc) {
    return <>{fallback}</>;
  }

  if (React.isValidElement(leftIconSrc)) {
    return leftIconSrc;
  }

  if (isNextImageSrc(leftIconSrc)) {
    return (
      <span className="relative inline-block size-5 shrink-0">
        <Image src={leftIconSrc} alt="" fill className="object-contain" />
      </span>
    );
  }

  return <>{fallback}</>;
}

function OptionListMenu({ items, className, onItemClick }: OptionListMenuProps) {
  return (
    <section
      data-slot="option-list"
      data-variant="menu"
      className={cn(OPTION_LIST_SURFACE_CLASSNAME, "w-fit", className)}
    >
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            disabled={item.disabled}
            onClick={() => onItemClick?.(item.value)}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-full p-3 text-left text-sm leading-5 font-medium whitespace-nowrap transition-colors",
              item.highlighted
                ? "bg-surface-strong text-tooltip-text"
                : "text-divider-label hover:bg-surface-strong-hover hover:text-tooltip-text",
              item.disabled &&
                "hover:text-divider-label cursor-not-allowed opacity-70 hover:bg-transparent",
            )}
          >
            <OptionListItemIcon leftIcon={item.leftIcon} leftIconSrc={item.leftIconSrc} />

            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function OptionListRadio({
  title = "Lorem lorem",
  items,
  className,
  onDisabledItemClick,
  ...props
}: OptionListRadioProps) {
  return (
    <section
      data-slot="option-list"
      data-variant="radio"
      className={cn(
        "bg-option-bg border-surface-strong w-fit rounded-[24px] border p-1 text-left",
        className,
      )}
    >
      <div className="px-3 py-1.5">
        <p className="text-text-muted-strong text-[14px]! leading-5! font-medium tracking-[-0.8px]">
          {title}
        </p>
      </div>

      <RadioGroup className="gap-0.5" {...props}>
        {items.map((item) => (
          <label
            key={item.value}
            onClick={() => {
              if (item.disabled) {
                onDisabledItemClick?.(item.value);
              }
            }}
            className={cn(
              "text-text-muted-strong hover:bg-surface-strong flex w-full cursor-pointer items-center justify-between gap-2 rounded-full p-3 whitespace-nowrap transition-colors",
              "has-[button[data-state=checked]]:bg-surface-strong-hover has-[button[data-state=checked]]:text-text-inverse",
              "has-[button[data-state=checked]]:hover:bg-surface-strong-hover",
              item.disabled &&
                "hover:text-text-muted-strong cursor-not-allowed opacity-50 hover:bg-transparent",
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              {(item.showIcon ?? true) ? (
                <OptionListItemIcon
                  leftIcon={item.leftIcon}
                  leftIconSrc={item.leftIconSrc}
                  fallback={<HelpIcon className="size-5 shrink-0 text-current" />}
                />
              ) : null}

              <span className="text-[14px]! leading-[20px]! font-medium">{item.label}</span>
            </span>

            <RadioGroupItem
              value={item.value}
              disabled={item.disabled}
              className="text-text-inverse ml-auto size-5 shrink-0 border-none border-current bg-transparent data-checked:bg-transparent"
            />
          </label>
        ))}
      </RadioGroup>
    </section>
  );
}

export function OptionList(props: OptionListProps) {
  if (props.variant === "menu") {
    return <OptionListMenu {...props} />;
  }

  return <OptionListRadio {...props} />;
}
