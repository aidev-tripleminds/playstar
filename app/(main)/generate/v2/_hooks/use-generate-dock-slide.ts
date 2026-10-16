import * as React from "react";

import { cn } from "@/lib/utils";

import {
  GENERATE_DOCK_SLIDE_ENTER_CLASS,
  GENERATE_DOCK_SLIDE_EXIT_CLASS,
  GENERATE_DOCK_SLIDE_MS,
} from "../_lib/constants";

export type GenerateDockKind = "prompt" | "bulk";
export type GenerateDockMotion = "idle" | "enter" | "exit";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useGenerateDockSlide(selectMode: boolean) {
  const targetDock: GenerateDockKind = selectMode ? "bulk" : "prompt";
  const [renderedDock, setRenderedDock] = React.useState<GenerateDockKind>(targetDock);
  const [dockMotion, setDockMotion] = React.useState<GenerateDockMotion>("idle");

  const targetDockRef = React.useRef(targetDock);

  if (targetDock !== renderedDock && dockMotion !== "exit") {
    if (prefersReducedMotion()) {
      setRenderedDock(targetDock);
    } else {
      setDockMotion("exit");
    }
  } else if (dockMotion !== "idle" && prefersReducedMotion()) {
    setRenderedDock(targetDock);
    setDockMotion("idle");
  }

  React.useEffect(() => {
    targetDockRef.current = targetDock;
  }, [targetDock]);

  React.useEffect(() => {
    if (dockMotion === "idle") {
      return;
    }

    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      if (dockMotion === "exit") {
        setRenderedDock(targetDockRef.current);
        setDockMotion("enter");
        return;
      }
      if (dockMotion === "enter") {
        setDockMotion("idle");
      }
    };

    const timeoutId = window.setTimeout(finish, GENERATE_DOCK_SLIDE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dockMotion]);

  return {
    kind: renderedDock,
    motion: dockMotion,
    className: cn(
      dockMotion === "exit" && GENERATE_DOCK_SLIDE_EXIT_CLASS,
      dockMotion === "enter" && GENERATE_DOCK_SLIDE_ENTER_CLASS,
    ),
  };
}
