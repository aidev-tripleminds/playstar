"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MediaPreviewNavButtonProps = {
  direction: "previous" | "next";
  onClick?: () => void;
  className?: string;
};

export function MediaPreviewNavButton({
  direction,
  onClick,
  className,
}: MediaPreviewNavButtonProps) {
  const Icon = direction === "previous" ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <Button
      disableActiveEffect
      type="button"
      aria-label={direction === "previous" ? "Previous slide" : "Next slide"}
      variant="default"
      size="icon-sm"
      onClick={onClick}
      className={cn(
        "hover:bg-background-blur size-[33px] shrink-0 touch-manipulation rounded-full border-none bg-[var(--slider-btn-bg)] text-white hover:text-white",
        className,
      )}
    >
      <Icon className="size-5" />
    </Button>
  );
}
