"use client";

import type { Ref } from "react";

import {
  MobilePromptbar,
  type MobilePromptbarProps,
} from "@/components/common/generate/mobile-promptbar";
import { cn } from "@/lib/utils";

import type { GenerateDockMotion } from "../_hooks/use-generate-dock-slide";
import { GENERATE_PROMPT_DOCK_CLASS } from "../_lib/constants";

type GeneratePromptDockProps = MobilePromptbarProps & {
  dockRef?: Ref<HTMLDivElement>;
  dockClassName?: string;
  dockMotion?: GenerateDockMotion;
  interactive?: boolean;
};

export function GeneratePromptDock({
  dockRef,
  className,
  dockClassName,
  dockMotion = "idle",
  interactive = true,
  ...promptBoxProps
}: GeneratePromptDockProps) {
  const isInert = !interactive || dockMotion === "exit";

  return (
    <div
      data-slot="generate-prompt-dock"
      data-dock-motion={dockMotion}
      data-interactive={interactive ? "true" : "false"}
      inert={isInert ? true : undefined}
      className={cn(GENERATE_PROMPT_DOCK_CLASS, dockClassName)}
    >
      <div
        ref={dockRef}
        className={cn(
          // Mobile parent is `h-fit`; unprefixed `max-h-full min-h-0` collapses
          // to 0 on iOS Safari. Desktop parent has a definite height.
          "flex w-full max-w-[750px] flex-col min-[768px]:max-h-full min-[768px]:min-h-0",
          interactive && "pointer-events-auto",
        )}
      >
        <MobilePromptbar
          {...promptBoxProps}
          interactive={interactive}
          className={cn(
            "flex w-full flex-col min-[768px]:max-h-full min-[768px]:min-h-0 min-[768px]:flex-1",
            className,
          )}
        />
      </div>
    </div>
  );
}
