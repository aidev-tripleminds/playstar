"use client";

import * as React from "react";

import { Buttons } from "@/components/common/general/button/buttons";
import {
  INNER_MODAL_LAYOUT_OVERLAY_CLASSNAME,
  ModalLayout,
} from "@/components/common/general/modal-layout/modal-layout";
import { Slider } from "@/components/common/general/slider/slider";
import { DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  formatGenerateTemplateDuration,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_APPLY_LABEL,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_DEFAULTS,
  GENERATE_TEMPLATE_ADVANCED_SETTINGS_DURATION_ICON_SRC,
  GENERATE_TEMPLATE_DURATION_MAX_SECONDS,
  GENERATE_TEMPLATE_DURATION_MIN_SECONDS,
  GENERATE_TEMPLATE_DURATION_MODAL_TITLE,
  GENERATE_TEMPLATE_SETTINGS_PICKER_CLASS,
  GENERATE_TEMPLATE_SETTINGS_PICKER_OVERLAY_CLASS,
  parseGenerateTemplateDurationSeconds,
} from "../_lib/generate-templates";

export type GenerateTemplateDurationModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function GenerateTemplateDurationModal({
  open = false,
  onOpenChange,
  value = GENERATE_TEMPLATE_ADVANCED_SETTINGS_DEFAULTS.duration,
  onValueChange,
  className,
}: GenerateTemplateDurationModalProps) {
  const [draft, setDraft] = React.useState(value);
  const [prevOpen, setPrevOpen] = React.useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setDraft(value);
    }
  }

  const durationSeconds = parseGenerateTemplateDurationSeconds(draft);

  const handleApply = React.useCallback(() => {
    onValueChange?.(draft);
    onOpenChange?.(false);
  }, [draft, onOpenChange, onValueChange]);

  return (
    <ModalLayout
      open={open}
      onOpenChange={onOpenChange}
      title={GENERATE_TEMPLATE_DURATION_MODAL_TITLE}
      titleIconSrc={GENERATE_TEMPLATE_ADVANCED_SETTINGS_DURATION_ICON_SRC}
      showIcon
      showMobileHandle
      overlayClassName={cn(
        INNER_MODAL_LAYOUT_OVERLAY_CLASSNAME,
        GENERATE_TEMPLATE_SETTINGS_PICKER_OVERLAY_CLASS,
      )}
      closeLabel="Close duration"
      className={cn(GENERATE_TEMPLATE_SETTINGS_PICKER_CLASS, className)}
    >
      <div data-slot="generate-template-duration-modal" className="flex w-full flex-col gap-8">
        <DialogDescription className="sr-only">Choose a video duration.</DialogDescription>
        <div className="flex w-full flex-col">
          <div className="text-tooltip-text flex w-full items-center justify-between pb-3 text-sm leading-5 font-medium">
            <p>{GENERATE_TEMPLATE_DURATION_MODAL_TITLE}</p>
            <span>{formatGenerateTemplateDuration(durationSeconds)}</span>
          </div>
          <Slider
            min={GENERATE_TEMPLATE_DURATION_MIN_SECONDS}
            max={GENERATE_TEMPLATE_DURATION_MAX_SECONDS}
            step={1}
            value={durationSeconds}
            onValueChange={(nextSeconds) => setDraft(formatGenerateTemplateDuration(nextSeconds))}
            minLabel={`${GENERATE_TEMPLATE_DURATION_MIN_SECONDS}s`}
            maxLabel={`${GENERATE_TEMPLATE_DURATION_MAX_SECONDS}s`}
            minLabelSuffix=""
            showSliderValue={false}
            formatValueLabel={formatGenerateTemplateDuration}
            aria-label={GENERATE_TEMPLATE_DURATION_MODAL_TITLE}
            className="flex-col-reverse gap-2 px-0 pt-0 pb-0"
          />
        </div>
        <Buttons
          type="button"
          variant="rose"
          size="btn-m"
          label={GENERATE_TEMPLATE_ADVANCED_SETTINGS_APPLY_LABEL}
          leftIcon={false}
          rightIcon={false}
          onClick={handleApply}
          className="w-full"
        />
      </div>
    </ModalLayout>
  );
}
