"use client";

import * as React from "react";

import Tabs from "@/components/common/general/tabs/tabs";

import { GENERATE_LEFT_COLUMN_CLASS, GENERATE_SECTION_TABS } from "../_lib/constants";

type GenerateHeaderProps = {
  selectedSectionIndex: number;
  onSectionTabChange: (index: number) => void;
  toolbar?: React.ReactNode;
};

export function GenerateHeader({
  selectedSectionIndex,
  onSectionTabChange,
  toolbar,
}: GenerateHeaderProps) {
  return (
    <div
      data-slot="generate-header"
      className="flex w-full shrink-0 flex-wrap items-center gap-2 min-[768px]:flex-nowrap min-[768px]:gap-4"
    >
      <div className={toolbar ? GENERATE_LEFT_COLUMN_CLASS : undefined}>
        <Tabs
          variant="link"
          unstyled
          showTabIcon
          listLabel="Generate content"
          className="w-auto min-w-0 shrink-0 p-0!"
          tabs={GENERATE_SECTION_TABS.map(({ label, leftIconSrc }) => ({
            label,
            leftIconSrc,
            showBadge: false,
          }))}
          selected={selectedSectionIndex}
          onChange={onSectionTabChange}
        />
      </div>

      {toolbar}
    </div>
  );
}
