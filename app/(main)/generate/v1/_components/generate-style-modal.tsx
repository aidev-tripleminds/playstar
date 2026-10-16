"use client";

import * as React from "react";

import Tabs from "@/components/common/general/tabs/tabs";
import { CheckpointSelector } from "@/components/common/generate/checkpoint-selector";
import { ForbiddenIcon } from "@/public/assets/icons";

import {
  GENERATE_ADVANCED_SETTINGS_STYLE_ICON_SRC,
  GENERATE_EDIT_IMAGE_STYLE_GROUP_LABEL,
  GENERATE_STYLE_MODAL_TITLE,
  GENERATE_STYLE_TABS,
  GENERATE_VIDEO_STYLE_GROUP_LABEL,
  type GenerateStyleMode,
  type GenerateStyleTabId,
  getGenerateStyleOptionsByTab,
  getGenerateStyleOptionsForMode,
  getGenerateStyleTabForValue,
} from "../_lib/constants";
import {
  GenerateSettingsPickerModal,
  type GenerateSettingsPickerModalProps,
} from "./generate-settings-picker-modal";

export type GenerateStyleModalProps = Omit<
  GenerateSettingsPickerModalProps,
  | "title"
  | "titleIconSrc"
  | "closeLabel"
  | "description"
  | "options"
  | "header"
  | "footer"
  | "listClassName"
  | "groupLabel"
> & {
  mode?: GenerateStyleMode;
};

export function GenerateStyleModal({
  open = false,
  value,
  onValueChange,
  onOpenChange,
  closeOnSelect = true,
  mode = "create",
  className,
  inline,
  ...props
}: GenerateStyleModalProps) {
  const isEditImage = mode === "edit-image";
  const isVideo = mode === "video";
  const committedValue = value ?? "";
  const [selectedTab, setSelectedTab] = React.useState<GenerateStyleTabId>(
    getGenerateStyleTabForValue(committedValue, mode),
  );
  const [prevOpen, setPrevOpen] = React.useState(open);
  const [prevCommittedValue, setPrevCommittedValue] = React.useState(committedValue);

  // Reset the visible tab while rendering when the picker opens or the committed style changes.
  // See https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (open !== prevOpen || committedValue !== prevCommittedValue) {
    setPrevOpen(open);
    setPrevCommittedValue(committedValue);
    if (open && !isEditImage) {
      setSelectedTab(getGenerateStyleTabForValue(committedValue, mode));
    }
  }

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      onValueChange?.(nextValue);
      if (closeOnSelect) {
        onOpenChange?.(false);
      }
    },
    [closeOnSelect, onOpenChange, onValueChange],
  );

  const styleOptions = isEditImage
    ? getGenerateStyleOptionsForMode("edit-image")
    : getGenerateStyleOptionsByTab(selectedTab, mode);

  return (
    <GenerateSettingsPickerModal
      open={open}
      title={GENERATE_STYLE_MODAL_TITLE}
      titleIconSrc={GENERATE_ADVANCED_SETTINGS_STYLE_ICON_SRC}
      closeLabel="Close style"
      description="Choose a style."
      value={value}
      onValueChange={onValueChange}
      onOpenChange={onOpenChange}
      closeOnSelect={closeOnSelect}
      inline={inline}
      groupLabel=""
      className={className}
      header={
        isEditImage ? undefined : (
          <div className="flex flex-col">
            {isVideo ? (
              <p className="text-divider-label px-3 py-1 text-sm leading-5 font-normal">
                {GENERATE_VIDEO_STYLE_GROUP_LABEL}
              </p>
            ) : null}
            <Tabs
              variant="compact"
              compactLayout="segmented"
              unstyled
              showTabIcon
              tabs={GENERATE_STYLE_TABS.map(({ label }) => ({
                label,
                leftIconSrc: <ForbiddenIcon />,
                showBadge: false,
              }))}
              selected={GENERATE_STYLE_TABS.findIndex((tab) => tab.id === selectedTab)}
              onChange={(index) => {
                const tab = GENERATE_STYLE_TABS[index];
                if (tab) {
                  setSelectedTab(tab.id);
                }
              }}
            />
          </div>
        )
      }
      {...props}
    >
      <div className="flex w-full flex-col gap-0.5">
        {isEditImage ? (
          <p className="text-divider-label px-3 py-1 text-sm leading-5 font-normal">
            {GENERATE_EDIT_IMAGE_STYLE_GROUP_LABEL}
          </p>
        ) : null}
        <div
          role="radiogroup"
          aria-label={GENERATE_STYLE_MODAL_TITLE}
          className="flex w-full flex-col gap-0.5"
        >
          {styleOptions.map((option) => {
            const isSelected = committedValue === option.value;

            return (
              <CheckpointSelector
                key={option.value}
                role="radio"
                aria-checked={isSelected}
                aria-pressed={undefined}
                name={option.label}
                description={option.description}
                tokenCost={option.tokenCost}
                checkpointVariant={option.checkpointVariant}
                selected={isSelected}
                showUnlimitedBadge={option.showUnlimitedBadge}
                onSelectedChange={() => {
                  handleValueChange(option.value);
                }}
                className="w-full max-w-none"
              />
            );
          })}
        </div>
      </div>
    </GenerateSettingsPickerModal>
  );
}
