"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";
import ArrowLeftIcon from "@/public/assets/icons/arrow-left-icon";

type BackNavProps = {
  className?: string;
  onBack?: () => void;
  disabled?: boolean;
};

export const BackNav: React.FC<BackNavProps> = ({ className, onBack, disabled = false }) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    window.history.back();
  };

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between pb-4 text-white lg:justify-start lg:gap-4 lg:pb-6",
        className,
      )}
      data-testid="back-nav"
    >
      <button
        onClick={handleBack}
        className="flex size-6 shrink-0 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Go back"
        type="button"
        disabled={disabled}
      >
        <ArrowLeftIcon />
      </button>

      <Image
        src="/assets/logo-spicestars.svg"
        alt="Spicestars logo"
        width={126}
        height={24}
        className="h-6 w-[126px]"
        priority
      />
      <span className="size-4 shrink-0 lg:hidden" aria-hidden />
    </div>
  );
};
