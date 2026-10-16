import * as React from "react";

import { useIsDesktop } from "@/hooks/use-is-desktop";

import { PROMPT_BOX_DESKTOP_MIN_WIDTH } from "../prompt-box.constants";

export type PromptBoxAnchoredPickerCommitOptions = {
  close?: boolean;
};

type UsePromptBoxAnchoredPickerOptions = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  /** When true, always use the anchored menu — never the mobile modal. */
  menuOnly?: boolean;
};

export function usePromptBoxAnchoredPicker({
  open,
  onOpenChange,
  value,
  defaultValue,
  onValueChange,
  menuOnly = false,
}: UsePromptBoxAnchoredPickerOptions) {
  const isDesktop = useIsDesktop(PROMPT_BOX_DESKTOP_MIN_WIDTH);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const isOpenControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isValueControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const resolvedOpen = isOpenControlled ? Boolean(open) : internalOpen;
  const resolvedValue = isValueControlled ? value : internalValue;
  const isMenuOpen = resolvedOpen && (menuOnly || isDesktop);
  const isModalOpen = resolvedOpen && !menuOnly && !isDesktop;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange],
  );

  const commitValue = React.useCallback(
    (nextValue: string, options?: PromptBoxAnchoredPickerCommitOptions) => {
      if (!isValueControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
      if (options?.close !== false) {
        setOpen(false);
      }
    },
    [isValueControlled, onValueChange, setOpen],
  );

  React.useEffect(() => {
    if (!isMenuOpen) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target) || menuRef.current?.contains(target)) {
        return;
      }
      setOpen(false);
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isMenuOpen, setOpen]);

  return {
    containerRef,
    menuRef,
    resolvedOpen,
    resolvedValue,
    isMenuOpen,
    isModalOpen,
    setOpen,
    commitValue,
    toggleOpen: () => setOpen(!resolvedOpen),
  };
}
