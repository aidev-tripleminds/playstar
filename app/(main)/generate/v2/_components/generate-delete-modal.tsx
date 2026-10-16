"use client";

import { Buttons } from "@/components/common/general/button/buttons";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { Spinner } from "@/components/common/general/spinner";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  formatGenerateDeleteConfirmLabel,
  GENERATE_DELETE_CANCEL_LABEL,
  GENERATE_DELETE_CONFIRM_DESCRIPTION,
  GENERATE_DELETE_CONFIRM_TITLE,
} from "../_lib/constants";

type GenerateDeleteModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectedCount?: number;
  /** Preview can only remove the open slide, so the confirm reads "Delete". */
  singleItem?: boolean;
  isDeleting?: boolean;
  onConfirm?: () => void;
};

export function GenerateDeleteModal({
  open = false,
  onOpenChange,
  selectedCount = 0,
  singleItem = false,
  isDeleting = false,
  onConfirm,
}: GenerateDeleteModalProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (isDeleting && !nextOpen) return;
    onOpenChange?.(nextOpen);
  };

  return (
    <ModalLayout
      className="z-200!"
      open={open}
      onOpenChange={handleOpenChange}
      title={GENERATE_DELETE_CONFIRM_TITLE}
      titleIconSrc="/assets/alert-icon.svg"
      showIcon
      showMobileHandle
      closeLabel="Close delete confirmation"
      onClose={() => handleOpenChange(false)}
      overlayClassName={cn(MODAL_LAYOUT_OVERLAY_CLASSNAME, "z-190!")}
      dismissOnOutsideClick={!isDeleting}
    >
      <div className="flex flex-col gap-4">
        <DialogDescription className="text-modal-text text-left text-[14px]! leading-5 font-normal">
          {GENERATE_DELETE_CONFIRM_DESCRIPTION}
        </DialogDescription>

        <div className="flex flex-col gap-2">
          <Buttons
            variant="rose"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={formatGenerateDeleteConfirmLabel(selectedCount, { singleItem })}
            leftIconNode={isDeleting ? <Spinner className="size-4" /> : undefined}
            onClick={() => {
              if (isDeleting) return;
              onConfirm?.();
            }}
            className="w-full"
            disabled={isDeleting}
            aria-busy={isDeleting || undefined}
          />
          <Buttons
            variant="neutral"
            size="btn-m"
            leftIcon={false}
            rightIcon={false}
            label={GENERATE_DELETE_CANCEL_LABEL}
            onClick={() => handleOpenChange(false)}
            className="w-full"
            disabled={isDeleting}
          />
        </div>
      </div>
    </ModalLayout>
  );
}
