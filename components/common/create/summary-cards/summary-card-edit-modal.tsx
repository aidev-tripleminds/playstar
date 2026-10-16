"use client";

import * as React from "react";

import { ModalLayout } from "@/components/common/general/modal-layout/modal-layout";
import { cn } from "@/lib/utils";

import {
  SUMMARY_CARD_EDIT,
  SUMMARY_CARD_EDIT_MODAL_SHELL_CLASSNAME,
} from "./summary-card-edit.constants";
import { SummaryCardEditForm, type SummaryCardEditFormProps } from "./summary-card-edit-form";

type SummaryCardEditModalProps = SummaryCardEditFormProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SummaryCardEditModal({
  open,
  onOpenChange,
  onSave,
  ...formProps
}: SummaryCardEditModalProps) {
  const handleClose = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSave = React.useCallback(() => {
    onSave();
    onOpenChange(false);
  }, [onOpenChange, onSave]);

  return (
    <ModalLayout
      className={cn("md:max-w-[650px]", SUMMARY_CARD_EDIT_MODAL_SHELL_CLASSNAME)}
      open={open}
      dismissOnOutsideClick={false}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
      title={SUMMARY_CARD_EDIT.title}
      titleIconSrc={SUMMARY_CARD_EDIT.titleIconSrc}
      showIcon
      showMobileHandle
      closeLabel={SUMMARY_CARD_EDIT.closeLabel}
      closeClassName="bg-tooltip-default-bg text-modal-text hover:bg-tooltip-default-bg hover:text-tooltip-text"
      onClose={handleClose}
    >
      <SummaryCardEditForm {...formProps} onSave={handleSave} />
    </ModalLayout>
  );
}
