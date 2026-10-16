import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import * as React from "react";

import { Badge } from "@/components/common/general/badge/badge";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const bankButtonVariants = cva(
  "relative flex w-[358px] min-h-[44px] overflow-visible bg-white items-center justify-center gap-1 rounded-[80px] border-none bg-[linear-gradient(180deg,var(--color-bank-gradient-start)_0%,var(--color-bank-gradient-mid)_20%,var(--color-bank-gradient-end)_100%)] p-3 text-bank-foreground shadow-none",
  {
    variants: {
      kind: {
        bank: "",
        crypto: "",
        twoLogos: "",
        type4: "",
      },
    },
    defaultVariants: {
      kind: "bank",
    },
  },
);

export type BankButtonLogo = {
  src: string;
  width: number;
  height: number;
  zIndex?: number;
};

type BankButtonProps = Omit<
  React.ComponentProps<typeof ShadcnButton>,
  "variant" | "size" | "type"
> &
  VariantProps<typeof bankButtonVariants> & {
    label?: string;
    countText?: string;
    badgeText?: string;
    showBadge?: boolean;
    /** Overrides the default logo strip for `twoLogos` (and other kinds). */
    logosSrc?: string;
    /** Renders individual marks instead of a single strip. */
    logos?: readonly BankButtonLogo[];
    /** Overlap marks (Figma crypto stack). Defaults to true for `crypto`. */
    logosOverlap?: boolean;
  };

export function BankButton({
  kind = "bank",
  label = "By Bank",
  countText = "+99",
  badgeText = "+10",
  showBadge,
  logosSrc,
  logos,
  logosOverlap,
  className,
  ...props
}: BankButtonProps) {
  const isBankLike = kind === "bank" || kind === "type4";
  const showBankIcon = isBankLike;
  const showCount = isBankLike;
  const shouldShowBadge = showBadge ?? kind === "type4";
  const shouldOverlapLogos = logosOverlap ?? kind === "crypto";
  const resolvedLogosSrc =
    logosSrc ??
    (kind === "bank" || kind === "type4"
      ? "/assets/bank-logos.svg"
      : kind === "crypto"
        ? "/assets/crypto-logos.svg"
        : "/assets/double-logos.svg");

  return (
    <ShadcnButton className={cn(bankButtonVariants({ kind }), className)} {...props}>
      <span className="text-[14px]! leading-5! font-medium">{label}</span>
      {showBankIcon ? (
        <Image src="/assets/bank-icon.svg" alt="" width={20} height={20} aria-hidden />
      ) : null}
      {logos?.length ? (
        <span className={cn("flex items-center", !shouldOverlapLogos && "gap-2")}>
          {logos.map((logo, index) => (
            <Image
              key={logo.src}
              src={logo.src}
              alt=""
              width={logo.width}
              height={logo.height}
              className={cn(
                "h-auto w-auto",
                shouldOverlapLogos && "relative",
                shouldOverlapLogos && index > 0 && "-ml-1.5",
              )}
              style={shouldOverlapLogos ? { zIndex: logo.zIndex ?? index } : undefined}
              aria-hidden
            />
          ))}
        </span>
      ) : (
        <Image
          src={resolvedLogosSrc}
          alt=""
          width={kind === "twoLogos" ? 44 : 20}
          height={20}
          className={cn("h-5 w-auto")}
          aria-hidden
        />
      )}
      {showCount ? (
        <span className="text-bank-count text-[14px]! leading-5 font-medium">{countText}</span>
      ) : null}
      {shouldShowBadge ? (
        <span className="pointer-events-none absolute top-0 right-0">
          <Badge type="rose" size="small" text={badgeText} showIcon />
        </span>
      ) : null}
    </ShadcnButton>
  );
}
