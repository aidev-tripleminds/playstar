"use client";

import { CircleHelp } from "lucide-react";
import * as React from "react";

import { Badge } from "../../badge/badge";
import type { Tab } from "../tabs.types";

export function UnderlinedTabs({ tabs }: { tabs: Tab[] }) {
  const [selected, setSelected] = React.useState(0);

  return (
    <div className="flex flex-col items-start gap-4">
      {tabs.map((tab, index) => {
        const isSelected = selected === index;

        return (
          <div
            key={index}
            onClick={() => setSelected(index)}
            className={`flex cursor-pointer flex-col items-center justify-center gap-2.5 self-stretch pt-3 transition-colors duration-200 ${isSelected ? "text-tooltip-text" : "text-select-muted-text border-surface-strong border-b"}`}
          >
            <div className="flex items-center justify-center gap-2 rounded-xl px-3">
              <CircleHelp className="size-5 shrink-0 text-current" />
              <span className="leading-5 font-medium">{tab.label}</span>
              <Badge showIcon={false} size={"medium"} />
            </div>
            <div
              className={`h-0.5 self-stretch rounded-t-[1000px] transition-colors duration-200 ${isSelected ? "bg-tooltip-text" : "bg-transparent"}`}
            />
          </div>
        );
      })}
    </div>
  );
}
