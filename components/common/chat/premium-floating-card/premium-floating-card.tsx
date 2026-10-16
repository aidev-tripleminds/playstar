import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Buttons } from "../../general/button/buttons";

export type PremiumFloatingCardProps = Omit<React.ComponentProps<"div">, "children"> & {
  tokensLabel?: string;
  subtitleLabel?: string;
  upgradeLabel?: string;
  coinIconSrc?: string;
  crownIconSrc?: string;
  onUpgrade?: () => void;
};

export function PremiumFloatingCard({
  tokensLabel = "50 tokens left",
  subtitleLabel = "Unlock Unlimited Chat + 200 tokens",
  upgradeLabel = "Upgrade",
  coinIconSrc = "/assets/spice-coin.png",
  crownIconSrc = "/assets/crown-white.svg",
  onUpgrade,
  className,
  ...props
}: PremiumFloatingCardProps) {
  const handleUpgradeClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onUpgrade?.();
  };

  return (
    <div
      data-slot="premium-floating-card"
      onClick={onUpgrade}
      className={cn(
        "premium-card-bg text-tooltip-text flex w-full max-w-[400px] items-center gap-1.5 rounded-[20px] p-3",
        onUpgrade && "cursor-pointer",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="flex w-full items-center gap-1.5">
          <Image
            src={coinIconSrc}
            alt=""
            aria-hidden
            width={20}
            height={20}
            className="size-5 shrink-0 object-cover"
          />
          <p className="text-tokens-gradient relative min-w-0 flex-1 text-base leading-6 font-medium">
            {tokensLabel}
          </p>
        </div>

        <p className="text-tooltip-text min-w-0 text-sm leading-5 font-medium">{subtitleLabel}</p>
      </div>

      <Buttons
        variant="premium-full"
        size="btn-xs"
        rightIcon={false}
        leftIconSrc={crownIconSrc}
        label={upgradeLabel}
        onClick={handleUpgradeClick}
        className="w-fit shrink-0"
      />
    </div>
  );
}
