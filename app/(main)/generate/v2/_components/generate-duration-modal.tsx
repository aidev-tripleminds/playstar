"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import {
  MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  GENERATE_ADVANCED_SETTINGS_DURATION_ICON_SRC,
  GENERATE_DEFAULT_DURATION,
  GENERATE_DURATION_APPLY_LABEL,
  GENERATE_DURATION_MODAL_TITLE,
  GENERATE_MOBILE_DRAWER_FIT_CLASS,
} from "../_lib/constants";
import { GenerateDurationSlider } from "./generate-duration-slider";

export type GenerateDurationModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function GenerateDurationModal({
  open = false,
  onOpenChange,
  value = GENERATE_DEFAULT_DURATION,
  onValueChange,
  className,
}: GenerateDurationModalProps) {
  const [draft, setDraft] = React.useState(value);
  const [prevOpen, setPrevOpen] = React.useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setDraft(value);
    }
  }

  const handleApply = React.useCallback(() => {
    onValueChange?.(draft);
    onOpenChange?.(false);
  }, [draft, onOpenChange, onValueChange]);

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={GENERATE_DURATION_MODAL_TITLE}
      titleIconSrc={GENERATE_ADVANCED_SETTINGS_DURATION_ICON_SRC}
      showIcon
      showMobileHandle
      overlayClassName={cn(MODAL_LAYOUT_OVERLAY_CLASSNAME, "z-1000")}
      closeLabel="Close duration"
      className={cn("z-1000", GENERATE_MOBILE_DRAWER_FIT_CLASS, className)}
    >
      <div data-slot="generate-duration-modal" className="flex w-full flex-col gap-8">
        <DialogDescription className="sr-only">Choose a video duration.</DialogDescription>
        <GenerateDurationSlider value={draft} onValueChange={setDraft} />
        <Buttons
          type="button"
          variant="rose"
          size="btn-m"
          label={GENERATE_DURATION_APPLY_LABEL}
          leftIcon={false}
          rightIcon={false}
          onClick={handleApply}
          className="w-full"
        />
      </div>
    </ModalLayout>
  );
}
