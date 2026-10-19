"use client";

import { cn } from "@/lib/utils";

const ATOMS_LOADING_SRC = "/assets/loading/atoms.mp4";

export const AI_LOADING_LABEL_WRAP_CLASS =
  "absolute inset-0 z-10 flex items-end justify-center p-3 md:p-4";

export const AI_LOADING_LABEL_CLASS =
  "text-select-text rounded-[80px] bg-white/15 px-2.5 py-1 text-xs leading-4 font-normal backdrop-blur-[4px] md:px-3 md:py-1.5 md:text-sm md:leading-5";

type AiLoadingProps = {
  className?: string;
};

export function AiLoading({ className }: AiLoadingProps) {
  return (
    <div
      data-slot="ai-loading"
      aria-hidden
      className={cn("absolute inset-0 overflow-hidden bg-[#0a0a0a]", className)}
    >
      <video
        src={ATOMS_LOADING_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
