"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const MAGIC_ROTATIONS = [
  "-12deg",
  "8deg",
  "-6deg",
  "14deg",
  "-9deg",
  "5deg",
  "-15deg",
  "10deg",
] as const;
const ERASE_STAGGER_MS = 3;
const ERASE_CHAR_REMOVE_MS = 90;
const ERASE_COMPLETE_MS = 110;

type MagicCharState = "hidden" | "pop" | "visible" | "exit";

type MagicChar = {
  id: number;
  char: string;
  rotation: string;
  state: MagicCharState;
};

function getRevealDelay(char: string) {
  if (char === " ") return 12;
  if (char === "." || char === "," || char === "!" || char === "?") {
    return 60;
  }
  // Deterministic jitter so fake-timer tests drain reliably under parallel load.
  return 2 + (char.charCodeAt(0) % 5);
}

function buildMagicChars(text: string, initialState: MagicCharState = "hidden"): MagicChar[] {
  return text.split("").map((char, index) => ({
    id: index,
    char,
    rotation: MAGIC_ROTATIONS[index % MAGIC_ROTATIONS.length] ?? "0deg",
    state: initialState,
  }));
}

export type PromptChatbarAiMagicTextProps = {
  text: string;
  mode: "reveal" | "erase";
  onComplete?: () => void;
  className?: string;
};

function PromptChatbarAiMagicTextContent({
  text,
  mode,
  onComplete,
  className,
}: PromptChatbarAiMagicTextProps) {
  const [chars, setChars] = React.useState<MagicChar[]>(() =>
    buildMagicChars(text, mode === "erase" ? "visible" : "hidden"),
  );
  const onCompleteRef = React.useRef(onComplete);

  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  React.useEffect(() => {
    if (mode === "reveal") {
      let index = 0;
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      const revealNext = () => {
        if (index >= text.length) {
          onCompleteRef.current?.();
          return;
        }

        const currentChar = text[index] ?? " ";
        const currentIndex = index;

        setChars((prev) =>
          prev.map((entry, i) => (i === currentIndex ? { ...entry, state: "pop" } : entry)),
        );

        index += 1;
        timeoutId = setTimeout(revealNext, getRevealDelay(currentChar));
      };

      timeoutId = setTimeout(revealNext, 0);
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    // erase mode — matches HTML demo: left-to-right wave, chars shrink/fade then
    // remove so the remaining text collapses left across the full line
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // text.split("").forEach((_, index) => {
    //   const startDelay = index * ERASE_STAGGER_MS;

    //   timeouts.push(
    //     setTimeout(() => {
    //       setChars((prev) =>
    //         prev.map((entry) => (entry.id === index ? { ...entry, state: "exit" } : entry)),
    //       );
    //     }, startDelay),
    //   );

    //   timeouts.push(
    //     setTimeout(() => {
    //       setChars((prev) => prev.filter((entry) => entry.id !== index));
    //     }, startDelay + ERASE_CHAR_REMOVE_MS),
    //   );
    // });

    timeouts.push(
      setTimeout(
        () => {
          setChars([]);
          onCompleteRef.current?.();
        },
        text.length * ERASE_STAGGER_MS + ERASE_COMPLETE_MS,
      ),
    );

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [mode, text]);

  return (
    <div
      data-slot="prompt-chatbar-ai-magic-text"
      data-mode={mode}
      className={cn(
        "flex min-h-5 w-full min-w-0 flex-wrap content-start items-start",
        "text-sm leading-5 font-normal [overflow-wrap:anywhere]",
        className,
      )}
      aria-live="polite"
    >
      {chars.map((entry) => (
        <span
          key={entry.id}
          data-slot="prompt-chatbar-ai-magic-char"
          className={cn(
            "text-tooltip-text inline-block whitespace-pre",
            // entry.state === "hidden" && "opacity-0",
            // entry.state === "pop" && "prompt-chatbar-magic-char-pop",
            // entry.state === "visible" && "opacity-100",
            // entry.state === "exit" && "prompt-chatbar-magic-char-exit",
          )}
          // style={{ "--magic-rotate": entry.rotation } as React.CSSProperties}
        >
          {entry.char}
        </span>
      ))}
    </div>
  );
}

export function PromptChatbarAiMagicText({
  text,
  mode,
  onComplete,
  className,
}: PromptChatbarAiMagicTextProps) {
  return (
    <PromptChatbarAiMagicTextContent
      key={`${mode}:${text}`}
      text={text}
      mode={mode}
      onComplete={onComplete}
      className={className}
    />
  );
}
