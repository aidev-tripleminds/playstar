"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const STARTERS = ["Set the scene", "Flirt back", "Direct the next shot"] as const;

type ChatMessage = {
  id: string;
  role: "you" | "star";
  text: string;
};

const REPLIES = [
  "I'm here. Tell me the mood and I'll follow your lead.",
  "Noted. Want it slower, closer, or a little more daring?",
  "Say the line you want next and I'll stay in character.",
] as const;

export function StudioChatPanel({ className }: { className?: string }) {
  const [draft, setDraft] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "star",
      text: "Private chat is open. Start with a mood, a name, or one of the prompts below.",
    },
  ]);
  const replyIndex = React.useRef(0);
  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const reply = REPLIES[replyIndex.current % REPLIES.length];
    replyIndex.current += 1;

    setMessages((current) => [
      ...current,
      { id: `you-${current.length}`, role: "you", text: trimmed },
      { id: `star-${current.length}`, role: "star", text: reply },
    ]);
    setDraft("");
  };

  return (
    <section
      data-slot="studio-chat"
      className={cn(
        "border-border-strong bg-bg-secondary flex min-h-[420px] w-full min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] border",
        className,
      )}
    >
      <div className="border-border-strong flex items-center justify-between gap-3 border-b px-4 py-3">
        <div>
          <p className="text-tooltip-text text-sm font-semibold">Private chat</p>
          <p className="text-divider-label text-xs">A quiet thread, just for this session</p>
        </div>
        <span className="bg-brand-primary/15 text-rose-text rounded-full px-2 py-1 text-[11px] font-semibold">
          Live
        </span>
      </div>

      <div
        ref={listRef}
        className="scrollbar-hidden flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
      >
        {messages.map((message) => (
          <p
            key={message.id}
            className={cn(
              "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-5",
              message.role === "you"
                ? "bg-brand-primary text-white ml-auto rounded-br-md"
                : "bg-surface-strong text-tooltip-text rounded-bl-md",
            )}
          >
            {message.text}
          </p>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 px-4 pb-3">
        {STARTERS.map((starter) => (
          <button
            key={starter}
            type="button"
            onClick={() => send(starter)}
            className="border-border-strong text-tooltip-text hover:border-brand-primary hover:text-rose-text cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            {starter}
          </button>
        ))}
      </div>

      <form
        className="border-border-strong flex items-center gap-2 border-t p-3"
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Write a message..."
          aria-label="Message"
          className="bg-tooltip-default-bg text-tooltip-text placeholder:text-divider-label focus-visible:ring-brand-primary h-11 min-w-0 flex-1 rounded-full px-4 text-sm outline-none focus-visible:ring-2"
        />
        <button
          type="submit"
          className="bg-brand-primary hover:bg-rose-text h-11 cursor-pointer rounded-full px-4 text-sm font-semibold text-white transition-colors"
        >
          Send
        </button>
      </form>
    </section>
  );
}
