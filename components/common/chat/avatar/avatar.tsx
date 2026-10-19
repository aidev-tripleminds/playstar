import Image from "next/image";
import * as React from "react";

import { dummyImage } from "@/lib/dummy-images";
import { cn } from "@/lib/utils";

export type AvatarFrameVariant = "listening" | "speaking";

export type CallAvatarProps = {
  /** @deprecated Decorative SVG frame is replaced by the gradient ring (`frameVariant`). */
  frameSrc?: string;
  src?: string;
  alt?: string;
  className?: string;
  /** Decorative gradient ring around the circular photo. Hidden while calling (Figma). */
  showFrame?: boolean;
  /**
   * Gradient ring tone for the active-call voice phase.
   * - `listening` (default) — pink 500 → 600 → 700
   * - `speaking` — #00C975 → #00A764
   */
  frameVariant?: AvatarFrameVariant;
};

const FRAME_GRADIENT: Record<AvatarFrameVariant, string> = {
  listening: "var(--button-pink-primary-gradient)",
  speaking: "linear-gradient(180deg, #00C975 0%, #00A764 100%)",
};

export function Avatar({
  frameSrc = "/assets/pics/rectangle.svg",
  src = dummyImage(17),
  alt = "Call avatar",
  className,
  showFrame = true,
  frameVariant = "listening",
}: CallAvatarProps) {
  return (
    <div
      data-slot="call-avatar"
      data-frame-variant={showFrame ? frameVariant : undefined}
      className={cn(
        "relative isolate flex w-full flex-col items-center justify-center gap-[10px]",
        className,
      )}
    >
      {/* Always reserve 200×200 so hiding the frame doesn't shift layout. */}
      <div
        className={cn(
          "relative z-0 flex h-[200px] w-[200px] shrink-0 items-center justify-center rounded-full",
          showFrame && "p-[5px] transition-[background] duration-300",
        )}
        style={showFrame ? { backgroundImage: FRAME_GRADIENT[frameVariant] } : undefined}
      >
        <div className="relative z-10 h-[190px] w-[190px] shrink-0 overflow-hidden rounded-full bg-[#171717]">
          <Image src={src} alt={alt} fill sizes="190px" className="object-cover" />
        </div>
      </div>
    </div>
  );
}

export default Avatar;
