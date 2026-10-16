"use client";

import Image from "next/image";
import * as React from "react";

import { MediaPreview } from "@/components/common/image-preview/media-preview/media-preview";
import type { MediaPreviewItem } from "@/components/common/image-preview/media-preview/types";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { RightPanelMediaItem } from "../types";

export type RightPanelMediaGridProps = {
  items: readonly RightPanelMediaItem[];
  modelTitle?: string;
  modelImageSrc?: string;
  onMediaSelect?: (index: number) => void;
};

export function RightPanelMediaGrid({
  items,
  modelTitle,
  modelImageSrc,
  onMediaSelect,
}: RightPanelMediaGridProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const previewItems = React.useMemo<MediaPreviewItem[]>(
    () =>
      items.map((item) => ({
        id: item.id,
        src: item.src,
        alt: item.alt,
        kind: "image",
      })),
    [items],
  );

  const handleOpen = (index: number) => {
    setSelectedIndex(index);
    onMediaSelect?.(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <ul data-slot="right-panel-media-grid" className="grid w-full grid-cols-2 gap-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => handleOpen(index)}
              aria-label={`Open media ${index + 1}`}
              className={cn(
                "relative aspect-square w-full overflow-hidden rounded-lg",
                "bg-tooltip-default-bg focus-visible:ring-border-focus outline-none focus-visible:ring-2",
              )}
            >
              <Image src={item.src} alt="" fill sizes="144px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <Dialog
        forceDialog
        open={selectedIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          freezeBackdrop
          onOpenAutoFocus={(event) => event.preventDefault()}
          overlayClassName="bg-black/60 supports-backdrop-filter:backdrop-blur-md"
          className={cn(
            "border-0 bg-transparent p-0 shadow-none ring-0 outline-none",
            "fixed inset-0 top-0 left-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 items-center justify-center",
            "overflow-x-hidden overflow-y-auto rounded-none sm:max-w-none md:max-w-none",
            "data-open:zoom-in-100 data-closed:zoom-out-100",
            "px-0 py-0 md:px-6 md:py-6",
          )}
        >
          <DialogTitle className="sr-only">Media preview</DialogTitle>
          <DialogDescription className="sr-only">
            Preview conversation media and move to the next or previous item.
          </DialogDescription>
          {selectedIndex !== null ? (
            <div className="mx-auto flex h-full w-full max-w-[1260px] items-center justify-center">
              <MediaPreview
                items={previewItems}
                selectedIndex={selectedIndex}
                onSelectedIndexChange={setSelectedIndex}
                prompt=""
                metadata={[]}
                postedAt=""
                modelStatus={modelImageSrc ? "ai-model" : "no-ai-model"}
                modelTitle={modelTitle}
                modelImageSrc={modelImageSrc}
                onClose={handleClose}
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
