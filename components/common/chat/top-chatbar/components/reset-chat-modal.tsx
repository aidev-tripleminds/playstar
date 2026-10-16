"use client";

import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";

export const RESET_CHAT_CONFIRM_TITLE = "Are you sure?";

export const RESET_CHAT_CONFIRM_DESCRIPTION =
  "You’re about to reset this chat. If you proceed, you won’t be able to restore it.";

export const RESET_CHAT_CONFIRM_LABEL = "Reset";

export const RESET_CHAT_CANCEL_LABEL = "Cancel";

export type ResetChatModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
};

export function ResetChatModal({ open = false, onOpenChange, onConfirm }: ResetChatModalProps) {
  return (
    <ModalLayout
      className="z-99!"
      open={open}
      onOpenChange={onOpenChange}
      title={RESET_CHAT_CONFIRM_TITLE}
      titleIconSrc="/assets/alert-icon.svg"
      showIcon
      showMobileHandle
      description={RESET_CHAT_CONFIRM_DESCRIPTION}
      generateLabel={RESET_CHAT_CONFIRM_LABEL}
      cancelLabel={RESET_CHAT_CANCEL_LABEL}
      closeLabel="Close reset confirmation"
      onGenerate={() => {
        onConfirm?.();
        onOpenChange?.(false);
      }}
      onCancel={() => onOpenChange?.(false)}
      overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
    />
  );
}
