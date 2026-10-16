import * as React from "react";

import { cn } from "@/lib/utils";
import { CrownFilledIcon } from "@/public/assets/icons";
import UnlimitedIcon from "@/public/assets/icons/unlimited-icon";

import {
  V2_NAV_PLAN_LABEL,
  V2_NAV_UPGRADE_LABEL,
  type V2NavPremium,
  v2NavShowsUpgrade,
} from "./v2-nav.constants";

type V2NavPlanButtonProps = {
  premium?: V2NavPremium;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export function V2NavPlanButton({
  premium = "infinite-yearly",
  onClick,
  className,
}: V2NavPlanButtonProps) {
  const upgrade = v2NavShowsUpgrade(premium);

  return (
    <button
      type="button"
      data-slot="v2-nav-plan"
      className={cn(
        "flex w-full cursor-pointer items-center justify-center gap-0.5 rounded-full px-2 py-2",
        "text-tooltip-text text-xs leading-4 font-medium shadow-[0_0_4px_rgba(0,0,0,0.15)]",
        "focus-visible:ring-border-focus focus-visible:ring-2 focus-visible:outline-none",
        upgrade
          ? "bg-[image:var(--gradient-rose)] hover:bg-[image:var(--gradient-rose-hover)]"
          : "hover:bg-surface-strong bg-[linear-gradient(180deg,#171717_0%,#0e0e0e_100%)] transition-colors",
        className,
      )}
      onClick={onClick}
    >
      {premium === "free" || premium === "premium" ? (
        <CrownFilledIcon size={16} tone="solid" className="shrink-0 text-white" />
      ) : upgrade ? (
        <UnlimitedIcon size={16} className="shrink-0 text-white" />
      ) : (
        <CrownFilledIcon size={16} tone="solid" className="shrink-0" />
      )}
      {upgrade ? V2_NAV_UPGRADE_LABEL : V2_NAV_PLAN_LABEL}
    </button>
  );
}
