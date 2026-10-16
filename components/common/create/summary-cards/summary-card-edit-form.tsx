"use client";

import { Buttons } from "@/components/common/general/button/buttons";
import { TextArea } from "@/components/common/general/text-area/text-area";
import { TextInput } from "@/components/common/general/text-input/text-input";

import { SUMMARY_CARD_EDIT, SUMMARY_CARD_EDIT_BIO_CLASSNAME } from "./summary-card-edit.constants";

export type SummaryCardEditFormProps = {
  name: string;
  bio: string;
  onNameChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onSave: () => void;
};

export function SummaryCardEditForm({
  name,
  bio,
  onNameChange,
  onBioChange,
  onSave,
}: SummaryCardEditFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-tooltip-text text-sm">{SUMMARY_CARD_EDIT.nameLabel}</p>
        <TextInput
          showLeftIcon={false}
          className="w-full!"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-tooltip-text text-sm">{SUMMARY_CARD_EDIT.bioLabel}</p>
        <TextArea
          showLeftIcon={false}
          className={SUMMARY_CARD_EDIT_BIO_CLASSNAME}
          placeholder={SUMMARY_CARD_EDIT.bioPlaceholder}
          value={bio}
          rows={2}
          onChange={(event) => onBioChange(event.target.value)}
        />
      </div>
      <Buttons
        type="button"
        label={SUMMARY_CARD_EDIT.saveLabel}
        variant="rose"
        className="w-full"
        leftIcon={false}
        rightIcon={false}
        onClick={onSave}
      />
    </div>
  );
}
