"use client";

import { cn } from "@/lib/utils";

import "./ai-loading.css";

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
      className={cn("absolute inset-0 flex items-center justify-center bg-[#0a0a0a]", className)}
    >
      <div className="ai-loading">
        <span className="ai-loading-wash" />
        <span className="ai-loading-ticks" />
        <span className="ai-loading-track" />
        <span className="ai-loading-sweep" />
        <span className="ai-loading-wave">
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
