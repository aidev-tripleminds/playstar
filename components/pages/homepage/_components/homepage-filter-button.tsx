"use client";

import { Dropdown } from "@/components/common/general/dropdown/dropdown";

import type { HomepageFilter } from "../_lib/types";

export function HomepageFilterButton({
  filter,
  value,
  onValueChange,
}: {
  filter: HomepageFilter;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <div data-slot="homepage-filter" className="shrink-0">
      <Dropdown
        label={filter.label}
        value={value}
        options={[...filter.options]}
        onValueChange={onValueChange}
        showLeftIcon={filter.showLeftIcon ?? false}
        widthMode="content"
        containerClassName="w-auto"
        className="w-auto"
      />
    </div>
  );
}
