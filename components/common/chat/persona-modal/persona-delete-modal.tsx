"use client";

import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";

import {
  PERSONA_DELETE_CANCEL_LABEL,
  PERSONA_DELETE_CONFIRM_DESCRIPTION,
  PERSONA_DELETE_CONFIRM_LABEL,
  PERSONA_DELETE_CONFIRM_TITLE,
} from "./persona-modal.constants";

export type PersonaDeleteModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
};

export function PersonaDeleteModal({
  open = false,
  onOpenChange,
  onConfirm,
}: PersonaDeleteModalProps) {
  return (
    <ModalLayout
      className="z-99!"
      open={open}
      onOpenChange={onOpenChange}
      title={PERSONA_DELETE_CONFIRM_TITLE}
      titleIconSrc="/assets/alert-icon.svg"
      showIcon
      showMobileHandle
      description={PERSONA_DELETE_CONFIRM_DESCRIPTION}
      generateLabel={PERSONA_DELETE_CONFIRM_LABEL}
      cancelLabel={PERSONA_DELETE_CANCEL_LABEL}
      closeLabel="Close delete confirmation"
      onGenerate={() => {
        onConfirm?.();
        onOpenChange?.(false);
      }}
      onCancel={() => onOpenChange?.(false)}
      overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
    />
  );
}
