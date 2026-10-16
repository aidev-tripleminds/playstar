import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { Tooltip } from "@/components/common/general/tooltip/tooltip";
import { cn } from "@/lib/utils";
import { DiscoverIcon } from "@/public/assets/discover-svg";

const navigationLinkVariants = cva(
  "group inline-flex items-center gap-2 rounded-[28px] p-3 text-[14px] leading-5 font-medium ",
  {
    variants: {
      type: {
        default: "text-divider-label hover:bg-surface-strong hover:text-base-color ",
        light: "text-cookie-bg",
        "default-active":
          "bg-tooltip-default-bg text-base-color hover:bg-surface-strong hover:text-base-color",
        premium: "bg-premium-btn",
        /** Paid "Get Tokens" — translucent amber fill, not the Get Premium gold gradient. */
        tokens: "bg-btn-bg",
        rose: "bg-[image:var(--gradient-rose)] text-tooltip-text hover:bg-[image:var(--gradient-rose-hover)]",
      },
      status: {
        collapsed: "justify-center",
        expanded: "justify-between",
        badge: "justify-between",
      },
    },
    defaultVariants: {
      type: "default",
      status: "collapsed",
    },
  },
);

export type NavigationLinkProps = Omit<React.ComponentProps<"button">, "children" | "type"> &
  VariantProps<typeof navigationLinkVariants> & {
    label?: string;
    labelClassName?: string;
    badgeText?: string;
    tooltipText?: string;
    showTooltipOnCollapsed?: boolean;
    /** Radix open delay (ms) when collapsed; close is not delayed. Default 0 so the tooltip opens with the hover state. */
    tooltipDelayDuration?: number;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    leftIconSrc?: string;
    rightIconSrc?: string;
    leftIconAlt?: string;
    rightIconAlt?: string;
    borderRadiusClassName?: string;
    buttonType?: "button" | "submit" | "reset";
    /**
     * Renders an `<a>` instead of a `<button>`. Without it this component —
     * named NavigationLink — could only ever fire an onClick, which is why the
     * sidebar's SOCIALS rail was six dead buttons: no middle-click, no
     * open-in-new-tab, nothing for assistive tech to announce as a link.
     */
    href?: string;
    target?: string;
    rel?: string;
  };

export function NavigationLink({
  type = "default",
  status = "collapsed",
  className,
  label = "Lorem ipsum",
  labelClassName,
  badgeText = "New",
  tooltipText = "Explorer",
  showTooltipOnCollapsed = true,
  tooltipDelayDuration = 0,
  showLeftIcon = true,
  showRightIcon,
  leftIcon,
  rightIcon,
  leftIconSrc,
  rightIconSrc,
  leftIconAlt = "Navigation icon",
  rightIconAlt = "Navigation icon",
  borderRadiusClassName,
  buttonType = "button",
  href,
  target,
  rel,
  ...props
}: NavigationLinkProps) {
  const isExpanded = status === "expanded";
  const isBadge = status === "badge";
  const isPremium = type === "premium";
  const isTokens = type === "tokens";
  const showTooltip = status === "collapsed" && showTooltipOnCollapsed;
  const shouldShowRightIcon = showRightIcon ?? isExpanded;
  const showBadge = isBadge && Boolean(badgeText);

  const defaultIcon = (premium: boolean) =>
    premium ? (
      <DiscoverIcon premium className="flex-shrink-0" />
    ) : (
      <DiscoverIcon className="flex-shrink-0" />
    );

  const renderIcon = (
    iconNode: React.ReactNode | undefined,
    iconSrc: string | undefined,
    alt: string,
    premium: boolean,
  ) =>
    iconNode ? (
      iconNode
    ) : iconSrc ? (
      <Image
        src={iconSrc}
        alt={alt}
        width={24}
        height={24}
        className="h-6 w-6 flex-shrink-0 object-contain"
      />
    ) : (
      defaultIcon(premium)
    );

  const rootClassName = cn(
    navigationLinkVariants({ type, status }),
    borderRadiusClassName,
    "flex w-fit cursor-pointer items-center justify-between gap-5",
    className,
  );
  const ariaLabel = status === "collapsed" ? label : undefined;

  const inner = (
    <>
      {/* MAIN ROW */}
      <div
        className={`flex w-full items-center justify-between ${status === "collapsed" ? "gap-0" : "gap-2"} `}
      >
        {/* LEFT: Icon + Label */}
        <div className="flex items-center gap-2">
          {showLeftIcon ? renderIcon(leftIcon, leftIconSrc, leftIconAlt, isPremium) : null}

          {(isExpanded || isBadge) && (
            <span
              className={cn(
                "truncate text-left",
                isPremium && "text-premium-gold",
                isTokens && "text-tokens-gradient",
                labelClassName,
              )}
            >
              {label}
            </span>
          )}
        </div>
        <div>
          {shouldShowRightIcon
            ? renderIcon(rightIcon, rightIconSrc, rightIconAlt, isPremium)
            : null}
        </div>
      </div>
      {showBadge ? (
        <div className="flex-shrink-0">
          <Badge type="rose" size="medium" text={badgeText} showIcon={false} />
        </div>
      ) : null}
    </>
  );

  // `props` is typed against <button>. A caller passing `href` passes no
  // button-only member (form, value, disabled…), so the cast narrows the shared
  // handler/aria props onto the anchor rather than inventing anything.
  const content = href ? (
    <a
      href={href}
      target={target}
      // Any target that opens a new browsing context gets the opener severed.
      rel={rel ?? (target && target !== "_self" ? "noopener noreferrer" : undefined)}
      className={rootClassName}
      aria-label={ariaLabel}
      {...(props as React.ComponentProps<"a">)}
    >
      {inner}
    </a>
  ) : (
    <button type={buttonType} className={rootClassName} aria-label={ariaLabel} {...props}>
      {inner}
    </button>
  );

  // ── Tooltip wraps collapsed only ──────────────────────────────────────────
  return showTooltip ? (
    <Tooltip text={tooltipText} variant="left" delayDuration={tooltipDelayDuration}>
      {content}
    </Tooltip>
  ) : (
    content
  );
}
