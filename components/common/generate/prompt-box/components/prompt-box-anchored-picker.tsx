"use client";

import type * as React from "react";

import { AnchoredMenuPortal } from "@/components/common/general/anchored-menu-portal";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { OPTION_LIST_SURFACE_CLASSNAME } from "@/components/common/general/option-list/option-list";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type PromptBoxAnchoredPickerProps = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
  isMenuOpen: boolean;
  isModalOpen: boolean;
  onOpenChange: (open: boolean) => void;
  pickerSlot: string;
  dropdownSlot: string;
  modalSlot: string;
  dropdownClassName: string;
  horizontalAlign?: "left" | "right";
  modalTitle: string;
  modalIconSrc: string;
  modalDescription: string;
  className?: string;
  trigger: React.ReactNode;
  dropdown: React.ReactNode;
  modal: React.ReactNode;
};

export function PromptBoxAnchoredPicker({
  containerRef,
  menuRef,
  isMenuOpen,
  isModalOpen,
  onOpenChange,
  pickerSlot,
  dropdownSlot,
  modalSlot,
  dropdownClassName,
  horizontalAlign = "left",
  modalTitle,
  modalIconSrc,
  modalDescription,
  className,
  trigger,
  dropdown,
  modal,
}: PromptBoxAnchoredPickerProps) {
  return (
    <>
      <div ref={containerRef} data-slot={pickerSlot} className={cn("relative shrink-0", className)}>
        {trigger}

        <AnchoredMenuPortal
          open={isMenuOpen}
          anchorRef={containerRef}
          menuRef={menuRef}
          horizontalAlign={horizontalAlign}
          slot={dropdownSlot}
        >
          <section
            className={cn(
              OPTION_LIST_SURFACE_CLASSNAME,
              "flex max-h-[inherit] min-h-0 flex-1 flex-col overflow-hidden",
              dropdownClassName,
            )}
          >
            {dropdown}
          </section>
        </AnchoredMenuPortal>
      </div>

      {isModalOpen ? (
        <ModalLayout
          open
          onOpenChange={onOpenChange}
          title={modalTitle}
          titleIconSrc={modalIconSrc}
          showIcon
          showMobileHandle
          overlayClassName={MODAL_LAYOUT_OVERLAY_CLASSNAME}
          closeLabel={`Close ${modalTitle}`}
          className={cn(
            "scrollbar-hidden! z-1000 flex! max-h-[min(496px,calc(100dvh-1rem))]! flex-col overflow-hidden",
            "data-[vaul-drawer-direction=bottom]:h-fit! data-[vaul-drawer-direction=bottom]:max-h-[min(496px,calc(100dvh-1rem))]!",
          )}
          innerClassName="flex min-h-0 flex-col gap-4 overflow-hidden"
        >
          <div data-slot={modalSlot} className="flex min-h-0 w-full flex-col overflow-hidden">
            <DialogDescription className="sr-only">{modalDescription}</DialogDescription>
            <div
              data-slot={`${modalSlot}-scroll`}
              className="custom-scrollbar min-h-0 overflow-y-auto overscroll-contain"
            >
              {modal}
            </div>
          </div>
        </ModalLayout>
      ) : null}
    </>
  );
}
