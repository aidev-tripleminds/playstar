"use client";

import { Close } from "@/components/common/general/close/close";
import { useBannerCrop } from "@/hooks/use-banner-crop";
import { AI_ADJUST_BANNER_ASPECT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { AiAdjustBannerPanelProps } from "@/types";

import { BannerControls } from "./banner-controls";
import { BannerCropper } from "./banner-cropper";

export function AiAdjustBannerPanel({
  imageSrc,
  aspect = AI_ADJUST_BANNER_ASPECT,
  title = "Adjust cover image",
  saveLabel = "Save changes",
  cancelLabel = "Cancel",
  zoomLabel = "Zoom",
  rotationLabel = "Rotation",
  onSave,
  onCancel,
  className,
}: AiAdjustBannerPanelProps) {
  const {
    crop,
    zoom,
    rotation,
    zoomSlider,
    rotationSlider,
    isSaving,
    canSave,
    setCrop,
    setZoomSlider,
    setRotationSlider,
    handleCropComplete,
    handleCancel,
    handleSave,
  } = useBannerCrop({ imageSrc, onSave, onCancel });

  return (
    <div
      data-slot="ai-adjust-banner-panel"
      className={cn(
        "border-surface-strong bg-dialog-bg text-tooltip-text flex w-full flex-col gap-4 rounded-[28px] border p-4",
        className,
      )}
    >
      <header className="flex items-center gap-2">
        <h2 className="text-select-text flex-1 text-left text-[18px] leading-7 font-medium">
          {title}
        </h2>
        <Close aria-label="Close" onClick={onCancel} size="medium" status="default" />
      </header>

      <BannerCropper
        imageSrc={imageSrc}
        crop={crop}
        zoom={zoom}
        rotation={rotation}
        aspect={aspect}
        onCropChange={setCrop}
        onCropComplete={handleCropComplete}
      />

      <BannerControls
        zoomSlider={zoomSlider}
        rotationSlider={rotationSlider}
        zoomLabel={zoomLabel}
        rotationLabel={rotationLabel}
        saveLabel={saveLabel}
        cancelLabel={cancelLabel}
        isSaving={isSaving}
        canSave={canSave}
        onZoomChange={setZoomSlider}
        onRotationChange={setRotationSlider}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
