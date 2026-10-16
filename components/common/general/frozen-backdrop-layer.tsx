"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const MODAL_PORTAL_SELECTOR = '[data-slot="dialog-portal"], [data-slot="drawer-portal"]';
const DEFAULT_CAPTURE_TARGET = '[data-slot="main-layout"]';
const MAIN_SCROLL_SELECTOR = '[data-slot="main-layout-main"]';

type PausedVideoState = {
  video: HTMLVideoElement;
  wasPaused: boolean;
};

type FrozenBackdropLayerProps = {
  captureTarget?: string;
  blurClassName?: string;
  tintClassName?: string;
  className?: string;
};

function pauseBackgroundVideos(): PausedVideoState[] {
  const pausedStates: PausedVideoState[] = [];

  document.querySelectorAll("video").forEach((video) => {
    if (!(video instanceof HTMLVideoElement) || video.closest(MODAL_PORTAL_SELECTOR)) {
      return;
    }

    pausedStates.push({ video, wasPaused: video.paused });
    video.pause();
  });

  return pausedStates;
}

function resumeBackgroundVideos(pausedStates: PausedVideoState[]) {
  pausedStates.forEach(({ video, wasPaused }) => {
    if (wasPaused) {
      return;
    }

    void video.play().catch(() => {
      // Autoplay may be blocked by the browser.
    });
  });
}

function replaceVideosWithSnapshots(originalRoot: ParentNode, cloneRoot: ParentNode) {
  const originalVideos = originalRoot.querySelectorAll("video");
  const cloneVideos = cloneRoot.querySelectorAll("video");

  originalVideos.forEach((video, index) => {
    const cloneVideo = cloneVideos[index];

    if (!(video instanceof HTMLVideoElement) || !(cloneVideo instanceof HTMLVideoElement)) {
      return;
    }

    const rect = video.getBoundingClientRect();

    if (video.readyState < 2 || rect.width === 0 || rect.height === 0) {
      cloneVideo.pause();
      return;
    }

    const canvas = document.createElement("canvas");
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      cloneVideo.pause();
      return;
    }

    let dataUrl: string;

    try {
      context.drawImage(video, 0, 0, width, height);
      dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    } catch {
      cloneVideo.pause();
      return;
    }

    const snapshot = document.createElement("img");
    snapshot.src = dataUrl;
    snapshot.alt = "";
    snapshot.className = cloneVideo.className;
    snapshot.setAttribute("style", cloneVideo.getAttribute("style") ?? "");

    cloneVideo.replaceWith(snapshot);
  });
}

function syncScrollPosition(source: HTMLElement, clone: HTMLElement) {
  const sourceScroll = source.querySelector<HTMLElement>(MAIN_SCROLL_SELECTOR);
  const cloneScroll = clone.querySelector<HTMLElement>(MAIN_SCROLL_SELECTOR);

  if (!sourceScroll || !cloneScroll) {
    return;
  }

  cloneScroll.scrollTop = sourceScroll.scrollTop;
  cloneScroll.scrollLeft = sourceScroll.scrollLeft;
}

export function FrozenBackdropLayer({
  captureTarget = DEFAULT_CAPTURE_TARGET,
  blurClassName = "blur-lg",
  tintClassName = "bg-black/20",
  className,
}: FrozenBackdropLayerProps) {
  const blurHostRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const host = blurHostRef.current;

    if (!host) {
      return;
    }

    const source = document.querySelector<HTMLElement>(captureTarget);

    if (!source) {
      return;
    }

    const pausedVideos = pauseBackgroundVideos();
    const sourceRect = source.getBoundingClientRect();
    const clone = source.cloneNode(true) as HTMLElement;

    clone.setAttribute("aria-hidden", "true");
    syncScrollPosition(source, clone);
    replaceVideosWithSnapshots(source, clone);

    clone.style.pointerEvents = "none";
    clone.style.position = "fixed";
    clone.style.top = `${sourceRect.top}px`;
    clone.style.left = `${sourceRect.left}px`;
    clone.style.width = `${sourceRect.width}px`;
    clone.style.height = `${sourceRect.height}px`;
    clone.style.margin = "0";
    clone.style.transform = "none";

    host.appendChild(clone);

    return () => {
      host.replaceChildren();
      resumeBackgroundVideos(pausedVideos);
    };
  }, [captureTarget]);

  return (
    <div
      aria-hidden
      data-slot="frozen-backdrop-layer"
      className={cn("bg-dialog-bg pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        ref={blurHostRef}
        className={cn(
          "absolute inset-0 origin-center scale-110 transform-gpu will-change-[filter]",
          blurClassName,
        )}
      />
      <div className={cn("absolute inset-0", tintClassName)} />
    </div>
  );
}
