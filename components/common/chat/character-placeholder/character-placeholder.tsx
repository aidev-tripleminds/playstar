import * as React from "react";

import { cn } from "@/lib/utils";
import { UserAIIcon } from "@/public/assets/icons";

export type CharacterPlaceholderProps = Omit<React.ComponentProps<"button">, "children"> & {
  label?: string;
};

export function CharacterPlaceholder({
  label = "Select an AI",
  className,
  type = "button",
  ...props
}: CharacterPlaceholderProps) {
  return (
    <button
      type={type}
      data-slot="character-placeholder"
      className={cn(
        "relative h-50 w-full max-w-40 cursor-pointer",
        "flex flex-col items-center justify-center gap-1 px-0 py-2",
        "border-border-control rounded-[24px] border-2 border-dashed",
        "bg-[image:var(--gradient-chat-overlay)]",
        "text-divider-label text-left text-base leading-6",
        "focus-visible:ring-border-control transition-colors focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      <UserAIIcon className="size-10 shrink-0 object-cover" aria-hidden />
      <span className="relative leading-6">{label}</span>
    </button>
  );
}
