"use client";

import { Buttons } from "@/components/common/general/button/buttons";
import { Slider } from "@/components/common/general/slider/slider";

import { INITIAL_SLIDER_VALUE } from "../../../../../lib/constants";
import { sliderToRotation, sliderToZoom } from "../../../../../lib/crop-math";

type BannerControlsProps = {
  zoomSlider: number;
  rotationSlider: number;
  zoomLabel: string;
  rotationLabel: string;
  saveLabel: string;
  cancelLabel: string;
  isSaving: boolean;
  canSave: boolean;
  onZoomChange: (value: number) => void;
  onRotationChange: (value: number) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function BannerControls({
  zoomSlider,
  rotationSlider,
  zoomLabel,
  rotationLabel,
  saveLabel,
  cancelLabel,
  isSaving,
  canSave,
  onZoomChange,
  onRotationChange,
  onSave,
  onCancel,
}: BannerControlsProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
      <div className="flex flex-col md:min-w-0 md:flex-1 md:flex-row md:gap-4">
        <Slider
          min={0}
          max={100}
          showFlexCol={false}
          showMaxlabel={false}
          showSliderValue={false}
          value={zoomSlider}
          defaultValue={INITIAL_SLIDER_VALUE}
          minLabel={zoomLabel}
          maxLabel="100"
          formatValueLabel={(value) => `${Math.round(sliderToZoom(value) * 100) / 100}x`}
          onValueChange={onZoomChange}
          className="min-w-0 flex-1 px-0 pt-2 pb-0 md:max-w-[223px]"
        />
        <Slider
          min={0}
          max={100}
          showFlexCol={false}
          showMaxlabel={false}
          showSliderValue={false}
          value={rotationSlider}
          defaultValue={INITIAL_SLIDER_VALUE}
          minLabel={rotationLabel}
          maxLabel="360"
          formatValueLabel={(value) => `${Math.round(sliderToRotation(value))}°`}
          onValueChange={onRotationChange}
          className="min-w-0 flex-1 px-0 pt-2 pb-0 md:max-w-[223px]"
        />
      </div>

      <div className="flex flex-col-reverse gap-2 md:shrink-0 md:flex-row md:gap-2">
        <Buttons
          type="button"
          variant="neutral"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={cancelLabel}
          onClick={onCancel}
          className="w-full md:w-fit"
        />
        <Buttons
          type="button"
          variant="rose"
          size="btn-m"
          leftIcon={false}
          rightIcon={false}
          label={saveLabel}
          onClick={onSave}
          disabled={isSaving || !canSave}
          className="w-full md:w-fit"
        />
      </div>
    </div>
  );
}
