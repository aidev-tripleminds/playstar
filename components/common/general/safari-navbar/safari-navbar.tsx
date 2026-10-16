import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export type SafariNavbarProps = React.ComponentProps<"div"> & {
  onBack?: () => void;
  onForward?: () => void;
  onShare?: () => void;
  onBookmarks?: () => void;
  onTabs?: () => void;
  forwardDisabled?: boolean;
};

export function SafariNavbar({
  className,
  onBack,
  onForward,
  onShare,
  onBookmarks,
  onTabs,
  forwardDisabled = true,
  ...props
}: SafariNavbarProps) {
  return (
    <div
      data-slot="iphone-hud"
      className={cn(
        "flex w-[393px] max-w-full flex-col gap-1 px-0 pt-2 pb-5 backdrop-blur-[80px]",
        "bg-iphone-hud-bg",
        className,
      )}
      {...props}
    >
      <div data-slot="iphone-hud-controls" className="flex items-center justify-between gap-5 px-4">
        <button
          type="button"
          aria-label="Back"
          className="text-iphone-hud-icon flex w-8 items-center justify-center py-0.5"
          onClick={onBack}
        >
          <span className="relative inline-block h-[1.5em] w-[1.5em]">
            <Image src={"/assets/left.svg"} fill alt="" />
          </span>
        </button>

        <button
          type="button"
          aria-label="Forward"
          className={cn(
            "flex w-8 items-center justify-center py-0.5",
            forwardDisabled ? "text-iphone-hud-icon-muted" : "text-iphone-hud-icon",
          )}
          onClick={onForward}
          disabled={forwardDisabled}
        >
          <span className="relative inline-block h-[1.5em] w-[1.5em]">
            <Image src={"/assets/left.svg"} className="rotate-180 object-contain" fill alt="" />
          </span>
        </button>

        <button
          type="button"
          aria-label="Share"
          className="text-iphone-hud-icon flex w-8 items-center justify-center py-0.5"
          onClick={onShare}
        >
          <span className="relative inline-block h-[1.5em] w-[1.5em]">
            <Image src={"/assets/upload.svg"} fill alt="" />
          </span>
        </button>

        <button
          type="button"
          aria-label="Bookmarks"
          className="text-iphone-hud-icon flex w-8 items-center justify-center py-0.5"
          onClick={onBookmarks}
        >
          <span className="relative inline-block h-[1.5em] w-[1.5em]">
            <Image src={"/assets/read.svg"} fill alt="" />
          </span>
        </button>

        <button
          type="button"
          aria-label="Tabs"
          className="text-iphone-hud-icon flex w-8 items-center justify-center py-0.5"
          onClick={onTabs}
        >
          <span className="relative inline-block h-[1.5em] w-[1.5em]">
            <Image src={"/assets/copy.svg"} fill alt="" />
          </span>
        </button>
      </div>
    </div>
  );
}
