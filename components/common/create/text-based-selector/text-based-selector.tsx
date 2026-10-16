"use client";

import Image from "next/image";
import * as React from "react";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import { cn, truncateText } from "@/lib/utils";
import { TickVecIcon } from "@/public/assets/icons/tick-vec";

export type TextBasedSelectcorStatus = "selected" | "unselected";
export type TextBasedSelectcorTone = "light" | "dark";

export type TextBasedSelectcorProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> & {
  status?: TextBasedSelectcorStatus;
  defaultStatus?: TextBasedSelectcorStatus;
  label?: string;
  tone?: TextBasedSelectcorTone;
  colors?: string[];
  background?: string;
  icon?: boolean;
  onStatusChange?: (nextStatus: TextBasedSelectcorStatus) => void;
};
const COLLAPSED_SIZE_MOBILE = 25;
const COLLAPSED_SIZE_DESKTOP = 36;

export function TextBasedSelector({
  status,
  defaultStatus = "unselected",
  label = "Color",
  className,
  tone = "light",
  colors = ["var(--text-selector-bg)"],
  background,
  icon = false,
  onStatusChange,
  onClick,
  ...props
}: TextBasedSelectcorProps) {
  const [internalStatus, setInternalStatus] =
    React.useState<TextBasedSelectcorStatus>(defaultStatus);

  const isSelected = (status ?? internalStatus) === "selected";
  const isExpanded = isSelected && !icon;

  const contentColor = tone === "dark" ? "var(--tooltip-text)" : "var(--dialog-bg)";

  const palette = colors.length ? colors : ["var(--text-selector-bg)"];
  // Custom swatches pass `background` with an empty `colors` array.
  const isCustomBackground = Boolean(background) && colors.length === 0;

  const backgroundStyle = background
    ? { background }
    : palette.length === 1
      ? { background: palette[0] }
      : {
          background: `linear-gradient(90deg, ${palette.join(", ")})`,
        };

  const labelRef = React.useRef<HTMLSpanElement>(null);
  const isDesktop = useIsDesktop();
  const [pillWidth, setPillWidth] = React.useState(COLLAPSED_SIZE_MOBILE);

  React.useLayoutEffect(() => {
    if (!isExpanded) {
      return;
    }

    const collapsedSize = isDesktop ? COLLAPSED_SIZE_DESKTOP : COLLAPSED_SIZE_MOBILE;
    const labelWidth = labelRef.current?.offsetWidth ?? 0;
    const iconWidth = isDesktop ? 16 : 12;
    const gap = isDesktop ? 6 : 2;
    const horizontalPadding = isDesktop ? 24 : 8;

    setPillWidth(Math.max(collapsedSize, iconWidth + gap + labelWidth + horizontalPadding));
  }, [isExpanded, label, isDesktop]);

  return (
    <button
      type="button"
      aria-label={props["aria-label"] ?? label}
      aria-pressed={isSelected}
      onClick={(event) => {
        onClick?.(event);

        const nextStatus: TextBasedSelectcorStatus = isSelected ? "unselected" : "selected";

        if (status === undefined) {
          setInternalStatus(nextStatus);
        }

        onStatusChange?.(nextStatus);
      }}
      className={cn(
        "relative inline-flex cursor-pointer rounded-full border-2 p-[2px] transition-colors duration-300",
        isSelected ? "border-border-bg" : "border-transparent",
        className,
      )}
      {...props}
    >
      <span
        style={isCustomBackground ? undefined : backgroundStyle}
        className={cn(
          "inline-flex rounded-full p-[3px] md:p-[3px]",
          isCustomBackground && "relative",
        )}
      >
        {isCustomBackground ? (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300",
              isSelected ? "opacity-80" : "opacity-100",
            )}
            style={backgroundStyle}
          />
        ) : null}
        <span
          style={{
            ...(isCustomBackground ? undefined : backgroundStyle),
            ...(isExpanded ? { width: pillWidth } : undefined),
          }}
          className={cn(
            "relative inline-flex items-center overflow-hidden rounded-full transition-[width] duration-300 ease-in-out",
            isExpanded
              ? "h-6 justify-center gap-1 px-1.5 md:h-9 md:gap-1.5 md:p-3"
              : "size-6 justify-center md:size-9",
          )}
        >
          {icon ? (
            <Image
              src="/assets/brush.svg"
              alt=""
              width={16}
              height={16}
              className="size-2.5 shrink-0 md:size-4"
            />
          ) : (
            <>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center justify-center transition-all duration-300",
                  isSelected ? "w-auto scale-100 opacity-100" : "w-0 scale-0 opacity-0",
                )}
              >
                <TickVecIcon className="size-2.5 md:size-4" tickColor={contentColor} />
              </span>

              <span
                ref={labelRef}
                className={cn(
                  "text-[12px] leading-3 font-medium whitespace-nowrap text-[var(--dialog-bg)] transition-all duration-300 ease-in-out md:text-[16px] md:leading-4",
                  isExpanded
                    ? "max-w-none translate-x-0 opacity-100"
                    : "max-w-0 translate-x-[-8px] opacity-0",
                )}
              >
                <span
                  style={{ color: contentColor }}
                  className="truncate text-[12px] leading-3 font-medium [overflow-wrap:anywhere] md:text-[16px] md:leading-4!"
                >
                  {truncateText(label, 11)}
                </span>
              </span>
            </>
          )}
        </span>
      </span>
    </button>
  );
}
