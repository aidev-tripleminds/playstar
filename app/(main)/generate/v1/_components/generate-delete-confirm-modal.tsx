"use client";

import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { cn } from "@/lib/utils";

import {
  formatGenerateDeleteConfirmLabel,
  GENERATE_DELETE_CANCEL_LABEL,
  GENERATE_DELETE_CONFIRM_DESCRIPTION,
  GENERATE_DELETE_CONFIRM_TITLE,
} from "../_lib/constants";

type GenerateDeleteConfirmModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectedCount?: number;
  onConfirm?: () => void;
};

export function GenerateDeleteConfirmModal({
  open = false,
  onOpenChange,
  selectedCount = 0,
  onConfirm,
}: GenerateDeleteConfirmModalProps) {
  return (
    <ModalLayout
      className="z-99!"
      open={open}
      onOpenChange={onOpenChange}
      title={GENERATE_DELETE_CONFIRM_TITLE}
      titleIconSrc="/assets/alert-icon.svg"
      showIcon
      showMobileHandle
      description={GENERATE_DELETE_CONFIRM_DESCRIPTION}
      generateLabel={formatGenerateDeleteConfirmLabel(selectedCount)}
      cancelLabel={GENERATE_DELETE_CANCEL_LABEL}
      closeLabel="Close delete confirmation"
      onGenerate={() => {
        onConfirm?.();
        onOpenChange?.(false);
      }}
      onCancel={() => onOpenChange?.(false)}
      overlayClassName={cn(MODAL_LAYOUT_OVERLAY_CLASSNAME, "z-95!")}
    />
  );
}
