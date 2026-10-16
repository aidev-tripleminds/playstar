"use client";

import * as React from "react";

import { Badge } from "../../badge/badge";
import type { Tab } from "../tabs.types";

export function LinesTabs({ tabs }: { tabs: Tab[] }) {
  const [selected, setSelected] = React.useState(0);

  return (
    <div className="flex flex-col items-start gap-4">
      {tabs.map((tab, index) => {
        const isSelected = selected === index;

        return (
          <div
            key={index}
            onClick={() => setSelected(index)}
            className={`relative isolate flex w-fit cursor-pointer flex-col items-start justify-center gap-0.5 rounded-2xl px-4 py-2 transition-all duration-200 ${
              isSelected
                ? "bg-surface-strong text-tooltip-text border-tooltip-text border-[3px] shadow-[var(--toggle-thumb-shadow)]"
                : "bg-tooltip-default-bg text-divider-label border-[3px] border-transparent"
            }`}
          >
            <span className="absolute -top-3 left-1/2 z-1 flex -translate-x-1/2 items-center justify-center">
              <Badge showIcon={false} size={"small"} />
            </span>

            <span className="relative z-0 shrink-0 text-left text-[14px]! leading-5 font-medium">
              {tab.label}
            </span>

            <span className="relative z-2 shrink-0 text-left text-[16px]! leading-6 font-semibold">
              {tab.subLabel ?? tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
