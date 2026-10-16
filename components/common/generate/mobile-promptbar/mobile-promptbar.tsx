"use client";

import * as React from "react";

import { PromptBox, type PromptBoxProps } from "@/components/common/generate/prompt-box";
import { cn } from "@/lib/utils";

import {
  MOBILE_PROMPTBAR_COMPACT_SHELL_CLASS,
  MOBILE_PROMPTBAR_SHELL_CLASS,
} from "./mobile-promptbar.constants";

export type MobilePromptbarProps = Omit<PromptBoxProps, "showSources" | "footerSlot"> & {
  showPlaceholders?: boolean;
  showGenerate?: boolean;
  generateSlot?: React.ReactNode;
};

const COMPACT_TRANSITION_MS = 200;

/** Finger moving down is a positive delta. That scrolls the field toward its top. */
function textareaCanScroll(field: HTMLTextAreaElement, deltaY: number) {
  if (field.scrollHeight <= field.clientHeight + 1) return false;
  if (deltaY > 0 && field.scrollTop <= 0) return false;
  if (deltaY < 0 && field.scrollTop + field.clientHeight >= field.scrollHeight - 1) return false;
  return true;
}

/** Source cards that stick out of the shell while its height is tweening. */
const COMPACT_HEIGHT_OVERHANG_SELECTOR =
  "[data-slot='placeholder'], [data-slot='action-content-card'], [data-slot='audio-msg']";

/**
 * Height is tweened with a clip so the bar grows open. `overflow: hidden`
 * also slices the top of the source cards, which hang a third above the shell.
 * Keep that overhang paintable and clip only the sides and bottom.
 */
function clipExpandingShell(shell: HTMLElement) {
  const shellTop = shell.getBoundingClientRect().top;
  let overhang = 0;
  for (const node of shell.querySelectorAll<HTMLElement>(COMPACT_HEIGHT_OVERHANG_SELECTOR)) {
    overhang = Math.max(overhang, shellTop - node.getBoundingClientRect().top);
  }
  const topAllowance = overhang > 0 ? Math.ceil(overhang) + 8 : 0;
  shell.style.clipPath = `inset(${-topAllowance}px 0 0 0)`;
}

export function MobilePromptbar({
  showPlaceholders = true,
  showGenerate = true,
  generateSlot,
  compact = false,
  className,
  ...promptBoxProps
}: MobilePromptbarProps) {
  const shellRef = React.useRef<HTMLDivElement>(null);
  const heightRef = React.useRef<number | null>(null);

  React.useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const nextHeight = shell.offsetHeight;
    const previousHeight = heightRef.current;
    heightRef.current = nextHeight;

    if (previousHeight == null || previousHeight === nextHeight) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    clipExpandingShell(shell);
    shell.style.height = `${previousHeight}px`;
    shell.getBoundingClientRect();
    shell.style.transition = `height ${COMPACT_TRANSITION_MS}ms ease-out`;
    shell.style.height = `${nextHeight}px`;

    const finish = () => {
      shell.style.height = "";
      shell.style.clipPath = "";
      shell.style.transition = "";
      heightRef.current = shell.offsetHeight;
    };

    shell.addEventListener("transitionend", finish, { once: true });
    const timeout = window.setTimeout(finish, COMPACT_TRANSITION_MS + 40);
    return () => {
      shell.removeEventListener("transitionend", finish);
      window.clearTimeout(timeout);
      shell.style.height = "";
      shell.style.clipPath = "";
      shell.style.transition = "";
    };
  }, [compact]);

  React.useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    let lastX = 0;
    let lastY = 0;

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      lastX = touch.clientX;
      lastY = touch.clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (window.matchMedia("(min-width: 768px)").matches) return;
      const touch = event.touches[0];
      if (!touch) return;
      const deltaX = touch.clientX - lastX;
      const deltaY = touch.clientY - lastY;
      lastX = touch.clientX;
      lastY = touch.clientY;

      const target = event.target;
      if (target instanceof Element) {
        const field = target.closest("textarea");
        if (field instanceof HTMLTextAreaElement && textareaCanScroll(field, deltaY)) return;

        const actions = target.closest("[data-slot='prompt-box-actions']");
        if (
          actions instanceof HTMLElement &&
          actions.scrollWidth > actions.clientWidth + 1 &&
          Math.abs(deltaX) > Math.abs(deltaY)
        ) {
          return;
        }
      }

      if (event.cancelable) event.preventDefault();
    };

    shell.addEventListener("touchstart", onTouchStart, { passive: true });
    shell.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      shell.removeEventListener("touchstart", onTouchStart);
      shell.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div
      ref={shellRef}
      data-slot="mobile-promptbar"
      data-compact={compact ? "true" : "false"}
      className={cn(
        MOBILE_PROMPTBAR_SHELL_CLASS,
        compact && MOBILE_PROMPTBAR_COMPACT_SHELL_CLASS,
        className,
      )}
    >
      <PromptBox
        {...promptBoxProps}
        compact={compact}
        showSources={showPlaceholders}
        footerSlot={generateSlot ?? (showGenerate ? undefined : <></>)}
        className="w-full"
      />
    </div>
  );
}

export {
  MOBILE_PROMPTBAR_COMPACT_SHELL_CLASS,
  MOBILE_PROMPTBAR_DEFAULT_ACTIONS,
  MOBILE_PROMPTBAR_DEFAULT_CONTROL_BUTTONS,
  MOBILE_PROMPTBAR_DEFAULT_PLACEHOLDERS,
  MOBILE_PROMPTBAR_DEFAULT_TOKEN_COST,
  MOBILE_PROMPTBAR_GENERATE_LABEL,
  MOBILE_PROMPTBAR_PRESETS_ICON_SRC,
  MOBILE_PROMPTBAR_PRESETS_LABEL,
  MOBILE_PROMPTBAR_SEE_ALL_LABEL,
  MOBILE_PROMPTBAR_SETTINGS_LABEL,
  MOBILE_PROMPTBAR_SHELL_CLASS,
} from "./mobile-promptbar.constants";
export type {
  MobilePromptbarActionItem,
  MobilePromptbarControlButton,
  MobilePromptbarPlaceholderSlot,
} from "./mobile-promptbar.types";
