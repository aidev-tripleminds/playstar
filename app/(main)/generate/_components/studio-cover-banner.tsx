"use client";

import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const COVER_VIDEO_SRC = "/assets/playright/banner.mp4";
const COVER_POSTER_SRC = "/assets/playright/pic1.webp";

type StudioCoverBannerProps = {
  className?: string;
  onGenerateClick?: () => void;
};

export function StudioCoverBanner({ className, onGenerateClick }: StudioCoverBannerProps) {
  return (
    <section
      data-slot="studio-cover"
      className={cn(
        "border-border-strong relative isolate min-h-[240px] w-full shrink-0 overflow-hidden rounded-[28px] border md:min-h-[300px]",
        className,
      )}
    >
      <video
        className="absolute inset-0 size-full object-cover"
        src={COVER_VIDEO_SRC}
        poster={COVER_POSTER_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,6,8,0.82)_0%,rgba(8,6,8,0.45)_46%,rgba(8,6,8,0.12)_100%)]"
      />

      <div className="relative z-10 flex max-w-[680px] flex-col justify-center gap-3 px-5 py-8 md:px-10 md:py-12">
        <h1 className="text-tooltip-text text-[22px] leading-[1.15] font-extrabold tracking-[-0.03em] uppercase md:text-[34px] md:leading-[1.12]">
          Upload any photo of her and get a hot 18+ video in just 30 seconds{" "}
          <span aria-hidden>🔥</span>
        </h1>
        <p className="text-sm leading-5 text-white/85 md:text-base">
          Your first generation is completely free. Just try it!
        </p>
        <button
          type="button"
          onClick={onGenerateClick}
          className="mt-1 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#ff4d6a] shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:scale-[1.03]"
        >
          <Sparkles className="size-4" aria-hidden />
          Generate for Free now
        </button>
      </div>
    </section>
  );
}
