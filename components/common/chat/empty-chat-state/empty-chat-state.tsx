import Image from "next/image";
import * as React from "react";

import { ConversationStarter } from "@/components/common/chat/conversation-starter/conversation-starter";
import { cn } from "@/lib/utils";

import {
  DEFAULT_EMPTY_CHAT_STARTERS,
  EMPTY_CHAT_STATE_SUBTITLE,
  type EmptyChatStarter,
  emptyChatTitle,
} from "./constants";

export type EmptyChatStateProps = Omit<React.ComponentProps<"div">, "children"> & {
  characterName: string;
  avatarSrc: string;
  starters?: readonly EmptyChatStarter[];
  onStarterClick?: (starter: EmptyChatStarter) => void;
};

export function EmptyChatState({
  characterName,
  avatarSrc,
  starters = DEFAULT_EMPTY_CHAT_STARTERS,
  onStarterClick,
  className,
  ...props
}: EmptyChatStateProps) {
  return (
    <div
      data-slot="empty-chat-state"
      className={cn(
        "mx-auto flex w-full max-w-[700px] flex-1 flex-col items-center justify-center gap-4 px-4 py-5",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 flex w-full flex-col items-center gap-8">
        <div className="rotate-[3.9deg]">
          <div
            className={cn(
              "border-tooltip-text/70 bg-border-strong relative h-[147px] w-[113px] shrink-0 overflow-hidden rounded-2xl border-[2.4px]",
              "shadow-[0_0_16px_rgba(0,0,0,0.5)]",
              "translate-y-0 scale-100",
              // "transition-[translate,scale,border-color,box-shadow] duration-500",
              // "ease-[cubic-bezier(0.22,1,0.36,1)]",
              // "hover:border-tooltip-text hover:-translate-y-2 hover:scale-[1.04]",
              // "hover:shadow-[0_12px_28px_rgba(0,0,0,0.55)]",
              // "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100",
            )}
          >
            {avatarSrc ? (
              <Image src={avatarSrc} alt="" fill sizes="113px" className="object-cover" />
            ) : null}
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-2 text-center">
          <h2 className="text-tooltip-text text-2xl leading-8 font-bold">
            {emptyChatTitle(characterName)}
          </h2>
          <p className="text-divider-label w-full text-lg leading-7 font-medium">
            {EMPTY_CHAT_STATE_SUBTITLE}
          </p>
        </div>

        <div
          data-slot="empty-chat-starters"
          className="grid w-full grid-cols-1 gap-2 sm:grid-flow-col sm:grid-cols-none sm:grid-rows-2"
        >
          {starters.map((starter) => (
            <ConversationStarter
              key={starter.id}
              badgeText={starter.badgeText}
              message={starter.message}
              contentType={starter.contentType}
              onClick={() => onStarterClick?.(starter)}
              className="h-full max-w-none cursor-pointer"
              aria-label={`Start conversation: ${starter.message}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export {
  DEFAULT_EMPTY_CHAT_STARTERS,
  EMPTY_CHAT_STATE_SUBTITLE,
  type EmptyChatStarter,
  emptyChatTitle,
} from "./constants";
