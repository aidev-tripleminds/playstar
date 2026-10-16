import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { cn } from "@/lib/utils";
import { ExploreIcon } from "@/public/assets/icons/explore";

const mobileLinksVariants = cva(
  "inline-flex w-fit items-center  overflow-visible rounded-[5px]  px-[15px] py-0",
);

const mobileLinkItemVariants = cva(
  "relative inline-flex min-w-[52px] flex-1 basis-0 flex-col items-center justify-center gap-[2px] rounded-[40px] px-[6px] py-2 text-center text-[10px]! leading-[10px]! font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-transparent text-black ",
        "default-selected": "bg-surface-strong text-rose-text!",
        "premium-selected": "bg-premium-btn",
        "tokens-selected": "bg-btn-bg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type MobileLinkItem = VariantProps<typeof mobileLinkItemVariants> & {
  id: string;
  label: string;
  showBadge?: boolean;
  badgeText?: string;
  /** Count badges sit on the icon. Discount pills stay centered on the tab. */
  badgePlacement?: "center" | "icon";
  icon?: React.ReactNode;
  iconSrc?: string;
  iconAlt?: string;
  className?: string;
  labelClassName?: string;
};

export type MobileLinksProps = Omit<React.ComponentProps<"nav">, "children"> & {
  label?: string;
  items?: MobileLinkItem[];
  onItemClick?: (item: MobileLinkItem) => void;
  selectable?: boolean;
  selectedItemId?: string;
  defaultSelectedItemId?: string;
  onSelectedItemChange?: (item: MobileLinkItem) => void;
};

export const defaultMobileLinksItems: MobileLinkItem[] = [
  {
    id: "explore-default",
    label: "Explore",
    variant: "default",
    showBadge: true,
    badgeText: "-75%",
  },
];

export function MobileLinks({
  className,
  label = "Mobile links",
  items = defaultMobileLinksItems,
  onItemClick,
  selectable = false,
  selectedItemId,
  defaultSelectedItemId,
  onSelectedItemChange,
  ...props
}: MobileLinksProps) {
  const navRef = React.useRef<HTMLElement>(null);
  const firstSelectedItem = items.find((item) => item.variant && item.variant !== "default");
  const [internalSelectedItemId, setInternalSelectedItemId] = React.useState<string | undefined>(
    defaultSelectedItemId ?? firstSelectedItem?.id,
  );
  const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({});

  const activeSelectedItemId = selectedItemId ?? internalSelectedItemId;

  const getSelectedVariant = React.useCallback(
    (item: MobileLinkItem): MobileLinkItem["variant"] => {
      if (item.variant === "premium-selected") return "premium-selected";
      if (item.variant === "tokens-selected") return "tokens-selected";
      return "default-selected";
    },
    [],
  );

  const computedItems = React.useMemo(
    () =>
      items.map((item) => {
        const computedVariant =
          selectable && activeSelectedItemId
            ? item.id === activeSelectedItemId
              ? getSelectedVariant(item)
              : "default"
            : item.variant;

        return { ...item, computedVariant };
      }),
    [items, selectable, activeSelectedItemId, getSelectedVariant],
  );

  const activeIndicatorVariant = React.useMemo(() => {
    const activeItem = computedItems.find((item) => item.computedVariant !== "default");
    if (activeItem?.computedVariant === "premium-selected") return "premium-selected";
    if (activeItem?.computedVariant === "tokens-selected") return "tokens-selected";
    return "default-selected";
  }, [computedItems]);

  React.useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const updateIndicator = () => {
      const activeButton = nav.querySelector(
        'button[aria-current="page"]',
      ) as HTMLButtonElement | null;
      if (!activeButton) {
        setIndicatorStyle({});
        return;
      }

      const navRect = nav.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      setIndicatorStyle({
        left: buttonRect.left - navRect.left,
        width: buttonRect.width,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateIndicator);
    observer?.observe(nav);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [computedItems]);

  return (
    <nav
      ref={navRef}
      aria-label={label}
      className={cn(mobileLinksVariants(), "relative", className)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 bottom-0 z-0 rounded-[40px]",
          indicatorStyle.width !== undefined &&
            "transition-[left,width] duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)]",
          activeIndicatorVariant === "premium-selected"
            ? "bg-premium-btn"
            : activeIndicatorVariant === "tokens-selected"
              ? "bg-btn-bg"
              : "bg-surface-strong",
        )}
        style={indicatorStyle}
      />

      {computedItems.map((item) => {
        const computedVariant = item.computedVariant;
        const isPremium =
          computedVariant === "premium-selected" || computedVariant === "tokens-selected";
        const isSelected = computedVariant !== "default";

        return (
          <button
            key={item.id}
            type="button"
            className={cn(
              mobileLinkItemVariants({ variant: "default" }),
              "relative z-10",
              isSelected && !isPremium && "text-rose-text",
              item.className,
            )}
            onClick={() => {
              onItemClick?.(item);
              if (selectable && selectedItemId === undefined) {
                setInternalSelectedItemId(item.id);
              }
              if (selectable) {
                onSelectedItemChange?.(item);
              }
            }}
            aria-label={item.label}
            aria-current={isSelected ? "page" : undefined}
          >
            {item.showBadge && item.badgePlacement !== "icon" ? (
              <span className="absolute -top-[7px] left-1/2 z-20 -translate-x-1/2">
                <Badge type="rose" size="small" text={item.badgeText ?? "-75%"} showIcon={false} />
              </span>
            ) : null}

            {/* Icon */}
            {item.badgePlacement === "icon" && item.showBadge ? (
              <span className="relative inline-flex">
                {item.icon}
                <span className="absolute -top-1.5 -right-2 z-20">
                  <Badge
                    type="rose"
                    size="small"
                    text={item.badgeText ?? "-75%"}
                    showIcon={false}
                  />
                </span>
              </span>
            ) : item.icon ? (
              item.icon
            ) : item.iconSrc ? (
              <Image
                src={item.iconSrc}
                alt={item.iconAlt ?? `${item.label} icon`}
                width={24}
                height={24}
                className="h-6 w-6 flex-shrink-0 object-contain"
              />
            ) : (
              <ExploreIcon premium={isPremium} className="flex-shrink-0" />
            )}
            <span className={cn(isPremium && "text-premium-gradient", item.labelClassName)}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
