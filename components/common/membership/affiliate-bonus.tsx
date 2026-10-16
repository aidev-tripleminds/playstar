import React from "react";

import { cn } from "@/lib/utils";

export type AffiliateBonusProps = {
  tokens?: number;
  affiliateName?: string;
  className?: string;
};

export const AffiliateBonus: React.FC<AffiliateBonusProps> = ({
  tokens = 300,
  affiliateName = "affiliate-name",
  className,
}) => {
  return (
    <div
      data-testid="affiliate-bonus"
      className={cn(
        "my-4 flex items-center justify-center",
        "rounded-full px-3 py-2",
        "bg-[var(--select-content-bg)]",
        className,
      )}
    >
      <span className="bg-[image:var(--token-gradient-gold-premium)] bg-clip-text text-center text-base leading-[150%] font-semibold text-transparent">
        +{tokens} Tokens from {"{"}
        {affiliateName}
        {"}"}
      </span>
    </div>
  );
};
