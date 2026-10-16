"use client";

import { MediaPreview } from "@/components/common/image-preview/media-preview/media-preview";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useMyCharacters } from "@/hooks/use-my-characters";
import { cn } from "@/lib/utils";

import {
  formatGeneratePreviewPostedAt,
  getGeneratePreviewMetadata,
  resolveGeneratedMediaCharacter,
} from "../../_lib/generate-media";
import { GENERATE_PREVIEW_CREATE_VIDEO_LABEL, type GenerateGalleryItem } from "../_lib/constants";
import {
  canEditGenerateItem,
  canRemixGenerateItem,
  type GeneratePreviewAction,
} from "../_lib/preview-actions";

type GeneratePreviewDialogProps = {
  open: boolean;
  items: GenerateGalleryItem[];
  selectedIndex: number | null;
  selectedItem: GenerateGalleryItem | null;
  onOpenChange: (open: boolean) => void;
  onSelectedIndexChange: (index: number) => void;
  onClose: () => void;
  onPreviewAction?: (action: GeneratePreviewAction, item: GenerateGalleryItem) => void;
};

export function GeneratePreviewDialog({
  open,
  items,
  selectedIndex,
  selectedItem,
  onOpenChange,
  onSelectedIndexChange,
  onClose,
  onPreviewAction,
}: GeneratePreviewDialogProps) {
  const { data: myCharacters } = useMyCharacters();
  const previewCharacter = resolveGeneratedMediaCharacter(selectedItem, myCharacters?.items);

  const handleAction = (action: GeneratePreviewAction) => {
    if (!selectedItem) return;
    onPreviewAction?.(action, selectedItem);
  };

  return (
    <Dialog forceDialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        freezeBackdrop
        onOpenAutoFocus={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
        overlayClassName="bg-black/60 supports-backdrop-filter:backdrop-blur-md"
        className={cn(
          "border-0 bg-transparent p-0 shadow-none ring-0 outline-none",
          "fixed inset-0 top-0 left-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 items-center justify-center",
          "overflow-x-hidden overflow-y-auto rounded-none sm:max-w-none md:max-w-none",
          "scrollbar-gutter-stable",
          "data-open:zoom-in-100 data-closed:zoom-out-100",
          "px-0 py-0 md:px-6 md:py-6",
        )}
      >
        <DialogTitle className="sr-only">Media preview</DialogTitle>
        <DialogDescription className="sr-only">
          Preview generated media with details, actions, and thumbnail navigation.
        </DialogDescription>

        {selectedIndex !== null ? (
          <div className="mx-auto flex h-full w-full max-w-[1260px] items-center justify-center has-data-[image-expanded=true]:max-w-none">
            <MediaPreview
              items={items}
              selectedIndex={selectedIndex}
              onSelectedIndexChange={onSelectedIndexChange}
              prompt={selectedItem?.prompt ?? ""}
              metadata={getGeneratePreviewMetadata(selectedItem)}
              postedAt={formatGeneratePreviewPostedAt(selectedItem?.createdAt)}
              modelStatus={previewCharacter ? "ai-model" : "no-ai-model"}
              modelTitle={previewCharacter?.name}
              modelImageSrc={previewCharacter?.imageSrc ?? ""}
              createVideoLabel={GENERATE_PREVIEW_CREATE_VIDEO_LABEL}
              remixDisabled={!canRemixGenerateItem(selectedItem)}
              editDisabled={!canEditGenerateItem(selectedItem)}
              onEdit={() => handleAction("edit")}
              onRemix={() => handleAction("remix")}
              onCreateVideo={() => handleAction("animate")}
              onExtendVideo={() => handleAction("extend")}
              onQuickAction={(value) => {
                if (value === "edit" || value === "remix" || value === "animate") {
                  handleAction(value);
                }
              }}
              onClose={onClose}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
