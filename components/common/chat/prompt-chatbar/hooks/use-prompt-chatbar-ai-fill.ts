"use client";

import * as React from "react";

export type PromptChatbarAiFillPhase = "idle" | "revealing" | "filled" | "erasing";

type UsePromptChatbarAiFillOptions = {
  promptText: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  startsFilled?: boolean;
};

export function usePromptChatbarAiFill({
  promptText,
  value,
  defaultValue,
  onValueChange,
  startsFilled = false,
}: UsePromptChatbarAiFillOptions) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(
    startsFilled ? promptText : (defaultValue ?? ""),
  );
  const [phase, setPhase] = React.useState<PromptChatbarAiFillPhase>(
    startsFilled ? "filled" : "idle",
  );
  const [aiSnapshot, setAiSnapshot] = React.useState<string | null>(
    startsFilled ? promptText : null,
  );

  const currentValue = isControlled ? value : internalValue;
  const showDiscard = phase === "filled" && aiSnapshot !== null;
  const showMagicText = phase === "revealing" || phase === "erasing";
  const magicMode: "reveal" | "erase" = phase === "revealing" ? "reveal" : "erase";
  const magicText = phase === "erasing" ? (aiSnapshot ?? currentValue) : promptText;

  const setValue = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  const handleFillWithAi = React.useCallback(() => {
    setPhase("revealing");
  }, []);

  const handleRevealComplete = React.useCallback(() => {
    setValue(promptText);
    setAiSnapshot(promptText);
    setPhase("filled");
  }, [promptText, setValue]);

  const handleDiscard = React.useCallback(() => {
    if (!aiSnapshot && !currentValue) return;
    setPhase("erasing");
  }, [aiSnapshot, currentValue]);

  const handleEraseComplete = React.useCallback(() => {
    setValue("");
    setAiSnapshot(null);
    setPhase("idle");
  }, [setValue]);

  const handlePromptChange = React.useCallback(
    (nextValue: string) => {
      if (aiSnapshot !== null && nextValue !== aiSnapshot) {
        setAiSnapshot(null);
        setPhase("idle");
      }
      setValue(nextValue);
    },
    [aiSnapshot, setValue],
  );

  const clearAiFillState = React.useCallback(() => {
    setAiSnapshot(null);
    setPhase("idle");
  }, []);

  return {
    currentValue,
    phase,
    showDiscard,
    showMagicText,
    magicMode,
    magicText,
    handleFillWithAi,
    handleRevealComplete,
    handleDiscard,
    handleEraseComplete,
    handlePromptChange,
    clearAiFillState,
  };
}
