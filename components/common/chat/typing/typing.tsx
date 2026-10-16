import "./typing.css";

import * as React from "react";

import { cn } from "@/lib/utils";

export type TypingProps = {
  className?: string;
  label?: string;
};

export function Typing({ className, label = "Typing" }: TypingProps) {
  return (
    <div
      data-slot="typing"
      role="status"
      aria-label={label}
      className={cn("bg-surface-strong inline-flex items-center gap-1 rounded-full p-2", className)}
    >
      <span aria-hidden="true" className="typing-dot bg-divider-label size-2 rounded-full" />
      <span aria-hidden="true" className="typing-dot bg-divider-label size-2 rounded-full" />
      <span aria-hidden="true" className="typing-dot bg-divider-label size-2 rounded-full" />
    </div>
  );
}
