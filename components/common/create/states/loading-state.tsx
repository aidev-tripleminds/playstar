"use client";

import { Progress } from "@/components/ui/progress";

import { GradientGrid } from "../../general/gradient-grid/gradient-grid";
import { Spinner } from "../../general/spinner";
import { CardShell } from "./shared";

export type LoadingStateProps = {
  progress: number;
  title?: string;
  subtitle?: string;
  progressLabel?: string;
};

export function LoadingState({
  progress,
  title = "Creating your AI Model",
  subtitle = "Adding unique personnality...",
  progressLabel = "Generating...",
}: LoadingStateProps) {
  return (
    <CardShell isSignUp={false} className="relative justify-center gap-6 p-6">
      <div className="pointer-events-none absolute -top-[250px] left-1/2 h-[420px] w-[820px] -translate-x-1/2 opacity-25">
        <GradientGrid className="h-full w-full" showGrid={false} />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-1">
        <Spinner className="size-8" />
        <div className="flex flex-col items-center gap-2">
          <p className="text-gradient-pink text-center text-2xl font-bold">{title}</p>
        </div>
        {subtitle ? <p className="text-cookie-bg text-center text-base">{subtitle}</p> : null}
      </div>

      <div className="relative z-10 space-y-2">
        <div className="text-tooltip-text flex items-center justify-between text-xs">
          <span>{progressLabel}</span>
          <span>{progress}%</span>
        </div>
        <Progress
          value={progress}
          className="bg-slider h-2 [&_[data-slot=progress-indicator]]:[background:var(--gradient-rose)]"
        />
      </div>
    </CardShell>
  );
}
