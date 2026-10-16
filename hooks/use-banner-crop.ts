"use client";

import * as React from "react";
import type { Area, Point } from "react-easy-crop";

import { INITIAL_CROP, INITIAL_SLIDER_VALUE } from "../lib/constants";
import { sliderToRotation, sliderToZoom } from "../lib/crop-math";
import { getCroppedImageBlob } from "../lib/get-cropped-image";
import type { AiAdjustBannerCropResult } from "../types";

type UseBannerCropOptions = {
  imageSrc: string;
  onSave?: (result: AiAdjustBannerCropResult) => void | Promise<void>;
  onCancel?: () => void;
};

export function useBannerCrop({ imageSrc, onSave, onCancel }: UseBannerCropOptions) {
  const [crop, setCrop] = React.useState<Point>(INITIAL_CROP);
  const [zoomSlider, setZoomSlider] = React.useState(INITIAL_SLIDER_VALUE);
  const [rotationSlider, setRotationSlider] = React.useState(INITIAL_SLIDER_VALUE);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const zoom = sliderToZoom(zoomSlider);
  const rotation = sliderToRotation(rotationSlider);

  const handleCropComplete = React.useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const resetAdjustments = React.useCallback(() => {
    setZoomSlider(INITIAL_SLIDER_VALUE);
    setRotationSlider(INITIAL_SLIDER_VALUE);
    setCrop(INITIAL_CROP);
  }, []);

  const handleCancel = React.useCallback(() => {
    resetAdjustments();
    onCancel?.();
  }, [onCancel, resetAdjustments]);

  const handleSave = React.useCallback(async () => {
    if (!croppedAreaPixels || !onSave) {
      return;
    }

    setIsSaving(true);
    try {
      const croppedImageBlob = await getCroppedImageBlob(imageSrc, croppedAreaPixels, rotation);
      if (!croppedImageBlob) {
        return;
      }

      await onSave({ croppedAreaPixels, croppedImageBlob });
    } finally {
      setIsSaving(false);
    }
  }, [croppedAreaPixels, imageSrc, onSave, rotation]);

  return {
    crop,
    zoom,
    rotation,
    zoomSlider,
    rotationSlider,
    isSaving,
    canSave: Boolean(croppedAreaPixels),
    setCrop,
    setZoomSlider,
    setRotationSlider,
    handleCropComplete,
    handleCancel,
    handleSave,
  };
}
