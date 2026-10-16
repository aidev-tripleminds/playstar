"use client";

import * as React from "react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { findShowMeRanges, splitTextByShowMeRanges } from "../utils/show-me-trigger";

const promptTextareaClassName = cn(
  "min-h-5 w-full min-w-0 flex-1 resize-none rounded-none border-0 bg-transparent p-0 shadow-none",
  "text-sm leading-5 font-normal [overflow-wrap:anywhere]",
  "text-tooltip-text placeholder:text-divider-label",
  "focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none",
);

const promptMirrorClassName = cn(
  "text-sm leading-5 font-normal [overflow-wrap:anywhere] whitespace-pre-wrap break-words",
);

type PromptChatbarImagePromptFieldProps = {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  "aria-label"?: string;
};

function PromptChatbarImagePromptMirror({ value }: { value: string }) {
  const ranges = React.useMemo(() => findShowMeRanges(value), [value]);
  const parts = React.useMemo(() => splitTextByShowMeRanges(value, ranges), [value, ranges]);
  const hasHighlight = ranges.length > 0;

  if (!value) {
    return <span className="text-tooltip-text">&nbsp;</span>;
  }

  return (
    <>
      {parts.map((part, index) => (
        <span
          key={`${part.text}-${index}`}
          className={cn(
            part.highlighted
              ? "text-brand-primary font-semibold"
              : hasHighlight
                ? "text-tooltip-text"
                : "text-tooltip-text",
          )}
        >
          {part.text}
        </span>
      ))}
    </>
  );
}

export function PromptChatbarImagePromptField({
  value,
  placeholder,
  disabled = false,
  onValueChange,
  onKeyDown,
  "aria-label": ariaLabel,
}: PromptChatbarImagePromptFieldProps) {
  const hasHighlight = React.useMemo(() => findShowMeRanges(value).length > 0, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange?.(event.target.value);
  };

  return (
    <div
      data-slot="prompt-chatbar-image-prompt-field"
      data-show-me-active={hasHighlight ? "true" : "false"}
      className="relative grid min-w-0 flex-1"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none col-start-1 row-start-1 min-h-5 w-full min-w-0",
          promptMirrorClassName,
        )}
      >
        <PromptChatbarImagePromptMirror value={value} />
      </div>
      <Textarea
        data-slot="prompt-chatbar-textarea"
        rows={1}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel ?? placeholder ?? "Message prompt"}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        className={cn(
          promptTextareaClassName,
          "col-start-1 row-start-1",
          hasHighlight && "caret-tooltip-text text-transparent",
          disabled && "bg-dialog-bg cursor-not-allowed opacity-60",
        )}
      />
    </div>
  );
}
