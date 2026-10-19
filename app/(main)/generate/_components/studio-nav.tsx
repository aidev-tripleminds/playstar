"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export const STUDIO_TABS = [
  { id: "explore", label: "Explore" },
  { id: "chat", label: "Chat" },
  { id: "mini-movie", label: "Mini-Movie", badge: "New" },
  { id: "cum-shorts", label: "Cum-Shorts", badge: "New" },
  { id: "collection", label: "My Collection" },
] as const;

export type StudioTabId = (typeof STUDIO_TABS)[number]["id"];

type StudioNavProps = {
  value: StudioTabId;
  onChange: (tab: StudioTabId) => void;
  className?: string;
};

export function StudioNav({ value, onChange, className }: StudioNavProps) {
  return (
    <div
      data-slot="studio-nav"
      className={cn("border-border-strong w-full shrink-0 border-b", className)}
    >
      <div
        role="tablist"
        aria-label="Studio"
        className="scrollbar-hidden -mb-px flex w-full items-end gap-1 overflow-x-auto overscroll-x-contain"
      >
        {STUDIO_TABS.map((tab) => {
          const selected = tab.id === value;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative shrink-0 cursor-pointer px-3 pt-1 pb-3 text-[15px] leading-5 font-medium tracking-[-0.01em] transition-colors duration-200",
                "focus-visible:ring-brand-primary rounded-t-md outline-none focus-visible:ring-2",
                selected ? "text-tooltip-text" : "text-divider-label hover:text-hover-text",
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                {tab.label}
                {"badge" in tab && tab.badge ? (
                  <span className="bg-[image:linear-gradient(180deg,#ffe08a_0%,#ffb020_40%,#ff4d6a_100%)] inline-flex translate-y-[-1px] rounded-full px-1.5 py-0.5 text-[9px] leading-none font-bold tracking-[0.04em] text-[#2a120c] uppercase">
                    {tab.badge}
                  </span>
                ) : null}
              </span>
              <span
                aria-hidden
                className={cn(
                  "bg-brand-primary absolute inset-x-3 -bottom-px h-[2px] rounded-full transition-opacity duration-200",
                  selected ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
