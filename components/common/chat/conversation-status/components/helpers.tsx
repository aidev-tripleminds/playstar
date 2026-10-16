import { cva } from "class-variance-authority";
import Image from "next/image";

import type { ConversationStatusState } from "./constants";

const previewVariants = cva("block w-full truncate text-[12px] leading-4 font-medium", {
  variants: {
    status: {
      default: "text-divider-label",
      focus: "text-divider-label",
      unread: "text-tooltip-text",
      pinned: "text-divider-label",
      group: "text-divider-label",
      radio: "text-divider-label",
      memory: "text-divider-label",
    },
  },
  defaultVariants: {
    status: "default",
  },
});

function ConversationAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <span className="bg-border-strong relative size-11 shrink-0 overflow-hidden rounded-xl">
      {src ? <Image src={src} alt={alt} fill sizes="44px" className="object-cover" /> : null}
    </span>
  );
}

function UnreadIndicator() {
  return (
    <span
      aria-hidden
      data-slot="conversation-status-unread"
      className="size-2 shrink-0 rounded-full bg-[image:var(--gradient-rose)]"
    />
  );
}

function isPointerMovingToTarget(
  currentTarget: EventTarget & Element,
  relatedTarget: EventTarget | null,
) {
  return relatedTarget instanceof Node && currentTarget.contains(relatedTarget);
}

function buildRowAriaLabel(name: string, status: ConversationStatusState, customLabel?: string) {
  if (customLabel) return customLabel;

  const parts = [name];
  if (status === "unread") parts.push("unread");
  if (status === "pinned") parts.push("pinned");
  if (status === "focus") parts.push("selected");
  if (status === "memory") parts.push("memory");
  return parts.join(", ");
}

export {
  buildRowAriaLabel,
  ConversationAvatar,
  isPointerMovingToTarget,
  previewVariants,
  UnreadIndicator,
};
