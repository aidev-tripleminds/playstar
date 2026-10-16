import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";
import InfinityIcon from "@/public/assets/icons/infinity-icon";

import { Accordion } from "./accordion";

type PerkItem = {
  title: string;
  description?: string;
  iconSrc?: string;
  iconAlt?: string;
  isUnlimited?: boolean;
  tags?: string[];
  showInfinityIcon?: boolean;
};

export type PerkCardProps = Omit<React.ComponentProps<"div">, "children"> & {
  variant?: "default" | "premium" | "unlimited" | "gold";
  line?: "one" | "two";
  items?: PerkItem[];
  titleClassName?: string; // ✅ NEW (important)
};

/**
 * Styles
 */
const defaultGradientStyle: React.CSSProperties = {
  background: `
    var(--perk-default-bg) padding-box,
    var(--perk-default-border) border-box
  `,
};

const premiumStyle: React.CSSProperties = {
  background: "var(--premium-background)",
};

const goldStyle: React.CSSProperties = {
  background: "var(--accordion-background)",
  backgroundColor: "var(--select-content-bg)",
};

const accordionStyle: React.CSSProperties = {
  background: "var(--accordion-background)",
};

export function PerkCard({
  variant = "default",
  line = "two",
  items = [],
  className,
  titleClassName, // ✅ receive from parent
  ...props
}: PerkCardProps) {
  return (
    <div className={cn("flex w-full flex-col gap-1 rounded-2xl", className)} {...props}>
      {items.map((item, index) => (
        <PerkRow
          key={index}
          item={item}
          variant={variant}
          line={line}
          titleClassName={titleClassName} // ✅ pass down
        />
      ))}
    </div>
  );
}

type PerkRowProps = {
  item: PerkItem;
  variant?: PerkCardProps["variant"];
  line?: PerkCardProps["line"];
  titleClassName?: string; // ✅ NEW
};

function PerkRow({ item, variant = "default", line = "two", titleClassName }: PerkRowProps) {
  const isAccordion = variant === "unlimited" && Boolean(item.tags?.length);

  const titleStyles = {
    one: "text-sm leading-[20px] font-medium",
    two: "text-base leading-[24px] font-semibold",
  };

  const style =
    variant === "premium"
      ? premiumStyle
      : variant === "gold"
        ? goldStyle
        : variant === "unlimited"
          ? isAccordion
            ? accordionStyle
            : premiumStyle
          : defaultGradientStyle;

  /**
   * 🎯 COMMON TITLE BLOCK
   */
  const TitleBlock = (
    <div className="flex-1">
      <p
        className={cn(
          "flex items-center gap-1.5 text-(--countdown-text)",
          titleStyles[line],
          titleClassName, // ✅ THIS makes parent control work
        )}
      >
        {item.title}
        {item.showInfinityIcon && (
          <span className="text-yellow-400">
            <InfinityIcon />
          </span>
        )}
      </p>

      {line === "two" && item.description && (
        <p className="text-sm text-[color:var(--select-muted-text)]">{item.description}</p>
      )}
    </div>
  );

  /**
   * ✅ ACCORDION CASE
   */
  if (isAccordion) {
    return (
      <Accordion
        style={style}
        className="box-border border border-transparent"
        title={TitleBlock}
        icon={
          <Image
            src={item.iconSrc || "/assets/spice-coin.png"}
            alt={item.iconAlt || "perk icon"}
            width={24}
            height={24}
          />
        }
      >
        <div className="flex flex-wrap gap-1">
          {item.tags?.map((tag, i) => (
            <span
              key={i}
              className="rounded-full bg-[image:var(--perk-tag-bg)] px-2 py-1.5 text-xs text-[var(--cookie-bg)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </Accordion>
    );
  }

  /**
   * ✅ NORMAL ROW
   */
  return (
    <div className="box-border rounded-[1rem] border border-transparent p-3" style={style}>
      <div className="relative z-11 flex items-center gap-3">
        <Image
          src={item.iconSrc || "/assets/spice-coin.png"}
          alt={item.iconAlt || "perk icon"}
          width={line === "one" ? 20 : 24}
          height={line === "one" ? 20 : 24}
          className={cn("shrink-0", line === "one" ? "h-5 w-5" : "h-6 w-6")}
        />

        {TitleBlock}
      </div>
    </div>
  );
}
