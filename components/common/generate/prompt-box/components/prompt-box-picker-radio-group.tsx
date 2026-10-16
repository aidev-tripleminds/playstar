"use client";

import * as React from "react";

import type { PromptBoxAnchoredPickerCommitOptions } from "../hooks/use-prompt-box-anchored-picker";

const RADIO_NAV_KEYS = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"]);

export type PromptBoxPickerRadioGroupProps = {
  label: string;
  values: readonly string[];
  value: string;
  onValueChange: (value: string, options?: PromptBoxAnchoredPickerCommitOptions) => void;
  children: React.ReactNode;
};

export function PromptBoxPickerRadioGroup({
  label,
  values,
  value,
  onValueChange,
  children,
}: PromptBoxPickerRadioGroupProps) {
  const groupRef = React.useRef<HTMLDivElement>(null);

  const focusRadioAt = (index: number) => {
    const radios = groupRef.current?.querySelectorAll<HTMLElement>('[role="radio"]');
    radios?.[index]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!RADIO_NAV_KEYS.has(event.key) || values.length === 0) return;

    event.preventDefault();

    const currentIndex = Math.max(0, values.indexOf(value));
    const lastIndex = values.length - 1;
    let nextIndex = currentIndex;

    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    } else {
      nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
    }

    const nextValue = values[nextIndex];
    if (!nextValue) return;

    if (nextValue !== value) {
      onValueChange(nextValue, { close: false });
    }

    requestAnimationFrame(() => focusRadioAt(nextIndex));
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className="flex w-full flex-col gap-0.5"
    >
      {children}
    </div>
  );
}
