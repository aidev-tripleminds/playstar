"use client";

import Cropper, { type Area, type Point } from "react-easy-crop";

import { AI_ADJUST_BANNER_ASPECT, MAX_ZOOM, MIN_ZOOM } from "@/lib/constants";

type BannerCropperProps = {
  imageSrc: string;
  crop: Point;
  zoom: number;
  rotation: number;
  aspect?: number;
  onCropChange: (crop: Point) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
};

export function BannerCropper({
  imageSrc,
  crop,
  zoom,
  rotation,
  aspect = AI_ADJUST_BANNER_ASPECT,
  onCropChange,
  onCropComplete,
}: BannerCropperProps) {
  return (
    <div className="relative h-[220px] w-full overflow-hidden rounded-[16px] bg-black sm:h-[320px] md:h-[360px]">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        rotation={rotation}
        aspect={aspect}
        cropShape="rect"
        showGrid={false}
        objectFit="horizontal-cover"
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        onCropChange={onCropChange}
        onCropComplete={onCropComplete}
        classes={{
          containerClassName: "!absolute inset-0",
        }}
        style={{
          containerStyle: {
            position: "absolute",
            inset: 0,
          },
          cropAreaStyle: {
            border: "2px solid #fafafa",
            borderRadius: 0,
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.55)",
          },
        }}
      />
    </div>
  );
}
